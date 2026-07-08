"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import ExperienceCard, {
  ExperienceData,
} from "@/components/home/ExperienceCard";

export default function ExperienceSection() {
  const containerRef = useRef<HTMLElement>(null);

  // Header scroll animation
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 70%", "start 30%"],
  });

  const headingOpacity = useTransform(scrollYProgress, [0, 0.2], [0, 1]);
  const headingY = useTransform(scrollYProgress, [0, 0.2], [20, 0]);

  const experiences: ExperienceData[] = [
    {
      role: "Research Volunteer",
      org: "SEFCOM Lab",
      type: "Volunteer",
      date: "Jul 2026 - Present",
      shortDesc:
        "Focusing on systems engineering and vulnerability research within the SEFCOM environment.",
      fullDesc:
        "Engaged in specialized systems engineering and vulnerability research. This role involves deep technical analysis, contributing to ongoing security investigations, and developing novel approaches to identifying and mitigating complex system vulnerabilities.",
      techStack: [
        "Vulnerability Research",
        "Systems Engineering",
        "Security Analysis",
      ],
    },
    {
      role: "Graduate Teaching Assistant",
      org: "Arizona State University",
      type: "Academic",
      date: "Aug 2025 - Present",
      shortDesc:
        "Mentoring 150+ students in Software Security (CSE 545) and developing custom CTF challenges.",
      fullDesc:
        "Serving as the primary Graduate Teaching Assistant for CSE 545 (Software Security) under Professor Erik Trickel. Responsibilities include mentoring over 150 graduate students, grading complex security assignments, and actively developing custom Capture The Flag (CTF) challenges focusing on offensive security concepts.",
      techStack: [
        "Offensive Security",
        "CTF Development",
        "Binary Exploitation",
        "Reverse Engineering",
      ],
    },
    {
      role: "Software Engineer II",
      org: "UBS",
      type: "Full-Time",
      date: "Jul 2021 - Jun 2024",
      shortDesc:
        "Engineered enterprise-scale software solutions within the financial sector.",
      fullDesc:
        "Promoted from Software Engineer I to Software Engineer II. Designed, developed, and maintained highly resilient enterprise software solutions. Focused heavily on the intersection of systems engineering and robust security practices within a strictly regulated financial environment.",
      techStack: [
        "Enterprise Architecture",
        "Systems Engineering",
        "Secure SDLC",
      ],
    },
  ];

  return (
    <section
      ref={containerRef}
      className="w-full max-w-6xl mx-auto px-6 py-16 relative"
    >
      {/* Animated Header with View All Link */}
      <motion.div
        style={{ opacity: headingOpacity, y: headingY }}
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
      </motion.div>

      <div className="flex flex-col gap-12">
        {experiences.map((exp, index) => (
          <ExperienceCard key={index} exp={exp} />
        ))}
      </div>
    </section>
  );
}
