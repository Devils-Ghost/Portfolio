import DetailModalHost from "@/components/modals/DetailModalHost";
import MainLayout from "@/components/layout/MainLayout";
import { IntroProvider } from "@/context/IntroContext";
import { getContent } from "@/content/repository";
import { connection } from "next/server";

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
 * Content caching is now per-content-tag (Phase 3's Cache Components —
 * `"use cache"` + `cacheTag("content")` inside the repository reads
 * themselves) rather than the all-or-nothing `force-dynamic` this route
 * used before that existed — `force-dynamic` had to go regardless, since
 * Cache Components rejects it outright as incompatible.
 *
 * `getContent()` below is cached (fast, no real per-request cost) and
 * renders immediately — no Suspense needed for it. The deep-linked-modal
 * requirement is different: under Cache Components, a Client Component's
 * own `useSearchParams()` no longer implicitly signals "this needs a real
 * per-request render" the way it did pre-Cache-Components — verified by
 * testing without any dynamic API called anywhere and finding no
 * `role="dialog"` in a deep link's raw HTML response even with `?d=` set,
 * only after client hydration. An explicit `connection()` is what supplies
 * that signal now. It can't go at this component's own top level, though:
 * `connection()` blocks *everything* not wrapped in a `<Suspense>` of its
 * own — verified by trying exactly that and getting the same "uncached
 * data" build error for every route, a stricter version of the problem it
 * was meant to fix. So it's isolated to `ModalDynamicGate` (below), passed
 * into `DetailModalHost`'s existing Suspense boundary (the one already
 * wrapping `ModalRenderer`, Phase 2) as a sibling rather than wrapping
 * `children` — everything else keeps rendering immediately from the cached
 * shell.
 */
export default async function SiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const content = await getContent();

  return (
    <DetailModalHost content={content} dynamicGate={<ModalDynamicGate />}>
      <IntroProvider>
        <MainLayout socials={content.site.socials}>{children}</MainLayout>
      </IntroProvider>
    </DetailModalHost>
  );
}

/**
 * Exists to do exactly one thing: call `connection()`, sharing a Suspense
 * boundary with `ModalRenderer` so both resolve as one dynamic hole rather
 * than two independent ones — only the modal-resolving part of the page is
 * treated as per-request dynamic, not `children`, which stays part of the
 * cached shell. Can't live inside `DetailModalHost` itself (a Client
 * Component) since `connection()` is server-only; passed in as the
 * `dynamicGate` prop instead, the standard way a Server Component parent
 * hands a Client Component a server-rendered slot.
 */
async function ModalDynamicGate() {
  await connection();
  return null;
}
