import { readFileSync } from "fs";
import path from "path";
import { Pool, type PoolClient } from "pg";
import type { BankDetails, GalleryExtra, HeroCopy, LgaEntry, MailSend, MembershipPlan, PartnerEntry, SiteImages, SiteText, Submission, Subscriber } from "./site-types";

export type StoredContent = {
  reportedMembers?: number;
  establishedYear?: number;
  text?: Partial<SiteText>;
  heroes?: HeroCopy[];
  images?: Partial<SiteImages>;
  galleryExtra?: GalleryExtra[];
  lgas?: LgaEntry[];
  partnerships?: PartnerEntry[];
  plans?: MembershipPlan[];
  bank?: Partial<BankDetails>;
};

let pool: Pool | null = null;
let schemaReady: Promise<void> | null = null;

export function databaseConfigured() {
  return Boolean(process.env.DATABASE_URL);
}

function getPool() {
  if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL is not set. Use the Supabase session pooler connection string.");
  if (!pool) {
    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      max: 5,
      ssl: { rejectUnauthorized: false }
    });
  }
  return pool;
}

export function ensureSchema() {
  if (!schemaReady) {
    const sql = readFileSync(path.join(process.cwd(), "sql", "schema.sql"), "utf8");
    schemaReady = getPool()
      .query(sql)
      .then(() => undefined)
      .catch((error) => {
        schemaReady = null;
        throw error;
      });
  }
  return schemaReady;
}

async function withTransaction<T>(task: (client: PoolClient) => Promise<T>) {
  await ensureSchema();
  const client = await getPool().connect();
  try {
    await client.query("begin");
    const result = await task(client);
    await client.query("commit");
    return result;
  } catch (error) {
    await client.query("rollback");
    throw error;
  } finally {
    client.release();
  }
}

function asPlans(value: unknown): MembershipPlan[] | undefined {
  if (Array.isArray(value)) return value as MembershipPlan[];
  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value) as unknown;
      return Array.isArray(parsed) ? (parsed as MembershipPlan[]) : undefined;
    } catch {
      return undefined;
    }
  }
  return undefined;
}

function asObject<T>(value: unknown): T {
  if (typeof value === "string") return JSON.parse(value) as T;
  return (value || {}) as T;
}

export async function dbLoadContent(): Promise<StoredContent | null> {
  await ensureSchema();
  const settings = await getPool().query<{
    reported_members: number;
    established_year: number;
    text: Partial<SiteText>;
    heroes: HeroCopy[];
    images: Partial<SiteImages>;
    bank: Partial<BankDetails>;
    plans: MembershipPlan[] | null;
  }>("select reported_members, established_year, text, heroes, images, bank, plans from site_settings where id = 1");
  if (!settings.rowCount) return null;
  const row = settings.rows[0];
  const [lgas, partnerships, galleryExtra] = await Promise.all([
    getPool().query<LgaEntry>("select name, members, coordinator, phone from lgas order by position"),
    getPool().query<PartnerEntry>("select id, name, image from partnerships order by position"),
    getPool().query<GalleryExtra>("select id, image, caption, category from gallery_images order by position")
  ]);
  return {
    reportedMembers: row.reported_members,
    establishedYear: row.established_year,
    text: asObject(row.text),
    heroes: asObject<HeroCopy[]>(row.heroes),
    images: asObject(row.images),
    bank: asObject(row.bank),
    plans: asPlans(row.plans),
    lgas: lgas.rows,
    partnerships: partnerships.rows,
    galleryExtra: galleryExtra.rows
  };
}

export async function dbSaveContent(stored: StoredContent) {
  const lgas = stored.lgas || [];
  const partnerships = stored.partnerships || [];
  const gallery = stored.galleryExtra || [];
  await withTransaction(async (client) => {
    await client.query(
      `insert into site_settings (id, reported_members, established_year, text, heroes, images, bank, plans, updated_at)
       values (1, $1, $2, $3::jsonb, $4::jsonb, $5::jsonb, $6::jsonb, $7::jsonb, now())
       on conflict (id) do update set
         reported_members = excluded.reported_members,
         established_year = excluded.established_year,
         text = excluded.text,
         heroes = excluded.heroes,
         images = excluded.images,
         bank = excluded.bank,
         plans = excluded.plans,
         updated_at = now()`,
      [
        stored.reportedMembers ?? 20000,
        stored.establishedYear ?? 2022,
        JSON.stringify(stored.text || {}),
        JSON.stringify(stored.heroes || []),
        JSON.stringify(stored.images || {}),
        JSON.stringify(stored.bank || {}),
        stored.plans ? JSON.stringify(stored.plans) : null
      ]
    );
    await client.query("delete from lgas");
    if (lgas.length) {
      await client.query(
        `insert into lgas (name, members, coordinator, phone, position)
         select * from unnest($1::text[], $2::text[], $3::text[], $4::text[], $5::int[])`,
        [lgas.map((item) => item.name), lgas.map((item) => item.members), lgas.map((item) => item.coordinator), lgas.map((item) => item.phone), lgas.map((_, index) => index)]
      );
    }
    await client.query("delete from partnerships");
    if (partnerships.length) {
      await client.query(
        `insert into partnerships (id, name, image, position)
         select * from unnest($1::text[], $2::text[], $3::text[], $4::int[])`,
        [partnerships.map((item) => item.id), partnerships.map((item) => item.name), partnerships.map((item) => item.image), partnerships.map((_, index) => index)]
      );
    }
    await client.query("delete from gallery_images");
    if (gallery.length) {
      await client.query(
        `insert into gallery_images (id, image, caption, category, position)
         select * from unnest($1::text[], $2::text[], $3::text[], $4::text[], $5::int[])`,
        [gallery.map((item) => item.id), gallery.map((item) => item.image), gallery.map((item) => item.caption), gallery.map((item) => item.category), gallery.map((_, index) => index)]
      );
    }
  });
}

function submissionFromRow(row: { id: string; type: Submission["type"]; status: Submission["status"]; data: Record<string, string>; payment_screenshot: string | null; payment_confirmed?: boolean | null; created_at: Date | string }): Submission {
  return {
    id: row.id,
    type: row.type,
    status: row.status,
    data: asObject(row.data),
    paymentScreenshot: row.payment_screenshot || undefined,
    paymentConfirmed: Boolean(row.payment_confirmed),
    createdAt: new Date(row.created_at).toISOString()
  };
}

export async function dbInsertSubmission(submission: Submission) {
  await ensureSchema();
  const client = await getPool().connect();
  try {
    await client.query("begin");
    await client.query(
      `insert into submissions (id, type, status, data, payment_screenshot, payment_confirmed, created_at)
       values ($1, $2, $3, $4::jsonb, $5, $6, $7)`,
      [submission.id, submission.type, submission.status, JSON.stringify(submission.data), submission.paymentScreenshot || null, Boolean(submission.paymentConfirmed), submission.createdAt]
    );
    await client.query(
      `delete from submissions where id in (
         select id from submissions order by created_at desc offset 2000
       )`
    );
    await client.query("commit");
  } catch (error) {
    await client.query("rollback");
    throw error;
  } finally {
    client.release();
  }
}

export async function dbListSubmissions() {
  await ensureSchema();
  const result = await getPool().query<{
    id: string;
    type: Submission["type"];
    status: Submission["status"];
    data: Record<string, string>;
    payment_screenshot: string | null;
    payment_confirmed: boolean | null;
    created_at: Date;
  }>("select id, type, status, data, payment_screenshot, payment_confirmed, created_at from submissions order by created_at desc limit 2000");
  return result.rows.map(submissionFromRow);
}

export async function dbPatchSubmission(id: string, patch: { status?: Submission["status"]; paymentScreenshot?: string; paymentConfirmed?: boolean }) {
  await ensureSchema();
  const current = await getPool().query("select id from submissions where id = $1", [id]);
  if (!current.rowCount) throw new Error("Submission not found.");
  const result = await getPool().query<{
    id: string;
    type: Submission["type"];
    status: Submission["status"];
    data: Record<string, string>;
    payment_screenshot: string | null;
    payment_confirmed: boolean | null;
    created_at: Date;
  }>(
    `update submissions
     set status = coalesce($2, status),
         payment_screenshot = case when $3 then $4 else payment_screenshot end,
         payment_confirmed = coalesce($5, payment_confirmed)
     where id = $1
     returning id, type, status, data, payment_screenshot, payment_confirmed, created_at`,
    [id, patch.status || null, patch.paymentScreenshot !== undefined, patch.paymentScreenshot || null, patch.paymentConfirmed ?? null]
  );
  return submissionFromRow(result.rows[0]);
}

export async function dbDeleteSubmission(id: string) {
  await ensureSchema();
  await getPool().query("delete from submissions where id = $1", [id]);
}

export async function dbInsertSubscriber(subscriber: Subscriber) {
  await ensureSchema();
  await getPool().query(
    `insert into subscribers (id, email, created_at) values ($1, $2, $3)
     on conflict (email) do nothing`,
    [subscriber.id, subscriber.email, subscriber.createdAt]
  );
}

export async function dbListSubscribers() {
  await ensureSchema();
  const result = await getPool().query<{ id: string; email: string; created_at: Date }>(
    "select id, email, created_at from subscribers order by created_at desc limit 10000"
  );
  return result.rows.map((row) => ({ id: row.id, email: row.email, createdAt: new Date(row.created_at).toISOString() }));
}

export async function dbDeleteSubscriber(email: string) {
  await ensureSchema();
  await getPool().query("delete from subscribers where email = $1", [email]);
}

export async function dbListMailSends() {
  await ensureSchema();
  const result = await getPool().query<{ id: string; subject: string; recipient_count: number; sent_at: Date }>(
    "select id, subject, recipient_count, sent_at from mail_sends order by sent_at desc limit 30"
  );
  return result.rows.map((row) => ({ id: row.id, subject: row.subject, count: row.recipient_count, at: new Date(row.sent_at).toISOString() }));
}

export async function dbInsertMailSend(entry: MailSend) {
  await ensureSchema();
  const client = await getPool().connect();
  try {
    await client.query("begin");
    await client.query("insert into mail_sends (id, subject, recipient_count, sent_at) values ($1, $2, $3, $4)", [entry.id, entry.subject, entry.count, entry.at]);
    await client.query(
      `delete from mail_sends where id not in (
         select id from mail_sends order by sent_at desc limit 30
       )`
    );
    await client.query("commit");
  } catch (error) {
    await client.query("rollback");
    throw error;
  } finally {
    client.release();
  }
}
