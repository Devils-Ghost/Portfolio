"use client";

import { motion, type Variants } from "framer-motion";
import { useDetailModal } from "@/components/modals/DetailModalHost";
import { cn } from "@/lib/utils";
import type { Project } from "@/content/types";

interface ProjectCardProps {
  project: Project;
  /**
   * Position in the row. Drives which side the card slides in from, so the
   * cluster arrives as an alternating fan rather than three cards travelling
   * together.
   */
  index: number;
  onClick?: () => void; // Optional hook (e.g. analytics) - opening the modal is handled by useDetailModal
  className?: string;
  // Resting tilt in degrees, set by the parent per-card - part of the
  // "pinned to a corkboard" look.
  baseRotation?: number;
}

/**
 * Purely presentational (PROJECT_PLAN.md §1.3 ⑤): it no longer owns modal
 * state, it dispatches `{kind:"project", id}` to the one global modal host.
 * That's what lets a skill's "used in" list open a project modal from a
 * context where no `ProjectCard` is mounted at all.
 */
export default function ProjectCard({
  project,
  index,
  onClick,
  className = "",
  baseRotation = 0,
}: ProjectCardProps) {
  const { open } = useDetailModal();

  // The entrance is a variant rather than a scroll-scrubbed transform: the
  // section's container starts it, this card only says where it comes from.
  // Odd cards enter from the right, even from the left, which is what makes
  // the cluster fan out. `rotateZ` is carried through both states so the
  // resting tilt survives the animation and hover can straighten it.
  const enter: Variants = {
    hidden: {
      opacity: 0,
      x: index % 2 === 0 ? -100 : 100,
      rotateZ: baseRotation,
    },
    visible: {
      opacity: 1,
      x: 0,
      rotateZ: baseRotation,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  const handleCardClick = () => {
    open({ kind: "project", id: project.id });
    onClick?.();
  };

  return (
    <motion.div
      variants={enter}
      // Snaps straight + scales up on hover (spring, on purpose - it's a
      // quick micro-interaction, not the entrance).
      whileHover={{
        rotateZ: 0,
        scale: 1.02,
        transition: { type: "spring", stiffness: 300, damping: 20 },
      }}
      onClick={handleCardClick}
      className={cn(
        "relative flex flex-col pt-8 p-6 md:p-7 w-full md:w-[34%] md:min-h-[240px] bg-surface border border-blue-900/30 rounded-xl shadow-card hover:shadow-blue-900/20 transition-shadow cursor-pointer group",
        className,
      )}
    >
      {/* The Metallic Pushpin - part of the "pinned to corkboard" look */}
      <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-5 h-5 flex items-center justify-center pointer-events-none transition-transform group-hover:-translate-y-1">
        <div className="w-3.5 h-3.5 rounded-full bg-gradient-to-br from-gray-300 to-gray-500 shadow-[0_2px_4px_rgba(0,0,0,0.9)] border border-gray-400 z-10" />
        <div className="absolute top-2 left-2 w-3 h-3 bg-black/60 rounded-full blur-[2px]" />
      </div>

      <div className="w-10 h-1 bg-blue-600/50 rounded-full mb-6 md:mb-4" />

      <h3 className="text-xl font-bold mb-3 md:mb-2 text-gray-100">
        {project.title}
      </h3>
      <p className="text-gray-400 text-sm mb-8 md:mb-5 leading-relaxed flex-grow">
        {project.summary}
      </p>

      <button className="px-5 py-2.5 text-sm bg-blue-600 group-hover:bg-blue-500 text-white rounded-lg font-medium transition-colors w-full z-10 shadow-lg shadow-blue-900/20">
        View Case Study
      </button>
    </motion.div>
  );
}
