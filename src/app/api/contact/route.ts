import { NextResponse } from "next/server";
import { Resend } from "resend";
import { contactSchema } from "@/lib/contact-schema";

export const runtime = "nodejs";
const MAX_BODY_BYTES = 24_000;
const escapeHtml = (value: string) => value.replace(/[&<>'"]/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" })[character] ?? character);

export async function POST(request: Request) {
  const declaredLength = Number(request.headers.get("content-length") ?? 0);
  if (declaredLength > MAX_BODY_BYTES) return NextResponse.json({ ok: false, code: "PAYLOAD_TOO_LARGE", message: "The message is too large." }, { status: 413 });
  let rawBody: string;
  try { rawBody = await request.text(); } catch { return NextResponse.json({ ok: false, code: "INVALID_REQUEST", message: "Unable to read the request." }, { status: 400 }); }
  if (new TextEncoder().encode(rawBody).byteLength > MAX_BODY_BYTES) return NextResponse.json({ ok: false, code: "PAYLOAD_TOO_LARGE", message: "The message is too large." }, { status: 413 });
  let payload: unknown;
  try { payload = JSON.parse(rawBody); } catch { return NextResponse.json({ ok: false, code: "INVALID_JSON", message: "Invalid request data." }, { status: 400 }); }
  const parsed = contactSchema.safeParse(payload);
  if (!parsed.success) return NextResponse.json({ ok: false, code: "VALIDATION_ERROR", message: "Please review the submitted fields.", fields: parsed.error.flatten().fieldErrors }, { status: 422 });
  if (parsed.data.website) return NextResponse.json({ ok: true });

  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM_EMAIL;
  const to = process.env.CONTACT_TO_EMAIL ?? "rafly.athallah.putra@gmail.com";
  if (!apiKey || !from) return NextResponse.json({ ok: false, code: "CONFIGURATION_ERROR", message: "The contact form is temporarily unavailable. Please contact Rafly directly by email." }, { status: 503 });

  const { name, email, subject, message } = parsed.data;
  const timestamp = new Date().toISOString();
  const text = [`Portfolio message: ${subject}`, "", `Name: ${name}`, `Email: ${email}`, `Submitted: ${timestamp}`, "Source: Rafly Portofolio contact form", "", message].join("\n");
  const html = `<h2>Portfolio message: ${escapeHtml(subject)}</h2><dl><dt>Name</dt><dd>${escapeHtml(name)}</dd><dt>Email</dt><dd>${escapeHtml(email)}</dd><dt>Submitted</dt><dd>${escapeHtml(timestamp)}</dd><dt>Source</dt><dd>Rafly Portofolio contact form</dd></dl><p>${escapeHtml(message).replace(/\n/g, "<br>")}</p>`;
  try {
    const resend = new Resend(apiKey);
    const result = await resend.emails.send({ from, to, replyTo: email, subject: `Portfolio message: ${subject}`, text, html });
    if (result.error) { console.error("Contact email delivery failed", { name: result.error.name }); return NextResponse.json({ ok: false, code: "DELIVERY_ERROR", message: "Your message could not be sent. Please try again later." }, { status: 502 }); }
    return NextResponse.json({ ok: true, id: result.data?.id });
  } catch (error) {
    console.error("Contact email delivery failed", { type: error instanceof Error ? error.name : "UnknownError" });
    return NextResponse.json({ ok: false, code: "DELIVERY_ERROR", message: "Your message could not be sent. Please try again later." }, { status: 502 });
  }
}
