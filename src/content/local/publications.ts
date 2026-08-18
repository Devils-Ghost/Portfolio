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
    links: [],
    relatedProjectIds: ["prj_smart_society"],
    skillIds: ["skl_atmega", "skl_java", "skl_react", "skl_firebase"],
    featured: true,
    order: 1,
  },
];
