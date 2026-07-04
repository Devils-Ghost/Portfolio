"use client";

import { motion } from "framer-motion";

export interface ProjectData {
  title: string;
  desc: string;
  fullDesc: string;
  github?: string;
  live?: string;
  techStack: string[];
}

interface ProjectCardProps {
  project: ProjectData;
  index: number;
  onClick: () => void;
  className?: string;
}

export default function ProjectCard({
  project,
  index,
  onClick,
  className = "",
}: ProjectCardProps) {
  // Even index = Left side. Odd index = Right side.
  const isLeft = index % 2 === 0;

  // Left cards tilt slightly left (-3deg) and start off-screen left (-100px)
  const baseRotation = isLeft ? -3 : 3;
  const initialX = isLeft ? -100 : 100;

  return (
    <motion.div
      initial={{ opacity: 0, x: initialX, rotateZ: baseRotation }}
      whileInView={{ opacity: 1, x: 0, rotateZ: baseRotation }}
      viewport={{ once: true, margin: "-100px" }}
      // On hover, it snaps to 0 rotation (straight) and scales up slightly
      whileHover={{
        rotateZ: 0,
        scale: 1.02,
        transition: { type: "spring", stiffness: 300, damping: 20 },
      }}
      onClick={onClick}
      className={`relative w-full md:w-[45%] lg:w-[40%] p-6 md:p-8 pt-8 md:pt-10 bg-[#0a0f18] border border-blue-900/30 rounded-xl shadow-[0_20px_40px_-15px_rgba(0,0,0,0.7)] hover:shadow-blue-900/20 transition-shadow cursor-pointer group ${className}`}
    >
      {/* The Metallic Pushpin */}
      <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-5 h-5 flex items-center justify-center pointer-events-none transition-transform group-hover:-translate-y-1">
        <div className="w-3.5 h-3.5 rounded-full bg-gradient-to-br from-gray-300 to-gray-500 shadow-[0_2px_4px_rgba(0,0,0,0.9)] border border-gray-400 z-10" />
        <div className="absolute top-2 left-2 w-3 h-3 bg-black/60 rounded-full blur-[2px]" />
      </div>

      <div className="w-10 h-1 bg-blue-600/50 rounded-full mb-6" />

      <h3 className="text-xl font-bold mb-3 text-gray-100">{project.title}</h3>
      <p className="text-gray-400 text-sm mb-8 leading-relaxed flex-grow">
        {project.desc}
      </p>

      <button className="px-5 py-2.5 text-sm bg-blue-600 group-hover:bg-blue-500 text-white rounded-lg font-medium transition-colors w-full z-10 shadow-lg shadow-blue-900/20">
        View Case Study
      </button>
    </motion.div>
  );
}
