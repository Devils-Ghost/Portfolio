import DetailModalHost from "@/components/modals/DetailModalHost";
import MainLayout from "@/components/layout/MainLayout";
import { IntroProvider } from "@/context/IntroContext";
import { getContent } from "@/content/repository";

/**
 * Chrome for every public page: splash screen, navbar, footer, social rail,
 * custom scrollbar, and the one global modal layer. `(site)` is a route
 * group — the parentheses keep it out of the URL, so this still serves `/`,
 * `/about`, `/projects`, etc.
 *
 * It exists so that the `(admin)` group added in Phase 4 can render a plain
 * shell with none of this.
 *
 * The two client-side providers — `DetailModalHost` and `IntroProvider` —
 * are composed directly here rather than through an intermediate wrapper
 * component: there are exactly two of them, neither is `(site)`-specific
 * plumbing that's likely to grow (Phase 3/4's additions are server-only or
 * scoped to `(admin)`), and this Server Component is the one place that
 * already has to know the full tree regardless. `MainLayout` is the child,
 * not a provider itself — it only consumes `IntroContext` to gate the
 * splash/navbar/footer.
 *
 * The whole content bundle is read here, on the server, and handed down.
 * `socials` feeds the navbar, footer and rail, which all show the same three
 * links; the rest feeds `DetailModalHost`, whose cross-collection lookups
 * (`usagesOfSkill` and friends) need the full bundle, not one collection at
 * a time.
 *
 * `force-dynamic` makes every public page render per request instead of
 * being statically generated at build time — required for a deep-linked
 * modal (`?d=project:x`) to resolve on the server, in the HTML the first
 * response carries, rather than only after client-side hydration reads the
 * query string. Phase 3's `cacheComponents` + `"use cache"` replaces this
 * with per-content-tag caching instead of an all-or-nothing switch.
 */
export const dynamic = "force-dynamic";

export default async function SiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const content = await getContent();

  return (
    <DetailModalHost content={content}>
      <IntroProvider>
        <MainLayout socials={content.site.socials}>{children}</MainLayout>
      </IntroProvider>
    </DetailModalHost>
  );
}
