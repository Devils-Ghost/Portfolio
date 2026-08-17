"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import SkillPill from "@/components/ui/SkillPill"; // Import the new reusable component
import skillsData from "@/data/skills.json"; // Import skills data

export default function SkillsSection() {
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
          the list length varies. */}
      <div className="flex flex-wrap justify-center gap-4 mb-10">
        {skillsData.skills.list.map((skill, index) => (
          <SkillPill
            key={skill}
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
