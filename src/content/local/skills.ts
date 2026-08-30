import type { Skill } from "../types";

/**
 * THE VOCABULARY. The only file where a skill NAME exists as a literal.
 *
 * `featured: true` → Technical Arsenal on the home page. These are the
 *   umbrellas — broad, industry-legible skills with no parentId. /about
 *   drills into the specific tools beneath them.
 * `parentId`       → umbrella grouping. Clicking a parent rolls up usages
 *   from all its children, so `skl_cloud` shows Azure + AWS + Docker work
 *   even though no entity references skl_cloud directly.
 * `blurb`          → the one line shown at the top of the skill modal.
 *   Not exclusive to featured skills — any skill can have one.
 * `aliases`        → alternative search terms. Searching "cloud" on /about
 *   surfaces every skill that lists it, parent or child.
 * `level`          → core > working > familiar.
 *
 * Design decisions (CI/CD and x86 not featured despite being strong
 * candidates, Wireshark's single-parent tradeoff, etc.) are recorded in
 * CONTENT_DECISIONS.md, not here — this file stays data, not debate.
 */
export const SKILLS = {
  // ══ FEATURED UMBRELLAS ═══════════════════════════════════════════
  skl_java: {
    name: "Java",
    category: "language",
    level: "core",
    featured: true,
    order: 10,
    blurb:
      "Three years of enterprise backend work — Spring, Drools, and the JVM's failure modes.",
    aliases: ["JVM", "Java SE", "backend"],
  },
  skl_python: {
    name: "Python",
    category: "language",
    level: "core",
    featured: true,
    order: 11,
    blurb:
      "Exploit tooling, ML pipelines, CTF challenge development, and my default for technical interviews and leetcoding.",
    aliases: ["py", "python3", "scripting"],
  },
  skl_c_cpp: {
    name: "C / C++",
    category: "language",
    level: "core",
    featured: true,
    order: 12,
    blurb:
      "Where my computer engineering journey started, and where memory corruption actually happens — including in the vulnerable programs behind my CTF challenges.",
    aliases: ["C", "C++", "cpp", "systems programming"],
  },
  skl_linux: {
    name: "Linux / Unix",
    category: "platform",
    level: "core",
    featured: true,
    order: 13,
    blurb:
      "Three years managing Unix server infrastructure and CI pipelines at UBS, then a year where 80% of the CTF environment was shell. Everything other skill runs on top of it.",
    aliases: [
      "Unix",
      "UNIX",
      "shell",
      "server administration",
      "infrastructure",
    ],
  },
  skl_cloud: {
    name: "Cloud & Infrastructure",
    category: "platform",
    level: "core",
    featured: true,
    order: 14,
    blurb:
      "Led an Azure migration in production; designed and benchmarked a containerised alternative.",
    aliases: ["cloud", "cloud computing", "IaaS", "PaaS"],
  },
  skl_system_design: {
    name: "System Design",
    category: "practice",
    level: "core",
    featured: true,
    order: 15,
    blurb:
      "Built through experience — working across different systems, learning their architecture and design principles along the way.",
    aliases: ["architecture", "distributed systems", "design"],
  },
  skl_microservices: {
    name: "Microservices & APIs",
    category: "practice",
    level: "core",
    featured: true,
    order: 16,
    blurb:
      "Decoupling monoliths, SOAP-to-REST migrations, and the coupling problems that come free with both.",
    aliases: ["service decomposition", "API design", "integration"],
  },
  skl_reverse_engineering: {
    name: "Reverse Engineering",
    category: "domain",
    level: "core",
    featured: true,
    order: 17,
    blurb:
      "Taking apart what someone else built, stepping into the shoes of the developer who wrote it, to find out what it actually does — or is supposed to do.",
    aliases: ["RE", "binary analysis", "decompilation"],
  },
  skl_vuln_research: {
    name: "Vulnerability Research",
    category: "domain",
    level: "core",
    featured: true,
    order: 18,
    blurb:
      "Finding the bug before someone else does — and, lately, evaluating whether a language model can help.",
    aliases: ["security research", "bug hunting", "offensive security"],
  },
  skl_kernel_security: {
    name: "System Security",
    category: "domain",
    level: "core",
    featured: true,
    order: 19,
    blurb:
      "Kernel and OS-level security — the layer I went looking for after three years of treating infrastructure as something that just worked.",
    aliases: [
      "Kernel Security",
      "System & Kernel Security",
      "microarchitecture",
      "privilege escalation",
      "OS security",
    ],
  },
  skl_network_security: {
    name: "Network Security",
    category: "domain",
    level: "core",
    featured: true,
    order: 20,
    blurb:
      "CCNA-grounded, and the layer most of my Tracer Fire and IDS work sits on.",
    aliases: ["networking", "firewall", "CCNA"],
  },
  skl_spring_boot: {
    name: "Spring Boot",
    category: "framework",
    level: "core",
    featured: true,
    order: 21,
    blurb:
      "The bread and butter of three years of enterprise development at UBS.",
    aliases: ["Spring", "Spring MVC", "Spring Web MVC"],
  },
  skl_react: {
    name: "React",
    category: "framework",
    level: "core",
    featured: true,
    order: 22,
    blurb:
      "The framework behind my first web app — Burger Builder — and everything front-end since.",
    aliases: ["ReactJS", "React.js", "frontend", "SPA"],
  },

  // ══ LANGUAGES ════════════════════════════════════════════════════
  skl_bash: {
    name: "Bash / Shell",
    category: "language",
    level: "core",
    featured: false,
    order: 100,
    parentId: "skl_linux",
    blurb:
      "The majority of the CTF exam environment — sandbox setup, VM provisioning, challenge orchestration.",
    aliases: ["shell", "sh", "shell scripting"],
  },
  skl_x86_asm: {
    name: "x86 Assembly",
    category: "language",
    level: "core",
    featured: false,
    order: 101,
    parentId: "skl_reverse_engineering",
    blurb: "Where reverse engineering actually takes place.",
    aliases: ["x86", "asm", "assembly", "x86-64", "disassembly"],
  },
  skl_typescript: {
    name: "TypeScript",
    category: "language",
    level: "working",
    featured: false,
    order: 102,
    blurb:
      "The language this site is written in, and my default for frontend work now.",
    aliases: ["TS"],
  },
  skl_javascript: {
    name: "JavaScript",
    category: "language",
    level: "working",
    featured: false,
    order: 103,
    parentId: "skl_react",
    aliases: ["JS", "ES6"],
  },
  skl_go: {
    name: "Go",
    category: "language",
    level: "working",
    featured: false,
    order: 104,
    aliases: ["Golang"],
  },
  skl_sql: {
    name: "SQL",
    category: "language",
    level: "working",
    featured: false,
    order: 105,
    blurb:
      "The go-to language for data, in CTF challenges as much as production databases.",
    aliases: ["queries", "stored procedures"],
  },
  skl_jsp: {
    name: "JSP",
    category: "language",
    level: "working",
    featured: false,
    order: 106,
    parentId: "skl_spring_boot",
    blurb:
      "The view layer of the Spring Web MVC applications I spent three years modernising away from.",
    aliases: ["JavaServer Pages", "servlets"],
  },

  // ══ FRAMEWORKS & LIBRARIES ═══════════════════════════════════════
  skl_nextjs: {
    name: "Next.js",
    category: "framework",
    level: "working",
    featured: false,
    order: 200,
    parentId: "skl_react",
    blurb:
      "The framework this site runs on — App Router, server components, and Next 16's new caching model.",
    aliases: ["nextjs", "Next", "SSR"],
  },
  skl_redux: {
    name: "Redux",
    category: "framework",
    level: "familiar",
    featured: false,
    order: 201,
    parentId: "skl_react",
    aliases: ["state management"],
  },
  skl_flask: {
    name: "Flask",
    category: "framework",
    level: "working",
    featured: false,
    order: 202,
    parentId: "skl_python",
    blurb:
      "The authentication server I built that sits in front of every CTF exam VM.",
    aliases: ["Python web"],
  },
  skl_drools: {
    name: "Drools",
    category: "framework",
    level: "working",
    featured: false,
    order: 203,
    parentId: "skl_java",
    blurb:
      "Business rules engine, and a lesson in how an unpruned state machine quietly complicates a system's architecture.",
    aliases: ["rules engine", "state machine", "BPM"],
  },
  skl_sklearn: {
    name: "scikit-learn",
    category: "framework",
    level: "working",
    featured: false,
    order: 204,
    parentId: "skl_python",
    aliases: ["sklearn", "Scikit-Learn", "machine learning"],
  },
  skl_pandas: {
    name: "pandas / NumPy",
    category: "framework",
    level: "working",
    featured: false,
    order: 205,
    parentId: "skl_python",
    aliases: ["pandas", "numpy", "data processing"],
  },
  skl_hyperledger: {
    name: "Hyperledger Fabric",
    category: "framework",
    level: "working",
    featured: false,
    order: 206,
    aliases: ["Hyperledger", "Fabric", "blockchain", "distributed ledger"],
  },

  // ══ PLATFORMS & INFRASTRUCTURE ═══════════════════════════════════
  skl_azure: {
    name: "Microsoft Azure",
    category: "platform",
    level: "working",
    featured: false,
    order: 300,
    parentId: "skl_cloud",
    blurb:
      "The cloud I actually migrated a production financial application onto.",
    aliases: ["Azure", "Azure Cloud", "cloud"],
  },
  skl_aws: {
    name: "AWS",
    category: "platform",
    level: "familiar",
    featured: false,
    order: 301,
    parentId: "skl_cloud",
    blurb:
      "EKS, Lambda and ALB — designed and benchmarked for a containerised migration.",
    aliases: ["Amazon Web Services", "cloud", "Lambda", "EKS", "serverless"],
  },
  skl_docker: {
    name: "Docker",
    category: "platform",
    level: "core",
    featured: false,
    order: 302,
    parentId: "skl_cloud",
    blurb: "Container definitions and sandboxing for CTF environment.",
    aliases: ["containers", "containerisation", "Dockerfile"],
  },
  skl_kubernetes: {
    name: "Kubernetes",
    category: "platform",
    level: "familiar",
    featured: false,
    order: 303,
    parentId: "skl_cloud",
    blurb: "Designed and benchmarked a containerised migration.",
    aliases: ["k8s", "EKS", "orchestration", "cloud"],
  },
  skl_cicd: {
    name: "CI/CD & DevOps",
    category: "platform",
    level: "core",
    featured: false,
    order: 304,
    parentId: "skl_cloud",
    aliases: [
      "GitLab CI",
      "pipelines",
      "DevOps",
      "deployment",
      "release engineering",
    ],
  },
  skl_firebase: {
    name: "Firebase / Firestore",
    category: "platform",
    level: "working",
    featured: false,
    order: 305,
    blurb:
      "The backend I use for most of my personal projects, thanks to the free tier and the ease of use.",
    aliases: ["Firestore", "Firebase Auth", "BaaS"],
  },
  skl_postgres: {
    name: "Databases",
    category: "platform",
    level: "working",
    featured: false,
    order: 306,
    aliases: [
      "Postgres",
      "PostgreSQL",
      "MySQL",
      "DB2",
      "CouchDB",
      "relational",
    ],
  },
  skl_vault: {
    name: "Secrets Management",
    category: "platform",
    level: "working",
    featured: false,
    order: 307,
    blurb: "Migrated secrets into Vault with RBAC profiles.",
    aliases: [
      "HashiCorp Vault",
      "EVA Vault",
      "RBAC",
      "least privilege",
      "credentials",
    ],
  },
  skl_atmega: {
    name: "Embedded / Arduino",
    category: "platform",
    level: "familiar",
    featured: false,
    order: 308,
    blurb: "What I built my early robotics and IoT projects on.",
    aliases: ["Arduino", "ATmega16", "microcontrollers", "embedded", "IoT"],
  },

  // ══ TOOLS ════════════════════════════════════════════════════════
  skl_ghidra_ida: {
    name: "Ghidra / IDA",
    category: "tool",
    level: "core",
    featured: false,
    order: 400,
    parentId: "skl_reverse_engineering",
    aliases: ["Ghidra", "IDA Pro", "decompiler", "disassembler"],
  },
  skl_gdb: {
    name: "GDB / pwntools",
    category: "tool",
    level: "core",
    featured: false,
    order: 401,
    parentId: "skl_reverse_engineering",
    aliases: ["GDB", "pwntools", "pwndbg", "debugger", "dynamic analysis"],
  },
  skl_wireshark: {
    name: "Wireshark / Burp Suite",
    category: "tool",
    level: "working",
    featured: false,
    order: 402,
    parentId: "skl_vuln_research",
    aliases: [
      "Wireshark",
      "Burp Suite",
      "Burp",
      "traffic analysis",
      "proxy",
      "network security",
      "packet analysis",
    ],
  },
  skl_forensics_tools: {
    name: "Velociraptor / Autopsy",
    category: "tool",
    level: "working",
    featured: false,
    order: 403,
    aliases: [
      "Kibana",
      "Malcolm",
      "Autopsy",
      "Velociraptor",
      "forensics tooling",
    ],
  },
  skl_git: {
    name: "Git / GitLab",
    category: "tool",
    level: "core",
    featured: false,
    order: 404,
    parentId: "skl_cicd",
    aliases: ["Git", "GitHub", "GitLab", "version control", "merge"],
  },
  skl_landrun: {
    name: "landrun / Sandboxing",
    category: "tool",
    level: "working",
    featured: false,
    order: 405,
    parentId: "skl_linux",
    aliases: ["landrun", "landlock", "sandbox", "isolation"],
  },
  skl_autosys: {
    name: "Autosys",
    category: "tool",
    level: "core",
    featured: false,
    order: 406,
    blurb:
      "Enterprise batch scheduling — and redesigning a brittle event-driven pipeline that used to block everything downstream.",
    aliases: ["job scheduling", "batch orchestration", "cron", "workflow"],
  },

  // ══ SECURITY DOMAINS ═════════════════════════════════════════════
  skl_binary_exploitation: {
    name: "Binary Exploitation",
    category: "domain",
    level: "core",
    featured: false,
    order: 500,
    parentId: "skl_vuln_research",
    blurb:
      "Memory corruption, ROP, and the exploitation challenges behind ASU's software security course.",
    aliases: [
      "pwn",
      "memory corruption",
      "ROP",
      "Return Oriented Programming",
      "buffer overflow",
    ],
  },
  skl_ssl_tls: {
    name: "SSL / TLS",
    category: "domain",
    level: "core",
    featured: false,
    order: 501,
    blurb:
      "Certificate chains, handshakes, and cipher suite negotiation — learned properly during an outage.",
    aliases: ["TLS", "SSL", "PKI", "certificates", "encryption in transit"],
  },
  skl_digital_forensics: {
    name: "Digital Forensics",
    category: "domain",
    level: "working",
    featured: false,
    order: 504,
    aliases: ["DFIR", "incident response", "threat hunting", "evidence"],
  },
  skl_cryptography: {
    name: "Applied Cryptography",
    category: "domain",
    level: "working",
    featured: false,
    order: 505,
    aliases: ["cryptography", "crypto", "encryption", "hashing"],
  },
  skl_privacy: {
    name: "Privacy Engineering",
    category: "domain",
    level: "working",
    featured: false,
    order: 506,
    aliases: ["differential privacy", "LDP", "PII", "data protection"],
  },
  skl_threat_modeling: {
    name: "Threat Modeling",
    category: "domain",
    level: "core",
    featured: false,
    order: 507,
    aliases: ["attack surface", "risk assessment", "adversarial thinking"],
  },
  skl_ml_security: {
    name: "ML for Security",
    category: "domain",
    level: "working",
    featured: false,
    order: 508,
    aliases: ["machine learning", "ML", "LLMs", "intrusion detection", "AI"],
  },

  // ══ ENGINEERING PRACTICE ═════════════════════════════════════════
  skl_rest_soap: {
    name: "REST & SOAP APIs",
    category: "practice",
    level: "core",
    featured: false,
    order: 600,
    parentId: "skl_microservices",
    blurb:
      "Both sides of several migrations, including one done in two days during a Sev-1.",
    aliases: ["REST", "SOAP", "API", "web services", "HTTP", "endpoints"],
  },
  skl_secure_coding: {
    name: "Secure Coding",
    category: "practice",
    level: "core",
    featured: false,
    order: 601,
    aliases: [
      "Secure SDLC",
      "least privilege",
      "RBAC",
      "defensive programming",
    ],
  },
  skl_incident_response: {
    name: "Production Incident Response",
    category: "practice",
    level: "core",
    featured: false,
    order: 602,
    blurb: "Sev-1s on systems that weren't allowed to go down.",
    aliases: ["on-call", "Sev-1", "outage", "firefighting", "SRE"],
  },
  skl_perf_optimization: {
    name: "Performance Optimisation",
    category: "practice",
    level: "core",
    featured: false,
    order: 603,
    aliases: ["profiling", "latency", "SLA", "benchmarking", "tuning"],
  },
  skl_cloud_migration: {
    name: "Cloud Migration",
    category: "practice",
    level: "core",
    featured: false,
    order: 604,
    parentId: "skl_cloud",
    aliases: ["lift and shift", "modernisation", "legacy migration", "cloud"],
  },
  skl_technical_writing: {
    name: "Technical Documentation",
    category: "practice",
    level: "working",
    featured: false,
    order: 605,
    aliases: ["Confluence", "knowledge transfer", "KT", "runbooks"],
  },
  skl_mentorship: {
    name: "Mentorship & Teaching",
    category: "practice",
    level: "core",
    featured: false,
    order: 606,
    aliases: [
      "teaching",
      "curriculum",
      "CTF development",
      "coaching",
      "onboarding",
    ],
  },
  skl_agile: {
    name: "Agile / Scrum",
    category: "practice",
    level: "working",
    featured: false,
    order: 607,
    aliases: ["scrum", "sprint", "kanban", "delivery"],
  },
} as const;

export type SkillId = keyof typeof SKILLS;

/** Materialised array — `id` and `slug` derived so they can never drift. */
export const skills: Skill[] = Object.entries(SKILLS).map(([id, s]) => {
  const entry = s as {
    name: string;
    category: Skill["category"];
    level: Skill["level"];
    featured: boolean;
    order: number;
    blurb?: string;
    aliases?: readonly string[];
    parentId?: string;
  };
  return {
    id,
    slug: id.replace(/^skl_/, "").replace(/_/g, "-"),
    name: entry.name,
    category: entry.category,
    level: entry.level,
    featured: entry.featured,
    order: entry.order,
    ...(entry.blurb ? { blurb: entry.blurb } : {}),
    ...(entry.aliases ? { aliases: [...entry.aliases] } : {}),
    ...(entry.parentId ? { parentId: entry.parentId } : {}),
  };
});
