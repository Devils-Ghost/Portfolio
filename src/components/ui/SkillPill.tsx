"use client";

import { motion, type HTMLMotionProps } from "framer-motion";
import { staggerItem } from "@/components/motion/variants";
import { useDetailModal } from "@/components/modals/DetailModalHost";
import type { Skill } from "@/content/types";

interface SkillPillProps extends Omit<HTMLMotionProps<"button">, "onClick"> {
  /**
   * The whole entity, not its name. Every skill pill on the site — Technical
   * Arsenal here, the full matrix on `/about` — opens the same evidence
   * modal, so the click behaviour lives in this component rather than being
   * wired at each call site.
   */
  skill: Skill;
}

/**
 * The pill's entrance comes from the row's `staggerParent`, which it inherits
 * by declaring `staggerItem` — so it needs neither its own scroll subscription
 * nor its index. That's what removed the hooks-in-a-loop hazard for good:
 * there is no hook here to call.
 */
export default function SkillPill({
  skill,
  className,
  ...props
}: SkillPillProps) {
  const { open } = useDetailModal();

  return (
    <motion.button
      variants={staggerItem}
      {...props}
      onClick={() => open({ kind: "skill", id: skill.id })}
      className={`px-6 py-3 bg-white/5 border border-white/10 rounded-full text-gray-300 font-mono text-sm hover:border-blue-500 hover:text-white transition-colors focus:outline-none cursor-pointer active:scale-95 ${className || ""}`}
    >
      {skill.name}
    </motion.button>
  );
}
