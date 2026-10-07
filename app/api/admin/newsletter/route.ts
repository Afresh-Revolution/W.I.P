import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin";
import { listMailSends, listSubmissions, listSubscribers, logMailSend, removeSubscriber } from "@/lib/cms";
import { sendBulkEmail } from "@/lib/mail";

export const dynamic = "force-dynamic";

function emailsFrom(values: string[]) {
  return values.map((value) => value.trim().toLowerCase()).filter((value) => value.includes("@"));
}

export async function GET() {
  const denied = await requireAdmin();
  if (denied) return denied;
  const [subscribers, submissions, sends] = await Promise.all([listSubscribers(), listSubmissions(), listMailSends()]);
  const submissionEmails = emailsFrom(submissions.map((item) => item.data.email || item.data["email-address"] || ""));
  return NextResponse.json({ subscribers, submissionEmails: [...new Set(submissionEmails)], sends });
}

export async function POST(request: Request) {
  const denied = await requireAdmin();
  if (denied) return denied;
  try {
    const body = (await request.json()) as { subject?: string; message?: string; includeSubmissions?: boolean };
    const subject = String(body.subject || "").trim().slice(0, 140);
    const message = String(body.message || "").trim().slice(0, 20000);
    if (subject.length < 3) return NextResponse.json({ error: "Add a subject line." }, { status: 400 });
    if (message.length < 8) return NextResponse.json({ error: "Write the update you want to send." }, { status: 400 });
    const subscribers = await listSubscribers();
    const recipients = subscribers.map((item) => item.email);
    if (body.includeSubmissions) {
      const submissions = await listSubmissions();
      recipients.push(...emailsFrom(submissions.map((item) => item.data.email || item.data["email-address"] || "")));
    }
    const sent = await sendBulkEmail(recipients, subject, message);
    await logMailSend(subject, sent);
    return NextResponse.json({ sent });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Could not send the email.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function DELETE(request: Request) {
  const denied = await requireAdmin();
  if (denied) return denied;
  const body = (await request.json().catch(() => null)) as { email?: string } | null;
  if (!body?.email) return NextResponse.json({ error: "Missing email address." }, { status: 400 });
  await removeSubscriber(body.email);
  return NextResponse.json({ ok: true });
}
