import type { Project } from "../types";

export const projects: Project[] = [
  {
    id: "prj_ldp_analysis",
    slug: "local-differential-privacy-attack-analysis",
    title: "Attacking Local Differential Privacy",
    summary:
      "Derived the Maximum-Gain Attack against three LDP frequency-estimation protocols and quantified where the privacy–security tradeoff breaks.",
    body: `Local Differential Privacy promises something appealing: each user perturbs their own data before it ever leaves their device, so the aggregator learns useful statistics without learning individuals. The guarantee is mathematical, which makes it easy to trust and easy to misread.

The thing the guarantee does *not* cover is data poisoning. LDP protects users from the aggregator. It says nothing about protecting the aggregator from users — and a protocol that accepts perturbed input by design cannot easily tell noise from a lie.

I analysed three frequency-estimation protocols under one framework — k-ary Randomised Response, Optimised Unary Encoding, and Optimised Local Hashing — and derived the Maximum-Gain Attack mathematically for each, measuring how attacker gain scales against the fraction of injected fake users.

**The uncomfortable result.** The privacy budget works against you. Lowering ε — which is what you do when you want *stronger* privacy — causes attack gains to grow asymptotically. The protocol configuration that best protects the individual is the one most vulnerable to a poisoning adversary. Those two goals are not merely in tension; under this attack they are directly opposed.

**The useful result.** Optimised Local Hashing holds up best, maintaining stable gains independent of domain size. That independence is the property that matters in deployment, where you rarely control how large the domain gets.

The takeaway I carry from this is broader than LDP. A security proof is a statement about a specific threat model, and the failure mode is almost never that the proof was wrong — it is that the threat model quietly excluded the adversary you actually have.`,
    highlights: [
      "Unified analysis of kRR, OUE and OLH under a single attack framework",
      "Mathematically derived the Maximum-Gain Attack and its scaling against injected fake users",
      "Proved asymptotic growth of attack gain as the privacy budget tightens",
      "Identified OLH as the protocol with gains independent of domain size",
    ],
    skillIds: [
      "skl_privacy",
      "skl_cryptography",
      "skl_python",
      "skl_threat_modeling",
      "skl_ml_security",
    ],
    links: [],
    status: "shipped",
    date: { start: { year: 2025, month: 8 }, end: { year: 2025, month: 12 } },
    context: { kind: "academic", experienceId: "exp_asu_ta" },
    featured: true,
    order: 1,
    visibility: "public",
  },
  {
    id: "prj_chain_of_custody",
    slug: "blockchain-chain-of-custody",
    title: "Blockchain Chain of Custody",
    summary:
      "A permissioned-blockchain evidence lifecycle system giving forensic artifacts a tamper-evident audit trail across multiple legal organisations.",
    body: `Digital evidence has a paperwork problem. A forensic artifact passes through investigators, analysts, prosecutors and defence — and its admissibility depends less on the artifact than on whether you can prove nobody could have altered it in transit. That proof is traditionally a signed form, and a signed form is exactly as trustworthy as the organisation holding the pen.

This is a genuinely good fit for a permissioned blockchain, which is a sentence I do not enjoy writing. The requirements line up: multiple organisations that must cooperate but should not have to trust each other, an append-only history, and no single party who gets to be the authority.

**What it does.** Built on Hyperledger Fabric with Go smart contracts and CouchDB as the state database, containerised with Docker. Every custody event — acquisition, transfer, analysis, release — is a chaincode transaction. The full lifecycle of a disk or memory image is reconstructible after the fact, by any participant, without anyone's word for it.

**Immutability that survives the extraction step.** Sealing the evidence is only half the problem; artifacts extracted *from* it need the same treatment or the chain has a gap exactly where the analysis happens. A dual-write logging strategy captures extracted artifacts into the same tamper-evident trail as their source.

**Between organisations, not just within them.** All inter-organisational communication runs over TLS with the certificate infrastructure the Fabric network requires. Multi-org identity and channel configuration turned out to be the real work — the chaincode was straightforward by comparison.

What I took from it: "immutable ledger" is the easy half of an integrity system. The hard half is the boundary where data enters and leaves it, because that is where every real attack lives.`,
    highlights: [
      "Hyperledger Fabric network with Go chaincode and CouchDB state, fully containerised",
      "Complete custody lifecycle tracking for forensic disk and memory artifacts",
      "Dual-write logging so extracted artifacts inherit the same tamper-evident trail",
      "TLS-secured communication across a multi-organisational network",
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
    links: [],
    status: "shipped",
    date: { start: { year: 2025, month: 8 }, end: { year: 2025, month: 12 } },
    context: { kind: "academic" },
    featured: true,
    order: 2,
    visibility: "public",
  },
  {
    id: "prj_ids",
    slug: "multi-class-intrusion-detection",
    title: "Multi-Class Intrusion Detection",
    summary:
      "A classifier that identifies which attack is happening, not just that one is — 99.7% accuracy across 40 attack types on NSL-KDD and CIC-IDS2017.",
    body: `Most machine learning work on intrusion detection answers a binary question: is this traffic malicious? That is the wrong question if you want to *respond*. Knowing an intrusion is underway tells a defender to look; knowing it is a probe rather than a denial-of-service tells them what to do. The gap between detection and prevention is the gap between those two answers.

So the target was multi-class classification across the 40 distinct attack types in the NSL-KDD and CIC-IDS2017 datasets, using Random Forest and Gradient Boosting.

**The real problem was not the model.** It was class imbalance, and it is the problem in this entire domain. Common attacks have abundant data. The rare ones — which are the ones you most want to catch, because rarity often means targeted — have so few samples that the model learns to ignore them. Optimising for overall accuracy actively rewards that behaviour, which makes the headline metric a trap.

**What worked.** Fifteen of the forty types had enough data to learn as distinct classes. The remaining twenty-five were too sparse, so rather than dropping them — which is what most pipelines quietly do — they went into a sixteenth class, "Other". Sixteen output classes covering all forty attack types, with the rare ones still detected as anomalous even where the model can't name them. Then hyperparameter tuning, standardised features, and dimensionality reduction via recursive feature elimination — with tree depth capped deliberately, because an unconstrained forest on this data memorises rather than generalises.

**Result.** 99.7% accuracy across sixteen classes covering all forty attack types, 25% less training time, and a 15% improvement in rare-threat detection — which is the number I actually care about, because it is the one that moves when the preprocessing is right rather than when the model is bigger.`,
    highlights: [
      "99.7% accuracy across 40 attack types on NSL-KDD and CIC-IDS2017",
      "25% reduction in training time through hyperparameter tuning and constrained tree depth",
      "15% improvement in rare-threat detection by folding 25 sparse attack types into a sixteenth class rather than discarding them",
      "Recursive feature elimination and StandardScaler normalisation in the preprocessing pipeline",
    ],
    skillIds: [
      "skl_ml_security",
      "skl_python",
      "skl_sklearn",
      "skl_pandas",
      "skl_network_security",
    ],
    links: [],
    status: "shipped",
    date: { start: { year: 2024, month: 8 }, end: { year: 2024, month: 12 } },
    context: { kind: "academic" },
    featured: true,
    order: 3,
    visibility: "public",
  },
  {
    id: "prj_cloud_poc",
    slug: "containerised-migration-proof-of-concept",
    title: "Containerised Migration — Proof of Concept",
    summary:
      "A benchmarked design for moving an on-prem financial application to containers and serverless. Approved, then overtaken by an enterprise vendor decision.",
    body: `One of the financial applications I managed ran across multiple on-premises servers — one for the web app, one for the backend microservices, one for the batch jobs. Most were underutilised, and each carried its own patching and provisioning burden. The technical debt was not any single server; it was that the architecture assumed a server per concern.

My team was evaluating cloud providers, so I built a proof of concept to benchmark what a containerised architecture would actually give us, rather than assuming.

**The design.** Rather than lifting the monolith onto virtual machines, I decoupled it. Web application and Spring Boot microservice containerised with Docker and orchestrated on a Kubernetes cluster, with resource requests and limits defined and a horizontal pod autoscaler watching CPU utilisation. Readiness probes so the router only sent traffic to a pod once its Spring context and database connections were actually up — the failure mode otherwise is a pod that is running but not ready, which looks like an intermittent error to everyone downstream.

A single shared application load balancer with path-based ingress routing rather than one per service, because the point of the exercise was reducing waste, not relocating it.

**The batch jobs were the interesting decision.** They were short-lived and event-driven, and I verified they completed well inside fifteen minutes. A persistent container is the wrong unit for a workload like that — you pay for idle time to host something that runs for ninety seconds. They went to serverless functions instead, invoked by the existing on-premises scheduler so the change did not require the rest of the enterprise to move with us.

**What happened.** I presented the PoC with benchmark data on idle compute and patching overhead. The design and the migration were approved.

The production migration then went to Azure instead, because of enterprise vendor contracts — a decision made well above this work. What eventually shipped was a phased lift-and-shift to Azure VMs, which I led.

**Being precise about what this is.** This was a proof of concept that I designed, built and benchmarked. It was not operated in production at scale, and I would rather say that plainly than let a résumé bullet imply otherwise. The design reasoning is real and I can defend every choice in it. The operational scar tissue that comes from running something for a year is not there, and those are different things.`,
    highlights: [
      "Decoupled architecture benchmarked against the existing on-prem estate",
      "Horizontal pod autoscaling with explicit resource requests, limits and readiness probes",
      "Single shared load balancer with path-based ingress rather than one per service",
      "Batch jobs moved to serverless after verifying sub-15-minute runtimes, invoked from the existing scheduler",
    ],
    skillIds: [
      "skl_kubernetes",
      "skl_aws",
      "skl_docker",
      "skl_spring_boot",
      "skl_java",
      "skl_cloud_migration",
      "skl_system_design",
      "skl_autosys",
    ],
    links: [],
    status: "archived",
    date: { start: { year: 2022, month: 6 }, end: { year: 2022, month: 10 } },
    context: { kind: "professional", experienceId: "exp_ubs_swe" },
    featured: false,
    order: 4,
    visibility: "public",
  },
  {
    id: "prj_portfolio",
    slug: "this-portfolio",
    title: "This Site",
    summary:
      "A content-driven portfolio on Next.js 16 with a custom CMS, a typed content graph, and an experimental 3D experience corridor.",
    body: `The site you are reading. It is here because building it was more interesting than filling in a template, and because a portfolio that cannot be updated without a deploy is a portfolio that stops being true.

**The graph, not the pages.** Every skill, project, role, award and story is a typed entity with a stable ID. Skills are referenced by ID and never by name, so the relationships between them are guaranteed rather than maintained by hand. Click a skill and it tells you honestly where it was used — because that answer is computed from the same data, not written twice.

**The architecture.** Next.js 16 App Router with React 19, server-rendered by default so the content is real HTML rather than a JavaScript shell. Content sits behind a repository interface with two implementations — local TypeScript modules and Firestore — which meant the entire restructure happened offline before a database existed. Zod validates at the boundary, because Firestore has no schema and a typo should fail loudly.

**The CMS.** A custom admin panel rather than a hosted one: auth-gated CRUD, drag-to-order featured content, draft/publish, and Next 16's cache tags so a save is live within seconds.

**What's next.** An experimental 3D corridor for the experience timeline — a scroll-driven camera flight past doors representing each chapter. Built as a toggle over a conventional timeline that is never removed, because a canvas contains no text and my work history should be readable by a crawler and a screen reader.

Every animation here is one-shot on entry and honours reduced-motion. That constraint is the whole design brief: cinematic, but never in the way of reading.`,
    highlights: [
      "Typed content graph with ID-referenced relationships and computed reverse lookups",
      "Repository pattern with local and Firestore implementations behind one interface",
      "Custom auth-gated CMS with on-demand cache invalidation",
      "Server-rendered by default; reduced-motion honoured throughout",
    ],
    skillIds: [
      "skl_typescript",
      "skl_nextjs",
      "skl_react",
      "skl_firebase",
      "skl_system_design",
    ],
    links: [
      { kind: "live", url: "https://dhaval-tanna.eternalglitch.com", label: "Live site" },
    ],
    status: "in-progress",
    date: { start: { year: 2026, month: 6 }, end: null },
    context: { kind: "personal" },
    featured: false,
    order: 5,
    visibility: "public",
  },
  {
    id: "prj_smart_society",
    slug: "iot-smart-society",
    title: "IoT Smart Society",
    summary:
      "An automated disaster detection system on constrained hardware — published research showing a 47% reduction in emergency reporting delay.",
    body: `Emergency response has a bottleneck that is not technological: a human has to notice, decide it is serious, and call someone. That sequence is where the minutes go.

The system detects hazards — fire, flood, gas — across a residential society using six environmental sensors on an ATmega16 microcontroller, and removes the human from the reporting step entirely.

**The interesting constraint was the free tier.** ThingSpeak's free account rate-limits ingestion to one update every fifteen seconds. Six sensors reporting independently would have blown that immediately. So the microcontroller aggregates all six readings into a single batched payload transmitted exactly on the fifteen-second boundary — which turns the rate limit from a problem into the system's clock.

**The pipeline.** ThingSpeak triggers a Java service that ingests the payload and writes to a Firebase realtime database, which pushes notifications to a React web application and an Android app simultaneously.

**Validating it honestly.** A system like this is easy to claim and hard to prove. We ran manual disaster simulations, recorded automated detection times, and cross-referenced against published statistics on human reporting delay — which gave a defensible 47% reduction in overall response delay rather than a number pulled from a demo. The architecture and benchmarks were published in IJARIIT.

Undergraduate work, and still the project I point at when someone asks what I did before the security turn. It has the shape of everything I have built since: a constraint that looks like a limitation, treated as a design input.`,
    highlights: [
      "Six-sensor aggregation into batched payloads to work within a 15-second API rate limit",
      "Full telemetry pipeline: ATmega16 → ThingSpeak → Java service → Firebase → React and Android clients",
      "47% reduction in emergency response delay, validated against published human-reporting statistics",
      "Published in IJARIIT, Volume 7 Issue 2",
    ],
    skillIds: [
      "skl_atmega",
      "skl_java",
      "skl_react",
      "skl_firebase",
      "skl_system_design",
      "skl_c_cpp",
    ],
    links: [],
    status: "shipped",
    date: { start: { year: 2020, month: 8 }, end: { year: 2021, month: 4 } },
    context: { kind: "academic" },
    featured: false,
    order: 6,
    visibility: "public",
  },
  {
    id: "prj_burger_builder",
    slug: "burger-builder",
    title: "Burger Builder",
    summary:
      "A React single-page application with centralised state and Firebase-backed auth and order persistence. Still live, still running itself.",
    body: `An order customisation SPA — pick ingredients, watch the price and the burger update, check out, track the order.

Built to learn React properly rather than to solve a problem. Centralised state in a Redux store with a modular component architecture, which cut redundant re-renders substantially; Firebase Authentication and Realtime Database for identity and persistent order history; deployed via Firebase Hosting.

I keep it listed because it is where the front-end half of my skill set started, and because the state-management lesson — that most re-render problems are actually state-ownership problems — is one I still apply.

It has been live and working since 2020 with no maintenance. Not because it is impressive, but because it turns out a static front end on managed hosting genuinely does just keep running, which is a useful thing to have learned early.`,
    highlights: [
      "Centralised Redux store with modular components, reducing re-renders by ~37%",
      "Firebase Authentication and Realtime Database for identity and order persistence",
      "Production build deployed on Firebase Hosting",
    ],
    skillIds: ["skl_react", "skl_javascript", "skl_redux", "skl_firebase"],
    links: [],
    status: "shipped",
    date: { start: { year: 2020, month: 9 }, end: { year: 2020, month: 12 } },
    context: { kind: "personal" },
    featured: false,
    order: 7,
    visibility: "public",
  },
  {
    id: "prj_house_price",
    slug: "house-price-estimator",
    title: "House Price Estimator",
    summary:
      "A comparison of linear and ensemble regression models for property valuation from constructional and demographic features.",
    body: `A regression problem used as an excuse to work through the model-selection question properly: Lasso, Ridge and plain linear regression against Gradient Boosting and a Bagging regressor, on the same carefully preprocessed dataset.

Most of the work was not modelling. It was preprocessing and visualisation in pandas, NumPy and matplotlib — handling missing values, encoding categoricals, and looking at distributions before assuming anything about them.

The lesson that stuck: the gap between a well-preprocessed simple model and a poorly-preprocessed complex one is larger than the gap between model families. That has been true in every ML project I have done since, including the intrusion detection work.`,
    highlights: [],
    skillIds: ["skl_python", "skl_sklearn", "skl_pandas", "skl_ml_security"],
    links: [],
    status: "archived",
    date: { start: { year: 2020, month: 6 }, end: { year: 2020, month: 8 } },
    context: { kind: "personal" },
    featured: false,
    order: 8,
    visibility: "public",
  },
  {
    id: "prj_line_follower",
    slug: "line-follower-bot",
    title: "Line Follower Bot",
    summary:
      "A competition line-following robot built on Arduino Nano with a 7-bit IR sensor array.",
    body: `Built for the Mindspark competition: a Cytron 7-bit IR sensor array feeding a control loop written in C on an Arduino Nano.

The instructive part was tuning. A line follower that works on the practice track under fluorescent light does not necessarily work on the competition floor, and the sensor thresholds turn out to be the whole game. First real encounter with the idea that a system's behaviour is a property of its environment, not just its code.`,
    highlights: [],
    skillIds: ["skl_atmega", "skl_c_cpp"],
    links: [],
    status: "archived",
    date: { start: { year: 2018, month: 8 }, end: { year: 2018, month: 12 } },
    context: { kind: "personal" },
    featured: false,
    order: 9,
    visibility: "public",
  },
];
