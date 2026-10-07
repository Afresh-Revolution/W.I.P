export async function sendSubmission(type: string, data: Record<string, string>, screenshot?: File | null) {
  const body = new FormData();
  body.set("type", type);
  body.set("data", JSON.stringify(data));
  if (screenshot && screenshot.size > 0) body.set("screenshot", screenshot);
  const response = await fetch("/api/submissions", { method: "POST", body });
  const payload = (await response.json().catch(() => null)) as { error?: string } | null;
  if (!response.ok) throw new Error(payload?.error || "We could not save your submission. Please try again.");
}
