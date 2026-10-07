import type { Metadata } from "next";
import { ProgrammesView } from "@/components/Pages";

export const metadata: Metadata = { title: "Programmes" };

export default function Page() {
  return <ProgrammesView />;
}
