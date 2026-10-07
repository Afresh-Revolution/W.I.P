import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin";
import { getPublicContent, savePublicContent } from "@/lib/cms";
import type { PublicContent } from "@/lib/site-types";
import { databaseConfigured } from "@/lib/db";
import { imagesConfigured, mailConfigured } from "@/lib/store";

export const dynamic = "force-dynamic";

export async function GET() {
  const denied = await requireAdmin();
  if (denied) return denied;
  const content = await getPublicContent();
  return NextResponse.json({ content, services: { images: imagesConfigured(), email: mailConfigured(), database: databaseConfigured() } });
}

export async function PUT(request: Request) {
  const denied = await requireAdmin();
  if (denied) return denied;
  try {
    const body = (await request.json()) as PublicContent;
    const content = await savePublicContent(body);
    return NextResponse.json({ content });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Could not save these changes.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
