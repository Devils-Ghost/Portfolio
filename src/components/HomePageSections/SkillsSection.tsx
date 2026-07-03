"use client";

import { motion } from "framer-motion";

export default function SkillsSection() {
  const skills = [
    "Python",
    "C/C++",
    "x86 Assembly",
    "Go",
    "Offensive Security",
    "Reverse Engineering",
  ];

  return (
    <section className="w-full max-w-6xl mx-auto px-6 py-20">
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-3xl font-bold mb-8 text-center"
      >
        Technical Arsenal
      </motion.h2>
      <div className="flex flex-wrap justify-center gap-4">
        {skills.map((skill, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1, duration: 0.4 }}
            className="px-6 py-3 bg-white/5 border border-white/10 rounded-full text-gray-300 font-mono text-sm hover:border-blue-500 transition-colors"
          >
            {skill}
          </motion.div>
        ))}
      </div>
    </section>
  );
}
