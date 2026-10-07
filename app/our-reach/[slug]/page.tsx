import { LgaView } from "@/components/Pages";
import { lgas, slugify } from "@/lib/data";

export function generateStaticParams() {
  return lgas.map((name) => ({ slug: slugify(name) }));
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <LgaView slug={slug} />;
}
