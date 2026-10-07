import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { ADMIN_COOKIE, ADMIN_GATE_COOKIE, readGate, readSession } from "@/lib/session";

function hideAdmin(request: NextRequest) {
  const hidden = request.nextUrl.clone();
  hidden.pathname = "/404";
  return NextResponse.rewrite(hidden);
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const page = pathname === "/admin" || pathname === "/admin/login";
  const gate = page ? await readGate(request.cookies.get(ADMIN_GATE_COOKIE)?.value) : false;
  if (page && !gate) return hideAdmin(request);
  if (pathname === "/admin/login" || pathname === "/api/admin/login" || pathname === "/api/admin/gate") return NextResponse.next();
  const allowed = await readSession(request.cookies.get(ADMIN_COOKIE)?.value);
  if (allowed) return NextResponse.next();
  if (pathname.startsWith("/api/")) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!gate) return hideAdmin(request);
  const login = request.nextUrl.clone();
  login.pathname = "/admin/login";
  return NextResponse.redirect(login);
}

export const config = {
  matcher: ["/admin", "/admin/:path*", "/api/admin/:path*"]
};
