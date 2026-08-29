import Link from "next/link";
import { ChevronRight } from "lucide-react";
import ScrollReveal from "@/components/motion/ScrollReveal";
import AwardChip from "@/components/cards/AwardChip";
import { getRepository } from "@/content/repository";
import { FEATURED_LIMITS, featured, published } from "@/content/selectors";

/**
 * Achievements & Awards — `featured(awards, FEATURED_LIMITS.awards)` (§7.1 1.10).
 *
 * Sits between Experience and Leadership & Engagement rather than at the foot
 * of the page: awards are proof-of-work, and proof lands hardest immediately
 * after the claim it supports. The page reads "here's where I worked, here's
 * what that produced, here's who I am outside it."
 *
 * Fully a Server Component — the chips are static, and the only animation is
 * the entrance on the heading and the strip.
 *
 * The full list lives on /experience, grouped by life phase, since most of
 * them originate there (§10 Q2).
 */
export default async function AwardsSection() {
  const all = await getRepository().getAwards();
  const awards = featured(published(all), FEATURED_LIMITS.awards);

  if (!awards.length) return null;

  return (
    <section className="w-full max-w-6xl mx-auto px-6 py-16">
      <ScrollReveal
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="flex justify-between items-end mb-10"
      >
        <h2 className="text-3xl md:text-4xl font-bold">
          Achievements &amp; Awards
        </h2>
        <Link
          href="/experience"
          className="text-sm text-blue-400 hover:text-blue-300 flex items-center gap-1 group transition-colors"
        >
          View all{" "}
          <ChevronRight
            size={16}
            className="group-hover:translate-x-1 transition-transform"
          />
        </Link>
      </ScrollReveal>

      {/* A wrapping strip, not a fixed grid — the number of awards is a
          FEATURED_LIMITS decision, and the layout should absorb whatever it
          says rather than dictate it. */}
      <ScrollReveal
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.7, ease: "easeOut", delay: 0.15 }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3"
      >
        {awards.map((award) => (
          <AwardChip key={award.id} award={award} />
        ))}
      </ScrollReveal>
    </section>
  );
}
