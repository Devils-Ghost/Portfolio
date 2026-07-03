"use client";

import { motion } from "framer-motion";

export default function CertificationsSection() {
  return (
    <section className="w-full max-w-6xl mx-auto px-6 py-20 mb-32">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gradient-to-br from-blue-900/20 to-black border border-white/10 p-8 rounded-3xl"
      >
        <div>
          <h3 className="text-2xl font-bold mb-4">Certifications Target</h3>
          <div className="flex flex-wrap gap-2">
            <span className="px-3 py-1 bg-white/10 rounded text-sm text-gray-300">
              CompTIA Security+
            </span>
            <span className="px-3 py-1 bg-white/10 rounded text-sm text-gray-300">
              CySA+
            </span>
            <span className="px-3 py-1 bg-white/10 rounded text-sm text-gray-300">
              Network+
            </span>
          </div>
        </div>
        <div>
          <h3 className="text-2xl font-bold mb-4">Soft Skills</h3>
          <p className="text-gray-400 leading-relaxed">
            Direct, action-oriented technical communication, team mentorship,
            cross-functional collaboration, and crisis management under
            pressure.
          </p>
        </div>
      </motion.div>
    </section>
  );
}
