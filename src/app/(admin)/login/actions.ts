"use server";

import { cookies } from "next/headers";
import { mintSessionCookie, SESSION_COOKIE_NAME } from "@/lib/firebase/session";

/**
 * Exchanges a freshly-signed-in client ID token for a session cookie. Throws
 * (and mints nothing) if the signed-in account isn't the allowed admin —
 * the caller is responsible for showing that error and clearing the client
 * -side Firebase sign-in so the button is safe to press again.
 */
export async function signInAction(idToken: string): Promise<void> {
  const { cookie, maxAgeSeconds } = await mintSessionCookie(idToken);
  const store = await cookies();

  store.set({
    name: SESSION_COOKIE_NAME,
    value: cookie,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: maxAgeSeconds,
  });
}
