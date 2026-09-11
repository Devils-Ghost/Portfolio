"use client";

import { signOut } from "firebase/auth";
import { getClientAuth } from "@/lib/firebase/browser-auth";
import { signOutAction } from "./actions";

export default function SignOutButton() {
  async function handleSignOut() {
    // Clear both halves of the session: the client-side Firebase Auth state
    // and the server-side cookie AdminGate actually checks.
    await signOut(getClientAuth()).catch(() => {});
    await signOutAction();
  }

  return (
    <button
      onClick={handleSignOut}
      className="mt-6 rounded-lg border border-white/10 px-4 py-2 text-sm text-gray-300 hover:bg-white/5"
    >
      Sign out
    </button>
  );
}
