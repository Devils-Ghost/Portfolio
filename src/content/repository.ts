import { FirestoreRepository } from "./firestore/repository";
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

/**
 * Reads the typed modules in `content/local`. The Phase 1 source of truth,
 * and the fallback that keeps working after Phase 3 lands — if Firestore is
 * unreachable or misconfigured, flipping `CONTENT_SOURCE` back to `local`
 * restores a fully working site from data committed to the repo.
 */
export class LocalRepository implements ContentRepository {
  // Validated once per process, then reused. The local modules can't change
  // under us at runtime, so re-parsing on every section's read would buy
  // nothing but work — and every home-page section reads on every render.
  private cached: Content | undefined;

  private load(): Content {
    if (this.cached) return this.cached;

    // Parsed collection by collection rather than through `contentSchema` in
    // one go, so a failure names the file to open.
    this.cached = {
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
    return this.cached;
  }

  async getContent(): Promise<Content> {
    return this.load();
  }

  async getSkills(): Promise<Skill[]> {
    return this.load().skills;
  }
  async getProjects(): Promise<Project[]> {
    return this.load().projects;
  }
  async getExperiences(): Promise<Experience[]> {
    return this.load().experiences;
  }
  async getEngagements(): Promise<Engagement[]> {
    return this.load().engagements;
  }
  async getStories(): Promise<Story[]> {
    return this.load().stories;
  }
  async getAwards(): Promise<Award[]> {
    return this.load().awards;
  }
  async getSoftSkills(): Promise<SoftSkill[]> {
    return this.load().softSkills;
  }
  async getCertifications(): Promise<Certification[]> {
    return this.load().certifications;
  }
  async getPublications(): Promise<Publication[]> {
    return this.load().publications;
  }
  async getLifePhases(): Promise<LifePhase[]> {
    return this.load().phases;
  }
  async getSiteContent(): Promise<SiteContent> {
    return this.load().site;
  }
}

const localRepository = new LocalRepository();
// Constructed unconditionally but harmlessly: the class holds no state and
// nothing in it runs until a method is actually called, so instantiating it
// even under CONTENT_SOURCE=local costs nothing and needs no credentials.
const firestoreRepository = new FirestoreRepository();

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
