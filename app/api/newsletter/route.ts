import { NextResponse } from "next/server";
import { addSubscriber } from "@/lib/cms";

export const dynamic = "force-dynamic";

const hits = new Map<string, { count: number; at: number }>();

export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
  const now = Date.now();
  const hit = hits.get(ip);
  if (!hit || now - hit.at > 60_000) hits.set(ip, { count: 1, at: now });
  else {
    hit.count += 1;
    if (hit.count > 8) return NextResponse.json({ error: "Please wait a moment before subscribing again." }, { status: 429 });
  }
  try {
    const body = (await request.json()) as { email?: string };
    await addSubscriber(String(body.email || ""));
    return NextResponse.json({ ok: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Could not save this email.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
