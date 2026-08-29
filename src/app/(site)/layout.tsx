import ClientWrapper from "@/components/layout/ClientWrapper";
import { getRepository } from "@/content/repository";

/**
 * Chrome for every public page: splash screen, navbar, footer, social rail
 * and custom scrollbar. `(site)` is a route group — the parentheses keep it
 * out of the URL, so this still serves `/`, `/about`, `/projects`, etc.
 *
 * It exists so that the `(admin)` group added in Phase 4 can render a plain
 * shell with none of this.
 *
 * The social links are read here, on the server, and handed down: the navbar,
 * footer and rail all show the same three links, and this is the one place
 * that knows what they are.
 */
export default async function SiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { socials } = await getRepository().getSiteContent();

  return <ClientWrapper socials={socials}>{children}</ClientWrapper>;
}
