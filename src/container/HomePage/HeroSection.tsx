"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, FileText } from "lucide-react";

export default function HeroSection() {
  return (
    <section className="relative w-full min-h-screen flex flex-col justify-center items-center px-4 pt-32 pb-20">
      <div className="max-w-4xl mx-auto text-center z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-sm text-gray-300 mb-8"
        >
          <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
          Evaluating decompilers & reverse engineering
        </motion.div>

        <motion.main
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6">
            Building scalable architecture. <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-600">
              Breaking it to make it secure.
            </span>
          </h1>
        </motion.main>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-lg md:text-xl text-gray-400 mb-10 font-mono"
        >
          &gt; Enterprise Software Engineer <br className="md:hidden" />
          <span className="hidden md:inline"> | </span>
          &gt; System Security Specialist <br className="md:hidden" />
          <span className="hidden md:inline"> | </span>
          &gt; Reverse Engineering Enthusiast
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <Link
            href="/projects"
            className="group relative inline-flex items-center gap-2 px-8 py-3 bg-white text-black rounded-full font-medium hover:bg-gray-200 transition-colors"
          >
            View Projects
            <ArrowRight
              size={18}
              className="group-hover:translate-x-1 transition-transform"
            />
          </Link>

          <a
            href="/Dhaval_Tanna_Resume_SDE.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-3 bg-white/5 text-white border border-white/10 rounded-full font-medium hover:bg-white/10 transition-colors"
          >
            <FileText size={18} />
            Download Resume
          </a>
        </motion.div>
      </div>
    </section>
  );
}
