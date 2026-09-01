"use client";

import { useIntro } from "@/context/IntroContext";
import SplashScreen from "./SplashScreen";
import Navbar from "./Navbar";
import Footer from "./Footer";
import CustomScrollbar from "./CustomScrollbar";
import SocialRail from "./SocialRail";
import { AnimatePresence, motion } from "framer-motion";
import type { SocialLink } from "@/content/types";

/**
 * The public site's chrome — splash, navbar, footer, scrollbar, social rail
 * — gated on `useIntro()`. A "use client" leaf, not a provider: it consumes
 * `IntroContext` and `DetailModalContext` (via `Navbar`'s descendants), it
 * doesn't own either. `(site)/layout.tsx` composes the providers directly
 * and renders this as their child.
 *
 * `socials` arrives as a prop from the Server Component in (site)/layout.tsx
 * rather than being imported here, so the chrome reads the same
 * `site.socials` the rest of the page does (PROJECT_PLAN.md §D1).
 */
export default function MainLayout({
  children,
  socials,
}: {
  children: React.ReactNode;
  socials: SocialLink[];
}) {
  const { isIntroDone } = useIntro();

  return (
    <>
      <AnimatePresence mode="wait">
        {!isIntroDone && <SplashScreen key="splash" />}
      </AnimatePresence>

      {/* Main Website - Stays hidden until intro is done */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: isIntroDone ? 1 : 0 }}
        transition={{ duration: 2, delay: 0.2 }}
        className="flex flex-col min-h-screen"
      >
        {isIntroDone && <Navbar socials={socials} />}

        {/* The main tag uses flex-grow to push the footer down if the page is short */}
        <main className="flex-grow">{children}</main>

        {/* Render Footer only when the intro is finished */}
        {isIntroDone && <Footer socials={socials} />}
      </motion.div>

      {/* Custom scroll indicator: desktop-only, no-ops until the intro is done */}
      {isIntroDone && <CustomScrollbar />}

      {/* Fixed social rail: desktop-only, no-ops until the intro is done */}
      {isIntroDone && <SocialRail socials={socials} />}
    </>
  );
}
