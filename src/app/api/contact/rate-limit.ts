import { createHash } from "node:crypto";

const WINDOW_MS = 60 * 60 * 1000; // 1 hour
const MAX_PER_WINDOW = 3;

/**
 * In-memory, not Firestore-backed — deliberately, and only safe because of
 * where this is called from `route.ts`: *after* Turnstile verification
 * succeeds, not before. Firestore's Spark plan has a hard daily quota; a
 * Firestore-backed limiter checked before Turnstile means a bot spamming
 * garbage tokens costs a real Firestore read/write per attempt, for
 * requests that were never going to succeed anyway — the limiter meant to
 * protect the endpoint becomes the most expensive thing to hit. Since only
 * Turnstile-passed traffic reaches this, volume is already filtered down
 * to genuine solves before this ever runs, and a plain in-memory `Map`
 * costs nothing.
 *
 * The real tradeoff: a module-level `Map` persists only within one warm
 * serverless instance, not across all of them — under real concurrent
 * traffic across multiple instances, the limit isn't perfectly global. For
 * a personal portfolio's contact form, defended primarily by Turnstile,
 * that's acceptable; this exists as a backstop against a script re-solving
 * challenges to spam the form, not as an airtight global cap.
 */
const attempts = new Map<string, { count: number; windowStart: number }>();

export function isRateLimited(ip: string): boolean {
  const key = createHash("sha256").update(ip).digest("hex");
  const now = Date.now();
  const entry = attempts.get(key);

  if (!entry || now - entry.windowStart > WINDOW_MS) {
    attempts.set(key, { count: 1, windowStart: now });
    return false;
  }

  if (entry.count >= MAX_PER_WINDOW) {
    return true;
  }

  entry.count += 1;
  return false;
}

/**
 * `x-forwarded-for` is the standard header Vercel (and proxies generally)
 * set to the real client IP — `request` itself has no `.ip` property in
 * the App Router's Web-standard `Request` type. The header can carry a
 * comma-separated chain (one entry per proxy hop); the first is the
 * original client. Falls back to a constant so a missing header (e.g.
 * local dev, where there's no proxy in front of the server at all) still
 * produces a stable, valid rate-limit key instead of crashing.
 */
export function getClientIp(request: Request): string {
  const forwardedFor = request.headers.get("x-forwarded-for");
  return forwardedFor?.split(",")[0]?.trim() || "unknown";
}
