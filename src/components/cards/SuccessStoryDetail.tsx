"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, Calendar } from "lucide-react";
import { StoryData } from "./SuccessStoryListItem";

export default function SuccessStoryDetail({ story }: { story: StoryData }) {
  const Icon = story.icon;

  return (
    <div className="w-full p-8 md:p-10 bg-[#0a0f18] border border-white/5 rounded-3xl shadow-2xl relative overflow-hidden min-h-[320px] flex items-center">
      <div className="absolute -top-20 -right-20 w-64 h-64 bg-blue-500/10 blur-[100px] rounded-full pointer-events-none" />

      <AnimatePresence mode="wait">
        <motion.div
          key={story.title}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -15 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="relative z-10 flex flex-col w-full"
        >
          <div className="flex flex-wrap items-center gap-3 mb-6">
            <div className="flex items-center gap-2 px-3 py-1 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-full text-xs uppercase tracking-widest font-semibold">
              <Icon size={14} />
              <span>{story.type}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-400 text-sm font-mono">
              <Calendar size={14} />
              {story.date}
            </div>
          </div>
          <h4 className="text-2xl md:text-3xl font-bold text-white mb-4 leading-tight">
            {story.title}
          </h4>
          <p className="text-gray-400 text-base leading-relaxed mb-6">
            {story.desc}
          </p>
          <div>
            <button className="text-sm font-medium text-blue-400 hover:text-blue-300 flex items-center gap-1 transition-colors group">
              Read full story
              <ChevronRight
                size={16}
                className="group-hover:translate-x-1 transition-transform"
              />
            </button>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
