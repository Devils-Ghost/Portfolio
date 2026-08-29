import { z } from "zod";
import type {
  Award,
  Certification,
  Content,
  DateMark,
  DateRange,
  Engagement,
  Experience,
  ImageRef,
  LifePhase,
  Project,
  Publication,
  ResourceLink,
  SiteContent,
  Skill,
  SoftSkill,
  Story,
} from "./types";

/**
 * Zod mirrors of `types.ts` (PROJECT_PLAN.md §D7).
 *
 * These exist so that content crossing a boundary we don't control — Firestore
 * in Phase 3, the admin panel's forms in Phase 4 — fails loudly with a field
 * path instead of quietly rendering an empty card. `LocalRepository` runs the
 * same schemas over the local modules, which means a typo in `content/local`
 * is caught by `npm run check:content` rather than by looking at the page.
 *
 * The interfaces in `types.ts` stay the source of truth: every schema below is
 * pinned to its interface by a compile-time equality assertion, so a field
 * added to one and not the other is a `tsc` error rather than a silent drift.
 */

// ─── Mirror assertion ────────────────────────────────────────────
// `true` only when the two types are mutually assignable. Annotating each
// schema as `z.ZodType<T>` would check the same thing but erase `.shape`,
// which the Phase 4 admin forms need for field-level validation.
type Exact<A, B> = [A] extends [B] ? ([B] extends [A] ? true : false) : false;
const mirrors = <S, T>(ok: Exact<S, T>) => void ok;

// ─── Primitives ──────────────────────────────────────────────────
const id = z.string().min(1);
const slug = z
  .string()
  .min(1)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "must be lowercase kebab-case");

export const dateMarkSchema = z.object({
  year: z.number().int().min(1900).max(2200),
  month: z.number().int().min(1).max(12),
});
mirrors<z.infer<typeof dateMarkSchema>, DateMark>(true);

export const dateRangeSchema = z.object({
  start: dateMarkSchema,
  // `null` is "Present" — deliberately not optional, so the distinction
  // between "still going" and "we forgot to fill this in" survives a round
  // trip through Firestore.
  end: dateMarkSchema.nullable(),
});
mirrors<z.infer<typeof dateRangeSchema>, DateRange>(true);

export const linkKindSchema = z.enum([
  "github",
  "live",
  "video",
  "report",
  "paper",
  "credential",
  "external",
]);

export const resourceLinkSchema = z.object({
  kind: linkKindSchema,
  url: z.string().url(),
  label: z.string().optional(),
});
mirrors<z.infer<typeof resourceLinkSchema>, ResourceLink>(true);

export const visibilitySchema = z.enum(["public", "draft"]);

export const imageRefSchema = z.object({
  src: z.string().min(1),
  alt: z.string(),
  width: z.number().int().positive().optional(),
  height: z.number().int().positive().optional(),
});
mirrors<z.infer<typeof imageRefSchema>, ImageRef>(true);

/**
 * Kept in step with `IconName` in types.ts and the `ICONS` registry in
 * lib/icons.ts by the assertions in that file — a name here that the registry
 * can't resolve is a build error, not a blank square on the page.
 */
export const iconNameSchema = z.enum([
  "flag",
  "trophy",
  "medal",
  "star",
  "award",
  "code",
  "shield",
  "bug",
  "cloud",
  "cpu",
  "users",
  "graduation",
  "wrench",
  "search",
  "lock",
  "zap",
  "compass",
  "handshake",
]);

// ─── Skill ───────────────────────────────────────────────────────
export const skillCategorySchema = z.enum([
  "language",
  "framework",
  "platform",
  "tool",
  "domain",
  "practice",
]);
export const skillLevelSchema = z.enum(["core", "working", "familiar"]);

export const skillSchema = z.object({
  id,
  slug,
  name: z.string().min(1),
  category: skillCategorySchema,
  level: skillLevelSchema,
  featured: z.boolean(),
  order: z.number(),
  blurb: z.string().optional(),
  aliases: z.array(z.string()).optional(),
  parentId: id.optional(),
});
mirrors<z.infer<typeof skillSchema>, Skill>(true);

// ─── Project ─────────────────────────────────────────────────────
export const projectStatusSchema = z.enum([
  "shipped",
  "in-progress",
  "archived",
  "concept",
]);
export const projectContextKindSchema = z.enum([
  "personal",
  "academic",
  "professional",
  "hackathon",
  "research",
]);

export const projectSchema = z.object({
  id,
  slug,
  title: z.string().min(1),
  summary: z.string().min(1),
  body: z.string(),
  highlights: z.array(z.string()).optional(),
  skillIds: z.array(id),
  links: z.array(resourceLinkSchema),
  status: projectStatusSchema,
  date: dateRangeSchema,
  context: z
    .object({
      kind: projectContextKindSchema,
      experienceId: id.optional(),
    })
    .optional(),
  phaseId: id.optional(),
  coverImage: imageRefSchema.optional(),
  featured: z.boolean(),
  order: z.number(),
  visibility: visibilitySchema,
});
mirrors<z.infer<typeof projectSchema>, Project>(true);

// ─── Experience ──────────────────────────────────────────────────
export const experienceTypeSchema = z.enum([
  "full-time",
  "internship",
  "academic",
  "research",
  "volunteer",
  "contract",
  "part-time",
]);
export const workModeSchema = z.enum(["onsite", "hybrid", "remote"]);

export const experienceSchema = z.object({
  id,
  slug,
  role: z.string().min(1),
  org: z.string().min(1),
  orgUrl: z.string().url().optional(),
  type: experienceTypeSchema,
  mode: workModeSchema.optional(),
  location: z.string(),
  date: dateRangeSchema,
  summary: z.string().min(1),
  body: z.string(),
  achievements: z.array(z.string()).optional(),
  skillIds: z.array(id),
  links: z.array(resourceLinkSchema),
  phaseId: id,
  featured: z.boolean(),
  order: z.number(),
  visibility: visibilitySchema,
});
mirrors<z.infer<typeof experienceSchema>, Experience>(true);

// ─── Engagement ──────────────────────────────────────────────────
export const engagementTypeSchema = z.enum([
  "competition",
  "hackathon",
  "open-source",
  "leadership",
  "community",
  "sport",
]);

export const engagementSchema = z.object({
  id,
  slug,
  title: z.string().min(1),
  org: z.string().min(1),
  type: engagementTypeSchema,
  date: dateRangeSchema,
  summary: z.string().min(1),
  // Optional now so engagements can become clickable later without a
  // migration — see §3.3 ④.
  body: z.string().optional(),
  iconName: iconNameSchema,
  skillIds: z.array(id).optional(),
  links: z.array(resourceLinkSchema).optional(),
  phaseId: id.optional(),
  featured: z.boolean(),
  order: z.number(),
  visibility: visibilitySchema,
});
mirrors<z.infer<typeof engagementSchema>, Engagement>(true);

// ─── Story ───────────────────────────────────────────────────────
export const storySchema = z.object({
  id,
  slug,
  title: z.string().min(1),
  headline: z.string().min(1),
  org: z.string().optional(),
  type: z.string().min(1),
  date: dateMarkSchema,
  star: z
    .object({
      situation: z.string(),
      task: z.string(),
      action: z.string(),
      result: z.string(),
    })
    .optional(),
  body: z.string(),
  relatedProjectIds: z.array(id).optional(),
  relatedExperienceIds: z.array(id).optional(),
  skillIds: z.array(id).optional(),
  iconName: iconNameSchema,
  readingMinutes: z.number().int().positive().optional(),
  featured: z.boolean(),
  order: z.number(),
  visibility: visibilitySchema,
});
mirrors<z.infer<typeof storySchema>, Story>(true);

// ─── Award ───────────────────────────────────────────────────────
export const awardSchema = z.object({
  id,
  slug,
  title: z.string().min(1),
  issuer: z.string().min(1),
  date: dateMarkSchema,
  rank: z.string().optional(),
  summary: z.string().min(1),
  body: z.string().optional(),
  sourceExperienceId: id.optional(),
  sourceProjectIds: z.array(id).optional(),
  storyId: id.optional(),
  skillIds: z.array(id).optional(),
  links: z.array(resourceLinkSchema).optional(),
  iconName: iconNameSchema,
  featured: z.boolean(),
  order: z.number(),
  visibility: visibilitySchema,
});
mirrors<z.infer<typeof awardSchema>, Award>(true);

// ─── Soft skill ──────────────────────────────────────────────────
export const softSkillSchema = z.object({
  id,
  slug,
  label: z.string().min(1),
  description: z.string().optional(),
  evidenceStoryIds: z.array(id).optional(),
  evidenceExperienceIds: z.array(id).optional(),
  evidenceEngagementIds: z.array(id).optional(),
  iconName: iconNameSchema.optional(),
  featured: z.boolean(),
  order: z.number(),
});
mirrors<z.infer<typeof softSkillSchema>, SoftSkill>(true);

// ─── Certification ───────────────────────────────────────────────
export const certificationSchema = z.object({
  id,
  name: z.string().min(1),
  issuer: z.string().min(1),
  issued: dateMarkSchema,
  expires: dateMarkSchema.nullable().optional(),
  credentialUrl: z.string().url().optional(),
  credentialId: z.string().optional(),
  skillIds: z.array(id).optional(),
  featured: z.boolean(),
  order: z.number(),
});
mirrors<z.infer<typeof certificationSchema>, Certification>(true);

// ─── Life phase ──────────────────────────────────────────────────
export const lifePhaseSchema = z.object({
  id,
  slug,
  label: z.string().min(1),
  subtitle: z.string().optional(),
  date: dateRangeSchema,
  order: z.number(),
  accent: z
    .string()
    .regex(/^#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/, "must be a hex colour")
    .optional(),
});
mirrors<z.infer<typeof lifePhaseSchema>, LifePhase>(true);

// ─── Publication ─────────────────────────────────────────────────
export const publicationSchema = z.object({
  id,
  slug,
  title: z.string().min(1),
  venue: z.string().min(1),
  authors: z.array(z.string()),
  date: dateMarkSchema,
  summary: z.string().min(1),
  links: z.array(resourceLinkSchema),
  relatedProjectIds: z.array(id).optional(),
  skillIds: z.array(id).optional(),
  featured: z.boolean(),
  order: z.number(),
});
mirrors<z.infer<typeof publicationSchema>, Publication>(true);

// ─── Site singletons ─────────────────────────────────────────────
export const socialKindSchema = z.enum([
  "github",
  "linkedin",
  "email",
  "x",
  "scholar",
]);

export const siteContentSchema = z.object({
  hero: z.object({
    headlines: z.array(z.string()).min(1),
    roleLines: z.array(z.string()).min(1),
    statuses: z.array(z.string()).min(1),
    resumeUrl: z.string().optional(),
  }),
  about: z.object({
    greeting: z.string().min(1),
    short: z.string().min(1),
    long: z.string().min(1),
    journey: z.array(
      z.object({ heading: z.string().min(1), body: z.string().min(1) }),
    ),
  }),
  socials: z.array(
    z.object({
      kind: socialKindSchema,
      // `mailto:` is a legitimate social link, so this can't be `.url()`.
      url: z.string().min(1),
      label: z.string().min(1),
    }),
  ),
  availability: z.object({
    open: z.boolean(),
    label: z.string().min(1),
    location: z.string().min(1),
  }),
  seo: z.object({
    title: z.string().min(1),
    description: z.string().min(1),
    ogImage: z.string().optional(),
  }),
});
mirrors<z.infer<typeof siteContentSchema>, SiteContent>(true);

// ─── The whole bundle ────────────────────────────────────────────
export const contentSchema = z.object({
  skills: z.array(skillSchema),
  projects: z.array(projectSchema),
  experiences: z.array(experienceSchema),
  engagements: z.array(engagementSchema),
  stories: z.array(storySchema),
  awards: z.array(awardSchema),
  softSkills: z.array(softSkillSchema),
  certifications: z.array(certificationSchema),
  publications: z.array(publicationSchema),
  phases: z.array(lifePhaseSchema),
  site: siteContentSchema,
});
mirrors<z.infer<typeof contentSchema>, Content>(true);

/**
 * Parses and rethrows with the collection name in the message. Zod's own
 * error already carries the field path; what it can't know is which of the
 * eleven collections it was handed.
 */
export function parseCollection<T>(
  label: string,
  schema: z.ZodType<T>,
  value: unknown,
): T {
  const result = schema.safeParse(value);
  if (result.success) return result.data;
  throw new Error(
    `Invalid content in "${label}":\n${z.prettifyError(result.error)}`,
  );
}
