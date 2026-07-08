"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import SkillPill from "@/components/ui/SkillPill"; // Import the new reusable component

export default function SkillsSection() {
  const containerRef = useRef<HTMLElement>(null);

  const skills = [
    "Python",
    "C/C++",
    "Java",
    "x86 Arch",
    "Go",
    "System Security",
    "Reverse Engineering",
  ];

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 70%", "start 30%"],
  });

  return (
    <section
      ref={containerRef}
      className="w-full max-w-6xl mx-auto px-6 py-16 flex flex-col items-center"
    >
      <motion.h2
        style={{
          opacity: useTransform(scrollYProgress, [0, 0.2], [0, 1]),
          y: useTransform(scrollYProgress, [0, 0.2], [20, 0]),
        }}
        className="text-3xl font-bold mb-8 text-center"
      >
        Technical Arsenal
      </motion.h2>

      <div className="flex flex-wrap justify-center gap-4 mb-10">
        {skills.map((skill, index) => {
          const start = 0.1 + index * 0.08;
          const end = start + 0.2;

          const opacity = useTransform(scrollYProgress, [start, end], [0, 1]);
          const scale = useTransform(scrollYProgress, [start, end], [0.8, 1]);

          return (
            <SkillPill
              key={index}
              skill={skill}
              // Pass the scroll-bound motion values to the pill
              style={{ opacity, scale }}
            />
          );
        })}
      </div>

      <motion.div
        style={{
          opacity: useTransform(scrollYProgress, [0.7, 0.9], [0, 1]),
          y: useTransform(scrollYProgress, [0.7, 0.9], [10, 0]),
        }}
      >
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
