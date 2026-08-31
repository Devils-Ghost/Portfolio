# Plan Progress — Execution Log

**Companion to:** `project-plan.md`
**Purpose:** `project-plan.md` stays a clean, forward-looking plan — checkboxes and settled decisions only. This file holds everything that only exists *because* a phase was actually executed: corrections found mid-build, review-pass findings, and places where the plan changed its mind. Read it when you want the story of how a phase went; read the plan when you want to know what's next.

Organized by phase, in the order it was written.

---

## Phase 0 — Foundation

### Corrections found while executing this phase

1. **`next build` does not run ESLint.** Next 16 removed lint from the build alongside `next lint`, so the build passed cleanly despite 16 lint errors. The separate `lint` step in CI is load-bearing, not belt-and-braces.
2. **The lint baseline was 21 problems, not 2.** `eslint-config-next@16.2.10` pulls in `eslint-plugin-react-hooks@7`, which ships the React Compiler ruleset — `set-state-in-effect`, `purity`, `immutability` and friends, all at `error`. Budget for this if a future phase adds components.
3. **§1.4 #8's Inter claim was wrong.** The plan originally flagged "you're not actually rendering in Inter" as an issue. Investigation during Phase 0 found this was a misdiagnosis: both CSS rules in `globals.css` were unlayered, so `next/font`'s CSS-module class (specificity 0,1,0) already beat the `body` element selector (0,0,1) — body text was always Inter. The only thing genuinely in Arial was `SplashScreen`, which hardcoded it as an **inline style**, the one thing that could beat the class. Removing that inline style is what makes the splash → navbar `layoutId` transition render in one typeface. (The plan's §1.4 table now states the corrected fact directly.)

### Other execution notes

**Accent tokens were done differently to §D6.** The plan called for extracting hex literals into `@theme`. In practice, the ~100 `blue-*` references in the codebase weren't hex literals — they were already Tailwind tokens. Redefining `--color-blue-{300,400,500,600,900}` in `@theme` (seeded with v4's exact defaults) made them "ours" with zero call-site churn, and retuning the accent is now a five-line edit. `--color-accent` / `--color-accent-soft` exist as semantic aliases for new code.

---

## Phase 1 — Content layer

### Four notes from executing this phase

1. **The section split that D4 actually produces — superseded by note 6, below.** Initial expectation: six of nine home sections would become plain Server Components, with Technical Arsenal, Featured Work, and Certifications keeping a client view (`SkillsArsenal`, `ProjectsBoard`, `CredentialsGrid`) because each drives its whole section off one `useScroll` on its own element. What actually happened: Technical Arsenal and Featured Work converted to play-once entrances during the phase's review pass and lost their client views entirely (`SkillsArsenal`, `ProjectsBoard` are gone). Only `CredentialsGrid` still holds a section-level `useScroll` — its scrubbed entrance was a deliberate keep, not an oversight — so it's the one section where D4's escape clause (client parent, only for the animation) still applies. Net result: seven of nine home sections are now plain Server Components; the other two — `CredentialsGrid`, plus `EngagementAccordion` / `SuccessStoriesShowcase` / `ContactCallout` for state rather than animation — are covered in note 6.
2. **`react-hooks/static-components` rejects the obvious icon-registry call site.** `const Icon = ICONS[name]` inside a component is indistinguishable, to the React Compiler, from defining a component during render. Both registries are therefore reached through a wrapper that uses `createElement` — `components/ui/ContentIcon` for `iconName`, `SocialMark` for social kinds. Worth knowing before Phase 2 adds more icon-driven UI.
3. **Two `FEATURED_LIMITS` disagree with §7.1's table**, which was written before the taxonomy existed. §7.1 says 8 skills and 4 soft skills; the constants say 12 and 5, and the constants win — §3.3 makes them the single place a section's count is decided. `check:content` warns that 13 skills and 7 soft skills are flagged `featured` against those limits, which is the mechanism working as designed: the extras are simply not shown.
4. **`npm run format:check` was failing on all twelve files under `src/content/` before this phase started** — the hand-formatted data files had never been through Prettier, and CI runs that step. Formatting them was unavoidable, so `src/content/local/stories.ts` is reformatted too. No wording changed anywhere.

### Four more, from the review pass at the end of the phase

5. **`ProjectCard`'s `variant: "pinned" | "grid"` was removed.** It was written ahead of the `/projects` page and no call site ever passed `"grid"`, so every branch it guarded — a second hover treatment, a second sizing rule, force-disabling `baseRotation` and the entrance — was dead code that still had to be read and reasoned about on every edit. The card is unconditionally the pinned treatment now. Bring the split back when `/projects` is actually designed (§7.5), by which point the grid card's real requirements will be known rather than guessed.
6. **Entrance animations play once; they no longer scrub.** Technical Arsenal and Featured Work were scrubbed by the scrollbar, so scrolling back up ran them in reverse — the page visibly undoing itself, and inconsistent with every other section, which already used `whileInView` with `once: true`.

   Two things fell out of that. The Technical Arsenal **bug** disappeared: each pill's window was `0.1 + index * 0.08` wide by `0.2`, measured against the section's scroll progress, so past about ten pills the last few had windows starting at 0.98 or beyond — they arrived at partial opacity, or never arrived at all. A time-based `staggerChildren` has no such ceiling, whatever `FEATURED_LIMITS.skills` grows to. And both sections lost their client halves (`SkillsArsenal`, `ProjectsBoard`), which existed only to hold the `ref` that `useScroll` needed.

   The remaining client components under `sections/home/` are there for **state**, not animation: `EngagementAccordion` (which card is open), `SuccessStoriesShowcase` (which story is selected, plus a genuinely scroll-linked carousel indicator), and `ContactCallout` / `CredentialsGrid`, whose scrubbed entrances were deliberately kept.

7. **Motion settings moved to `components/motion/variants.ts`** (`fadeUp`, `fadeUpDelayed`, `staggerParent`, `staggerItem`), per §4. Ten call sites were about to repeat the same four props; retuning the easing is now one edit, and a section added later can't quietly arrive at a different speed.
8. **Experience gained `highlights`, and `body` became optional** — the same split Project already had. Every experience body was a list of `- ` bullets pretending to be prose. `components/ui/HighlightList` renders them for both entities, and `BodyText` — which existed only to tell those two shapes apart — was deleted; project bodies are one paragraph each, so the modal renders a `<p>`. Phase 2's engagement modals have four-paragraph bodies and will want a real renderer, which Phase 5's MDX work supersedes anyway.

   `ResourceLink` rendering also split by kind while this was open: `github`, `live`, `video` and `external` open a new tab; `report`, `paper` and `credential` are direct-download URLs and must not, because `target="_blank"` on a download opens a tab that immediately goes blank and sits there.

### Content/design decisions revised mid-phase

These were originally recorded elsewhere in the plan (§7.1 Home page spec, §10 open decisions) with their revision history inline. That history lives here now; the plan itself states only the resolved outcome.

**Awards section placement (§7.1).** The plan's original recommendation was to place the new Achievements & Awards section between Experience (1.5) and Leadership & Engagement (1.6) — proof landing right after the claim it supports. It was built there first during Phase 1. It lost to a stronger arrangement on the actual page: Certifications, Beyond the Code, and Awards are all *credentials*, and reading them as one group beat reading Awards as an interruption between Experience and Engagement. Result: 1.8 and 1.10 became one section, `CertificationsSection`, with three sibling panels in a grid (Certifications + Beyond the Code side by side, Awards centred beneath) rather than two sections in sequence — because two separate sections each carrying `py-16` put far more visual air between the top pair and the awards panel than between the pair themselves, undermining the "these three belong together" read.

**Awards visual treatment (§7.1, §10 open item).** The plan's original recommendation was a wrapping strip of compact chips. It shipped that way first, then was replaced the same phase: the chip strip looked like scaffolding next to the two polished modules beside it — inconsistent type scale, plain boxes, awards rendering smaller than the heading above them. Replaced with the panel treatment its siblings already used — all three panels now compose from one `components/ui/ModulePanel`, differing only in accent hue (blue / indigo / cyan) and contents, so they stay visually matched as they're edited rather than by anyone remembering to keep them so. This closed what §10 had listed as an open decision deferred to Phase 5 — it was decided in Phase 1 instead, on the reasoning that a live public site shouldn't carry a section that reads as unfinished.

The section also picked up a title it had shipped without — **"Credentials & Caliber"** — which closed a bare gap between Success Stories and the panels below it.

**Hero headline (§10 open item).** Still genuinely open (not resolved in Phase 1) — but the wiring happened this phase: the hero now reads its headline from `site.hero.headlines` instead of a hardcoded string, with both existing variants kept verbatim so wiring changed nothing visible. The open question — whether to use *"I break systems to learn how to build them better"* here, given it's already doing duty in the About card — is unchanged and re-parked for the Phase 5 About-page design pass.

---

## Phase 2 onward

Not yet executed. No progress notes yet — add a section here per phase as it's completed, following the same pattern: what the plan got right, what it got wrong, and what changed as a result.
