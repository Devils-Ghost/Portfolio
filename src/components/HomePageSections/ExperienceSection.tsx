"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

export default function ExperienceSection() {
  const experience = [
    { role: "Software Engineer II", company: "UBS" },
    {
      role: "Graduate Teaching Assistant",
      company: "Arizona State University",
    },
  ];

  const engagements = [
    "SEFCOM Lab Volunteer",
    "Tracer Fire 13 Digital Forensics",
    "AI + Elections Hackathon",
  ];

  return (
    <section className="w-full max-w-6xl mx-auto px-6 py-20 grid grid-cols-1 md:grid-cols-2 gap-12">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold">Experience</h2>
          <Link href="/experience" className="text-sm text-blue-400">
            <ChevronRight size={20} />
          </Link>
        </div>
        <div className="flex flex-col gap-6">
          {experience.map((exp, index) => (
            <div key={index} className="border-l-2 border-white/10 pl-6 pb-6">
              <h3 className="text-xl font-bold">{exp.role}</h3>
              <p className="text-blue-400 font-mono text-sm">{exp.company}</p>
            </div>
          ))}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <h2 className="text-3xl font-bold mb-8">Engagement</h2>
        <ul className="flex flex-col gap-4">
          {engagements.map((item, index) => (
            <li
              key={index}
              className="flex items-center gap-3 text-gray-300 bg-white/5 p-4 rounded-xl border border-white/10"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
              {item}
            </li>
          ))}
        </ul>
      </motion.div>
    </section>
  );
}
