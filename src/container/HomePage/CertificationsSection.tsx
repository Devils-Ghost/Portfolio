"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import {
  Award,
  Zap,
  ShieldCheck,
  ChevronRight,
  Mail,
  MapPin,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";

export default function CertificationsSection() {
  const containerRef = useRef<HTMLElement>(null);

  // Track the scroll progress of this specific section
  // "start 90%" means animation starts when the top of the section is 10% up from the bottom of the screen
  // "end 70%" means it finishes when the bottom of the section reaches 30% up from the bottom
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 70%", "end 70%"],
  });

  // ================= SCROLL MATH =================
  // Left Card (Certifications) - Animates during the first 50% of the scroll window
  const card1Opacity = useTransform(scrollYProgress, [0, 0.5], [0, 1]);
  const card1Y = useTransform(scrollYProgress, [0, 0.5], [60, 0]);

  // Right Card (Beyond Code) - Starts slightly later for a staggered feel
  const card2Opacity = useTransform(scrollYProgress, [0.2, 0.7], [0, 1]);
  const card2Y = useTransform(scrollYProgress, [0.2, 0.7], [80, 0]);

  const certifications = [
    {
      name: "Introduction to Networks",
      issuer: "Cisco (CCNA)",
    },
    {
      name: "Ethical Hacking from Scratch",
      issuer: "zSecurity",
    },
    {
      name: "Enterprise Software Architecture",
      issuer: "Internal Certification",
    },
  ];

  const softSkills = [
    "Direct, action-oriented technical communication",
    "Team mentorship and knowledge sharing",
    "Cross-functional collaboration across departments",
    "Crisis management and debugging under pressure",
  ];

  return (
    <section
      ref={containerRef}
      className="w-full max-w-6xl mx-auto px-6 py-16 mb-10"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* ================= CERTIFICATIONS MODULE ================= */}
        <motion.div
          style={{ opacity: card1Opacity, y: card1Y }}
          className="relative bg-gradient-to-b from-[#0a0f18] to-[#05080c] border border-white/5 rounded-3xl p-8 md:p-10 shadow-2xl overflow-hidden group"
        >
          {/* Subtle top accent line */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600/0 via-blue-500/50 to-blue-600/0 opacity-50 group-hover:opacity-100 transition-opacity duration-500" />

          <div className="flex items-center gap-3 mb-8 text-white relative z-10">
            <div className="p-2 bg-blue-500/10 rounded-lg border border-blue-500/20 text-blue-400">
              <Award size={22} />
            </div>
            <h3 className="text-2xl font-bold tracking-tight">
              Certifications
            </h3>
          </div>

          <div className="flex flex-col gap-4 relative z-10">
            {certifications.map((cert, index) => (
              <div
                key={index}
                className="flex items-start gap-4 p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] hover:border-blue-500/30 transition-all duration-300"
              >
                <div className="mt-1 text-gray-500">
                  <ShieldCheck size={18} />
                </div>
                <div className="flex flex-col">
                  <span className="text-gray-200 font-semibold text-base mb-0.5">
                    {cert.name}
                  </span>
                  <span className="text-blue-400/80 font-mono text-xs uppercase tracking-wider">
                    {cert.issuer}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* ================= BEYOND THE CODE MODULE ================= */}
        <motion.div
          style={{ opacity: card2Opacity, y: card2Y }}
          className="relative bg-gradient-to-b from-[#0a0f18] to-[#05080c] border border-white/5 rounded-3xl p-8 md:p-10 shadow-2xl overflow-hidden group"
        >
          {/* Subtle top accent line */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-600/0 via-indigo-500/50 to-purple-600/0 opacity-50 group-hover:opacity-100 transition-opacity duration-500" />

          <div className="flex items-center gap-3 mb-8 text-white relative z-10">
            <div className="p-2 bg-indigo-500/10 rounded-lg border border-indigo-500/20 text-indigo-400">
              <Zap size={22} />
            </div>
            <h3 className="text-2xl font-bold tracking-tight">
              Beyond the Code
            </h3>
          </div>

          <div className="flex flex-col gap-5 relative z-10">
            {softSkills.map((skill, index) => (
              <div key={index} className="flex items-start gap-3 group/item">
                <div className="mt-0.5 text-indigo-500/50 group-hover/item:text-indigo-400 transition-colors">
                  <ChevronRight size={18} />
                </div>
                <p className="text-gray-400 group-hover/item:text-gray-300 transition-colors leading-relaxed text-sm md:text-base">
                  {skill}
                </p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
