import { headers } from "next/headers";
import type { Metadata } from "next";
import localFont from "next/font/local";
import { SiteContentProvider } from "@/components/SiteContent";
import { SiteFrame } from "@/components/SiteFrame";
import { getPublicContent } from "@/lib/cms";
import "@/styles/main.scss";

const sans = localFont({
  src: [
    { path: "./fonts/dm-sans-400.woff2", weight: "400", style: "normal" },
    { path: "./fonts/dm-sans-500.woff2", weight: "500", style: "normal" },
    { path: "./fonts/dm-sans-600.woff2", weight: "600", style: "normal" },
    { path: "./fonts/dm-sans-700.woff2", weight: "700", style: "normal" }
  ],
  variable: "--font-sans-next",
  display: "swap"
});

const serif = localFont({
  src: [
    { path: "./fonts/playfair-600.woff2", weight: "600", style: "normal" },
    { path: "./fonts/playfair-600-italic.woff2", weight: "600", style: "italic" },
    { path: "./fonts/playfair-700.woff2", weight: "700", style: "normal" },
    { path: "./fonts/playfair-700-italic.woff2", weight: "700", style: "italic" }
  ],
  variable: "--font-serif-next",
  display: "swap"
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
export const revalidate = 0;

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  await headers();
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
