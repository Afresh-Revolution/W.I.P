import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin";
import { deleteSubmission, listSubmissions, patchSubmission } from "@/lib/cms";
import type { Submission } from "@/lib/site-types";

export const dynamic = "force-dynamic";

export async function GET() {
  const denied = await requireAdmin();
  if (denied) return denied;
  return NextResponse.json({ submissions: await listSubmissions() });
}

export async function PATCH(request: Request) {
  const denied = await requireAdmin();
  if (denied) return denied;
  try {
    const body = (await request.json()) as { id?: string; status?: Submission["status"]; paymentScreenshot?: string };
    if (!body.id) return NextResponse.json({ error: "Missing submission." }, { status: 400 });
    const submission = await patchSubmission(body.id, { status: body.status, paymentScreenshot: body.paymentScreenshot });
    return NextResponse.json({ submission });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Could not update this submission.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function DELETE(request: Request) {
  const denied = await requireAdmin();
  if (denied) return denied;
  const body = (await request.json().catch(() => null)) as { id?: string } | null;
  if (!body?.id) return NextResponse.json({ error: "Missing submission." }, { status: 400 });
  await deleteSubmission(body.id);
  return NextResponse.json({ ok: true });
}
