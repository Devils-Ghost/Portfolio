"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

export default function AboutSection() {
  return (
    <section className="w-full max-w-6xl mx-auto px-6 py-20 overflow-hidden">
      <div className="flex flex-col md:flex-row gap-12 items-center">
        <motion.div
          initial={{ opacity: 0, y: -100, rotate: -5 }}
          whileInView={{ opacity: 1, y: 0, rotate: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ type: "spring", bounce: 0.4, duration: 1 }}
          className="w-full md:w-1/3 aspect-[3/4] bg-white/5 border border-white/10 rounded-2xl flex flex-col items-center justify-center p-6 shadow-2xl relative"
        >
          <div className="w-32 h-32 rounded-full bg-blue-900/50 border-2 border-blue-500 mb-4 flex items-center justify-center text-blue-300">
            Image Here
          </div>
          <h3 className="text-xl font-bold">Dhaval Tanna</h3>
          <p className="text-sm text-gray-400">Software Engineer</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 100 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="w-full md:w-2/3"
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-6">Hello, World.</h2>
          <p className="text-gray-400 text-lg leading-relaxed mb-6">
            I am an enterprise software engineer and system security specialist
            with a deep focus on offensive security, binary exploitation, and
            building robust backend infrastructure. From designing secure cloud
            migrations to analyzing kernel-level vulnerabilities, I build
            systems by understanding exactly how they can be broken.
          </p>
          <Link
            href="/about"
            className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 font-medium"
          >
            Read more about me <ChevronRight size={16} />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
