"use client";

import { motion, type HTMLMotionProps } from "framer-motion";
import { staggerItem } from "@/components/motion/variants";
import type { Skill } from "@/content/types";

// By extending HTMLMotionProps, this component can now accept ANY Framer Motion
// or standard button property (whileHover, onClick, etc.).
interface SkillPillProps extends HTMLMotionProps<"button"> {
  /**
   * The whole entity, not its name. Phase 2 opens `SkillDetailModal` from
   * here, which needs the id — and a pill that only knew its label would be
   * back to matching skills by string, which is the thing §1.3 ② exists to
   * stop.
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
  return (
    <motion.button
      variants={staggerItem}
      {...props} // Spreads all passed animation and event props onto the button
      className={`px-6 py-3 bg-white/5 border border-white/10 rounded-full text-gray-300 font-mono text-sm hover:border-blue-500 hover:text-white transition-colors focus:outline-none ${
        props.onClick ? "cursor-pointer active:scale-95" : "cursor-default"
      } ${className || ""}`}
    >
      {skill.name}
    </motion.button>
  );
}
