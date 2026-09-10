/**
 * Verifies a Turnstile widget response token server-side, against
 * Cloudflare's own siteverify endpoint — the token alone proves nothing;
 * only Cloudflare, holding the matching secret key, can confirm it's real.
 * `TURNSTILE_SECRET_KEY` stays server-only (no `NEXT_PUBLIC_` prefix); the
 * site key the widget itself uses is a separate, public value.
 */
export async function verifyTurnstile(
  token: string,
  ip: string,
): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) {
    throw new Error("Missing required env var: TURNSTILE_SECRET_KEY");
  }

  const response = await fetch(
    "https://challenges.cloudflare.com/turnstile/v0/siteverify",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ secret, response: token, remoteip: ip }),
    },
  );

  const result: { success: boolean } = await response.json();
  return result.success;
}
