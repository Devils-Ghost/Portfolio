"use client";

import { useDetailModal } from "./DetailModalHost";
import {
  formatDateMark,
  formatDateRange,
  usagesOfSkill,
} from "@/content/selectors";
import type { SkillUsage } from "@/content/selectors";
import type { ModalBodyProps } from "./registry";

const GROUP_ORDER: SkillUsage["kind"][] = [
  "experience",
  "project",
  "engagement",
  "story",
];

const GROUP_LABELS: Record<SkillUsage["kind"], string> = {
  project: "Projects",
  experience: "Experience",
  engagement: "Engagements",
  story: "Success Stories",
};

function usageTitle(usage: SkillUsage): string {
  switch (usage.kind) {
    case "project":
      return usage.item.title;
    case "experience":
      return `${usage.item.role} — ${usage.item.org}`;
    case "engagement":
      return usage.item.title;
    case "story":
      return usage.item.title;
  }
}

function usageDateLabel(usage: SkillUsage): string {
  return usage.kind === "story"
    ? formatDateMark(usage.item.date)
    : formatDateRange(usage.item.date);
}

/**
 * `LinkedItemsBody` — site-behavior.md §4.6 (named `EvidenceBody` there;
 * renamed in Phase 2, see plan-progress.md). "This skill was used in:",
 * grouped by kind (PROJECT_PLAN.md §3.4 `usagesOfSkill`). Only `project` and
 * `experience` have their own modal yet (§6 Phase 2), so engagement and
 * story rows render as plain, non-interactive entries this phase rather than
 * as dead links — they still show real content, they just don't drill down
 * until Phase 5/6 add their modals.
 *
 * Also the `softskill` body once that kind ships (§3.2b): same list-of-
 * related-items shape, driven by `evidenceFor()` instead of `usagesOfSkill()`
 * — `Skill` and `SoftSkill` are unrelated entities in the content model, so
 * the name describes the UI pattern rather than either entity.
 */
export default function LinkedItemsBody({ id, content }: ModalBodyProps) {
  const { open } = useDetailModal();
  const skill = content.skills.find((s) => s.id === id);
  if (!skill) return null;

  const usages = usagesOfSkill(skill.id, content);
  const groups: Record<SkillUsage["kind"], SkillUsage[]> = {
    project: [],
    experience: [],
    engagement: [],
    story: [],
  };
  for (const usage of usages) groups[usage.kind].push(usage);

  const rowClasses =
    "flex items-center justify-between gap-4 px-3 py-2.5 rounded-lg text-sm";

  return (
    <div>
      <h3 className="text-2xl font-bold text-white mb-2">{skill.name}</h3>
      {skill.blurb && (
        <p className="text-gray-400 text-sm mb-6 leading-relaxed">
          {skill.blurb}
        </p>
      )}

      <p className="text-xs uppercase tracking-widest text-gray-500 font-mono mb-4">
        This skill was used in:
      </p>

      {usages.length === 0 && (
        <p className="text-gray-500 text-sm">
          This skill is used somwhere that is not publicly published yet.
        </p>
      )}

      <div className="flex flex-col gap-6">
        {GROUP_ORDER.map((kind) => {
          const items = groups[kind];
          if (!items.length) return null;

          return (
            <div key={kind}>
              <h4 className="text-xs uppercase tracking-widest text-blue-400 font-mono mb-2">
                {GROUP_LABELS[kind]}
              </h4>
              <div className="flex flex-col gap-1">
                {items.map((usage) => {
                  const title = usageTitle(usage);
                  const date = usageDateLabel(usage);

                  if (kind === "project") {
                    return (
                      <button
                        key={usage.item.id}
                        type="button"
                        onClick={() =>
                          open({ kind: "project", id: usage.item.id })
                        }
                        className={`${rowClasses} bg-white/5 hover:bg-white/10 border border-white/10 hover:border-blue-500/30 text-left text-gray-200 transition-colors`}
                      >
                        <span>{title}</span>
                        <span className="text-gray-500 font-mono text-xs shrink-0">
                          {date}
                        </span>
                      </button>
                    );
                  }

                  if (kind === "experience") {
                    return (
                      <button
                        key={usage.item.id}
                        type="button"
                        onClick={() =>
                          open({ kind: "experience", id: usage.item.id })
                        }
                        className={`${rowClasses} bg-white/5 hover:bg-white/10 border border-white/10 hover:border-blue-500/30 text-left text-gray-200 transition-colors`}
                      >
                        <span>{title}</span>
                        <span className="text-gray-500 font-mono text-xs shrink-0">
                          {date}
                        </span>
                      </button>
                    );
                  }

                  return (
                    <div
                      key={usage.item.id}
                      className={`${rowClasses} text-gray-400`}
                    >
                      <span>{title}</span>
                      <span className="text-gray-500 font-mono text-xs shrink-0">
                        {date}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
