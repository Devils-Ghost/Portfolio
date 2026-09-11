import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Shared by both the browser (lib/firebase/browser-auth.ts) and server
 * (lib/firebase/admin.ts) Firebase entry points. Deliberately just this
 * one pure, side-effect-free function — nothing Node- or browser-specific —
 * so sharing it doesn't reopen the client/server boundary those two files
 * are kept separate to enforce. Takes the value rather than looking it up
 * itself: the browser side must reference each `process.env.NEXT_PUBLIC_*`
 * as a literal at its own call site for Next's build-time inlining to see
 * it, so the lookup can't be hidden inside a shared helper.
 */
export function requireEnv(name: string, value: string | undefined): string {
  if (!value) {
    throw new Error(
      `Missing required env var: ${name}. Check .env.local (or Vercel's ` +
        `project env vars in production).`,
    );
  }
  return value;
}
