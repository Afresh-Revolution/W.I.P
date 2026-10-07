import type { Metadata } from "next";
import { NewsView } from "@/components/Pages";

export const metadata: Metadata = { title: "News & Events" };

export default function Page() {
  return <NewsView />;
}
