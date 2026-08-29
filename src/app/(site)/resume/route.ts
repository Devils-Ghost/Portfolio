import { redirect } from "next/navigation";

/**
 * `/resume` — the stable, brandable download URL that `site.hero.resumeUrl`
 * points at.
 *
 * PROJECT_PLAN.md Phase 7 has this serving the PDF itself with a tracked
 * download. Until then it forwards to the file's current home, so the URL in
 * the content layer is real from today and the hero button keeps downloading
 * exactly what it downloaded before.
 *
 * Deliberately a temporary (307) redirect, not a permanent one: browsers
 * cache a 308 indefinitely, and Phase 7 replaces this handler with a real
 * response. A visitor who loaded the permanent version would keep hitting
 * Google Drive forever.
 *
 * The file URL lives here rather than in `content/local/site.ts` because it's
 * where the asset happens to be hosted this month, not something anyone edits
 * as content — and it disappears entirely once the PDF is served from the
 * repo.
 */
const RESUME_FILE_URL =
  "https://drive.google.com/uc?export=download&id=17RYy9hctO-rfH_bKPNK46Mf5frHhoX7m";

export function GET() {
  redirect(RESUME_FILE_URL);
}
