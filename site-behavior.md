# Site Behaviour Specification

**Project:** Dhaval Tanna — personal portfolio
**Live at:** `dhaval-tanna.eternalglitch.com`
**Companion document:** `PROJECT_PLAN.md` (audit, architecture rationale, phased execution)
**Last updated:** August 2026

---

## 0. What this document is

`PROJECT_PLAN.md` says **how we're building it and in what order**. This document says **what the site is and how it behaves** — permanently, independent of build phase.

It is written to be self-contained. If this chat is lost, paste this document into a new one and the assistant will have the full picture without re-reading the codebase.

**To restore context in a new conversation, say:**

> Here's the behaviour spec and project plan for my portfolio. I'm currently on Phase _N_. [attach both files, plus current `src` if the work is code-level]

**Rule for keeping it useful:** when a behaviour changes, update this file in the same commit. A spec that drifts from the code is worse than none, because it makes you confident about the wrong thing.

---

## 1. Project identity

A personal portfolio for a graduate software/systems engineer specialising in cybersecurity — targeting SWE and security roles.

**Primary audience:** recruiters and hiring managers, often on mobile, often giving it under a minute.
**Secondary audience:** engineers who will look closer, and friends/family.

**Design intent:** cinematic and deliberate. Motion is used to direct attention, not to decorate. Every animation is one-shot on entry, never looping and never distracting from reading.

**The governing constraint:** the site must be _fast to skim and deep to explore_. A recruiter with 45 seconds must reach the important facts without interacting with anything. An engineer with 15 minutes must be able to traverse the whole graph.

---

## 2. Stack, hosting, cost

|                  |                                                                                       |
| ---------------- | ------------------------------------------------------------------------------------- |
| Framework        | Next.js **16.2.10**, App Router, TypeScript                                           |
| React            | 19.2.4                                                                                |
| Styling          | Tailwind CSS v4 — theme tokens in `@theme`, no hardcoded hex                          |
| Animation        | framer-motion ^12.42.2                                                                |
| Icons            | lucide-react, resolved from string keys via `lib/icons.ts`                            |
| 3D _(Phase 6)_   | three + @react-three/fiber + drei + postprocessing, lazy-loaded, `/experience` only   |
| Content DB       | Firestore, Spark (free) plan — server-side Admin SDK only                             |
| Auth             | Firebase Auth, single admin user                                                      |
| Images           | `/public/media/` committed to repo (Firebase Storage requires billing since Feb 2026) |
| Email            | Resend, sending from a verified subdomain of `eternalglitch.com`                      |
| Hosting          | Vercel                                                                                |
| **Ongoing cost** | **$0**                                                                                |

**Caching model (Next 16):** `cacheComponents: true`; content reads use `"use cache"` + `cacheTag("content")` + `cacheLife("max")`. Admin saves call `updateTag("content")` from a Server Action (read-your-own-writes). Route handlers and webhooks use `revalidateTag("content", "max")`.

---

## 3. Design language

| Token                  | Value                                                                  | Used for                              |
| ---------------------- | ---------------------------------------------------------------------- | ------------------------------------- |
| `--color-surface`      | `#0a0f18`                                                              | every card background                 |
| `--color-surface-deep` | `#05080c`                                                              | gradient card bottoms                 |
| background             | pure black + radial blue glow, fixed, `-z-10`                          | page canvas                           |
| accent                 | blue (500/400 range)                                                   | links, active states, glows, brackets |
| text                   | white → `gray-400` for body → `gray-500/600` for meta                  |                                       |
| mono                   | headline metadata, dates, skill pills, type labels                     |                                       |
| radii                  | `rounded-xl` cards · `rounded-2xl`/`3xl` panels · `rounded-full` pills |                                       |
| card shadow            | `0 20px 40px -15px rgb(0 0 0 / 0.7)`                                   |                                       |

**Motion rules:**

- Entry animations trigger **once** on scroll into view and never reverse or replay.
- Scroll-linked reveals are driven by the **section's** scroll progress, not each item's own visibility, so a group settles as a composed unit.
- Hover is a spring; entry is a tween.
- `prefers-reduced-motion` shows the finished state instantly. This is honoured everywhere, including the 3D page (which defaults to the 2D view).

**Anti-patterns, permanently banned:** looping animations, autoplaying carousels, anything that moves while the user is reading, scroll-jacking outside the opt-in 3D view.

---

## 4. Global chrome

Applied by `app/(site)/layout.tsx`. The `(admin)` route group deliberately gets none of it.

### 4.1 Splash screen

On first load, the name renders large and centred with a bottom-up clip-path fill. After ~2s it flies to the navbar position via a shared `layoutId="brand-name"` FLIP transition. Site content fades in behind it.

**Skipped on repeat visits within a session** via `sessionStorage` — a returning visitor or anyone who hits refresh goes straight to content.

### 4.2 Navbar

Fixed, centred, pill-shaped, glass-blurred. Hides on scroll-down past 100px, reappears on scroll-up.

- Brand name → `/`
- `About` · `Experience` · `Projects` · `Blog` → their pages
- **`Let's Talk`** → opens the contact modal
- Mobile: hamburger dropdown with the same links plus a compact social row; the CTA becomes a floating action button, bottom-right

### 4.3 Footer

Brand, socials, quick links (same array as the navbar — one shared constant), copyright.

### 4.4 Social rail

Fixed left edge, desktop only. LinkedIn · GitHub · Email. Shares SVGs with the navbar dropdown and footer.

### 4.5 Custom scrollbar

Desktop only (`hover: hover`, `pointer: fine`, ≥768px). Fixed overlay, invisible rail, expands on pointer proximity. The native scrollbar is hidden under exactly the same media query so touch devices keep theirs.

### 4.6 Modal system — the backbone of the site

**One `<DetailModalHost/>` in the layout.** Any component anywhere can open any modal.

- State lives in a URL query param: `?d=project:ai-intrusion-detection`
- **Modals are therefore shareable** — you can send someone a link that opens directly to one project
- Browser Back closes the modal
- A **history stack** supports modal-to-modal navigation (skill → project → back to skill)
- `Modal` is the shell only: backdrop, spring animation, close button, Escape key, focus trap, focus restore, scroll lock, `role="dialog"` + `aria-modal`
- Each `kind` supplies its own **body component and width** — consistent chrome, independent interiors

| kind         | body                  | width       | contents                                           |
| ------------ | --------------------- | ----------- | -------------------------------------------------- |
| `project`    | `ProjectModalBody`    | `max-w-3xl` | long description, skill chips, video embed, links  |
| `experience` | `ExperienceModalBody` | `max-w-2xl` | long description, achievements, skill chips, links |
| `engagement` | `EngagementModalBody` | `max-w-2xl` | description, links                                 |
| `story`      | `StoryPreviewBody`    | `max-w-2xl` | excerpt → "Read full story" → `/blog/[slug]`       |
| `skill`      | `EvidenceBody`        | `max-w-lg`  | _"This skill was used in:"_ + grouped usage list   |
| `softskill`  | `EvidenceBody`        | `max-w-lg`  | _"Demonstrated in:"_ + grouped evidence list       |
| `award`      | `AwardModalBody`      | `max-w-xl`  | detail, source project/experience, story link      |
| `contact`    | `ContactFormBody`     | `max-w-lg`  | the enquiry form                                   |

`skill` and `softskill` share one body component with different source arrays.

---

## 5. The interaction graph

This is the part that makes the site a system rather than a set of pages. Every arrow is navigable, and most are traversable in both directions.

```
                        ┌──────────────┐
                        │    SKILL     │◄──────────────┐
                        └──────┬───────┘               │
                     "used in:"│                       │ skill chips
                ┌──────────────┼──────────────┐        │ (clickable)
                ▼              ▼              ▼        │
          ┌──────────┐  ┌────────────┐  ┌──────────┐   │
          │ PROJECT  │  │ EXPERIENCE │  │ENGAGEMENT│───┘
          └────┬─────┘  └─────┬──────┘  └────┬─────┘
               │              │              │
               │  awarded for │ awarded at   │ evidence for
               ▼              ▼              ▼
          ┌──────────────────────┐   ┌──────────────┐
          │        AWARD         │   │  SOFT SKILL  │
          └──────────┬───────────┘   └──────┬───────┘
                     │ story behind it      │ "demonstrated in:"
                     ▼                      ▼
                ┌────────────────────────────────┐
                │            STORY               │
                │   (STAR narrative, /blog)      │
                └────────────────────────────────┘
```

**Storage direction vs. query direction.** Only the **downward** arrows are stored as IDs. Everything upward is computed at render time by filtering. One source of truth per relationship; the two directions can never disagree.

**Worked example — the full traversal:**

1. Home → Technical Arsenal → click **"Reverse Engineering"**
2. Modal: _"This skill was used in:"_ → 1 project, 2 experiences, 1 engagement
3. Click **"Graduate Teaching Assistant"** → experience modal, its own skill chips
4. Click a chip → back to a skill modal, different skill
5. Back button → returns up the stack

**Second example — the soft-skill path (the one recruiters care about):**

1. Home → Beyond the Code → click **"Crisis management and debugging under pressure"**
2. Modal: _"Demonstrated in:"_ → 2 STAR stories, 1 experience
3. Click a story → preview → "Read full story" → `/blog/[slug]`
4. Full STAR write-up, with related project and experience links at the foot

That second path is the site's most valuable feature. It converts four generic adjectives — the sort of thing every portfolio claims and none evidences — into an entry point for 17 pages of concrete written proof.

---

## 6. Page behaviour

### 6.1 Home — `/`

Sections in render order. Each pulls from the content repository; none contains literal content.

| #   | Section                              | Content                                                   | Behaviour                                                                                                                                                                                                           |
| --- | ------------------------------------ | --------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | **Hero**                             | `site.hero`                                               | Headline; two-line settle-type role animation (types once, then rests); rotating status badge (~4.5s); "Start Journey" CTA scrolls to About over a controlled 1.4s                                                  |
| 2   | **About card**                       | `site.about.short`                                        | Hanging ID-badge card on a lanyard, swings in on scroll and wobbles on hover. "Read more about me" → `/about`                                                                                                       |
| 3   | **Technical Arsenal**                | `featured(skills, 8)`                                     | Pills fade+scale in on a staggered shared timeline. **Click → skill evidence modal.** "View detailed skillset" → `/about`                                                                                           |
| 4   | **Featured Work**                    | `featured(projects, 3)`                                   | Three cards pinned to an invisible corkboard — tilted, metallic pushpin, straighten + scale on hover. **Click → project modal.** "View All" → `/projects`                                                           |
| 5   | **Experience**                       | `featured(experiences, 3)`                                | Bracket-reveal: `[` and `]` grow at centre, swing to the card edges, feathered mask wipes the card in behind them, brackets fade. Once, on scroll-in. **Click → experience modal.** "Full Timeline" → `/experience` |
| 6   | **Achievements & Awards**            | `featured(awards, 4–6)`                                   | Compact wrapping chip strip. **Click → award modal**, which links onward to the source project/experience and to the STAR story if written                                                                          |
| 7   | **Leadership & Engagement**          | `featured(engagements, 3)`                                | Horizontal flex accordion; active panel expands `flex-[4]`, others collapse to icon spines. Hover or click to activate. **Click → engagement modal.** "View all" → `/experience`                                    |
| 8   | **Success Stories**                  | `featured(stories, 3)`                                    | Desktop: list + detail split with a sliding active indicator. Mobile: snap carousel with a scroll-progress bar. "Read full story" → `/blog/[slug]`                                                                  |
| 9   | **Certifications / Beyond the Code** | `featured(certifications, 3)` + `featured(softSkills, 4)` | Two side-by-side panels, staggered scroll entrance. Certs link to credentials. **Soft skills click → evidence modal**                                                                                               |
| 10  | **Call to Action**                   | `site.availability`                                       | Availability badge, headline, location, "Get in Touch" → contact modal (same one as the navbar)                                                                                                                     |

**Ordering rationale:** claim → proof → claim → proof. Awards sit immediately after Experience because recognition lands hardest right after the work it came from.

### 6.2 About — `/about`

- Long-form introduction, journey sections, what drives the work — `site.about.long` + `journey[]`
- **Full skill matrix**: every skill, grouped by category, searchable across names _and_ aliases. Each pill opens the same evidence modal as the home page
- Full certification list beneath the matrix — certifications are skill evidence, so they belong beside skills

### 6.3 Experience — `/experience`

**v1 (default, always available):** chronological timeline grouped by `LifePhase` — Bachelor's, Master's, UBS, etc. Merges Experiences, Engagements and Awards into one lane. Cards open the same detail modals. Server-rendered and fully crawlable.

**v2 (Phase 6, opt-in):** the 3D corridor — a Tron-styled luminous path curving through darkness, camera flight driven by damped scroll input along a spline. Doors along the path carry `LifePhase` labels; clicking pans the camera in and reveals that phase's content; closing pans back out and returns scroll control.

**Non-negotiable rules for the 3D view:**

- The 2D timeline is never removed. It is the SEO surface, the accessibility surface, and the fallback.
- A persistent, obvious **"Timeline view"** toggle, remembered in `localStorage`.
- Touch devices default to 2D.
- `prefers-reduced-motion` defaults to 2D.
- All three.js code is dynamically imported, `ssr: false`, and never enters the shared bundle.

### 6.4 Projects — `/projects`

Scattered card layout echoing the home page, reusing `ProjectCard variant="grid"` (flat, untilted, no scroll-scrub). Client-side search across title, summary and skill names; filter chips by skill and status. Cards open project modals.

### 6.5 Blog — `/blog`

Index of STAR "Success Stories" with type filters. `/blog/[slug]` renders the full MDX story, optionally displayed in labelled Situation / Task / Action / Result blocks when `story.star` is populated. Reading time, related project and experience links, prev/next navigation.

Source material: an existing 17-page STAR document, converted to MDX once and thereafter maintained through the admin panel.

### 6.6 Admin — `/admin`

Auth-gated (Firebase Auth, single user). Own layout: sidebar, no splash, no navbar, no custom scrollbar.

- **Dashboard** — counts, drafts, unread enquiries, and integrity warnings: orphan skills, dangling skill references, unevidenced soft skills
- **CRUD** for every entity, with forms generated from the Zod schemas
- **Skill multi-select** with search wherever `skillIds` appears — makes typos structurally impossible
- **Featured manager** — drag to reorder per section, live home-page preview, warning when more than the section limit is flagged
- **Markdown/MDX editor** with preview for all `body` fields
- **Draft / publish** toggle, with token-gated preview URLs
- **Inbox** for contact submissions with status transitions
- Every save calls `updateTag("content")` — changes are live within seconds and visible immediately to the person who made them

### 6.7 Contact flow

Triggered from three places — navbar "Let's Talk", CTA "Get in Touch", footer — all dispatching the same `{kind:"contact"}` modal. One form, one code path, one instance in the DOM.

Fields: Name*, Company, Role, Contact*, Message\*.
On submit → `POST /api/contact` → Zod validation → stored in Firestore → email via Resend from the verified subdomain, `reply-to` set to the visitor's address.
Spam defence: honeypot field, rate limit, Cloudflare Turnstile.
An escape hatch link offers a plain `mailto:` for anyone who'd rather write their own email.

---

## 7. Content entities

Full TypeScript definitions live in `PROJECT_PLAN.md` §3.2. Summary of what exists and how it relates:

| Entity                | Holds                                             | Points at                                |
| --------------------- | ------------------------------------------------- | ---------------------------------------- |
| **Skill**             | the canonical technical vocabulary                | _nothing_ — everything points at it      |
| **Project**           | title, summary, body, status, dates, links        | `skillIds`, optional `experienceId`      |
| **Experience**        | role, org, type, dates, body, achievements        | `skillIds`, `phaseId`                    |
| **Engagement**        | non-technical / leadership activity               | `skillIds`, `phaseId`                    |
| **Story**             | STAR narrative, MDX body                          | `skillIds`, related projects/experiences |
| **Award**             | recognition — the _fact_                          | source experience/projects, `storyId`    |
| **SoftSkill**         | a claim about how you work                        | evidence stories/experiences/engagements |
| **Certification**     | credential, issuer, dates                         | `skillIds`                               |
| **LifePhase**         | a chapter — drives timeline grouping and 3D doors | _nothing_                                |
| **SiteContent**       | hero, about, socials, availability, SEO           | _nothing_                                |
| **ContactSubmission** | inbound enquiries                                 | _nothing_                                |

**Award vs Story — they are not the same thing.** An Award is the fact (one line: what, from whom, when). A Story is the narrative (500–1500 words, STAR-structured). _"4th Place at Tracer Fire 13"_ is an Award; the write-up of how that placement was earned is a Story that the Award points to.

**Universal fields:** every content entity carries `featured: boolean`, `order: number`, and (except SoftSkill and Certification) `visibility: "public" | "draft"`.

---

## 8. Standing conventions

These apply to every future change. They exist so that decisions don't have to be re-litigated.

1. **No literal content in components.** Ever. If a string appears on screen, it came from the repository.
2. **No skill names outside `skills.ts`.** Everything references `skillIds`.
3. **Dates are `{year, month}`,** never display strings. `formatDateRange()` renders them.
4. **Icons are string keys** resolved through `lib/icons.ts`. Never React components in data.
5. **Colours come from `@theme` tokens.** No new hex literals in components.
6. **Server Components by default.** `"use client"` goes on the animated leaf, not the section.
7. **Never call a hook inside `.map()`.** One hook call per component instance. `react-hooks/rules-of-hooks` is an ESLint **error**.
8. **Reverse relationships are computed, never stored.**
9. **`featured` count limits live in the query layer** (`FEATURED_LIMITS`), never in the data.
10. **Every phase leaves `main` deployable.** The site is public; never break the homepage to build a feature.
11. **`LocalRepository` stays working forever** — offline dev mode and provider escape hatch.
12. **The 2D timeline is never removed** in favour of the 3D view.
13. **Update this document in the same commit** as any behaviour change.

---

## 9. Build status

| Area                                          | Status                                                |
| --------------------------------------------- | ----------------------------------------------------- |
| Splash → navbar transition                    | ✅ Built                                              |
| Navbar, footer, social rail, custom scrollbar | ✅ Built                                              |
| Hero section                                  | ✅ Built, content approved                            |
| About card                                    | ✅ Built, content approved                            |
| Home sections 3–10                            | ⚠️ Built as UI, hardcoded content, several inaccurate |
| Skill → project/experience linking            | ❌ Not started — needs the ID model                   |
| Achievements & Awards section                 | ❌ Not started                                        |
| Soft-skill evidence linking                   | ❌ Not started                                        |
| Global modal system                           | ❌ Not started — modal state is trapped inside cards  |
| Content repository / typed schema             | ❌ Not started                                        |
| Firestore backend                             | ❌ Not started                                        |
| Admin panel                                   | ❌ Not started                                        |
| `/about`, `/projects`, `/experience`, `/blog` | ❌ `UnderConstruction` placeholders                   |
| 3D corridor                                   | ❌ Not started (Phase 6, optional)                    |
| SEO: OG images, sitemap, structured data      | ❌ Not started                                        |

**Known live defects:** placeholder GitHub/demo/email URLs in production; two Rules-of-Hooks violations that will crash the page once content length varies; `Inter` font not actually applied (a stray `font-family: Arial` in `globals.css` overrides it).

Full detail in `PROJECT_PLAN.md` §1.3–1.4.
