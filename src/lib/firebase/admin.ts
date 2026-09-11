import "server-only";
import { cert, getApps, initializeApp, type App } from "firebase-admin/app";
import { getFirestore, type Firestore } from "firebase-admin/firestore";
import { getAuth, type Auth } from "firebase-admin/auth";
import { requireEnv } from "@/lib/utils";

/**
 * Everything that needs an authenticated Firebase Admin SDK instance —
 * Firestore (content/firestore/repository.ts, api/contact/route.ts) and
 * Auth (lib/firebase/session.ts) — gets it from this one file, each as its
 * own lazy singleton sharing one underlying App. Mirrors how lib/firebase/
 * browser-auth.ts bundles "get the app + get its Auth" together on the
 * client side, rather than splitting the app instance into its own file
 * with nothing else in it.
 */
function getAdminApp(): App {
  // Next.js's dev server re-runs modules on hot reload; re-initializing the
  // same-named app would throw. Reuse whatever's already there.
  const existing = getApps()[0];
  if (existing) return existing;

  return initializeApp({
    credential: cert({
      projectId: requireEnv("FIREBASE_PROJECT_ID", process.env.FIREBASE_PROJECT_ID),
      clientEmail: requireEnv(
        "FIREBASE_CLIENT_EMAIL",
        process.env.FIREBASE_CLIENT_EMAIL,
      ),
      // The downloaded key's newlines were escaped to `\n` so they'd survive
      // as one .env line; undo that here to get back a real PEM key.
      privateKey: requireEnv(
        "FIREBASE_PRIVATE_KEY",
        process.env.FIREBASE_PRIVATE_KEY,
      ).replace(/\\n/g, "\n"),
    }),
  });
}

let db: Firestore | undefined;

export function getDb(): Firestore {
  if (!db) {
    db = getFirestore(getAdminApp());
  }
  return db;
}

let auth: Auth | undefined;

export function getAdminAuth(): Auth {
  if (!auth) {
    auth = getAuth(getAdminApp());
  }
  return auth;
}
