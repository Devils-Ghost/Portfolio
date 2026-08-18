import type { Engagement } from "../types";

export const engagements: Engagement[] = [
  {
    id: "eng_tracer_fire_2026",
    slug: "tracer-fire-2026",
    title: "Tracer Fire — Digital Forensics Workshop",
    org: "Sandia National Laboratories",
    type: "competition",
    date: { start: { year: 2026, month: 1 }, end: { year: 2026, month: 1 } },
    summary:
      "Tracer Fire 13. Fourth overall, second among ASU teams — and a much shorter ramp than the year before.",
    body: `Tracer Fire 13, fifteen months after my first one. We came fourth overall and second among the ASU teams.

The interesting part of doing one of these twice is what changes. The first time, most of my effort went into the tools — learning what Velociraptor collects, what Malcolm shows you that a packet capture does not, how to make Kibana answer the question I actually had. That is real work, and it is not the skill the exercise is testing.

The second time, the tooling was already there, and what was left was the actual thing: reading evidence, forming a hypothesis, and knowing when to abandon it. Almost all of the time went into analysis rather than into fighting the interface.

That gap is the clearest measure I have of what the Master's year actually did. Same exercise, same tools, entirely different bottleneck.`,
    iconName: "search",
    skillIds: [
      "skl_digital_forensics",
      "skl_forensics_tools",
      "skl_network_security",
      "skl_incident_response",
    ],
    phaseId: "phase_masters",
    featured: true,
    order: 1,
    visibility: "public",
  },
  {
    id: "eng_tracer_fire_2024",
    slug: "tracer-fire-2024",
    title: "Tracer Fire — Digital Forensics Workshop",
    org: "Sandia National Laboratories",
    type: "competition",
    date: { start: { year: 2024, month: 10 }, end: { year: 2024, month: 10 } },
    summary:
      "Tracer Fire 12. Sandia's competitive incident-response and threat-hunting exercise — fifth overall, first among ASU teams.",
    body: `Tracer Fire is Sandia National Laboratories' hands-on digital forensics and incident response workshop — a compressed, competitive scenario where teams work real artifacts under time pressure rather than answering questions about them.

The toolchain was the part I had least experience with going in: Kibana for log correlation, Malcolm for network traffic, Velociraptor for endpoint collection, and Autopsy for disk analysis. Four tools, each with its own idea of what "evidence" means, and much of the work is moving between them without losing the thread.

What surprised me was how much of it was reading rather than tooling. The tools narrow the search; the actual finding is someone noticing that a timestamp does not fit. That is the same instinct that found a year-old production bug at UBS, applied to somebody else's system instead of my own.

We finished fifth overall and first among the ASU teams.`,
    iconName: "search",
    skillIds: [
      "skl_digital_forensics",
      "skl_forensics_tools",
      "skl_network_security",
      "skl_incident_response",
    ],
    phaseId: "phase_masters",
    featured: false,
    order: 2,
    visibility: "public",
  },
  {
    id: "eng_ai_elections",
    slug: "ai-elections-hackathon",
    title: "AI + Elections Hackathon",
    org: "Arizona State University",
    type: "hackathon",
    date: { start: { year: 2026, month: 2 }, end: { year: 2026, month: 2 } },
    summary:
      "A three-hour design sprint with election officials, producing a privacy-first civic AI assistant that never ingests personal data.",
    body: `Three hours, working directly with actual election officials to find a real friction point and architect something for it.

The gap they described was not information availability — it was that new voters abandon the process over basic logistical uncertainty, and are simultaneously reluctant to hand personal details to a government portal or a third-party app. Those two facts make the obvious solution impossible: a personalised assistant needs to know something about you, and the people who most need it will not tell it anything.

The design I led was a dual-mode system. Users could register normally, or select a strict anonymous mode in which demographic data is processed locally on the device to curate relevant resources, and only an encrypted, anonymised query reaches the backend model. The assistant gets enough context to be useful; the backend never receives anything identifying.

The concept was not selected for the final round. I still think the architectural move is the right one, and it is the clearest example I have of a privacy constraint improving a design rather than limiting it.

Built with Saurabh Dusane and Ojas Deodhar.`,
    iconName: "users",
    skillIds: ["skl_privacy", "skl_ml_security", "skl_system_design", "skl_threat_modeling"],
    phaseId: "phase_masters",
    featured: true,
    order: 3,
    visibility: "public",
  },
  {
    id: "eng_ubs_cultural",
    slug: "ubs-cultural-committee",
    title: "Cultural Committee Lead — JOSH & TATVA",
    org: "UBS",
    type: "leadership",
    date: { start: { year: 2021, month: 10 }, end: { year: 2024, month: 6 } },
    summary:
      "One of two core leads for the departmental cultural committee — treasurer, logistics manager, and the reason cross-team releases went more smoothly than they should have.",
    body: `I served as one of two core leads for UBS's departmental cultural committees, JOSH and TATVA, acting as both treasurer and logistics manager across three years.

The work was genuinely operational: managing budgets and resources, organising Independence Day celebrations and religious festivals end to end, and running cricket and badminton tournaments including registrations, scheduling and logistics. Attendee experience was the metric that mattered, and it is a harsher one than it sounds — an event either works on the day or it does not.

The reason it belongs on an engineering portfolio is what it did to the engineering. Enterprise releases at a bank are coupled to teams you have never met, and the difference between an email into the void and a message to someone you organised a cricket tournament with is measured in days. Building those relationships broke down silos that no process change had touched. When a batch migration later depended on six enterprise teams aligning perfectly, most of those teams were already people I knew.

I also volunteered at the broader organisational level. The through-line is the same one that shows up in the teaching work: technical output is bounded by how well a group functions, and that is not somebody else's problem.`,
    iconName: "handshake",
    skillIds: ["skl_mentorship"],
    phaseId: "phase_ubs",
    featured: true,
    order: 4,
    visibility: "public",
  },
  {
    id: "eng_robocon",
    slug: "robocon-mindspark",
    title: "Robocon & Mindspark Robotics",
    org: "Advanced Robotics Lab",
    type: "competition",
    date: { start: { year: 2017, month: 8 }, end: { year: 2018, month: 12 } },
    summary:
      "Competitive robotics — designing, building and debugging machines that had to work on the day, in someone else's conditions.",
    body: `Competition robotics across Robocon and Mindspark: a servo-driven four-legged walker, a line-following bot, and the sensor and encoder work underneath them.

Competitive robotics teaches something a coursework project cannot. Your machine has to work once, on a floor you have not tested on, under lighting you did not choose, after being transported. Everything I learned about building for conditions you do not control started here.`,
    iconName: "cpu",
    skillIds: ["skl_atmega", "skl_c_cpp"],
    phaseId: "phase_undergrad",
    featured: false,
    order: 5,
    visibility: "public",
  },
];
