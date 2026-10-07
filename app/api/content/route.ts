import { NextResponse } from "next/server";
import { getPublicContent } from "@/lib/cms";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json(await getPublicContent(), {
    headers: { "Cache-Control": "no-store" }
  });
}
