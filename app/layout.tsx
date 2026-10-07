import type { Metadata } from "next";
import { DM_Sans, Playfair_Display } from "next/font/google";
import { SiteContentProvider } from "@/components/SiteContent";
import { SiteFrame } from "@/components/SiteFrame";
import { getPublicContent } from "@/lib/cms";
import "@/styles/main.scss";

const sans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-sans-next"
});

const serif = Playfair_Display({
  subsets: ["latin"],
  weight: ["600", "700"],
  style: ["normal", "italic"],
  variable: "--font-serif-next"
});

export const metadata: Metadata = {
  title: {
    default: "Women in Politics Initiative | WIPI Plateau State",
    template: "%s | WIPI"
  },
  description: "Mobilising, equipping and empowering Plateau women to participate meaningfully in governance, peacebuilding and community development.",
  openGraph: {
    title: "Women in Politics Initiative",
    description: "Empowering women. Strengthening democracy across Plateau State.",
    type: "website",
    locale: "en_NG"
  }
};

export const dynamic = "force-dynamic";

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const content = await getPublicContent();
  return (
    <html lang="en" className={`${sans.variable} ${serif.variable}`}>
      <body>
        <SiteContentProvider content={content}>
          <SiteFrame>{children}</SiteFrame>
        </SiteContentProvider>
      </body>
    </html>
  );
}
