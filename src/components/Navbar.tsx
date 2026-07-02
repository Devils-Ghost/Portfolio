"use client";
import Link from "next/link";
import { motion } from "framer-motion";

export default function Navbar() {
  return (
    <motion.nav 
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-3xl rounded-full border border-white/10 bg-black/50 backdrop-blur-md px-6 py-4 flex justify-between items-center shadow-lg"
    >
      <Link href="/" className="text-white font-bold tracking-wider">
        Dhaval Tanna<span className="text-blue-500">.</span>
      </Link>
      
      <div className="flex gap-6 text-sm text-gray-300">
        <Link href="/about" className="hover:text-white transition-colors">About</Link>
        <Link href="/experience" className="hover:text-white transition-colors">Experience</Link>
        <Link href="/projects" className="hover:text-white transition-colors">Projects</Link>
        <Link href="/blog" className="hover:text-white transition-colors">Blog</Link>
      </div>
    </motion.nav>
  );
}