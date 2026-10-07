import { NextResponse } from "next/server";
import { adminConfigured, credentialsMatch, setAdminCookie } from "@/lib/admin";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  if (!adminConfigured()) {
    return NextResponse.json({ error: "Admin sign-in is not configured. Add ADMIN_EMAIL, ADMIN_PASSWORD and ADMIN_SESSION_SECRET." }, { status: 503 });
  }
  const body = (await request.json().catch(() => null)) as { email?: string; password?: string } | null;
  if (!body || !credentialsMatch(String(body.email || ""), String(body.password || ""))) {
    return NextResponse.json({ error: "Those details do not match the admin account." }, { status: 401 });
  }
  await setAdminCookie();
  return NextResponse.json({ ok: true });
}
