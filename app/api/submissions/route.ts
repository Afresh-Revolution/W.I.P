import { NextResponse } from "next/server";
import { addSubmission } from "@/lib/cms";
import { sendSubmissionReceipt } from "@/lib/mail";
import { saveImage } from "@/lib/store";

export const dynamic = "force-dynamic";

const hits = new Map<string, { count: number; at: number }>();

function limited(ip: string) {
  const now = Date.now();
  const hit = hits.get(ip);
  if (!hit || now - hit.at > 60_000) {
    hits.set(ip, { count: 1, at: now });
    return false;
  }
  hit.count += 1;
  return hit.count > 10;
}

export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
  if (limited(`submission:${ip}`)) return NextResponse.json({ error: "Too many submissions. Please wait a moment and try again." }, { status: 429 });
  try {
    const form = await request.formData();
    const type = String(form.get("type") || "");
    let data: unknown;
    try {
      data = JSON.parse(String(form.get("data") || "{}"));
    } catch {
      return NextResponse.json({ error: "Invalid submission." }, { status: 400 });
    }
    const file = form.get("screenshot");
    const screenshot = file instanceof File && file.size > 0 ? await saveImage(file, { anyImage: true }) : "";
    const submission = await addSubmission(type, data, screenshot);
    try {
      await sendSubmissionReceipt(submission);
    } catch (error) {
      console.error(error);
    }
    return NextResponse.json({ ok: true, id: submission.id });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Could not save this submission.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
