import type { Metadata } from "next";
import { PartnerView } from "@/components/Pages";

export const metadata: Metadata = { title: "Partner With Us" };

export default function Page() {
  return <PartnerView />;
}
