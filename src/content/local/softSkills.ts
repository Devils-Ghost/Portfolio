import type { SoftSkill } from "../types";

/**
 * "Beyond the Code". Every claim here is backed by a story, a role, or an
 * engagement — the modal shows the evidence. If you can't name evidence for
 * one, it doesn't belong on the page.
 */
export const softSkills: SoftSkill[] = [
  {
    id: "soft_root_cause",
    slug: "root-cause-over-symptom",
    label: "Refuses to stop at the reported layer",
    description:
      "The bugs I'm proudest of weren't where anyone was looking. A habit of asking whether this is the actual layer of a problem or just the visible one.",
    evidenceStoryIds: [
      "story_phantom_timestamp",
      "story_pipeline_not_app",
      "story_entrypoint_filter",
    ],
    evidenceExperienceIds: ["exp_ubs_swe"],
    iconName: "search",
    featured: true,
    order: 1,
  },
  {
    id: "soft_pressure",
    slug: "judgment-under-pressure",
    label: "Judgment under pressure, not just speed",
    description:
      "The hardest part of an incident isn't working fast. It's declining the expedient fix when everything about the moment argues for taking it.",
    evidenceStoryIds: ["story_cipher_suite", "story_sandbox_crashed"],
    evidenceExperienceIds: ["exp_ubs_swe"],
    iconName: "shield",
    featured: true,
    order: 2,
  },
  {
    id: "soft_influence",
    slug: "influence-without-authority",
    label: "Brings data and a plan, not an objection",
    description:
      "Opinions lose to status reports. Changing a decision you have no authority over means arriving with evidence and the next step already worked out.",
    evidenceStoryIds: ["story_halted_the_vendor"],
    evidenceExperienceIds: ["exp_ubs_swe"],
    evidenceEngagementIds: ["eng_ubs_cultural"],
    iconName: "compass",
    featured: true,
    order: 3,
  },
  {
    id: "soft_teaching",
    slug: "teaching-and-knowledge-transfer",
    label: "Builds understanding, not dependence",
    description:
      "Showing someone a working solution resolves the moment and teaches nothing. The slower version is the only one where anything transfers.",
    evidenceStoryIds: ["story_stepping_stones", "story_handover"],
    evidenceExperienceIds: ["exp_asu_ta", "exp_cisco_academy", "exp_instructional_assistant"],
    iconName: "graduation",
    featured: true,
    order: 4,
  },
  {
    id: "soft_scope",
    slug: "takes-on-what-nobody-owns",
    label: "Picks up what's broken and unowned",
    description:
      "Systems fail quietly in the gaps between teams, and stay failed, because every individual is behaving rationally. I have a low tolerance for that — and I've had to learn to surface it to the owner before acting on it.",
    evidenceStoryIds: ["story_account_service", "story_pipeline_not_app", "story_handover"],
    evidenceExperienceIds: ["exp_ubs_swe"],
    iconName: "wrench",
    featured: true,
    order: 5,
  },
  {
    id: "soft_owns_mistakes",
    slug: "owns-the-failures",
    label: "Names the cost of a decision, including their own",
    description:
      "A security control that costs nothing wasn't a decision. Neither was a project that only ever went well.",
    evidenceStoryIds: [
      "story_reverse_routing",
      "story_one_week_became_four",
      "story_sandbox_crashed",
      "story_vault_no_blueprint",
    ],
    iconName: "star",
    featured: false,
    order: 6,
  },
  {
    id: "soft_cross_team",
    slug: "cross-functional-collaboration",
    label: "Builds the relationships before needing them",
    description:
      "Enterprise releases are coupled to teams you've never met. The difference between an email into the void and a message to someone you know is measured in days.",
    evidenceEngagementIds: ["eng_ubs_cultural", "eng_ai_elections"],
    evidenceExperienceIds: ["exp_ubs_swe"],
    iconName: "handshake",
    featured: false,
    order: 7,
  },
];
