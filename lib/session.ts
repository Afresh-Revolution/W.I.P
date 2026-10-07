const encoder = new TextEncoder();

export const ADMIN_COOKIE = "wipi_admin";
export const ADMIN_GATE_COOKIE = "wipi_entry";

function sessionSecret() {
  return process.env.ADMIN_SESSION_SECRET || "";
}

function toHex(buffer: ArrayBuffer) {
  return [...new Uint8Array(buffer)].map((byte) => byte.toString(16).padStart(2, "0")).join("");
}

function fromHex(hex: string) {
  if (!/^[0-9a-f]+$/i.test(hex) || hex.length % 2 !== 0) return null;
  const bytes = new Uint8Array(hex.length / 2);
  for (let index = 0; index < bytes.length; index += 1) {
    bytes[index] = parseInt(hex.slice(index * 2, index * 2 + 2), 16);
  }
  return bytes;
}

async function hmacKey(usage: "sign" | "verify") {
  return crypto.subtle.importKey("raw", encoder.encode(sessionSecret()), { name: "HMAC", hash: "SHA-256" }, false, [usage]);
}

async function signRole(role: string, expiresAt: number) {
  if (!sessionSecret()) throw new Error("ADMIN_SESSION_SECRET is not set");
  const payload = `${role}.${expiresAt}`;
  const signature = toHex(await crypto.subtle.sign("HMAC", await hmacKey("sign"), encoder.encode(payload)));
  return `${payload}.${signature}`;
}

async function readRole(token: string | undefined | null, role: string) {
  if (!token || !sessionSecret()) return false;
  const parts = token.split(".");
  if (parts.length !== 3) return false;
  const [tokenRole, expires, signature] = parts;
  const expiresAt = Number(expires);
  if (tokenRole !== role || !Number.isFinite(expiresAt) || expiresAt < Date.now()) return false;
  const bytes = fromHex(signature);
  if (!bytes) return false;
  return crypto.subtle.verify("HMAC", await hmacKey("verify"), bytes, encoder.encode(`${tokenRole}.${expires}`));
}

export async function signSession(expiresAt: number) {
  return signRole("admin", expiresAt);
}

export async function readSession(token: string | undefined | null) {
  return readRole(token, "admin");
}

export async function signGate(expiresAt: number) {
  return signRole("gate", expiresAt);
}

export async function readGate(token: string | undefined | null) {
  return readRole(token, "gate");
}
