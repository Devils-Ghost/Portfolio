"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signInWithPopup, signOut } from "firebase/auth";
import { getClientAuth, googleProvider } from "@/lib/firebase/browser-auth";
import { signInAction } from "./actions";

/**
 * Deliberately ungated, permanently — this is the one (admin) route the
 * auth gate (admin/layout.tsx) must never wrap, or nobody could ever sign
 * in. A plain client component: nothing on this page needs server-side
 * data, so there's no benefit to splitting a Server Component wrapper off
 * from the button/popup logic — everything here is interactive already.
 */
export default function AdminLoginPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSignIn() {
    setError(null);
    setLoading(true);
    try {
      const result = await signInWithPopup(getClientAuth(), googleProvider);
      const idToken = await result.user.getIdToken();
      await signInAction(idToken);
      router.push("/admin");
    } catch (err) {
      // The account that just signed in client-side wasn't authorized (or
      // something else failed) — sign it back out so the button is a clean
      // retry rather than leaving a rejected session sitting in the client.
      await signOut(getClientAuth()).catch(() => {});
      setError(err instanceof Error ? err.message : "Sign-in failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-md rounded-2xl bg-surface p-8 text-center">
        <h1 className="text-lg font-semibold text-white">Admin sign-in</h1>
        <p className="mt-2 text-sm text-gray-400">
          Sign in with the authorized Google account.
        </p>

        <button
          onClick={handleSignIn}
          disabled={loading}
          className="mt-6 w-full rounded-lg bg-accent py-2 text-sm font-medium text-white hover:bg-accent-soft disabled:opacity-50"
        >
          {loading ? "Signing in…" : "Sign in with Google"}
        </button>

        {error && <p className="mt-4 text-xs text-red-400">{error}</p>}
      </div>
    </main>
  );
}
