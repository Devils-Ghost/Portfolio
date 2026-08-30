import Link from "next/link";
import { ChevronRight } from "lucide-react";
import ScrollReveal from "@/components/motion/ScrollReveal";
import { fadeUp, staggerParent } from "@/components/motion/variants";
import ProjectCard from "@/components/cards/ProjectCard";
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
 * Fully a Server Component (PROJECT_PLAN.md §D4). It reads the repository,
 * drops drafts, takes the top three by `order` and resolves each project's
 * `skillIds` against the vocabulary — resolution belongs here, not in a
 * presentational card that would otherwise need the whole vocabulary to draw
 * one row of chips.
 *
 * The client half this used to need is gone: the cards' entrance is a
 * staggered `whileInView` now rather than a scroll-scrubbed timeline, so
 * nothing needs a ref on the section element.
 */
export default async function ProjectsSection() {
  const repo = getRepository();
  const [allProjects, skills] = await Promise.all([
    repo.getProjects(),
    repo.getSkills(),
  ]);

  const projects = featured(published(allProjects), FEATURED_LIMITS.projects);

  return (
    <section className="w-full max-w-6xl mx-auto px-6 py-16 relative">
      <ScrollReveal
        {...fadeUp}
        className="flex justify-between items-end mb-10"
      >
        <h2 className="text-3xl md:text-4xl font-bold">Featured Work</h2>
        <Link
          href="/projects"
          className="text-sm text-blue-400 hover:text-blue-300 flex items-center gap-1 group"
        >
          View All{" "}
          <ChevronRight
            size={16}
            className="group-hover:translate-x-1 transition-transform"
          />
        </Link>
      </ScrollReveal>

      {/* ================= ORGANIC CLUSTER LAYOUT =================
          Card 0 (top-left) and card 1 (top-right) sit at nearly the same
          height, and card 2 sits centered underneath, spanning the gap
          between them - rather than a diagonal staircase. The whole
          cluster is also shifted inward (12% / 55% / 32%) instead of
          pinning card 0 to the very left edge, so it reads as centered
          rather than left-heavy.

          The cluster is a repeating unit of three, indexed with `% 3`, so a
          fourth featured project starts the pattern again underneath rather
          than having nowhere to go (§3.3 ①). The homepage still shows three
          — FEATURED_LIMITS decides that, not this layout. */}
      <ScrollReveal
        {...staggerParent}
        className="flex flex-col gap-12 md:gap-0 relative"
      >
        {projects.map((project, index) => {
          const { positionClasses, baseRotation } = CLUSTER[index % 3];
          return (
            <ProjectCard
              key={project.id}
              project={project}
              skills={resolveSkills(project.skillIds, skills)}
              index={index}
              className={positionClasses}
              baseRotation={baseRotation}
            />
          );
        })}
      </ScrollReveal>
    </section>
  );
}

const CLUSTER = [
  { positionClasses: "md:ml-[12%]", baseRotation: -3 }, // tilt left
  { positionClasses: "md:ml-[55%] md:-mt-52", baseRotation: 3 }, // tilt right
  { positionClasses: "md:ml-[32%] md:mt-3", baseRotation: -1 }, // slightly less left
] as const;
