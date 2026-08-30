import type { Publication } from "../types";

export const publications: Publication[] = [
  {
    id: "pub_smart_society",
    slug: "iot-based-smart-society",
    title: "Internet of Things Based Smart Society",
    venue: "IJARIIT, Volume 7, Issue 2",
    authors: [
      "D. Tanna",
      "R. Bhokarikar",
      "A. Rode",
      "A. Rathod",
      "N. N. Sakhare",
    ],
    date: { year: 2021, month: 4 },
    summary:
      "An automated disaster detection and notification system on constrained hardware, benchmarked at a 47% reduction in emergency response delay.",
    links: [
      {
        kind: "paper",
        url: "https://www.ijariit.com/manuscript/internet-of-things-based-smart-society/",
        label: "Published paper",
      },
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
    ],
    relatedProjectIds: ["prj_smart_society"],
    skillIds: [
      "skl_atmega",
      "skl_java",
      "skl_react",
      "skl_firebase",
      "skl_system_design",
      "skl_c_cpp",
    ],
    featured: true,
    order: 1,
  },
];
