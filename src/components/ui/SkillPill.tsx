"use client";

import { motion, HTMLMotionProps } from "framer-motion";

// By extending HTMLMotionProps, this component can now accept ANY Framer Motion
// or standard button property (style, initial, whileInView, onClick, etc.)
interface SkillPillProps extends HTMLMotionProps<"button"> {
  skill: string;
}

export default function SkillPill({
  skill,
  className,
  ...props
}: SkillPillProps) {
  return (
    <motion.button
      {...props} // Spreads all passed animation and event props onto the button
      className={`px-6 py-3 bg-white/5 border border-white/10 rounded-full text-gray-300 font-mono text-sm hover:border-blue-500 hover:text-white transition-colors focus:outline-none ${
        props.onClick ? "cursor-pointer active:scale-95" : "cursor-default"
      } ${className || ""}`}
    >
      {skill}
    </motion.button>
  );
}
