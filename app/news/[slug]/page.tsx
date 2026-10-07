import type { Metadata } from "next";
import { ArticleView } from "@/components/Pages";

export const metadata: Metadata = { title: "Leadership Training Expands" };

export function generateStaticParams() {
  return [{ slug: "leadership-training-expands" }];
}

export default function Page() {
  return <ArticleView />;
}
