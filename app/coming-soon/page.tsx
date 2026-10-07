import type { Metadata } from "next";
import { LegalView } from "@/components/Pages";

export const metadata: Metadata = { title: "Coming Soon" };

export default function Page() {
  return <LegalView type="coming-soon" />;
}
