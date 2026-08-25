// ─────────────────────────────────────────────────────────────
// content/types.ts — Phase 1 reference implementation
// Matches PROJECT_PLAN.md §3.2, with `Award` and `SoftSkill` added.
// ─────────────────────────────────────────────────────────────

export type ID = string;
export type Slug = string;

/** Month precision — nothing on this site displays a day. */
export interface DateMark {
  year: number;
  month: number; // 1–12
}

export interface DateRange {
  start: DateMark;
  end: DateMark | null; // null === "Present"
}

export type LinkKind =
  | "github"
  | "live"
  | "video"
  | "report"
  | "paper"
  | "credential"
  | "external";

export interface ResourceLink {
  kind: LinkKind;
  url: string;
  label?: string;
}

export type Visibility = "public" | "draft";

export interface ImageRef {
  src: string;
  alt: string;
  width?: number;
  height?: number;
}

export type IconName =
  | "flag" | "trophy" | "medal" | "star" | "award" | "code" | "shield"
  | "bug" | "cloud" | "cpu" | "users" | "graduation" | "wrench"
  | "search" | "lock" | "zap" | "compass" | "handshake";

// ── SKILL ────────────────────────────────────────────────────
export type SkillCategory =
  | "language" | "framework" | "platform" | "tool" | "domain" | "practice";
export type SkillLevel = "core" | "working" | "familiar";

export interface Skill {
  id: ID;
  slug: Slug;
  name: string;
  category: SkillCategory;
  level: SkillLevel;
  featured: boolean;
  order: number;
  /** One line shown at the top of the skill modal. Optional. */
  blurb?: string;
  /** Alternative names people might search for. Powers /about search. */
  aliases?: string[];
  /**
   * Umbrella grouping. A skill with a parent is a specific instance of it —
   * `skl_azure.parentId === "skl_cloud"`. Featured pills are umbrellas;
   * /about shows the detail beneath them. Usage roll-up means clicking an
   * umbrella shows everywhere any of its children were used.
   */
  parentId?: ID;
}

// ── PROJECT ──────────────────────────────────────────────────
export type ProjectStatus = "shipped" | "in-progress" | "archived" | "concept";
export type ProjectContextKind =
  | "personal" | "academic" | "professional" | "hackathon" | "research";

export interface Project {
  id: ID;
  slug: Slug;
  title: string;
  summary: string;
  body: string;
  highlights?: string[];
  skillIds: ID[];
  links: ResourceLink[];
  status: ProjectStatus;
  date: DateRange;
  context?: { kind: ProjectContextKind; experienceId?: ID };
  coverImage?: ImageRef;
  featured: boolean;
  order: number;
  visibility: Visibility;
}

// ── EXPERIENCE ───────────────────────────────────────────────
export type ExperienceType =
  | "full-time" | "internship" | "academic" | "research" | "volunteer"
  | "contract" | "part-time";
export type WorkMode = "onsite" | "hybrid" | "remote";

export interface Experience {
  id: ID;
  slug: Slug;
  role: string;
  org: string;
  orgUrl?: string;
  type: ExperienceType;
  mode?: WorkMode;
  location: string;
  date: DateRange;
  summary: string;
  body: string;
  achievements?: string[];
  skillIds: ID[];
  links: ResourceLink[];
  phaseId: ID;
  featured: boolean;
  order: number;
  visibility: Visibility;
}

// ── ENGAGEMENT ───────────────────────────────────────────────
export type EngagementType =
  | "competition" | "hackathon" | "open-source" | "leadership" | "community" | "sport";

export interface Engagement {
  id: ID;
  slug: Slug;
  title: string;
  org: string;
  type: EngagementType;
  date: DateRange;
  summary: string;
  body?: string;
  iconName: IconName;
  skillIds?: ID[];
  links?: ResourceLink[];
  phaseId?: ID;
  featured: boolean;
  order: number;
  visibility: Visibility;
}

// ── STORY ────────────────────────────────────────────────────
export interface Story {
  id: ID;
  slug: Slug;
  title: string;
  headline: string;
  org?: string;
  type: string;
  date: DateMark;
  star?: { situation: string; task: string; action: string; result: string };
  body: string;
  relatedProjectIds?: ID[];
  relatedExperienceIds?: ID[];
  skillIds?: ID[];
  iconName: IconName;
  readingMinutes?: number;
  featured: boolean;
  order: number;
  visibility: Visibility;
}

// ── AWARD ────────────────────────────────────────────────────
export interface Award {
  id: ID;
  slug: Slug;
  title: string;
  issuer: string;
  date: DateMark;
  rank?: string;
  summary: string;
  body?: string;
  sourceExperienceId?: ID;
  sourceProjectIds?: ID[];
  storyId?: ID;
  skillIds?: ID[];
  links?: ResourceLink[];
  iconName: IconName;
  featured: boolean;
  order: number;
  visibility: Visibility;
}

// ── SOFT SKILL ───────────────────────────────────────────────
export interface SoftSkill {
  id: ID;
  slug: Slug;
  label: string;
  description?: string;
  evidenceStoryIds?: ID[];
  evidenceExperienceIds?: ID[];
  evidenceEngagementIds?: ID[];
  iconName?: IconName;
  featured: boolean;
  order: number;
}

// ── CERTIFICATION ────────────────────────────────────────────
export interface Certification {
  id: ID;
  name: string;
  issuer: string;
  issued: DateMark;
  expires?: DateMark | null;
  credentialUrl?: string;
  credentialId?: string;
  skillIds?: ID[];
  featured: boolean;
  order: number;
}

// ── LIFE PHASE ───────────────────────────────────────────────
export interface LifePhase {
  id: ID;
  slug: Slug;
  label: string;
  subtitle?: string;
  date: DateRange;
  order: number;
  accent?: string;
}

// ── PUBLICATION ──────────────────────────────────────────────
export interface Publication {
  id: ID;
  slug: Slug;
  title: string;
  venue: string;
  authors: string[];
  date: DateMark;
  summary: string;
  links: ResourceLink[];
  relatedProjectIds?: ID[];
  skillIds?: ID[];
  featured: boolean;
  order: number;
}

// ── SITE SINGLETONS ──────────────────────────────────────────
export interface SiteContent {
  hero: {
    headlines: string[];
    roleLines: string[];
    statuses: string[];
    resumeUrl?: string;
  };
  about: {
    greeting: string;
    short: string;
    long: string;
    journey: { heading: string; body: string }[];
  };
  socials: {
    kind: "github" | "linkedin" | "email" | "x" | "scholar";
    url: string;
    label: string;
  }[];
  availability: { open: boolean; label: string; location: string };
  seo: { title: string; description: string; ogImage?: string };
}

export interface ContactSubmission {
  id: ID;
  name: string;
  company?: string;
  role?: string;
  contact: string;
  message: string;
  createdAt: string;
  status: "new" | "read" | "replied" | "spam";
  meta?: { userAgent?: string; referer?: string };
}

export interface Content {
  skills: Skill[];
  projects: Project[];
  experiences: Experience[];
  engagements: Engagement[];
  stories: Story[];
  awards: Award[];
  softSkills: SoftSkill[];
  certifications: Certification[];
  publications: Publication[];
  phases: LifePhase[];
  site: SiteContent;
}
