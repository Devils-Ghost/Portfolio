import Link from "next/link";
import { ChevronRight } from "lucide-react";
import ScrollReveal from "@/components/motion/ScrollReveal";
import SuccessStoriesShowcase from "./SuccessStoriesShowcase";
import { getRepository } from "@/content/repository";
import { FEATURED_LIMITS, featured, published } from "@/content/selectors";

/**
 * Success Stories — `featured(stories, FEATURED_LIMITS.stories)`.
 *
 * A Server Component; only the carousel and the desktop selection need the
 * client. `published()` is what makes `visibility: "draft"` useful — a story
 * can sit half-written in the repository for a week without appearing here.
 *
 * This section now carries narratives rather than trophies: the two entries
 * it used to show ("4th Place at Tracer Fire 13", "SME Recognition") were
 * recognitions, and §3.2b moves those to `Award`, which sharpens both.
 */
export default async function SuccessStoriesSection() {
  const all = await getRepository().getStories();
  const stories = featured(published(all), FEATURED_LIMITS.stories);

  return (
    <section className="w-full max-w-6xl mx-auto px-6 py-16 relative overflow-visible">
      {/* Animated Header */}
      <ScrollReveal
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="flex justify-between items-end mb-10 md:mb-16"
      >
        <h2 className="text-3xl md:text-4xl font-bold">Success Stories</h2>
        <Link
          href="/blog"
          className="text-sm text-blue-400 hover:text-blue-300 flex items-center gap-1 group transition-colors"
        >
          View All{" "}
          <ChevronRight
            size={16}
            className="group-hover:translate-x-1 transition-transform"
          />
        </Link>
      </ScrollReveal>

      <SuccessStoriesShowcase stories={stories} />
    </section>
  );
}
