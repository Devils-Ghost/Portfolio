"use client";

import { useState, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import { ChevronRight, Trophy, Medal, Star } from "lucide-react";
import SuccessStoryMobileCard from "@/components/home/SuccessStoryMobileCard";
import SuccessStoryListItem, {
  StoryData,
} from "@/components/home/SuccessStoryListItem";
import SuccessStoryDetail from "@/components/home/SuccessStoryDetail";

export default function SuccessStoriesSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const mobileCarouselRef = useRef<HTMLDivElement>(null);

  const { scrollXProgress } = useScroll({ container: mobileCarouselRef });

  const stories: StoryData[] = [
    {
      title: "4th Place at Tracer Fire 13",
      org: "Sandia National Laboratories",
      type: "Digital Forensics",
      date: "Jan 2026",
      desc: "Secured 4th place overall and 2nd among ASU teams in the intensive Tracer Fire digital forensics workshop, tackling complex incident response and threat hunting scenarios.",
      icon: Trophy,
    },
    {
      title: "AI Civic Assistant Concept",
      org: "AI + Elections Hackathon",
      type: "Hackathon",
      date: "Feb 2026",
      desc: "Collaborated with teammates Saurabh Dusane and Ojas Deodhar to conceptualize a training and informational AI assistant aimed at tackling the critical need for accessible civic education.",
      icon: Medal,
    },
    {
      title: "SME Recognition",
      org: "UBS",
      type: "Professional Award",
      date: "Jul 2021 - Jun 2024",
      desc: "Recognized as a Subject Matter Expert by chief-level leadership during my tenure as a Software Engineer II, successfully bridging systems engineering with robust security practices.",
      icon: Star,
    },
  ];

  const indicatorX = useTransform(
    scrollXProgress,
    [0, 1],
    ["0%", `${(stories.length - 1) * 100}%`],
  );

  const listVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { type: "spring", stiffness: 120, damping: 20 },
    },
  };

  return (
    <section className="w-full max-w-6xl mx-auto px-6 py-16 relative overflow-visible">
      {/* Animated Header */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="flex justify-between items-end mb-10 md:mb-16"
      >
        <h2 className="text-3xl md:text-4xl font-bold">Success Stories</h2>
        <Link
          href="/blog"
          className="text-sm text-blue-400 hover:text-blue-300 flex items-center gap-1 group transition-colors"
        >
          View All{" "}
          <ChevronRight
            size={16}
            className="group-hover:translate-x-1 transition-transform"
          />
        </Link>
      </motion.div>

      {/* MOBILE CAROUSEL */}
      <div
        ref={mobileCarouselRef}
        className="flex md:hidden w-[100vw] relative left-1/2 -translate-x-1/2 overflow-x-auto snap-x snap-mandatory px-6 scroll-px-6 gap-4 pb-4 pt-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {stories.map((story, index) => (
          <SuccessStoryMobileCard key={index} story={story} />
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
              key={index}
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
          <SuccessStoryDetail story={stories[activeIndex]} />
        </motion.div>
      </div>
    </section>
  );
}
