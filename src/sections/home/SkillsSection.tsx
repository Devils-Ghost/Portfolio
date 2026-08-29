import { getRepository } from "@/content/repository";
import { FEATURED_LIMITS, featured } from "@/content/selectors";
import SkillsArsenal from "./SkillsArsenal";

/**
 * Technical Arsenal — `featured(skills, FEATURED_LIMITS.skills)`.
 *
 * A Server Component: it reads the repository and picks what to show, and
 * hands the result to the client view that owns the scroll animation. "How
 * many pills" is a query decision, never a data one — flag a fourteenth skill
 * `featured` and this quietly keeps showing the top twelve by `order` rather
 * than overflowing the row (§3.3 ①).
 */
export default async function SkillsSection() {
  const skills = await getRepository().getSkills();

  return <SkillsArsenal skills={featured(skills, FEATURED_LIMITS.skills)} />;
}
