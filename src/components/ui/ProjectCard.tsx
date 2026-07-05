"use client";

import { useState } from "react";
import { motion, type MotionStyle } from "framer-motion";
import { GitBranch, ExternalLink } from "lucide-react";
import Modal from "@/components/ui/Modal";
import { cn } from "@/lib/utils";

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
  onClick?: () => void; // Optional hook (e.g. analytics) - opening the modal is handled internally
  className?: string;
  /**
   * "pinned" (default) - the homepage "Featured Work" treatment: tilted like
   *   a pinned photo, entrance scrubbed by the *section's* scroll position
   *   (via the `style` prop below), straightens + scales up on hover.
   * "grid" - flat, untilted card for a plain layout (e.g. the /projects
   *   page): `baseRotation` and `style` are both force-disabled here
   *   regardless of what's passed in, so a grid card can never end up
   *   rotated or scroll-animated by accident. Hover is a lighter lift
   *   instead of straighten+scale. Defaults to a full-width card since a
   *   grid's own columns/gap should control sizing - pass `className` to
   *   override. Treat the hover/sizing here as a placeholder to refine once
   *   that page's actual design is settled.
   */
  variant?: "pinned" | "grid";
  // Resting tilt in degrees, set by the parent per-card. Only ever applied
  // when variant is "pinned" - ignored for "grid" no matter what's passed.
  baseRotation?: number;
  // Scroll-linked opacity/x computed by the parent (ProjectsSection) off of
  // the SECTION's own scroll position, so every card reads from one shared
  // timeline instead of tracking its own visibility. Only ever applied when
  // variant is "pinned" - ignored for "grid".
  style?: MotionStyle;
}

export default function ProjectCard({
  project,
  onClick,
  className = "",
  variant = "pinned",
  baseRotation = 0,
  style,
}: ProjectCardProps) {
  // Each card owns its own modal state, so it's fully self-contained and can be
  // dropped into the homepage "Featured Work" section or the full /projects grid.
  const [isOpen, setIsOpen] = useState(false);
  const isPinned = variant === "pinned";

  const handleCardClick = () => {
    setIsOpen(true);
    onClick?.();
  };

  return (
    <>
      <motion.div
        initial={{ rotateZ: isPinned ? baseRotation : 0 }}
        // Grid cards never receive the scroll-scrubbed entrance, even if a
        // style prop is passed in by mistake - they just render visible.
        style={isPinned ? style : undefined}
        // Pinned cards snap straight + scale up on hover (spring, on purpose
        // - it's a quick micro-interaction, not the scroll-driven entrance).
        // Grid cards get a simpler lift for now.
        whileHover={
          isPinned
            ? {
                rotateZ: 0,
                scale: 1.02,
                transition: { type: "spring", stiffness: 300, damping: 20 },
              }
            : {
                y: -4,
                transition: { type: "spring", stiffness: 300, damping: 24 },
              }
        }
        onClick={handleCardClick}
        className={cn(
          "relative flex flex-col p-6 md:p-7 bg-[#0a0f18] border border-blue-900/30 rounded-xl shadow-[0_20px_40px_-15px_rgba(0,0,0,0.7)] hover:shadow-blue-900/20 transition-shadow cursor-pointer group",
          isPinned
            ? "pt-8 w-full md:w-[34%] md:min-h-[240px]"
            : "w-full min-h-[240px]",
          className,
        )}
      >
        {/* The Metallic Pushpin - part of the "pinned to corkboard" look,
            only shown in the tilted homepage treatment */}
        {isPinned && (
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-5 h-5 flex items-center justify-center pointer-events-none transition-transform group-hover:-translate-y-1">
            <div className="w-3.5 h-3.5 rounded-full bg-gradient-to-br from-gray-300 to-gray-500 shadow-[0_2px_4px_rgba(0,0,0,0.9)] border border-gray-400 z-10" />
            <div className="absolute top-2 left-2 w-3 h-3 bg-black/60 rounded-full blur-[2px]" />
          </div>
        )}

        <div className="w-10 h-1 bg-blue-600/50 rounded-full mb-6 md:mb-4" />

        <h3 className="text-xl font-bold mb-3 md:mb-2 text-gray-100">
          {project.title}
        </h3>
        <p className="text-gray-400 text-sm mb-8 md:mb-5 leading-relaxed flex-grow">
          {project.desc}
        </p>

        <button className="px-5 py-2.5 text-sm bg-blue-600 group-hover:bg-blue-500 text-white rounded-lg font-medium transition-colors w-full z-10 shadow-lg shadow-blue-900/20">
          View Case Study
        </button>
      </motion.div>

      {/* ================= REUSABLE MODAL ================= */}
      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        className="max-w-2xl"
      >
        <div className="w-12 h-1 bg-blue-500 rounded-full mb-6" />
        <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
          {project.title}
        </h3>

        <div className="flex flex-wrap gap-2 mb-8">
          {project.techStack.map((tech, i) => (
            <span
              key={i}
              className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs text-blue-300 font-mono"
            >
              {tech}
            </span>
          ))}
        </div>

        <p className="text-gray-300 leading-relaxed mb-10">
          {project.fullDesc}
        </p>

        <div className="flex gap-4">
          {project.github && (
            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-5 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-lg font-medium transition-colors"
            >
              <GitBranch size={18} /> Source Code
            </a>
          )}
          {project.live && (
            <a
              href={project.live}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-medium transition-colors"
            >
              <ExternalLink size={18} /> Live Demo
            </a>
          )}
        </div>
      </Modal>
    </>
  );
}
