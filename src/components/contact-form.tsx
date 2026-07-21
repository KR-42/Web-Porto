"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { LoaderCircle } from "lucide-react";
import { cloneElement, useEffect, useRef, useState, type ReactElement } from "react";
import { useForm } from "react-hook-form";
import { contactSchema, type ContactValues } from "@/lib/contact-schema";

type SubmissionState = "idle" | "success" | "error" | "configuration";

export function ContactForm() {
  const [submissionState, setSubmissionState] = useState<SubmissionState>("idle");
  const feedbackRef = useRef<HTMLParagraphElement>(null);
  const requestRef = useRef<AbortController | null>(null);
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<ContactValues>({ resolver: zodResolver(contactSchema), defaultValues: { name: "", email: "", subject: "", message: "", consent: false, website: "" } });

  useEffect(() => () => requestRef.current?.abort(), []);

  async function submit(values: ContactValues) {
    if (requestRef.current) return;
    setSubmissionState("idle");
    const controller = new AbortController(); requestRef.current = controller;
    try {
      const response = await fetch("/api/contact", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(values), signal: controller.signal });
      const result = await response.json().catch(() => null) as { ok?: boolean; code?: string } | null;
      if (response.ok && result?.ok) { reset(); setSubmissionState("success"); requestAnimationFrame(() => feedbackRef.current?.focus()); return; }
      setSubmissionState(result?.code === "CONFIGURATION_ERROR" ? "configuration" : "error");
      requestAnimationFrame(() => feedbackRef.current?.focus());
    } catch (error) {
      if (!(error instanceof DOMException && error.name === "AbortError")) { setSubmissionState("error"); requestAnimationFrame(() => feedbackRef.current?.focus()); }
    } finally { requestRef.current = null; }
  }

  const feedback = submissionState === "success" ? "Your message has been sent successfully." : submissionState === "configuration" ? "The contact form is temporarily unavailable. Please contact Rafly directly by email." : submissionState === "error" ? "Your message could not be sent. Please try again." : "";

  // The submit callback accesses the abort-controller ref only after a user event.
  // eslint-disable-next-line react-hooks/refs
  return <form className="contact-form" onSubmit={handleSubmit(submit)} noValidate>
    <div className="form-row"><Field id="contact-name" label="Name" error={errors.name?.message}><input id="contact-name" {...register("name")} autoComplete="name" /></Field><Field id="contact-email" label="Email" error={errors.email?.message}><input id="contact-email" {...register("email")} type="email" autoComplete="email" /></Field></div>
    <Field id="contact-subject" label="Subject" error={errors.subject?.message}><input id="contact-subject" {...register("subject")} /></Field>
    <Field id="contact-message" label="Message" error={errors.message?.message}><textarea id="contact-message" {...register("message")} rows={6} /></Field>
    <div className="honeypot" aria-hidden="true"><label>Website<input {...register("website")} tabIndex={-1} autoComplete="off" /></label></div>
    <label className="consent"><input type="checkbox" aria-invalid={Boolean(errors.consent)} aria-describedby={errors.consent ? "contact-consent-error" : undefined} {...register("consent")} /><span>I confirm that these details are accurate and consent to sending this message.</span></label>
    {errors.consent && <p id="contact-consent-error" className="field-error" role="alert">{errors.consent.message}</p>}
    <button className="button primary" disabled={isSubmitting}>{isSubmitting && <LoaderCircle className="form-spinner" aria-hidden="true" />}{isSubmitting ? "Sending..." : "Send message"}</button>
    <p className="form-note">Your message will be sent directly to Rafly through the secure contact form.</p>
    <p ref={feedbackRef} className={`form-feedback ${submissionState}`} role={submissionState === "success" ? "status" : "alert"} aria-live="polite" tabIndex={-1}>{feedback}</p>
  </form>;
}

function Field({ id, label, error, children }: { id: string; label: string; error?: string; children: ReactElement<{ "aria-invalid"?: boolean; "aria-describedby"?: string }> }) {
  const errorId = `${id}-error`;
  return <label className="field" htmlFor={id}><span>{label}</span>{cloneElement(children, { "aria-invalid": Boolean(error), "aria-describedby": error ? errorId : undefined })}{error && <small id={errorId} role="alert">{error}</small>}</label>;
}
