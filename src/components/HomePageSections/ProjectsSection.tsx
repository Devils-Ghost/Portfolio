"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

export default function ProjectsSection() {
  const projects = [
    {
      title: "AI-Based Intrusion Detection System",
      desc: "Classifies 40+ types of network intrusion attempts.",
    },
    {
      title: "Blockchain Chain of Custody",
      desc: "Decentralized smart contracts built in Go.",
    },
  ];

  return (
    <section className="w-full max-w-6xl mx-auto px-6 py-20 overflow-hidden">
      <div className="flex justify-between items-end mb-12">
        <h2 className="text-3xl md:text-4xl font-bold">Featured Work</h2>
        <Link
          href="/projects"
          className="text-sm text-blue-400 hover:text-blue-300 flex items-center gap-1"
        >
          View All <ChevronRight size={16} />
        </Link>
      </div>

      <div className="flex flex-col gap-8">
        {projects.map((project, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: index % 2 === 0 ? -100 : 100 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="w-full p-8 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-colors"
          >
            <h3 className="text-2xl font-bold mb-2">{project.title}</h3>
            <p className="text-gray-400 mb-4">{project.desc}</p>
            <button className="px-4 py-2 text-sm bg-blue-600 hover:bg-blue-500 rounded-lg text-white font-medium">
              View Case Study
            </button>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
