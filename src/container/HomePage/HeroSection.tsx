"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, animate, motion } from "framer-motion";
import { ChevronsDown, FileText } from "lucide-react";
import { useIntro } from "@/context/IntroContext";

// Two versions of line one — genuinely picked at random per visit, see note below.
const HEADLINES = [
  "Building software that scales.",
  "Building scalable software.",
];

const ROLE_LINE_1 = "> Full-Stack Software Engineer | > Systems Architect";
const ROLE_LINE_2 = "> Cybersecurity Practitioner";
const ROLE_SCRIPT = `${ROLE_LINE_1}\n${ROLE_LINE_2}`;

const STATUSES = [
  "Interviewing for SWE & Security roles",
  "Building independent projects to sharpen the craft",
  "Researching LLM-assisted reverse engineering",
];

export default function HeroSection() {
  const { isIntroDone } = useIntro();
  const [reduceMotion, setReduceMotion] = useState(false);

  // Deterministic default (matches server render) so there's no hydration
  // mismatch — the real random pick happens client-side in the effect below,
  // which also means it's re-rolled fresh on every visit rather than baked
  // into the page at build time.
  const [headline, setHeadline] = useState(HEADLINES[0]);
  useEffect(() => {
    setHeadline(HEADLINES[Math.floor(Math.random() * HEADLINES.length)]);
  }, []);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduceMotion(mq.matches);
  }, []);

  // --- roles: type once across two lines, then stay put (no looping) ---
  // Vertical, not horizontal, so a quick visitor's eyes don't have to travel
  // far, and — unlike a perpetual rotator — nobody leaves before seeing all
  // three roles: they all end up permanently on screen a few seconds in.
  const [roleCharCount, setRoleCharCount] = useState(0);

  useEffect(() => {
    if (reduceMotion) {
      setRoleCharCount(ROLE_SCRIPT.length); // show the finished state instantly
      return;
    }
    if (!isIntroDone) return; // hero isn't visible yet — don't burn typing time behind the splash screen
    if (roleCharCount >= ROLE_SCRIPT.length) return; // done typing, stop scheduling
    const timeout = setTimeout(() => setRoleCharCount((c) => c + 1), 40);
    return () => clearTimeout(timeout);
  }, [roleCharCount, reduceMotion, isIntroDone]);

  const revealedRoles = ROLE_SCRIPT.slice(0, roleCharCount);
  const [roleLine1 = "", roleLine2 = ""] = revealedRoles.split("\n");
  const roleCursorOnLine2 = revealedRoles.includes("\n");

  // --- rotating status badge (crossfade) ---
  // Rotation itself always runs, for everyone — reduced motion should mean
  // "don't animate the transition," not "only ever see the first status."
  const [statusIndex, setStatusIndex] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setStatusIndex((i) => (i + 1) % STATUSES.length);
    }, 3200);
    return () => clearInterval(interval);
  }, []);

  // Native `scrollIntoView({ behavior: "smooth" })` duration isn't
  // controllable and tends to finish almost instantly for a short distance
  // like this one — so we drive the scroll ourselves over a fixed duration
  // instead, matching AboutSection's `scroll-mt-28` (7rem = 112px) offset.
  const ABOUT_SCROLL_OFFSET = 112;

  const scrollToAbout = () => {
    const target = document.getElementById("about");
    if (!target) return;
    const targetY =
      target.getBoundingClientRect().top + window.scrollY - ABOUT_SCROLL_OFFSET;

    if (reduceMotion) {
      window.scrollTo({ top: targetY });
      return;
    }

    animate(window.scrollY, targetY, {
      duration: 1.4,
      ease: "easeInOut",
      onUpdate: (v) => window.scrollTo(0, v),
    });
  };

  return (
    <section className="relative w-full min-h-screen flex flex-col justify-center items-center px-4 pt-32 pb-20">
      <div className="max-w-4xl mx-auto text-center z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-sm text-gray-300 mb-8"
        >
          <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse shrink-0" />
          <AnimatePresence mode="wait">
            <motion.span
              key={statusIndex}
              initial={reduceMotion ? false : { opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduceMotion ? undefined : { opacity: 0, y: -4 }}
              transition={{ duration: reduceMotion ? 0 : 0.35 }}
            >
              {STATUSES[statusIndex]}
            </motion.span>
          </AnimatePresence>
        </motion.div>

        <motion.main
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6">
            {headline} <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-600">
              Breaking it to make it secure.
            </span>
          </h1>
        </motion.main>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-lg md:text-xl text-gray-400 mb-10 font-mono flex flex-col items-center gap-1"
        >
          <p>
            {roleLine1}
            {!reduceMotion && !roleCursorOnLine2 && (
              <span className="inline-block w-[2px] h-[1em] ml-1 -mb-[2px] bg-blue-400 animate-pulse" />
            )}
          </p>
          <p>
            {roleLine2}
            {!reduceMotion && roleCursorOnLine2 && (
              <span className="inline-block w-[2px] h-[1em] ml-1 -mb-[2px] bg-blue-400 animate-pulse" />
            )}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <button
            type="button"
            onClick={scrollToAbout}
            className="group relative inline-flex items-center gap-2 px-8 py-3 bg-white text-black rounded-full font-medium hover:bg-gray-200 transition-colors"
          >
            Start Journey
            <motion.span
              animate={reduceMotion ? {} : { y: [0, 5, 0] }}
              transition={{
                duration: 1.4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="inline-flex"
            >
              <ChevronsDown size={18} />
            </motion.span>
          </button>

          <a
            href="https://drive.google.com/uc?export=download&id=17RYy9hctO-rfH_bKPNK46Mf5frHhoX7m"
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
