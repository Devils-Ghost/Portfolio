import type { Engagement } from "../types";

export const engagements: Engagement[] = [
  {
    id: "eng_tracer_fire_2026",
    slug: "tracer-fire-2026",
    title: "Tracer Fire 13 — Digital Forensics Workshop",
    org: "Sandia National Laboratories",
    type: "competition",
    date: { start: { year: 2026, month: 1 }, end: { year: 2026, month: 1 } },
    summary:
      "Fourth overall and second among ASU teams at Sandia's incident-response exercise — my second run at it.",
    body: `My second Tracer Fire, fifteen months after the first. We finished fourth overall and second among the ASU teams.

What changed between the two was where the time went. The first time, most of my effort went into the toolchain — learning what Velociraptor collects, what Malcolm shows you that a packet capture doesn't, and how to make Kibana answer the question I actually had.

This time, those tools were already muscle memory. What I picked up instead was Kusto Query Language (KQL) for interrogating the cloud environment. I spent my time digging through cloud logs to identify exactly who logged in, tracking service principals, and tracing specific usernames across the tenant.

With the interface out of the way, we could focus on the actual breach. We used KQL and our forensics toolkit to reconstruct the attacker's entire playbook step by step. We tracked exactly how they found their entry point, whose compromised credentials they used, and how they escalated privileges to hijack the cloud environment. It wasn't just about reading alerts—it was about rebuilding the crime scene, from the very first suspicious login down to the hidden rootkits they left behind.`,
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
    title: "Tracer Fire 12 — Digital Forensics Workshop",
    org: "Sandia National Laboratories",
    type: "competition",
    date: { start: { year: 2024, month: 10 }, end: { year: 2024, month: 10 } },
    summary:
      "Fifth overall and first among ASU teams at Sandia's competitive incident-response and threat-hunting exercise.",
    body: `Hosted by Sandia National Laboratories, Tracer Fire is a two-day digital forensics workshop. Day one covers tool familiarization, and day two tests those skills in a fast-paced Capture-The-Flag competition where teams work backward from a fully compromised system to uncover how the attacker broke in and established persistence.

The process requires gathering detailed evidence across four distinct systems: Kibana (logs), Malcolm (network traffic), Velociraptor (endpoints), and Autopsy (disk analysis). Together, they provide a comprehensive view of the entire attack surface.

The most remarkable part of the experience was seeing how real forensics works in practice. Even a massive breach leaves microscopic traces. By pulling at the smallest details — a weird log entry, a subtle timestamp anomaly, or a file that shouldn't exist — you can rebuild a complete, undeniable account of the adversary's every move.

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
      "A three-hour design sprint with election officials, producing privacy-first civic AI assistant.",
    body: `Working alongside election officials in a three-hour hackathon, we uncovered a critical friction point: new voters need guidance, but distrust apps that require their personal data.

To solve this, we architected a dual-mode AI assistant where sensitive data never leaves the user's phone. By processing context locally and only allowing anonymized, encrypted queries to reach the backend, we designed a tool that offers highly specific civic guidance without ever knowing who is asking.

The concept didn't make the final round, but the technical takeaway was invaluable: designing for absolute anonymity and zero-trust doesn't ruin the user experience, it actually improves it. 

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
      "Co-led the departmental cultural committee as treasurer and logistics manager, directing budgets and large-scale events to build a workplace community where teams actively connect.",
    body: `I was one of two core leads for TATVA, my department's cultural committee, acting as both treasurer and logistics manager. I also volunteered with JOSH, the equivalent running across multiple UBS locations in India.
 
The work was operational: managing budgets and resources, organizing national celebrations and religious festivals, and running sports tournaments including registrations, scheduling and logistics. Attendee experience was the metric that mattered.
 
What mattered was what it built outside the work. Enterprise releases depend on teams you've never met, and knowing people across the office is what makes those conversations easy instead of formal.`,
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
      "Engineered embedded robotic systems for Robocon and Mindspark — bridging software and hardware to build machines that execute flawlessly under unpredictable conditions.",
    body: `My foundational experience in systems engineering started in my university's Advanced Robotics Lab, building for two very different competitive arenas: the international Robocon and the regional Mindspark.

Coursework projects run in controlled environments, but competitive robotics forces you to build machines that survive transport and perform on the day, under lighting and floor friction you don't control. For Robocon, our team designed and programmed a four-legged robotic horse, bridging software and hardware using Arduino microcontrollers to sequence complex servo actuation. For Mindspark, I built a line-following robot driven by an Arduino Nano and Cytron IR sensors, alongside custom optical encoders to calculate real-time speed.

This was where I first learned how to integrate embedded systems to actuate in the real world. Everything I know today about building resilient systems for unpredictable conditions started here.`,
    iconName: "cpu",
    skillIds: ["skl_atmega", "skl_c_cpp"],
    phaseId: "phase_undergrad",
    featured: false,
    order: 5,
    visibility: "public",
  },
];