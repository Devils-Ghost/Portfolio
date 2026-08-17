"use client";

import { motion } from "framer-motion";
import { Calendar } from "lucide-react";

export interface EngagementData {
  title: string;
  org: string;
  type: string;
  date: string;
  desc: string;
  icon: any;
  number: string;
}

interface EngagementCardProps {
  exp: EngagementData;
  isActive: boolean;
  onHover: () => void;
  onClick: () => void;
}

export default function EngagementCard({
  exp,
  isActive,
  onHover,
  onClick,
}: EngagementCardProps) {
  const Icon = exp.icon;

  return (
    <motion.div
      onMouseEnter={onHover}
      onClick={onClick}
      className={`relative group overflow-hidden rounded-3xl cursor-pointer transition-[flex,border-color,background-color] duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] border ${
        isActive
          ? "flex-[4] bg-[#0a0f18] border-blue-500/30 shadow-[0_0_30px_rgba(59,130,246,0.1)]"
          : "flex-[1] bg-black/40 border-white/5 hover:bg-white/[0.03]"
      }`}
    >
      {/* Background Number */}
      <div
        className={`absolute -bottom-6 -right-2 md:-bottom-10 md:-right-4 text-[100px] md:text-[150px] font-bold tracking-tighter leading-none transition-all duration-700 pointer-events-none ${isActive ? "text-white/[0.03]" : "text-white/[0.02]"}`}
      >
        {exp.number}
      </div>

      {/* ================= INACTIVE STATE (Spine) ================= */}
      <div
        className={`absolute inset-0 flex flex-row md:flex-col justify-start md:justify-center items-center p-4 md:p-6 transition-opacity duration-500 ${
          isActive
            ? "opacity-0 pointer-events-none delay-0"
            : "opacity-100 delay-200"
        }`}
      >
        <div className="w-12 h-12 md:w-14 md:h-14 shrink-0 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 group-hover:text-blue-400 group-hover:border-blue-500/30 group-hover:bg-blue-500/10 transition-all duration-300">
          <Icon size={20} className="md:w-6 md:h-6" />
        </div>
        <div className="md:hidden flex flex-col ml-4 overflow-hidden">
          <span className="text-gray-500 font-mono text-[10px] uppercase tracking-widest mb-0.5">
            {exp.type}
          </span>
          <h3 className="text-white font-bold text-base truncate">
            {exp.title}
          </h3>
        </div>
      </div>

      {/* ================= ACTIVE STATE (Details) ================= */}
      <div
        className={`absolute inset-0 p-6 md:p-10 flex flex-col justify-end bg-gradient-to-t from-[#0a0f18] via-[#0a0f18]/90 to-transparent transition-opacity duration-500 ${
          isActive
            ? "opacity-100 delay-300"
            : "opacity-0 pointer-events-none delay-0"
        }`}
      >
        <div className="flex flex-col gap-3 md:gap-4 max-w-lg">
          <div className="flex flex-wrap items-center gap-3 md:gap-4">
            <div className="flex items-center gap-2 text-blue-400 bg-blue-500/10 px-2.5 py-1 md:px-3 md:py-1.5 rounded-lg border border-blue-500/20">
              <Icon size={12} className="md:w-3.5 md:h-3.5" />
              <span className="text-[10px] md:text-xs uppercase tracking-wider font-semibold">
                {exp.type}
              </span>
            </div>
            <div className="flex items-center gap-1.5 md:gap-2 text-gray-400 text-xs md:text-sm font-mono">
              <Calendar size={12} className="md:w-3.5 md:h-3.5" />
              {exp.date}
            </div>
          </div>
          <div>
            <h3 className="text-xl md:text-3xl font-bold text-white mb-1 leading-tight">
              {exp.title}
            </h3>
            <span className="text-blue-400 font-medium text-sm md:text-base">
              {exp.org}
            </span>
          </div>
          <p className="text-gray-400 leading-relaxed text-xs md:text-base line-clamp-3 md:line-clamp-none">
            {exp.desc}
          </p>
        </div>
      </div>
    </motion.div>
  );
}
