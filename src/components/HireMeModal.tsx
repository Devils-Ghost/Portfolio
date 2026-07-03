"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Send, Mail } from "lucide-react";

type Props = {
  isOpen: boolean;
  setIsOpen: (val: boolean) => void;
};

const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  // Here you can handle the form submission, e.g., send data to an API or email service
  alert(
    "Form submitted! (This is a placeholder action for future API integration.)",
  );
};

export default function HireMeModal({ isOpen, setIsOpen }: Props) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Blurred Background Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-lg p-6 bg-black border border-white/10 rounded-2xl shadow-2xl flex flex-col gap-4"
          >
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-xl font-bold text-white tracking-tight">
                Let's Connect
              </h3>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
              <input
                type="text"
                placeholder="Name"
                required
                className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-blue-500 text-white text-sm"
              />
              <input
                type="text"
                placeholder="Company"
                className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-blue-500 text-white text-sm"
              />
              <input
                type="text"
                placeholder="Role"
                className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-blue-500 text-white text-sm"
              />
              <input
                type="text"
                placeholder="Contact Information (Email/Phone)"
                required
                className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-blue-500 text-white text-sm"
              />
              <textarea
                placeholder="Personalized Message"
                rows={4}
                required
                className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-blue-500 text-white text-sm resize-none"
              ></textarea>

              <button
                type="submit"
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2 mt-2"
              >
                <Send size={16} /> Send Message
              </button>
            </form>

            <div className="flex items-center gap-3 my-2">
              <div className="flex-1 h-px bg-white/10"></div>
              <span className="text-xs text-gray-500 font-medium tracking-widest">
                OR
              </span>
              <div className="flex-1 h-px bg-white/10"></div>
            </div>

            <a
              href="mailto:dtanna2@asu.edu"
              className="w-full py-2.5 bg-white/5 border border-white/10 hover:bg-white/10 text-gray-300 hover:text-white rounded-lg transition-colors flex items-center justify-center gap-2 text-sm"
            >
              <Mail size={16} /> Send customized email instead
            </a>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
