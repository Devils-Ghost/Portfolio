"use client";

import { IntroProvider, useIntro } from "@/context/IntroContext";
import SplashScreen from "./SplashScreen";
import Navbar from "./Navbar";
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
        <main className="flex-grow">{children}</main>
      </motion.div>
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
