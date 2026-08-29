import ProjectsBoard from "./ProjectsBoard";
import { getRepository } from "@/content/repository";
import {
  FEATURED_LIMITS,
  featured,
  published,
  resolveSkills,
} from "@/content/selectors";

/**
 * Featured Work — `featured(projects, FEATURED_LIMITS.projects)`.
 *
 * A Server Component: it reads the repository, drops drafts, takes the top
 * three by `order` and resolves each project's `skillIds` against the skill
 * vocabulary before handing the result to the client board. That resolution
 * belongs here and not in the card — a presentational card shouldn't need the
 * whole vocabulary to draw one row of chips.
 */
export default async function ProjectsSection() {
  const repo = getRepository();
  const [allProjects, skills] = await Promise.all([
    repo.getProjects(),
    repo.getSkills(),
  ]);

  const items = featured(published(allProjects), FEATURED_LIMITS.projects).map(
    (project) => ({ project, skills: resolveSkills(project.skillIds, skills) }),
  );

  return <ProjectsBoard items={items} />;
}
