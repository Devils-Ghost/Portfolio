import { cacheLife, cacheTag } from "next/cache";
import { getDb } from "./client";
import type { ContentRepository } from "../repository";
import {
  awardSchema,
  certificationSchema,
  engagementSchema,
  experienceSchema,
  lifePhaseSchema,
  parseArray,
  parseCollection,
  projectSchema,
  publicationSchema,
  siteContentSchema,
  skillSchema,
  softSkillSchema,
  storySchema,
} from "../schema";
import type { z } from "zod";

/**
 * Fetches every document in a Firestore collection and validates it against
 * `schema`, the same way LocalRepository validates its TS modules (§D7).
 *
 * TODO(you): implement this.
 * - `name` is the collection name, e.g. "skills".
 * - Get the collection, `.get()` it (this is async — await it).
 * - The snapshot has a `.docs` array; each doc has `.data()`.
 * - Turn that into a plain array of raw data, then hand it to `parseArray`
 *   the same way LocalRepository's old `parse()` helper did.
 */
async function loadCollection<T>(
  name: string,
  schema: z.ZodType<T>,
): Promise<T[]> {
  const snapshot = await getDb().collection(name).get();
  const data = snapshot.docs.map((doc) => doc.data());
  return parseArray(name, schema, data);
}

/**
 * TODO(you): implement this.
 * The `/site` collection holds five fixed-ID documents: "hero", "about",
 * "socials", "availability", "seo" — one per SiteContent key.
 * - Fetch each of the five by `.doc(id).get()`.
 * - Build one object: `{ hero: ..., about: ..., socials: ..., ... }`.
 * - Validate the assembled object with `parseCollection("site", siteContentSchema, theObject)`.
 */
async function loadSiteContent(): Promise<z.infer<typeof siteContentSchema>> {
  const snapshots = await Promise.all([
    getDb().collection("site").doc("hero").get(),
    getDb().collection("site").doc("about").get(),
    getDb().collection("site").doc("socials").get(),
    getDb().collection("site").doc("availability").get(),
    getDb().collection("site").doc("seo").get(),
  ]);

  const data = {
    hero: snapshots[0].data(),
    about: snapshots[1].data(),
    // Stored wrapped as `{ items: [...] }` — a Firestore document's root
    // must be a map, and `socials` is the one SiteContent key that's an
    // array (see the seed script's matching comment on the write side).
    socials: snapshots[2].data()?.items,
    availability: snapshots[3].data(),
    seo: snapshots[4].data(),
  };

  return parseCollection("site", siteContentSchema, data);
}

/**
 * Reads from Firestore through the Admin SDK (§D3 — the client SDK never
 * enters the bundle; deny-all rules only govern client access).
 *
 * A plain object rather than a class — Next rejects "use cache" inline
 * inside a class instance method outright (see `content/repository.ts` for
 * the full explanation of why); object method properties are explicitly
 * fine, so each method here is directly its own cache boundary, with
 * `loadCollection`/`loadSiteContent` staying as uncached primitives
 * underneath.
 */
export const firestoreRepository: ContentRepository = {
  async getSkills() {
    "use cache";
    cacheTag("content");
    cacheLife("max");
    return loadCollection("skills", skillSchema);
  },
  async getProjects() {
    "use cache";
    cacheTag("content");
    cacheLife("max");
    return loadCollection("projects", projectSchema);
  },
  async getExperiences() {
    "use cache";
    cacheTag("content");
    cacheLife("max");
    return loadCollection("experiences", experienceSchema);
  },
  async getEngagements() {
    "use cache";
    cacheTag("content");
    cacheLife("max");
    return loadCollection("engagements", engagementSchema);
  },
  async getStories() {
    "use cache";
    cacheTag("content");
    cacheLife("max");
    return loadCollection("stories", storySchema);
  },
  async getAwards() {
    "use cache";
    cacheTag("content");
    cacheLife("max");
    return loadCollection("awards", awardSchema);
  },
  async getSoftSkills() {
    "use cache";
    cacheTag("content");
    cacheLife("max");
    return loadCollection("softSkills", softSkillSchema);
  },
  async getCertifications() {
    "use cache";
    cacheTag("content");
    cacheLife("max");
    return loadCollection("certifications", certificationSchema);
  },
  async getPublications() {
    "use cache";
    cacheTag("content");
    cacheLife("max");
    return loadCollection("publications", publicationSchema);
  },
  async getLifePhases() {
    "use cache";
    cacheTag("content");
    cacheLife("max");
    return loadCollection("phases", lifePhaseSchema);
  },
  async getSiteContent() {
    "use cache";
    cacheTag("content");
    cacheLife("max");
    return loadSiteContent();
  },

  // Composes already-cached properties above, so this itself needs no
  // caching of its own — every read inside it is independently cached and
  // tagged. `this.getSkills()` etc. relies on being called as
  // `firestoreRepository.getContent()` (always true here, via
  // `getRepository()`) rather than destructured and called standalone.
  async getContent() {
    const [
      skills,
      projects,
      experiences,
      engagements,
      stories,
      awards,
      softSkills,
      certifications,
      publications,
      phases,
      site,
    ] = await Promise.all([
      this.getSkills(),
      this.getProjects(),
      this.getExperiences(),
      this.getEngagements(),
      this.getStories(),
      this.getAwards(),
      this.getSoftSkills(),
      this.getCertifications(),
      this.getPublications(),
      this.getLifePhases(),
      this.getSiteContent(),
    ]);

    return {
      skills,
      projects,
      experiences,
      engagements,
      stories,
      awards,
      softSkills,
      certifications,
      publications,
      phases,
      site,
    };
  },
};
