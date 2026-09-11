import { Suspense } from "react";
import AdminGate from "./AdminGate";

/**
 * Every route under /admin renders through AdminGate first. Nothing here
 * is worth statically prerendering — it's a single-user private dashboard,
 * not public content — so there's no shell to protect, only the dynamic
 * cookie check itself, which is why the fallback is a plain loading state
 * rather than an attempt to keep anything static underneath it.
 */
export default function ProtectedAdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center text-sm text-gray-500">
          Loading…
        </div>
      }
    >
      <AdminGate>{children}</AdminGate>
    </Suspense>
  );
}
