/**
 * Seeds Firestore from content/local/* (PROJECT_PLAN.md Phase 3).
 *
 * Idempotent: every write is `.doc(id).set(data)` against a stable,
 * human-readable ID (§3.3.5), so re-running this produces the same end
 * state rather than duplicates. Upsert only — it never deletes a Firestore
 * doc whose local counterpart was removed; that's Phase 4 admin territory.
 *
 *   npx tsx --env-file=.env.local scripts/seed-firestore.ts
 */
import { loadLocalContent } from "../src/content/repository";
import { getDb } from "../src/content/firestore/client";

async function main() {
  // Already Zod-validated — loadLocalContent() parses through the same
  // schemas firestoreRepository reads back through (§D7). Reads the raw
  // loader directly rather than going through `localRepository.getContent()`:
  // that method's `"use cache"`/`cacheTag()` calls only work inside a
  // running Next.js server, and this is a plain standalone script.
  const content = loadLocalContent();
  const db = getDb();

  // TODO(you): build one WriteBatch here.
  // - `db.batch()` gives you the batch object.
  // - For each of the ten array collections (content.skills, content.projects,
  //   ...), queue `batch.set(db.collection("<name>").doc(item.id), item)`
  //   for every item. The Firestore collection name should match what
  //   FirestoreRepository already reads from (check content/firestore/repository.ts
  //   if you don't remember the exact names — "phases" is the one that
  //   doesn't match its Content key, `content.phases`, 1:1 with a type name).
  // - For `content.site`, queue one `.set()` per key (hero/about/socials/
  //   availability/seo) into the "site" collection, using the key itself as
  //   the doc ID — same shape as loadSiteContent's read side, just inverted.
  // - `await batch.commit()` once everything's queued.
  const batch = db.batch();

  content.skills.forEach((skill) =>
    batch.set(db.collection("skills").doc(skill.id), skill),
  );
  content.projects.forEach((project) =>
    batch.set(db.collection("projects").doc(project.id), project),
  );
  content.experiences.forEach((experience) =>
    batch.set(db.collection("experiences").doc(experience.id), experience),
  );
  content.engagements.forEach((engagement) =>
    batch.set(db.collection("engagements").doc(engagement.id), engagement),
  );
  content.stories.forEach((story) =>
    batch.set(db.collection("stories").doc(story.id), story),
  );
  content.awards.forEach((award) =>
    batch.set(db.collection("awards").doc(award.id), award),
  );
  content.softSkills.forEach((softSkill) =>
    batch.set(db.collection("softSkills").doc(softSkill.id), softSkill),
  );
  content.certifications.forEach((certification) =>
    batch.set(
      db.collection("certifications").doc(certification.id),
      certification,
    ),
  );
  content.publications.forEach((publication) =>
    batch.set(db.collection("publications").doc(publication.id), publication),
  );
  content.phases.forEach((phase) =>
    batch.set(db.collection("phases").doc(phase.id), phase),
  );
  // Firestore document data must be a map at the root — arrays are only
  // valid as a field *inside* a document. `socials` is the one SiteContent
  // key that's an array, so it's stored wrapped (`{ items: [...] }`) rather
  // than as the document itself; `loadSiteContent()` unwraps it back out.
  Object.entries(content.site).forEach(([key, value]) => {
    const data = Array.isArray(value) ? { items: value } : value;
    batch.set(db.collection("site").doc(key), data);
  });

  await batch.commit();

  console.log("Seed complete.");
}

main().catch((err) => {
  console.error("Seed FAILED:", err);
  process.exit(1);
});
