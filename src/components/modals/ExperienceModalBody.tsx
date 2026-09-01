"use client";

import HighlightList from "@/components/ui/HighlightList";
import ResourceLinks from "@/components/ui/ResourceLinks";
import { useDetailModal } from "./DetailModalHost";
import {
  EXPERIENCE_TYPE_LABELS,
  formatDateRange,
  resolveSkills,
} from "@/content/selectors";
import type { ModalBodyProps } from "./registry";

/**
 * `ExperienceModalBody` — site-behavior.md §4.6. Relocated from the modal
 * that used to live inside `ExperienceCard` (PROJECT_PLAN.md §1.3 ⑤), with
 * two additions the card's modal never had: `links` (the field existed, the
 * UI never rendered it) and `achievements` — retained since Phase 1 "for a
 * distinct UI treatment" and never wired up until now.
 */
export default function ExperienceModalBody({ id, content }: ModalBodyProps) {
  const { open } = useDetailModal();
  const exp = content.experiences.find((e) => e.id === id);
  if (!exp) return null;

  const skills = resolveSkills(exp.skillIds, content.skills);
  const typeLabel = EXPERIENCE_TYPE_LABELS[exp.type];
  const dateLabel = formatDateRange(exp.date);

  return (
    <div>
      <div className="w-12 h-1 bg-blue-500 rounded-full mb-6" />

      <div className="mb-6 flex flex-col md:flex-row md:justify-between md:items-start gap-4">
        <div>
          <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">
            {exp.role}
          </h3>
          <div className="flex items-center gap-3 text-sm">
            <span className="text-blue-400 font-medium text-lg">{exp.org}</span>
            <span className="text-gray-500 font-mono">• {dateLabel}</span>
          </div>
        </div>
        <span className="text-gray-400 bg-white/5 px-3 py-1 rounded text-xs border border-white/10 uppercase tracking-wider">
          {typeLabel}
        </span>
      </div>

      <div className="flex flex-wrap gap-2 mb-8">
        {skills.map((skill) => (
          <button
            key={skill.id}
            type="button"
            onClick={() => open({ kind: "skill", id: skill.id })}
            className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs text-blue-300 font-mono hover:border-blue-500/40 hover:text-white transition-colors"
          >
            {skill.name}
          </button>
        ))}
      </div>

      {exp.body && (
        <p className="text-gray-300 leading-relaxed mb-6">{exp.body}</p>
      )}

      <div className="mb-8">
        <HighlightList items={exp.highlights} />
      </div>

      {exp.achievements && exp.achievements.length > 0 && (
        <div className="mb-8">
          <h4 className="text-xs uppercase tracking-widest text-blue-400 font-mono mb-3">
            Recognitions
          </h4>
          <div className="flex flex-wrap gap-2">
            {exp.achievements.map((achievement) => (
              <span
                key={achievement}
                className="px-3 py-1.5 bg-blue-500/10 border border-blue-500/20 rounded-full text-xs text-blue-300"
              >
                {achievement}
              </span>
            ))}
          </div>
        </div>
      )}

      <ResourceLinks links={exp.links} />
    </div>
  );
}
