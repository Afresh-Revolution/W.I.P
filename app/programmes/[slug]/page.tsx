import { ProgrammeDetailView } from "@/components/Pages";
import { programmes, slugify } from "@/lib/data";

export function generateStaticParams() {
  return programmes.map((item) => ({ slug: slugify(item[0]) }));
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <ProgrammeDetailView slug={slug} />;
}
