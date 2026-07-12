"use client";

import { IntroProvider, useIntro } from "@/context/IntroContext";
import SplashScreen from "./SplashScreen";
import Navbar from "./Navbar";
import Footer from "./Footer"; // Import your new footer here
import CustomScrollbar from "./CustomScrollbar";
import SocialRail from "./SocialRail";
import { AnimatePresence, motion } from "framer-motion";

function MainLayout({ children }: { children: React.ReactNode }) {
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
        {isIntroDone && <Navbar />}

        {/* The main tag uses flex-grow to push the footer down if the page is short */}
        <main className="flex-grow">{children}</main>

        {/* Render Footer only when the intro is finished */}
        {isIntroDone && <Footer />}
      </motion.div>

      {/* Custom scroll indicator: desktop-only, no-ops until the intro is done */}
      {isIntroDone && <CustomScrollbar />}

      {/* Fixed social rail: desktop-only, no-ops until the intro is done */}
      {isIntroDone && <SocialRail />}
    </>
  );
}

export default function ClientWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <IntroProvider>
      <MainLayout>{children}</MainLayout>
    </IntroProvider>
  );
}
