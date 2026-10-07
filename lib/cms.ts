import { unstable_noStore as noStore } from "next/cache";
import { gallery, heroSlides, images, lgas } from "./data";
import { originalCopy } from "./copy";
import type { BankDetails, GalleryExtra, HeroCopy, LgaEntry, MailSend, PartnerEntry, PublicContent, PublicHero, SiteImages, SiteText, Submission, SubmissionType, Subscriber } from "./site-types";
import {
  databaseConfigured,
  dbDeleteSubmission,
  dbDeleteSubscriber,
  dbInsertMailSend,
  dbInsertSubmission,
  dbInsertSubscriber,
  dbListMailSends,
  dbListSubmissions,
  dbListSubscribers,
  dbLoadContent,
  dbPatchSubmission,
  dbSaveContent
} from "./db";
import { readDoc, updateDoc, writeDoc } from "./store";

const slideImages = ["hero", "gathering", "event", "community"] as const;
const submissionTypes = new Set<SubmissionType>(["membership", "contact", "partner", "interest"]);

const defaultText: SiteText = {
  announcement: originalCopy.announcement,
  mission:
    "To mobilise, empower and equip Plateau women through leadership training, mentorship, voter education and empowerment programmes so they can participate meaningfully in governance, peacebuilding and community development.",
  vision:
    "A Plateau State where women vote and are voted for; where women are skilled in leadership, respected, protected from abuse and economically empowered as active partners in peace and democracy.",
  introTitle: "A Movement Built Around Women’s Voices",
  introText: "Women in Politics Initiative is a non-partisan platform committed to creating opportunities for women to participate meaningfully in democracy, governance and public leadership.",
  introBody: "We meet women where they are—across professions, educational backgrounds, faiths, communities and generations—and help build the knowledge, networks and confidence to take part.",
  reachTitle: originalCopy.reachTitle,
  reachText:
    "From Bokkos to Jos, Mangu, Pankshin, Langtang and communities across Plateau State, WIPI is building a connected movement of women participating in leadership, governance and community development.",
  reachPageTitle: originalCopy.reachPageTitle,
  aboutToday: originalCopy.aboutToday,
  founderName: "Hajara Yunana",
  founderRole: "Convener & President",
  founderQuote: "Every woman deserves the knowledge, confidence and opportunity to participate in shaping her community’s future.",
  founderBio: "Hajara leads WIPI with a vision to build a sustainable platform where women are informed, organised, protected and equipped to participate meaningfully.",
  newsletterTitle: "Get updates from WIPI",
  newsletterText: "Leadership, programmes and community news.",
  contactAddress: "No. 24 Yakubu Gowon Way\nJos, Plateau State, Nigeria",
  contactPhone: "+234 803 000 0000",
  contactEmail: "info@wipiplateau.org",
  membershipEmail: "membership@wipiplateau.org"
};

const defaultLgas = (): LgaEntry[] =>
  lgas.map((name) => ({
    name,
    members: "1,240",
    coordinator: "Aisha Pam",
    phone: "+234 803 000 0000"
  }));

const defaultPartners = (): PartnerEntry[] =>
  ["Government", "Civil society", "Development", "Education", "Community"].map((name) => ({
    id: name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
    name,
    image: ""
  }));

const defaultBank = (): BankDetails => ({
  bankName: "",
  accountName: "",
  accountNumber: "",
  instructions: "Transfer the membership contribution, then upload a screenshot of the payment so the team can confirm it."
});

function clip(value: unknown, max: number) {
  return String(value ?? "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, max);
}

function clipBlock(value: unknown, max: number) {
  return String(value ?? "")
    .replace(/\r/g, "")
    .trim()
    .slice(0, max);
}

function safeUrl(value: unknown) {
  const url = String(value ?? "").trim();
  if (!url) return "";
  if (url.startsWith("/uploads/") || url.startsWith("/images/") || url.startsWith("/logos/") || url.startsWith("/maps/")) return url;
  try {
    const parsed = new URL(url);
    if (parsed.protocol === "https:" || parsed.protocol === "http:") return url;
  } catch {
    return "";
  }
  return "";
}

function resolveStoredImage(src: string, slots: SiteImages) {
  const match = Object.entries(images).find(([, value]) => value === src);
  if (!match) return src;
  return slots[match[0] as keyof SiteImages] || src;
}

function defaultHeroes(): HeroCopy[] {
  return heroSlides.map((slide) => ({
    label: slide.label,
    title: [slide.title[0], slide.title[1]],
    text: slide.text
  }));
}

function defaultImages(): SiteImages {
  return { ...images };
}

type StoredContent = {
  reportedMembers?: number;
  establishedYear?: number;
  text?: Partial<SiteText>;
  heroes?: HeroCopy[];
  images?: Partial<SiteImages>;
  galleryExtra?: GalleryExtra[];
  lgas?: LgaEntry[];
  partnerships?: PartnerEntry[];
  bank?: Partial<BankDetails>;
};

export function presentContent(saved: StoredContent | null): PublicContent {
  const text = { ...defaultText, ...saved?.text };
  const slots = { ...defaultImages(), ...saved?.images };
  Object.keys(slots).forEach((key) => {
    const slot = key as keyof SiteImages;
    slots[slot] = safeUrl(slots[slot]) || defaultImages()[slot];
  });
  const members = Number(saved?.reportedMembers);
  const year = Number(saved?.establishedYear);
  const heroes: PublicHero[] = defaultHeroes().map((hero, index) => {
    const custom = saved?.heroes?.[index];
    const title = custom?.title;
    return {
      label: clip(custom?.label, 160) || hero.label,
      title: [clip(title?.[0], 140) || hero.title[0], clip(title?.[1], 140) || hero.title[1]],
      text: clip(custom?.text, 700) || hero.text,
      image: slots[slideImages[index]],
      primary: [heroSlides[index].primary[0], heroSlides[index].primary[1]],
      secondary: [heroSlides[index].secondary[0], heroSlides[index].secondary[1]]
    };
  });
  const galleryExtra = (saved?.galleryExtra || [])
    .map((item) => ({
      id: clip(item.id, 80),
      image: safeUrl(item.image),
      caption: clip(item.caption, 160),
      category: clip(item.category, 40) || "Community"
    }))
    .filter((item) => item.id && item.image)
    .slice(0, 80);
  const lgaList = Array.isArray(saved?.lgas)
    ? saved.lgas
        .map((item) => ({
          name: clip(item.name, 80),
          members: clip(item.members, 40),
          coordinator: clip(item.coordinator, 80),
          phone: clip(item.phone, 40)
        }))
        .filter((item) => item.name)
    : defaultLgas();
  const partnerships = Array.isArray(saved?.partnerships)
    ? saved.partnerships
        .map((item) => ({
          id: clip(item.id, 80) || crypto.randomUUID(),
          name: clip(item.name, 80),
          image: safeUrl(item.image)
        }))
        .filter((item) => item.name)
        .slice(0, 40)
    : defaultPartners();

  return {
    reportedMembers: Number.isFinite(members) && members >= 0 && members < 100_000_000 ? Math.round(members) : 20000,
    establishedYear: Number.isFinite(year) && year >= 1900 && year <= 2100 ? Math.round(year) : 2022,
    text: {
      announcement: clip(text.announcement, 240) || defaultText.announcement,
      mission: clip(text.mission, 800) || defaultText.mission,
      vision: clip(text.vision, 800) || defaultText.vision,
      introTitle: clip(text.introTitle, 160) || defaultText.introTitle,
      introText: clip(text.introText, 500) || defaultText.introText,
      introBody: clip(text.introBody, 700) || defaultText.introBody,
      reachTitle: clip(text.reachTitle, 160) || defaultText.reachTitle,
      reachText: clip(text.reachText, 700) || defaultText.reachText,
      reachPageTitle: clip(text.reachPageTitle, 160) || defaultText.reachPageTitle,
      aboutToday: clip(text.aboutToday, 700) || defaultText.aboutToday,
      founderName: clip(text.founderName, 80) || defaultText.founderName,
      founderRole: clip(text.founderRole, 80) || defaultText.founderRole,
      founderQuote: clip(text.founderQuote, 400) || defaultText.founderQuote,
      founderBio: clip(text.founderBio, 500) || defaultText.founderBio,
      newsletterTitle: clip(text.newsletterTitle, 80) || defaultText.newsletterTitle,
      newsletterText: clip(text.newsletterText, 180) || defaultText.newsletterText,
      contactAddress: clipBlock(text.contactAddress, 240) || defaultText.contactAddress,
      contactPhone: clip(text.contactPhone, 40) || defaultText.contactPhone,
      contactEmail: clip(text.contactEmail, 120) || defaultText.contactEmail,
      membershipEmail: clip(text.membershipEmail, 120) || defaultText.membershipEmail
    },
    heroes,
    images: slots,
    gallery: [
      ...gallery.map((item) => ({ ...item, image: resolveStoredImage(item.image, slots) })),
      ...galleryExtra.map(({ category, caption, image }) => ({ category, caption, image }))
    ],
    galleryExtra,
    lgas: lgaList.length ? lgaList : defaultLgas(),
    partnerships,
    bank: {
      bankName: clip(saved?.bank?.bankName, 80),
      accountName: clip(saved?.bank?.accountName, 120),
      accountNumber: clip(saved?.bank?.accountNumber, 30).replace(/[^\d\s]/g, ""),
      instructions: clipBlock(saved?.bank?.instructions ?? defaultBank().instructions, 600)
    }
  };
}

function toStored(content: PublicContent): StoredContent {
  const presented = presentContent(content);
  return {
    reportedMembers: presented.reportedMembers,
    establishedYear: presented.establishedYear,
    text: presented.text,
    heroes: presented.heroes.map(({ label, title, text }) => ({ label, title, text })),
    images: presented.images,
    galleryExtra: presented.galleryExtra,
    lgas: presented.lgas,
    partnerships: presented.partnerships,
    bank: presented.bank
  };
}

export async function getPublicContent() {
  noStore();
  try {
    const saved = databaseConfigured() ? await dbLoadContent() : await readDoc<StoredContent>("content");
    return presentContent(saved);
  } catch {
    return presentContent(null);
  }
}

export async function savePublicContent(input: PublicContent) {
  const stored = toStored(input);
  if (databaseConfigured()) await dbSaveContent(stored);
  else await writeDoc("content", stored);
  return presentContent(stored);
}

function cleanData(input: unknown) {
  if (!input || typeof input !== "object") return {};
  return Object.fromEntries(
    Object.entries(input as Record<string, unknown>)
      .filter((entry): entry is [string, string] => typeof entry[1] === "string")
      .slice(0, 40)
      .map(([key, value]) => [clip(key, 60), clipBlock(value, 2000)])
      .filter(([key, value]) => key && value)
  );
}

export async function addSubmission(type: string, data: unknown, paymentScreenshot?: string) {
  if (!submissionTypes.has(type as SubmissionType)) throw new Error("Unknown submission type.");
  const submission: Submission = {
    id: crypto.randomUUID(),
    type: type as SubmissionType,
    createdAt: new Date().toISOString(),
    status: "new",
    data: cleanData(data),
    paymentScreenshot: safeUrl(paymentScreenshot) || undefined
  };
  if (databaseConfigured()) await dbInsertSubmission(submission);
  else {
    await updateDoc<{ submissions: Submission[] }>("submissions", (current) => ({
      submissions: [submission, ...(current?.submissions || [])].slice(0, 2000)
    }));
  }
  return submission;
}

export async function listSubmissions() {
  if (databaseConfigured()) return dbListSubmissions();
  const stored = await readDoc<{ submissions: Submission[] }>("submissions");
  return stored?.submissions || [];
}

export async function patchSubmission(id: string, patch: { status?: Submission["status"]; paymentScreenshot?: string; paymentConfirmed?: boolean }) {
  if (databaseConfigured()) {
    return dbPatchSubmission(id, {
      status: patch.status,
      paymentScreenshot: patch.paymentScreenshot !== undefined ? safeUrl(patch.paymentScreenshot) || undefined : undefined,
      paymentConfirmed: patch.paymentConfirmed
    });
  }
  let updated: Submission | null = null;
  await updateDoc<{ submissions: Submission[] }>("submissions", (current) => ({
    submissions: (current?.submissions || []).map((item) => {
      if (item.id !== id) return item;
      updated = {
        ...item,
        status: patch.status === "reviewed" || patch.status === "new" ? patch.status : item.status,
        paymentScreenshot: patch.paymentScreenshot !== undefined ? safeUrl(patch.paymentScreenshot) || undefined : item.paymentScreenshot,
        paymentConfirmed: patch.paymentConfirmed ?? item.paymentConfirmed
      };
      return updated;
    })
  }));
  if (!updated) throw new Error("Submission not found.");
  return updated;
}

export async function deleteSubmission(id: string) {
  if (databaseConfigured()) {
    await dbDeleteSubmission(id);
    return;
  }
  await updateDoc<{ submissions: Submission[] }>("submissions", (current) => ({
    submissions: (current?.submissions || []).filter((item) => item.id !== id)
  }));
}

export async function addSubscriber(email: string) {
  const clean = clip(email, 160).toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clean)) throw new Error("Enter a valid email address.");
  const subscriber = { id: crypto.randomUUID(), email: clean, createdAt: new Date().toISOString() };
  if (databaseConfigured()) {
    await dbInsertSubscriber(subscriber);
    return;
  }
  await updateDoc<{ subscribers: Subscriber[] }>("subscribers", (current) => {
    const subscribers = current?.subscribers || [];
    if (subscribers.some((item) => item.email === clean)) return { subscribers };
    return { subscribers: [{ id: crypto.randomUUID(), email: clean, createdAt: new Date().toISOString() }, ...subscribers].slice(0, 10000) };
  });
}

export async function listSubscribers() {
  if (databaseConfigured()) return dbListSubscribers();
  const stored = await readDoc<{ subscribers: Subscriber[] }>("subscribers");
  return stored?.subscribers || [];
}

export async function removeSubscriber(email: string) {
  const clean = clip(email, 160).toLowerCase();
  if (databaseConfigured()) {
    await dbDeleteSubscriber(clean);
    return;
  }
  await updateDoc<{ subscribers: Subscriber[] }>("subscribers", (current) => ({
    subscribers: (current?.subscribers || []).filter((item) => item.email !== clean)
  }));
}

export async function listMailSends() {
  if (databaseConfigured()) return dbListMailSends();
  const stored = await readDoc<{ sends: MailSend[] }>("mail-log");
  return stored?.sends || [];
}

export async function logMailSend(subject: string, count: number) {
  const entry: MailSend = { id: crypto.randomUUID(), at: new Date().toISOString(), subject: clip(subject, 180), count };
  if (databaseConfigured()) {
    await dbInsertMailSend(entry);
    return;
  }
  await updateDoc<{ sends: MailSend[] }>("mail-log", (current) => ({
    sends: [entry, ...(current?.sends || [])].slice(0, 30)
  }));
}
