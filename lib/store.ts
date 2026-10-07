import { createHash } from "crypto";
import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";
import { isRasterImage } from "./images";

const localDir = path.join(process.cwd(), "data", "cms");
const uploadDir = path.join(process.cwd(), "public", "uploads");

type CacheEntry = { value: unknown; at: number };

let queue: Promise<void> = Promise.resolve();
const cache = new Map<string, CacheEntry>();

const allowedTypes = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);

export function imagesConfigured() {
  return Boolean(process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET);
}

export function mailConfigured() {
  return Boolean(process.env.RESEND_API_KEY && process.env.RESEND_FROM);
}

function locked<T>(task: () => Promise<T>) {
  const run = queue.then(task, task);
  queue = run.then(
    () => undefined,
    () => undefined
  );
  return run;
}

function signUpload(params: Record<string, string>) {
  const serialized = Object.keys(params)
    .sort()
    .map((key) => `${key}=${params[key]}`)
    .join("&");
  return createHash("sha1")
    .update(`${serialized}${process.env.CLOUDINARY_API_SECRET}`)
    .digest("hex");
}

async function cloudinaryUpload(bytes: Buffer, filename: string, params: Record<string, string>) {
  if (!imagesConfigured()) throw new Error("Cloudinary is not configured.");
  const timestamp = String(Math.round(Date.now() / 1000));
  const body = new FormData();
  body.set("file", new Blob([new Uint8Array(bytes)]), filename);
  body.set("api_key", process.env.CLOUDINARY_API_KEY || "");
  body.set("timestamp", timestamp);
  body.set("signature", signUpload({ ...params, timestamp }));
  for (const [key, value] of Object.entries(params)) body.set(key, value);
  const response = await fetch(`https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_CLOUD_NAME}/image/upload`, { method: "POST", body });
  const payload = (await response.json().catch(() => null)) as { secure_url?: string; error?: { message?: string } } | null;
  if (!response.ok || !payload?.secure_url) throw new Error(payload?.error?.message || "Cloudinary upload failed.");
  return payload.secure_url;
}

async function readFresh(name: string) {
  try {
    const raw = await readFile(path.join(localDir, `${name}.json`), "utf8");
    return JSON.parse(raw) as unknown;
  } catch {
    return null;
  }
}

export async function readDoc<T>(name: string): Promise<T | null> {
  const hit = cache.get(name);
  if (hit && Date.now() - hit.at < 5000) return hit.value as T;
  const value = await readFresh(name);
  if (value !== null) cache.set(name, { value, at: Date.now() });
  return value as T | null;
}

async function writeFresh(name: string, value: unknown) {
  cache.set(name, { value, at: Date.now() });
  await mkdir(localDir, { recursive: true });
  await writeFile(path.join(localDir, `${name}.json`), JSON.stringify(value, null, 2));
}

export function writeDoc(name: string, value: unknown) {
  return locked(() => writeFresh(name, value));
}

export function updateDoc<T>(name: string, updater: (current: T | null) => T) {
  return locked(async () => {
    const current = (await readFresh(name)) as T | null;
    const next = updater(current);
    await writeFresh(name, next);
    return next;
  });
}

export async function saveImage(file: File, options?: { anyImage?: boolean }) {
  if (options?.anyImage) {
    if (!isRasterImage(file)) throw new Error("Upload an image of your transfer.");
    if (file.size > 12 * 1024 * 1024) throw new Error("Images must be 12MB or smaller.");
  } else if (!allowedTypes.has(file.type)) {
    throw new Error("Upload a JPG, PNG, WEBP or GIF image.");
  } else if (file.size > 5 * 1024 * 1024) {
    throw new Error("Images must be 5MB or smaller.");
  }
  const bytes = Buffer.from(await file.arrayBuffer());
  const safe = (file.name || "image").toLowerCase().replace(/[^a-z0-9.]+/g, "-").replace(/^-|-$/g, "").slice(0, 80) || "image";
  if (imagesConfigured()) {
    return cloudinaryUpload(bytes, safe, { folder: "wipi", public_id: `${Date.now()}-${safe.replace(/\.[a-z0-9]+$/, "")}` });
  }
  await mkdir(uploadDir, { recursive: true });
  const filename = `${Date.now()}-${safe}`;
  await writeFile(path.join(uploadDir, filename), bytes);
  return `/uploads/${filename}`;
}
