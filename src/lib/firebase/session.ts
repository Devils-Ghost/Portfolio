import "server-only";
import { getAdminAuth } from "./admin";
import { requireEnv } from "@/lib/utils";

export const SESSION_COOKIE_NAME = "admin_session";

// Firebase's own ceiling for session cookies is 14 days; a single-admin
// personal site has no reason to force more frequent re-logins than that.
const SESSION_MAX_AGE_MS = 1000 * 60 * 60 * 24 * 14;

/**
 * Verifies a fresh client-side ID token and, only if it belongs to the
 * allowed admin account, exchanges it for a long-lived session cookie.
 * Rejecting here — rather than only at read time in readSession() — means a
 * non-admin Google account never gets a cookie minted for it at all.
 */
export async function mintSessionCookie(
  idToken: string,
): Promise<{ cookie: string; maxAgeSeconds: number }> {
  const auth = getAdminAuth();
  const decoded = await auth.verifyIdToken(idToken);

  if (decoded.uid !== requireEnv("ADMIN_UID", process.env.ADMIN_UID)) {
    throw new Error("This Google account is not authorized for admin access.");
  }

  const cookie = await auth.createSessionCookie(idToken, {
    expiresIn: SESSION_MAX_AGE_MS,
  });

  return { cookie, maxAgeSeconds: SESSION_MAX_AGE_MS / 1000 };
}

/**
 * Verifies a session cookie read back from the browser. `checkRevoked` is
 * deliberately left off (the SDK default): turning it on makes an extra
 * Auth backend call on every single request to check a revocation list we
 * have no UI to populate yet — pure cost with no behavior benefit until a
 * "sign out everywhere" feature exists. Without it, verification is a local
 * signature check against cached Google public keys — free, per §5's cost
 * model.
 */
export async function readSession(
  cookieValue: string | undefined,
): Promise<{ uid: string } | null> {
  if (!cookieValue) return null;

  try {
    const decoded = await getAdminAuth().verifySessionCookie(cookieValue);
    return { uid: decoded.uid };
  } catch {
    // Expired, malformed, or tampered — all treated as "not signed in".
    return null;
  }
}
