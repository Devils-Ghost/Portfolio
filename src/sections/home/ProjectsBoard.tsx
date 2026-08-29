"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import ProjectCard from "@/components/cards/ProjectCard";
import type { Project, Skill } from "@/content/types";

export interface FeaturedProject {
  project: Project;
  skills: Skill[];
}

/**
 * The corkboard itself. Client, because both the heading fade and the shared
 * card timeline are `useScroll` values taken on this section's own element —
 * splitting those onto the cards would give each one its own visibility
 * trigger and lose the composed entrance (PROJECT_PLAN.md §D4). The projects
 * arrive already selected and skill-resolved from the Server Component in
 * ProjectsSection.
 */
export default function ProjectsBoard({ items }: { items: FeaturedProject[] }) {
  const containerRef = useRef<HTMLElement>(null);

  // Heading fade - the section's top crossing from 70% down the viewport to
  // 30% down it.
  const { scrollYProgress: headingProgress } = useScroll({
    target: containerRef,
    offset: ["start 70%", "start 30%"],
  });

  const headingOpacity = useTransform(headingProgress, [0, 0.2], [0, 1]);
  const headingY = useTransform(headingProgress, [0, 0.2], [20, 0]);

  // Card entrance - driven by the SECTION's own position, not each card's
  // individual visibility: progress 0 is the moment the section's top
  // crosses the bottom-30%-of-viewport line (i.e. reaches the 70% mark),
  // and progress 1 is the moment the section's bottom reaches the 80% mark.
  // All three cards read off this one shared timeline.
  const { scrollYProgress: cardsProgress } = useScroll({
    target: containerRef,
    offset: ["start 70%", "end 80%"],
  });

  return (
    <section
      ref={containerRef}
      className="w-full max-w-6xl mx-auto px-6 py-16 relative"
    >
      <motion.div
        style={{ opacity: headingOpacity, y: headingY }}
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
      </motion.div>

      {/* ================= ORGANIC CLUSTER LAYOUT =================
          Card 0 (top-left) and card 1 (top-right) sit at nearly the same
          height, and card 2 sits centered underneath, spanning the gap
          between them - rather than a diagonal staircase. The whole
          cluster is also shifted inward (12% / 55% / 32%) instead of
          pinning card 0 to the very left edge, so it reads as centered
          rather than left-heavy. All three cards animate off the shared
          cardsProgress timeline above, each in its own staggered slice of
          it, rather than tracking their own individual visibility.

          The cluster is a repeating unit of three, indexed with `% 3`, so a
          fourth featured project starts the pattern again underneath rather
          than having nowhere to go (§3.3 ①). The homepage still shows three
          — FEATURED_LIMITS decides that, not this layout. */}
      <div className="flex flex-col gap-12 md:gap-0 relative">
        {items.map(({ project, skills }, index) => {
          const { positionClasses, baseRotation } = CLUSTER[index % 3];

          // Each card gets its own staggered slice of the shared section
          // timeline, so they settle in slightly offset from one another
          // instead of all arriving at once. That slice is worked out inside
          // ProjectCard from its `index` - computing it here would mean
          // calling useTransform in a loop, which breaks now that the project
          // list comes from the repository rather than a literal.
          return (
            <ProjectCard
              key={project.id}
              project={project}
              skills={skills}
              index={index}
              className={positionClasses}
              baseRotation={baseRotation}
              progress={cardsProgress}
            />
          );
        })}
      </div>
    </section>
  );
}

const CLUSTER = [
  { positionClasses: "md:ml-[12%]", baseRotation: -3 }, // tilt left
  { positionClasses: "md:ml-[55%] md:-mt-52", baseRotation: 3 }, // tilt right
  { positionClasses: "md:ml-[32%] md:mt-3", baseRotation: -1 }, // slightly less left
] as const;
