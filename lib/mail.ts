import { mailConfigured } from "./store";

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[character] || character);
}

export async function sendBulkEmail(recipients: string[], subject: string, message: string) {
  if (!mailConfigured()) throw new Error("Email is not configured. Add RESEND_API_KEY and RESEND_FROM.");
  const unique = [...new Set(recipients.map((email) => email.trim().toLowerCase()).filter((email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)))];
  if (!unique.length) throw new Error("There are no email addresses to send to yet.");
  const from = process.env.RESEND_FROM || "";
  const html = `<div style="font-family:Georgia,serif;color:#202020;line-height:1.65;max-width:640px">
    <p style="letter-spacing:.14em;color:#c8a45d;font-family:Arial,sans-serif;font-size:12px;font-weight:700">GET UPDATES FROM WIPI</p>
    ${message
      .split(/\n{2,}/)
      .map((paragraph) => `<p>${escapeHtml(paragraph).replace(/\n/g, "<br>")}</p>`)
      .join("")}
    <p style="color:#66645f;font-size:13px">You received this because you asked Women in Politics Initiative for leadership, programmes and community news.</p>
  </div>`;
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
