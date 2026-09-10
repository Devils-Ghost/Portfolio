import { z } from "zod";

/**
 * Validates the contact form's real fields (site-behavior.md §6.7) — a
 * security boundary, not a correctness check like `content/schema.ts`'s
 * mirrors: this data comes from anyone on the internet, not from a file we
 * wrote ourselves, so nothing downstream (the Firestore write, the email
 * send) should ever see it before it's passed through here.
 *
 * The honeypot field is deliberately not part of this schema — a filled
 * honeypot isn't invalid data to report back to the user, it's spam to
 * silently swallow, which is a different kind of check (handled in the
 * route itself, not here).
 *
 * Every field has a max length: without one, a public endpoint with no
 * cap is an easy way to abuse it (a multi-megabyte `message`, for
 * instance, bloating both the Firestore doc and the email it triggers).
 * `.trim()` runs before `.min(1)` on the required fields so a
 * whitespace-only submission (`"   "`) — which has length > 0 before
 * trimming — correctly fails as empty.
 */
export const contactFormSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(200),
  company: z.string().trim().max(200).optional(),
  role: z.string().trim().max(200).optional(),
  contact: z.string().trim().min(1, "Contact info is required").max(200),
  message: z.string().trim().min(1, "Message is required").max(5000),
  // Required, but not "content" — this is the Turnstile widget's response
  // token, proven valid separately (an async call to Cloudflare's
  // siteverify endpoint doesn't fit inside a synchronous Zod check), so it
  // only needs shape validation here: present and non-empty.
  turnstileToken: z.string().min(1, "Verification token missing"),
});

export type ContactFormInput = z.infer<typeof contactFormSchema>;
