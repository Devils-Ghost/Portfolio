import type { Award } from "../types";

export const awards: Award[] = [
  {
    id: "awd_great_contribution",
    slug: "great-contribution-award",
    title: "Great Contribution Award",
    issuer: "UBS",
    date: { year: 2022, month: 4 },
    summary: "For resolving a major production outage in record time.",
    body: `Awarded to the team for resolving a certificate-related authentication outage that had blocked customer access and couldn't be rolled back.

The fast fix available on the day would have meant permanently downgrading encryption. We migrated a legacy integration to REST in two days instead, which retired the tech debt that caused the outage.`,
    sourceExperienceId: "exp_ubs_swe",
    storyId: "story_cipher_suite",
    skillIds: [
      "skl_ssl_tls",
      "skl_incident_response",
      "skl_microservices",
      "skl_rest_soap",
      "skl_java",
      "skl_spring_boot",
      "skl_network_security",
    ],
    iconName: "trophy",
    featured: true,
    order: 1,
    visibility: "public",
  },
  {
    id: "awd_engineering_excellence",
    slug: "engineering-excellence-award",
    title: "Engineering Excellence Award",
    issuer: "UBS",
    date: { year: 2022, month: 8 },
    summary:
      "For a first year's work out of university — including a Sev-1 recovery, and an architecture that was innovative, functional, and ultimately scrapped.",
    body: `This is the award I find most interesting.

It covered my first year at UBS, straight out of university, but two pieces of work pushed it over the line.

The first was the certificate outage — a Sev-1 that couldn't be rolled back, resolved by migrating a legacy integration to REST in two days rather than downgrading encryption.

The second never shipped. We were decoupling a Spring Web MVC monolith into React and Spring Boot under a constraint that the load balancer mappings couldn't change, which forced an inverted architecture: the backend as entry point, routing traffic back up to the front end. Nobody builds this. I built it, with custom interceptors arbitrating between the React router and the Spring router, and it passed every functional test.

Then performance testing showed the extra network hop per request blew our response-time SLA, and the project was scrapped.

It wasn't right. But the way we made it work was genuinely novel, and that's what the award was for.`,
    sourceExperienceId: "exp_ubs_swe",
    storyId: "story_reverse_routing",
    skillIds: [
      "skl_spring_boot",
      "skl_react",
      "skl_java",
      "skl_jsp",
      "skl_microservices",
      "skl_perf_optimization",
      "skl_system_design",
      "skl_ssl_tls",
    ],
    iconName: "award",
    featured: true,
    order: 2,
    visibility: "public",
  },
  {
    id: "awd_cdio_champion",
    slug: "cdio-champion-award",
    title: "CDIO Champion Award",
    issuer: "UBS",
    date: { year: 2022, month: 11 }, // ⚠️ "late 2022" — narrow if you can
    summary:
      "For leadership and coordination across cultural activities, celebrations and sports tournaments.",
    body: `Awarded for leadership across the departmental cultural committees — budget management, logistics, and running events from planning through execution.

The cross-team relationships this built are a direct reason later multi-team releases went smoothly. When a batch migration depended on six enterprise teams aligning perfectly, most of those teams were already people I'd organised a cricket tournament with.`,
    sourceExperienceId: "exp_ubs_swe",
    skillIds: ["skl_mentorship"],
    iconName: "handshake",
    featured: true,
    order: 3,
    visibility: "public",
  },
  {
    id: "awd_above_beyond",
    slug: "going-above-and-beyond-award",
    title: "Going Above and Beyond Award",
    issuer: "UBS",
    date: { year: 2024, month: 4 },
    summary:
      "For cloud migration delivery, remediation of critical compliance findings, and a file-transfer platform migration onto tooling learned from scratch.",
    body: `The citation covers about eighteen months of work that mostly was not on my ticket board.

Remediating critical compliance findings across a set of planning applications, coordinating with stakeholders and support teams who did not report to each other and had no shared deadline. Migrating two batch applications to the cloud, which meant a run of weekend release windows because batch cutovers do not get to happen during business hours. Migrating enterprise file transfers from Tumbleweed to Axway — a platform I had not used, learned under delivery pressure. And refactoring one of the applications for roughly a 40% performance improvement.

The thread through all of it is scope. Almost none of this was assigned. It was the set of things that were quietly broken, or owned by nobody, or owned by somebody who had moved on — and where the number of teams affected made "not mine" a bad answer.

That instinct is also the one I have had to learn to manage. Picking up orphaned problems is useful right up to the point where it means setting your own priorities unilaterally, and I have stepped over that line before. What changed is the front of the reflex, not the reflex: I surface it to whoever owns it first, and let them make the call.`,
    sourceExperienceId: "exp_ubs_swe",
    storyId: "story_halted_the_vendor",
    skillIds: [
      "skl_cloud_migration",
      "skl_azure",
      "skl_linux",
      "skl_perf_optimization",
      "skl_cicd",
      "skl_autosys",
      "skl_java",
      "skl_spring_boot",
      "skl_microservices",
      "skl_agile",
    ],
    iconName: "zap",
    featured: true,
    order: 4,
    visibility: "public",
  },
  {
    id: "awd_promotion_ao",
    slug: "authorized-officer-promotion",
    title: "Promotion to Authorized Officer",
    issuer: "UBS",
    date: { year: 2024, month: 2 },
    summary:
      "Corporate title promotion, following recognition as the team's SSL/TLS subject matter expert.",
    body: `Promoted following three years of delivery and recognition as the team's SSL/TLS subject matter expert.

The trajectory matters more to me than the title. I started as a graduate engineer who took four weeks on a task scoped for one, and had a supervisor with reasonable doubts about the hire. What changed was not effort — it was that the four weeks bought a foundation I never had to rebuild.`,
    sourceExperienceId: "exp_ubs_swe",
    storyId: "story_one_week_became_four",
    skillIds: [
      "skl_java",
      "skl_spring_boot",
      "skl_linux",
      "skl_cloud_migration",
      "skl_azure",
      "skl_incident_response",
      "skl_microservices",
      "skl_ssl_tls",
      "skl_system_design",
    ],
    iconName: "star",
    featured: false,
    order: 5,
    visibility: "public",
  },
  {
    id: "awd_iot_finalist",
    slug: "iot-challenge-finalist",
    title: "IoT Challenge Finalist",
    issuer: "i3indya Technologies",
    date: { year: 2019, month: 9 },
    rank: "Finalist",
    summary: "National IoT competition finalist.",
    sourceProjectIds: ["prj_smart_society"],
    skillIds: ["skl_atmega"],
    iconName: "flag",
    featured: false,
    order: 6,
    visibility: "public",
  },
];
