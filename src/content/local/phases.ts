import type { LifePhase } from "../types";

/**
 * The chapters. Drives grouping on the /experience timeline and,
 * in Phase 6, the doors along the 3D corridor.
 */
export const phases: LifePhase[] = [
  {
    id: "phase_undergrad",
    slug: "bachelors",
    label: "Bachelor's",
    subtitle: "Computer Engineering · Savitribai Phule Pune University",
    date: { start: { year: 2017, month: 8 }, end: { year: 2021, month: 5 } },
    order: 1,
    accent: "#38bdf8",
  },
  {
    id: "phase_ubs",
    slug: "ubs",
    label: "UBS",
    subtitle: "Software Engineer · Pune, India",
    date: { start: { year: 2020, month: 7 }, end: { year: 2024, month: 6 } },
    order: 2,
    accent: "#e11d48",
  },
  {
    id: "phase_masters",
    slug: "masters",
    label: "Master's",
    subtitle: "Computer Engineering · Arizona State University",
    date: { start: { year: 2024, month: 8 }, end: { year: 2026, month: 5 } },
    order: 3,
    accent: "#8b0000",
  },
  {
    id: "phase_post_masters",
    slug: "post-masters",
    label: "Post-Master's",
    subtitle: "Research, independent projects, and ongoing",
    date: { start: { year: 2026, month: 5 }, end: null },
    order: 4,
    accent: "#22d3ee",
  },
];
