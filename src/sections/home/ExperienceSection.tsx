import Link from "next/link";
import { ChevronRight } from "lucide-react";
import ScrollReveal from "@/components/motion/ScrollReveal";
import { fadeUp } from "@/components/motion/variants";
import ExperienceCard from "@/components/cards/ExperienceCard";
import { getRepository } from "@/content/repository";
import {
  FEATURED_LIMITS,
  featured,
  published,
  resolveSkills,
} from "@/content/selectors";

/**
 * Experience — `featured(experiences, FEATURED_LIMITS.experiences)`.
 *
 * Fully a Server Component (PROJECT_PLAN.md §D4): the only animation it owns
 * is the heading's `whileInView`, which lives in `ScrollReveal`, and each
 * card is already its own animated client leaf. The section itself just
 * fetches, filters and positions.
 */
export default async function ExperienceSection() {
  const repo = getRepository();
  const [allExperiences, skills] = await Promise.all([
    repo.getExperiences(),
    repo.getSkills(),
  ]);

  const experiences = featured(
    published(allExperiences),
    FEATURED_LIMITS.experiences,
  );

  return (
    <section className="w-full max-w-6xl mx-auto px-6 py-16 relative">
      {/* Animated Header with View All Link */}
      <ScrollReveal
        {...fadeUp}
        className="flex justify-between items-end mb-16"
      >
        <h2 className="text-3xl md:text-4xl font-bold">Experience</h2>
        <Link
          href="/experience"
          className="text-sm text-blue-400 hover:text-blue-300 flex items-center gap-1 group"
        >
          Full Timeline{" "}
          <ChevronRight
            size={16}
            className="group-hover:translate-x-1 transition-transform"
          />
        </Link>
      </ScrollReveal>

      <div className="flex flex-col gap-12">
        {experiences.map((exp) => (
          <ExperienceCard
            key={exp.id}
            exp={exp}
            skills={resolveSkills(exp.skillIds, skills)}
          />
        ))}
      </div>
    </section>
  );
}
