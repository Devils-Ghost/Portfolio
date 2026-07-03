"use client";

import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Menu, X, MessageSquare } from "lucide-react";
import HireMeModal from "./HireMeModal"; // Ensure this is imported

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const navLinks = [
    { name: "About", href: "/about" },
    { name: "Experience", href: "/experience" },
    { name: "Projects", href: "/projects" },
    { name: "Blog", href: "/blog" },
  ];

  return (
    <>
      <motion.nav
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2.5 }} // Matches the duration of the logo flight
        className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-5xl border border-white/10 bg-black/50 backdrop-blur-md shadow-lg transition-all duration-300 ${
          isOpen ? "rounded-2xl" : "rounded-[32px] md:rounded-full"
        } px-6 py-4 flex flex-col md:flex-row md:justify-between md:items-center`}
      >
        <div className="flex justify-between items-center w-full">
          <Link href="/" className="flex items-center">
            <motion.div
              layoutId="brand-name"
              className="text-white font-bold tracking-wider text-xl whitespace-nowrap"
            >
              Dhaval Tanna<span className="text-blue-500">.</span>
            </motion.div>
          </Link>

          {/* Mobile Hamburger Toggle */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-gray-300 hover:text-white focus:outline-none"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          {/* Desktop Links & Desktop Hire Me Button (Hidden on Mobile) */}
          <div className="hidden md:flex items-center gap-6">
            <div className="flex gap-6 text-sm text-gray-300 mr-2">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="hover:text-white transition-colors"
                >
                  {link.name}
                </Link>
              ))}
            </div>

            {/* Desktop CTA */}
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-5 py-2 bg-white text-black text-sm font-semibold rounded-full hover:bg-gray-200 transition-colors"
            >
              Hire Me
            </button>
          </div>
        </div>

        {/* Mobile Links Dropdown (Hidden on Desktop) */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="flex flex-col gap-4 mt-4 md:hidden overflow-hidden"
            >
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsOpen(false)} // Close menu when a link is clicked
                  className="text-sm text-gray-300 hover:text-white transition-colors block pb-2 border-b border-white/5 last:border-0"
                >
                  {link.name}
                </Link>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* Mobile Floating Hire Me Button (Hidden on Desktop) */}
      <button
        onClick={() => setIsModalOpen(true)}
        className="md:hidden fixed bottom-6 right-6 z-50 flex items-center gap-2 px-5 py-3 bg-white text-black rounded-full font-semibold shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:bg-gray-200 transition-colors"
      >
        <MessageSquare size={20} />
        Hire Me
      </button>

      {/* Shared Modal Overlay */}
      <HireMeModal isOpen={isModalOpen} setIsOpen={setIsModalOpen} />
    </>
  );
}
