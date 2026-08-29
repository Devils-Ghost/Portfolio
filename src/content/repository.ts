import * as localContent from "./local";
import {
  awardSchema,
  certificationSchema,
  engagementSchema,
  experienceSchema,
  lifePhaseSchema,
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
import { z } from "zod";

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
      skills: parse("skills", skillSchema, localContent.skills),
      projects: parse("projects", projectSchema, localContent.projects),
      experiences: parse(
        "experiences",
        experienceSchema,
        localContent.experiences,
      ),
      engagements: parse(
        "engagements",
        engagementSchema,
        localContent.engagements,
      ),
      stories: parse("stories", storySchema, localContent.stories),
      awards: parse("awards", awardSchema, localContent.awards),
      softSkills: parse("softSkills", softSkillSchema, localContent.softSkills),
      certifications: parse(
        "certifications",
        certificationSchema,
        localContent.certifications,
      ),
      publications: parse(
        "publications",
        publicationSchema,
        localContent.publications,
      ),
      phases: parse("phases", lifePhaseSchema, localContent.phases),
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

/** `parseCollection` for an array, so the error names the collection once. */
function parse<T>(label: string, schema: z.ZodType<T>, value: unknown): T[] {
  return parseCollection(label, z.array(schema), value);
}

const localRepository = new LocalRepository();

/**
 * The one place the data source is chosen (§D1). Phase 3 adds a
 * `FirestoreRepository` branch here and nothing else in the app changes.
 *
 * `local` stays the default so a missing env var can never take the public
 * site down — it falls back to data that ships with the deployment.
 */
export function getRepository(): ContentRepository {
  const source = process.env.CONTENT_SOURCE ?? "local";
  if (source !== "local") {
    throw new Error(
      `CONTENT_SOURCE="${source}" is not implemented yet — Phase 3 adds the ` +
        `Firestore repository. Unset it, or set it to "local".`,
    );
  }
  return localRepository;
}

/** Shorthand for the common case: one section, the whole bundle, joined. */
export const getContent = (): Promise<Content> => getRepository().getContent();
