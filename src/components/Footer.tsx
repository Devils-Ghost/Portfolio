"use client";

import Link from "next/link";
import { MapPin, ChevronRight, Terminal } from "lucide-react";
import { SOCIAL_LINKS } from "@/components/icons/SocialIcons";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const socialLinks = SOCIAL_LINKS;

  const quickLinks = [
    { name: "About", href: "/about" },
    { name: "Experience", href: "/experience" },
    { name: "Projects", href: "/projects" },
    { name: "Blog", href: "/blog" },
  ];

  return (
    <footer className="w-full relative bg-[#05080c] border-t border-white/10 overflow-hidden pt-20 pb-8 mt-20">
      {/* Restored Glowing Background Elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-1 bg-gradient-to-r from-transparent via-blue-500/50 to-transparent" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-blue-500/5 blur-[120px] rounded-full pointer-events-none -translate-y-1/2" />

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-8 mb-16">
          {/* ================= BRAND & SOCIALS ================= */}
          <div className="md:col-span-5 flex flex-col items-start">
            <Link href="/" className="inline-block mb-6">
              <span className="text-2xl font-bold tracking-wider text-white">
                Dhaval Tanna<span className="text-blue-500">.</span>
              </span>
            </Link>

            <p className="text-gray-400 leading-relaxed mb-6 max-w-sm">
              Bridging the gap between robust software engineering and proactive
              offensive security.
            </p>

            <div className="flex items-center gap-2 text-sm text-gray-500 font-mono mb-8 px-4 py-2 bg-white/5 border border-white/10 rounded-lg">
              <MapPin size={14} className="text-blue-500" />
              <span>Operating from Tempe, Arizona</span>
            </div>

            <div className="flex items-center gap-4">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <Link
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 flex items-center justify-center rounded-full bg-white/5 border border-white/10 text-gray-400 hover:text-blue-400 hover:bg-blue-500/10 hover:border-blue-500/30 transition-all duration-300 hover:-translate-y-1"
                    aria-label={social.label}
                  >
                    <Icon className="w-[18px] h-[18px]" />
                  </Link>
                );
              })}
            </div>
          </div>

          {/* ================= NAVIGATION ================= */}
          <div className="md:col-span-3 md:col-start-7 flex flex-col">
            <h4 className="text-white font-semibold mb-6 tracking-wide">
              Navigation
            </h4>
            <div className="flex flex-col gap-3">
              {quickLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="text-gray-400 hover:text-blue-400 transition-colors flex items-center gap-1 group text-sm md:text-base w-fit"
                >
                  <ChevronRight
                    size={14}
                    className="opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all duration-300"
                  />
                  {link.name}
                </Link>
              ))}
            </div>
          </div>

          {/* ================= CURRENT FOCUS ================= */}
          <div className="md:col-span-3 flex flex-col">
            <h4 className="text-white font-semibold mb-6 tracking-wide">
              Current Focus
            </h4>
            <div className="flex flex-col gap-4">
              <div className="flex items-start gap-3 p-4 rounded-xl bg-white/5 border border-white/10">
                <Terminal size={18} className="text-blue-500 shrink-0 mt-0.5" />
                <div className="flex flex-col">
                  <span className="text-gray-300 text-sm font-medium mb-1">
                    Agentic Coding & LLMs
                  </span>
                  <span className="text-gray-500 text-xs leading-relaxed">
                    Researching use of LLMs for autonomous decompilation and
                    vulnerability discovery.
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ================= COPYRIGHT & TECH STACK ================= */}
        <div className="w-full pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-xs md:text-sm text-gray-500 font-mono">
          <p>© {currentYear} Dhaval Tanna. All rights reserved.</p>
          <p className="flex items-center gap-1.5">
            Built with Next.js, Springboot and Firebase
          </p>
        </div>
      </div>
    </footer>
  );
}
