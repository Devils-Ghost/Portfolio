export type ID = string;
export type Slug = string;

export interface DateMark {
  year: number;
  month: number;
}
export interface DateRange {
  start: DateMark;
  end: DateMark | null;
}

export type LinkKind =
  "github" | "live" | "video" | "report" | "paper" | "credential" | "external";

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
  | "flag"
  | "trophy"
  | "medal"
  | "star"
  | "award"
  | "code"
  | "shield"
  | "bug"
  | "cloud"
  | "cpu"
  | "users"
  | "graduation"
  | "wrench"
  | "search"
  | "lock"
  | "zap"
  | "compass"
  | "handshake";

export type SkillCategory =
  "language" | "framework" | "platform" | "tool" | "domain" | "practice";
export type SkillLevel = "core" | "working" | "familiar";

export interface Skill {
  id: ID;
  slug: Slug;
  name: string;
  category: SkillCategory;
  level: SkillLevel;
  featured: boolean;
  order: number;
  blurb?: string;
  aliases?: string[];
  parentId?: ID;
}

export type ProjectStatus = "shipped" | "in-progress" | "archived" | "concept";
export type ProjectContextKind =
  "personal" | "academic" | "professional" | "hackathon" | "research";

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
  /** Life phase this project belongs to — groups projects on the experience timeline. */
  phaseId?: ID;
  coverImage?: ImageRef;
  featured: boolean;
  order: number;
  visibility: Visibility;
}

export type ExperienceType =
  | "full-time"
  | "internship"
  | "academic"
  | "research"
  | "volunteer"
  | "contract"
  | "part-time";
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
  /**
   * Optional prose. Experience is written in resume register, so the bullets
   * in `highlights` carry it; `body` is here for the rare role that needs a
   * paragraph of context above them.
   */
  body?: string;
  /** XYZ-format bullets, lifted straight from the résumé. */
  highlights: string[];
  achievements?: string[];
  skillIds: ID[];
  links: ResourceLink[];
  phaseId: ID;
  featured: boolean;
  order: number;
  visibility: Visibility;
}

export type EngagementType =
  | "competition"
  | "hackathon"
  | "open-source"
  | "leadership"
  | "community"
  | "sport";

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

export interface LifePhase {
  id: ID;
  slug: Slug;
  label: string;
  subtitle?: string;
  date: DateRange;
  order: number;
  accent?: string;
}

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

export type SocialKind = "github" | "linkedin" | "email" | "x" | "scholar";

export interface SocialLink {
  kind: SocialKind;
  url: string;
  label: string;
}

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
  socials: SocialLink[];
  availability: { open: boolean; label: string; location: string };
  seo: { title: string; description: string; ogImage?: string };
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

/**
 * What the one global modal layer is currently showing (PROJECT_PLAN.md §3.5).
 * Serialized into the `?d=` query param — `project:ai-intrusion-detection`,
 * or bare `contact` — so a modal is shareable and survives a hard refresh.
 * Never persisted or validated through `schema.ts`: it describes UI state,
 * not content.
 */
export type DetailTarget =
  | { kind: "project"; id: ID }
  | { kind: "experience"; id: ID }
  | { kind: "engagement"; id: ID }
  | { kind: "story"; id: ID }
  | { kind: "skill"; id: ID }
  | { kind: "award"; id: ID }
  | { kind: "softskill"; id: ID }
  | { kind: "contact" };
