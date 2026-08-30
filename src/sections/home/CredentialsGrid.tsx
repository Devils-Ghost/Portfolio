"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { fadeUp } from "@/components/motion/variants";
import { Award, Zap, ShieldCheck, ChevronRight, Medal } from "lucide-react";
import ModulePanel from "@/components/ui/ModulePanel";
import ContentIcon from "@/components/ui/ContentIcon";
import { formatDateMark } from "@/content/selectors";
import type {
  Award as AwardEntity,
  Certification,
  SoftSkill,
} from "@/content/types";

/**
 * "Credentials & Caliber" — the three sibling modules: Certifications and
 * Beyond the Code side by side, Achievements & Awards centred beneath them.
 *
 * The heading lives here rather than in the server parent so it stays inside
 * the same `<section>` as the grid, matching every other section on the page
 * (one `<section>`, heading first) — this section just happens to need the
 * client boundary one element earlier than most, for the panels' `useScroll`.
 *
 * One grid rather than two sections, so all three sit at the same `gap-8`
 * spacing and the arrangement actually reads as a group. Each panel is the
 * same `ModulePanel`, differing only in accent and contents — which is what
 * keeps them looking like siblings as they're edited.
 *
 * Client, because all three cards are staggered off a single `useScroll`
 * taken on this section's own element; giving each its own `whileInView`
 * would lose the stagger. Content arrives as props from the Server Component
 * in CertificationsSection.
 */
export default function CredentialsGrid({
  certifications,
  softSkills,
  awards,
}: {
  certifications: Certification[];
  softSkills: SoftSkill[];
  awards: AwardEntity[];
}) {
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
  const card1Opacity = useTransform(scrollYProgress, [0, 0.3], [0, 1]);
  const card1Y = useTransform(scrollYProgress, [0, 0.5], [60, 0]);

  // Right Card (Beyond Code) - Starts slightly later for a staggered feel
  const card2Opacity = useTransform(scrollYProgress, [0.1, 0.4], [0, 1]);
  const card2Y = useTransform(scrollYProgress, [0.2, 0.7], [80, 0]);

  // Bottom Card (Awards) - last point of the triangle, so it lands last
  const card3Opacity = useTransform(scrollYProgress, [0.4, 0.8], [0, 1]);
  const card3Y = useTransform(scrollYProgress, [0.4, 0.8], [80, 0]);

  return (
    <section ref={containerRef} className="w-full max-w-6xl mx-auto px-6 py-16">
      <motion.h2 {...fadeUp} className="text-3xl md:text-4xl font-bold mb-10">
        Credentials &amp; Caliber
      </motion.h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* ================= CERTIFICATIONS MODULE ================= */}
        <motion.div style={{ opacity: card1Opacity, y: card1Y }}>
          <ModulePanel
            accent="blue"
            icon={<Award size={22} />}
            title="Certifications"
            className="h-full"
          >
            <div className="flex flex-col gap-4">
              {certifications.map((cert) => (
                <div
                  key={cert.id}
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
          </ModulePanel>
        </motion.div>

        {/* ================= BEYOND THE CODE MODULE ================= */}
        <motion.div style={{ opacity: card2Opacity, y: card2Y }}>
          <ModulePanel
            accent="indigo"
            icon={<Zap size={22} />}
            title="Beyond the Code"
            className="h-full"
          >
            <div className="flex flex-col gap-5">
              {softSkills.map((skill) => (
                <div
                  key={skill.id}
                  className="flex items-start gap-3 group/item"
                >
                  <div className="mt-0.5 text-indigo-500/50 group-hover/item:text-indigo-400 transition-colors">
                    <ChevronRight size={18} />
                  </div>
                  <p className="text-gray-400 group-hover/item:text-gray-300 transition-colors leading-relaxed text-sm md:text-base">
                    {skill.label}
                  </p>
                </div>
              ))}
            </div>
          </ModulePanel>
        </motion.div>

        {/* ================= ACHIEVEMENTS & AWARDS MODULE =================
            Spans both columns but is held to one column's width and centred,
            so the three panels form a triangle rather than a stack.

            No "View all" link, deliberately: its two siblings have none, and
            /experience — where the full list lives, grouped by life phase
            (§10 Q2) — is still a placeholder page. Add one to all three when
            the pages they'd point at exist. */}
        {awards.length > 0 && (
          <motion.div
            style={{ opacity: card3Opacity, y: card3Y }}
            className="md:col-span-2 md:w-[calc(50%-1rem)] md:mx-auto"
          >
            <ModulePanel
              accent="purple"
              icon={<Medal size={22} />}
              title="Achievements & Awards"
            >
              <div className="flex flex-col gap-4">
                {awards.map((award) => (
                  <div
                    key={award.id}
                    className="flex items-start gap-4 p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] hover:border-purple-500/30 transition-all duration-300"
                  >
                    <div className="mt-1 text-gray-500">
                      <ContentIcon name={award.iconName} size={18} />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-gray-200 font-semibold text-base mb-0.5">
                        {award.title}
                      </span>
                      <span className="text-purple-400/80 font-mono text-xs uppercase tracking-wider">
                        {award.issuer} · {formatDateMark(award.date)}
                        {award.rank ? ` · ${award.rank}` : ""}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </ModulePanel>
          </motion.div>
        )}
      </div>
    </section>
  );
}
