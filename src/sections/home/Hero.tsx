"use client";

import { useEffect, useState } from "react";
import {
  AnimatePresence,
  animate,
  motion,
  useReducedMotion,
} from "framer-motion";
import { ChevronsDown, FileText } from "lucide-react";
import { useIntro } from "@/context/IntroContext";
import type { SiteContent } from "@/content/types";

/**
 * Splits a headline into the part that renders plainly and the closing
 * sentence that gets the gradient.
 *
 * The hero has always rendered its last sentence in the blue-to-cyan
 * gradient, and `site.hero.headlines` stores each headline as one whole
 * string — there is no second field to put the accented half in, and adding
 * one would mean every future headline had to be written in two pieces. So
 * the split is derived: everything up to the final sentence break is plain,
 * the rest is accented. A single-sentence headline is all gradient, which is
 * the sensible reading of "the closing sentence is the emphasis".
 */
function splitHeadline(headline: string): [lead: string, accent: string] {
  const breakAt = headline.lastIndexOf(". ");
  return breakAt === -1
    ? ["", headline]
    : [headline.slice(0, breakAt + 1), headline.slice(breakAt + 2)];
}

/**
 * Client, because it types, rotates and scroll-animates. Its copy arrives as
 * props from the Server Component in HeroSection, so the headline and the
 * role lines are in the initial HTML (PROJECT_PLAN.md §D4).
 */
export default function Hero({ hero }: { hero: SiteContent["hero"] }) {
  // Named locally because the effects below depend on them. These arrive from
  // the repository, which memoises its parse, so their identity is stable for
  // the lifetime of the page and listing them in a dependency array doesn't
  // re-run anything — it just tells the truth about what each effect reads.
  const { headlines, statuses } = hero;
  const roleScript = hero.roleLines.join("\n");

  const { isIntroDone } = useIntro();
  // Subscribes to the media query rather than sampling it once on mount, so a
  // visitor toggling the OS setting is honoured immediately. Returns null
  // until hydrated, which for our purposes means "not reduced".
  const reduceMotion = useReducedMotion() ?? false;

  // Deterministic default (matches server render) so there's no hydration
  // mismatch — the real random pick happens client-side in the effect below,
  // which also means it's re-rolled fresh on every visit rather than baked
  // into the page at build time.
  const [headline, setHeadline] = useState(headlines[0]);
  const [headlineLead, headlineAccent] = splitHeadline(headline);
  useEffect(() => {
    // Setting state in an effect is exactly the point here: the value must
    // differ between the server render and the client, and this is the only
    // hook that runs after hydration has already matched.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setHeadline(headlines[Math.floor(Math.random() * headlines.length)]);
  }, [headlines]);

  // --- roles: type once across two lines, then stay put (no looping) ---
  // Vertical, not horizontal, so a quick visitor's eyes don't have to travel
  // far, and — unlike a perpetual rotator — nobody leaves before seeing all
  // three roles: they all end up permanently on screen a few seconds in.
  const [roleCharCount, setRoleCharCount] = useState(0);

  useEffect(() => {
    if (reduceMotion) return; // finished state is derived at render instead, below
    if (!isIntroDone) return; // hero isn't visible yet — don't burn typing time behind the splash screen
    if (roleCharCount >= roleScript.length) return; // done typing, stop scheduling
    const timeout = setTimeout(() => setRoleCharCount((c) => c + 1), 40);
    return () => clearTimeout(timeout);
  }, [roleCharCount, reduceMotion, isIntroDone, roleScript]);

  // Reduced motion shows the finished state instantly. Deriving that here
  // rather than pushing the count to its maximum from the effect keeps it a
  // pure function of props/state — and means it can't flash the empty state
  // for one frame before the effect runs.
  const revealedRoles = reduceMotion
    ? roleScript
    : roleScript.slice(0, roleCharCount);
  // Split rather than destructured into a fixed pair: the number of role
  // lines is content now, and a third one shouldn't need a code change. The
  // cursor sits on whichever line is currently being typed — always the last
  // one revealed so far.
  const revealedLines = revealedRoles.split("\n");
  const roleLines = hero.roleLines.map((_, i) => revealedLines[i] ?? "");
  const cursorLine = revealedLines.length - 1;

  // --- rotating status badge (crossfade) ---
  // Rotation itself always runs, for everyone — reduced motion should mean
  // "don't animate the transition," not "only ever see the first status."
  const [statusIndex, setStatusIndex] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setStatusIndex((i) => (i + 1) % statuses.length);
    }, 3200);
    return () => clearInterval(interval);
  }, [statuses]);

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
              {statuses[statusIndex]}
            </motion.span>
          </AnimatePresence>
        </motion.div>

        <motion.main
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6">
            {headlineLead} <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-600">
              {headlineAccent}
            </span>
          </h1>
        </motion.main>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-lg md:text-xl text-gray-400 mb-10 font-mono flex flex-col items-center gap-1"
        >
          {roleLines.map((line, i) => (
            <p key={i}>
              {line}
              {!reduceMotion && i === cursorLine && (
                <span className="inline-block w-[2px] h-[1em] ml-1 -mb-[2px] bg-blue-400 animate-pulse" />
              )}
            </p>
          ))}
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
            href={hero.resumeUrl ?? "/resume"}
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
