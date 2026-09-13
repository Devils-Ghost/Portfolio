import { Resend } from "resend";
import { renderContactNotificationHtml } from "./email-template";
import type { ContactFormInput } from "./schema";

// TODO: swap for hello@eternalglitch.com once Cloudflare Email Routing is
// confirmed set up, if that's preferred over a personal inbox.
const NOTIFY_ADDRESS = "devils.ghost.us@gmail.com";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const NO_REPLY_PATTERN = /^no.?reply@/i;

function usableReplyTo(contact: string): string | undefined {
  if (!EMAIL_PATTERN.test(contact)) return undefined;
  if (NO_REPLY_PATTERN.test(contact)) return undefined;
  return contact;
}

/**
 * Sends the admin-facing notification for a new contact submission.
 * `replyTo` is only set when `contact` actually looks like a real, usable
 * email address — the field also accepts a phone number or a LinkedIn URL
 * (docs/site-behavior.md §6.7), neither valid as a reply-to; and a syntactically
 * valid but `no-reply@...`/`noreply@...` address is equally useless as one,
 * even though it'd pass the plain pattern check.
 */
export async function sendContactNotification(
  data: ContactFormInput,
): Promise<void> {
  const resend = new Resend(process.env.RESEND_API_KEY);
  const from = process.env.RESEND_FROM_EMAIL;
  if (!from) {
    throw new Error("Missing required env var: RESEND_FROM_EMAIL");
  }

  // The SDK resolves successfully even when Resend rejects the send (bad
  // `from`, key/domain restriction mismatch, quota, ...) — it never throws
  // for API-level errors, only for things like a network failure. Ignoring
  // `error` here would mean the route reports success on a send that
  // silently never happened, which is exactly what shipped at first.
  const { error } = await resend.emails.send({
    from,
    to: NOTIFY_ADDRESS,
    replyTo: usableReplyTo(data.contact),
    subject: `Contact request | Portfolio Visit: ${data.name}`,
    // Both, not just one — `html` is what almost every modern client
    // actually renders, `text` stays as the fallback for anything that
    // can't (or won't) render HTML, and having both is also a mild
    // positive deliverability signal, since spam tends to send only one.
    html: renderContactNotificationHtml(data),
    text: [
      `Name: ${data.name}`,
      data.company ? `Company: ${data.company}` : null,
      data.role ? `Role: ${data.role}` : null,
      `Contact: ${data.contact}`,
      "",
      data.message,
    ]
      .filter((line) => line !== null)
      .join("\n"),
  });

  if (error) {
    throw new Error(`Resend failed to send: ${error.name} - ${error.message}`);
  }
}
