"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

export default function EngagementSection() {
  const containerRef = useRef<HTMLElement>(null);

  // Track the scroll progress of the entire section
  // "start 70%" - Animation begins when the top of the section is 30% up from the bottom of the screen
  // "end 60%" - Animation finishes when the bottom of the section reaches slightly above the middle of the screen
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 70%", "end 60%"],
  });

  // The glowing timeline line that draws itself downwards as you scroll
  const lineScaleY = useTransform(scrollYProgress, [0, 1], [0, 1]);
  const headingOpacity = useTransform(scrollYProgress, [0, 0.1], [0, 1]);

  const experiences = [
    {
      role: "Graduate Teaching Assistant - Software Security",
      company: "Arizona State University",
      date: "Aug 2025 - Present",
      desc: "Mentored over 150 students in CSE 545 under Prof. Erik Trickel, focusing on offensive security concepts and developing custom Capture The Flag (CTF) challenges.",
    },
    {
      role: "Research Volunteer",
      company: "SEFCOM Lab",
      date: "Starts July 2026",
      desc: "Upcoming research position focusing on systems engineering and vulnerability research within the SEFCOM environment.",
    },
    {
      role: "Software Engineer II",
      company: "UBS",
      date: "July 2021 - June 2024",
      desc: "Promoted from Software Engineer I. Developed and maintained enterprise-scale software solutions within the financial sector, bridging systems engineering with robust security practices.",
    },
  ];

  return (
    <section
      ref={containerRef}
      className="w-full max-w-5xl mx-auto px-6 py-24 relative"
    >
      <motion.div
        style={{ opacity: headingOpacity }}
        className="mb-16 text-center md:text-left"
      >
        <h2 className="text-3xl md:text-4xl font-bold">Experience</h2>
      </motion.div>

      <div className="relative">
        {/* ================= THE CENTER TIMELINE ================= */}
        {/* The faint background line */}
        <div className="absolute left-[20px] md:left-1/2 top-0 bottom-0 w-0.5 bg-white/10 md:-translate-x-1/2 rounded-full" />

        {/* The bright blue line that physically "draws" on scroll */}
        <motion.div
          style={{ scaleY: lineScaleY, transformOrigin: "top" }}
          className="absolute left-[20px] md:left-1/2 top-0 bottom-0 w-0.5 bg-blue-500 md:-translate-x-1/2 rounded-full shadow-[0_0_10px_rgba(59,130,246,0.8)]"
        />

        {/* ================= THE CARDS ================= */}
        <div className="flex flex-col gap-12">
          {experiences.map((exp, index) => {
            // Mathematically stagger the entrance of each card based on its index
            const start = index * 0.25;
            const end = start + 0.25;

            // Even indexes slide in from the left, odd from the right
            const isLeft = index % 2 === 0;
            const initialX = isLeft ? -100 : 100;

            // Map this specific card's window to its opacity and X position
            const opacity = useTransform(scrollYProgress, [start, end], [0, 1]);
            const x = useTransform(
              scrollYProgress,
              [start, end],
              [initialX, 0],
            );

            return (
              <div
                key={index}
                className={`relative flex items-center justify-between w-full ${isLeft ? "md:flex-row-reverse" : "md:flex-row"} flex-col`}
              >
                {/* Empty div to force the card to one side on desktop */}
                <div className="hidden md:block w-5/12" />

                {/* Timeline Dot */}
                <motion.div
                  style={{ opacity }}
                  className="absolute left-[16px] md:left-1/2 w-2.5 h-2.5 bg-blue-500 rounded-full md:-translate-x-1/2 mt-8 md:mt-0 shadow-[0_0_8px_rgba(59,130,246,1)] z-10"
                />

                {/* The Experience Card */}
                <motion.div
                  style={{ opacity, x }}
                  className="w-full md:w-5/12 ml-12 md:ml-0 p-8 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 hover:border-blue-500/30 transition-colors"
                >
                  <div className="flex flex-col mb-4">
                    <h3 className="text-xl font-bold text-gray-100">
                      {exp.role}
                    </h3>
                    <div className="flex justify-between items-center mt-1 text-sm">
                      <span className="text-blue-400 font-medium">
                        {exp.company}
                      </span>
                      <span className="text-gray-500 font-mono text-xs">
                        {exp.date}
                      </span>
                    </div>
                  </div>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    {exp.desc}
                  </p>
                </motion.div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
