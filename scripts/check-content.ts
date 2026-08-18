/**
 * Content integrity check. Run before every commit that touches content:
 *   npx tsx scripts/check-content.ts
 *
 * Catches the class of bug that renders as an empty modal rather than an error:
 * skills nothing uses, references to deleted entities, unevidenced claims,
 * and sections with more items flagged `featured` than the layout can show.
 */
import * as local from "../src/content/local";
import { checkIntegrity } from "../src/content/selectors";
import type { Content } from "../src/content/types";

const content: Content = {
  skills: local.skills,
  projects: local.projects,
  experiences: local.experiences,
  engagements: local.engagements,
  stories: local.stories,
  awards: local.awards,
  softSkills: local.softSkills,
  certifications: local.certifications,
  publications: local.publications,
  phases: local.phases,
  site: local.site,
};

const r = checkIntegrity(content);
let failed = false;

const fail = (msg: string) => { failed = true; console.error(`✗ ${msg}`); };
const warn = (msg: string) => console.warn(`⚠ ${msg}`);
const ok = (msg: string) => console.log(`✓ ${msg}`);

console.log(
  `\nContent: ${content.skills.length} skills · ${content.projects.length} projects · ` +
  `${content.experiences.length} roles · ${content.stories.length} stories · ` +
  `${content.awards.length} awards · ${content.engagements.length} engagements\n`,
);

// Hard failures — these render as broken UI
r.danglingSkillRefs.length
  ? r.danglingSkillRefs.forEach((d) => fail(`${d.entity} "${d.id}" → unknown skills: ${d.badRefs.join(", ")}`))
  : ok("No dangling skill references");

r.danglingEntityRefs.length
  ? r.danglingEntityRefs.forEach((d) => fail(`${d.entity} "${d.id}" → unknown entities: ${d.badRefs.join(", ")}`))
  : ok("No dangling entity references");

r.featuredOrphanSkills.length
  ? r.featuredOrphanSkills.forEach((s) => fail(`Featured skill "${s.name}" has zero usages — opens an empty modal on the home page`))
  : ok("Every featured skill resolves to real usages");

r.unevidencedSoftSkills.length
  ? r.unevidencedSoftSkills.forEach((s) => fail(`Soft skill "${s.label}" has no evidence — opens an empty modal`))
  : ok("Every soft skill has evidence");

// Warnings — legitimate, but worth seeing
r.orphanSkills.length
  ? warn(`${r.orphanSkills.length} skill(s) used by nothing: ${r.orphanSkills.map((s) => s.name).join(", ")}`)
  : ok("No orphan skills");

r.overFeatured.length
  ? r.overFeatured.forEach((o) => warn(`${o.section}: ${o.flagged} flagged featured, layout shows ${o.limit}`))
  : ok("Featured counts within section limits");

console.log("");
process.exit(failed ? 1 : 0);
