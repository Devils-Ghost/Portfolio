"use client";

import { motion, type HTMLMotionProps } from "framer-motion";

/**
 * A `motion.div` with nothing added but a client boundary (PROJECT_PLAN.md §D4).
 *
 * Sections are Server Components now, and `whileInView` needs a client one.
 * Rather than marking a whole section `"use client"` for the sake of a heading
 * fade, the section stays on the server and wraps the animated part in this.
 * Its children are still server-rendered and passed through as props, so the
 * text lands in the initial HTML either way — which is the whole point of the
 * exercise for a page whose job is being found by recruiters.
 *
 * It takes `motion.div`'s full prop surface on purpose: this is a boundary,
 * not an abstraction, and inventing a smaller API here would mean editing it
 * every time a section wants a different easing.
 */
export default function ScrollReveal(props: HTMLMotionProps<"div">) {
  return <motion.div {...props} />;
}
