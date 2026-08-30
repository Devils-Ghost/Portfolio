import type { Project } from "../types";

/**
 * Project bodies are a 2–3 line description of what the thing IS.
 * `highlights` carries the resume-register XYZ bullets — impact, quantification,
 * and technologies, written so they can be lifted straight onto a résumé.
 *
 * `links` of kind "report", "paper" and "credential" point at direct-download
 * URLs and render WITHOUT target="_blank" — the browser downloads and stays
 * on the page. Only "github", "live", "video" and "external" open a new tab.
 * That mapping lives in components/ui/ResourceLinks.tsx.
 */
export const projects: Project[] = [
  // ── PHASE: POST-MASTER'S ─────────────────────────────────────────
  {
    id: "prj_decompiler_eval",
    slug: "decompiler-evaluation-for-llm-vulnerability-discovery",
    title: "Decompiler Evaluation for LLM Vulnerability Discovery",
    summary:
      "A controlled study testing whether the choice of decompiler changes what an AI agent can find in a compiled binary.",
    body: `Existing decompiler benchmarks measure how accurately a decompiler reconstructs source code. None measure whether that reconstruction is actually useful for a real security task. In this study, an MCP-connected LLM agent analyzes real-world binaries and attempts to independently discover a known CVE, scored against a hand-verified ground truth that stays valid regardless of which decompiler produced the analysis.`,
    highlights: [
      "Designed and ran controlled experiments measuring whether decompiler choice affects an MCP-connected LLM agent's ability to independently discover vulnerabilities in binaries.",
      "Achieved 100% ground-truth consistency across decompilers by designing an address-anchored system to normalize output with incompatible naming conventions.",
      "Reduced experimental data processing time by 89% through an automated Python pipeline to parse 100,000+ session log lines and compute discovery-efficiency metrics, context efficiency ratio, tool-call efficiency, and address recall, across dozens of experimental runs.",
      "Resolved inconsistent vulnerability classifications across identical runs by designing a three-axis grading rubric separating localization, classification, and exploitation.",
      "Established baseline LLM performance metrics through a 5-run pilot study, demonstrating agent localization accuracy consistently outperforms classification accuracy.",
    ],
    skillIds: [
      "skl_reverse_engineering",
      "skl_vuln_research",
      "skl_ml_security",
      "skl_ghidra_ida",
      "skl_python",
      "skl_c_cpp",
      "skl_binary_exploitation",
      "skl_threat_modeling",
    ],
    links: [],
    status: "in-progress",
    date: { start: { year: 2026, month: 6 }, end: null },
    context: { kind: "research", experienceId: "exp_llm_re_research" },
    phaseId: "phase_post_masters",
    featured: false,
    order: 1,
    visibility: "public",
  },
  {
    id: "prj_barnum",
    slug: "performance-ai-observability-dashboard",
    title: "Performance AI — Observability Dashboard",
    summary:
      "An observability platform monitoring a multi-agent AI application for model drift, resource usage, and behavioral quality in real time.",
    body: `A research proof-of-concept for the ASU CIPS-AI Lab, deployed on Kubernetes with an OpenTelemetry pipeline. The dashboard displays drift-detection, resource monitors and model-quality indicators for a multi-agent AI chat system, the kind of visibility you need before you can trust an agent in production.`,
    highlights: [
      "Built a comprehensive observability UI for a multi-service AI system (FastAPI, LangGraph, OpenTelemetry), integrating React/TypeScript front-end panels with backend services to render 20 live metric tiles tracking drift-detection and model quality.",
      "Resolved critical infrastructure pipeline failures by debugging Helm configurations and tracing a cluster-wide Docker/cri-dockerd symlink resolution gap in DaemonSet volume mounts via direct Kubernetes node log inspection.",
      "Restored end-to-end telemetry data flow by rectifying Collector processing rules and fixing a backend SQL data-normalization defect, recovering 40% of drift-detection metrics.",
    ],
    skillIds: [
      "skl_react",
      "skl_typescript",
      "skl_kubernetes",
      "skl_docker",
      "skl_python",
      "skl_sql",
      "skl_linux",
      "skl_system_design",
      "skl_cloud",
      "skl_ml_security",
    ],
    links: [],
    status: "archived",
    date: { start: { year: 2026, month: 7 }, end: { year: 2026, month: 8 } },
    context: { kind: "research", experienceId: "exp_barnum" },
    phaseId: "phase_post_masters",
    featured: false,
    order: 2,
    visibility: "public",
  },
  {
    id: "prj_eternal_glitch_hub",
    slug: "eternal-glitch-hub",
    title: "Eternal Glitch Hub",
    summary:
      "A shared-domain project router replacing hard-to-remember subdomains with one live directory, built on a $0 infrastructure budget.",
    body: `eternalglitch.com is a shared personal domain acting as a centralized routing hub for two independent developers to showcase their projects. Instead of forcing users to memorize fragmented subdomains, it functions as a unified directory and full-stack portal. Powered by an authenticated CMS and custom data visualizations, the platform allows both owners to instantly publish and manage links without triggering redeploys, all while running flawlessly on $0 infrastructure.`,
    highlights: [
      "Engineered a zero-cost production environment by architecting a Next.js 16/TypeScript multi-tenant routing hub, utilizing Incremental Static Regeneration (ISR) to instantly propagate CMS updates while keeping Firestore reads below 1% of daily quotas.",
      "Eliminated client-side attack vectors by implementing a zero-trust backend model with deny-all Firestore rules, enforcing 100% server-mediated writes through custom JWT verification that bypassed complex ESM/CommonJS dependency conflicts.",
      "Built a highly interactive, WCAG-compliant UI featuring a custom, library-free SVG visualization for rendering randomized, collision-verified data points, alongside atomic batched writes for drag-and-drop reordering.",
    ],
    skillIds: [
      "skl_nextjs",
      "skl_react",
      "skl_typescript",
      "skl_firebase",
      "skl_system_design",
      "skl_secure_coding",
      "skl_perf_optimization",
      "skl_threat_modeling",
      "skl_cloud",
    ],
    links: [
      { kind: "live", url: "https://eternalglitch.com", label: "Live site" },
      {
        kind: "github",
        url: "https://github.com/Devils-Ghost/eternal-glitch-hub",
        label: "",
      },
    ],
    status: "shipped",
    date: { start: { year: 2026, month: 6 }, end: null },
    context: { kind: "personal" },
    phaseId: "phase_post_masters",
    featured: true,
    order: 3,
    visibility: "public",
  },
  {
    id: "prj_portfolio",
    slug: "this-portfolio",
    title: "Personal Portfolio — This Site",
    summary:
      "A content-driven portfolio built on a typed content graph, where every skill, role, project and story is a linked entity.",
    body: `This platform serves as a living, comprehensive archive of my engineering career. Designed to be fast for recruiters to scan and deep enough for engineers to explore, the site seamlessly connects my technical capabilities with concrete proof of work. Built on Next.js 16, it features a custom content management system that allows me to document my entire professional history which also the site you are on right now.`,
    highlights: [
      "Engineered a dynamic professional archive in Next.js 16, architecting a relational content graph that seamlessly interlinks technical capabilities with real-world project and career outcomes.",
      "Streamlined portfolio management by building a custom CMS, enabling efficient, structured documentation and seamless updates to my entire professional history.",
      "Maximized SEO and screen-reader accessibility by enforcing default server-side rendering, alongside implementing one-shot entry animations that strictly honor system-level reduced-motion preferences.",
    ],
    skillIds: [
      "skl_typescript",
      "skl_nextjs",
      "skl_react",
      "skl_firebase",
      "skl_system_design",
    ],
    links: [
      {
        kind: "live",
        url: "https://dhaval-tanna.eternalglitch.com",
        label: "Live site",
      },
      {
        kind: "github",
        url: "https://github.com/Devils-Ghost/Portfolio",
        label: "",
      },
    ],
    status: "in-progress",
    date: { start: { year: 2026, month: 6 }, end: null },
    context: { kind: "personal" },
    phaseId: "phase_post_masters",
    featured: false,
    order: 4,
    visibility: "public",
  },

  // ── PHASE: MASTER'S ──────────────────────────────────────────────
  {
    id: "prj_ldp_analysis",
    slug: "local-differential-privacy-attack-analysis",
    title: "Attacking Local Differential Privacy",
    summary:
      "Analyzed Local Differential Privacy protocols against data-poisoning attacks, proving that stronger privacy protections make enterprise data easier to manipulate.",
    body: `This research investigates the resilience of Local Differential Privacy (LDP) frequency estimation protocols against targeted data-poisoning attacks. The study demonstrates how attackers can use fake accounts to manipulate statistics, ultimately proving that strengthening user privacy inadvertently makes the entire system more vulnerable.`,
    highlights: [
      "Evaluated 3 primary data-privacy protocols (kRR, OUE, OLH) against simulated data-poisoning attacks to determine their resilience and security at an enterprise scale.",
      "Exposed a critical scalability flaw in a standard privacy protocol by deriving its attack model, proving it becomes inherently insecure for systems tracking 100,000+ distinct items.",
      "Identified an optimal privacy method that exponentially reduces network costs while maintaining stable security across massive databases.",
      "Quantified a fundamental security paradox, proving that as attackers inject more fake accounts, enforcing stricter privacy guarantees actually makes the system easier to manipulate.",
    ],
    skillIds: [
      "skl_privacy",
      "skl_cryptography",
      "skl_python",
      "skl_threat_modeling",
      "skl_ml_security",
    ],
    links: [
      {
        kind: "report",
        url: "https://drive.google.com/uc?export=download&id=1K136Vf2CVoF81Kn7FlEINGl0p7Bw8fCF",
        label: "Project report",
      },
    ],
    status: "archived",
    date: { start: { year: 2025, month: 8 }, end: { year: 2025, month: 12 } },
    context: { kind: "academic" },
    phaseId: "phase_masters",
    featured: false,
    order: 5,
    visibility: "public",
  },
  {
    id: "prj_chain_of_custody",
    slug: "blockchain-chain-of-custody",
    title: "Blockchain Chain of Custody",
    summary:
      "A permissioned-blockchain system tracking forensic evidence across multiple legal organizations with a tamper-evident audit trail.",
    body: `This platform introduces a permissioned blockchain architecture to securely manage the chain of custody for digital forensics. Traditional evidence management relies on centralized databases that are vulnerable to tampering, human error, and single points of failure. To solve this, the system leverages Hyperledger Fabric to create a decentralized, tamper-evident record tracking the complete lifecycle of digital evidence across multiple organizations.`,
    highlights: [
      "Achieved 100% traceability for forensic disk and memory assets by designing a Docker-containerized decentralized system using Hyperledger Fabric, CouchDB, and Go smart contracts to manage the digital evidence lifecycle.",
      "Established immutable audit trails for extracted artifacts by implementing a dual-write logging strategy, and secured multi-organizational network communication with TLS.",
      "Modeled the complete custody lifecycle: acquisition, transfer, analysis, and release, as chaincode transactions, making evidence history independently reconstructible by any participating organization.",
    ],
    skillIds: [
      "skl_hyperledger",
      "skl_go",
      "skl_docker",
      "skl_ssl_tls",
      "skl_digital_forensics",
      "skl_cryptography",
      "skl_system_design",
      "skl_postgres",
    ],
    links: [
      {
        kind: "report",
        url: "https://drive.google.com/uc?export=download&id=14f3FAZqtDy8z-0c1kdcWT2RQpaBXdseU",
        label: "Project report",
      },
      {
        kind: "github",
        url: "https://github.com/Devils-Ghost/Blockchain-Chain-of-Custody",
        label: "",
      },
    ],
    status: "archived",
    date: { start: { year: 2025, month: 8 }, end: { year: 2025, month: 12 } },
    context: { kind: "academic" },
    phaseId: "phase_masters",
    featured: true,
    order: 6,
    visibility: "public",
  },
  {
    id: "prj_ids",
    slug: "multi-class-intrusion-detection",
    title: "AI-Based Intrusion Detection System",
    summary:
      "A machine-learning Intrusion Detection System classifying multi-class network attacks.",
    body: `Developed an AI-driven Network Intrusion Detection System (NIDS) designed to analyze network traffic and identify sophisticated cyber threats. Unlike traditional security frameworks that only issue generic binary alerts, this system utilizes multi-class classification to pinpoint the exact type of intrusion.`,
    highlights: [
      "Developed an Intrusion Detection System achieving 99.7% accuracy in classifying multi-class network attacks across the NSL-KDD and CIC-IDS2017 datasets by training Random Forest and Gradient Boosting models.",
      "Reduced training time by 25% and enhanced rare threat detection by 15% through hyperparameter tuning, StandardScaler feature standardization, and dimensionality reduction via Recursive Feature Elimination.",
      "Overcame the limitations of standard security frameworks by engineering the model to classify the specific type of cyber attack rather than just its overall presence, enabling precise and informed mitigation strategies.",
    ],
    skillIds: [
      "skl_ml_security",
      "skl_python",
      "skl_sklearn",
      "skl_pandas",
      "skl_network_security",
    ],
    links: [
      {
        kind: "report",
        url: "https://drive.google.com/uc?export=download&id=1_m88xsv854b77clMqebVGE_KJmtQc0hL",
        label: "Project report",
      },
      {
        kind: "github",
        url: "https://github.com/Devils-Ghost/AI-Based-Intrusion-Detection-System",
        label: "",
      },
    ],
    status: "archived",
    date: { start: { year: 2024, month: 8 }, end: { year: 2024, month: 12 } },
    context: { kind: "academic" },
    phaseId: "phase_masters",
    featured: true,
    order: 7,
    visibility: "public",
  },

  // ── PHASE: UNDERGRAD ─────────────────────────────────────────────
  {
    id: "prj_smart_society",
    slug: "iot-smart-society",
    title: "IoT Smart Society",
    summary:
      "an integrated IoT and cloud-messaging platform that automates residential safety and resource management, delivering real-time emergency alerts directly to users' mobile devices.",
    body: `To modernize residential infrastructure and eliminate the risks of manual oversight, this project introduces an automated, IoT-driven "Smart Society" platform. Powered by an ATmega-16 microcontroller and a network of environmental sensors, the system continuously monitors for hazards like fires, basement floods, and unauthorized entries. By routing this telemetry through a custom cloud-based processing pipeline directly to a dedicated mobile app, the platform ensures residents receive real-time, actionable alerts during critical events.`,
    highlights: [
      "Reduced emergency response delays by 47% by engineering an automated disaster detection system on an ATmega16 microcontroller, validated against published human-reporting statistics through manual disaster simulations.",
      "Built a full telemetry pipeline with a six-sensor aggregation scheme batching all readings into a single payload, integrating a Java service with ThingSpeak analytics and a Firebase realtime database.",
      "Centralized facility management and emergency alerting by integrating ThingSpeak analytics with a Java service and Firebase realtime database, pushing simultaneous alerts to React web and Android applications in under 250 milliseconds.",
      "Published the architecture and benchmarks in IJARIIT (Volume 7, Issue 2) as lead student author.",
    ],
    skillIds: [
      "skl_atmega",
      "skl_java",
      "skl_react",
      "skl_firebase",
      "skl_system_design",
      "skl_c_cpp",
    ],
    links: [
      {
        kind: "live",
        url: "https://smartsociety.eternalglitch.com",
        label: "Live site",
      },
      {
        kind: "github",
        url: "https://github.com/Devils-Ghost/Smart-Society-Software",
        label: "Web app source",
      },
      {
        kind: "github",
        url: "https://github.com/Devils-Ghost/Smart-Society-Hardware",
        label: "Hardware source",
      },
      {
        kind: "video",
        url: "https://youtu.be/l7T70eZS7-4",
        label: "Demo video",
      },
      {
        kind: "video",
        url: "https://youtu.be/XFRKeFaI02s",
        label: "Prototype video",
      },
      {
        kind: "paper",
        url: "https://www.ijariit.com/manuscript/internet-of-things-based-smart-society/",
        label: "Published paper",
      },
    ],
    status: "shipped",
    date: { start: { year: 2020, month: 8 }, end: { year: 2021, month: 4 } },
    context: { kind: "academic" },
    phaseId: "phase_undergrad",
    featured: false,
    order: 9,
    visibility: "public",
  },
  {
    id: "prj_burger_builder",
    slug: "burger-builder",
    title: "Burger Builder",
    summary:
      "An interactive web application that allows users to custom-build a burger, view real-time pricing, and securely place and track their orders.",
    body: `Everyone starts somewhere, and this was the very first application I built while learning React. It allows users to stack a burger ingredient by ingredient, place an order, and track it in their order history. Built to learn the framework properly rather than to solve a specific problem.`,
    highlights: [
      "Built a React single-page application, managing state for customized user orders via a centralized Redux store and modular component architecture, optimizing state management and reducing component re-renders by 37%.",
      "Accelerated application load times by 41%, ensured secure identity management, and maintained persistent order tracking by integrating Firebase Authentication and Realtime Database into a production build deployed via Firebase Hosting.",
    ],
    skillIds: ["skl_react", "skl_javascript", "skl_redux", "skl_firebase"],
    links: [
      {
        kind: "live",
        url: "https://burgerbuilder.eternalglitch.com",
        label: "Live site",
      },
      {
        kind: "github",
        url: "https://github.com/Devils-Ghost/Burger-Builder",
        label: "",
      },
    ],
    status: "shipped",
    date: { start: { year: 2020, month: 9 }, end: { year: 2020, month: 12 } },
    context: { kind: "personal" },
    phaseId: "phase_undergrad",
    featured: false,
    order: 10,
    visibility: "public",
  },
  {
    id: "prj_house_price",
    slug: "house-price-estimator",
    title: "House Price Estimator",
    summary:
      "A predictive machine learning project that analyzes construction and demographic data to forecast real estate prices, benchmarking five distinct regression models for optimal accuracy.",
    body: `This project explores data-driven property valuation by predicting real estate prices based on construction and demographic features. It serves as an exercise in model selection, benchmarking standard linear algorithms against advanced ensemble techniques on a standardized dataset to determine the most accurate forecasting approach.`,
    highlights: [
      "Benchmarked the predictive accuracy of 5 distinct regression models (Lasso, Ridge, Linear, Gradient Boosting, Bagging) against a shared dataset to compare linear and ensemble property valuation methods.",
      "Built a comprehensive data preprocessing and visualization pipeline utilizing pandas, NumPy, and matplotlib, executing rigorous categorical encoding and distribution analysis to ensure unbiased model selection.",
    ],
    skillIds: ["skl_python", "skl_sklearn", "skl_pandas", "skl_ml_security"],
    links: [],
    status: "archived",
    date: { start: { year: 2020, month: 6 }, end: { year: 2020, month: 8 } },
    context: { kind: "personal" },
    phaseId: "phase_undergrad",
    featured: false,
    order: 11,
    visibility: "public",
  },
  {
    id: "prj_line_follower",
    slug: "line-follower-bot",
    title: "Line Follower Bot",
    summary:
      "An autonomous, Arduino-powered line-following robot engineered with dynamically tuned IR sensors to adapt to unpredictable competitive environments.",
    body: `Developed for the Mindspark robotics competition, this autonomous line-following robot utilizes an Arduino Nano and a Cytron 7-bit IR sensor array. The core engineering challenge lay in real-world adaptability: programming a C-based control loop and dynamically tuning sensor thresholds to ensure flawless tracking across varying surface frictions and unpredictable competition lighting.`,
    highlights: [
      "Built an autonomous line-following robot for a competitive environment, integrating a Cytron 7-bit IR sensor array with an Arduino Nano using a custom C-based control loop.",
      "Maximized tracking reliability across unpredictable track conditions by tuning sensor thresholds, ensuring the hardware performed flawlessly outside of controlled practice environments.",
    ],
    skillIds: ["skl_atmega", "skl_c_cpp"],
    links: [],
    status: "archived",
    date: { start: { year: 2018, month: 8 }, end: { year: 2018, month: 12 } },
    context: { kind: "personal" },
    phaseId: "phase_undergrad",
    featured: false,
    order: 12,
    visibility: "public",
  },
];
