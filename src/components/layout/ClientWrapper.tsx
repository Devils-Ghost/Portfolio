"use client";

import { IntroProvider, useIntro } from "@/context/IntroContext";
import SplashScreen from "./SplashScreen";
import Navbar from "./Navbar";
import Footer from "./Footer"; // Import your new footer here
import CustomScrollbar from "./CustomScrollbar";
import SocialRail from "./SocialRail";
import { AnimatePresence, motion } from "framer-motion";
import type { SocialLink } from "@/content/types";

function MainLayout({
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

/**
 * `socials` arrives as a prop from the Server Component in (site)/layout.tsx
 * rather than being imported here, so the chrome reads the same
 * `site.socials` the rest of the page does (PROJECT_PLAN.md §D1).
 */
export default function ClientWrapper({
  children,
  socials,
}: {
  children: React.ReactNode;
  socials: SocialLink[];
}) {
  return (
    <IntroProvider>
      <MainLayout socials={socials}>{children}</MainLayout>
    </IntroProvider>
  );
}
