import { tierRequiresPayment } from "./plans";
import { mailConfigured } from "./store";
import type { MembershipPlan, Submission } from "./site-types";

const wine = "#6f1735";
const forest = "#174a3a";
const gold = "#c8a45d";
const ivory = "#faf8f3";
const ink = "#202020";
const muted = "#66645f";

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[character] || character);
}

function validEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export function personName(data: Record<string, string>) {
  const combined = [data["first-name"], data["last-name"]].filter(Boolean).join(" ");
  return combined || data["full-name"] || data["contact-person"] || data.name || "";
}

export function personEmail(data: Record<string, string>) {
  return (data.email || data["email-address"] || "").trim().toLowerCase();
}

function letter(kicker: string, heading: string, inner: string) {
  return `<!DOCTYPE html>
<html>
<body style="margin:0;background:${ivory};">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${ivory};padding:32px 16px;">
    <tr><td align="center">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;background:#ffffff;border-radius:24px;overflow:hidden;">
        <tr><td style="background:${forest};padding:28px 32px;">
          <p style="margin:0;color:${gold};font-family:Arial,sans-serif;font-size:12px;letter-spacing:2px;font-weight:700;">${escapeHtml(kicker)}</p>
          <h1 style="margin:12px 0 0;color:#ffffff;font-family:Georgia,serif;font-size:32px;line-height:1.15;font-weight:600;">${escapeHtml(heading)}</h1>
        </td></tr>
        <tr><td style="padding:28px 32px 8px;color:${ink};font-family:Arial,sans-serif;font-size:16px;line-height:1.7;">
          ${inner}
        </td></tr>
        <tr><td style="padding:8px 32px 28px;color:${muted};font-family:Arial,sans-serif;font-size:13px;line-height:1.6;">
          Women in Politics Initiative · Plateau State<br>Protect · Respect · Empower · Support
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

function detailRows(rows: [string, string][]) {
  const visible = rows.filter(([, value]) => value.trim());
  if (!visible.length) return "";
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:18px 0 8px;border-top:1px solid #e8e3da;">
    ${visible
      .map(
        ([label, value]) => `<tr>
          <td style="padding:10px 12px 10px 0;color:${muted};font-size:13px;width:38%;vertical-align:top;">${escapeHtml(label)}</td>
          <td style="padding:10px 0;color:${ink};font-size:15px;vertical-align:top;">${escapeHtml(value)}</td>
        </tr>`
      )
      .join("")}
  </table>`;
}

function submissionCopy(submission: Submission, plans: MembershipPlan[]) {
  const name = personName(submission.data);
  const hello = name ? `Hello ${escapeHtml(name)},` : "Hello,";
  const kind = {
    membership: ["Membership registration", "We have received your membership registration."],
    contact: ["Message received", "We have received your message and a member of the team will be in touch."],
    partner: ["Partnership enquiry", "We have received your partnership enquiry."],
    interest: ["Interest received", "We have received your note of interest."]
  }[submission.type];
  const paid = submission.type === "membership" && tierRequiresPayment(submission.data.tier || "", plans);
  const paymentNote = paid
    ? submission.paymentScreenshot
      ? "We also received your transfer screenshot. The team will confirm the payment and write to you again."
      : "If a membership contribution applies, the team will confirm it after payment is received."
    : "";
  const rows: [string, string][] =
    submission.type === "membership"
      ? [
          ["Name", name],
          ["Category", submission.data.tier || ""],
          ["LGA", submission.data.lga || ""],
          ["Phone", submission.data.phone || ""]
        ]
      : [
          ["Name", name || submission.data["organisation"] || ""],
          ["Phone", submission.data.phone || submission.data["phone-number"] || ""],
          ["Interest", submission.data["area-of-interest"] || submission.data["partnership-interest"] || ""]
        ];
  const html = letter(
    "WOMEN IN POLITICS INITIATIVE",
    kind[0],
    `<p style="margin:0 0 12px;">${hello}</p>
     <p style="margin:0 0 12px;">${kind[1]}</p>
     ${paymentNote ? `<p style="margin:0 0 12px;">${paymentNote}</p>` : ""}
     ${detailRows(rows)}`
  );
  const text = [name ? `Hello ${name},` : "Hello,", kind[1], paymentNote, ...rows.filter(([, value]) => value).map(([label, value]) => `${label}: ${value}`)]
    .filter(Boolean)
    .join("\n\n");
  return { subject: `${kind[0]} | WIPI`, html, text };
}

function confirmationCopy(submission: Submission) {
  const name = personName(submission.data);
  const hello = name ? `Hello ${escapeHtml(name)},` : "Hello,";
  const tier = submission.data.tier || "membership";
  const html = letter(
    "PAYMENT CONFIRMED",
    "Your place with WIPI is confirmed",
    `<p style="margin:0 0 12px;">${hello}</p>
     <p style="margin:0 0 12px;">Your ${escapeHtml(tier)} membership payment has been confirmed. You are recorded with Women in Politics Initiative.</p>
     ${detailRows([
       ["Name", name],
       ["Category", submission.data.tier || ""],
       ["LGA", submission.data.lga || ""]
     ])}
     <p style="margin:16px 0 0;">We look forward to walking with you.</p>`
  );
  const text = [name ? `Hello ${name},` : "Hello,", `Your ${tier} membership payment has been confirmed.`, submission.data.lga ? `LGA: ${submission.data.lga}` : ""]
    .filter(Boolean)
    .join("\n\n");
  return { subject: "Your WIPI payment is confirmed", html, text };
}

export function bulkLetter(subject: string, message: string) {
  const paragraphs = message
    .split(/\n{2,}/)
    .map((paragraph) => `<p style="margin:0 0 14px;">${escapeHtml(paragraph).replace(/\n/g, "<br>")}</p>`)
    .join("");
  return letter("GET UPDATES FROM WIPI", subject, paragraphs || `<p style="margin:0;color:${muted};">Your update will appear here.</p>`);
}

async function deliver(to: string, subject: string, html: string, text: string) {
  if (!mailConfigured()) return false;
  if (!validEmail(to)) return false;
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ from: process.env.RESEND_FROM, to: [to], subject, html, text })
  });
  if (!response.ok) {
    const detail = (await response.json().catch(() => null)) as { message?: string } | null;
    throw new Error(detail?.message || "Resend could not send this email.");
  }
  return true;
}

export async function sendSubmissionReceipt(submission: Submission, plans: MembershipPlan[] = []) {
  const copy = submissionCopy(submission, plans);
  return deliver(personEmail(submission.data), copy.subject, copy.html, copy.text);
}

export async function sendPaymentConfirmation(submission: Submission) {
  const copy = confirmationCopy(submission);
  return deliver(personEmail(submission.data), copy.subject, copy.html, copy.text);
}

export async function sendBulkEmail(recipients: string[], subject: string, message: string) {
  if (!mailConfigured()) throw new Error("Email is not configured. Add RESEND_API_KEY and RESEND_FROM.");
  const unique = [...new Set(recipients.map((email) => email.trim().toLowerCase()).filter(validEmail))];
  if (!unique.length) throw new Error("There are no email addresses to send to yet.");
  const from = process.env.RESEND_FROM || "";
  const html = bulkLetter(subject, message);
  let sent = 0;
  for (let index = 0; index < unique.length; index += 100) {
    const chunk = unique.slice(index, index + 100);
    const response = await fetch("https://api.resend.com/emails/batch", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(chunk.map((email) => ({ from, to: [email], subject, text: message, html })))
    });
    if (!response.ok) {
      const detail = (await response.json().catch(() => null)) as { message?: string } | null;
      throw new Error(detail?.message || "Resend could not send this update.");
    }
    sent += chunk.length;
  }
  return sent;
}
