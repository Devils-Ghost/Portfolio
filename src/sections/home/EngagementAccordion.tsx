"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import EngagementCard from "@/components/cards/EngagementCard";
import type { Engagement } from "@/content/types";

/**
 * The flex accordion. Client only because one card is expanded at a time and
 * that selection is state — the heading above it and the content itself both
 * stay on the server (PROJECT_PLAN.md §D4).
 *
 * The first card starts open, so the section never renders as three closed
 * spines with nothing to read.
 */
export default function EngagementAccordion({
  engagements,
}: {
  engagements: Engagement[];
}) {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
      className="flex flex-col md:flex-row w-full h-[600px] md:h-[450px] gap-4"
    >
      {engagements.map((engagement, index) => (
        <EngagementCard
          key={engagement.id}
          exp={engagement}
          number={String(index + 1).padStart(2, "0")}
          isActive={activeIndex === index}
          onHover={() => setActiveIndex(index)}
          onClick={() => setActiveIndex(index)}
        />
      ))}
    </motion.div>
  );
}
