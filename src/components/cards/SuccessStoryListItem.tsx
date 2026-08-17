"use client";

import { motion } from "framer-motion";

export interface StoryData {
  title: string;
  org: string;
  type: string;
  date: string;
  desc: string;
  icon: any;
}

interface SuccessStoryListItemProps {
  story: StoryData;
  isActive: boolean;
  onHover: () => void;
  onClick: () => void;
  variants: any;
}

export default function SuccessStoryListItem({
  story,
  isActive,
  onHover,
  onClick,
  variants,
}: SuccessStoryListItemProps) {
  return (
    <motion.div
      variants={variants}
      onMouseEnter={onHover}
      onClick={onClick}
      className={`relative pl-6 py-5 cursor-pointer transition-all duration-300 rounded-r-xl ${
        isActive ? "bg-white/[0.02]" : "hover:bg-white/[0.01]"
      }`}
    >
      {isActive && (
        <motion.div
          layoutId="activeStoryIndicator"
          className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500 rounded-full shadow-[0_0_10px_rgba(59,130,246,0.8)]"
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        />
      )}
      <h3
        className={`text-xl lg:text-2xl font-bold transition-all duration-300 ${isActive ? "text-white scale-[1.02] origin-left" : "text-gray-400"}`}
      >
        {story.title}
      </h3>
      <div
        className={`flex items-center gap-3 mt-1.5 font-mono text-sm transition-all duration-300 ${isActive ? "text-blue-400" : "text-gray-600"}`}
      >
        <span>{story.org}</span>
      </div>
    </motion.div>
  );
}
