import type { Metadata } from "next";
import { GalleryView } from "@/components/Pages";

export const metadata: Metadata = { title: "Gallery" };

export default function Page() {
  return <GalleryView />;
}
