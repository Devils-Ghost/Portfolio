import { cookies } from "next/headers";
import { readSession, SESSION_COOKIE_NAME } from "@/lib/firebase/session";
import SignOutButton from "./SignOutButton";

/**
 * Placeholder — the real dashboard (counts, drafts, orphan skills, unread
 * enquiries) is a later checklist item in this phase. This exists so the
 * sign-in → gate → sign-out loop has somewhere real to land and be tested.
 */
export default async function AdminDashboardPage() {
  const store = await cookies();
  const session = await readSession(store.get(SESSION_COOKIE_NAME)?.value);

  return (
    <main className="p-8">
      <h1 className="text-lg font-semibold text-white">Admin dashboard</h1>
      <p className="mt-2 text-sm text-gray-400">
        Signed in as <span className="font-mono text-accent">{session?.uid}</span>.
      </p>
      <p className="mt-1 text-sm text-meta">
        Placeholder — CRUD, the featured manager, and the inbox land later in
        this phase.
      </p>
      <SignOutButton />
    </main>
  );
}
