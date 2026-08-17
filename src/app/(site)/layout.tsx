import ClientWrapper from "@/components/layout/ClientWrapper";

/**
 * Chrome for every public page: splash screen, navbar, footer, social rail
 * and custom scrollbar. `(site)` is a route group — the parentheses keep it
 * out of the URL, so this still serves `/`, `/about`, `/projects`, etc.
 *
 * It exists so that the `(admin)` group added in Phase 4 can render a plain
 * shell with none of this.
 */
export default function SiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <ClientWrapper>{children}</ClientWrapper>;
}
