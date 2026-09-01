import type { ComponentType } from "react";
import type { Content, DetailTarget } from "@/content/types";
import ProjectModalBody from "./ProjectModalBody";
import ExperienceModalBody from "./ExperienceModalBody";
import LinkedItemsBody from "./LinkedItemsBody";
import ContactFormBody from "./ContactFormBody";

export interface ModalBodyProps {
  /** Absent for `contact`, which has no id to resolve. */
  id?: string;
  content: Content;
}

interface RegistryEntry {
  Body: ComponentType<ModalBodyProps>;
  label: (id: string | undefined, content: Content) => string;
}

/**
 * `DetailModalHost`'s body lookup (PROJECT_PLAN.md §3.5, which names this
 * file's `skill`/`softskill` body `EvidenceBody` — renamed to
 * `LinkedItemsBody` in Phase 2, see plan-progress.md). Only the kinds Phase 2
 * actually wires up have entries — `engagement`, `story`, `award` and
 * `softskill` join here as their own detail modals ship in later phases;
 * nothing in the app dispatches those kinds yet, and `LinkedItemsBody`
 * degrades their usage rows to plain (non-clickable) entries in the
 * meantime rather than opening a modal that doesn't exist.
 *
 * Every kind shares one modal width (`ModalRenderer` sets it) rather than
 * each entry choosing its own, per §4.6's original per-kind table — add a
 * `width` field back here if a kind genuinely needs to differ.
 */
export const MODAL_REGISTRY: Partial<
  Record<DetailTarget["kind"], RegistryEntry>
> = {
  project: {
    Body: ProjectModalBody,
    label: (id, content) =>
      content.projects.find((p) => p.id === id)?.title ?? "Project",
  },
  experience: {
    Body: ExperienceModalBody,
    label: (id, content) => {
      const exp = content.experiences.find((e) => e.id === id);
      return exp ? `${exp.role} at ${exp.org}` : "Experience";
    },
  },
  skill: {
    Body: LinkedItemsBody,
    label: (id, content) =>
      content.skills.find((s) => s.id === id)?.name ?? "Skill",
  },
  contact: {
    Body: ContactFormBody,
    label: () => "Get in touch",
  },
};
