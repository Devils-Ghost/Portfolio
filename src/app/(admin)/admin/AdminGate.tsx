import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { readSession, SESSION_COOKIE_NAME } from "@/lib/firebase/session";
import { requireEnv } from "@/lib/utils";

/**
 * The actual gate. Reads the session cookie, verifies it against Firebase,
 * and checks the resulting uid against ADMIN_UID before rendering anything
 * underneath it. Split out from admin/layout.tsx so the layout can wrap it
 * in a <Suspense> boundary — cookies() is a dynamic API, and Cache
 * Components rejects the build if a dynamic API is read with no Suspense
 * boundary of its own, the same rule that shaped ModalDynamicGate in
 * Phase 3 (docs/plan-progress.md, Phase 3 Stage 5).
 */
export default async function AdminGate({
  children,
}: {
  children: React.ReactNode;
}) {
  const store = await cookies();
  const session = await readSession(store.get(SESSION_COOKIE_NAME)?.value);

  if (!session || session.uid !== requireEnv("ADMIN_UID", process.env.ADMIN_UID)) {
    redirect("/login");
  }

  return <>{children}</>;
}
