import { createHash, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { ADMIN_COOKIE, ADMIN_GATE_COOKIE, readSession, signGate, signSession } from "./session";

function sameSecret(left: string, right: string) {
  const a = createHash("sha256").update(left).digest();
  const b = createHash("sha256").update(right).digest();
  return timingSafeEqual(a, b);
}

export function adminConfigured() {
  return Boolean(process.env.ADMIN_EMAIL && process.env.ADMIN_PASSWORD && process.env.ADMIN_SESSION_SECRET);
}

export function credentialsMatch(email: string, password: string) {
  if (!adminConfigured()) return false;
  return sameSecret(email.trim().toLowerCase(), String(process.env.ADMIN_EMAIL).trim().toLowerCase()) && sameSecret(password, String(process.env.ADMIN_PASSWORD));
}

export async function setAdminCookie() {
  const expiresAt = Date.now() + 1000 * 60 * 60 * 12;
  const token = await signSession(expiresAt);
  const jar = await cookies();
  jar.set(ADMIN_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 12
  });
}

export async function setGateCookie() {
  const expiresAt = Date.now() + 1000 * 60 * 60 * 12;
  const token = await signGate(expiresAt);
  const jar = await cookies();
  jar.set(ADMIN_GATE_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 12
  });
}

export async function clearAdminCookie() {
  const jar = await cookies();
  jar.delete(ADMIN_COOKIE);
  jar.delete(ADMIN_GATE_COOKIE);
}

export async function requireAdmin() {
  const token = (await cookies()).get(ADMIN_COOKIE)?.value;
  if (await readSession(token)) return null;
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}
