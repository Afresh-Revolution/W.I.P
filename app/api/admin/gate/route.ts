import { NextResponse } from "next/server";
import { setGateCookie } from "@/lib/admin";

export const dynamic = "force-dynamic";

export async function POST() {
  await setGateCookie();
  return NextResponse.json({ ok: true });
}
