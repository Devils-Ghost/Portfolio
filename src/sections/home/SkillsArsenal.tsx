"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import SkillPill from "@/components/ui/SkillPill";
import type { Skill } from "@/content/types";

/**
 * The animated half of the Technical Arsenal. Client, because the heading,
 * the pills and the CTA all read one `useScroll` taken on this section's own
 * element — there is no leaf-only split that keeps that shared timeline
 * (PROJECT_PLAN.md §D4). It receives its content as props from the Server
 * Component in SkillsSection, so the skill names are still in the HTML.
 */
export default function SkillsArsenal({ skills }: { skills: Skill[] }) {
  const containerRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 85%", "start 30%"],
  });

  const headingOpacity = useTransform(scrollYProgress, [0, 0.2], [0, 1]);
  const headingY = useTransform(scrollYProgress, [0, 0.2], [20, 0]);

  const ctaOpacity = useTransform(scrollYProgress, [0.7, 0.9], [0, 1]);
  const ctaY = useTransform(scrollYProgress, [0.7, 0.9], [10, 0]);

  return (
    <section
      ref={containerRef}
      className="w-full max-w-6xl mx-auto px-6 py-16 flex flex-col items-center"
    >
      <motion.h2
        style={{ opacity: headingOpacity, y: headingY }}
        className="text-3xl font-bold mb-8 text-center"
      >
        Technical Arsenal
      </motion.h2>

      {/* Every pill reads off this one shared timeline and works out its own
          staggered slice of it internally. The stagger maths deliberately
          lives in SkillPill rather than here: computing it in this .map()
          would mean calling useTransform in a loop, which breaks the moment
          the list length varies — which, from the repository, it does. */}
      <div className="flex flex-wrap justify-center gap-4 mb-10">
        {skills.map((skill, index) => (
          <SkillPill
            key={skill.id}
            skill={skill}
            progress={scrollYProgress}
            index={index}
          />
        ))}
      </div>

      <motion.div style={{ opacity: ctaOpacity, y: ctaY }}>
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
      </motion.div>
    </section>
  );
}
