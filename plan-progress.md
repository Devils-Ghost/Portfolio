# Plan Progress — Execution Log

**Companion to:** `project-plan.md`
**Purpose:** `project-plan.md` stays a clean, forward-looking plan — checkboxes and settled decisions only. This file holds everything that only exists _because_ a phase was actually executed: corrections found mid-build, review-pass findings, and places where the plan changed its mind. Read it when you want the story of how a phase went; read the plan when you want to know what's next.

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

**Awards section placement (§7.1).** The plan's original recommendation was to place the new Achievements & Awards section between Experience (1.5) and Leadership & Engagement (1.6) — proof landing right after the claim it supports. It was built there first during Phase 1. It lost to a stronger arrangement on the actual page: Certifications, Beyond the Code, and Awards are all _credentials_, and reading them as one group beat reading Awards as an interruption between Experience and Engagement. Result: 1.8 and 1.10 became one section, `CertificationsSection`, with three sibling panels in a grid (Certifications + Beyond the Code side by side, Awards centred beneath) rather than two sections in sequence — because two separate sections each carrying `py-16` put far more visual air between the top pair and the awards panel than between the pair themselves, undermining the "these three belong together" read.

**Awards visual treatment (§7.1, §10 open item).** The plan's original recommendation was a wrapping strip of compact chips. It shipped that way first, then was replaced the same phase: the chip strip looked like scaffolding next to the two polished modules beside it — inconsistent type scale, plain boxes, awards rendering smaller than the heading above them. Replaced with the panel treatment its siblings already used — all three panels now compose from one `components/ui/ModulePanel`, differing only in accent hue (blue / indigo / cyan) and contents, so they stay visually matched as they're edited rather than by anyone remembering to keep them so. This closed what §10 had listed as an open decision deferred to Phase 5 — it was decided in Phase 1 instead, on the reasoning that a live public site shouldn't carry a section that reads as unfinished.

The section also picked up a title it had shipped without — **"Credentials & Caliber"** — which closed a bare gap between Success Stories and the panels below it.

**Hero headline (§10 open item).** Still genuinely open (not resolved in Phase 1) — but the wiring happened this phase: the hero now reads its headline from `site.hero.headlines` instead of a hardcoded string, with both existing variants kept verbatim so wiring changed nothing visible. The open question — whether to use _"I break systems to learn how to build them better"_ here, given it's already doing duty in the About card — is unchanged and re-parked for the Phase 5 About-page design pass.

---

## Phase 2 — Interaction system

### Scope actually built

The Phase 2 checklist (§6) names four modal kinds by name — `project`,
`experience`, `skill`, `contact` — and that's what shipped. `DetailTarget`
(§3.5) is declared as the full eight-kind union, since it's cheap and it's
the settled type-level contract, but `MODAL_REGISTRY` in
`components/modals/registry.tsx` only has entries for those four. Nothing in
the app dispatches `engagement`, `story`, `award` or `softskill` yet —
`EngagementCard`'s click still only toggles the accordion, and Awards/Beyond
the Code are still plain lists — so this isn't a gap so much as those kinds
not existing yet. `LinkedItemsBody` (the skill "used in" modal, named
`EvidenceBody` in §3.5 — see the naming note below) already returns
`engagement` and `story` usages from `usagesOfSkill()`, since that selector
predates this phase; it renders those two groups as plain, non-interactive
rows rather than dead buttons, and switches automatically to real links the
day those kinds get entries in the registry — no change needed here when
that happens.

### Naming deviation from §3.5: `EvidenceBody` → `LinkedItemsBody`

§3.5's `REGISTRY` sketch names the shared `skill`/`softskill` body
`EvidenceBody`. Shipped as `LinkedItemsBody` instead, after a round of
back-and-forth on whether a narrower, skill-specific name would read better:
it wouldn't. `Skill` and `SoftSkill` are unrelated entities in the content
model — no shared parent type, no overlapping fields, and driven by two
different selectors (`usagesOfSkill()` against `skillIds` membership vs.
`evidenceFor()` against three separate `evidence*Ids` fields on `SoftSkill`).
"Hard skills" and "soft skills" are conventionally two separate axes, not one
a kind of the other, and the content model encodes them that way. A name like
`SkillBody` would read as skill-specific and mislead the day it's handed a
`softskill` target. `LinkedItemsBody` names the shared UI pattern (a grouped,
clickable list of related entities) instead of either entity, which is what
was actually shared. `Modal` and `ProjectModalBody`/`ExperienceModalBody`
keep their §3.5 names — this rename was scoped to the one component whose
name didn't hold up under the question.

### Notable decisions made while building this

1. **Modal-to-modal navigation rides real browser history instead of a
   hand-rolled stack.** §3.5 describes "a small history stack in the modal
   context — push on open, pop on back, clear on close." Built literally, an
   in-memory array duplicates state the browser already tracks and can
   desync from it (a raw hardware Back bypasses whatever array we're
   maintaining). Instead, `open()` calls `router.push()` for every modal
   open — each one a real history entry — so the in-modal Back button and
   the browser's own Back button do the same thing: `router.back()`. A
   small `depthRef` counter (incremented on open, decremented on `popstate`)
   is the only bookkeeping left, and it exists purely to decide whether Back
   should be offered at all versus falling through to Close — a modal
   opened from a fresh deep link has nothing behind it to return to.
2. **`force-dynamic` on `(site)/layout.tsx`, ahead of Phase 3.** "Deep-linked
   modals render server-side" needs the route rendered per request, not
   statically generated at build time — otherwise `?d=project:x` only
   resolves after client-side hydration reads the query string, which is
   exactly the outcome the requirement rules out. Phase 3's `cacheComponents`
   - `"use cache"` + `cacheTag`/`cacheLife` is the real fix (per-content-tag
     caching instead of an all-or-nothing switch); `force-dynamic` is a
     correct, honest stand-in until that infrastructure exists, called out
     explicitly in the layout's own comment so it isn't mistaken for the
     finished caching story.
3. **`DetailModalHost`'s context provider sits outside its own `useSearchParams()`
   read.** The first cut wrapped the whole component — `children` included —
   in one `<Suspense>` boundary reading `?d=`. That crashed `next build`:
   during static generation Next renders the Suspense `fallback`, which was
   `children`, and everything under it calls `useDetailModal()` with no
   provider mounted yet. Fixed by splitting `DetailModalHost` in two: the
   outer component owns `open`/`close`/`back`/`canGoBack` (none of which need
   `?d=` to be _defined_, only `router` and `pathname`) and provides context
   around `children` unconditionally; a small inner `ModalRenderer`, the only
   piece that calls `useSearchParams()`, is Suspense-wrapped separately and
   receives `close`/`back`/`canGoBack` as props rather than re-deriving them.
4. **Two ref-mutation-during-render attempts got rejected by
   `react-hooks/set-state-in-effect` and `react-hooks/refs`** (the React
   Compiler ESLint rules Phase 0 turned on as errors — see that phase's notes
   on the 21-problem baseline). The "hold the previous target to detect a
   change" bookkeeping in `ModalRenderer` now follows the pattern from
   [react.dev's "adjusting state when a prop changes"](https://react.dev/learn/you-might-not-need-an-effect#adjusting-some-state-when-a-prop-changes)
   exactly — comparing against a `useState`-held previous value and calling
   setters conditionally in the render body, never inside `useEffect`, and
   never writing a ref during render. One consequence: the `depthRef`
   back-button counter is _not_ forcibly reset to `0` when `target` goes
   null by some route other than the host's own `close()`/`back()` (a
   hardware Back that jumps multiple entries at once) — refs can't be
   written during render, and the visible state (`canGoBack`) is still
   corrected via `setCanGoBack(false)` either way. The only drift possible is
   `back()` choosing `router.back()` once when `close()` would have been
   marginally more precise, in a multi-jump edge case outside anything the
   Phase 2 exit criteria exercise.
5. **`ProjectCard` and `ExperienceCard` lost their `skills` prop entirely**,
   not just their inline `<Modal>`. Both only ever used the resolved skill
   list inside the modal that used to live in the card; now that
   `ProjectModalBody`/`ExperienceModalBody` resolve chips themselves against
   the content bundle `DetailModalHost` already holds, `ProjectsSection` and
   `ExperienceSection` stopped fetching `skills` at all — one fewer
   repository call per section, and one fewer thing the card needs to know.
6. **`SkillPill` now dispatches its own click** — `useDetailModal().open({kind:"skill", id})`
   — instead of accepting an `onClick` prop from whoever renders it. Every
   pill on the site is going to open the same evidence modal (site-behavior
   §6.2: `/about`'s full matrix explicitly reuses "the same evidence modal as
   the home page"), so wiring it once here beats repeating the same
   `onClick={() => open(...)}` at every future call site.
7. **`ExperienceModalBody` gained `achievements` and `links` rendering that
   `ExperienceCard`'s old inline modal never had.** Both fields already
   existed on `Experience` — `achievements` populated on one record since
   Phase 1 ("retained for a distinct UI treatment," per that file's own
   comment) and `links` since the type was written — but nothing rendered
   them. `site-behavior.md` §4.6 already specs `ExperienceModalBody` as
   carrying achievements and links, so this is completing the settled
   design, not adding scope. Achievements render as a small badge row
   labelled "Recognition," visually distinct from the bullet `HighlightList`
   above it; links reuse the existing `ResourceLinks` component untouched.
8. **`ProjectModalBody`'s width moved from `max-w-2xl` to `max-w-3xl`.**
   `max-w-2xl` was what `ProjectCard`'s original inline `<Modal>` used;
   `site-behavior.md` §4.6's table specs `project` at `max-w-3xl` (wider,
   "video embed + skill chips") against `experience` at `max-w-2xl`. No video
   embed shipped this phase (not in the §6 Phase 2 checklist), but the width
   now matches the settled spec regardless, so the class doesn't need to
   change again the day a video embed does. **Superseded a few days later —
   see note 10.**
9. **`ClientWrapper` collapsed; `MainLayout` split into its own file.**
   `ClientWrapper` had shrunk to a pure pass-through — `IntroProvider`
   wrapping a `MainLayout` function, forwarding `socials` — after
   `DetailModalHost` took over the actual provider-composition role at the
   top of the tree. `(site)/layout.tsx` now composes `DetailModalHost` and
   `IntroProvider` directly (there are exactly two `(site)`-scoped
   providers, and nothing on the roadmap adds a third — Phase 3/4's
   additions are server-only or `(admin)`-scoped), and `MainLayout` — the
   splash/navbar/footer/scrollbar/rail chrome that consumes `IntroContext` —
   moved to its own `components/layout/MainLayout.tsx`. Not a §3.5
   requirement; a straightforward simplification once `ClientWrapper` had
   nothing left to justify its own file.
10. **Per-kind modal width dropped for one shared `MODAL_WIDTH` constant.**
    §3.5's `REGISTRY` sketch gives each kind its own width (`project` at
    `max-w-3xl`, `skill`/`softskill`/`contact` at `max-w-lg`, the rest at
    `max-w-2xl`); note 8 above initially followed that. Changed to one
    `max-w-2xl` for every kind, on the reasoning that visual consistency
    across modals mattered more than sizing each to its content — a skill
    "used in" list at `max-w-lg` reads as a visibly different, narrower
    class of thing next to a `max-w-3xl` project modal, which undercuts "one
    modal system" more than a slightly-too-wide list view costs. The
    `width` field was removed from `RegistryEntry` entirely rather than left
    unused; both `registry.tsx` and `DetailModalHost.tsx` carry a comment
    pointing at where to reintroduce a per-entry `width` if a kind
    genuinely needs to differ later.
11. **The accent bar moved from each body component into `Modal` itself,
    as a shared header.** Every body (`ProjectModalBody`, `ExperienceModalBody`,
    `LinkedItemsBody`) opened with its own `<div className="w-12 h-1
bg-blue-500 rounded-full mb-6" />` — copied three times, and `contact`
    never had one at all. Moved into `Modal`, rendered once, above a
    Back/Close row, both now in normal document flow instead of absolutely
    positioned. This fixed a real bug, not just a duplication smell: Back
    (`absolute top-6 left-6`) and the accent bar (each body's first,
    flush-to-top element) landed in the same visual row, so "← Back" and
    the blue bar overlapped whenever a modal had one open beneath it. An
    earlier attempt patched this with a conditional `pt-14` on the panel
    when `onBack` was set — sufficient to stop the overlap, but the bar
    still rendered _under_ Back rather than above it, which wasn't what the
    chrome was supposed to look like. The header restructure replaced that
    patch outright: `[accent bar] → [Back / Close row] → [body content]`,
    entirely in flow, so nothing before or after it can overlap regardless
    of what a given body renders first. `contact` picked up the accent bar
    for free as a side effect; its heading's stale `pr-8` (defending against
    the old absolutely-positioned Close button) came out too, since Close no
    longer overlaps anything.
12. **A runtime crash the lint rules didn't catch: cross-component
    `setState` during render.** The `DetailModalHost` / `ModalRenderer`
    split in note 3 passed `canGoBack`'s setter down as a prop so
    `ModalRenderer` could react to `?d=` changing. The render-time
    "adjusting state when a prop changes" pattern from note 4 was applied
    to that setter too, which React explicitly disallows for a _different_
    component's state — "Cannot update a component while rendering a
    different component," thrown the first time a click actually exercised
    that path, since neither `tsc` nor `react-hooks/*` catch it (it's a
    runtime invariant, not a static one). Fixed by moving that one call into
    a `useEffect(() => { if (target === null) setCanGoBack(false); },
[target, setCanGoBack])` in `ModalRenderer` — calling a parent's setter
    from a child's effect is the standard "notify an ancestor of a change"
    pattern and doesn't trip `set-state-in-effect` (that rule targets a
    component setting _its own_ `useState` value from an effect when it
    could derive it during render instead; a prop function is invisible to
    it). `renderedTarget`'s update — genuinely local to `ModalRenderer` —
    stayed as the render-time adjustment; only the foreign setter moved.
13. **`canGoBack` now requires history depth `> 1`, not `> 0`.** Originally
    any `open()` call set `canGoBack` to `true` unconditionally, so the
    _first_ modal opened from a bare page (no `?d=` yet) also showed a Back
    button — but there's no previous modal underneath it there, only the
    page, so Back and Close did exactly the same thing. `canGoBack` is
    reserved for a genuine previous modal now (skill → project → _then_
    Back appears) — `open()` sets it from the post-increment depth
    (`depthRef.current > 1`), `back()` and the `popstate` handler check the
    same threshold instead of `> 0`.

---

## Phase 3 — Backend

### Collaboration mode changed for this phase

Starting Phase 3, execution switched from "AI writes, owner reviews" (how
Phases 0–2 went) to pair programming with the owner writing the actual
implementation for new concepts, one small piece at a time, reviewed before
moving on. Config/console-only steps (Firebase project setup, service
account generation) stayed a guided walkthrough since there's nothing to
learn in clicking through a dashboard. This note exists so a future read of
this log doesn't mistake the smaller, more incremental commits in this phase
for a change in scope rather than a change in process.

### Deviation from the plan: Google Sign-In instead of email/password

§6 Phase 3's checklist says "Auth (email/password, single user)." Built
instead with **Google Sign-In** (`dtanna2@asu.edu`), for login convenience.

The tradeoff this creates: Google Sign-In is not single-user by construction
the way a manually-created email/password account is — by default, any
Google account can authenticate against a Firebase project. The single-user
guarantee moves from "there is exactly one account" to an app-level check,
deferred to Phase 4: after sign-in, compare the authenticated user's
Firebase UID against an `ADMIN_UID` env var before granting `/admin` access.
UID was chosen over email as the allowlist key since Firebase issues it once
and it never changes, unlike email which could have casing/normalization
edge cases.

That UID doesn't exist yet and can't be captured yet — Firebase only creates
a user record (and assigns a UID) for a Google-provider account on its first
successful sign-in through the app, and the console has no "add user"
equivalent for a federated provider the way it does for email/password. So
this is a real TODO for whoever opens Phase 4: sign in once as
`dtanna2@asu.edu` through the admin login page once it exists, read the
resulting UID from Firebase Console → Authentication → Users, and set it as
`ADMIN_UID`.

### Stage 1 — Firebase project

Project created, Firestore enabled (production-mode start), Google Sign-In
configured as the only provider, security rules published exactly as §D3
specifies — deny-all, no exceptions, since every read and write is meant to
go through the Admin SDK server-side.

### Stage 2 — Admin SDK wiring

Service account key generated from Firebase project settings, its three
fields (`FIREBASE_PROJECT_ID`, `FIREBASE_CLIENT_EMAIL`, `FIREBASE_PRIVATE_KEY`)
extracted into `.env.local` via a one-off script rather than hand-copied,
specifically so the private key's contents never had to pass through chat —
only the three variable names were ever printed. `content/firestore/client.ts`
is a lazy singleton (`getDb()`): `getApps()[0]` reuse avoids a
"app already exists" crash under Next's dev-server hot reload, and
`requireEnv()` fails at the boundary with the missing variable's name rather
than letting `firebase-admin` fail deeper with a cryptic error. Verified live
against the real (empty) project with a throwaway script before moving on.

### Stage 3 — `FirestoreRepository`

Implements `ContentRepository` (the same interface `LocalRepository`
satisfies, per §D1) against real Firestore reads, wired into
`getRepository()`'s existing provider switch behind `CONTENT_SOURCE=firestore`.

Two decisions worth recording:

1. **`SiteContent` is five documents, not one.** §3.6 already specified this
   (fixed IDs `hero`/`about`/`socials`/`availability`/`seo` under `/site`),
   confirmed here rather than collapsed to one document, because Phase 4's
   admin panel will have one form per section — five documents means each
   form's save only touches its own document, with no read-modify-write
   contention against the others.
2. **No instance-level cache in `FirestoreRepository`, unlike
   `LocalRepository`'s `this.cached`.** `LocalRepository`'s cache is safe
   only because a TS module can't change under a running process.
   `FirestoreRepository`'s data changes whenever the admin panel writes to
   it, and this class has no way to know when that happens — that
   invalidation hook belongs to Stage 5's Cache Components
   (`"use cache"` + `cacheTag("content")`, actually revocable on write). A
   first draft of `getContent()` added the same `this.cached` pattern by
   analogy with `LocalRepository`; caught in review and removed before
   commit, on the reasoning above.

`parseCollection`'s array-wrapping helper (previously a private `parse()`
inside `repository.ts`, used only by `LocalRepository`) moved to
`schema.ts` as an exported `parseArray()`, so `FirestoreRepository` could
reuse the exact same boundary-validation pattern instead of duplicating it
in a second file.

Each of the eleven `ContentRepository` methods reads independently
(`loadCollection()` per call) rather than all routing through `getContent()`,
because every home section currently calls its own single-collection getter
directly (`getSkills()`, `getProjects()`, etc.) — only the modal system's
cross-linking selectors need the whole joined bundle. Routing everything
through `getContent()` would have meant every section triggering a full
eleven-collection fetch to render one collection's worth of content.

Verified end-to-end against the real, still-empty Firestore project:
`getSkills()` correctly returns `[]`; `getContent()` fails loudly, naming
every missing field under "site" — §D7's boundary validation catching the
not-yet-seeded state exactly as designed, ahead of Stage 4's seed script.

### Stage 4 — Seed script

`scripts/seed-firestore.ts` pushes `content/local/*` into Firestore via
`LocalRepository.getContent()` (already Zod-validated, so the seed can't
push malformed data even if a local file were wrong) and one `WriteBatch`
covering all 124 documents — comfortably under Firestore's 500-writes-per-
batch limit, so no chunking needed. Idempotent by construction: every write
is `batch.set(collection.doc(item.id), item)` against the stable,
human-readable IDs from §3.3.5, so re-running produces the same end state
rather than duplicates — verified directly by running it twice and
confirming identical counts back through `FirestoreRepository`. Upsert
only, deliberately: it will never delete a Firestore doc whose local
counterpart was removed, since ongoing content lifecycle is Phase 4's job,
not a one-time bootstrap script's.

Two real bugs surfaced and were fixed before anything wrong reached
Firestore:

1. **The batch was built but never used.** A first draft created
   `const batch = db.batch()` and correctly called `batch.commit()` at the
   end, but every individual write called `.set()` directly on the
   `DocumentReference` (`db.collection(x).doc(id).set(item)`) instead of
   `batch.set(ref, item)` — a different method that fires an independent,
   unawaited write immediately rather than queuing onto the batch. This
   would have logged "Seed complete." before (or regardless of whether) the
   124 real writes had actually finished, thrown an unhandled promise
   rejection on any individual failure, and lost the atomicity the batch
   existed for. Caught in review before running it; fixed by routing every
   write through `batch.set()`.
2. **`content.site.socials` is an array, and Firestore document data must
   be a map at its root.** `socials: SocialLink[]` is the one `SiteContent`
   key that isn't an object, so writing it directly as a document threw
   `Input is not a plain JavaScript object` — caught by Firestore's
   client-side validation before any network call, so nothing partial ever
   landed. A first fix attempt misread the problem as "give each social
   link its own document," keyed by `social.id` — but `SocialLink` has no
   `id` field, so `.doc(undefined)` would have silently auto-generated a
   random ID per run, breaking idempotency for exactly the reason IDs were
   supposed to prevent it, and splitting one logical list across N
   documents that `loadSiteContent()` has no way to reassemble. Fixed
   instead by wrapping the array once (`{ items: content.site.socials }`)
   on the write side, with a matching unwrap (`snapshots[2].data()?.items`)
   added to Stage 3's `loadSiteContent()` — the two sides have to agree on
   the wire shape, so the fix touched both files.

Verified end-to-end: seeded all 124 documents, read them back through
`FirestoreRepository.getContent()` and confirmed every collection's count
matches `content/local` exactly, confirmed `socials` round-trips correctly
through the wrap/unwrap, and confirmed a second run leaves every count
unchanged.
