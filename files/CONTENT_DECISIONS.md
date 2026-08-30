# Content Decisions — v3

**Phase 1 content drafting.** Companion to `PROJECT_PLAN.md`, `SITE_BEHAVIOUR.md`, and now `VOICE.md`.

**What changed in v3:** every story rewritten against the new voice guide. All dates corrected. Cipher suite reframed as a team effort. Skills restructured into umbrellas with usage roll-up. Tracer Fire award removed. Awards de-narrated.

---

## §A. The pattern you found

You said your review points kept repeating. They did, and they were all the same underlying habit:

> **I kept narrating my own rhetorical intentions instead of just writing the thing.**

Twelve instances across stories and awards:

| The tic                                                                                                                 | What it was doing                               |
| ----------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------- |
| "I want to be exact about scope, because this is a distinction that matters and it is easy to overclaim."               | Announcing honesty instead of being honest      |
| "It made developer life harder, and I want to state that plainly rather than let it sit in the gap between paragraphs." | Explaining a rhetorical choice mid-sentence     |
| "I list this next to the engineering awards deliberately."                                                              | Justifying layout inside content                |
| "The part I would rather be judged on is..."                                                                            | Telling the reader how to read                  |
| "I would rather say that precisely than claim a cleaner attribution than I can support."                                | Defending against an accusation nobody made     |
| "The engineering here is trivial... That is not a story."                                                               | Leaking _our_ argument about whether to publish |

You're right that it reads as machine-generated, and right about why: a person confident in a statement just makes it. Narrating the intention is what someone does when they're worried about being misread.

I've written the rules into **`VOICE.md`** so this stops recurring rather than getting caught in review each time. Seven rules, a checklist, and worked before/after examples. The important ones:

1. **Never narrate the rhetorical move.** If a sentence is about the writing rather than the events, cut it.
2. **Don't pre-defend.** No answering objections nobody raised.
3. **No meta.** Editorial reasoning lives in this file, never in the content.
4. **Prefer implication.** The conclusion a reader reaches themselves is the one they believe.
5. **Human register in stories.** Contractions, short sentences, the blunt thing. "That's about as bad as it gets in this job."
6. **Technical depth serves the story.** A non-technical reader must follow all of it.
7. **Two registers** — stories are personal; experiences and projects stay professional.

All 13 stories are rewritten against it. Zero instances remain.

---

## §B. Facts corrected

| #   | Was                                                | Now                                                                                                                                                                                                                          |
| --- | -------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | Tracer Fire 2024: "top five", award record existed | **12 Oct 2024, 5th overall, 1st among ASU teams. No award record** — you never received an official award, so the `awd_tracer_fire` entry is deleted. Placements live on the engagements.                                    |
| 2   | Tracer Fire 2026: no placement stated              | **Jan 2026, 4th overall, 2nd among ASU teams.** Also no award.                                                                                                                                                               |
| 3   | Engineering Excellence = the scrapped project only | **A first-year body-of-work award**, with the production incident and the innovative React/Spring Boot migration as the two that pushed it over the line. Rewritten.                                                         |
| 4   | Authorized Officer Jan 2023                        | **Feb 2024.** CDIO confirmed Nov 2022.                                                                                                                                                                                       |
| 5   | "16 sparse types consolidated"                     | **40 attack types in the dataset. 15 learned as distinct classes; the remaining 25 folded into a 16th class, "Other".** Sixteen output classes covering all forty. Your CV's "over 16" was the output count.                 |
| 6   | Burger Builder `status: "archived"`                | **`status: "shipped"`** — it's live and self-sustaining. Added a line about that: _"It has been live and working since 2020 with no maintenance... a static front end on managed hosting genuinely does just keep running."_ |
| 7   | Urgency about the placeholder credentials          | Noted — the site isn't distributed yet. Still needs fixing before you share it, but it isn't the emergency I made it.                                                                                                        |
| 8   | All story dates                                    | Corrected below.                                                                                                                                                                                                             |

### Story dates

| Story                                 | Date                    |
| ------------------------------------- | ----------------------- |
| One Week Became Four                  | Sep 2021                |
| Four People and a Revoked Certificate | Apr 2022                |
| It Worked, and It Was Wrong           | Jun 2022                |
| Six Months in the Wrong File          | Sep 2022 ⚠️ approximate |
| The Service Nobody Owned              | Oct 2022 ⚠️ approximate |
| Where Does This Data Come From?       | Feb 2023                |
| The Bug That Lived for a Year         | Jul 2023                |
| Opinions Lose to Status Reports       | Oct 2023                |
| The Secret You Can Still Read         | Nov 2023                |
| Making Myself Replaceable             | Jun 2024                |
| A Hole You Put There on Purpose       | Jun 2025                |
| I Tested That It Worked               | Sep 2025                |
| From 60 to 80                         | Dec 2025                |

---

## §C. Story-by-story changes

### Four People and a Revoked Certificate _(was: The Fix I Argued Against)_

Your correction changes what the story is about, so it's rewritten from the ground up — new title, new slug, new thesis.

The old version had you arguing against an SSL downgrade under pressure. That never happened. What actually happened is better:

- **Nobody proposed the downgrade.** It was never on the table. The story now says so and explains why the whole room understood the cost, rather than crediting you with a stand you didn't take.
- **The lead developer raised the REST idea**, from leave. Your part was verifying it actually removed the failure you'd diagnosed, and pitching it Tuesday morning.
- **Your supervisor** gave the go-ahead for the QA proof of concept and took every stakeholder conversation off you — which is the thing that made the other three jobs possible.
- **You and your colleague** were in the code.

It now closes:

> _"Four people, four different jobs, and it only worked because nobody tried to do someone else's... The version of this where I'm the hero is a worse story and it isn't true."_

The award body was updated to match — "Awarded to the team."

### The Bug That Lived for a Year — batch detail added

**You asked me to debate whether to include it. Include it, and here's why it's load-bearing rather than extra detail.**

Without it, "drop the seconds field" reads as arbitrary — a lucky guess that happened to work. With it, the logic is airtight:

> _"It couldn't — the data came from an overnight batch. Nothing about it was accurate to the second in the first place, and nothing downstream ever cared."_

The batch origin is _why_ the precision was fake. It's the difference between a fix a reader accepts and a fix a reader understands.

It also sharpens the section heading to "**It wasn't the application**," which distinguishes this story from Six Months in the Wrong File. That one is about _why other people missed it_; this one is about _the state came from a component nobody thought was part of the system_. Related instincts, genuinely different stories.

Skills added: Drools, Autosys, System Design.

### The Service Nobody Owned — heavily trimmed

You were right that it dragged. Three cuts:

- **Deleted:** _"The engineering here is trivial... That is not a story."_ That was me arguing with you about inclusion. Gone.
- **Cut to one line:** the paragraph explaining that you asked the replacement team _because you knew your standing was thin_. Now it's just: _"So I asked the team building the replacement whether it meant something. It didn't."_ The point lands harder unstated.
- **Removed:** "That conversation is the actual hinge of this story." Narrating the structure.

Section headings changed from "The part that mattered more than the fix" to "**Asking first**." About 200 words shorter.

### One Week Became Four — pronouns fixed

Five instances of "he" → "she". Also softened the opener into a human register: _"Someone expected a Spring RestTemplate, some object remapping, SSL on the new endpoints, done by Friday."_ Skills: added REST & SOAP APIs.

### A Hole You Put There on Purpose

Deleted the "I want to be exact about scope" preamble. The section is now just called "**The layer**" and opens: _"The platform owned multi-tenancy — keeping students isolated from each other — and the orchestration. I didn't build that."_ Same information, no throat-clearing.

Also trimmed the technical middle — the proxy explanation is now three sentences instead of a paragraph.

### I Tested That It Worked

The defensive caveat became one line:

> _"I still don't know whether my container configuration drove the load that took the hosting layer down or whether that layer fell over on its own. Both are plausible and I never got a clean answer."_

Added a human beat after the failure: _"That's about as bad as it gets in this job."_

### Making Myself Replaceable — factual fix

You were right that the old wording implied you'd built it badly:

> **Now:** _"The application had been built before my time without coding standards and with almost no documentation. Three years of my work had gone into changing that — refactoring toward standards, writing the Confluence pages that existed. But a lot of what I knew about how it actually behaved had never made it out of my head, because I'd learned it by running into it."_

Same correction applied to the UBS experience body.

Also: _"being indispensable isn't a virtue. It's a bus factor of one with better PR."_

### From 60 to 80 — de-jargoned

You got bored, and the reason was that it assumed the reader knows what a buffer overflow is. Rewritten for a non-technical reader:

> _"break a program's memory in a specific way and take control of what it does next"_

The enumerated micro-challenge list is gone — it was four bullets that all said the same thing. Now: _"a sequence of smaller challenges, each one isolating a single idea, each one solvable on its own."_ About 250 words shorter.

### It Worked, and It Was Wrong

Added a genuine human beat: _"honestly it was a great problem."_ Someone describing a failure they enjoyed building is more believable than someone who only describes the lesson.

### The Secret You Can Still Read

_"It made developer life harder."_ Full stop. Nothing after it.

---

## §D. Skills — restructured around your umbrella idea

### Your prefix-tree question

The instinct is right; the structure isn't. A trie is for prefix string matching — autocomplete, "az" → "azure". That's a search implementation detail, not a data model, and you'd get it from any decent fuzzy-search library.

What you actually described is a **hierarchy**: umbrella skills on the home page, specific tools beneath them on `/about`. So I added one optional field:

```ts
parentId?: ID;   // skl_azure.parentId === "skl_cloud"
```

Three things fall out of it:

**1. Usage roll-up.** Clicking an umbrella shows everywhere any of its children were used, so a project referencing `skl_azure` surfaces under "Cloud & Infrastructure" without needing to reference the umbrella:

```
Cloud & Infrastructure:  7 children →  9 usages
Linux / Unix:            3 children →  6 usages
Reverse Engineering:     3 children →  4 usages
```

Without this, umbrella pills would open near-empty modals, since your actual records reference specific tools.

**2. Search that expands.** Matching an umbrella surfaces its children. `"cloud"` now returns: **Cloud & Infrastructure, Microsoft Azure, AWS, Docker, Kubernetes, CI/CD & DevOps, Cloud Migration.**

**3. `/about` gets its structure for free.** Umbrella heading → child pills, which is exactly the "dive deeper" page you described.

Aliases still do the flat search job — `"cloud"` is an alias on Azure and AWS as you suggested, _and_ they're children of the Cloud umbrella. Belt and braces, because they solve slightly different problems.

### Featured pills — now 11 umbrellas

**Java · Python · C/C++ · Linux/Unix · Cloud & Infrastructure · System Design · Microservices & APIs · Reverse Engineering · Vulnerability Research · Spring Boot · React**

Your reasoning was right and I'd underweighted Linux/Unix badly — three years of Unix server infrastructure and CI pipelines, then a year where roughly 80% of a CTF exam environment was shell. Its blurb says exactly that.

**Dropped from featured** (still in the matrix, now as children): x86 Assembly and Binary Exploitation, both under Reverse Engineering / Vulnerability Research. They're your sharpest differentiators but they're _detail_, and they surface through roll-up.

**Kept Spring Boot and React** featured despite being narrower than the rest — they're the full-stack signal, and for SWE roles that's load-bearing.

Section limit raised 8 → 12. The pill row is `flex-wrap`, so it handles it.

### Level and structure changes

| Skill                      | Change                                                                              |
| -------------------------- | ----------------------------------------------------------------------------------- |
| **Bash / Shell**           | working → **core**, child of Linux/Unix, blurb about the CTF environment            |
| **Autosys**                | working → **core**, with a blurb about the brittle event chain you redesigned       |
| **Flask**                  | familiar → **working**, child of Python, blurb about the exam auth server           |
| **Azure**                  | Renamed _Microsoft Azure_, blurb: the cloud you actually migrated production onto   |
| **JSP**                    | **NEW** — child of Spring Boot                                                      |
| **REST & SOAP APIs**       | **NEW** — child of Microservices, `level: core`                                     |
| **Cloud & Infrastructure** | **NEW** umbrella — parent of Azure, AWS, Docker, Kubernetes, CI/CD, Cloud Migration |

**58 skills, 24 with parents, 11 featured.**

### On `blurb`

It's the one line at the top of the skill modal, before the usage list — the answer to "what does this mean _for you_" rather than "what is this technology." Optional; only ~20 skills have one, and they're the ones where you have something specific to say.

---

## §E. Awards

Your presumption is now enforced: **award skills mirror the related story or experience.**

| Award                  | Skills    | Change                                                                                                                                                           |
| ---------------------- | --------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Great Contribution     | 7         | mirrors the cipher suite story                                                                                                                                   |
| Engineering Excellence | 8         | mirrors reverse routing + adds SSL/TLS for the incident half                                                                                                     |
| CDIO Champion          | 1         | leadership only — correct                                                                                                                                        |
| Going Above and Beyond | 10        | mirrors halted-the-vendor + Linux, Autosys                                                                                                                       |
| Authorized Officer     | **1 → 9** | you were right, this was wrong. Now the umbrella set: Java, Spring Boot, Linux, Cloud Migration, Azure, Incident Response, Microservices, SSL/TLS, System Design |
| ~~Tracer Fire~~        | —         | **deleted** — no official award                                                                                                                                  |
| IoT Finalist           | 1         | correct                                                                                                                                                          |

De-narrated per §A. CDIO now ends on a concrete image instead of an explanation:

> _"When a batch migration depended on six enterprise teams aligning perfectly, most of those teams were already people I'd organised a cricket tournament with."_

---

## §F. Verification

```
58 skills · 9 projects · 8 roles · 13 stories · 6 awards · 5 engagements

tsc --noEmit         0 errors (strict)
dangling skill refs  none
dangling entity refs none
featured orphans     none
orphan skills        none
unevidenced soft     none
over-featured        none
```

---

## §G. Still open

1. **Six Months in the Wrong File** and **The Service Nobody Owned** dates are approximate (Sep and Oct 2022). Your hazy period — no rush.
2. **Featured stories** are now _Four People and a Revoked Certificate_, _The Bug That Lived for a Year_, _Opinions Lose to Status Reports_. Incident/teamwork, debugging, leadership.
3. **Project links** — every `links: []` is still empty.
4. **Cover images** and a profile photo.
5. **Read the rewritten stories.** The voice changed materially; worth checking it sounds like you rather than like a better-behaved version of the previous draft.

---

## §H. Next

Content is drafted, corrected and validated. Remaining Phase 1 work:

1. Place the files (§A of v2 — unchanged)
2. **`schema.ts`** — Zod mirrors, for the Firestore boundary in Phase 3
3. **`repository.ts`** — interface + `LocalRepository`
4. Wire the sections to the repository
5. Push `"use client"` down to animated leaves

Steps 2 and 3 are about an hour and don't depend on you having read the content.
