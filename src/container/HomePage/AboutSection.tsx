"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
// import professionalImage from '../../assets/Professional-Profile-Picture,jpg';
import Image from "next/image";
import aboutData from "@/data/about.json";

export default function AboutSection() {
  return (
    <section
      id="about"
      className="relative w-full max-w-6xl mx-auto px-6 py-16 overflow-visible scroll-mt-28"
    >
      <div className="flex flex-col md:flex-row gap-16 items-center">
        {/* ================= THE STABLE CONTAINER (The Sensor) ================= */}
        {/* We move whileInView to this parent container so the scroll trigger is calculated accurately */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          // amount: 0.4 means 40% of the container must be in view before it triggers
          viewport={{ once: true, amount: 0.4 }}
          className="w-full md:w-1/3 relative flex justify-center mt-12 md:mt-0 perspective-1000"
        >
          {/* ================= THE HANGING ID CARD (The Moving Part) ================= */}
          <motion.div
            variants={{
              hidden: { y: -300, rotate: 15, opacity: 0 },
              visible: {
                y: 0,
                rotate: 0,
                opacity: 1,
                transition: {
                  type: "spring",
                  damping: 5,
                  stiffness: 40,
                  mass: 1,
                },
              },
            }}
            whileHover={{
              rotate: [-2, 2, -1, 1, 0],
              transition: { duration: 1 },
            }}
            style={{ transformOrigin: "top center" }}
            className="relative flex flex-col items-center cursor-grab active:cursor-grabbing"
          >
            {/* 1. The Lanyard String */}
            <div className="w-1.5 h-32 bg-gradient-to-b from-gray-900 to-gray-600 rounded-t-full absolute -top-32 shadow-lg" />

            {/* 2. The Badge Clip */}
            <div className="w-10 h-5 bg-gradient-to-b from-gray-300 to-gray-500 rounded-t-md border border-gray-400 absolute -top-5 z-10 flex justify-center items-start shadow-xl">
              <div className="w-5 h-1.5 bg-gray-800 rounded-full mt-1 shadow-inner" />
            </div>

            {/* 3. The ID Card Body */}
            <div className="w-64 aspect-[3/4.2] bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl flex flex-col items-center p-2 shadow-2xl relative overflow-hidden group">
              <div className="w-full h-full bg-black/60 rounded-xl flex flex-col items-center p-4 border border-white/5">
                <div className="w-full aspect-square bg-gradient-to-br from-blue-900/40 to-black rounded-lg mb-4 flex flex-col items-center justify-center border border-white/10 overflow-hidden relative group-hover:border-blue-500/50 transition-colors duration-500">
                  <div className="absolute top-2 left-2 w-2 h-2 border-t-2 border-l-2 border-blue-500/50" />
                  <div className="absolute bottom-2 right-2 w-2 h-2 border-b-2 border-r-2 border-blue-500/50" />
                  <Image
                    src="/Professional-Profile-Picture.jpg"
                    alt="Dhaval Tanna"
                    fill
                    sizes="208px"
                    className="object-cover"
                  />
                </div>

                <h3 className="text-xl font-bold tracking-tight text-white mt-auto">
                  Dhaval Tanna
                </h3>
                <p className="text-xs text-blue-400 font-mono text-center mt-1">
                  Software Engineer
                </p>

                <div className="w-4/5 h-8 mt-6 opacity-30 flex gap-1 justify-center items-center">
                  <div className="w-1 h-full bg-white rounded-sm"></div>
                  <div className="w-2 h-full bg-white rounded-sm"></div>
                  <div className="w-1 h-full bg-white rounded-sm"></div>
                  <div className="w-0.5 h-full bg-white rounded-sm"></div>
                  <div className="w-3 h-full bg-white rounded-sm"></div>
                  <div className="w-1 h-full bg-white rounded-sm"></div>
                  <div className="w-2 h-full bg-white rounded-sm"></div>
                  <div className="w-0.5 h-full bg-white rounded-sm"></div>
                  <div className="w-1.5 h-full bg-white rounded-sm"></div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* ================= TEXT SLIDE IN ================= */}
        <motion.div
          initial={{ opacity: 0, x: 100 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="w-full md:w-2/3"
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            {aboutData.greeting}
          </h2>
          <p className="text-gray-400 text-lg leading-relaxed mb-6">
            {aboutData.description}
          </p>
          <Link
            href="/about"
            className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 font-medium group"
          >
            Read more about me{" "}
            <ChevronRight
              size={16}
              className="group-hover:translate-x-1 transition-transform"
            />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
