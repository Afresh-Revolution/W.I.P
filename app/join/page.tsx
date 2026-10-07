import type { Metadata } from "next";
import { JoinView } from "@/components/Pages";

export const metadata: Metadata = { title: "Join WIPI" };

export default function Page() {
  return <JoinView />;
}
