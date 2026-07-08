"use client";

import { useRef, useState } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useMotionTemplate,
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

export default function ExperienceCard({ exp }: ExperienceCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);

  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ["start 95%", "end 70%"],
  });

  // 1. Line draws down in the center
  const lineScaleY = useTransform(scrollYProgress, [0, 0.15], [0, 1]);

  // 2. The Math for the Left and Right positions
  const clipInset = useTransform(scrollYProgress, [0.15, 0.8], [50, 0]);
  const rightEdge = useTransform(scrollYProgress, [0.15, 0.8], [50, 100]);

  // 3. Dynamic Fade
  const fadeAmount = useTransform(
    scrollYProgress,
    [0.15, 0.5, 0.8],
    [0, 20, 0],
  );

  // 4. The Soft Gradient Mask
  const maskImage = useMotionTemplate`linear-gradient(to right, 
    transparent ${clipInset}%, 
    black calc(${clipInset}% + ${fadeAmount}%), 
    black calc(${rightEdge}% - ${fadeAmount}%), 
    transparent ${rightEdge}%
  )`;

  const leftLinePos = useMotionTemplate`${clipInset}%`;
  const rightLinePos = useMotionTemplate`${clipInset}%`;

  // 5. Lines fade out as the curtains finish opening
  const linesOpacity = useTransform(
    scrollYProgress,
    [0, 0.05, 0.8, 0.9],
    [0, 1, 1, 0],
  );

  return (
    <>
      <div ref={cardRef} className="relative w-full max-w-4xl mx-auto py-2">
        {/* Left Split Line - Updated with vertical gradient */}
        <motion.div
          style={{
            scaleY: lineScaleY,
            opacity: linesOpacity,
            left: leftLinePos,
            transformOrigin: "top",
          }}
          className="absolute top-0 bottom-0 w-[2px] bg-gradient-to-b from-transparent via-blue-500 to-transparent shadow-[0_0_12px_rgba(59,130,246,0.8)] z-10 -ml-[1px]"
        />

        {/* Right Split Line - Updated with vertical gradient */}
        <motion.div
          style={{
            scaleY: lineScaleY,
            opacity: linesOpacity,
            right: rightLinePos,
            transformOrigin: "top",
          }}
          className="absolute top-0 bottom-0 w-[2px] bg-gradient-to-b from-transparent via-blue-500 to-transparent shadow-[0_0_12px_rgba(59,130,246,0.8)] z-10 -mr-[1px]"
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
