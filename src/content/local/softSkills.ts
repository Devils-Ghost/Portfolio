import type { SoftSkill } from "../types";

/**
 * "Beyond the Code" — who Dhaval is to work with, not a summary of what
 * he did. The `evidence*Ids` below already carry the proof and power the
 * modal; the description does NOT re-prove anything. Keep it a pitch, not
 * a trailer for a story.
 *
 * Specifics are allowed only when they stand alone without context
 * ("60% to 80%" is fine, "six unrelated teams" is not).
 */
export const softSkills: SoftSkill[] = [
  {
    id: "soft_leadership",
    slug: "leadership",
    label: "Leadership",
    description:
      "I stepped in to take over an at-risk cloud migration mid-flight, driving it forward without formal authority by anchoring the team to a well-defined, data-backed execution plan. Beyond technical delivery, I co-ran my department's cultural committee, managing budgets, organizing events, and cultivating an environment where people actively wanted to work.",
    evidenceStoryIds: ["story_halted_the_vendor"],
    evidenceExperienceIds: ["exp_ubs_swe"],
    evidenceEngagementIds: ["eng_ubs_cultural"],
    iconName: "flag",
    featured: true,
    order: 1,
  },
  {
    id: "soft_mentorship",
    slug: "mentorship-and-knowledge-sharing",
    label: "Mentorship & Knowledge Sharing",
    description:
      "I'm committed to sharing what I know and elevating others alongside me. That has meant lifting a class average from 60% to 80% as a teaching assistant, and writing the documentation for an unconventional application so whoever inherited it had an easier time than I did.",
    evidenceStoryIds: ["story_stepping_stones", "story_handover"],
    evidenceExperienceIds: [
      "exp_asu_ta",
      "exp_cisco_academy",
      "exp_instructional_assistant",
    ],
    iconName: "graduation",
    featured: true,
    order: 2,
  },
  {
    id: "soft_collaboration",
    slug: "cross-functional-collaboration",
    label: "Cross-Functional Collaboration",
    description:
      "Enterprise products aren't built by one team. They're built by many, across departments that share neither a manager nor a deadline, and most of the work is bridging technical and non-technical groups to align on a shared outcome. Cultivating that alignment happens both inside and outside the standup, whether it is steering multi-team technical initiatives or organizing office events, building cross-organizational trust is how complex work actually gets done.",
    evidenceStoryIds: ["story_halted_the_vendor"],
    evidenceExperienceIds: ["exp_ubs_swe"],
    evidenceEngagementIds: ["eng_ubs_cultural", "eng_ai_elections"],
    iconName: "handshake",
    featured: true,
    order: 3,
  },
  {
    id: "soft_crisis",
    slug: "crisis-management-under-pressure",
    label: "Crisis Management & Debugging Under Pressure",
    description:
      "What started as a necessity for responding to critical production incidents has become my default approach to any high-pressure situation, a live exam breaking mid-session, or something with nothing to do with work at all. Different stakes, same approach: stay calm, analyze the situation, and solve the problem systematically, one step at a time.",
    evidenceStoryIds: ["story_cipher_suite", "story_sandbox_crashed"],
    evidenceExperienceIds: ["exp_ubs_swe", "exp_asu_ta"],
    iconName: "shield",
    featured: true,
    order: 4,
  },
  {
    id: "soft_communication",
    slug: "direct-action-oriented-communication",
    label: "Direct, Action-Oriented Communication",
    description:
      "I communicate to remove ambiguity rather than paper over it. That means being direct about where something actually stands, bringing data instead of opinion, and making sure everyone leaves the conversation knowing what happens next.",
    evidenceStoryIds: ["story_halted_the_vendor"],
    evidenceExperienceIds: ["exp_ubs_swe"],
    iconName: "compass",
    featured: true,
    order: 5,
  },
  {
    id: "soft_ownership",
    slug: "ownership-and-accountability",
    label: "Ownership & Accountability",
    description:
      "I take end-to-end responsibility for the work I pick, from the first commit through production and whatever comes after it ships. If I take something on, I see it through to completion.",
    evidenceStoryIds: [
      "story_account_service",
      "story_pipeline_not_app",
      "story_handover",
      "story_reverse_routing",
      "story_one_week_became_four",
      "story_sandbox_crashed",
      "story_vault_no_blueprint",
    ],
    evidenceExperienceIds: ["exp_ubs_swe"],
    iconName: "wrench",
    featured: true,
    order: 6,
  },
  {
    id: "soft_adaptability",
    slug: "adaptability",
    label: "Adaptability",
    description:
      "I pivot across technology stacks, development phases and shifting requirements without needing a runway, and without trading away performance or security to do it. The domain changes; the way I approach it doesn't.",
    evidenceStoryIds: ["story_vault_no_blueprint"],
    evidenceExperienceIds: ["exp_ubs_swe", "exp_asu_ta", "exp_llm_re_research"],
    iconName: "zap",
    featured: true,
    order: 7,
  },
];
