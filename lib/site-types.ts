export const imageSlots = [
  ["hero", "Homepage hero"],
  ["gathering", "Gathering"],
  ["women", "Women learning"],
  ["community", "Community"],
  ["founder", "Founder portrait"],
  ["portrait2", "Portrait"],
  ["portrait3", "Portrait"],
  ["portrait4", "Portrait"],
  ["event", "Event"],
  ["hands", "Hands"],
  ["map", "Plateau State map"],
  ["logo", "Logo"]
] as const;

export type ImageSlot = (typeof imageSlots)[number][0];

export type SiteImages = Record<ImageSlot, string>;

export type HeroCopy = {
  label: string;
  title: [string, string];
  text: string;
};

export type PublicHero = HeroCopy & {
  image: string;
  primary: [string, string];
  secondary: [string, string];
};

export type SiteText = {
  announcement: string;
  mission: string;
  vision: string;
  introTitle: string;
  introText: string;
  introBody: string;
  reachTitle: string;
  reachText: string;
  reachPageTitle: string;
  aboutToday: string;
  founderName: string;
  founderRole: string;
  founderQuote: string;
  founderBio: string;
  newsletterTitle: string;
  newsletterText: string;
  contactAddress: string;
  contactPhone: string;
  contactEmail: string;
  membershipEmail: string;
};

export type LgaEntry = {
  name: string;
  members: string;
  coordinator: string;
  phone: string;
};

export type PartnerEntry = {
  id: string;
  name: string;
  image: string;
};

export type MembershipPlan = {
  id: string;
  name: string;
  price: string;
  text: string;
  featured: boolean;
};

export type GalleryExtra = {
  id: string;
  image: string;
  caption: string;
  category: string;
};

export type GalleryItem = {
  category: string;
  caption: string;
  image: string;
};

export type BankDetails = {
  bankName: string;
  accountName: string;
  accountNumber: string;
  instructions: string;
};

export type PublicContent = {
  reportedMembers: number;
  establishedYear: number;
  text: SiteText;
  heroes: PublicHero[];
  images: SiteImages;
  gallery: GalleryItem[];
  galleryExtra: GalleryExtra[];
  lgas: LgaEntry[];
  partnerships: PartnerEntry[];
  plans: MembershipPlan[];
  bank: BankDetails;
};

export type SubmissionType = "membership" | "contact" | "partner" | "interest";

export type Submission = {
  id: string;
  type: SubmissionType;
  createdAt: string;
  status: "new" | "reviewed";
  data: Record<string, string>;
  paymentScreenshot?: string;
  paymentConfirmed?: boolean;
};

export type Subscriber = {
  id: string;
  email: string;
  createdAt: string;
};

export type MailSend = {
  id: string;
  at: string;
  subject: string;
  count: number;
};
