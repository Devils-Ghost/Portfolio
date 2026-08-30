import Link from "next/link";
import { ArrowRight } from "lucide-react";
import ScrollReveal from "@/components/motion/ScrollReveal";
import {
  fadeUp,
  fadeUpDelayed,
  staggerParent,
} from "@/components/motion/variants";
import SkillPill from "@/components/ui/SkillPill";
import { getRepository } from "@/content/repository";
import { FEATURED_LIMITS, featured } from "@/content/selectors";

/**
 * Technical Arsenal — `featured(skills, FEATURED_LIMITS.skills)`.
 *
 * Fully a Server Component (PROJECT_PLAN.md §D4). It used to need a client
 * half only because the heading, the pills and the CTA were all scrubbed by
 * one `useScroll` measuring this section's own element, which needs a ref a
 * server component can't hold. The entrance plays once now, so all three are
 * ordinary `whileInView` boundaries and the client half is gone.
 *
 * "How many pills" stays a query decision, never a data one — flag one skill
 * too many and this quietly keeps showing the top N by `order` rather than
 * overflowing the row (§3.3 ①).
 */
export default async function SkillsSection() {
  const skills = await getRepository().getSkills();

  return (
    <section className="w-full max-w-6xl mx-auto px-6 py-16 flex flex-col items-center">
      <ScrollReveal {...fadeUp}>
        <h2 className="text-3xl font-bold mb-8 text-center">
          Technical Arsenal
        </h2>
      </ScrollReveal>

      {/* Every pill inherits its slice of the entrance from this container.
          The stagger is time-based, so it can't run out of runway however
          many skills end up featured. */}
      <ScrollReveal
        {...staggerParent}
        className="flex flex-wrap justify-center gap-4 mb-10"
      >
        {featured(skills, FEATURED_LIMITS.skills).map((skill) => (
          <SkillPill key={skill.id} skill={skill} />
        ))}
      </ScrollReveal>

      <ScrollReveal {...fadeUpDelayed}>
        <Link
          href="/about"
          className="group inline-flex items-center gap-2 px-6 py-2 bg-white/5 border border-white/10 rounded-full text-sm text-gray-300 hover:text-white hover:bg-white/10 transition-colors"
        >
          View detailed skillset
          <ArrowRight
            size={16}
            className="group-hover:translate-x-1 transition-transform"
          />
        </Link>
      </ScrollReveal>
    </section>
  );
}
