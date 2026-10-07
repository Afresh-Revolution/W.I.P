import type { Metadata } from "next";
import { AboutView } from "@/components/Pages";

export const metadata: Metadata = { title: "About" };

export default function Page() {
  return <AboutView />;
}
