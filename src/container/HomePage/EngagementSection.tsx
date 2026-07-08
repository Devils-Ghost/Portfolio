"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ChevronRight, Flag, Trophy, Code } from "lucide-react";
import EngagementCard, {
  EngagementData,
} from "@/components/home/EngagementCard";

export default function EngagementSection() {
  const [activeIndex, setActiveIndex] = useState(0);

  const engagements: EngagementData[] = [
    {
      title: "DEF CON 32 CTF",
      org: "DEF CON",
      type: "Competition",
      date: "Aug 2024",
      desc: "Competed in high-stakes capture the flag challenges focusing on binary exploitation, cryptography, and network forensics at one of the world's most prestigious hacker conventions.",
      icon: Flag,
      number: "01",
    },
    {
      title: "AI + Elections Hackathon",
      org: "Arizona State University",
      type: "Hackathon",
      date: "Oct 2023",
      desc: "Conceptualized and prototyped a secure AI civic assistant to help voters verify polling data and combat election misinformation. Reached the final rounds of the competition.",
      icon: Trophy,
      number: "02",
    },
    {
      title: "Open Source Contributor",
      org: "Hyperledger Foundation",
      type: "Open Source",
      date: "Jan 2023 - Dec 2023",
      desc: "Contributed directly to Hyperledger Fabric repositories, improving smart contract efficiency and documentation for the Go SDK, bridging enterprise blockchain with robust security.",
      icon: Code,
      number: "03",
    },
  ];

  return (
    <section className="w-full max-w-6xl mx-auto px-6 py-16">
      {/* ================= ANIMATED HEADER ================= */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="flex justify-between items-end mb-16"
      >
        <h2 className="text-3xl md:text-4xl font-bold">
          Leadership & Engagement
        </h2>
        <Link
          href="/experience"
          className="text-sm text-blue-400 hover:text-blue-300 flex items-center gap-1 group transition-colors"
        >
          View all{" "}
          <ChevronRight
            size={16}
            className="group-hover:translate-x-1 transition-transform"
          />
        </Link>
      </motion.div>

      {/* ================= ANIMATED ACCORDION CONTAINER ================= */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
        className="flex flex-col md:flex-row w-full h-[600px] md:h-[450px] gap-4"
      >
        {engagements.map((exp, index) => (
          <EngagementCard
            key={index}
            exp={exp}
            isActive={activeIndex === index}
            onHover={() => setActiveIndex(index)}
            onClick={() => setActiveIndex(index)}
          />
        ))}
      </motion.div>
    </section>
  );
}
