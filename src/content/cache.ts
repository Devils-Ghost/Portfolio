import { revalidateTag, updateTag } from "next/cache";

/**
 * Invalidates the `"content"` cache tag (PROJECT_PLAN.md Phase 3) that every
 * repository read is tagged with (§D1 — both `LocalRepository` and
 * `FirestoreRepository`, so a stray call under `CONTENT_SOURCE=local` is
 * harmless, just a no-op cache miss on the next read).
 *
 * Two invalidation strategies, not interchangeable — picking the wrong one
 * either throws or silently doesn't do what you expect:
 *
 * - `invalidateContentNow` → `updateTag`. Expires the cache immediately, so
 *   the very next read sees the change — "read your own writes." Legal only
 *   from a Server Action; this is what Phase 4's admin "Save" button calls,
 *   so an edit is visible the moment you land back on the list, not on the
 *   next refresh.
 * - `invalidateContentSoon` → `revalidateTag`. Stale-while-revalidate: the
 *   next visitor gets the old cached version instantly while a fresh one
 *   builds behind them. Legal only from a Route Handler or background job —
 *   for a future webhook (e.g. a CMS or Firestore trigger calling in from
 *   outside a Server Action context).
 *
 * Neither has a real caller yet — Phase 4 doesn't exist. Wired now so the
 * cache-tag name and invalidation semantics are decided once, here, instead
 * of every future call site re-deriving "which function, which args."
 */
export function invalidateContentNow(): void {
  updateTag("content");
}

export function invalidateContentSoon(): void {
  revalidateTag("content", "max");
}
