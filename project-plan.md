# Portfolio — Project Plan

**Owner:** Dhaval Tanna
**Repo state reviewed:** `src.zip` (55 files, Next.js App Router + TypeScript + Tailwind v4 + Framer Motion)
**Date:** August 2026 · **Revision 2** (incorporates `package.json`, resolved decisions, Awards + Soft Skills entities)

---

## 0. How to use this document

Sections 1–5 are **decisions**. Read them once, argue with me where you disagree, then treat them as settled — that's the whole point of writing them down now.

Sections 6–8 are **execution**. Work top to bottom. Every phase ends with a deployable site.

Section 10 lists the things I could not decide for you.

**This file stays a clean, forward-looking plan.** Checkboxes reflect current status; resolved decisions are stated in their settled form, not their revision history. Anything discovered, corrected, or superseded *while a phase was being executed* — corrections found mid-build, review-pass notes, "we changed our mind because X" — lives in the companion file `plan-progress.md` instead, tagged by phase. Read that file when you want the story of how a phase actually went; read this one when you want to know what's next.

**One rule for the whole project:** every phase must leave `main` deployable. The site is already public. A recruiter can land on it any day, including the day you're mid-refactor. Never break the homepage to build a feature.

---

## 1. What I found in the code

### 1.1 Stack (confirmed from `package.json`)

| Layer                 | Version                           | Note                                                             |
| --------------------- | --------------------------------- | ---------------------------------------------------------------- |
| Next.js               | **16.2.10**                       | App Router. **Next 16 changed the caching model** — see Phase 3. |
| React                 | **19.2.4**                        | Next 16 requires ≥19.2. You're compliant.                        |
| TypeScript            | ^5                                | `@/*` alias configured                                           |
| Tailwind CSS          | ^4 (`@tailwindcss/postcss`)       | v4 — theme lives in CSS via `@theme`                             |
| Framer Motion         | ^12.42.2                          | Current. See note below.                                         |
| lucide-react          | ^1.23.0                           |                                                                  |
| clsx + tailwind-merge | ^2.1.1 / ^3.6.0                   | `cn()`                                                           |
| ESLint                | ^9 + `eslint-config-next` 16.2.10 | Flat config. See note below.                                     |
| Hosting               | Vercel                            | `dhaval-tanna.eternalglitch.com`                                 |

**Two notes from the manifest:**

- **`framer-motion` → `motion` migration is optional, and I'd skip it.** The package was renamed (`motion`, importing from `motion/react`) but v12 is the same codebase under both names. You're on 12.42.2, which is current. Migrating is a dependency swap plus a find-replace on imports — do it only if you're already touching every animated file in Phase 0, and don't block on it. _(Resolves Q6.)_
- **Your lint script is bare `eslint`, not `next lint`** — correct, since Next 16 removed the `next lint` command. That means you need an `eslint.config.mjs` flat config. **Verify that `react-hooks/rules-of-hooks` is actually firing** — it ships inside `eslint-config-next`, but a flat config that doesn't spread it properly will silently lint nothing. Test it: the two violations in §1.3 ① should light up immediately. If they don't, your lint isn't running.

**Dependencies you'll add later:** `zod` (Phase 1), `firebase-admin` + `resend` (Phase 3), MDX renderer (Phase 5), `three` + `@react-three/fiber` + `@react-three/drei` + `@react-three/postprocessing` (Phase 6).

### 1.2 What is genuinely good — keep all of it

This is not politeness. These are real assets and the plan is built to preserve them.

- **The splash → navbar `layoutId="brand-name"` shared-element transition.** Confident, distinctive, and cheap. Most portfolios don't attempt this.
- **`ExperienceCard`'s bracket-reveal animation.** The `useMotionTemplate` feathered mask with the `[` `]` brackets swinging open is the single best piece of craft in the repo. It's a real technique, not a preset.
- **The pinned-corkboard `ProjectCard`** with the metallic pushpin and per-card `baseRotation`, straightening on hover.
- **`ProjectCard` already has a `variant: "pinned" | "grid"` split** with `baseRotation` and `style` force-disabled in grid mode. You wrote this anticipating the `/projects` page. That was the right instinct and it saves work later.
- **The scroll-linked entrance pattern** — driving all three project cards off one shared `cardsProgress` timeline instead of per-card visibility. Subtle, and it's why the section feels composed rather than twitchy.
- **`EngagementCard`'s flex-accordion** with the delayed opacity crossfade between spine and detail states.
- **Genuine mobile paths**, not just responsive squeeze — the Success Stories section has a real snap carousel with a scroll-progress indicator, and the navbar has a separate floating CTA.
- **The comments.** They explain _why_, including the reasoning behind the scroll offsets and the reduced-motion handling. Keep this habit.
- **Reduced-motion handling in `HeroSection`** and the deliberate hydration-safe random headline. Both show care most people skip.

The hero and About content are fine. I have two small notes in §7.1, take them or leave them.

### 1.3 The five things that will break

These are ordered by how badly they block the database work.

---

**① Hooks are called inside `.map()` — this is a hard React crash waiting for variable-length data.**

`SkillsSection.tsx` lines 38–39 and `ProjectsSection.tsx` lines 113–114:

```tsx
{skillsData.skills.list.map((skill, index) => {
  const opacity = useTransform(scrollYProgress, [start, end], [0, 1]);  // ← hook in a loop
  const scale   = useTransform(scrollYProgress, [start, end], [0.8, 1]);
  ...
})}
```

This works today **only because the arrays are constant-length literals**. React counts hooks per render and matches them positionally. The moment `skills` comes back from Firestore with 7 items instead of 8 — or the array is `[]` on first render and populated on the second — you get:

> `Rendered fewer hooks than expected. This may be caused by an accidental early return statement.`

The page will white-screen. Not degrade — white-screen.

**Fix:** the hook must move inside the child component, one call per component instance. `SkillPill` and `ProjectCard` each take a `progress` motion value plus their own `index`, and compute their own transform internally. Rules of Hooks satisfied because each component makes exactly one call per render.

```tsx
// SkillPill.tsx
function SkillPill({ skill, progress, index }: Props) {
  const start = 0.1 + index * 0.08;
  const opacity = useTransform(progress, [start, start + 0.2], [0, 1]); // ← one call, always
  const scale = useTransform(progress, [start, start + 0.2], [0.8, 1]);
  return <motion.button style={{ opacity, scale }}>{skill.name}</motion.button>;
}
```

**This must be fixed before any data-source work starts.** It is Phase 0, item 1.

---

**② Skills are free-text strings, so the feature you want in §1.3 of your brief is currently impossible.**

Right now:

```tsx
// data/skills.json — the home page pills
[
  "Python",
  "Java",
  "Typescript",
  "React",
  "Next.js",
  "Arch x86",
  "System Security",
  "Reverse Engineering",
][
  // ProjectsSection.tsx — what projects claim to use
  ("Python", "Scikit-Learn", "Pandas", "Network Security")
][("Go", "Hyperledger", "Blockchain", "Cryptography")][
  ("Next.js", "Python", "LLMs", "System Design")
];
```

Click "Reverse Engineering" and you'd get nothing — no project lists it. Click "Java" — nothing. Only "Python" and "Next.js" resolve, and only by accident. There is no shared vocabulary, no IDs, no way to guarantee the two lists stay in sync.

**Fix:** Skills become first-class entities with stable IDs. Projects, experiences, engagements and stories store `skillIds: string[]`. Nothing anywhere stores a skill _name_. The "This skill was used in:" modal becomes a trivial filter (§3.4). This single change is what makes your whole cross-linking idea work.

---

**③ Icons are stored as React components inside the data.**

```tsx
export interface EngagementData { icon: any; }   // ← lucide component
{ title: "DEF CON 32 CTF", icon: Flag, number: "01" }
```

A React component cannot be serialized. It cannot come out of Firestore, cannot cross a Server→Client Component boundary, cannot go in JSON. Also note `icon: any` — you've turned off type-checking on the one field that most needs it.

**Fix:** store `iconName: "flag"` as a string, resolve through a typed registry at render time:

```tsx
export const ICONS = {
  flag: Flag,
  trophy: Trophy,
  code: Code,
  star: Star,
  medal: Medal,
} as const;
export type IconName = keyof typeof ICONS; // now the admin panel can offer a dropdown
```

---

**④ Dates are display strings, so nothing can be sorted, filtered, or placed on a timeline.**

`"Jul 2021 - Jun 2024"`, `"Aug 2025 - Present"`, `"Jan 2023 - Dec 2023"` are all `string`. You cannot sort these. You cannot ask "what was I doing in 2024". Your `/experience` timeline — 3D or otherwise — needs chronological ordering as its **primary axis**, and it cannot have one.

**Fix:** `{ start: {year, month}, end: {year, month} | null }` where `null` means "Present". One `formatDateRange()` helper regenerates the display string. Month precision is enough — don't store days you'll never show.

---

**⑤ `ProjectCard` owns its own modal state, so nothing outside the card can open it.**

```tsx
const [isOpen, setIsOpen] = useState(false); // ← trapped inside the card
```

Your §1.3 flow is: click a skill pill → modal lists projects → click a project → **show that project's detail modal**. That second step requires opening a project modal from a context where no `ProjectCard` is mounted. Right now that's impossible without duplicating the modal markup.

There's a related symptom: `HireMeModal` is mounted **twice** — once in `Navbar`, once in `CallToAction` — with independent state. Two copies of the same form in the DOM.

**Fix:** one global modal layer driven by a `DetailTarget` union (§3.5), synced to a URL query param so modals are shareable and the back button closes them. `ProjectCard` becomes a pure presentational component that dispatches `open({kind:"project", id})`.

---

### 1.4 Smaller issues, worth a cleanup pass

| #   | Issue                                                                                                                                                                                                                                                                                                         | Why it matters                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 6   | **`https://github.com/yourusername/repo` is live in production** — twice, plus `https://your-live-link.com`, plus `mailto:your.email@example.com` in `UnderConstruction`                                                                                                                                      | A recruiter clicking "Source Code" hits a 404. Fix today, it's a 2-minute job.                                                                                                                                                                                                                                                                                                                                                                                                                     |
| 7   | **26 of 35 components are `"use client"`** — the entire homepage renders client-side                                                                                                                                                                                                                          | This made sense when you were targeting Firebase Hosting static export. Since you moved to Vercel, full SSR is available and free — so the constraint that justified this is gone. Google currently sees an empty shell on first pass. For a page whose _purpose_ is being found by recruiters, this is the highest-leverage SEO fix available.                                                                                                                                                    |
| 8   | **`globals.css` still has Next.js starter cruft**: `--font-geist-sans`/`--font-geist-mono` referenced but never defined; a light-mode `:root` and `prefers-color-scheme` block that are dead (html is hardcoded `dark`, body is `bg-black`); and a stray `body { font-family: Arial, Helvetica, sans-serif }` | Body text was always rendering in Inter — `next/font`'s CSS-module class (specificity 0,1,0) already beats the `body` element selector (0,0,1). Only `SplashScreen` was genuinely in Arial, via an inline style — the one thing that _could_ beat the class. Removing it is what makes the splash → navbar `layoutId` transition render in one typeface. |
| 9   | **Zero design tokens.** `#0a0f18` appears 9×, `#05080c` 3×, and `blue-500`/`blue-400`/`blue-900/30` are scattered across ~15 files                                                                                                                                                                            | You said future work follows the same theme. Right now "the theme" exists only as repeated literals. Changing the accent means touching every file. Extract to `@theme` first (Tailwind v4 does this in CSS) and the theme becomes enforceable.                                                                                                                                                                                                                                                    |
| 10  | **`Modal` has no Escape-to-close, no focus trap, no `role="dialog"`/`aria-modal`, and no focus restore**                                                                                                                                                                                                      | Escape-to-close is a baseline expectation. And modals are about to become the primary interaction of the entire site.                                                                                                                                                                                                                                                                                                                                                                              |
| 11  | **`Modal` writes `document.body.style.overflow` directly**                                                                                                                                                                                                                                                    | With two `HireMeModal`s mounted, closing one unlocks scroll for the other. Use a counter or a single modal host.                                                                                                                                                                                                                                                                                                                                                                                   |
| 12  | **Splash screen costs every visitor a hard 2s** — `isIntroDone` lives in `useState(false)` with no persistence, and `Navbar`/`Footer` don't render until it flips                                                                                                                                             | Fine on first visit; annoying on every refresh. Store a flag in `sessionStorage` and skip the splash on repeat visits within a session.                                                                                                                                                                                                                                                                                                                                                            |
| 13  | **No `loading.tsx`, `error.tsx`, `not-found.tsx`, `sitemap.ts`, `robots.ts`, or OpenGraph image**                                                                                                                                                                                                             | The OG image is the one that stings: every LinkedIn share of your portfolio currently renders as a grey box.                                                                                                                                                                                                                                                                                                                                                                                       |
| 14  | **`HireMeModal` form has no `name` attributes and calls `alert()`**                                                                                                                                                                                                                                           | Nothing to wire up yet — noted so it's not forgotten in Phase 3.                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| 15  | **Naming drift**: `src/container/HomePage/` (singular "container") vs `src/components/home/` (lowercase); `SuccessStoriesSection` imported as `BlogSection` in `page.tsx`                                                                                                                                     | Cheap to fix now, annoying at 3× the file count.                                                                                                                                                                                                                                                                                                                                                                                                                                                   |

---

## 2. Architecture decisions

Seven decisions. Each one exists to answer a specific thing you said you were worried about.

---

### D1 — A repository interface sits between components and the data source

**Every component reads content through one typed interface. No component ever imports Firebase.**

```ts
export interface ContentRepository {
  getSkills(): Promise<Skill[]>;
  getProjects(): Promise<Project[]>;
  getExperiences(): Promise<Experience[]>;
  getEngagements(): Promise<Engagement[]>;
  getStories(): Promise<Story[]>;
  getCertifications(): Promise<Certification[]>;
  getLifePhases(): Promise<LifePhase[]>;
  getSiteContent(): Promise<SiteContent>;
}
```

Two implementations: `LocalRepository` (reads typed TS modules in the repo) and `FirestoreRepository`. One env var picks which.

**Why this is the most important decision in the document:** it decouples "restructure the code" from "set up a database". You do the entire refactor in Phase 1 against local files — no Firebase account, no network, no async debugging, and you can see instantly whether the site still looks right. Then Phase 3 swaps one line. If Firestore turns out to be wrong, you swap it again for the cost of one file.

This directly answers _"a lot of the sections are not completely decided yet."_ Undecided sections change the data, not the architecture.

---

### D2 — The public site is static; only the admin panel talks to the database live

Your entire content set is **under 1 MB**. Maybe 20 projects, 10 experiences, 60 skills, 20 stories. That is small enough to load in full, once, and join in memory.

So: public pages are statically rendered. Admin writes call `revalidateTag("content")`, which regenerates the affected pages within seconds.

Consequences, all good:

- Visitors hit CDN HTML. Zero database reads, zero latency, perfect SEO.
- You will never approach Firestore's free daily read quota, no matter how much traffic you get.
- **The choice of database barely affects the public site.** Which means D3 is a low-stakes, reversible decision, not the fork in the road it feels like.

---

### D3 — Firestore, on the Spark (free) plan

Your instinct was right. Confirming it, with one correction you need to know about.

| Option                     | Verdict                                                                                                                                                                                                                                                                                                                                                               |
| -------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Firestore (Spark)** ✅   | <cite index="3-1">1 GiB storage, 50,000 reads/day, 20,000 writes/day, 10 GiB egress/month</cite> — you'll use a fraction of a percent. Auth is free to 50K MAU. **No payment method required.** <cite index="3-1">Spark is sufficient if you only use Firestore, Hosting and standard Authentication, and stays at guaranteed zero cost with no card required.</cite> |
| Realtime Database ❌       | Wrong tool. Designed for high-frequency sync; your data changes monthly. Firestore's querying is better for this shape.                                                                                                                                                                                                                                               |
| Supabase / Neon (Postgres) | Genuinely better _relational_ fit, but free projects pause on inactivity — friction every time you open the admin panel. Reconsider only if you outgrow Firestore's model.                                                                                                                                                                                            |
| Sanity / Contentful        | Would hand you a polished admin panel for free and delete Phase 4 entirely. Trade-off: you don't get to _build_ the admin panel — and building your own CMS is itself a portfolio artifact. Your call.                                                                                                                                                                |

> **⚠️ Correction to your plan — Firebase Storage is no longer free.**
> <cite index="3-1">Since February 3, 2026, Google aligned Cloud Storage for Firebase with standard Google Cloud Storage rules, which require a linked billing account to create a bucket, even while staying in the "Always Free" tier.</cite> <cite index="4-1">Projects on Spark with default buckets lose console access and API calls return 402/403 errors.</cite>
>
> **This does not block you.** Firestore and Auth are still fully free on Spark. Only _file uploads_ are affected, and you have ~20 images total. Put them in `/public/media/` committed to the repo — Vercel serves them from its CDN for free and `next/image` optimizes them. Only reach for a blob store (Vercel Blob or Cloudinary free tier) if the admin panel genuinely needs runtime upload. Verify current terms before you rely on any of it.

**Security model:** deny _all_ client access to Firestore. Every read and write goes through Next.js server code using the Admin SDK.

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} { allow read, write: if false; }
  }
}
```

The Firebase client SDK never enters your bundle. Nothing is exposed. Rules stay four lines instead of a growing pile you have to reason about at 1am.

---

### D4 — Server Components by default; `"use client"` only on animated leaves

Today: 26 of 35 files are client components, so the whole homepage is client-rendered.

Target: sections fetch and render on the server. The animated leaf (`SkillPill`, `ProjectCard`, `ExperienceCard`) is the client component. A section that only positions and styles doesn't need to be one.

Where a section needs `useScroll` on its own container, it stays client — but it receives content as **props from a server parent**, so the content is still in the initial HTML.

Payoff: Google and LinkedIn see real text. Your project titles become searchable. First paint gets faster.

---

### D5 — One modal system, URL-driven

A single `<DetailModalHost />` in the layout, reading from a `?d=` query param:

```
/?d=project:ai-intrusion-detection
/?d=skill:reverse-engineering
```

- Any component can open any modal — which is what §1.3 needs.
- **Modals become shareable.** You can send a recruiter a link straight to one project. This is a real advantage and almost nothing else does it.
- Browser back closes the modal, as users expect.
- Deep-linked modals are server-renderable, so they're crawlable too.

---

### D6 — Design tokens in `@theme`, extracted before any new UI is written

Tailwind v4 puts theme config in CSS, which you're already set up for:

```css
@theme {
  --color-surface: #0a0f18; /* card background — currently repeated 9× */
  --color-surface-deep: #05080c;
  --color-accent: oklch(0.62 0.19 255);
  --color-accent-soft: oklch(0.72 0.15 255);
  --radius-card: 1rem;
  --shadow-card: 0 20px 40px -15px rgb(0 0 0 / 0.7);
}
```

Then `bg-surface`, `border-accent/30`, `shadow-card` throughout. **Do this in Phase 0, before writing any new components** — otherwise every new page bakes in more literals and the theme drifts. This is what makes "follow the same theme" an enforceable rule rather than a hope.

---

### D7 — Content is validated at the boundary with Zod

Firestore has no schema. A typo in the admin panel silently produces `undefined` in production.

Every repository read parses through a Zod schema derived from the same types. Bad data fails loudly at the boundary, with a field name, instead of quietly rendering an empty card. Zod also generates the admin panel's form validation for free — one source of truth.

---

## 3. The content model

This is the part worth getting right. Everything else follows from it.

### 3.1 Primitives

```ts
export type ID = string; // stable, never reused, human-readable: "prj_ai_ids"
export type Slug = string; // URL-safe:                             "ai-intrusion-detection"

/** Month precision — you will never display a day. */
export interface DateMark {
  year: number;
  month: number;
} // month: 1–12

export interface DateRange {
  start: DateMark;
  end: DateMark | null; // null === "Present"
}

export type LinkKind =
  | "github" // source repository
  | "live" // deployed site / demo
  | "video" // YouTube demo, Loom walkthrough, conference talk
  | "report" // Google Doc / PDF project report
  | "paper" // published or preprint
  | "credential" // certification verification
  | "external"; // anything else

export interface ResourceLink {
  kind: LinkKind;
  url: string;
  label?: string; // overrides the default label for that kind
}

export type Visibility = "public" | "draft"; // draft = admin-only preview

export interface ImageRef {
  src: string;
  alt: string;
  width?: number;
  height?: number;
}
```

`ResourceLink[]` rather than `{github?, live?, doc?}` because you listed _"GitHub link, and/or a Google Doc report, and/or a live site"_ — and you've already added YouTube to that list. An array of tagged links absorbs the next one too, without a schema migration.

**On `"video"` specifically:** don't just render it as a button. When a project has a YouTube link, **embed the player inside the detail modal** (lazy-loaded `<iframe>`, or a thumbnail that swaps to the iframe on click so you don't pay YouTube's script cost on page load). A recruiter watching 40 seconds of your project running is worth more than every paragraph on the page. Detect it with `kind === "video"` and render a player instead of a link — one branch in `ProjectModalBody`.

### 3.2 Entities

```ts
// ─────────────── SKILL — the hub everything links to ───────────────
export type SkillCategory =
  "language" | "framework" | "platform" | "tool" | "domain" | "practice";
export type SkillLevel = "core" | "working" | "familiar";

export interface Skill {
  id: ID;
  slug: Slug;
  name: string;
  category: SkillCategory;
  level: SkillLevel;
  featured: boolean; // → appears in "Technical Arsenal" on the home page
  order: number;
  blurb?: string; // one line, shown at the top of the "used in" modal
  aliases?: string[]; // "TS", "TypeScript" → powers /about search
}

// ─────────────── PROJECT ───────────────
export type ProjectStatus = "shipped" | "in-progress" | "archived" | "concept";

export interface Project {
  id: ID;
  slug: Slug;
  title: string;
  summary: string; // card text, ≤ ~140 chars
  body: string; // long description, markdown
  highlights?: string[]; // optional bullets in the modal
  skillIds: ID[]; // ← the join. NEVER raw strings.
  links: ResourceLink[];
  status: ProjectStatus;
  date: DateRange;
  context?: {
    kind: "personal" | "academic" | "professional" | "hackathon";
    experienceId?: ID;
  };
  coverImage?: ImageRef;
  featured: boolean;
  order: number;
  visibility: Visibility;
}

// ─────────────── EXPERIENCE ───────────────
export type ExperienceType =
  | "full-time"
  | "internship"
  | "academic"
  | "research"
  | "volunteer"
  | "contract";
export type WorkMode = "onsite" | "hybrid" | "remote";

export interface Experience {
  id: ID;
  slug: Slug;
  role: string;
  org: string;
  orgUrl?: string;
  type: ExperienceType;
  mode?: WorkMode;
  location: string;
  date: DateRange;
  summary: string; // card text
  body: string; // long — this carries the weight where NDA blocks a link
  achievements?: string[];
  skillIds: ID[];
  links: ResourceLink[];
  phaseId: ID; // ← life phase: drives the 3D doors AND the flat timeline
  featured: boolean;
  order: number;
  visibility: Visibility;
}

// ─────────────── ENGAGEMENT — leadership & non-technical ───────────────
export type EngagementType =
  | "competition"
  | "hackathon"
  | "open-source"
  | "leadership"
  | "community"
  | "sport";

export interface Engagement {
  id: ID;
  slug: Slug;
  title: string;
  org: string;
  type: EngagementType;
  date: DateRange;
  summary: string;
  body?: string; // ← optional NOW so you can make these clickable LATER, no migration
  iconName: IconName;
  skillIds?: ID[];
  links?: ResourceLink[];
  phaseId?: ID;
  featured: boolean;
  order: number;
  visibility: Visibility;
}

// ─────────────── STORY — your STAR / success stories ───────────────
export interface Story {
  id: ID;
  slug: Slug;
  title: string;
  headline: string; // one sentence for the home-page card
  org?: string;
  type: string; // "Digital Forensics", "Leadership", …
  date: DateMark;
  star?: { situation: string; task: string; action: string; result: string };
  body: string; // full story, MDX
  relatedProjectIds?: ID[];
  relatedExperienceIds?: ID[];
  skillIds?: ID[];
  iconName: IconName;
  readingMinutes?: number;
  featured: boolean;
  order: number;
  visibility: Visibility;
}

// ─────────────── CERTIFICATION ───────────────
export interface Certification {
  id: ID;
  name: string;
  issuer: string;
  issued: DateMark;
  expires?: DateMark | null;
  credentialUrl?: string;
  credentialId?: string;
  skillIds?: ID[];
  featured: boolean;
  order: number;
}

// ─────────────── LIFE PHASE — the "doors" on the /experience corridor ───────────────
export interface LifePhase {
  id: ID;
  slug: Slug;
  label: string; // door text: "Bachelor's", "Master's", "UBS"
  subtitle?: string; // "Arizona State University"
  date: DateRange;
  order: number; // position along the corridor
  accent?: string; // hex, tints that door's glow
}

// ─────────────── AWARD — recognition, placements, honours ───────────────
export interface Award {
  id: ID;
  slug: Slug;
  title: string; // "4th Place — Tracer Fire 13"
  issuer: string; // "Sandia National Laboratories"
  date: DateMark;
  rank?: string; // "4th of 32" | "Finalist" | "Winner"
  summary: string; // one line for the card
  body?: string; // detail for the modal
  sourceExperienceId?: ID; // ← the job/degree it came out of
  sourceProjectIds?: ID[]; // ← the project(s) it was awarded for
  storyId?: ID; // ← the STAR story behind it, if written
  skillIds?: ID[];
  links?: ResourceLink[];
  iconName: IconName;
  featured: boolean;
  order: number;
  visibility: Visibility;
}

// ─────────────── SOFT SKILL — "Beyond the Code", now with evidence ───────────────
export interface SoftSkill {
  id: ID;
  slug: Slug;
  label: string; // "Crisis management and debugging under pressure"
  description?: string; // shown at the top of the evidence modal
  evidenceStoryIds?: ID[]; // ← STAR stories are the strongest evidence
  evidenceExperienceIds?: ID[];
  evidenceEngagementIds?: ID[];
  iconName?: IconName;
  featured: boolean;
  order: number;
}

// ─────────────── SITE SINGLETONS ───────────────
export interface SiteContent {
  hero: {
    headlines: string[];
    roleLines: string[];
    statuses: string[];
    resumeUrl?: string;
  };
  about: {
    greeting: string;
    short: string; // home-page card
    long: string; // /about intro
    journey: { heading: string; body: string }[]; // "What drives me", "My journey", …
  };
  // softSkills moved out of here — they're a linked entity now, not a string list
  socials: {
    kind: "github" | "linkedin" | "email" | "x" | "scholar";
    url: string;
    label: string;
  }[];
  availability: { open: boolean; label: string; location: string };
  seo: { title: string; description: string; ogImage?: string };
}

// ─────────────── CONTACT SUBMISSION — write-only from public ───────────────
export interface ContactSubmission {
  id: ID;
  name: string;
  company?: string;
  role?: string;
  contact: string;
  message: string;
  createdAt: string; // ISO 8601
  status: "new" | "read" | "replied" | "spam";
  meta?: { userAgent?: string; referer?: string };
}
```

### 3.2b Two new entities — where they came from and how they fit

**`Award` — your "Achievements & Awards" idea.** Good instinct, and it does something neither Skills nor Stories currently do: it gives a recruiter a scannable credibility strip. But it creates an overlap you need to resolve deliberately, because **two of your three current "Success Stories" are actually awards**: _"4th Place at Tracer Fire 13"_ and _"SME Recognition at UBS"_ are recognitions, not narratives.

The clean split:

|          | `Award`                                      | `Story`                                            |
| -------- | -------------------------------------------- | -------------------------------------------------- |
| Is       | **the fact** — what you won, from whom, when | **the narrative** — what happened and what you did |
| Length   | one line                                     | 500–1500 words, STAR-structured                    |
| Lives on | Home strip + `/experience`                   | `/blog`                                            |
| Answers  | _"has this person been recognised?"_         | _"how does this person think?"_                    |

Store the link **one direction only**: `Story.awardId` _(no — see below)_. Actually, store `Award.storyId`, because an award may exist without a story but a story about an award always has one. Compute the reverse. Same principle as skills: one source of truth, never two that can disagree.

So _"4th Place at Tracer Fire 13"_ becomes an **Award**, and when you write up the STAR version it becomes a **Story** that the award points at. Your Home page Success Stories section then features _narratives_ rather than trophies — which sharpens both sections instead of duplicating them.

**`SoftSkill` — linking "Beyond the Code" to engagements.** This is the best idea in your reply, and I'd push it one step further than you did.

You suggested linking soft skills → engagements. Link them to **stories** as well, and make stories the primary evidence. A STAR story about a production incident _is_ the proof of "crisis management and debugging under pressure" — that's literally what the format exists to demonstrate. So:

> Click **"Crisis management and debugging under pressure"**
> → _"Demonstrated in:"_ → [STAR story] · [UBS experience] · [DEF CON CTF]
> → click the story → read the full STAR write-up

That turns the weakest section on the page (four unfalsifiable adjectives, which every portfolio has) into the entry point for your strongest asset (17 pages of evidence, which almost none have). It also means your STAR document does double duty: it fills `/blog` **and** it backs the soft-skills claims.

Structurally it's free: `SoftSkillModal` is the same component as `SkillDetailModal` with a different source array. One evidence-modal pattern, two entry points.

### 3.3 Five modelling decisions worth defending

1. **`featured` + `order` on everything.** "Exactly 3" is enforced in the _query_ (`featured(items, N)`), never in the data. Flag five and the site quietly takes the top three by `order`; the admin panel warns you. You can never break the homepage by toggling a checkbox.

   **You asked whether 3 is the right number and whether the UI can handle variation.** I checked each section — only _one_ is actually locked:

   | Home section            | Current | Layout tolerance                                                                                                                       | Verdict                                                                                                                                                                 |
   | ----------------------- | ------- | -------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
   | Featured Work           | 3       | **Locked at 3.** Positions are hardcoded: `md:ml-[12%]`, `md:ml-[55%] md:-mt-52`, `md:ml-[32%] md:mt-3`. A 4th card has nowhere to go. | Keep 3. To unlock later, move the three offsets into a `POSITIONS` array and index with `index % 3` — then every group of 3 repeats the cluster down the page. ~20 min. |
   | Experience              | 3       | Plain vertical stack — any count                                                                                                       | Free to change                                                                                                                                                          |
   | Leadership & Engagement | 3       | Flex accordion, fixed-height row. 4 spines still read fine; 5 gets cramped on tablet                                                   | 3–4 safe                                                                                                                                                                |
   | Success Stories         | 3       | Desktop list+detail split takes 5 comfortably; mobile carousel takes any                                                               | 3–5 safe                                                                                                                                                                |
   | Certifications          | 3       | Plain list inside a card                                                                                                               | Free to change                                                                                                                                                          |
   | Technical Arsenal       | 8       | `flex-wrap` — anything 6–12 looks right                                                                                                | Free to change                                                                                                                                                          |
   | Achievements & Awards   | _new_   | Design it as a wrapping strip and it's free from day one                                                                               | Recommend 4–6                                                                                                                                                           |

   So define one constant per section (`FEATURED_LIMITS = { projects: 3, experiences: 3, … }`) and the number becomes a one-line change everywhere except Featured Work. **Ship 3 across the board; revisit only if a section starts feeling thin.** Three is genuinely the right count for a homepage — it's the largest number a visitor takes in without counting.

2. **`visibility: "draft"`** lets you write a blog post over a week without publishing it. You'll want this the first time you start a story and get interrupted.

3. **`phaseId` on Experience — added now, used in Phase 6.** It costs one field today and means the 3D corridor is a _rendering_ of existing data rather than a new data model built under deadline pressure. It also groups the flat timeline, so it earns its keep either way.

4. **`body?` optional on Engagement.** You said these are non-clickable "for the moment". When you change your mind, you fill in `body` and the card becomes clickable — no schema change, no migration. Model the door now, walk through it later.

5. **IDs are human-readable** (`skl_reverse_engineering`, not `a8f3c2d1`). You'll be reading these in Firestore console and in JSON diffs. Auto-IDs cost you nothing today and cost you every debugging session afterwards.

### 3.4 Derived selectors — where the cross-linking actually happens

None of this lives in the database. It's pure functions over the loaded content.

```ts
export type SkillUsage =
  | { kind: "project"; item: Project }
  | { kind: "experience"; item: Experience }
  | { kind: "engagement"; item: Engagement }
  | { kind: "story"; item: Story };

/** Powers "This skill was used in:" — your brief §1.3, in ~6 lines. */
export function usagesOfSkill(skillId: ID, c: Content): SkillUsage[] {
  return [
    ...c.projects
      .filter((p) => p.skillIds.includes(skillId))
      .map((item) => ({ kind: "project" as const, item })),
    ...c.experiences
      .filter((e) => e.skillIds.includes(skillId))
      .map((item) => ({ kind: "experience" as const, item })),
    ...c.engagements
      .filter((e) => e.skillIds?.includes(skillId))
      .map((item) => ({ kind: "engagement" as const, item })),
    ...c.stories
      .filter((s) => s.skillIds?.includes(skillId))
      .map((item) => ({ kind: "story" as const, item })),
  ].sort(byDateDesc);
}

export function featured<T extends { featured: boolean; order: number }>(
  items: T[],
  limit: number,
): T[] {
  return items
    .filter((i) => i.featured)
    .sort((a, b) => a.order - b.order)
    .slice(0, limit);
}

export function resolveSkills(ids: ID[], skills: Skill[]): Skill[];
export function formatDateRange(r: DateRange): string; // → "Jul 2021 – Jun 2024" | "Aug 2025 – Present"

// ── evidence for a soft skill — same shape, different sources (§3.2b)
export type Evidence =
  | { kind: "story"; item: Story }
  | { kind: "experience"; item: Experience }
  | { kind: "engagement"; item: Engagement };

export function evidenceFor(soft: SoftSkill, c: Content): Evidence[];

// ── reverse lookups, all computed, none stored
export function awardsOfExperience(id: ID, c: Content): Award[];
export function awardsOfProject(id: ID, c: Content): Award[];
export function storyOfAward(a: Award, c: Content): Story | undefined;

// ── integrity checks — run in the admin dashboard, optionally fail the build
export function orphanSkills(c: Content): Skill[]; // skills used by nothing → empty modal
export function danglingSkillRefs(c: Content): {
  // skillIds pointing at skills that don't exist
  entity: string;
  id: ID;
  badRefs: ID[];
}[];
export function unevidencedSoftSkills(c: Content): SoftSkill[];
```

Those last three matter more than they look. `orphanSkills` tells you which pills would open an empty modal; `danglingSkillRefs` catches a deleted skill that's still referenced by four projects; `unevidencedSoftSkills` stops you shipping a clickable soft skill that opens to nothing. All three are ~5 lines and they turn a whole class of silent content bug into a dashboard warning.

That last one is a small thing that will save you embarrassment: it tells you which skill pills would open an empty modal.

### 3.5 The modal target union

```ts
export type DetailTarget =
  | { kind: "project"; id: ID }
  | { kind: "experience"; id: ID }
  | { kind: "engagement"; id: ID } // now clickable — you're adding `body`
  | { kind: "story"; id: ID }
  | { kind: "skill"; id: ID }
  | { kind: "award"; id: ID } // new
  | { kind: "softskill"; id: ID } // new
  | { kind: "contact" };
```

Serialized into `?d=project:ai-intrusion-detection`. Adding a new modal type is one union member and one case.

**You asked: can the modal have different layouts per kind? Yes — that's exactly the design.**

Split it in two. `Modal` is the **shell** and knows nothing about content: backdrop, spring animation, close button, Escape key, focus trap, scroll lock, `role="dialog"`. Each kind gets a **body** component. The host picks the body and the width:

```tsx
const REGISTRY = {
  project: { Body: ProjectModalBody, width: "max-w-3xl" }, // wide — video embed + skill chips
  experience: { Body: ExperienceModalBody, width: "max-w-2xl" }, // text-heavy, no media
  engagement: { Body: EngagementModalBody, width: "max-w-2xl" },
  story: { Body: StoryPreviewBody, width: "max-w-2xl" }, // excerpt + "read full story" → /blog
  skill: { Body: EvidenceBody, width: "max-w-lg" }, // narrow — it's a list
  softskill: { Body: EvidenceBody, width: "max-w-lg" }, // ← same body, different source
  award: { Body: AwardModalBody, width: "max-w-xl" },
  contact: { Body: ContactFormBody, width: "max-w-lg" },
} as const;

export function DetailModalHost() {
  const { target, close } = useDetailModal();
  if (!target) return null;
  const { Body, width } = REGISTRY[target.kind];
  return (
    <Modal isOpen onClose={close} className={width}>
      <Body target={target} />
    </Modal>
  );
}
```

You get consistent chrome (every modal opens, animates and closes identically — which is what makes it feel like one system) with fully independent interiors. Note `skill` and `softskill` sharing `EvidenceBody`: same UI, different evidence source, zero duplication.

**One thing to get right: modal-to-modal navigation.** Skill → project → back to skill needs a small history stack in the modal context, not just a single `target`. Push on open, pop on back, clear on close. ~15 lines, and without it the flow in §1.3 of your brief feels broken.

### 3.6 Firestore layout

```
/skills/{id}           /projects/{id}         /experiences/{id}
/engagements/{id}      /stories/{id}          /certifications/{id}
/awards/{id}           /softSkills/{id}       /lifePhases/{id}
/site/{singletonId}    /contact/{id}
```

`/site` holds fixed-ID docs: `hero`, `about`, `seo`, `socials`, `availability`.

Ten `getDocs` calls on revalidation, cached under tag `content`. Eleven collections, flat, no subcollections — at this scale nesting buys nothing and complicates the admin panel.

---

## 4. Target repo structure

```
src/
├─ app/
│  ├─ (site)/                      # public routes — shared layout
│  │  ├─ page.tsx                  # home
│  │  ├─ about/page.tsx
│  │  ├─ projects/page.tsx
│  │  ├─ experience/page.tsx       # timeline v1 → 3D in Phase 6
│  │  ├─ blog/
│  │  │  ├─ page.tsx               # story index
│  │  │  └─ [slug]/page.tsx        # full story
│  │  └─ layout.tsx
│  ├─ (admin)/admin/               # auth-gated, own layout, no splash/nav
│  │  ├─ layout.tsx                # session check → redirect
│  │  ├─ page.tsx                  # dashboard: counts, drafts, orphan skills, inbox
│  │  ├─ projects/…                # list + [id]/edit
│  │  ├─ experiences/…  skills/…  stories/…  certifications/…
│  │  ├─ featured/page.tsx         # drag-to-order the home page
│  │  └─ inbox/page.tsx            # contact submissions
│  ├─ api/
│  │  ├─ contact/route.ts          # POST — validate, store, email
│  │  └─ revalidate/route.ts
│  ├─ layout.tsx  globals.css  opengraph-image.tsx
│  ├─ sitemap.ts  robots.ts  not-found.tsx  error.tsx
│
├─ content/                        # ← the whole data layer
│  ├─ types.ts                     # §3 verbatim
│  ├─ schema.ts                    # Zod, derived from types
│  ├─ selectors.ts                 # §3.4
│  ├─ repository.ts                # interface + provider switch
│  ├─ local/                       # Phase 1 source of truth
│  │  ├─ skills.ts  projects.ts  experiences.ts  engagements.ts
│  │  └─ stories.ts  certifications.ts  phases.ts  site.ts
│  └─ firestore/
│     ├─ client.ts                 # Admin SDK singleton
│     ├─ repository.ts             # read side, cached
│     └─ mutations.ts              # write side, admin only
│
├─ components/
│  ├─ ui/                          # Modal, Button, Pill, Field, Badge, Search…
│  ├─ layout/                      # Navbar, Footer, SocialRail, CustomScrollbar, Splash
│  ├─ cards/                       # ProjectCard, ExperienceCard, EngagementCard, StoryCard
│  ├─ modals/                      # DetailModalHost + one file per DetailTarget kind
│  ├─ motion/                      # shared variants, ScrollReveal, useReducedMotion
│  └─ three/                       # Phase 6, lazy-loaded, isolated
│
├─ sections/                       # renamed from container/HomePage — server by default
│  └─ home/  about/  projects/  experience/
│
└─ lib/
   ├─ utils.ts   icons.ts          # IconName registry
   ├─ auth.ts    email.ts          # Firebase Auth session; Resend
   └─ seo.ts
```

**You asked what `(site)` and `(admin)` are — they're Route Groups.**

Wrapping a folder name in parentheses tells Next.js _"this folder organises files but does not appear in the URL."_ So `app/(site)/about/page.tsx` still serves `/about`, not `/site/about`.

The reason to use them here is **layouts**. Each route group can have its own `layout.tsx`:

- `(site)/layout.tsx` → splash screen, navbar, footer, social rail, custom scrollbar, modal host
- `(admin)/layout.tsx` → sidebar, auth check, plain shell — **no splash, no navbar, no scrollbar**

Without route groups, everything inherits the root layout, and your admin panel would play the 2-second splash animation every single time you opened it to fix a typo. They're also how you keep the admin bundle from importing Framer Motion's splash machinery at all.

Your instinct that Next.js conventions differ from your old React project was right — this is one of the bigger ones. The other is that folders map to URLs by default, which is why `container/HomePage` sitting under `src/` (not `src/app/`) works today but reads as unusual: in App Router, code that isn't a route generally lives _outside_ `app/` entirely, which is what §4 does.

Two renames worth calling out: `container/HomePage` → `sections/home` (they're page sections, not containers, and the casing now matches everything else), and `SuccessStoriesSection` keeps its name instead of being imported as `BlogSection`.

---

## 5. Cost model

| Service              | Tier                                                                                   | Cost         |
| -------------------- | -------------------------------------------------------------------------------------- | ------------ |
| Vercel               | Hobby — fine for a personal portfolio (non-commercial)                                 | $0           |
| Firestore + Auth     | Spark — no card required                                                               | $0           |
| Images               | `/public/media/`, served by Vercel CDN                                                 | $0           |
| Email (contact form) | Resend free tier                                                                       | $0           |
| Domain               | `eternalglitch.com` — **already owned**, portfolio on `dhaval-tanna.eternalglitch.com` | already paid |

**Total ongoing cost: $0.** Everything stays $0 at any traffic level you'll realistically see.

Since you own the domain, two free things you should turn on:

1. **Verify the domain in Resend** so the contact form sends from _your_ domain instead of Resend's shared one. Add the DKIM/SPF DNS records they give you. Deliverability goes up, and `portfolio@eternalglitch.com` in a recruiter's inbox reads very differently from a generic relay address. **Use a sending subdomain** (`send.eternalglitch.com`) rather than the root — that isolates sending reputation, so a future mistake can't poison mail on your main domain. Set `reply-to` to the visitor's address so hitting Reply just works.
2. **Cloudflare Email Routing** (free, if your DNS is on Cloudflare) gives you `hello@eternalglitch.com` forwarding to your real inbox. That's the _inbound_ address you put on your résumé; Resend is the _outbound_ path for form notifications. Different jobs, both free.

---

## 6. Phase plan

Estimates are focused hours. Halve them if you're in flow, double them if you're learning the tool.

---

### Phase 0 — Foundation _(4–6h)_ · nothing visible changes

The un-glamorous phase that makes everything after it possible.

- [ ] **Fix the hooks-in-`map()` violations** in `SkillsSection` and `ProjectsSection` (§1.3 ①) — move `useTransform` into `SkillPill`/`ProjectCard`
- [x] Fix the four placeholder URLs (§1.4 #6) and redeploy — **do this first, it's 2 minutes and it's live right now**
- [x] Clean `globals.css`: drop the dead light-mode block and the phantom Geist vars; remove the `font-family: Arial` override (see the correction in §1.4 #8 — it was only ever affecting the splash screen)
- [x] Extract design tokens into `@theme` (§D6); replace the hex literals
- [x] `Modal`: Escape-to-close, focus trap, focus restore, `role="dialog"` + `aria-modal`, ref-counted scroll lock
- [x] `sessionStorage` skip for the splash screen on repeat visits
- [x] Directory restructure per §4 (folders only, no logic changes) — including the `(site)` route group
- [x] `tsconfig` strict mode on; ESLint incl. `react-hooks/rules-of-hooks` as an **error**; Prettier
- [x] `git init` if needed, connect to GitHub, Vercel preview deploys on PR

**Exit:** site looks pixel-identical, `npm run build` is clean, lint is clean, no `any` in component props. ✅ **Met.**

> The `rules-of-hooks` lint rule would have caught issue ① automatically. Turning it on is the highest-value line in this phase.

_Execution notes for this phase are in `plan-progress.md`._

---

### Phase 1 — Content layer _(6–10h)_ · nothing visible changes

- [x] Write `content/types.ts` (§3.2 verbatim) and `content/schema.ts` (Zod mirrors)
- [x] Write `content/selectors.ts` (§3.4)
- [x] **Build the skill taxonomy first.** Every skill you'll ever reference, with IDs. Do this before anything else — it's the vocabulary everything else speaks.
- [x] Migrate all hardcoded arrays into `content/local/*.ts`, replacing skill strings with `skillIds` and date strings with `DateRange`
- [x] **Correct the inaccurate project/experience data** while you're in here — you flagged it, and this is the one pass where you touch every record
- [x] Icons → `iconName` + `lib/icons.ts` registry
- [x] Implement `LocalRepository`; wire every section to it
- [x] Convert sections to Server Components; push `"use client"` down to animated leaves
- [x] Assert: zero literal content strings left in any component

**Exit:** site is visually identical, every section renders from the repository, `usagesOfSkill()` returns correct results in a test, homepage HTML contains your project titles when JS is disabled. ✅ **Met.**

_Execution notes for this phase are in `plan-progress.md`._

---

### Phase 2 — Interaction system _(8–12h)_ · your brief §1.3–1.5 ships

- [ ] `DetailTarget` union + `<DetailModalHost/>` in layout, `?d=` URL sync
- [ ] `useDetailModal()` hook; `ProjectCard` becomes presentational
- [ ] Delete the duplicate `HireMeModal` mount; contact becomes `{kind:"contact"}`
- [ ] **`SkillDetailModal`** — "This skill was used in:", grouped by kind, each row opens its own detail modal
- [ ] `ProjectDetailModal` / `ExperienceDetailModal` — long description, resolved skill chips (themselves clickable → skill modal), typed link buttons
- [ ] Modal-to-modal navigation with a back affordance (skill → project → back to skill)
- [ ] Deep-linked modals render server-side

**Exit:** click any skill pill → see real usages → click through to a project → back button returns you. Copy the URL, open in a new tab, the same modal opens.

> This is the phase where the site stops being a page and starts being a _system_. It's also the most satisfying one to build.

---

### Phase 3 — Backend _(8–12h)_

- [ ] Firebase project, Firestore enabled, Auth (email/password, one user)
- [ ] Lock security rules to deny-all (§D3)
- [ ] Admin SDK server-side only; service account in Vercel env vars
- [ ] `FirestoreRepository` implementing the same interface
- [ ] Seed script: `content/local/*` → Firestore, idempotent
- [ ] **Enable Cache Components** and wire the Next 16 caching model — see below
- [ ] Flip the provider env var. **Keep `LocalRepository` working forever** — it's your offline dev mode and your escape hatch
- [ ] Verify `eternalglitch.com` in Resend (sending subdomain + DKIM/SPF records)
- [ ] `POST /api/contact` — Zod validate → store → email via Resend; honeypot + rate limit + Cloudflare Turnstile
- [ ] Wire the real form (add `name` attributes, loading/success/error states, kill the `alert()`)

**Exit:** content served from Firestore, site visually unchanged, contact form delivers a real email from your own domain, `PROVIDER=local` still works offline.

#### ⚠️ Next.js 16 changed the caching API — this is the correction to my v1 plan

I originally specified `unstable_cache` + `revalidateTag(tag)`. On 16.2.10 both are wrong. <cite index="12-1">`unstable_cache` has been replaced by `use cache` in Next.js 16; the recommendation is to opt into Cache Components and replace `unstable_cache` with the `use cache` directive.</cite> And <cite index="15-1">the single-argument form `revalidateTag(tag)` is deprecated — it still works if you suppress the TypeScript error, but that may be removed in a future version.</cite>

You're effectively greenfield on the data layer, so take the modern path:

```ts
// next.config.ts
export default { cacheComponents: true };
```

```ts
// content/firestore/repository.ts
import { cacheTag, cacheLife } from "next/cache";

export async function getContent(): Promise<Content> {
  "use cache";
  cacheTag("content");
  cacheLife("max"); // never expires on its own — only when you publish
  return loadEverythingFromFirestore();
}
```

Then — and this is the part worth internalising, because getting it backwards causes a confusing class of bug:

| Where you are                                | Function                          | Semantics                                                                                                                                                                              |
| -------------------------------------------- | --------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Admin panel Save button** (Server Action)  | `updateTag("content")`            | <cite index="20-1">Immediately expires cached data for read-your-own-writes — you see your change right away instead of stale content. Only usable in Server Actions.</cite>           |
| **Route Handler / webhook / background job** | `revalidateTag("content", "max")` | Stale-while-revalidate: next visitor gets the old version instantly while the new one builds behind them. <cite index="22-1">`updateTag` throws if called from a Route Handler.</cite> |

For your admin panel, **`updateTag` in a Server Action is the right call on every save.** You click Save, you land back on the list, and your edit is _there_ — not there-on-the-next-refresh. That's the difference between a CMS that feels real and one that feels broken.

One known gotcha to expect: <cite index="14-1">stale data on `<Link>` navigation after a revalidation is caused by the client-side Router Cache, not the server cache — use `revalidatePath()` alongside `revalidateTag()`, or configure `staleTimes`.</cite> If a publish looks like it didn't take but a hard refresh shows it did, that's this, not your Firestore code.

There's also a codemod that strips the old `unstable_` prefixes if you ever inherit code using them.

---

### Phase 4 — Admin panel _(15–25h)_

- [ ] `(admin)` route group, Firebase Auth session, middleware redirect, no splash/nav chrome
- [ ] Dashboard: counts, drafts, **orphan skills**, unread contact submissions
- [ ] CRUD for each entity — forms generated from the Zod schemas
- [ ] Skill multi-select with search (used on projects/experiences/stories)
- [ ] **Featured manager**: drag-to-reorder per section, live preview of the home page, warning when >3 are flagged
- [ ] Markdown/MDX editor with preview for `body` fields
- [ ] Image upload → decide per §10 Q4
- [ ] Draft/publish toggle + `/preview?token=…` for drafts
- [ ] `revalidateTag` on every mutation
- [ ] Contact inbox with status transitions

**Exit:** you can add a project end-to-end from the browser and see it live within seconds, without opening an editor.

---

### Phase 5 — The remaining pages _(20–30h)_

Order by return on effort — **Blog first.** You already have 17 pages of written material; that's the highest content-value-per-hour on the list, and STAR stories are exactly what an interviewer wants.

- [ ] **`/blog`** — story index (filter by type), `/blog/[slug]` full story, MDX rendering, reading time, related project/experience links, prev/next
- [ ] **`/projects`** — scattered-card grid reusing `variant="grid"`, search across title/summary/skills, filter by skill and status
- [ ] **`/about`** — long intro, journey sections, and the **full skill matrix**: grouped by category, searchable (including `aliases`), each pill opening the same skill modal as the home page
- [ ] **`/experience` v1** — flat chronological timeline grouped by `LifePhase`, merging Experience + Engagement + **Awards**. **A genuinely good 2D page, shipped and done.**
- [ ] Certifications: 3 featured on home, full list on `/about` beneath the skill matrix
- [ ] **Achievements & Awards**: featured strip on Home, full set on `/experience` grouped by phase
- [ ] Soft skills become clickable → evidence modal (needs `/blog` stories to exist first, hence the ordering)

**Exit:** no `UnderConstruction` component left in the repo.

> Phase 5's `/experience` is deliberately not the 3D page. It's the fallback that has to exist anyway — for mobile, for reduced-motion, for crawlers, and for the possibility that Phase 6 takes longer than you hoped.

---

### Phase 6 — The 3D corridor _(25–40h, genuinely uncertain)_

See §8. Fully optional, fully isolated, zero risk to the rest of the site.

---

### Phase 7 — Launch polish _(8–12h)_

- [ ] `opengraph-image.tsx` — dynamic OG cards per project and story (you already bundle `Inter-Bold.ttf` for exactly this)
- [ ] `sitemap.ts`, `robots.ts`, JSON-LD `Person` + `CreativeWork` structured data
- [ ] Per-page metadata; canonical URLs
- [ ] `not-found.tsx`, `error.tsx`, `loading.tsx` in your theme
- [ ] Lighthouse pass — target ≥95 across the board on `/`
- [ ] Full keyboard traversal; axe clean; visible focus rings; verify `prefers-reduced-motion` end to end
- [ ] Vercel Analytics + Speed Insights (free)
- [ ] Résumé PDF served from `/resume` with a tracked download — **the route exists as of Phase 1**: `app/(site)/resume/route.ts` 307-redirects to the file's current Google Drive home, so `site.hero.resumeUrl` points at something real today. Replace the redirect with a served PDF plus tracking; the redirect is deliberately temporary, not 308, so no browser has it cached
- [ ] Custom domain
- [ ] Real-device check: iOS Safari, Android Chrome, Firefox

**Exit:** you'd send the link to anyone without a caveat.

---

### Timeline

| Phase               | Hours | Cumulative |
| ------------------- | ----- | ---------- |
| 0 · Foundation      | 4–6   | 6          |
| 1 · Content layer   | 6–10  | 16         |
| 2 · Interaction     | 8–12  | 28         |
| 3 · Backend         | 8–12  | 40         |
| 4 · Admin           | 15–25 | 65         |
| 5 · Pages           | 20–30 | 95         |
| 6 · 3D _(optional)_ | 25–40 | 135        |
| 7 · Polish          | 8–12  | 147        |

**~95h to a complete, admin-managed portfolio.** ~135h with the corridor.

At 10h/week: Phase 0–3 in a month, everything but the 3D by month three.

---

## 7. Page specifications

Mapped to the numbering in your brief, so you can check nothing was dropped.

### 7.1 Home — `/`

| §        | Section                           | Decision                                                                                                                                                               |
| -------- | --------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 0        | Splash                            | Keep. Add `sessionStorage` skip on repeat visits.                                                                                                                      |
| 1.1      | Hero                              | Keep. Two notes below.                                                                                                                                                 |
| 1.2      | About card                        | Keep. Content from `site.about.short`.                                                                                                                                 |
| 1.3      | Technical Arsenal                 | `featured(skills, 8)`. Pills open `SkillDetailModal`.                                                                                                                  |
| 1.4      | Featured Work                     | `featured(projects, 3)`. Card → `ProjectDetailModal`.                                                                                                                  |
| 1.5      | Experience                        | `featured(experiences, 3)`. Card → `ExperienceDetailModal`.                                                                                                            |
| 1.6      | Leadership & Engagement           | `featured(engagements, 3)`. **Now clickable** → `EngagementModalBody` (you're writing `body` for each).                                                                |
| 1.7      | Success Stories                   | `featured(stories, 3)`. Card → `StoryPreviewBody`; "Read full story" → `/blog/[slug]`.                                                                                 |
| 1.8      | Certifications / Beyond the Code  | `featured(certifications, 3)` + `featured(softSkills, N)`. **Soft skills now clickable** → evidence modal.                                                             |
| **1.10** | **Achievements & Awards** _(new)_ | `featured(awards, 4–6)`. Third panel of the 1.8 group, not its own section — see below. Each links to its source project/experience, and to its STAR story if written. |
| 1.9      | Call to Action                    | Keep. Button dispatches `{kind:"contact"}` — same modal as the navbar.                                                                                                 |

**Placement of the new Awards section.** 1.8 and 1.10 render as **one section**, `CertificationsSection`, titled **"Credentials & Caliber"** — three sibling panels in one grid: Certifications and Beyond the Code side by side, Achievements & Awards centred beneath them. A triangle, not a stack. They share a grid rather than sitting in two adjacent sections, since two separate sections put far more vertical air between the top pair and the awards panel than between the pair themselves.

**Design.** All three panels compose from one `components/ui/ModulePanel` (gradient, top accent line, icon tile, title), differing only in accent hue (blue / indigo / cyan) and contents.

No "View all" link on any of the three panels: `/experience`, where the full award and certification lists will live (§10 Q2), is still an `UnderConstruction` placeholder. Add the link to all three when that page is real.

_(Placement and design history — including the earlier chip-strip and stacked-section approaches — is in `plan-progress.md`.)_

**Two small notes on the hero, take or leave:**

1. `HEADLINES` randomly picks between _"Building software that scales"_ and _"Building scalable software."_ Those are the same sentence. If you want the randomness, make the variants say genuinely different things — otherwise a returning visitor perceives an inconsistency with no payoff. My honest read: neither line says what makes _you_ unusual. You're a financial-infrastructure engineer who moved into offensive security and reverse engineering — "scalable software" is what everyone claims. Something nearer _"I break systems to learn how to build them better"_ (which you already wrote, in the About card) is sharper. That line is currently buried below the fold.

2. The status badge rotates every 3.2s across three items. A visitor who reads at normal speed will see roughly one and a half of them. 4.5–5s is closer to readable.

Neither is a blocker. Both are one-line changes.

### 7.2 Navbar & footer

Keep. Navbar's "Let's Talk" and the CTA's "Get in Touch" both dispatch `{kind:"contact"}` — one modal instance, one form, one code path (fixes §1.4 #11). Nav links come from a shared constant used by both navbar and footer.

### 7.3 About — `/about`

Long-form intro from `site.about.long` + `journey[]`. Below it, the **full skill matrix**: grouped by `SkillCategory`, searchable across `name` _and_ `aliases`, each pill opening the same `SkillDetailModal` as the home page. Certifications list here too _(pending §10 Q2)_. This page is where your résumé's density lives.

### 7.4 Experience — `/experience`

**v1 (Phase 5):** chronological timeline grouped by `LifePhase`, merging Experience + Engagement into one lane. Cards open the same detail modals.
**v2 (Phase 6):** the 3D corridor, as an _alternate view_ of the same data with a persistent toggle. See §8.

### 7.5 Projects — `/projects`

Scattered-card layout echoing the home page, reusing `ProjectCard variant="grid"`. Search across title/summary/skills; filter chips by skill and status. Cards open `ProjectDetailModal`. Client-side filtering over the full list — it's small enough that server-side filtering would be slower.

### 7.6 Blog — `/blog`

Index of stories with type filters; `/blog/[slug]` renders the full MDX. Optional STAR-structured display when `story.star` is present (labelled Situation/Task/Action/Result blocks) — it signals interview-readiness, which is exactly the audience. Related project/experience links at the foot of each story, plus prev/next.

For 17 pages of Word content: convert to MDX once (`pandoc` handles the bulk), then paste into the admin editor. Don't build a Word importer.

---

## 8. The 3D corridor — honest feasibility

**Verdict: absolutely buildable, and a strong differentiator. Build it last, build it isolated, and give it a skip button.**

### Your reference: Tron Legacy

That's a good visual target, and — usefully — it's one of the _easiest_ looks to achieve in three.js, because it's built almost entirely from emissive geometry rather than realistic lighting. Which means simple shapes look intentional rather than unfinished. The recipe:

| Element               | How                                                                                                                                                                                              |
| --------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Near-black void       | `scene.background = black`, `<fog>` with a short far-plane so the corridor dissolves into darkness ahead                                                                                         |
| Glowing edges         | `meshStandardMaterial` with `emissive` + `emissiveIntensity` on thin strips — light-**emitting** geometry, not lit surfaces                                                                      |
| The actual glow       | **Bloom postprocessing** — `@react-three/postprocessing`'s `<EffectComposer><Bloom/></EffectComposer>`. This single effect is ~80% of "Tron". Without it, emissive strips are just bright lines. |
| Wet-floor reflections | drei's `<MeshReflectorMaterial>` with high blur and low resolution — cheap, and it doubles the apparent light                                                                                    |
| Grid floor            | a repeating emissive grid texture, or thin box meshes on a lattice                                                                                                                               |
| Doors                 | emissive rectangular frames, `LifePhase.accent` tinting each one                                                                                                                                 |

Two things to get right early: **keep the palette to two colours** (one cyan/blue, one warm accent — Tron's whole identity is that restraint), and **tune bloom before adding geometry**, because bloom changes how everything reads and you'll otherwise rebuild the scene around the wrong look.

Yes — refine the details during implementation. Nail step 1 below (static scene, camera fixed) and judge it standing still before you add motion.

### How it's actually done

The thing you saw in those reels is scroll-driven camera animation along a spline. The standard stack:

- **`three.js`** + **`@react-three/fiber`** (React renderer for three) + **`@react-three/drei`** (helpers)
- Define the path as a `THREE.CatmullRomCurve3` through control points that curve left and right
- Map scroll progress `0→1` to a position on the curve via `curve.getPointAt(t)`, and orient the camera using `curve.getTangentAt(t)`
- **Damp scroll input** — lerp toward the target `t` each frame rather than jumping. This is the entire difference between "flying a drone" and "jittery mess". `drei`'s `<ScrollControls>` gives you this for free
- **Doors** are meshes placed at known `t` values along the curve, derived from `LifePhase.order`
- **Click → camera pan** is a tween from current position/quaternion to a target framing the door, then an HTML overlay (`drei`'s `<Html>`) with that phase's experiences. Closing reverses the tween and restores scroll control. `camera-controls` handles this well
- Corridor geometry can be extruded along the curve, or faked convincingly with fog + a repeating tunnel mesh + point lights. **Fake it first** — real geometry is a rabbit hole and fog does most of the perceived work

### The four things that will bite you

1. **Bundle size.** three + R3F + drei is several hundred KB gzipped. Must be `dynamic(() => import(...), { ssr: false })` so it _only_ loads on `/experience`. If it lands in the shared bundle you've slowed down every page to decorate one.

2. **SEO and accessibility: a `<canvas>` contains no text.** Your work history — arguably the single most important content for a recruiter — would become invisible to Google, to LinkedIn previews, and to screen readers. **Non-negotiable mitigation:** the Phase 5 timeline stays and is server-rendered on the same route. The 3D view is a toggle over it, never a replacement.

3. **Mobile.** Scroll-hijacking on touch fights the browser's native gestures and drains battery. Serve the 2D timeline on touch devices by default, with 3D as opt-in.

4. **The recruiter with 45 seconds.** This is the one I'd think hardest about. A hiring manager with 200 applications open does not want to _fly a drone_ to find out where you worked. If the corridor is the only way to read your work history, some fraction of your audience will bounce before finding it.
   → **Persistent, obvious "Timeline view" toggle in the corner. Remembered in `localStorage`. Respect `prefers-reduced-motion` by defaulting to 2D.**

You framed this as directing a movie. Good movies have a skip-intro button — not because the intro is bad, but because a viewer who skips it and stays is better than one who leaves.

### Suggested build order (Phase 6)

1. Static scene: corridor mesh + fog + lights, camera fixed. _(Does it look good standing still?)_
2. Add the curve, map scroll → position, no doors. _(Does the movement feel like flight or like a slideshow?)_
3. Place doors from `LifePhase` data, no interaction.
4. Click → camera tween → `<Html>` overlay → close → resume.
5. Polish: door labels, hover glow, progress indicator, entry/exit transitions.
6. Fallbacks: 2D toggle, mobile default, reduced-motion default, loading state.

**Stop after any step if it isn't working.** Each one is independently shippable behind the toggle. Steps 1–2 alone would already be more interesting than 95% of portfolio experience pages.

---

## 9. Risks

| Risk                                         | Why it's real here                                                                           | Mitigation                                                                                                                                                      |
| -------------------------------------------- | -------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **The refactor eats the momentum**           | Phases 0–1 change nothing visible. That's demoralising when you're used to shipping UI.      | Phase 2 is the payoff, and it's only ~25h in. Also: do the placeholder-URL fix on day one for an immediate win.                                                 |
| **3D scope creep**                           | It's the most exciting part and the least bounded. Easy to spend 60h and ship nothing.       | It's last, isolated in `components/three/`, and gated behind a page that already works without it. Timebox it.                                                  |
| **Content churn**                            | You said several sections aren't decided.                                                    | D1 means undecided sections change _data_, not architecture. Add fields; don't restructure.                                                                     |
| **Perfectionism stalls the launch**          | _"It has to be perfect"_ is your words, and it's the most common way projects like this die. | Every phase ends deployable. Ship Phase 3 publicly and keep going. A live good site beats an unreleased perfect one — and recruiters can't read a local branch. |
| **Firebase terms shift again**               | Storage left the free tier in Feb 2026 with little fanfare.                                  | D1's repository interface. Swapping providers is one file. Don't build Firebase assumptions into components.                                                    |
| **Admin panel is bigger than it looks**      | 15–25h is realistic; it's a small CMS.                                                       | Build read-only + featured-toggle first (that's 80% of your day-to-day use), full CRUD after. Or reconsider Sanity per §10 Q1.                                  |
| **Single-admin auth becomes the weak point** | One account with write access to everything.                                                 | Firebase Auth + strong password + **2FA on the Google account** + deny-all Firestore rules + never expose the Admin SDK to the client.                          |

---

## 10. Decisions — resolved

All six are settled. Recorded here so a future you (or a future chat) doesn't reopen them.

| #   | Question                      | **Decision**                                                                                                                                           |
| --- | ----------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Q1  | Build the CMS or use hosted?  | **Build our own.** Phase 4 stands. It's also an interview story.                                                                                       |
| Q2  | Where do certifications live? | 3 featured on Home; full list on `/about` beneath the skill matrix. **Awards go on `/experience`**, grouped by life phase, since most originate there. |
| Q3  | Engagements clickable?        | **Yes** — each gets a `body`. Removes the inconsistency of three inert cards among clickable siblings.                                                 |
| Q4  | Image strategy                | **`/public/media/` committed to the repo**, with Vercel Blob as the fallback if the admin panel needs runtime uploads.                                 |
| Q5  | Domain                        | **Owned.** `dhaval-tanna.eternalglitch.com`. Also unlocks branded email — see §5.                                                                      |
| Q6  | `framer-motion` currency      | **12.42.2, current.** The `motion` rename is cosmetic; skip it or fold it into Phase 0. Not a blocker.                                                 |

### Still open (smaller, decide during the phase they land in)

1. **The hero headline.** You liked _"I break systems to learn how to build them better."_ That line is currently doing duty in the About card; using it in both places would be repetitive, and it needs deciding against the typography rather than in the abstract. Decide it when the About page is designed.

   One mechanic worth knowing before you edit those strings: the hero renders its **closing sentence** in the blue-to-cyan gradient, and `headlines` stores each headline as one whole string — so `Hero.tsx` derives the split at the last `". "`. Everything before it is plain, the rest is accented. A single-sentence headline is therefore entirely gradient. If a future headline needs the break somewhere else, that's the function to change (`splitHeadline`), not the data.

2. **Whether soft skills stay four items.** Once they're clickable and backed by stories, you may want six. Layout is a wrapping list, so it's free.

_(Awards visual treatment was open here in the original plan; it's resolved — see §7.1 — and its history is in `plan-progress.md`.)_

---

## 11. Your first session

Concrete, in order. Two to three hours.

1. **Fix the four placeholder URLs and deploy.** `yourusername/repo` ×2, `your-live-link.com`, `your.email@example.com`. These are live right now. _(10 min)_
2. **Turn on `react-hooks/rules-of-hooks` as an ESLint error.** Watch it flag `SkillsSection` and `ProjectsSection` — that's issue ① confirming itself. _(15 min)_
3. **Fix those two violations** by moving `useTransform` into `SkillPill` and `ProjectCard`. _(45 min)_
4. **Clean `globals.css`** — dead light-mode block, phantom Geist vars, and the Arial override that's suppressing Inter. Look at the site afterwards; the typography will change and you should decide whether you prefer it. _(20 min)_
5. **Extract the design tokens** into `@theme`. Start with `--color-surface: #0a0f18` and the accent. _(30 min)_
6. **Verify your ESLint flat config actually runs the hooks rule.** If step 2 flagged nothing, `eslint.config.mjs` isn't spreading `eslint-config-next` correctly — fix that before trusting any future lint pass. _(15 min)_

Then Phase 0 in full, then Phase 1. Appendix A gives you a head start on the single biggest Phase 1 task.

---

## 12. One closing note

The instinct that brought you here — _"I'll hit problems when I integrate the database"_ — was correct, and you caught it at close to the ideal moment. The homepage is done enough that its patterns are proven, and small enough that restructuring is a weekend rather than a rewrite. Six months and four more pages from now, the same refactor would have been ten times the work.

The UI craft here is real. The bracket-reveal animation, the shared-element splash transition, the pinned-corkboard cards — those are the hard part, and they're done. What's left is mostly plumbing, and plumbing is a solved problem.

Nothing in this plan asks you to throw away a single line of the work you're proud of.

---

## Appendix A — How skills actually hook up to projects and experiences

You asked this directly, so here is the mechanism end to end, including the migration from what you have now.

### A.1 The shape of the link

**One canonical list. IDs everywhere. Reverse lookups computed, never stored.**

```
content/local/skills.ts          ← the vocabulary. The only place a skill NAME exists.
        ↓ referenced by ID
projects.ts  experiences.ts  engagements.ts  stories.ts  awards.ts
        ↓ reverse direction computed at render time
usagesOfSkill(skillId) → SkillUsage[]
```

Only the **forward** direction is stored: a Project knows its skills. A Skill does _not_ store a list of projects. That is deliberate — two stored directions means two sources of truth, and the day you delete a project and forget to update six skill documents, your site starts lying. With one direction plus a computed reverse, they can never disagree. The computation is a `.filter()` over ~50 items: microseconds, run once per build.

### A.2 Making typos impossible

In the local-repository phase you get compile-time safety for free by deriving the ID type from the registry itself:

```ts
// content/local/skills.ts
export const SKILLS = {
  skl_python: {
    name: "Python",
    category: "language",
    level: "core",
    featured: true,
    order: 1,
  },
  skl_go: {
    name: "Go",
    category: "language",
    level: "working",
    featured: false,
    order: 4,
  },
  // …
} as const;

export type SkillId = keyof typeof SKILLS; // ← "skl_python" | "skl_go" | …
```

Now `skillIds: SkillId[]` on `Project` means this fails to compile:

```ts
skillIds: ["skl_pythonn"]; // ✗ Type '"skl_pythonn"' is not assignable to type 'SkillId'
```

Once content moves to Firestore, TypeScript can't see the data any more — so the guarantee transfers to two other places:

1. **Zod at the repository boundary** (D7): `z.enum(Object.keys(SKILLS))`, or a post-parse check that every referenced ID resolves. Bad refs fail loudly with a field name instead of rendering an empty chip.
2. **The admin panel uses a multi-select, not a text field.** You pick skills from a searchable list of real skills. A typo becomes structurally impossible — which is the actual long-term fix, since you'll be entering this data by hand for years.

Plus `danglingSkillRefs()` (§3.4) as a dashboard warning for anything that slips through.

### A.3 What the UI does with it

```
Home → Technical Arsenal → click "Reverse Engineering"
  └─ open({ kind: "skill", id: "skl_reverse_engineering" })
      └─ EvidenceBody calls usagesOfSkill(id, content)
          ├─ Projects:     [LLM-Assisted Binary Analysis]
          ├─ Experiences:  [Graduate TA — CSE 545] [SEFCOM Research]
          └─ Engagements:  [DEF CON 32 CTF]
              └─ click any row → push({ kind: "project", id }) onto the modal stack
                  └─ ProjectModalBody renders skill chips → each one clickable
                      └─ back to a skill modal … and the loop closes
```

The graph is navigable in both directions from any node. That bidirectional traversal is the thing that makes it feel like a system rather than a page — and it costs you one `.filter()` and a modal history stack.

### A.4 Migrating your current data (Phase 1, ~2 hours)

Here is the taxonomy extracted from every `techStack` array and `skills.json` entry currently in your repo — 24 distinct strings, deduped and normalised. **This is a starting scaffold, not a final answer**: you said the project/experience data is "close but not accurate," so revise freely. The IDs are what matter; names and categories are cheap to change.

```ts
// content/local/skills.ts — DRAFT, extracted from the current codebase
export const SKILLS = {
  // ── languages ────────────────────────────────────────────────
  skl_python: {
    name: "Python",
    category: "language",
    level: "core",
    featured: true,
    order: 10,
    aliases: ["py"],
  },
  skl_java: {
    name: "Java",
    category: "language",
    level: "core",
    featured: true,
    order: 11,
  },
  skl_typescript: {
    name: "TypeScript",
    category: "language",
    level: "core",
    featured: true,
    order: 12,
    aliases: ["TS", "Typescript"],
  },
  skl_go: {
    name: "Go",
    category: "language",
    level: "working",
    featured: false,
    order: 13,
    aliases: ["Golang"],
  },
  skl_x86: {
    name: "x86 Assembly",
    category: "language",
    level: "working",
    featured: true,
    order: 14,
    aliases: ["Arch x86", "x86", "asm", "assembly"],
  },

  // ── frameworks & libraries ───────────────────────────────────
  skl_react: {
    name: "React",
    category: "framework",
    level: "core",
    featured: true,
    order: 20,
  },
  skl_nextjs: {
    name: "Next.js",
    category: "framework",
    level: "core",
    featured: true,
    order: 21,
    aliases: ["nextjs"],
  },
  skl_sklearn: {
    name: "scikit-learn",
    category: "framework",
    level: "working",
    featured: false,
    order: 22,
    aliases: ["Scikit-Learn", "sklearn"],
  },
  skl_pandas: {
    name: "pandas",
    category: "framework",
    level: "working",
    featured: false,
    order: 23,
  },

  // ── platforms ────────────────────────────────────────────────
  skl_hyperledger: {
    name: "Hyperledger Fabric",
    category: "platform",
    level: "working",
    featured: false,
    order: 30,
    aliases: ["Hyperledger"],
  },
  skl_blockchain: {
    name: "Blockchain",
    category: "platform",
    level: "working",
    featured: false,
    order: 31,
  },
  skl_llms: {
    name: "LLMs",
    category: "platform",
    level: "working",
    featured: false,
    order: 32,
    aliases: ["Large Language Models"],
  },

  // ── security domains ─────────────────────────────────────────
  skl_reverse_engineering: {
    name: "Reverse Engineering",
    category: "domain",
    level: "core",
    featured: true,
    order: 40,
  },
  skl_binary_exploitation: {
    name: "Binary Exploitation",
    category: "domain",
    level: "core",
    featured: false,
    order: 41,
    aliases: ["pwn"],
  },
  skl_offensive_security: {
    name: "Offensive Security",
    category: "domain",
    level: "core",
    featured: false,
    order: 42,
    aliases: ["red team"],
  },
  skl_vuln_research: {
    name: "Vulnerability Research",
    category: "domain",
    level: "working",
    featured: false,
    order: 43,
  },
  skl_network_security: {
    name: "Network Security",
    category: "domain",
    level: "working",
    featured: false,
    order: 44,
  },
  skl_cryptography: {
    name: "Cryptography",
    category: "domain",
    level: "working",
    featured: false,
    order: 45,
    aliases: ["crypto"],
  },
  skl_system_security: {
    name: "System Security",
    category: "domain",
    level: "core",
    featured: true,
    order: 46,
  },
  skl_ctf: {
    name: "CTF Development",
    category: "domain",
    level: "core",
    featured: false,
    order: 47,
  },
  skl_digital_forensics: {
    name: "Digital Forensics",
    category: "domain",
    level: "working",
    featured: false,
    order: 48,
    aliases: ["DFIR", "incident response"],
  },

  // ── engineering practice ─────────────────────────────────────
  skl_systems_engineering: {
    name: "Systems Engineering",
    category: "practice",
    level: "core",
    featured: false,
    order: 50,
  },
  skl_enterprise_arch: {
    name: "Enterprise Architecture",
    category: "practice",
    level: "core",
    featured: false,
    order: 51,
  },
  skl_secure_sdlc: {
    name: "Secure SDLC",
    category: "practice",
    level: "working",
    featured: false,
    order: 52,
  },
  skl_system_design: {
    name: "System Design",
    category: "practice",
    level: "core",
    featured: false,
    order: 53,
  },
} as const;

export type SkillId = keyof typeof SKILLS;
```

**Four judgement calls I made that you should review:**

- **`"Arch x86"` → `x86 Assembly`.** I read that as x86 architecture / assembly-level work. If you meant Arch _Linux_, that's a different skill entirely and the ID should change.
- **`"Security Analysis"` dropped**, folded into `skl_vuln_research`. It appeared once and overlapped almost completely. Restore it if it means something distinct to you.
- **`skl_digital_forensics` added** — it isn't in any `techStack` array, but Tracer Fire is squarely digital forensics and it'd otherwise be an orphan claim.
- **Featured set is 8**, matching your current pill count: Python, Java, TypeScript, x86, React, Next.js, Reverse Engineering, System Security.

**The one thing to check before you move on:** run `orphanSkills()` mentally right now. `skl_java` is featured on your homepage but is referenced by _zero_ projects and _zero_ experiences in the current data. Same for `skl_react`. Click those pills after Phase 2 and they open to nothing. Either add the projects that justify them, or unfeature them. This is exactly the class of bug the integrity checks exist to catch — and it already exists in your live site, silently, because nothing is clickable yet.

---
