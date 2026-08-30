import type {
  ID,
  Content,
  Skill,
  Project,
  Experience,
  Engagement,
  Story,
  Award,
  SoftSkill,
  SocialLink,
  DateRange,
  DateMark,
} from "./types";

// ─── Dates ───────────────────────────────────────────────────────
const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

export function formatDateMark(d: DateMark): string {
  return `${MONTHS[d.month - 1]} ${d.year}`;
}

export function formatDateRange(r: DateRange): string {
  const start = formatDateMark(r.start);
  if (!r.end) return `${start} – Present`;
  const end = formatDateMark(r.end);
  // A one-month engagement — a hackathon, a two-day workshop — stores an
  // identical start and end because the model has no shorter unit. Printing
  // "Jan 2026 – Jan 2026" would just be reporting that fact at the reader.
  return start === end ? start : `${start} – ${end}`;
}

const markValue = (d: DateMark) => d.year * 12 + d.month;
const rangeEndValue = (r: DateRange) => (r.end ? markValue(r.end) : Infinity);

export function byDateDesc(
  a: { date: DateRange | DateMark },
  b: { date: DateRange | DateMark },
) {
  const val = (d: DateRange | DateMark) =>
    "start" in d ? rangeEndValue(d) : markValue(d);
  return val(b.date) - val(a.date);
}

// ─── Site singletons ─────────────────────────────────────────────
/** The URL for one social kind, or undefined if that link isn't listed. */
export const socialUrl = (
  socials: SocialLink[],
  kind: SocialLink["kind"],
): string | undefined => socials.find((s) => s.kind === kind)?.url;

// ─── Display labels ──────────────────────────────────────────────
/**
 * Enum value → badge text. The values are stored kebab-case so they sort and
 * query cleanly; these are the only place the human-readable form exists, so
 * a card and a filter chip can never disagree about what "open-source" is
 * called.
 */
export const EXPERIENCE_TYPE_LABELS: Record<Experience["type"], string> = {
  "full-time": "Full-Time",
  "part-time": "Part-Time",
  internship: "Internship",
  academic: "Academic",
  research: "Research",
  volunteer: "Volunteer",
  contract: "Contract",
};

export const ENGAGEMENT_TYPE_LABELS: Record<Engagement["type"], string> = {
  competition: "Competition",
  hackathon: "Hackathon",
  "open-source": "Open Source",
  leadership: "Leadership",
  community: "Community",
  sport: "Sport",
};

// ─── Featured selection ──────────────────────────────────────────
/** Section limits live here, never in the data. See PROJECT_PLAN.md §3.3. */
export const FEATURED_LIMITS = {
  skills: 14,
  projects: 3,
  experiences: 3,
  engagements: 3,
  stories: 3,
  awards: 6,
  softSkills: 7,
  certifications: 3,
} as const;

export function featured<T extends { featured: boolean; order: number }>(
  items: T[],
  limit: number,
): T[] {
  return items
    .filter((i) => i.featured)
    .sort((a, b) => a.order - b.order)
    .slice(0, limit);
}

/** Public items only — drafts never reach the site. */
export function published<T extends { visibility?: "public" | "draft" }>(
  items: T[],
): T[] {
  return items.filter((i) => i.visibility !== "draft");
}

// ─── Skill resolution & usage ────────────────────────────────────
export function resolveSkills(ids: ID[] | undefined, skills: Skill[]): Skill[] {
  if (!ids?.length) return [];
  const byId = new Map(skills.map((s) => [s.id, s]));
  return ids.map((id) => byId.get(id)).filter((s): s is Skill => Boolean(s));
}

export type SkillUsage =
  | { kind: "project"; item: Project }
  | { kind: "experience"; item: Experience }
  | { kind: "engagement"; item: Engagement }
  | { kind: "story"; item: Story };

/** Direct children of an umbrella skill. */
export const childrenOfSkill = (skillId: ID, skills: Skill[]): Skill[] =>
  skills.filter((s) => s.parentId === skillId);

/** The umbrella a skill sits under, if any. */
export const parentOfSkill = (
  skill: Skill,
  skills: Skill[],
): Skill | undefined =>
  skill.parentId ? skills.find((s) => s.id === skill.parentId) : undefined;

/**
 * A skill plus everything beneath it, recursively.
 * Clicking "Cloud & Infrastructure" should show the Azure migration even
 * though that record never references the umbrella directly.
 */
export function skillWithDescendants(skillId: ID, skills: Skill[]): Set<ID> {
  const out = new Set<ID>([skillId]);
  const walk = (id: ID) => {
    for (const child of skills) {
      if (child.parentId === id && !out.has(child.id)) {
        out.add(child.id);
        walk(child.id);
      }
    }
  };
  walk(skillId);
  return out;
}

/**
 * Powers "This skill was used in:" — the core of the interaction graph.
 * Rolls up descendants, so umbrella skills resolve without needing every
 * project to reference them explicitly.
 */
export function usagesOfSkill(skillId: ID, c: Content): SkillUsage[] {
  const ids = skillWithDescendants(skillId, c.skills);
  const hit = (refs: ID[] | undefined) => (refs ?? []).some((r) => ids.has(r));

  return [
    ...published(c.projects)
      .filter((p) => hit(p.skillIds))
      .map((item) => ({ kind: "project" as const, item })),
    ...published(c.experiences)
      .filter((e) => hit(e.skillIds))
      .map((item) => ({ kind: "experience" as const, item })),
    ...published(c.engagements)
      .filter((e) => hit(e.skillIds))
      .map((item) => ({ kind: "engagement" as const, item })),
    ...published(c.stories)
      .filter((s) => hit(s.skillIds))
      .map((item) => ({ kind: "story" as const, item })),
  ].sort((a, b) => byDateDesc(a.item, b.item));
}

// ─── Soft-skill evidence ─────────────────────────────────────────
export type Evidence =
  | { kind: "story"; item: Story }
  | { kind: "experience"; item: Experience }
  | { kind: "engagement"; item: Engagement };

export function evidenceFor(soft: SoftSkill, c: Content): Evidence[] {
  const pick = <T extends { id: ID }>(ids: ID[] | undefined, pool: T[]) =>
    (ids ?? [])
      .map((id) => pool.find((x) => x.id === id))
      .filter((x): x is T => Boolean(x));

  return [
    ...pick(soft.evidenceStoryIds, published(c.stories)).map((item) => ({
      kind: "story" as const,
      item,
    })),
    ...pick(soft.evidenceExperienceIds, published(c.experiences)).map(
      (item) => ({ kind: "experience" as const, item }),
    ),
    ...pick(soft.evidenceEngagementIds, published(c.engagements)).map(
      (item) => ({ kind: "engagement" as const, item }),
    ),
  ].sort((a, b) => byDateDesc(a.item, b.item));
}

// ─── Reverse lookups (computed, never stored) ────────────────────
export const awardsOfExperience = (id: ID, c: Content): Award[] =>
  published(c.awards).filter((a) => a.sourceExperienceId === id);

export const awardsOfProject = (id: ID, c: Content): Award[] =>
  published(c.awards).filter((a) => a.sourceProjectIds?.includes(id));

export const storyOfAward = (a: Award, c: Content): Story | undefined =>
  a.storyId ? c.stories.find((s) => s.id === a.storyId) : undefined;

export const projectsOfExperience = (id: ID, c: Content): Project[] =>
  published(c.projects).filter((p) => p.context?.experienceId === id);

export const itemsOfPhase = (phaseId: ID, c: Content) => ({
  experiences: published(c.experiences)
    .filter((e) => e.phaseId === phaseId)
    .sort(byDateDesc),
  engagements: published(c.engagements)
    .filter((e) => e.phaseId === phaseId)
    .sort(byDateDesc),
  awards: published(c.awards).filter((a) => {
    const exp = c.experiences.find((e) => e.id === a.sourceExperienceId);
    return exp?.phaseId === phaseId;
  }),
});

// ─── Search (for /about and /projects) ───────────────────────────
export function searchSkills(query: string, skills: Skill[]): Skill[] {
  const q = query.trim().toLowerCase();
  if (!q) return skills;
  const matches = (s: Skill) =>
    s.name.toLowerCase().includes(q) ||
    (s.aliases?.some((a) => a.toLowerCase().includes(q)) ?? false);

  // A match on an umbrella surfaces its children too — searching "cloud"
  // returns Azure, AWS, Docker and Kubernetes, not just the parent.
  const direct = skills.filter(matches);
  const parentIds = new Set(direct.map((s) => s.id));
  return skills.filter(
    (s) => matches(s) || (s.parentId && parentIds.has(s.parentId)),
  );
}

export function searchProjects(query: string, c: Content): Project[] {
  const q = query.trim().toLowerCase();
  const pool = published(c.projects);
  if (!q) return pool;
  const skillName = (id: ID) =>
    c.skills.find((s) => s.id === id)?.name.toLowerCase() ?? "";
  return pool.filter(
    (p) =>
      p.title.toLowerCase().includes(q) ||
      p.summary.toLowerCase().includes(q) ||
      p.skillIds.some((id) => skillName(id).includes(q)),
  );
}

// ─── Integrity checks (admin dashboard / CI) ─────────────────────
export interface IntegrityReport {
  orphanSkills: Skill[];
  featuredOrphanSkills: Skill[];
  danglingSkillRefs: { entity: string; id: ID; badRefs: ID[] }[];
  danglingEntityRefs: { entity: string; id: ID; badRefs: ID[] }[];
  unevidencedSoftSkills: SoftSkill[];
  overFeatured: { section: string; flagged: number; limit: number }[];
}

export function checkIntegrity(c: Content): IntegrityReport {
  const skillIds = new Set(c.skills.map((s) => s.id));
  const entityIds = new Set([
    ...c.projects.map((x) => x.id),
    ...c.experiences.map((x) => x.id),
    ...c.engagements.map((x) => x.id),
    ...c.stories.map((x) => x.id),
    ...c.awards.map((x) => x.id),
  ]);

  const used = new Set<ID>();
  const danglingSkillRefs: IntegrityReport["danglingSkillRefs"] = [];
  const danglingEntityRefs: IntegrityReport["danglingEntityRefs"] = [];

  const scanSkills = (entity: string, id: ID, refs: ID[] | undefined) => {
    const bad = (refs ?? []).filter((r) => {
      used.add(r);
      return !skillIds.has(r);
    });
    if (bad.length) danglingSkillRefs.push({ entity, id, badRefs: bad });
  };
  const scanEntities = (entity: string, id: ID, refs: (ID | undefined)[]) => {
    const bad = refs.filter(
      (r): r is ID => r !== undefined && !entityIds.has(r),
    );
    if (bad.length) danglingEntityRefs.push({ entity, id, badRefs: bad });
  };

  c.projects.forEach((p) => {
    scanSkills("project", p.id, p.skillIds);
    scanEntities("project", p.id, [p.context?.experienceId]);
  });
  c.experiences.forEach((e) => scanSkills("experience", e.id, e.skillIds));
  c.engagements.forEach((e) => scanSkills("engagement", e.id, e.skillIds));
  c.certifications.forEach((x) =>
    scanSkills("certification", x.id, x.skillIds),
  );
  c.publications.forEach((x) => scanSkills("publication", x.id, x.skillIds));
  c.stories.forEach((s) => {
    scanSkills("story", s.id, s.skillIds);
    scanEntities("story", s.id, [
      ...(s.relatedProjectIds ?? []),
      ...(s.relatedExperienceIds ?? []),
    ]);
  });
  c.awards.forEach((a) => {
    scanSkills("award", a.id, a.skillIds);
    scanEntities("award", a.id, [
      a.sourceExperienceId,
      a.storyId,
      ...(a.sourceProjectIds ?? []),
    ]);
  });
  c.softSkills.forEach((s) =>
    scanEntities("softSkill", s.id, [
      ...(s.evidenceStoryIds ?? []),
      ...(s.evidenceExperienceIds ?? []),
      ...(s.evidenceEngagementIds ?? []),
    ]),
  );

  // An umbrella isn't an orphan if any descendant is used — it resolves via roll-up.
  const resolves = (s: Skill): boolean =>
    used.has(s.id) ||
    c.skills.some((child) => child.parentId === s.id && resolves(child));
  const orphanSkills = c.skills.filter((s) => !resolves(s));

  const overFeatured = (
    [
      ["skills", c.skills, FEATURED_LIMITS.skills],
      ["projects", c.projects, FEATURED_LIMITS.projects],
      ["experiences", c.experiences, FEATURED_LIMITS.experiences],
      ["engagements", c.engagements, FEATURED_LIMITS.engagements],
      ["stories", c.stories, FEATURED_LIMITS.stories],
      ["awards", c.awards, FEATURED_LIMITS.awards],
      ["softSkills", c.softSkills, FEATURED_LIMITS.softSkills],
      ["certifications", c.certifications, FEATURED_LIMITS.certifications],
    ] as const
  )
    .map(([section, items, limit]) => ({
      section,
      flagged: (items as { featured: boolean }[]).filter((i) => i.featured)
        .length,
      limit,
    }))
    .filter((r) => r.flagged > r.limit);

  return {
    orphanSkills,
    featuredOrphanSkills: orphanSkills.filter((s) => s.featured),
    danglingSkillRefs,
    danglingEntityRefs,
    unevidencedSoftSkills: c.softSkills.filter(
      (s) =>
        !(
          s.evidenceStoryIds?.length ||
          s.evidenceExperienceIds?.length ||
          s.evidenceEngagementIds?.length
        ),
    ),
    overFeatured,
  };
}
