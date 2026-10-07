import type { Metadata } from "next";
import { UniformView } from "@/components/Pages";

export const metadata: Metadata = { title: "Uniform" };

export default function Page() {
  return <UniformView />;
}
