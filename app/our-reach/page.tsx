import type { Metadata } from "next";
import { ReachView } from "@/components/Pages";

export const metadata: Metadata = { title: "Our Reach" };

export default function Page() {
  return <ReachView />;
}
