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
import type {
  Award,
  Certification,
  Content,
  Engagement,
  Experience,
  LifePhase,
  Project,
  Publication,
  SiteContent,
  Skill,
  SoftSkill,
  Story,
} from "../types";
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
 * Deliberately no instance-level cache here, unlike LocalRepository's
 * `this.cached`: that one is safe only because a TS module can't change
 * under a running process. Firestore data changes whenever the admin panel
 * saves something, so caching belongs to Phase 3's Cache Components layer
 * (`"use cache"` + `cacheTag("content")`), which can actually be invalidated
 * on write. Baking in a manual cache here would just fight that system.
 */
export class FirestoreRepository implements ContentRepository {
  async getSkills(): Promise<Skill[]> {
    return loadCollection("skills", skillSchema);
  }
  async getProjects(): Promise<Project[]> {
    return loadCollection("projects", projectSchema);
  }
  async getExperiences(): Promise<Experience[]> {
    return loadCollection("experiences", experienceSchema);
  }
  async getEngagements(): Promise<Engagement[]> {
    return loadCollection("engagements", engagementSchema);
  }
  async getStories(): Promise<Story[]> {
    return loadCollection("stories", storySchema);
  }
  async getAwards(): Promise<Award[]> {
    return loadCollection("awards", awardSchema);
  }
  async getSoftSkills(): Promise<SoftSkill[]> {
    return loadCollection("softSkills", softSkillSchema);
  }
  async getCertifications(): Promise<Certification[]> {
    return loadCollection("certifications", certificationSchema);
  }
  async getPublications(): Promise<Publication[]> {
    return loadCollection("publications", publicationSchema);
  }
  async getLifePhases(): Promise<LifePhase[]> {
    return loadCollection("phases", lifePhaseSchema);
  }
  async getSiteContent(): Promise<SiteContent> {
    return loadSiteContent();
  }

  /**
   * TODO(you): implement this.
   * Every method above is independent and already exists on `this` — call
   * all eleven through `Promise.all` (same idea as `loadSiteContent`'s five
   * reads, just one level up) and assemble the results into a `Content`
   * object with keys: skills, projects, experiences, engagements, stories,
   * awards, softSkills, certifications, publications, phases, site.
   */
  async getContent(): Promise<Content> {
    const scanpshots = await Promise.all([
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
      skills: scanpshots[0],
      projects: scanpshots[1],
      experiences: scanpshots[2],
      engagements: scanpshots[3],
      stories: scanpshots[4],
      awards: scanpshots[5],
      softSkills: scanpshots[6],
      certifications: scanpshots[7],
      publications: scanpshots[8],
      phases: scanpshots[9],
      site: scanpshots[10],
    };
  }
}
