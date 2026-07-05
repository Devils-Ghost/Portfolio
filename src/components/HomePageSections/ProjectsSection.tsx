"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import ProjectCard, { ProjectData } from "@/components/ui/ProjectCard";

export default function ProjectsSection() {
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

  const projects: ProjectData[] = [
    {
      title: "AI-Based Intrusion Detection System",
      desc: "Developed a machine learning model to classify network attacks.",
      fullDesc:
        "An advanced machine learning pipeline capable of classifying over 40 different types of network intrusion attempts. This system drastically reduces false positives while maintaining high detection rates across complex network topologies.",
      techStack: ["Python", "Scikit-Learn", "Pandas", "Network Security"],
      github: "https://github.com/yourusername/repo",
    },
    {
      title: "Blockchain Chain of Custody",
      desc: "Engineered a blockchain-powered management system for forensics.",
      fullDesc:
        "Engineered a highly secure chain of custody application using Go. This ensures that digital forensic evidence remains completely immutable from the moment of capture through the final court presentation.",
      techStack: ["Go", "Hyperledger", "Blockchain", "Cryptography"],
      github: "https://github.com/yourusername/repo",
    },
    {
      title: "Secure AI Civic Platform",
      desc: "Conceptualized a secure AI assistant for voters at the AI + Elections Hackathon.",
      fullDesc:
        "Designed during the AI + Elections Hackathon, this platform provides voters with a secure, untampered AI assistant to verify polling data, reducing election misinformation through robust backend validation.",
      techStack: ["Next.js", "Python", "LLMs", "System Design"],
      live: "https://your-live-link.com",
    },
  ];

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
          it, rather than tracking their own individual visibility. */}
      <div className="flex flex-col gap-12 md:gap-0 relative">
        {projects.map((project, index) => {
          let positionClasses = "";
          let baseRotation = 0;

          if (index === 0) {
            positionClasses = "md:ml-[12%]";
            baseRotation = -3; // Tilt left for the first card
          } else if (index === 1) {
            positionClasses = "md:ml-[55%] md:-mt-52";
            baseRotation = 3; // Tilt right for the second card
          } else if (index === 2) {
            positionClasses = "md:ml-[32%] md:mt-3";
            baseRotation = -1; // Slightly less left tilt for the third card
          }

          // Each card gets its own staggered slice of the shared section
          // timeline, so they settle in slightly offset from one another
          // instead of all arriving at once.
          const start = 0.1 + index * 0.15;
          const end = start + 0.35;
          const isLeft = index % 2 === 0;

          const opacity = useTransform(cardsProgress, [start, end], [0, 1]);
          const x = useTransform(
            cardsProgress,
            [start, end],
            [isLeft ? -100 : 100, 0],
          );

          return (
            <ProjectCard
              key={index}
              project={project}
              index={index}
              className={positionClasses}
              baseRotation={baseRotation}
              style={{ opacity, x }}
            />
          );
        })}
      </div>
    </section>
  );
}
