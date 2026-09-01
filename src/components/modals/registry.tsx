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
  /**
   * Passed straight through to `Modal`'s `className` — the width class each
   * kind gets (site-behavior.md §4.6), plus, for `contact`, the chrome
   * overrides the old standalone `HireMeModal` carried.
   */
  width: string;
  label: (id: string | undefined, content: Content) => string;
}

/**
 * `DetailModalHost`'s body-and-width lookup (PROJECT_PLAN.md §3.5, which
 * names this file's `skill`/`softskill` body `EvidenceBody` — renamed to
 * `LinkedItemsBody` in Phase 2, see plan-progress.md). Only the kinds Phase 2
 * actually wires up have entries — `engagement`, `story`, `award` and
 * `softskill` join here as their own detail modals ship in later phases;
 * nothing in the app dispatches those kinds yet, and `LinkedItemsBody`
 * degrades their usage rows to plain (non-clickable) entries in the
 * meantime rather than opening a modal that doesn't exist.
 */
export const MODAL_REGISTRY: Partial<
  Record<DetailTarget["kind"], RegistryEntry>
> = {
  project: {
    Body: ProjectModalBody,
    width: "max-w-3xl",
    label: (id, content) =>
      content.projects.find((p) => p.id === id)?.title ?? "Project",
  },
  experience: {
    Body: ExperienceModalBody,
    width: "max-w-2xl",
    label: (id, content) => {
      const exp = content.experiences.find((e) => e.id === id);
      return exp ? `${exp.role} at ${exp.org}` : "Experience";
    },
  },
  skill: {
    Body: LinkedItemsBody,
    width: "max-w-lg",
    label: (id, content) =>
      content.skills.find((s) => s.id === id)?.name ?? "Skill",
  },
  contact: {
    Body: ContactFormBody,
    width: "max-w-lg bg-black p-6",
    label: () => "Get in touch",
  },
};
