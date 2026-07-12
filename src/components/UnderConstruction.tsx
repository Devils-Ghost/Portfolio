"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, Mail, Terminal } from "lucide-react";

type Props = {
  /** Page name shown in the heading and terminal prompt, e.g. "Experience" */
  page: string;
  /** One-line, page-specific flavor text under the heading */
  tagline?: string;
};

/**
 * Themed placeholder for pages that don't have real content yet.
 * Styled as a little terminal window "building" the page, matching the
 * site's existing CLI-flavored copy (see HeroSection's `> ... | > ...`
 * line) rather than generic road-cone construction imagery.
 */
export default function UnderConstruction({ page, tagline }: Props) {
  const slug = page.toLowerCase().replace(/\s+/g, "-");

  const lines = useMemo(
    () => [
      `$ cd ~/${slug}`,
      `$ npm run build`,
      "",
      `> Compiling ${page} page...`,
      `> [WARN] Content not written yet`,
      `> Status: actively under construction`,
    ],
    [page, slug],
  );

  const fullText = lines.join("\n");
  const [charCount, setCharCount] = useState(0);
  const [reduceMotion, setReduceMotion] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduceMotion(mq.matches);
  }, []);

  useEffect(() => {
    if (reduceMotion) {
      setCharCount(fullText.length);
      setDone(true);
      return;
    }
    setCharCount(0);
    setDone(false);
    const interval = setInterval(() => {
      setCharCount((c) => {
        if (c >= fullText.length) {
          clearInterval(interval);
          setDone(true);
          return c;
        }
        return c + 1;
      });
    }, 22);
    return () => clearInterval(interval);
  }, [fullText, reduceMotion]);

  const typed = fullText.slice(0, charCount);

  return (
    <main className="relative min-h-screen flex flex-col items-center justify-center bg-black text-white px-4 py-32 overflow-hidden">
      {/* Ambient glow, consistent with Hero/Footer */}
      <div className="pointer-events-none absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-blue-500/10 blur-[140px] rounded-full" />

      <div className="relative z-10 max-w-xl w-full mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-sm text-gray-300 mb-8"
        >
          <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
          Page under construction
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-4xl md:text-5xl font-bold tracking-tight mb-4"
        >
          {page}{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-600">
            is being built.
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.25 }}
          className="text-gray-400 mb-10 font-mono text-sm md:text-base"
        >
          &gt; {tagline ?? "Good things take time to compile."}
        </motion.p>

        {/* Terminal */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.35 }}
          className="text-left rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-md shadow-2xl overflow-hidden mb-10"
        >
          <div className="flex items-center gap-1.5 px-4 py-3 border-b border-white/10 bg-white/[0.02]">
            <span className="w-3 h-3 rounded-full bg-red-500/70" />
            <span className="w-3 h-3 rounded-full bg-yellow-500/70" />
            <span className="w-3 h-3 rounded-full bg-green-500/70" />
            <span className="ml-3 flex items-center gap-1.5 text-xs text-gray-500 font-mono truncate">
              <Terminal size={12} />
              visitor@dhaval-tanna: ~/{slug}
            </span>
          </div>

          <pre className="p-5 font-mono text-[13px] md:text-sm leading-relaxed text-gray-300 whitespace-pre-wrap break-words min-h-[168px]">
            {typed}
            {/* Cursor */}
            <span
              className={`inline-block w-[7px] h-[1em] -mb-[2px] ml-0.5 bg-blue-400 ${
                done ? "animate-pulse" : "opacity-100"
              }`}
            />
          </pre>
        </motion.div>

        {/* Loading bar */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mb-10"
        >
          <div className="flex justify-between text-xs text-gray-500 font-mono mb-2">
            <span>build_progress.sh</span>
            <span>in progress</span>
          </div>
          <div className="h-1.5 w-full rounded-full bg-white/5 border border-white/10 overflow-hidden relative">
            <motion.div
              className="absolute top-0 h-full w-1/3 rounded-full bg-gradient-to-r from-blue-500 to-cyan-400"
              animate={reduceMotion ? {} : { left: ["-33%", "100%"] }}
              transition={{
                duration: 1.6,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              style={{ left: reduceMotion ? "20%" : "-33%" }}
            />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <Link
            href="/"
            className="group inline-flex items-center gap-2 px-8 py-3 bg-white text-black rounded-full font-medium hover:bg-gray-200 transition-colors"
          >
            <ArrowLeft
              size={18}
              className="group-hover:-translate-x-1 transition-transform"
            />
            Back to Home
          </Link>

          <a
            href="mailto:your.email@example.com"
            className="inline-flex items-center gap-2 px-8 py-3 bg-white/5 text-white border border-white/10 rounded-full font-medium hover:bg-white/10 transition-colors"
          >
            <Mail size={18} />
            Say Hello Instead
          </a>
        </motion.div>
      </div>
    </main>
  );
}
