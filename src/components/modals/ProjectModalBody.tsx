"use client";

import HighlightList from "@/components/ui/HighlightList";
import ResourceLinks from "@/components/ui/ResourceLinks";
import { useDetailModal } from "./DetailModalHost";
import { resolveSkills } from "@/content/selectors";
import type { ModalBodyProps } from "./registry";

/**
 * `ProjectModalBody` — site-behavior.md §4.6. Long description, resolved
 * skill chips and typed link buttons, relocated verbatim from the modal that
 * used to live inside `ProjectCard` itself (PROJECT_PLAN.md §1.3 ⑤). The
 * chips are buttons now instead of static spans: clicking one opens that
 * skill's own evidence modal.
 */
export default function ProjectModalBody({ id, content }: ModalBodyProps) {
  const { open } = useDetailModal();
  const project = content.projects.find((p) => p.id === id);
  if (!project) return null;

  const skills = resolveSkills(project.skillIds, content.skills);

  return (
    <div>
      <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
        {project.title}
      </h3>

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

      <p className="text-gray-300 leading-relaxed mb-6">{project.body}</p>

      <div className="mb-10">
        <HighlightList items={project.highlights ?? []} />
      </div>

      <ResourceLinks links={project.links} />
    </div>
  );
}
