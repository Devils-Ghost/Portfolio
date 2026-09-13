import type { ContactFormInput } from "./schema";

/**
 * The admin notification's HTML body, styled to match the site's own theme
 * (docs/site-behavior.md §3) rather than a generic transactional-email look —
 * same dark surface, blue accent, and the same small accent-bar treatment
 * `ContactFormBody`'s own modal uses (`w-12 h-1 bg-blue-500 rounded-full`).
 * The page background outside the card is white, not the site's own black —
 * unlike a browser tab, an email renders inside a client's own white
 * reading pane (Gmail, most others), so a full black canvas around the
 * card reads as a rendering glitch rather than a deliberate choice; only
 * the card itself carries the site's dark theme.
 *
 * Built with inline styles and a table-based layout, not the site's own
 * Tailwind classes — email clients (Outlook especially) don't load
 * stylesheets or support flexbox/grid reliably, so email HTML is written
 * to a much older, more restrictive baseline than a browser gets. Colors
 * are hardcoded hex, not `var(--color-*)`, for the same reason: CSS custom
 * properties aren't reliably supported in email either. The hex values
 * mirror `@theme`'s definitions in `globals.css` — `--color-blue-500` etc.
 * are Tailwind v4's stock defaults for those shades (docs/plan-progress.md,
 * Phase 0), so their standard hex equivalents are used directly here
 * rather than trying to reproduce the OKLCH values email clients wouldn't
 * render correctly anyway.
 *
 * User-submitted fields are HTML-escaped — this content reaches an actual
 * email client's HTML renderer, so unescaped input would be a real HTML/
 * script-injection surface, not just a display glitch.
 */

const COLOR = {
  surface: "#0a0f18",
  border: "#1e2530",
  blue400: "#60a5fa",
  blue500: "#3b82f6",
  white: "#ffffff",
  gray300: "#d1d5db",
  gray400: "#9ca3af",
  gray500: "#6b7280",
};

const FONT_SANS =
  "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif";
const FONT_MONO =
  "'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace";

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function fieldRow(label: string, value: string): string {
  return `
    <tr>
      <td style="padding: 4px 0; vertical-align: top; white-space: nowrap;">
        <span style="font-family: ${FONT_MONO}; font-size: 11px; letter-spacing: 0.05em; text-transform: uppercase; color: ${COLOR.gray500};">${label}</span>
      </td>
      <td style="padding: 4px 0 4px 16px; vertical-align: top;">
        <span style="font-family: ${FONT_SANS}; font-size: 14px; color: ${COLOR.gray300};">${escapeHtml(value)}</span>
      </td>
    </tr>`;
}

export function renderContactNotificationHtml(data: ContactFormInput): string {
  const rows = [
    fieldRow("Name", data.name),
    data.company ? fieldRow("Company", data.company) : null,
    data.role ? fieldRow("Role", data.role) : null,
    fieldRow("Contact", data.contact),
  ]
    .filter((row) => row !== null)
    .join("");

  return `<!DOCTYPE html>
<html>
  <body style="margin: 0; padding: 32px 16px; background-color: ${COLOR.white}; font-family: ${FONT_SANS};">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
      <tr>
        <td align="center">
          <table role="presentation" width="560" cellpadding="0" cellspacing="0" style="max-width: 560px; width: 100%; background-color: ${COLOR.surface}; border: 1px solid ${COLOR.border}; border-radius: 16px;">
            <tr>
              <td style="padding: 32px;">
                <div style="width: 48px; height: 4px; background-color: ${COLOR.blue500}; border-radius: 9999px; margin-bottom: 16px;"></div>
                <h1 style="margin: 0 0 24px; font-size: 20px; font-weight: 700; color: ${COLOR.white};">
                  New portfolio contact
                </h1>
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 24px;">
                  ${rows}
                </table>
                <div style="height: 1px; background-color: ${COLOR.border}; margin-bottom: 24px;"></div>
                <p style="margin: 0; font-family: ${FONT_SANS}; font-size: 14px; line-height: 1.6; color: ${COLOR.gray300}; white-space: pre-wrap;">${escapeHtml(data.message)}</p>
              </td>
            </tr>
          </table>
          <table role="presentation" width="560" cellpadding="0" cellspacing="0" style="max-width: 560px; width: 100%;">
            <tr>
              <td style="padding: 16px 8px 0;">
                <span style="font-family: ${FONT_MONO}; font-size: 11px; color: ${COLOR.gray500};">
                  Sent from the contact form at
                  <a href="https://dhaval-tanna.eternalglitch.com" style="color: ${COLOR.blue400}; text-decoration: none;">dhaval-tanna.eternalglitch.com</a>
                </span>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}
