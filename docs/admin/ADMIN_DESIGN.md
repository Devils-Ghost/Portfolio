# Admin Panel — Design Document

**Phase:** 4
**Companion files:** `admin-mockups.html` (eight sections, rendered in the real palette, with live hover/press/focus), `../site-behavior.md` §6.6, `../project-plan.md` §6 Phase 4
**Status:** design direction, settled in discussion, revised once against design-engineering review. Expect it to evolve during the build; update this file in the same commit when it does.

This document covers what the admin panel should look like and how it should behave. It does not cover data model, auth, or caching, all of which are already settled elsewhere.

---

## 1. What this is for

A single-user CMS for a personal portfolio. One person, editing their own content, a few times a month, mostly from a desktop and occasionally from a phone.

That usage shape drives every decision below. There is no team, no permissions model, no audit trail, and no volume. What there is instead is a long gap between sessions, which means the panel's real job is to tell you where you left off and what is quietly broken, not to move records efficiently at scale.

**The governing constraint:** it should be easy on the eyes and easy on the mind. Not cramped. Not a spreadsheet. Editing content should feel like editing content, not like operating a database front end.

---

## 2. Foundations

The admin panel uses the public site's visual language. Same palette, same type scale, same radii. It should look like part of the same product.

Everything in this section is a scale with defined steps. The first revision of this design used roughly fifteen distinct font sizes and off-grid spacing values (17px, 13px, 9px, 2.5px), which is what makes a layout read as assembled by eye rather than built from a system. A reviewer cannot tell you why 13px is wrong; they can only tell you the whole thing looks slightly amateur. The fix is upstream of any individual screen.

### 2.1 Type scale — seven steps

Tracking is **size-specific**, not one value applied everywhere: letters read too far apart as text grows, and too tight as it shrinks. Leading moves inversely to size.

| Step | Size / leading / tracking | Used for |
|---|---|---|
| display | 28px / 1.15 / −0.02em / 600 | page-level heading (dashboard) |
| title | 20px / 1.25 / −0.015em / 600 | pane heading ("Projects") |
| heading | 16px / 1.35 / −0.01em / 600 | modal title, card title, empty-state heading |
| body | 14px / 1.55 / 0 | row titles, form labels, buttons, nav |
| small | 13px / 1.5 / 0 | secondary copy, message excerpts, help text |
| mono-meta | 12px / 1.4 / 0.01em | dates, counts, IDs, usage counts |
| mono-label | 11px / 1.3 / 0.08em, uppercase | sidebar group labels, field labels, keyboard hints |

Sizes are set in `rem` so browser zoom and OS text-size settings scale the layout with the text rather than breaking it. **11px is the floor** — the first revision used 9.5px and 10px for structural labels, which is below comfortable reading size for sustained use on a dark background.

### 2.2 Spacing — 4pt grid

`4 · 8 · 12 · 16 · 20 · 24 · 32 · 48 · 64`. Every padding, gap and margin is one of these. No exceptions, because the exception is always the value that makes a layout feel slightly off without anyone being able to name why.

Radii stay as the site has them: `rounded-xl` cards, `rounded-2xl` panels, `rounded-full` pills. Card shadow `0 20px 40px -15px rgb(0 0 0 / 0.7)`.

### 2.3 Colour — measured, not eyeballed

Reuse the existing `@theme` tokens for surfaces and accent. **The text ramp changes**, for a reason worth stating precisely.

Measured against `--color-surface` (`#0a0f18`):

| Token | Value | Contrast | Verdict |
|---|---|---|---|
| `--text` | `#ffffff` | 19.2:1 | titles |
| `--text-2` | `#9ca3af` | 7.6:1 | body copy, excerpts |
| `--text-3` | `#818a99` | **5.5:1** | **all** metadata, mono labels, hints |
| ~~old `--meta`~~ | ~~`#6b7280`~~ | ~~3.97:1~~ | **fails WCAG AA** |
| ~~old `--faint`~~ | ~~`#4b5563`~~ | ~~2.54:1~~ | **fails everything** |

The original three-tier grey ramp (gray-400 → gray-500 → gray-600) put dates, counts, IDs, capacity readouts and keyboard hints below the 4.5:1 minimum, and the smallest tier below even the 3:1 large-text floor. In a portfolio that is a cosmetic issue affecting a few captions. **In an admin panel the metadata is the content** — a row is a title plus a mono line, and the mono line is what you actually read when scanning. So the two failing tiers merge into one tertiary that clears AA. Three visually distinct greys that all clear 4.5:1 on near-black do not exist with enough separation to be worth it; two do.

Non-text contrast (WCAG 1.4.11) matters for one thing here: **input boundaries**. A dark fill on a dark panel is a 1.1:1 difference, so the border is doing all the work of saying "this is a field."

| Token | Value | Contrast | Used for |
|---|---|---|---|
| `--line` | `rgba(255,255,255,.08)` | decorative | dividers between rows |
| `--line-strong` | `rgba(255,255,255,.16)` | decorative | card and panel edges |
| `--line-input` | `rgba(255,255,255,.36)` | **3.3:1** | anything the user types into |

Status colours, all comfortably above AA:

| State | Treatment | Contrast |
|---|---|---|
| shipped / published / live | `#6ee7b7` on 13% emerald | 12.6:1 |
| in progress | `#fcd34d` on 13% amber | 13.3:1 |
| draft | `--text-3` text, `--line-strong` outline, no fill | 5.5:1 |
| warning / integrity issue | `#fcd34d` on 7% amber, 30% amber border | 13.3:1 |
| destructive | `#fca5a5` on 12% red, 32% red border | 10.1:1 |

Status tags are mono, lowercase, pill-shaped. **Never rely on colour alone** — the word is always present.

> **Open question this raises beyond the admin panel.** These greys came from the public site (`../site-behavior.md` §3 specifies "gray-500/600 for meta"), so the same contrast failure exists on the live site today — in the hero's mono role line, the footer, and the skill pills. Fixing it only in the admin panel makes the two diverge. Recommendation: promote `--text-3` site-wide and retire the gray-500/600 meta convention. That is a one-token change with a visible, and small, effect on the public site. **Flagged, not decided** — see §10.

### 2.4 Motion

The first revision specified motion as one prose line: *"only in response to an action."* Correct in principle, unbuildable in practice — with no values, an implementation reaches for `transition: all 300ms ease-in-out` and the whole panel inherits the one easing curve that makes interfaces feel sluggish.

Custom curves, because the built-in CSS easings are too weak to read as deliberate:

```css
--ease-out:    cubic-bezier(0.23, 1, 0.32, 1);
--ease-in-out: cubic-bezier(0.77, 0, 0.175, 1);
```

| What | Duration | Curve | Why |
|---|---|---|---|
| Press feedback | 120ms | `--ease-out` | Fires on pointer-**down**, not release |
| Hover tint | 120ms | `ease` | Colour change, not movement |
| Chip add / remove | 140ms | `--ease-out` | Seen dozens of times per session |
| Inline row expand | 200ms | `--ease-out` | Height and opacity together |
| Popover (date, skill picker) | 160ms | `--ease-out` | Scales from its **trigger**, not centre |
| Modal | spring, `duration 0.35`, `bounce 0` | — | Tighter than the public modal |
| Drag settle | spring, `duration 0.4`, `bounce 0.15` | — | Carries release velocity |
| Exit, all of the above | ×0.75 of enter | `--ease-out` | Leaving should be faster than arriving |
| Anything opened by keyboard | **0ms** | — | Repeated constantly; animation reads as lag |

Rules that follow from those values:

- **Never `ease-in` on a UI element.** It delays the initial movement — exactly the moment the user is watching — so a 200ms `ease-in` *feels* slower than a 200ms `ease-out`.
- **Never animate from `scale(0)`.** Entrances start at `scale(0.95)` with `opacity: 0`; nothing in the physical world appears from nothing.
- **Only animate `transform` and `opacity`.** Both skip layout and paint.
- **Popovers are origin-aware.** The date popover and skill picker scale from the control that opened them. Modals are the exception and stay centre-origin, because they are not anchored to a trigger.
- **Transitions, not keyframes,** for anything that can be re-triggered rapidly (chips, toasts, row expansion) — a transition retargets mid-flight, a keyframe restarts from zero.

**The admin panel does not import `components/motion/variants.ts`.** Those are the public site's scroll entrances — 700ms `fadeUp`, staggered children, `once: true`. They are correct for a portfolio visitor arriving once and wrong for a tool opened for the fortieth time. Reaching for them because they already exist is the obvious mistake here, so it is written down.

**The admin modal overrides the shared `Modal` spring.** The existing shell animates `{ type: "spring", duration: 0.5 }` from `scale(0.95), y: 20` — good entrance values, too slow for a panel where the modal is the primary work surface. Admin passes `duration: 0.35, bounce: 0`.

### 2.5 Interaction states

The first revision defined none of these, which matters more here than on the public site: the admin panel is keyboard-driven by its own specification (§5.1, §5.2 both spec keyboard nav) and every row, chip and nav item is a control.

| State | Treatment |
|---|---|
| hover | `rgba(255,255,255,.04)` fill, 120ms — gated behind `@media (hover: hover) and (pointer: fine)` so a tap on a phone doesn't leave a stuck hover |
| press | `transform: scale(0.97)`, 120ms `--ease-out`, applied on `:active` |
| focus | `outline: 2px solid var(--color-accent)`, `outline-offset: 2px` — the accent measures 5.2:1 against the surface, so it is legible as a ring |
| disabled | `opacity: .4`, no press transform, `cursor: not-allowed` |

**`:focus-visible`, never `:focus`.** A mouse click must not leave a ring behind; a Tab key must.

**Minimum target size: 24×24 CSS px**, per WCAG 2.2 SC 2.5.8 — which is the *web* number. The familiar 44pt/48dp figures are the iOS and Android platform guidelines and do not transfer; quoting 44px at a desktop web admin panel is a category error in the other direction. Adjacent targets keep an 8px gap. Two controls in the first revision sat under the line and are corrected: the phone modal's close `×` (a bare 16px glyph with no padding) and the write/preview/split segmented control (~22px tall).

Rows get real horizontal padding with the divider drawn full-bleed behind them. In the first revision rows were `padding: 17px 4px`, which meant a hover fill would have been a 4px sliver around the text rather than a row.

### 2.6 What carries over, and what does not

**Carries over:** palette, type scale, mono treatment for metadata, card radii and shadow, the blue accent, the general sense of depth from layered surfaces.

**Deliberately dropped:** the splash screen, scroll-triggered entrance animations, the bracket reveal, the pinned-corkboard treatment, the custom scrollbar, the social rail, the public navbar and footer. All of these serve a portfolio visitor arriving once. None of them serve someone doing data entry for the fortieth time. The `(admin)` route group already gets none of the site chrome; this is the design rationale for why that stays true.

### 2.7 Accessibility beyond contrast

`prefers-reduced-motion: reduce` shows finished states instantly, same as the public site — but *reduced*, not *none*: opacity and colour transitions that aid comprehension stay, movement and scale go.

Two more, because this design uses translucent fills:

- `prefers-reduced-transparency: reduce` — translucent status fills become solid, blur drops.
- `prefers-contrast: more` — near-solid backgrounds with defined borders.

### 2.8 The mono font is an open dependency

The mockups previously rendered in JetBrains Mono. **The project has no `--font-mono` token** — `font-mono` appears 27 times across the public site and resolves to the system mono stack (`ui-monospace, SFMono-Regular, Menlo, …`). A mockup in JetBrains Mono is therefore showing a font the site does not load, and every mono value in this document — which is most of the metadata — would ship looking different from the approved design.

`admin-mockups.html` now uses the system stack, so what is approved is what ships. Adopting JetBrains Mono is a reasonable choice, but it is a **site-wide** one (the hero role line, the footer, and every skill pill are mono), costs a `next/font` load, and belongs in §10 rather than being smuggled in through an admin mockup.

---

## 3. Navigation

A fixed left sidebar, grouped into four bands. Twelve destinations read as a wall if they are flat; grouping is what makes the list scannable.

```
OVERVIEW    Dashboard
CONTENT     Projects · Experience · Skills · Stories · Awards ·
            Engagements · Soft skills · Certifications
SITE        Featured · Site content · Life phases
INBOX       Messages (unread badge)
```

Group labels are mono-label. The active item gets a blue fill and a 2px inset accent bar on its left edge. Unread message count is a mono pill in the accent colour.

`Featured` sits under SITE rather than CONTENT on purpose: it edits the home page, not any one entity type.

---

## 4. Screens

### 4.1 Content lists

Rows separated by hairline dividers. No table grid, no zebra striping, no column headers. Each row carries a title, a mono metadata line (skill count, date, featured state), and a status tag on the right.

Generous vertical padding — 16px. This is the main defence against the panel feeling cramped, and it costs nothing given the content volume.

The whole row is the control. A `New <entity>` button sits top right, in the accent colour, as the only primary button on the screen.

### 4.2 Editing: split by entity weight

Two patterns, chosen by how much there is to edit.

**Thin entities** (Skill, Certification, LifePhase) expand inline, in place, in the row. The row grows to reveal a well containing its fields. No navigation, no overlay. Editing a skill's name and category should not feel like opening a document.

**Heavy entities** (Project, Experience, Story, Award, Engagement, SoftSkill) open a modal.

Modal specifics:

- **Two widths, chosen by whether the entity has a long-form `body`:** 1140px for Story, Project, Experience; 800px for the rest. Full-screen on phone. The existing `Modal` shell accepts a `className`, so this is a width override rather than a second component.
- URL-driven, matching the public site's pattern: `/admin/projects?edit=prj_barnum`. Refresh reopens it. Browser Back closes it. Links to a specific record work.
- **Escape and backdrop click are guarded when the draft is dirty.** A confirm step, not a silent discard. This is the single most important interaction detail in the panel; losing a half-written story to a stray Escape is the failure that would make the whole thing feel untrustworthy.
- A mono `draft saved 2m ago` line sits next to the Save button.
- **The sticky header must not obscure the focused field.** The Save/Cancel bar is pinned while the form scrolls under it, so tabbing to a field near the top of the scroll region can land it behind the bar — **WCAG 2.2 SC 2.4.11 (Focus Not Obscured)**. Every focusable field carries `scroll-margin-top` equal to the bar's height, so scrolling a field into view clears the chrome rather than tucking under it.

> **Corrected from revision 1.** That version specified a 900px modal *and* a rule (§4.5) that split view collapses below 1100px because "two 400px panes is worse than either alone." A 900px modal minus a 164px section rail leaves ~700px of editor, which splits into two ~350px panes — narrower than the width the document itself rejects, on every screen size, forever. Split could never have been valid. Hence the wider modal for body-heavy entities, and the pane-based gate in §4.5.

### 4.3 Sections: one definition, two presentations

Every heavy entity's form is defined as an ordered list of sections (Summary, Body, Highlights, Skills, Links, and so on, varying by entity).

- **Desktop:** sections render as a left rail inside the modal, all content in one scrolling column, rail item highlights with scroll position, clicking a rail item scrolls to it.
- **Phone:** the same sections collapse into a drill-down list. Tapping one pushes a focused screen with just that field and a back arrow. Each row shows a mono summary of its current contents (`3 paragraphs`, `6 selected`, `128 characters`) so the list is scannable without opening anything.

Drill-down screens **enter from the right and leave to the right**, so Back reverses the path the screen arrived on. A screen that slides in from the right and dismisses downward reads as a different screen than the one you opened.

Same section definitions, same field components, two layouts. Do not let these diverge into two editors.

### 4.4 Save model

**One draft object in client state. Sections navigate into it. One Save commits the whole record.**

Per-section saving is the tempting reading of the phone drill-down and it should be avoided: it would require a partial Zod schema per section, and the existing schemas validate whole entities. One save keeps phone and desktop on the same API.

Against the risk of losing a long session, the draft autosaves to `localStorage` keyed by entity id. Reopening a record with a stored draft offers to restore it.

**One save plus a section rail creates a specific failure this design has to answer.** If validation fails on a field in Summary while the user is looking at Body, the inline error is real but invisible — it is in a part of the form scrolled out of view, and on phone it is behind a drill-down screen. Silent failure on Save is the worst outcome available here, because the user's model is "I pressed Save and nothing happened."

So a failed save does three things at once:

1. **Marks the offending sections in the rail** — a danger dot on Summary, so the rail doubles as an error map. On phone the same marker appears on the drill-down row.
2. **Renders a focusable error summary** at the top of the form: a `role="alert"` container with `tabindex="-1"`, focus moved to it on failed submit, each item a link to its invalid field.
3. **Keeps the inline field errors.** The summary complements them; it never replaces them.

This is the one place where a top-of-form error summary is right despite §7's general preference for inline-only validation, and the reason is the section rail specifically — in a single flat form the inline error is on screen and the summary is noise.

### 4.5 Body editor

Three modes in a segmented control: **write · preview · split**.

- Split is resizable by dragging the divider, and the ratio persists.
- The chosen mode persists per user.
- **Split is available only when the editor pane itself measures ≥720px** — a container query on the pane, not a media query on the viewport. The pane is what determines whether two columns are readable, and the pane is narrower than the viewport by the modal margin plus the section rail.
- Phone gets write and preview only.

This matters more than typical CMS chrome because the stories are written in a specific personal register (see `../../files/VOICE.md`). The editing surface should stay out of the way.

### 4.6 Featured manager

A top-level destination, **ordered by home page section rather than by entity type**.

The page reads as a schematic of the home page, top to bottom. Sections that cannot be feature-managed (Hero, About card, Call to action) stay in the stack as dimmed position markers with a mono pointer to where they are edited. Removing them would break the "this is my home page" read, which is the entire point of the layout.

Entity-type grouping was considered and rejected: Awards, Certifications and Soft skills all render inside one home section, so grouping by entity splits a single visual section across three cards and hides that they sit together.

Per manageable section:

- Featured items as drag rows with a grip handle, in render order.
- A **bench** below, holding everything not featured, as dashed outline chips.
- Drag between the two zones to feature and unfeature. Drag within to reorder.
- A mono capacity readout (`3 of 3`).
- When more items are flagged than `FEATURED_LIMITS` allows, the overflow items render in the warning treatment with an explicit line naming what will not appear. This is currently a silent failure in the data model and this screen is where it becomes visible.

**Drag behaviour**, which revision 1 left as the word "drag":

- 1:1 tracking via Pointer Events with `setPointerCapture`, respecting the offset from where the row was grabbed. Snapping the row's centre to the cursor breaks the illusion immediately.
- ~10px of movement before the drag commits, so a click that wobbles is still a click.
- **A lift treatment on grab** — `scale(1.02)` plus the card shadow, 160ms. This is what says "picked up" rather than "clicked."
- On drop, spring to the slot carrying the release velocity (`bounce 0.15`) rather than snapping.
- The bench highlights while a valid drag is over it.
- Keyboard equivalent: focus a row, `Space` to lift, arrows to move, `Space` to drop.
- **A single-pointer alternative is mandatory, not optional:** each row carries `Move up` / `Move down` / `Feature` / `Unfeature` controls (an overflow menu on the row, or persistent arrow buttons). **WCAG 2.2 SC 2.5.7 (Dragging Movements)** requires that any author-controlled drag operation is achievable with a single pointer *without dragging* — a keyboard path does not satisfy it, because it serves a different population: someone using a head pointer, a switch, or with a tremor has a pointer but cannot drag. Drag is the fast path; it is never the only path.
- Under `prefers-reduced-motion`, no lift and no spring — the row moves instantly.

### 4.7 Dashboard

**An action queue, not a status report.** Three blocks, in this order:

1. **Waiting on you** — unread contact messages, with sender, organization, and a one-line excerpt. Not a count. This is the only time-sensitive thing in the entire panel; someone is waiting on a reply about a job.
2. **Half-finished** — everything with `visibility: "draft"`, sorted by last touched, with an age (`started 12d ago`). This is where an abandoned STAR write-up surfaces instead of rotting.
3. **Needs fixing** — the three existing integrity selectors (`orphanSkills`, `danglingSkillRefs`, `unevidencedSoftSkills`) plus over-limit featured counts. Each issue states the consequence, not just the condition: "Digital forensics will not render on the home page", not "13 items flagged".

**The Needs fixing block renders only when something is wrong.** A permanent "0 issues" panel trains you to stop reading it.

The page heading is **`Last published 12 days ago`**, with a mono sub-line summarising the three blocks. Revision 1 opened with `Good evening` and demoted the publish date to the sub-line; the greeting was the only piece of generic personality in the panel and carried no information, while "when did I last ship anything" is precisely the orienting fact after a month away. Named the largest thing on the screen, it also does the job the greeting was reaching for — the panel feels like it knows you were gone.

Content counts go in a small mono footer line. Knowing there are 58 skills does not change what you do next, which is why the original plan's ordering (counts first) is inverted here.

Analytics, whenever it arrives, gets its own band below all three. It is retrospective; the rest is a to-do list. Mixing them means the actionable content competes with a traffic chart.

### 4.8 Feedback on save

Revision 1 specified autosave (`draft saved 2m ago`) but never said how a committed save is confirmed.

**In-place, on the button.** `Save` → `Saving…` → `Saved`, reverting after ~2s. The confirmation belongs at the point of action, where the user is already looking, not in a corner of the screen.

**A toast is for failures only.** Sonner is the natural pick and is already a known quantity, but a success toast would fire dozens of times per session for an action whose outcome is never in doubt — that is exactly the over-feedback that trains someone to ignore all feedback. A failed save is rare, important, and needs to survive the user having navigated away, which is what a toast is actually good at.

---

## 5. Components

### 5.1 Year and month scroller

Every dated entity stores `{year, month}` only. A native date input is wrong for this: it asks for a day that is never displayed, and it renders differently in every browser.

A popover, opened from a trigger that shows the current value formatted through the same `formatDateRange()` the public site uses. It scales in from the trigger, 160ms.

- **Years** in a scroll-snap column, current selection filled with the accent.
- **Months** in a fixed 3×4 grid beside it. Twelve items fit; a grid is faster to hit than a second scroll column.
- Any date is two clicks.
- For a range, the popover has **Start** and **End** tabs. The start tab's label carries its current value so you can see both without switching.
- The End tab carries a **Present** switch, which writes `null` and greys the columns.
- The current real month gets a subtle outline as an anchor, distinct from selection.

Keyboard: arrows move month, shift+arrows move year, typing four digits jumps the year column, Escape closes.

### 5.2 Skill picker command menu

Clicking add skill opens a floating command menu, Spotlight-style, rather than expanding a list in place.

- Search input at the top, results below, **grouped by `SkillCategory`** with mono group headers.
- Search matches `name` **and** `aliases`. The public `/about` skill matrix needs the same alias-aware match, so write it once and share it.
- Each row shows a checkbox state and a mono **usage count** on the right. Skills referenced by nothing are flagged in the warning colour, because those are pills that open an empty modal on the live site.
- The menu **stays open after a toggle**, so several skills can be added in one pass, with chips filling in behind it.
- Keyboard: arrows move across groups, Enter toggles, Escape closes.
- **If this ever gets a `⌘K` binding, it opens with no animation.** A surface reached by keyboard dozens of times a session should be instant; the 160ms that reads as polish on a click reads as lag on a shortcut.

**On creating a skill inline:** a create row appears at the bottom when the query has no exact match. It should be visually distinct and should open the skill create form rather than silently minting a record. The multi-select exists specifically so a typo cannot become a skill; a frictionless inline create would undo that. Making it deliberate keeps both properties.

### 5.3 Chips

Used for skill references, bench items, and any multi-value field.

- Mono-meta, pill-shaped, hairline outline on a barely-lifted fill.
- **A real `<button>`, never a styled `<div>`**, carrying an accessible name and `aria-pressed` wherever the chip has a selected state (the featured manager's arsenal chips, the bench). A selected state that exists only as a CSS class is invisible to a screen reader.
- A muted `×` on the right removes. **If the chip body and the `×` do different things, the `×` is a separate control and needs its own 24×24 target** — at mono-meta size the glyph alone is about half that. Where the whole chip means "remove" (the skills editor), one button is correct and simpler; where the chip body opens the record, the `×` gets its own hit area.
- Selected state uses the accent at low opacity with a tinted border.
- Bench and unfeatured items use a dashed outline with no fill, which reads as "available" rather than "applied".
- Adding and removing animates at 140ms — a chip that appears instantly in the middle of a row reads as a glitch, and one that takes 300ms reads as slow.

### 5.4 Toggles

Standard switch, accent fill when on. Used for Published and Featured. Always paired with a plain-language label on the left, never a bare switch.

---

## 6. Deletion

**Hard delete, guarded by a reference check. No archive state.**

`visibility: "draft"` already covers "exists but is not public". An archive state would be a third status overlapping it, and every delete would become a question about which state something belongs in.

The flow:

1. Delete runs the reference lookup first.
2. If anything references the record, the dialog names them and lists them, with the delete button **present but disabled** until they are detached — a disabled button that explains itself teaches the rule; a missing button just looks broken.
3. If nothing references it, a plain confirm, then gone.

This turns `danglingSkillRefs()` from a warning that fires after the damage into a state that cannot be reached.

**Contact submissions are the exception.** They are inbound data, not content, nothing references them, and a `spam` status already exists. Plain delete is fine there.

---

## 7. The states that get improvised

Specified here because they are where a build without a spec invents something, and they are a meaningful share of what the panel actually displays. All four are drawn in `admin-mockups.html` §08.

**Empty.** A heading, a sentence explaining what belongs here, and the button that creates the first one. An invitation, not an apology: "No stories yet. The STAR write-ups that back your soft skills live here."

**Loading.** Skeleton rows matching the real row rhythm — a title-width bar and a shorter mono-width bar — shimmering at 1.4s linear. Under `prefers-reduced-motion` the shimmer stops and the skeleton is a flat fill. The route group already renders behind Suspense boundaries, so these have a real place to live.

**Inline validation.** Errors appear on the field, on blur, not gathered at the top on submit. The message says what happened and what to do: "Already used by another project. Slugs appear in shared URLs, so they have to be unique." The field border takes the danger colour; the field does not shake. The message is linked to its input with `aria-describedby`, so a screen reader reads the error as part of the field rather than as loose text near it — a red border and adjacent text is a visual-only association.

On a *failed save* this is joined by the rail markers and focusable error summary described in §4.4. Inline-on-blur is the steady state; the summary appears only when a submit fails with errors the user cannot currently see.

**Destructive confirm.** Covered in §6 — the reference list is the body of the dialog, not a warning above it.

---

## 8. Responsive behaviour

Desktop is primary. Phone is a supported secondary, not an afterthought, and should be able to edit anything the desktop can.

| Breakpoint | Behaviour |
|---|---|
| ≥1100px | full layout; split editor available where the pane allows it |
| 860–1100px | sidebar persists, editor pane narrows below the split threshold |
| <860px | sidebar becomes a drawer, modals go full-screen, sections become a drill-down |

Note the split-editor rule is stated in §4.5 against the **pane** width, not this table. This table describes layout; the pane query decides split.

Everything in §4.3, §4.4 and §5 works at every size. The phone version differs in presentation only.

---

## 9. Copy

Sentence case everywhere. No all-caps except the mono group labels, where the letterspacing carries it.

Buttons name what happens: `Save`, `Publish`, `Delete skill`. Not `Submit`. The verb stays the same through the whole flow, so a `Publish` button produces a `Published` confirmation.

Empty states are an invitation, not an apology. Errors say what happened and what to do about it, and never apologize.

---

## 10. Open decisions

1. **Whether the contrast fix propagates to the public site.** §2.3 replaces two metadata greys that fail WCAG AA. Those greys are inherited from `../site-behavior.md` §3 and are live on the public site today (hero role line, footer, skill pills). Fixing only the admin panel makes the two diverge; fixing both is a one-token change with a small visible effect on the portfolio. **Recommendation: fix both**, in a separate commit from the admin work so the public-site diff is reviewable on its own.

2. **JetBrains Mono, or the system mono stack.** §2.8. The project currently has no `--font-mono` token. Adopting a real mono face would improve the metadata everywhere, at the cost of another font load, and is a site-wide decision rather than an admin one. **Recommendation: ship the admin panel on the system stack, revisit as part of Phase 7 polish** where the font budget is already on the table.

3. **Create vs. edit.** Whether creating a record uses the same modal with empty fields, or a lighter step asking only for required fields. **Recommendation: one modal for both.** `visibility: "draft"` already covers the incomplete case, and a separate create path means every entity needs a second valid partial state — the same argument that decides the one-save model in §4.4. Consistent with a decision already made rather than a new one.

4. ~~The dashboard greeting.~~ **Resolved** — dropped, see §4.7.

5. ~~Whether the featured manager gets a live home page preview.~~ **Resolved: no.**
 `../project-plan.md` §6 Phase 4 calls for one, but the section-ordered schematic already communicates order, grouping and capacity, and the overflow warning states in words the one thing a preview would reveal ("Digital forensics will not render"). A live preview is a second rendering path to build and keep in sync with the real home page, and a preview that drifts from the page is worse than no preview. Revisit only if the schematic proves insufficient in use.

---

## 11. Review provenance

This design has been through two review passes, recorded so a future reader knows which choices were argued and which were never examined.

**Pass 1 — design-engineering craft** (`emil-design-eng`, `apple-design`). Produced the type scale, the 4pt grid, the measured colour ramp, the motion table, the interaction-state definitions, and caught the 900px-modal/split-editor contradiction.

**Pass 2 — design intelligence and conformance** (`ui-ux-pro-max`). Corroborated the contrast finding independently — its own dark-mode rule names *"muted normal text that falls below the text threshold"* as an anti-pattern, and its own recommended palette puts muted foreground at 6.11:1 — and added four conformance items pass 1 missed, all now in the document: WCAG 2.2 SC 2.5.7 single-pointer drag alternatives (§4.6), SC 2.4.11 focus not obscured by the sticky header (§4.2), SC 2.5.8 24px minimum targets (§2.5), and the failed-save error summary that a section rail makes necessary (§4.4).

**Rejected from pass 2, deliberately.** Its `--design-system` mode returned a *landing page* pattern — Hero → metrics → How it works → CTA, with conversion advice and scroll-reveal motion — having matched on the word "dashboard". Its accompanying recommendations went with it:

| Proposed | Rejected because |
|---|---|
| Glassmorphism, backdrop blur 10–20px | Wrong for a dense data surface. Blur costs legibility exactly where metadata is smallest, and layering translucent panels on translucent panels is the failure mode both craft references warn about |
| Green `#22C55E` accent | The site is blue. Consistency with the public site is the point of §2 |
| Fira Code / Fira Sans | The site is Inter. Interesting only as a second independent vote for a real mono face — noted against §10 item 2 |
| Scroll-reveal entrance motion | §2.4 already rules out anything that plays on scroll in this panel |
| `border #475569` on its card colour | Measures 2.07:1 — fails the same 3:1 non-text threshold this document applies to `--line-input` |

The lesson worth keeping: the generative mode of a design tool is tuned for greenfield marketing surfaces, and its guideline database is tuned for conformance. The second is worth querying on every screen; the first was worth exactly one query to find that out.
