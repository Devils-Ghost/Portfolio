import type { SiteContent } from "../types";

export const site: SiteContent = {
  hero: {
    // Two genuinely different framings — see CONTENT_DECISIONS.md §B.
    headlines: [
      "I break systems to learn how to build them better.",
      "Most bugs aren't where anyone is looking.",
    ],
    roleLines: [
      "> Software Engineer  |  > Systems & Security",
      "> Reverse Engineering  |  > Secure Architecture",
    ],
    statuses: [
      "Open to Software & Security Engineering roles",
      "Researching LLM-assisted vulnerability discovery in binaries",
      "Building and shipping independent projects",
    ],
    resumeUrl: "/resume",
  },

  about: {
    greeting: "Hello, World!",

    // Home page card — kept close to the version you approved, with the
    // financial-infrastructure specifics sharpened.
    short:
      "I'm Dhaval — a software engineer who spent three years keeping financial systems running at 99.9% availability, then went back to school to understand what was happening underneath them. Now I work at the intersection: building software with a security engineer's instincts, and taking things apart to find out what they actually do rather than what the design document says.",

    // /about page opener
    long:
      "I'm a software engineer with three years building high-availability backend systems in finance, and a Master's in Computer Engineering from Arizona State University specialising in systems and security.\n\nAt UBS I worked across the full lifecycle on financial applications carrying a 99.9% availability SLA — Java and Spring Boot backends, but also the DevOps pipelines, the Unix infrastructure, and the Azure migration. I was usually one of the people pulled into production incidents. What I came to like about that wasn't the firefighting. It was that incidents are where you find out what your system actually does, as opposed to what the design doc says it does.\n\nThat gap is what pulled me toward the Master's. I wanted to understand the layers underneath the application — memory, the kernel, how things really fail. I spent a year as a teaching assistant for ASU's software security course, writing exploitation challenges and hardening the environment 150 students used to run attack code.\n\nWhat I want now is to work on harder systems problems: the kind where the challenge is how something holds up, not just whether it works.",

    journey: [
      {
        heading: "Where it started",
        body: "Competition robotics, before I wrote anything that ran on a server. A four-legged walker driven by servos, a line follower built around an IR array, an optical encoder for measuring speed. What robotics teaches that coursework cannot is that a broken machine doesn't throw an exception — it just sits there, and you reason backwards from physical behaviour to cause. Learning to debug something with no stack trace turned out to be the most transferable thing I took from those years.",
      },
      {
        heading: "Three years in finance",
        body: "I joined UBS as a graduate engineer and left as the person the team routed ambiguous problems to. The work spanned backend Java and Spring Boot, GitLab pipelines, Unix servers, and a cloud migration — under a 99.9% availability SLA, on applications other enterprise teams consumed through APIs.\n\nThe pattern I noticed in myself was a stubbornness about layers. A year of intermittent 500s that turned out to be a stale in-memory object. Six months of deployment failures that were never in the application code at all. Both were found the same way: by refusing to accept that a problem lives where it surfaces.",
      },
      {
        heading: "The turn toward security",
        body: "Three years of building on top of infrastructure and mostly treating it as a black box that worked. The Master's ruined that in a useful way.\n\nOnce you've spent a year on memory corruption, reverse engineering and sandbox escapes, a lot of sentences you used to read past stop sounding routine. The abstraction is not the system. There is always another layer down, and it is often where the answer is — which is the same instinct that found those two production bugs, applied one level deeper.",
      },
      {
        heading: "Teaching it",
        body: "As a TA for ASU's software security course I built exploitation challenges and the hardened environment they ran in — Docker containers constrained with landrun, services proxied to sandboxed ports, integrity detection layered on top of prevention.\n\nThe part I didn't expect to care about was the teaching. The default move when a student is stuck is to show them a working solution; I stopped doing it and started debugging their broken code with them instead. Much slower, and the only version where anything transfers. The class average moved from below 60% to around 80%.",
      },
      {
        heading: "What I'm doing now",
        body: "Volunteering on research evaluating how reliably language models find vulnerabilities in compiled binaries through decompiler tooling — partly because it's interesting, partly because the intended users are reverse engineers and bug hunters, who have a very low tolerance for tools that are usually right.\n\nAnd building things. This site is one of them. Nothing glamorous — just the habit of putting things on the internet and keeping them running.",
      },
    ],
  },

  socials: [
    {
      kind: "linkedin",
      url: "https://www.linkedin.com/in/dhaval-tanna-604762159/",
      label: "LinkedIn",
    },
    { kind: "github", url: "https://github.com/Devils-Ghost", label: "GitHub" },
    { kind: "email", url: "mailto:dtanna2@asu.edu", label: "Email" },
  ],

  availability: {
    open: true,
    label: "Open to Software & Security Engineering roles",
    location: "Tempe, AZ",
  },

  seo: {
    title: "Dhaval Tanna — Software & Security Engineer",
    description:
      "Software engineer with three years building high-availability financial systems and a Master's in systems security. Reverse engineering, secure architecture, and the layer underneath the application.",
  },
};
