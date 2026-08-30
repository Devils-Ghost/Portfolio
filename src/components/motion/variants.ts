import type { Variants } from "framer-motion";

/**
 * The site's entrance animations, in one place (PROJECT_PLAN.md §4).
 *
 * Every section fades and lifts the same way on the way in, so the settings
 * live here rather than being retyped per section — retuning the easing is
 * one edit, and a section added later can't quietly arrive at a different
 * speed.
 *
 * All of them are `once: true`. An entrance that reverses when you scroll
 * back up reads as the page undoing itself; once an element has arrived, it
 * stays. The one deliberate exception on the site is the Success Stories
 * mobile indicator, which tracks horizontal scroll position rather than
 * animating an entrance.
 */

/** Spread onto a ScrollReveal. The default entrance for a heading or a block. */
export const fadeUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-100px" },
  transition: { duration: 0.7, ease: "easeOut" },
} as const;

/** `fadeUp`, arriving a beat later — for the second half of a two-part section. */
export const fadeUpDelayed = {
  ...fadeUp,
  transition: { ...fadeUp.transition, delay: 0.2 },
} as const;

/**
 * Spread onto the container of a staggered list. Children opt in by declaring
 * `variants={staggerItem}`; they inherit `hidden`/`visible` from here, so no
 * child needs to know its own position.
 *
 * Stagger is per-child and time-based on purpose. The previous version
 * derived each child's timing from its index against the section's scroll
 * progress, which put the last item's window past the end of the timeline
 * once a list grew past about ten items — they faded in partially, or never.
 * A time-based stagger has no such ceiling.
 */
export const staggerParent = {
  initial: "hidden",
  whileInView: "visible",
  viewport: { once: true, margin: "-100px" },
  variants: {
    hidden: {},
    visible: { transition: { staggerChildren: 0.06, delayChildren: 0.1 } },
  } satisfies Variants,
} as const;

/** The default child of a `staggerParent`. */
export const staggerItem: Variants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.4, ease: "easeOut" },
  },
};
