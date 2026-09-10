import { cert, getApps, initializeApp, type App } from "firebase-admin/app";
import { getFirestore, type Firestore } from "firebase-admin/firestore";

/**
 * Admin SDK singleton (PROJECT_PLAN.md §4). Authenticates as the service
 * account from Firebase project settings, not as a rule-checked client —
 * this is what lets server code read/write through the deny-all rules
 * from §D3.
 */
function getAdminApp(): App {
  // Next.js's dev server re-runs modules on hot reload; re-initializing the
  // same-named app would throw. Reuse whatever's already there.
  const existing = getApps()[0];
  if (existing) return existing;

  return initializeApp({
    credential: cert({
      projectId: requireEnv("FIREBASE_PROJECT_ID"),
      clientEmail: requireEnv("FIREBASE_CLIENT_EMAIL"),
      // The downloaded key's newlines were escaped to `\n` so they'd survive
      // as one .env line; undo that here to get back a real PEM key.
      privateKey: requireEnv("FIREBASE_PRIVATE_KEY").replace(/\\n/g, "\n"),
    }),
  });
}

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(
      `Missing required env var: ${name}. Check .env.local (or Vercel's ` +
        `project env vars in production).`,
    );
  }
  return value;
}

let db: Firestore | undefined;

/** Lazily initialized so importing this module never has side effects. */
export function getDb(): Firestore {
  if (!db) {
    db = getFirestore(getAdminApp());
  }
  return db;
}
