"use client";

import { motion } from "framer-motion";
import { useEffect } from "react";
import { useIntro } from "@/context/IntroContext";

export default function SplashScreen() {
  const { setIsIntroDone } = useIntro();

  useEffect(() => {
    // Wait for the animation to finish (2 seconds), then trigger the site load
    const timer = setTimeout(() => {
      setIsIntroDone(true);
    }, 2000);
    return () => clearTimeout(timer);
  }, [setIsIntroDone]);

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black"
      exit={{ opacity: 0, transition: { duration: 0.5, ease: "easeInOut" } }}
    >
      {/* The layoutId="brand-name" is the magic key that connects this to the Navbar */}
      <motion.div
        layoutId="brand-name"
        transition={{ type: "tween", ease: "easeInOut", duration: 2.5 }}
        className="relative text-5xl md:text-7xl font-bold tracking-tight"
        style={{ fontFamily: "Arial, Helvetica, sans-serif" }}
      >
        {/* The Base Layer (Ghost Text waiting to be filled) */}
        <span className="text-white/20 block">Dhaval Tanna</span>

        {/* The Solid Fill with Photographic Light/Shadow */}
        <motion.span
          className="absolute left-0 top-0 text-white overflow-hidden whitespace-nowrap"
          initial={{ clipPath: "inset(100% 0 0 0)" }}
          animate={{ clipPath: "inset(0% 0 0 0)" }}
          transition={{ duration: 1.2, ease: "easeInOut", delay: 0.3 }}
          style={{
            // Light from top-left casts a soft, blurred glow to the bottom-right
            textShadow:
              "6px 2px 8px rgba(255, 255, 255, 0.25), 2px 0px 3px rgba(255, 255, 255, 0.15)",
          }}
        >
          Dhaval Tanna
        </motion.span>
      </motion.div>
    </motion.div>
  );
}
