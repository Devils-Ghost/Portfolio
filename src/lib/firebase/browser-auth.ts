import { getApps, initializeApp, type FirebaseOptions } from "firebase/app";
import { GoogleAuthProvider, getAuth, type Auth } from "firebase/auth";
import { requireEnv } from "@/lib/utils";

/**
 * Client SDK singleton, browser-only. This is a *different* credential path
 * from lib/firebase/admin.ts's Admin SDK: that one authenticates as a
 * service account with full access, this one is the public, rule-checked
 * config that lets the browser show the Google Sign-In popup. Safe to ship
 * in the JS bundle — Firestore itself stays locked by the deny-all rules
 * from Phase 3 regardless of what this config exposes.
 */
// Each value below must be written as the literal `process.env.NEXT_PUBLIC_*`
// expression, not looked up dynamically (e.g. `process.env[name]`) — Next.js
// inlines NEXT_PUBLIC_* vars into the client bundle via static text
// substitution at build time, and can only do that for an expression it can
// see and match textually in the source. A dynamic lookup silently resolves
// to undefined in the browser no matter what .env.local contains.
const firebaseConfig: FirebaseOptions = {
  apiKey: requireEnv(
    "NEXT_PUBLIC_FIREBASE_API_KEY",
    process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  ),
  authDomain: requireEnv(
    "NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN",
    process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  ),
  projectId: requireEnv(
    "NEXT_PUBLIC_FIREBASE_PROJECT_ID",
    process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  ),
  storageBucket: requireEnv(
    "NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET",
    process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  ),
  messagingSenderId: requireEnv(
    "NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID",
    process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  ),
  appId: requireEnv(
    "NEXT_PUBLIC_FIREBASE_APP_ID",
    process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  ),
};

function getClientApp() {
  const existing = getApps()[0];
  if (existing) return existing;
  return initializeApp(firebaseConfig);
}

let auth: Auth | undefined;

/** Lazily initialized so importing this module never has side effects. */
export function getClientAuth(): Auth {
  if (!auth) {
    auth = getAuth(getClientApp());
  }
  return auth;
}

export const googleProvider = new GoogleAuthProvider();
