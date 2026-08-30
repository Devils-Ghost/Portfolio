import Link from "next/link";
import { ChevronRight } from "lucide-react";
import ScrollReveal from "@/components/motion/ScrollReveal";
import { fadeUp } from "@/components/motion/variants";
import EngagementAccordion from "./EngagementAccordion";
import { getRepository } from "@/content/repository";
import { FEATURED_LIMITS, featured, published } from "@/content/selectors";

/**
 * Leadership & Engagement — `featured(engagements, FEATURED_LIMITS.engagements)`.
 *
 * A Server Component. The accordion's open-card state is the only thing here
 * that needs the client, so it's the only thing that gets it.
 */
export default async function EngagementSection() {
  const all = await getRepository().getEngagements();
  const engagements = featured(published(all), FEATURED_LIMITS.engagements);

  return (
    <section className="w-full max-w-6xl mx-auto px-6 py-16">
      {/* ================= ANIMATED HEADER ================= */}
      <ScrollReveal
        {...fadeUp}
        className="flex justify-between items-end mb-16"
      >
        <h2 className="text-3xl md:text-4xl font-bold">
          Leadership & Engagement
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

      <EngagementAccordion engagements={engagements} />
    </section>
  );
}
