import type { Metadata } from "next";
import { LeadershipView } from "@/components/Pages";

export const metadata: Metadata = { title: "Leadership" };

export default function Page() {
  return <LeadershipView />;
}
