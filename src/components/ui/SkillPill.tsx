"use client";

import {
  motion,
  useTransform,
  type HTMLMotionProps,
  type MotionValue,
} from "framer-motion";
import type { Skill } from "@/content/types";

// By extending HTMLMotionProps, this component can now accept ANY Framer Motion
// or standard button property (initial, whileInView, onClick, etc.). `style` is
// omitted because the pill owns its own entrance transform — see below.
interface SkillPillProps extends Omit<HTMLMotionProps<"button">, "style"> {
  /**
   * The whole entity, not its name. Phase 2 opens `SkillDetailModal` from
   * here, which needs the id — and a pill that only knew its label would be
   * back to matching skills by string, which is the thing §1.3 ② exists to
   * stop.
   */
  skill: Skill;
  /**
   * The *section's* scroll progress, shared by every pill (see SkillsSection).
   * Each pill derives its own staggered slice of it from `index`, so the row
   * settles as one composed unit rather than each pill tracking its own
   * visibility.
   */
  progress: MotionValue<number>;
  /** Position in the row — drives this pill's slice of `progress`. */
  index: number;
}

export default function SkillPill({
  skill,
  progress,
  index,
  className,
  ...props
}: SkillPillProps) {
  // These two hooks deliberately live HERE and not in the parent's .map().
  // React matches hooks positionally across renders, so calling useTransform
  // once per item inside a loop only works while the list is a fixed-length
  // literal. Now that the list comes from the content repository and varies
  // in length, React would throw "Rendered fewer hooks than expected" and the
  // page would white-screen. One component instance, one pair of calls, always.
  const start = 0.1 + index * 0.08;
  const end = start + 0.2;

  const opacity = useTransform(progress, [start, end], [0, 1]);
  const scale = useTransform(progress, [start, end], [0.8, 1]);

  return (
    <motion.button
      {...props} // Spreads all passed animation and event props onto the button
      style={{ opacity, scale }}
      className={`px-6 py-3 bg-white/5 border border-white/10 rounded-full text-gray-300 font-mono text-sm hover:border-blue-500 hover:text-white transition-colors focus:outline-none ${
        props.onClick ? "cursor-pointer active:scale-95" : "cursor-default"
      } ${className || ""}`}
    >
      {skill.name}
    </motion.button>
  );
}
