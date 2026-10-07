import type { Metadata } from "next";
import { LegalView } from "@/components/Pages";

export const metadata: Metadata = { title: "FAQs" };

export default function Page() {
  return <LegalView type="faqs" />;
}
