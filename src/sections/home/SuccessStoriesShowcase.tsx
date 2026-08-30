"use client";

import { useState, useRef } from "react";
import { motion, useScroll, useTransform, type Variants } from "framer-motion";
import SuccessStoryMobileCard from "@/components/cards/SuccessStoryMobileCard";
import SuccessStoryListItem from "@/components/cards/SuccessStoryListItem";
import SuccessStoryDetail from "@/components/cards/SuccessStoryDetail";
import type { Story } from "@/content/types";

/**
 * The two presentations of the same three stories: a snap carousel with a
 * scroll-progress indicator on mobile, a list-plus-detail split on desktop.
 *
 * Client, because the desktop split tracks which story is selected and the
 * mobile indicator reads `useScroll` on the carousel element. The stories
 * themselves come from the Server Component in SuccessStoriesSection
 * (PROJECT_PLAN.md §D4).
 */
export default function SuccessStoriesShowcase({
  stories,
}: {
  stories: Story[];
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const mobileCarouselRef = useRef<HTMLDivElement>(null);

  const { scrollXProgress } = useScroll({ container: mobileCarouselRef });

  // One card's width per step. `stories.length - 1` steps for `length` cards,
  // and the guard keeps an empty list from producing a NaN transform rather
  // than an invisible indicator.
  const indicatorX = useTransform(
    scrollXProgress,
    [0, 1],
    ["0%", `${Math.max(stories.length - 1, 0) * 100}%`],
  );

  const listVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.2 },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { type: "spring", stiffness: 120, damping: 20 },
    },
  };

  const active = stories[activeIndex];

  return (
    <>
      {/* MOBILE CAROUSEL */}
      <div
        ref={mobileCarouselRef}
        className="flex md:hidden w-[100vw] relative left-1/2 -translate-x-1/2 overflow-x-auto snap-x snap-mandatory px-6 scroll-px-6 gap-4 pb-4 pt-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {stories.map((story) => (
          <SuccessStoryMobileCard key={story.id} story={story} />
        ))}
        <div className="w-1 shrink-0" />
      </div>

      {/* MOBILE INDICATOR */}
      <div className="flex md:hidden justify-center w-full mt-4 mb-4">
        <div className="w-16 h-1.5 bg-white/10 rounded-full overflow-hidden flex">
          <motion.div
            className="h-full bg-blue-500 rounded-full"
            style={{ width: `${100 / stories.length}%`, x: indicatorX }}
          />
        </div>
      </div>

      {/* DESKTOP SPLIT SCREEN */}
      <div className="hidden md:flex flex-col md:flex-row gap-12 lg:gap-20 min-h-[400px]">
        {/* Left Side */}
        <motion.div
          variants={listVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="w-full md:w-[45%] flex flex-col justify-center gap-2"
        >
          {stories.map((story, index) => (
            <SuccessStoryListItem
              key={story.id}
              story={story}
              isActive={index === activeIndex}
              onHover={() => setActiveIndex(index)}
              onClick={() => setActiveIndex(index)}
              variants={itemVariants}
            />
          ))}
        </motion.div>

        {/* Right Side */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, filter: "blur(10px)" }}
          whileInView={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
          className="w-full md:w-[55%] flex items-center"
        >
          {active && <SuccessStoryDetail story={active} />}
        </motion.div>
      </div>
    </>
  );
}
