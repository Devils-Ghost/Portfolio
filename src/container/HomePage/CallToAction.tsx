"use client";

import { useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, Mail, MapPin } from "lucide-react";
import HireMeModal from "@/components/HireMeModal";

// Assuming you have your HireMeModal component available to import
// import HireMeModal from "@/components/HireMeModal";

export default function CallToAction() {
  const containerRef = useRef<HTMLElement>(null);

  // State to control the modal
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Trigger the animation as the user scrolls to the bottom of the page
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 90%", "center 60%"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [80, 0]);
  const opacity = useTransform(scrollYProgress, [0, 1], [0, 1]);
  const scale = useTransform(scrollYProgress, [0, 1], [0.9, 1]);

  return (
    <section
      ref={containerRef}
      className="w-full max-w-6xl mx-auto px-6 py-14 mb-10 relative overflow-visible flex flex-col items-center justify-center"
    >
      {/* 
        Sweeping background glow that replaces the confined box. 
        It grounds the text to the background seamlessly. 
      */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl h-64 bg-blue-600/10 blur-[120px] rounded-full pointer-events-none" />

      <motion.div
        style={{ y, opacity, scale }}
        className="w-full relative z-10 flex flex-col items-center justify-center text-center"
      >
        {/* Status Indicator */}
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-500/10 border border-green-500/20 rounded-full text-green-400 text-sm font-semibold tracking-wide uppercase mb-8">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
          </span>
          Available for new opportunities
        </div>

        {/* Scaled up the typography to command the empty space */}
        <h2 className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight leading-tight">
          Let's build something <br className="hidden md:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-600">
            secure and scalable.
          </span>
        </h2>

        <div className="flex flex-col sm:flex-row items-center gap-4 mb-12">
          <div className="flex items-center gap-2 text-gray-400 text-sm font-medium px-5 py-2.5 bg-white/5 rounded-full border border-white/10 backdrop-blur-md">
            <MapPin size={16} className="text-blue-500" />
            Tempe, AZ
          </div>
        </div>

        {/* 
          Switched from Link to button.
          Using a high-contrast white button here looks incredible against dark backgrounds
          and draws the eye immediately.
        */}
        <button
          onClick={() => setIsModalOpen(true)}
          className="relative z-10 inline-flex items-center gap-2 px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-full transition-all duration-300 hover:scale-105 hover:shadow-[0_0_30px_rgba(59,130,246,0.4)] active:scale-95 group"
        >
          <Mail size={20} />
          Get in Touch
          <ArrowRight
            size={18}
            className="group-hover:translate-x-1 transition-transform"
          />
        </button>
      </motion.div>

      <HireMeModal isOpen={isModalOpen} setIsOpen={setIsModalOpen} />
    </section>
  );
}
