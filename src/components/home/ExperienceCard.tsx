"use client";

import { useEffect, useRef, useState } from "react";
import {
  motion,
  useMotionValue,
  useMotionTemplate,
  useInView,
  animate,
} from "framer-motion";
import Modal from "@/components/ui/Modal";

export interface ExperienceData {
  role: string;
  org: string;
  type: string;
  date: string;
  shortDesc: string;
  fullDesc: string;
  techStack: string[];
}

interface ExperienceCardProps {
  exp: ExperienceData;
}

// Vertical fade applied to each bracket's own shape — solid through the
// middle, feathering to transparent as it nears the card's top and bottom.
const BRACKET_FADE_MASK =
  "linear-gradient(to bottom, transparent, black 25%, black 75%, transparent)";

export default function ExperienceCard({ exp }: ExperienceCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);

  // Triggers once, the moment the card scrolls into view — and, unlike
  // scroll-linked values, never re-fires or reverses on further scrolling.
  const isInView = useInView(cardRef, { once: true, amount: 0.3 });

  // 1. Bracket grows in, at the closed/center position
  const lineScaleY = useMotionValue(0);

  // 2. The left/right bracket positions — start clamped together at the
  // horizontal center, then swing open to the card's real edges
  const clipInset = useMotionValue(50);
  const rightEdge = useMotionValue(50);

  // 3. Soft feathered edge on the reveal mask while the curtain opens
  const fadeAmount = useMotionValue(0);

  // 4. Brackets fade out once the curtain has fully opened
  const linesOpacity = useMotionValue(0);

  useEffect(() => {
    if (!isInView) return;
    const timing = { duration: 1.3, ease: "easeInOut" as const };
    animate(lineScaleY, [0, 1, 1], { ...timing, times: [0, 0.12, 1] });
    animate(clipInset, [50, 50, 0], { ...timing, times: [0, 0.12, 0.65] });
    animate(rightEdge, [50, 50, 100], { ...timing, times: [0, 0.12, 0.65] });
    animate(fadeAmount, [0, 0, 20, 0], {
      ...timing,
      times: [0, 0.12, 0.45, 0.65],
    });
    animate(linesOpacity, [0, 1, 1, 0], {
      ...timing,
      times: [0, 0.05, 0.65, 0.8],
    });
  }, [isInView]);

  // 5. The Soft Gradient Mask on the card's own content
  const maskImage = useMotionTemplate`linear-gradient(to right, 
    transparent ${clipInset}%, 
    black calc(${clipInset}% + ${fadeAmount}%), 
    black calc(${rightEdge}% - ${fadeAmount}%), 
    transparent ${rightEdge}%
  )`;

  const leftBracketPos = useMotionTemplate`${clipInset}%`;
  const rightBracketPos = useMotionTemplate`${clipInset}%`;

  return (
    <>
      <div ref={cardRef} className="relative w-full max-w-4xl mx-auto py-2">
        {/* Left bracket — a "[" shape hugging the card's left edge, not just a line */}
        <motion.div
          style={{
            scaleY: lineScaleY,
            opacity: linesOpacity,
            left: leftBracketPos,
            transformOrigin: "top",
            WebkitMaskImage: BRACKET_FADE_MASK,
            maskImage: BRACKET_FADE_MASK,
          }}
          className="absolute top-[8%] bottom-[8%] w-5 border-l-2 border-t-2 border-b-2 border-blue-500 rounded-l-md shadow-[0_0_12px_rgba(59,130,246,0.7)] z-10"
        />

        {/* Right bracket — a "]" shape hugging the card's right edge */}
        <motion.div
          style={{
            scaleY: lineScaleY,
            opacity: linesOpacity,
            right: rightBracketPos,
            transformOrigin: "top",
            WebkitMaskImage: BRACKET_FADE_MASK,
            maskImage: BRACKET_FADE_MASK,
          }}
          className="absolute top-[8%] bottom-[8%] w-5 border-r-2 border-t-2 border-b-2 border-blue-500 rounded-r-md shadow-[0_0_12px_rgba(59,130,246,0.7)] z-10"
        />

        {/* The Card with the Feathered Reveal Mask and LED Hover Effect */}
        <motion.div
          style={{ WebkitMaskImage: maskImage, maskImage: maskImage }}
          onClick={() => setIsOpen(true)}
          className="w-full p-8 md:p-10 bg-[#0a0f18] rounded-2xl flex flex-col items-start group cursor-pointer 
                     border border-white/10 shadow-2xl
                     transition-all duration-500 ease-out
                     hover:-translate-y-1.5 hover:border-blue-500/40 
                     hover:shadow-[0_12px_40px_-15px_rgba(59,130,246,0.4)]"
        >
          {/* Card Header */}
          <div className="flex flex-col md:flex-row md:justify-between md:items-start w-full mb-6 gap-4 md:gap-0">
            <div className="flex flex-col">
              <h3 className="text-2xl font-bold text-white mb-2">{exp.role}</h3>
              <div className="flex flex-wrap items-center gap-2 text-sm">
                <span className="text-blue-400 font-medium">{exp.org}</span>
                <span className="text-gray-600 hidden md:inline">•</span>
                <span className="text-gray-500 font-mono">{exp.date}</span>
              </div>
            </div>
            {/* Job Type Badge */}
            <span className="text-gray-400 bg-white/5 px-3 py-1 rounded text-xs border border-white/10 uppercase tracking-wider self-start md:mt-1 group-hover:border-blue-500/30 group-hover:text-blue-300 transition-colors duration-500">
              {exp.type}
            </span>
          </div>

          <p className="text-gray-400 text-base mb-8 leading-relaxed">
            {exp.shortDesc}
          </p>

          <button className="px-6 py-2.5 text-sm bg-blue-600 group-hover:bg-blue-500 text-white rounded-lg font-medium transition-colors shadow-lg shadow-blue-900/20">
            View Details
          </button>
        </motion.div>
      </div>

      {/* ================= REUSABLE MODAL ================= */}
      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        className="max-w-2xl"
      >
        <div className="w-12 h-1 bg-blue-500 rounded-full mb-6" />

        <div className="mb-6 flex flex-col md:flex-row md:justify-between md:items-start gap-4">
          <div>
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">
              {exp.role}
            </h3>
            <div className="flex items-center gap-3 text-sm">
              <span className="text-blue-400 font-medium text-lg">
                {exp.org}
              </span>
              <span className="text-gray-500 font-mono">• {exp.date}</span>
            </div>
          </div>
          <span className="text-gray-400 bg-white/5 px-3 py-1 rounded text-xs border border-white/10 uppercase tracking-wider">
            {exp.type}
          </span>
        </div>

        <div className="flex flex-wrap gap-2 mb-8">
          {exp.techStack.map((tech, i) => (
            <span
              key={i}
              className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs text-blue-300 font-mono"
            >
              {tech}
            </span>
          ))}
        </div>

        <p className="text-gray-300 leading-relaxed">{exp.fullDesc}</p>
      </Modal>
    </>
  );
}
