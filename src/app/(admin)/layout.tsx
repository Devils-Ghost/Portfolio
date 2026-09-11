/**
 * (admin) route group opts out of all `(site)` chrome — no splash, no
 * navbar, no footer, no custom scrollbar (PROJECT_PLAN.md §4). Root
 * layout.tsx already sets the dark background and base typography, so
 * there's nothing left for this layout to do until the dashboard shell
 * (sidebar, auth gate) lands later in this phase.
 */
export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <div className="min-h-full">{children}</div>;
}
