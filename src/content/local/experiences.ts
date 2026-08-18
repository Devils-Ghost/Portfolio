import type { Experience } from "../types";

export const experiences: Experience[] = [
  // ── PHASE: NOW ───────────────────────────────────────────────────
  {
    id: "exp_llm_re_research",
    slug: "llm-assisted-reverse-engineering",
    role: "Research Volunteer — LLM-Assisted Vulnerability Discovery",
    org: "University of Georgia",
    orgUrl: "https://www.uga.edu",
    type: "research",
    mode: "remote",
    location: "Remote",
    date: { start: { year: 2026, month: 6 }, end: null },
    summary:
      "Evaluating how reliably large language models find vulnerabilities in compiled binaries when paired with decompiler tooling.",
    body: `Reverse engineers spend most of their time on a translation problem. A binary gives you assembly; a decompiler gives you something that *looks* like C but has lost names, types, and structure. Everything after that is a human reading the wreckage and reconstructing intent.

The obvious question is whether a language model can carry part of that load — and the less obvious question, which is the one worth answering, is *where it stops being reliable*. A model that finds nine bugs and confidently invents a tenth is not a productivity tool; it is a new source of work.

I'm working with a professor on evaluating exactly that: how well current models identify real vulnerabilities in decompiled output, where their failure modes cluster, and whether the answers hold up when a human who knows the binary checks them.

What draws me to it is that the intended users are the people I'd have been asking for help two years ago. Reverse engineers and bug hunters have a very low tolerance for tools that are usually right. Building for that audience means the evaluation has to be honest about the negative results, which is the part of research I find most interesting.`,
    achievements: [],
    skillIds: [
      "skl_reverse_engineering",
      "skl_vuln_research",
      "skl_ml_security",
      "skl_ghidra_ida",
      "skl_python",
      "skl_c_cpp",
    ],
    links: [],
    phaseId: "phase_now",
    featured: true,
    order: 1,
    visibility: "public",
  },

  // ── PHASE: MASTER'S ──────────────────────────────────────────────
  {
    id: "exp_asu_ta",
    slug: "graduate-teaching-assistant-software-security",
    role: "Graduate Teaching Assistant — Software Security (CSE 545)",
    org: "Arizona State University",
    orgUrl: "https://www.asu.edu",
    type: "academic",
    mode: "onsite",
    location: "Tempe, AZ",
    date: { start: { year: 2025, month: 8 }, end: { year: 2026, month: 5 } },
    summary:
      "Built exploitation challenges and a hardened exam environment for 150+ graduate students learning memory corruption and reverse engineering.",
    body: `A software security course has a structural problem that ordinary courses do not: the exam requires students to run attack code, on infrastructure you own, at the same time, while being graded.

I built and ran the environment that made that possible, and wrote the challenges that ran inside it.

**The challenges.** Hands-on exploitation exercises on the pwn.college platform, written in C, Python and Bash — memory corruption, return-oriented programming, web and system security. Each one is a deliberately placed hole, which makes the design harder than it sounds: the intended vulnerability has to be reachable and everything around it has to be locked, on a box the student has real shell access to.

**The environment.** The platform handled orchestration and isolation *between* students. My work was inside that boundary: constraining what a student could reach within their own container using landrun, and proxying the challenge's several services to sandboxed instances on separate ports rather than exposing the real ones. I paired prevention with detection — flag submission timestamps and log analysis surfaced anomalies that prevention alone would never have shown me.

**The teaching.** Seven-plus hours a week of office hours, and a change in how I ran them. The default TA move is to show a student a working solution. I stopped doing that and started debugging the student's own broken exploit with them instead, using their code as the baseline. Slower per student, and the only version that actually transfers.

The course had a reputation for being brutal, and the historical class average reflected it. Restructuring the on-ramp — breaking a monolithic buffer-overflow task into micro-challenges, so students hit "find the buffer address" before "chain the exploit" — moved the average from below 60% to around 80%.`,
    achievements: [
      "Developed hands-on CTF challenges covering memory corruption, ROP, web and system security for 150+ graduate students",
      "Engineered an isolated exam environment with Docker, landrun sandboxing, Nginx reverse proxy and Flask authentication",
      "Paired preventative hardening with log-based anomaly detection to surface academic integrity violations",
      "Restructured the advanced labs into progressive micro-challenges, lifting the class average from below 60% to ~80%",
    ],
    skillIds: [
      "skl_binary_exploitation",
      "skl_reverse_engineering",
      "skl_c_cpp",
      "skl_python",
      "skl_bash",
      "skl_docker",
      "skl_landrun",
      "skl_linux",
      "skl_gdb",
      "skl_ghidra_ida",
      "skl_wireshark",
      "skl_threat_modeling",
      "skl_kernel_security",
      "skl_mentorship",
      "skl_secure_coding",
      "skl_flask",
    ],
    links: [],
    phaseId: "phase_masters",
    featured: true,
    order: 2,
    visibility: "public",
  },

  // ── PHASE: UBS ───────────────────────────────────────────────────
  {
    id: "exp_ubs_swe",
    slug: "software-engineer-ubs",
    role: "Software Engineer",
    org: "UBS",
    orgUrl: "https://www.ubs.com",
    type: "full-time",
    mode: "onsite",
    location: "Pune, India",
    date: { start: { year: 2021, month: 7 }, end: { year: 2024, month: 6 } },
    summary:
      "Three years on financial applications carrying a 99.9% availability SLA — backend, DevOps, infrastructure, and the incidents nobody else had solved.",
    body: `I joined as a graduate engineer and left three years later as the person the team routed ambiguous, critical problems to. The work spanned the full lifecycle: Java and Spring Boot backends, the GitLab pipelines that deployed them, the Unix servers underneath, and the Azure migration that eventually moved them.

**What the work actually was.** Financial applications used by advisors, under a strict 99.9% availability SLA, consumed by other enterprise teams through APIs. That last part is the constraint that shaped everything — a bad release did not just affect us, it cascaded.

**Modernisation.** Decoupled a Spring Web MVC monolith into React and Spring Boot services. Refactored a Drools rules engine that had accumulated years of dead branches and redundant flows, mapping actual current business use cases against the codebase with stakeholders before deleting anything. Led infrastructure migration to Azure, and rebuilt the batch pipeline's event flow to fail gracefully instead of hard-blocking every downstream job.

**Security.** Migrated hardcoded credentials into a vault-based secrets model with RBAC application profiles, and separated human access so the development team could not read production secrets at all. Enforced SSL/TLS across API endpoints. The SSL work is also how I ended up as the person pulled into certificate-related outages — including the one that turned into a Sev-1.

**Incidents.** I was usually one of the people brought in when production broke. What I came to like about that was not the firefighting. It was that incidents are where you find out what your system actually does, as opposed to what the design document says it does. The two bugs I am proudest of — a year of intermittent 500s, and a six-month deployment failure — were both found by refusing to accept the layer the problem was reported at.

**Leaving.** The application had been built before my time without coding standards or documentation, and three years of my work had gone into changing that. But a lot of what I knew about its actual behaviour had never left my head, because I had learned it by running into it. So I spent my notice period on the handover rather than coasting: the hidden services, the behaviours you only find by hitting them, the post-migration infrastructure, and a full map of upstream and downstream consumers with emergency contacts. The last useful thing I could do was make what I knew not depend on me.`,
    achievements: [
      "Maintained 99.9% availability across financial applications through incident response, Unix server management and GitLab pipeline engineering",
      "Cut service response time by 53% by profiling the full execution path and eliminating a redundant API call in an unowned legacy service",
      "Reduced operational errors by refactoring a Drools state machine and decoupling a Spring Web MVC monolith into React + Spring Boot services",
      "Led on-prem to Azure migration, taking architectural ownership from an external vendor and replacing a big-bang cutover with a phased strategy",
      "Eliminated hardcoded secrets exposure with a vault-based RBAC model separating application read access from human access",
      "Refactored a batch application for a ~40% performance improvement and migrated enterprise file transfers from Tumbleweed to Axway",
      "Promoted to Authorized Officer; recognised as the team's SSL/TLS subject matter expert",
    ],
    skillIds: [
      "skl_java",
      "skl_spring_boot",
      "skl_jsp",
      "skl_react",
      "skl_drools",
      "skl_sql",
      "skl_postgres",
      "skl_azure",
      "skl_cicd",
      "skl_linux",
      "skl_bash",
      "skl_git",
      "skl_autosys",
      "skl_vault",
      "skl_ssl_tls",
      "skl_rest_soap",
      "skl_microservices",
      "skl_incident_response",
      "skl_perf_optimization",
      "skl_cloud_migration",
      "skl_secure_coding",
      "skl_system_design",
      "skl_technical_writing",
      "skl_agile",
    ],
    links: [],
    phaseId: "phase_ubs",
    featured: true,
    order: 3,
    visibility: "public",
  },
  {
    id: "exp_ubs_intern",
    slug: "software-engineering-intern-ubs",
    role: "Software Engineering Intern",
    org: "UBS",
    orgUrl: "https://www.ubs.com",
    type: "internship",
    mode: "onsite",
    location: "Pune, India",
    date: { start: { year: 2020, month: 6 }, end: { year: 2021, month: 1 } },
    summary:
      "First exposure to enterprise engineering — smart business forms, and live web applications integrating SOAP and REST services.",
    body: `Seven months that decided the next three years. I designed and managed smart business forms in AEM Forms Designer, cutting processing time by around 25%, and built live web applications in Java and React integrating with both SOAP and REST APIs.

The technical content matters less than what it established. This was the first time I saw software that other people depended on in a way that had consequences, and the first time I worked inside a system too large to hold in my head. Both turned out to be the things I wanted more of.`,
    achievements: [
      "Designed smart business forms in AEM Forms Designer, reducing processing time by ~25%",
      "Built live web applications in Java and React integrating SOAP and REST APIs, improving performance by ~20%",
    ],
    skillIds: ["skl_java", "skl_react", "skl_javascript", "skl_rest_soap", "skl_microservices"],
    links: [],
    phaseId: "phase_ubs",
    featured: false,
    order: 4,
    visibility: "public",
  },

  // ── PHASE: UNDERGRAD ─────────────────────────────────────────────
  {
    id: "exp_cisco_academy",
    slug: "student-office-assistant-cisco-networking-academy",
    role: "Student Office Assistant & Division Head",
    org: "Cisco Networking Academy",
    type: "volunteer",
    mode: "onsite",
    location: "Pune, India",
    date: { start: { year: 2019, month: 7 }, end: { year: 2020, month: 5 } },
    summary:
      "Grew the campus networking cell — recruiting students, running intra-division campaigns, and mentoring members through certification.",
    body: `I ran campaigns to bring students into the campus networking cell and then made sure they finished what they started — guiding members through the CCNA coursework and the challenges that came with it, and stepping into a Division Head role to mentor others.

This is where the networking foundation came from, and where I first noticed that explaining something is a different skill from knowing it. That observation is more or less the throughline to the teaching work at ASU five years later.`,
    achievements: [
      "Led intra-division campaigns to recruit and retain students in the networking cell",
      "Mentored members through CCNA coursework as Division Head",
    ],
    skillIds: ["skl_network_security", "skl_mentorship"],
    links: [],
    phaseId: "phase_undergrad",
    featured: false,
    order: 5,
    visibility: "public",
  },
  {
    id: "exp_robotics_lab",
    slug: "student-lab-aide-advanced-robotics-lab",
    role: "Student Lab Aide",
    org: "Advanced Robotics Lab",
    type: "academic",
    mode: "onsite",
    location: "Pune, India",
    date: { start: { year: 2017, month: 7 }, end: { year: 2018, month: 5 } },
    summary:
      "Built robots for international competition — a four-legged walker, a line follower, and an optical encoder — on Arduino and bare metal.",
    body: `Robotics projects for competitions including Robocon: a four-legged robotic horse driven by servo motors on an Arduino, a line-following robot built around a Cytron IR sensor array, and an optical encoder for measuring bot speed.

This is the earliest layer of the thing I still do. A robot that does not work does not throw an exception — it just sits there, or falls over, and you have to reason from the physical behaviour back to the cause. Learning to debug something with no stack trace turned out to be more transferable than any of the specific circuits.`,
    achievements: [
      "Designed and programmed a servo-driven four-legged robot on Arduino for Robocon",
      "Built a line-following robot using a Cytron 7-bit IR sensor array and Arduino Nano",
      "Contributed to an optical encoder for bot speed detection",
    ],
    skillIds: ["skl_atmega", "skl_c_cpp"],
    links: [],
    phaseId: "phase_undergrad",
    featured: false,
    order: 6,
    visibility: "public",
  },
  {
    id: "exp_instructional_assistant",
    slug: "instructional-assistant",
    role: "Instructional Assistant",
    org: "Private Coaching Centre",
    type: "contract",
    mode: "onsite",
    location: "Pune, India",
    date: { start: { year: 2019, month: 8 }, end: { year: 2020, month: 12 } },
    summary:
      "Taught senior high school students object-oriented programming in C++ and 8085 microcontroller assembly.",
    body: `Tutoring senior high school students in OOP with C++ and assembly programming on the 8085 microcontroller, plus organising and grading exams.

Teaching assembly to teenagers is an unusually good way to find out whether you understand it. Every abstraction you have quietly been leaning on gets exposed the moment someone asks why.`,
    achievements: [],
    skillIds: ["skl_c_cpp", "skl_mentorship", "skl_x86_asm"],
    links: [],
    phaseId: "phase_undergrad",
    featured: false,
    order: 7,
    visibility: "public",
  },
  {
    id: "exp_nanostuffs",
    slug: "intern-nanostuffs",
    role: "Intern",
    org: "Nanostuffs Technologies Pvt. Ltd.",
    type: "internship",
    mode: "onsite",
    location: "Pune, India",
    date: { start: { year: 2019, month: 6 }, end: { year: 2019, month: 7 } },
    summary:
      "Designed system administration solutions for CRM on the Salesforce platform.",
    body: `A short first internship building system administration solutions for customer relationship management on Salesforce. Small in scope, and the first line on the résumé that was not coursework.`,
    achievements: [],
    skillIds: ["skl_system_design"],
    links: [],
    phaseId: "phase_undergrad",
    featured: false,
    order: 8,
    visibility: "public",
  },
];
