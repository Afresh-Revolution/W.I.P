import type { Metadata } from "next";
import { MembershipView } from "@/components/Pages";

export const metadata: Metadata = { title: "Membership" };

export default function Page() {
  return <MembershipView />;
}
