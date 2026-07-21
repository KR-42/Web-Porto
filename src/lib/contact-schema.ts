import { z } from "zod";

const safeText = (minimum: number, maximum: number, message: string) => z.string().trim().min(minimum, message).max(maximum, `Must be ${maximum} characters or fewer.`).refine((value) => !/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/.test(value), "Contains unsupported control characters.");

export const contactSchema = z.object({
  name: safeText(2, 80, "Please enter your name."),
  email: z.string().trim().email("Enter a valid email address.").max(254),
  subject: safeText(3, 150, "Add a short subject."),
  message: safeText(20, 5000, "Please write at least 20 characters."),
  consent: z.boolean().refine(Boolean, "Please confirm before continuing."),
  website: z.string().trim().max(0, "Invalid submission."),
});

export type ContactValues = z.infer<typeof contactSchema>;
