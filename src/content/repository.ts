import { cacheLife, cacheTag } from "next/cache";
import { firestoreRepository } from "./firestore/repository";
import * as localContent from "./local";
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
} from "./schema";
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
} from "./types";

/**
 * The seam between the components and the data source (PROJECT_PLAN.md §D1).
 *
 * Every component reads content through this interface, and no component ever
 * imports Firebase. That's what lets Phase 1 do the whole restructure against
 * local TypeScript modules — no account, no network, no async debugging — and
 * Phase 3 swap the implementation without touching a single section.
 *
 * The methods are async even for `LocalRepository`, where nothing awaits, so
 * that the call sites are already shaped for a source that does.
 *
 * One collection per method, matching the Firestore layout in §3.6.
 */
export interface ContentRepository {
  getSkills(): Promise<Skill[]>;
  getProjects(): Promise<Project[]>;
  getExperiences(): Promise<Experience[]>;
  getEngagements(): Promise<Engagement[]>;
  getStories(): Promise<Story[]>;
  getAwards(): Promise<Award[]>;
  getSoftSkills(): Promise<SoftSkill[]>;
  getCertifications(): Promise<Certification[]>;
  getPublications(): Promise<Publication[]>;
  getLifePhases(): Promise<LifePhase[]>;
  getSiteContent(): Promise<SiteContent>;
  /**
   * The whole bundle in one call. The cross-linking selectors in
   * `selectors.ts` — `usagesOfSkill`, `evidenceFor`, the reverse lookups —
   * join across collections, so they need all of it. §D2: the entire content
   * set is well under 1 MB, which is why loading it in full and joining in
   * memory is the right shape rather than a compromise.
   */
  getContent(): Promise<Content>;
}

// Parsed once per process, then reused — the local modules can't change
// under us at runtime, so re-parsing on every read would buy nothing but
// work. Module-level rather than on an instance so it can be shared by
// `localRepository`'s cached methods below *and* by anything reading local
// content outside a running Next.js server (the seed script) — `cacheTag`/
// `"use cache"` only work inside Next's own runtime, so a plain Node script
// calling `localRepository.getContent()` directly would throw. Exported so
// that script can depend on this instead, deliberately bypassing the
// `ContentRepository` abstraction: the seed script is inherently
// local-only by definition (it always reads local and writes to Firestore),
// so there's no provider-agnosticism for it to preserve.
let localCache: Content | undefined;

export function loadLocalContent(): Content {
  if (localCache) return localCache;

  // Parsed collection by collection rather than through `contentSchema` in
  // one go, so a failure names the file to open.
  localCache = {
    skills: parseArray("skills", skillSchema, localContent.skills),
    projects: parseArray("projects", projectSchema, localContent.projects),
    experiences: parseArray(
      "experiences",
      experienceSchema,
      localContent.experiences,
    ),
    engagements: parseArray(
      "engagements",
      engagementSchema,
      localContent.engagements,
    ),
    stories: parseArray("stories", storySchema, localContent.stories),
    awards: parseArray("awards", awardSchema, localContent.awards),
    softSkills: parseArray(
      "softSkills",
      softSkillSchema,
      localContent.softSkills,
    ),
    certifications: parseArray(
      "certifications",
      certificationSchema,
      localContent.certifications,
    ),
    publications: parseArray(
      "publications",
      publicationSchema,
      localContent.publications,
    ),
    phases: parseArray("phases", lifePhaseSchema, localContent.phases),
    site: parseCollection("site", siteContentSchema, localContent.site),
  };
  return localCache;
}

/**
 * Reads the typed modules in `content/local`. The Phase 1 source of truth,
 * and the fallback that keeps working after Phase 3 lands — if Firestore is
 * unreachable or misconfigured, flipping `CONTENT_SOURCE` back to `local`
 * restores a fully working site from data committed to the repo.
 *
 * A plain object rather than a class: Next rejects "use cache" inline
 * inside a class instance method outright — "It is not allowed to define
 * inline 'use cache' annotated class instance methods... use functions,
 * object method properties, or static class methods instead." Object
 * method properties are explicitly fine, so each method here just *is* its
 * own cache boundary directly, with no separate module-level function to
 * delegate to. `local` still counts as "content that needs caching" here
 * even though the data itself never changes at runtime — this cache exists
 * to satisfy Cache Components' structural rule (no uncached data access
 * outside Suspense in a dynamic route, PROJECT_PLAN.md Phase 3), not
 * because local reads are slow.
 */
export const localRepository: ContentRepository = {
  async getContent() {
    "use cache";
    cacheTag("content");
    cacheLife("max");
    return loadLocalContent();
  },
  async getSkills() {
    "use cache";
    cacheTag("content");
    cacheLife("max");
    return loadLocalContent().skills;
  },
  async getProjects() {
    "use cache";
    cacheTag("content");
    cacheLife("max");
    return loadLocalContent().projects;
  },
  async getExperiences() {
    "use cache";
    cacheTag("content");
    cacheLife("max");
    return loadLocalContent().experiences;
  },
  async getEngagements() {
    "use cache";
    cacheTag("content");
    cacheLife("max");
    return loadLocalContent().engagements;
  },
  async getStories() {
    "use cache";
    cacheTag("content");
    cacheLife("max");
    return loadLocalContent().stories;
  },
  async getAwards() {
    "use cache";
    cacheTag("content");
    cacheLife("max");
    return loadLocalContent().awards;
  },
  async getSoftSkills() {
    "use cache";
    cacheTag("content");
    cacheLife("max");
    return loadLocalContent().softSkills;
  },
  async getCertifications() {
    "use cache";
    cacheTag("content");
    cacheLife("max");
    return loadLocalContent().certifications;
  },
  async getPublications() {
    "use cache";
    cacheTag("content");
    cacheLife("max");
    return loadLocalContent().publications;
  },
  async getLifePhases() {
    "use cache";
    cacheTag("content");
    cacheLife("max");
    return loadLocalContent().phases;
  },
  async getSiteContent() {
    "use cache";
    cacheTag("content");
    cacheLife("max");
    return loadLocalContent().site;
  },
};

/**
 * The one place the data source is chosen (§D1). `local` stays the default
 * so a missing env var can never take the public site down — it falls back
 * to data that ships with the deployment (§8.11 — the escape hatch stays
 * working forever, on purpose).
 */
export function getRepository(): ContentRepository {
  const source = process.env.CONTENT_SOURCE ?? "local";
  if (source === "firestore") return firestoreRepository;
  if (source !== "local") {
    throw new Error(
      `CONTENT_SOURCE="${source}" is not a known provider. Use "local" or ` +
        `"firestore".`,
    );
  }
  return localRepository;
}

/** Shorthand for the common case: one section, the whole bundle, joined. */
export const getContent = (): Promise<Content> => getRepository().getContent();
