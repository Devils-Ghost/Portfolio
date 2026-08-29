import type { SiteContent } from "../types";

export const site: SiteContent = {
  hero: {
    // Two genuinely different framings — see CONTENT_DECISIONS.md §B.
    headlines: [
      "I break systems to learn how to build them better.",
      "Building scalable software. Breaking it to make it secure.",
    ],
    roleLines: [
      "> Software Engineer  |  > System Design & Security",
      "> Reverse Engineering  |  > Secure Architecture",
    ],
    statuses: [
      "Interviewing for Software & Security Engineering roles",
      "Researching LLM-assisted vulnerability discovery in binaries",
      "Building and shipping independent projects to sharpen the craft",
    ],
    resumeUrl: "/resume",
  },

  about: {
    greeting: "Hello, World!",

    // Home page card — kept close to the version you approved, with the
    // financial-infrastructure specifics sharpened.
    short:
      "Hi, I'm Dhaval. I'm a full-stack software engineer and systems architect who breaks systems to learn how to build them better. After years of engineering critical financial infrastructure, I approach complex challenges with a research mindset and a solid work ethic. At my core, I am a highly collaborative, innovative and curious soul driven to build and automate secure, scalable technology.",

    // /about page opener
    long:
      "I'm a software engineer with three years of experience building high-availability backend systems in finance, and a Master's in Computer Engineering from Arizona State University specializing in systems and security.\n\nAt UBS, I worked across the full development lifecycle of financial applications: Java and Spring Boot development, DevOps pipelines, Unix infrastructure, and the Azure migration of legacy systems. I was usually one of the people pulled into production incidents. The one thing I liked about that was how it revealed what a system actually does, as opposed to what the design doc says it does.\n\nThat gap is what pulled me toward my Master's. I wanted to understand the layers beneath the application: memory, the kernel, how things actually work, and how they fail. I spent a year as a teaching assistant for ASU's software security course, writing CTF-style exploitation challenges and building a secure, sandboxed exam environment for over 150 students to run attack code on.\n\nWhat I want now is to work on harder systems problems: the kind where the challenge is how something holds up under pressure, not just whether it works.",

    journey: [
      {
        heading: "Where it started",
        body: "I started programming journey in high school, and from those very first days, I knew it was the field I wanted to pursue. I began with C and C++, building everything from a simple \"Hello World\" program, to robots, to complete IoT and ML systems. I was fascinated by the idea of building something from scratch and watching it come to life. That passion led me to a degree in Computer Engineering, where I built on those early instincts with real depth in software development and system design.",
      },
      {
        heading: "Three years in finance",
        body: "After my bachelor's, I joined UBS as a software engineer. The first quarter was rough, but I found my footing and started contributing to high-availability backend systems. I encountered my first production incident where I achieved my first award as well as a taste of working overtime. Over the next three years, I worked across the full spectrum of enterprise software development. I built innovative solutions, optimized performance for applications that belonged to me as well as for applications that did not belong to me. I moved across different applications, earning multiple awards along the way, took ownership of the cloud migration of a legacy product, collaborated with multiple teams, and eventually managed a small migration team of my own. I earned unofficial recognition from the team and became known as its \"wild card\" contributor. By the end, I'd gone from a student developer to an enterprise engineer, someone who took responsibility and ownership, and worked toward something bigger than himself.",  
      },
      {
        heading: "The turn toward security",
        body: "During my time as a software engineer at UBS, I developed a deeper curiosity about how systems worked under the hood, and the ways a system could be broken in order to make it secure. I started reading books on penetration testing, and my interest just kept getting deeper, which drove me to pursue my Master's at Arizona State University, focused on systems and security. At ASU, though my major was Computer Engineering, I focused entirely on cybersecurity classes, starting small, learning about web and network security, reverse engineering, and simple buffer overflows, and working my way up to mastering the kernel, corrupting memory, and diving all the way down to microarchitecture exploitation, all through hands-on Capture-the-Flag (CTF) challenges. Though I was breaking (hacking) systems, what I really learned along the way was how something as simple as transistors and metal give rise to the systems we work on. One of the achievements I'm most proud of is taking the most difficult security class at ASU and completing it with an A+.",
      },
      {
        heading: "Teaching it",
        body: "As a wise man once said, \"The best way to learn is to teach.\" I worked as a Teaching Assistant for the graduate-level Software Security course (CSE 545), under Professor Erik Trikel (hats off to him), where I started building the very CTF challenges I used to break while learning. This time, instead of breaking the machines, I was making them secure. Building a secure exam environment was itself a defensive systems design course for me: building a restricted environment over a platform with limited flexibility, and securing it so students had only one attack surface and limited ability to access their homework. In fact, this experience made me question not just the correctness of a system, but its ability to hold up under load, when over 150 students tried to break it simultaneously. Today, in any project I build, scalability and security are part of the plan from the very beginning.",
      },
      {
        heading: "What I'm doing now",
        body: "I finished my Master's in May 2026 and walked into a slow market with a lot of uncertainty about how long the search would take. Open-ended waiting is a lot more difficult than solving a hard problem, since with a hard problem, you have your work cut out for you. So I decided early I wasn't going to go stale. I don't know yet how long it'll take to resolve. But I'd rather come out of it with more capability than I went in with, and that part is in my control. So I took on a research project with a professor at UGA, where I evaluate decompilers for their usefulness in helping LLMs independently detect vulnerabilities in binaries. I work on it partly because it's interesting, and partly because this research would directly benefit the community of reverse engineers and bug hunters. And I started building and shipping my own projects, learning current tech stacks by using them rather than reading about them. In fact, this portfolio was the first personal project I undertook to learn the latest enterprise frontend technologies.",
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
      "Software engineer with three years building high-availability financial systems and a Master's focused in systems security, reverse engineering and secure architecture.",
  },
};
