"use client";

import Link from "next/link";
import { MapPin, ChevronRight, Terminal } from "lucide-react";

// ================= OFFICIAL BRAND SVGS =================
const GithubIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
  </svg>
);

const LinkedinIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
  </svg>
);

const GmailIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 0 1 0 19.366V5.457c0-2.023 2.309-3.178 3.927-1.964L5.455 4.64 12 9.548l6.545-4.91 1.528-1.145C21.69 2.28 24 3.434 24 5.457z" />
  </svg>
);

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    { icon: GithubIcon, href: "https://github.com", label: "GitHub" },
    { icon: LinkedinIcon, href: "https://linkedin.com", label: "LinkedIn" },
    { icon: GmailIcon, href: "mailto:your.email@example.com", label: "Email" },
  ];

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
