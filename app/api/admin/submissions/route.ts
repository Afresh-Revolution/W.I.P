import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin";
import { deleteSubmission, listSubmissions, patchSubmission } from "@/lib/cms";
import { personEmail, sendPaymentConfirmation } from "@/lib/mail";
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
    const body = (await request.json()) as { id?: string; status?: Submission["status"]; paymentScreenshot?: string; confirmPayment?: boolean };
    if (!body.id) return NextResponse.json({ error: "Missing submission." }, { status: 400 });
    if (body.confirmPayment) {
      const current = (await listSubmissions()).find((item) => item.id === body.id);
      if (!current) return NextResponse.json({ error: "Submission not found." }, { status: 404 });
      if (current.type !== "membership" || !current.data.tier || current.data.tier === "Community") {
        return NextResponse.json({ error: "Only a paid membership can be confirmed." }, { status: 400 });
      }
      if (!personEmail(current.data)) return NextResponse.json({ error: "This registration has no email address." }, { status: 400 });
      if (current.paymentConfirmed) return NextResponse.json({ submission: current, emailed: true });
      const submission = await patchSubmission(body.id, { paymentConfirmed: true });
      try {
        const emailed = await sendPaymentConfirmation(submission);
        return NextResponse.json({ submission, emailed });
      } catch (error) {
        const message = error instanceof Error ? error.message : "The payment was confirmed, but the email could not be sent.";
        return NextResponse.json({ submission, emailed: false, emailError: message });
      }
    }
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
