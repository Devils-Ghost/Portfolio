"use client";

import { Calendar, ChevronRight } from "lucide-react";
import { StoryData } from "./SuccessStoryListItem";

export default function SuccessStoryMobileCard({
  story,
}: {
  story: StoryData;
}) {
  const Icon = story.icon;

  return (
    <div className="snap-start shrink-0 w-[85vw] sm:w-[75vw] bg-[#0a0f18] border border-white/5 rounded-3xl shadow-2xl relative overflow-hidden flex flex-col p-6 sm:p-8">
      <div className="absolute -top-16 -right-16 w-48 h-48 bg-blue-500/10 blur-[80px] rounded-full pointer-events-none" />
      <div className="relative z-10 flex flex-col h-full">
        <div className="flex flex-wrap items-center gap-3 mb-5">
          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-full text-[10px] uppercase tracking-widest font-semibold">
            <Icon size={12} />
            <span>{story.type}</span>
          </div>
          <div className="flex items-center gap-1.5 text-gray-400 text-xs font-mono">
            <Calendar size={12} />
            {story.date}
          </div>
        </div>
        <h4 className="text-xl font-bold text-white mb-2 leading-tight">
          {story.title}
        </h4>
        <span className="text-blue-400 text-sm font-medium mb-4">
          {story.org}
        </span>
        <p className="text-gray-400 text-sm leading-relaxed mb-6">
          {story.desc}
        </p>
        <div className="mt-auto pt-4">
          <button className="w-full py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl text-sm font-medium flex items-center justify-center gap-2 transition-colors active:scale-[0.98]">
            Read full story
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
