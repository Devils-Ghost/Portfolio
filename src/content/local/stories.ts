import type { Story } from "../types";

/**
 * Public versions of the STAR narratives. Written to VOICE.md:
 * personal register, no self-narration, no pre-defending, readable by
 * someone who doesn't code. Internal system names and financial-impact
 * figures removed — see CONTENT_DECISIONS.md §A.
 */
export const stories: Story[] = [
  {
    id: "story_one_week_became_four",
    slug: "one-week-became-four",
    title: "One Week Became Four",
    headline:
      "A task scoped for a week took me a month, and my supervisor started wondering if she'd hired the right person.",
    org: "UBS",
    type: "Learning",
    date: { year: 2021, month: 9 },
    star: {
      situation:
        "Two months out of undergrad, first team, first real task: migrate an internal service from a SOAP contract to a REST API. Scoped at one week. The contract was nearly unchanged, so the expectation was a Spring RestTemplate and some object remapping.",
      task: "Execute the migration and configure SSL for the new endpoints — with no enterprise Java experience, meeting Spring's inversion of control, singleton beans, autowiring and certificate chains all at once.",
      action:
        "I could have copied from an existing service and probably hit the deadline. I read the Spring documentation until I understood how the framework manages dependency injection instead, and traced the SSL handshake until I knew which certificates needed generating and why.",
      result:
        "Four weeks instead of one. My supervisor started to doubt she'd hired right, which was fair. But the foundation never needed rebuilding — I didn't struggle with backend architecture again, and within a year I was finishing complex work under estimate.",
    },
    body: `Two months out of undergrad. First team, first real task, scoped at one week: migrate an internal service from a SOAP contract to a REST API.

It was a reasonable estimate. The contract barely changed. Someone expected a Spring RestTemplate, some object remapping, SSL on the new endpoints, done by Friday.

I had never touched enterprise Java. So what I actually walked into was Spring's inversion of control, singleton bean lifecycles, autowiring, and certificate chains — all at once, for the first time, on a clock.

### The shortcut I didn't take

There was a version of this where I hit the deadline.

Our codebase had working examples of everything. I could have found a similar service, copied its structure, swapped the endpoints, copied its SSL config, and shipped something that worked in about the estimated time. I'd have understood none of it. Nobody would have known on the Friday.

I decided not to. I read the Spring docs until I understood why the container does what it does, not just which annotation produces the behaviour I wanted. I traced the SSL handshake until I knew exactly which certificates needed generating, where they went, and what each one was proving to whom.

### It took four weeks

I missed the deadline by a factor of four, and my supervisor started to wonder whether she'd hired the right person.

She was right to. From where she sat, a new graduate had been given a simple task and had gone quiet on it for the better part of a month. That is exactly what someone who can't do the job looks like from the outside.

### What it bought

The foundation never needed rebuilding.

I didn't struggle with backend architecture again — not on that team, not after. My delivery speed went up sharply and stayed up, and within a year I was finishing complex work under estimate. I was promoted, and I became the person the team sent the ambiguous problems to.

That's the satisfying ending. It's also not the lesson.

### The actual lesson

The four weeks weren't the failure. The silence was.

I went quiet for three of them and let my supervisor find out how far off I was by asking. She didn't need me to be faster. She needed to know, in week one, that the estimate was wrong and why — so she could decide what to do about it. Pull me off. Pair me with someone. Say take the month, it's worth it. All of those were available to her in week one and none of them were available in week four.

I took a decision that was hers to make, and I took it by saying nothing.

So what changed isn't that I stopped going deep. I still go deep, and I still think it was the right call on that task. What changed is that I now say out loud when something is running past its estimate, with a new number and the reason, as early as I know.

The depth was right. The silence was the mistake.`,
    relatedExperienceIds: ["exp_ubs_swe"],
    skillIds: [
      "skl_java",
      "skl_spring_boot",
      "skl_ssl_tls",
      "skl_rest_soap",
      "skl_microservices",
    ],
    iconName: "graduation",
    readingMinutes: 4,
    featured: false,
    order: 5,
    visibility: "public",
  },

  {
    id: "story_cipher_suite",
    slug: "four-people-and-a-revoked-certificate",
    title: "Four People and a Revoked Certificate",
    headline:
      "A weekend certificate rotation broke authentication for everyone, and there was no way back. What happened next is the best week of teamwork I've been part of.",
    org: "UBS",
    type: "Incident Response",
    date: { year: 2022, month: 4 },
    star: {
      situation:
        "A weekend certificate rotation broke single sign-on between an external vendor, an internal routing microservice and a backend service. The old certificates were already revoked, so rollback was gone. The lead developer worked it through the weekend without success, then left for mandatory leave. By Monday it was a Sev-1 blocking customer access.",
      task: "I was pulled in with one colleague, partly because of SSL work I'd done earlier that year. We needed to find the actual failure and get back to service.",
      action:
        "Tracing the handshake in the network logs showed the new certificates validating fine — the failure came later, during cipher suite negotiation. A legacy SOAP integration couldn't speak the encryption standards the new certificates required. The lead developer, still on leave, suggested pulling forward a backlog item to migrate that integration to REST. I verified it would actually solve the failure I'd found and pitched it Tuesday morning. My supervisor approved a proof of concept in QA and took the stakeholder conversations off us. I rewrote the routing microservice; my colleague updated the backend.",
      result:
        "We shipped Wednesday. It worked on the first deployment, restored SSO, and had no bugs afterward — and it retired the tech debt that caused the outage, because the thing that failed no longer existed.",
    },
    body: `A certificate rotation went out over a weekend and broke single sign-on between an external vendor, our routing microservice, and a backend service.

The old certificates were already revoked. That's the detail that made it bad — there was no rollback. You couldn't undo it even if you wanted to.

The lead developer worked it through the weekend and got nowhere, then had to leave for mandatory leave. By Monday morning it was a Sev-1 and customers couldn't log in.

I got pulled in with one colleague, mostly because I'd spent time on SSL problems earlier that year.

### Finding it

Into the network logs, tracing the handshake.

The new certificates were validating correctly. That mattered more than it sounds, because everyone's first instinct was that the rotation must have been done wrong — a rotation broke it, so the rotation is the bug. It wasn't. The failure came later in the handshake, during cipher suite negotiation.

A legacy SOAP integration sitting in the path couldn't speak the encryption standards the new certificates required. Both sides were behaving correctly and had nothing in common to say.

### The thing we didn't do

There's an obvious remedy once you know that: downgrade the SSL configuration until the old integration understands it again. It would have worked, probably within the hour.

Nobody proposed it. I've seen this story told as though there was a big argument about it, and there wasn't — it was never on the table, because everyone in the room understood what it actually costs. Downgrading encryption to end an outage isn't temporary. It feels temporary. The moment it works the pressure disappears, the ticket to re-upgrade goes into a backlog behind things with visible business value, and nobody ever comes back to it. You'd be carrying a security hole indefinitely because a Monday was bad.

### The idea came from the guy on leave

There was a known item in our backlog: migrate that exact SOAP integration to REST. A ticking timebomb everyone acknowledged and nobody had scheduled, which is where important-but-never-urgent work goes to sit.

The lead developer — still on leave, still checking in — raised it. What if we just did it now?

My part was verifying it. I'd found the failure, so I could check whether the REST path actually removed it or just moved it somewhere we hadn't looked yet, and how long the rewrite would really take. It held up. I pitched it Tuesday morning as the fastest safe way out.

My supervisor gave us the go-ahead to build the proof of concept in QA, and then did the more valuable thing: she took every stakeholder conversation off us. A Sev-1 generates an enormous amount of people wanting updates, and she absorbed all of it so two engineers could sit in the code. The lead developer kept checking in with guidance between whatever he was supposed to be doing on leave.

I rewrote the routing microservice for the REST payloads. My colleague updated the backend. It was a brutal couple of days and we worked most of them.

### What happened

We pushed Wednesday. It worked on the first deployment, SSO came back, and nothing broke afterward.

The outcome I care about is the second one: the tech debt that caused the outage is gone. That failure can't recur, because the thing that failed doesn't exist. The team got an operational excellence award and the division's Chief Officer set up a call with my supervisor to say thanks.

### What I actually took from it

Four people, four different jobs, and it only worked because nobody tried to do someone else's.

The lead developer had the idea and no ability to execute it. I had the diagnosis and could verify the idea was sound. My colleague and I had the code. My supervisor had the one thing that made the other three possible, which was keeping fifteen anxious stakeholders out of our afternoon.

The version of this where I'm the hero is a worse story and it isn't true.`,
    relatedExperienceIds: ["exp_ubs_swe"],
    skillIds: [
      "skl_ssl_tls",
      "skl_incident_response",
      "skl_microservices",
      "skl_rest_soap",
      "skl_java",
      "skl_spring_boot",
      "skl_network_security",
    ],
    iconName: "shield",
    readingMinutes: 5,
    featured: true,
    order: 1,
    visibility: "public",
  },

  {
    id: "story_reverse_routing",
    slug: "it-worked-and-it-was-wrong",
    title: "It Worked, and It Was Wrong",
    headline:
      "I built something nobody had thought of. It passed every test. It got scrapped, and I'd accepted the constraint that killed it.",
    org: "UBS",
    type: "Failure",
    date: { year: 2022, month: 6 },
    star: {
      situation:
        "We were decoupling a legacy Spring Web MVC monolith into a React front end and a Spring Boot backend. Leadership imposed a constraint: the enterprise load balancer mappings couldn't change. Because a React SPA is normally the entry point, that forced an inverted architecture.",
      task: "Build a routing solution where the backend stayed the entry point and manually routed traffic back up to React, without breaking the user experience.",
      action:
        "Weeks of work — custom interceptors resolving conflicts between the React router and the Spring router, deep-linking and state preserved. It worked, and it passed every functional QA test.",
      result:
        "It was still wrong. The inverted flow added a network hop to every request, which blew our response-time SLA, and the project was scrapped. I'd accepted a constraint I should have challenged.",
    },
    body: `We were breaking a legacy Spring Web MVC monolith into a React front end and a Spring Boot backend. Time and money were tight, so leadership handed down a constraint: we couldn't touch the enterprise load balancer mappings.

That has a consequence you don't see straight away. A React single-page app is normally the entry point — traffic arrives at the front end, which calls the backend for data. If the load balancer can't change, the backend stays the entry point. Which means traffic has to land on Spring Boot and get routed *back up* to React.

That's backwards. Nobody builds this.

### Building it anyway

I spent weeks on it, and honestly it was a great problem. The hard part was the routers: React has a client-side router, Spring has a server-side one, and in this architecture both are looking at the same URL with completely different ideas about what it means. I wrote custom interceptors to arbitrate between them so deep links still worked and state survived.

And it worked. I built something nobody on the team had thought of, and it passed every single functional QA test.

### Then we performance-tested it

The inverted flow adds a network hop. Every request. No exceptions.

That blew our response-time SLA — not by a little, and not in a way any optimisation was going to fix, because the extra hop *was* the architecture rather than an inefficiency inside it.

Scrapped. Deferred until a later migration where the load balancers could be configured properly. Weeks of work, deleted.

### What I got wrong

For a while I filed it under bad luck. Hard constraint, bad outcome, executed well within it.

That's not what happened.

I didn't misread the requirement. I accepted a constraint I should have pushed on.

"We can't touch the load balancer mappings" arrived as a fact and I treated it as one — as the shape of the problem, rather than a decision someone made under time pressure without knowing what it would cost. Nobody in that room had connected "don't change the mappings" to "add a network hop to every request and fail the SLA." I was the person closest to the architecture. I could have made that connection in week one. I didn't.

There was a version where I spend two days on the performance implications and come back with: this constraint costs us the SLA, here's the math, still worth it? That conversation could have gone either way. But it costs two days instead of several weeks, and the people deciding would have known what they were choosing.

### What changed

I challenge the constraint before I engineer around it. Not reflexively — most constraints are real, and working inside them is the job. But I make sure someone has actually priced it, and if nobody has, I go and price it before I start building.

The other thing: clever isn't correct. I built something ingenious that passed every test and was still the wrong answer. Passing tests means you built the thing right. It says nothing about whether it was the right thing.`,
    relatedExperienceIds: ["exp_ubs_swe"],
    skillIds: [
      "skl_spring_boot",
      "skl_react",
      "skl_java",
      "skl_jsp",
      "skl_microservices",
      "skl_perf_optimization",
      "skl_system_design",
    ],
    iconName: "wrench",
    readingMinutes: 4,
    featured: false,
    order: 8,
    visibility: "public",
  },

  {
    id: "story_pipeline_not_app",
    slug: "six-months-in-the-wrong-file",
    title: "Six Months in the Wrong File",
    headline:
      "Six engineers had hunted a deployment bug in the application code. The reason none of them found it is the whole story.",
    org: "UBS",
    type: "Debugging",
    date: { year: 2022, month: 9 },
    star: {
      situation:
        "One of our microservices had suffered intermittent deployment failures for more than six months. Several developers had taken a run at it. It was still there.",
      task: "My supervisor asked me to have a fresh look.",
      action:
        "Before opening anything I asked why six competent engineers had missed it. The answer was that every one of them had started where the failure surfaced — the application code. So I started somewhere else: the server configuration and the deployment pipeline. The root cause was a configuration mismatch in the dedicated server's deployment process, nothing to do with the Java. While fixing it I realised the service had its own dedicated server for no good reason.",
      result:
        "I rewrote the pipeline to deploy onto our existing web application server, which removed the class of bug and a server at the same time. Six-month bug closed in days, with less infrastructure than before.",
    },
    body: `A microservice had been failing to deploy, intermittently, for over six months. Several developers had taken a run at it. It was still there when my supervisor asked me to have a look.

### The question I asked before opening anything

The instinct is to start reading code. I did something else first, and it's the only reason this story exists.

Why had six competent engineers failed to find it?

That's not rhetorical. These weren't careless people. They had time, motivation, and more context on the service than I did. If the bug were findable the way they were looking, one of them would have found it. So the way they were looking was the problem.

And it was obvious once I looked at it. Every one of them had opened the application codebase. Not out of laziness — because that's where the failure *showed up*. The deployment fails, the logs point at the service, the service is a Java application, so you open the Java.

Something surfacing in a place is weak evidence that it started there. Easy to say. Surprisingly hard to act on, because the place it surfaced is the only concrete thing you've got.

### Looking where nobody had looked

So I deliberately didn't open the application code. I went to the server configuration and the deployment pipeline.

There it was: a configuration mismatch in the dedicated server's deployment process. Nothing to do with the Java at all. Six months of people reading the wrong file very carefully.

### The second thing

I could have fixed the mismatch and closed the ticket in an afternoon.

But the mismatch existed because this service had its own dedicated server, and I couldn't work out why. It was one microservice, it wasn't resource-hungry, and we already ran a stable web application server with room for it. The dedicated box was a decision someone made once, that nobody revisited, that quietly created the surface this bug lived on.

So instead of patching the mismatch I rewrote the pipeline to deploy the service onto the existing server. That removed the bug by removing the thing that could produce it, and removed a server and its patching burden while it was at it.

### What happened

The failures stopped. A six-month bug closed in days, and the infrastructure got *smaller* rather than more complicated, which is not the direction these things usually go.

The move that mattered wasn't the fix. It was spending five minutes on "why did smart people miss this" before spending five hours looking where they'd already looked.`,
    relatedExperienceIds: ["exp_ubs_swe"],
    skillIds: [
      "skl_cicd",
      "skl_linux",
      "skl_git",
      "skl_java",
      "skl_spring_boot",
      "skl_system_design",
      "skl_microservices",
    ],
    iconName: "search",
    readingMinutes: 4,
    featured: false,
    order: 6,
    visibility: "public",
  },

  {
    id: "story_account_service",
    slug: "the-service-nobody-owned",
    title: "The Service Nobody Owned",
    headline:
      "A legacy service was breaching SLA for hundreds of applications. Its team had already moved on to building the replacement.",
    org: "UBS",
    type: "Ownership",
    date: { year: 2022, month: 10 },
    star: {
      situation:
        "One of our backend services was violating its SLA. The bottleneck traced to a legacy identity service used by hundreds of applications across the firm — declared end-of-life, with its original maintainers fully moved onto building the replacement. Unowned and unsupported.",
      task: "It was slated for deprecation eventually, but hundreds of applications were breaching SLA now. I took over a codebase that wasn't mine and that I'd never seen.",
      action:
        "Profiled the whole execution flow, timing every external REST call and stored procedure. That surfaced a REST call fetching identity data twice in the same workflow, against data that never changed in between. I checked with the team building the replacement that the second call wasn't encoding something I couldn't see. It wasn't.",
      result:
        "Removing it cut average response time by 53%, pulling the service back inside SLA for every application depending on it, not just ours.",
    },
    body: `One of our backend services was missing its response-time SLA. Following the bottleneck led out of our code and into a legacy identity service that half the firm depended on.

That service was end-of-life. Its maintainers had moved onto building the replacement — the right call for their team, and it meant nobody was looking after the thing still running in production. Unowned, unsupported, and load-bearing for hundreds of applications.

### The argument for leaving it alone

It's a real argument.

The service was being replaced. Any effort on it had a known expiry date. It wasn't my team's code, wasn't our responsibility, wasn't on our roadmap, and my own manager had a legitimate claim on my time.

What tipped it was the blast radius. "Eventually deprecated" isn't a state a system is in — it's a plan for later, possibly much later, and in the meantime hundreds of applications were breaching SLA every single day. None of those teams could do anything about it. They didn't have access, and they weren't going to get it.

If it had been one internal tool used by four people, I'd have walked past.

### Working on code I'd never seen

I had no context here. That changes the approach, because you can't reason from intent when you don't know the intent.

So I did the thing that works without domain knowledge: profiled the whole execution flow and measured. Every external REST call, every stored procedure, timed. Not hunting anything specific, just building a picture of where the time went.

The picture showed a REST call fetching identity data twice in the same workflow. Same data, unchanged between calls, fetched again.

### Asking first

The obvious move is to delete the second call. It takes minutes.

I didn't, because I'd just spent a day proving I didn't understand this system. A redundant-looking call in legacy financial code is exactly the sort of thing that turns out to be holding something up for a reason nobody wrote down.

So I asked the team building the replacement whether it meant something. It didn't — legacy redundancy, nothing more.

### Result

Removing it cut average response time by 53%, benchmarked before and after. That pulled the service back inside SLA for everyone depending on it.

### The part that stays with me

A system was quietly failing for a lot of people and it was structurally nobody's job to fix it.

Those situations are common, and they're stable, because everyone involved is behaving sensibly. The owners are right to build the replacement. The consumers have no access. Each affected team's share of the pain is small enough to route around. So it just sits there.

I have a low tolerance for that, especially when the number of people affected is large. It's the trait behind most of the work I'm proudest of.

It's also the one I've had to learn to manage. Picking up an orphaned problem means spending your own time on a priority nobody assigned you, and I've crossed that line before. What changed isn't the instinct — it's that I tell my supervisor where my time is going before I go there.`,
    relatedExperienceIds: ["exp_ubs_swe"],
    skillIds: [
      "skl_java",
      "skl_rest_soap",
      "skl_perf_optimization",
      "skl_microservices",
      "skl_postgres",
      "skl_system_design",
    ],
    iconName: "wrench",
    readingMinutes: 4,
    featured: false,
    order: 7,
    visibility: "public",
  },

  {
    id: "story_entrypoint_filter",
    slug: "where-does-this-data-come-from",
    title: "Where Does This Data Come From?",
    headline:
      "A four-week rewrite across the whole database, replaced by a one-week change — because of one question asked before writing any code.",
    org: "UBS",
    type: "Simplification",
    date: { year: 2023, month: 2 },
    star: {
      situation:
        "The department was adapting applications to support a new organisational platform while still running the legacy one. The team's plan was to add a filtering column across the database, requiring updates to nearly every query and Java data structure. Four weeks.",
      task: "I was assigned to execute it, and I thought the architecture was unnecessarily invasive.",
      action:
        "Before writing code I traced the data flow and asked where the document IDs actually originate. The backend entry points controlled the flow to the front end completely — so I added the column to one core table and filtered at the entry points, which meant nothing downstream needed to know the column existed.",
      result:
        "One week instead of four, through QA with no bugs. The platform was shelved later for business reasons; the engineering call still holds.",
    },
    body: `The department was adapting every application to support a new organisational platform while continuing to run the old one. Different platforms, different document sets, same applications.

The team's plan: add a filtering column across the database, then update nearly every query and its Java data structure to respect it. Four weeks.

I got the ticket, and I thought the architecture was wrong before I started. Invasive, touching almost everything, creating regression risk in proportion to how many places it changed.

### The question

Before writing anything, I traced the data flow and asked something that sounds too simple to be worth asking.

*Where do these document IDs actually come from?*

Not where they get used. Where they originate. The answer: the backend entry points controlled the flow to the front end completely. Every document that ended up anywhere downstream had come through a handful of entry points first.

That reframes the problem. The team's plan filtered at the point of *use*, which is why it had to touch everything — every place a document is used is a place that needs to know about the filter. Filter at the point of *entry* instead and nothing downstream ever sees a document it shouldn't have, so nothing downstream needs to know the filter exists.

### What I built

The column on one core table. Filtering at the entry points. Nothing else.

Downstream queries and data structures were untouched, because as far as they were concerned nothing had changed. They received documents and processed them, exactly as before. They just stopped receiving the wrong ones.

### Result

One week instead of four. Through QA with no bugs.

The platform got shelved later for business reasons, so it never reached production. Doesn't change my view of the call — it was right on the information available, and it saved three weeks and a lot of regression risk either way.

### The transferable bit

The whole story is the question, not the code. The implementation was unremarkable; any competent engineer writes the same thing given the same insight.

What made the difference was spending an hour on "where does this data come from" before spending four weeks on "how do I filter it everywhere." When a solution is invasive, that's usually a symptom — you're working at the wrong layer, and the fix is upstream of where you're standing.`,
    relatedExperienceIds: ["exp_ubs_swe"],
    skillIds: [
      "skl_java",
      "skl_sql",
      "skl_system_design",
      "skl_perf_optimization",
    ],
    iconName: "compass",
    readingMinutes: 3,
    featured: false,
    order: 9,
    visibility: "public",
  },

  {
    id: "story_phantom_timestamp",
    slug: "the-bug-that-lived-for-a-year",
    title: "The Bug That Lived for a Year",
    headline:
      "A year of intermittent failures on a system that wasn't allowed to fail. The bug wasn't in the application that was throwing the errors.",
    org: "UBS",
    type: "Debugging",
    date: { year: 2023, month: 7 },
    star: {
      situation:
        "Core financial applications under a 99.9% availability SLA had been throwing intermittent HTTP 500s in production for over a year, across handoffs between multiple engineering teams. Nobody had found the cause, so each team had added a workaround to bypass the failure whenever it fired.",
      task: "Workarounds on a high-availability financial application are an operational risk pretending to be a fix. I wanted to find what was actually happening.",
      action:
        "Two weeks isolating conditions during error spikes with DevOps, then tracing execution paths through production logs. The application wasn't the problem — an overnight batch job was writing state the application then read incorrectly, working from a stale in-memory copy and throwing a NullPointerException. Before reaching for locking, I sat with business stakeholders to find out what precision the domain actually needed. Neither millisecond nor second-level.",
      result:
        "Dropping the seconds field from the timestamp logic made the mismatch impossible. The 500s stopped and never came back, which removed the workaround maintenance burden and protected the availability metric.",
    },
    body: `I joined a team running core financial applications under a 99.9% availability SLA and found something that shouldn't have been possible. For over a year, across handoffs between multiple engineering teams, the application had been throwing intermittent HTTP 500s in production.

Nobody had found the cause. So each team in turn had done the reasonable-looking thing and added a workaround to catch the failure when it fired.

A year of workarounds on a system that wasn't allowed to go down.

### Why this was worth two weeks

The tempting read is that the workarounds were working. Errors were being caught, users were mostly fine, the availability metric was holding. On that view chasing the root cause is a nice-to-have.

I don't think that survives looking at what a workaround actually is. Each one is code whose correctness depends on an assumption nobody verified, guarding against a failure nobody understands. They pile up. They interact. And when one of them is wrong the result isn't a 500 — it's silently incorrect behaviour in a financial system, which is a lot worse than the thing being worked around.

### It wasn't the application

Two weeks with DevOps isolating the exact conditions during error spikes, then tracing execution paths through the logs during the failures themselves.

The application was throwing the errors. It wasn't causing them.

Overnight, a batch job processed and wrote state that the application picked up the next day. The writes landed in the database correctly — that part was never broken, which is why anyone who looked at the database found nothing wrong. But the application was working from a stale in-memory copy of the object, and when the two diverged it dereferenced something that wasn't there any more. NullPointerException, surfacing as a 500.

Everyone before me had looked at the application, because the application was what failed. The state came from somewhere else entirely, on a schedule, overnight, in a component nobody thought of as part of this system.

### The part I actually care about

Having found a concurrency bug, the obvious next move is concurrency machinery. Locking, synchronisation, force the in-memory copy to refresh, serialise the path.

I didn't, because I hadn't asked what the system needed yet.

So I sat down with the business stakeholders and went through the actual domain requirements. Turned out the workflow needed neither millisecond precision nor second-level precision. It couldn't — the data came from an overnight batch. Nothing about it was accurate to the second in the first place, and nothing downstream ever cared. The precision was an artifact of how someone had written the timestamp, not a requirement anyone had.

So the fix was to drop the seconds field. The state mismatch stopped being possible, because the two copies could no longer disagree.

### What happened

The 500s stopped completely and never came back. The workarounds went with them, and the availability metric stopped being propped up by a stack of unverified assumptions.

The lesson isn't about concurrency. It's that "what should I build" is the second question, and I nearly skipped the first one. The answer here was less engineering, not more — and I only found it by asking what the system actually needed before deciding what to add to it.`,
    relatedExperienceIds: ["exp_ubs_swe"],
    skillIds: [
      "skl_java",
      "skl_spring_boot",
      "skl_drools",
      "skl_autosys",
      "skl_sql",
      "skl_incident_response",
      "skl_system_design",
    ],
    iconName: "bug",
    readingMinutes: 4,
    featured: true,
    order: 2,
    visibility: "public",
  },

  {
    id: "story_halted_the_vendor",
    slug: "opinions-lose-to-status-reports",
    title: "Opinions Lose to Status Reports",
    headline:
      "A cloud migration reporting green that wasn't. I'd been back on the project three weeks and had no authority to stop anything.",
    org: "UBS",
    type: "Leadership",
    date: { year: 2023, month: 10 },
    star: {
      situation:
        "After a year reassigned elsewhere during an organisational restructuring, I came back to my original application just as its cloud migration approached its production release date. The migration was in bad shape — the vendor team lacked domain knowledge, QA was fundamentally failing, several legacy services were broken. The vendor was reporting green and holding the date.",
      task: "A failed release would have hit every enterprise team consuming our APIs. I had no formal authority over the vendor and had been back for a matter of weeks.",
      action:
        "Instead of raising a concern, I audited the QA environment and compiled hard data on what was actually failing, then took it to the product and business owners and formally advised halting the date. I also took architectural ownership from the vendor and replaced their big-bang deployment with a phased one — batch jobs first, backend services next, the web app last.",
      result:
        "Leadership approved the pushback and the revised strategy. Over the following nine months I led Phase 1 to completion, a stable lift-and-shift to Azure VMs that held uptime for our API consumers.",
    },
    body: `I'd been reassigned to other applications for a year during an organisational restructuring. I came back to my original one just as its cloud migration was approaching its production release date.

The migration was in bad shape. The vendor team executing it didn't have the domain knowledge the work needed, QA was fundamentally failing rather than marginally failing, and several legacy services were outright broken.

The vendor was reporting green and holding the date.

### The real problem

Not the migration. The migration was fixable.

The problem was that I'd been back three weeks, had no formal authority over the vendor, and was about to tell a room full of people that the thing their status reports said was fine was not fine.

I could see exactly how that goes. The engineer who's been gone a year comes back and says the project is broken. That's an opinion. It lands on one side of the table, and on the other side there's a status report from the team actually doing the work, with dates and percentages on it.

Opinions lose to status reports. Every time, and rightly — a room can't run on vibes, and the vendor's report was at least a document.

### So I didn't bring an opinion

I audited the QA environment and compiled hard data on what was failing. Specific services, specific failures, reproducible.

Then I took it to the product and business owners and formally advised halting the release date.

That's the whole trick, and it isn't really a trick. I didn't need authority because I wasn't asking anyone to trust me. I handed them evidence and let them reach the conclusion themselves. Authority is a way of getting people to accept a claim without evidence. If you've got the evidence you don't need it.

### Not just the person who says no

The second half mattered as much, and I nearly missed it.

Someone who halts a release and stops there has made things worse for everyone who has to deal with the aftermath. There's now no plan and no date, and the person responsible has moved on.

So I took architectural ownership from the vendor and scrapped their big-bang deployment. External teams consumed our APIs and needed time to update their endpoints, which made a single cutover risky for reasons that had nothing to do with our own readiness. I proposed phasing it to contain the blast radius: batch jobs first, backend services next, and the web application last once everything underneath it was stable.

An objection with a plan attached is a proposal. Without one it's just a problem that now belongs to someone else.

### What happened

Leadership approved the pushback and the revised strategy. Over the next nine months I led Phase 1 to completion — a stable lift-and-shift to Azure VMs. It held uptime for our API consumers and gave the later phases something solid to stand on.

What I'd tell a younger version of myself: you almost never need permission to be right. You need evidence, and you need to turn up with the next step already worked out.`,
    relatedExperienceIds: ["exp_ubs_swe"],
    skillIds: [
      "skl_cloud_migration",
      "skl_azure",
      "skl_spring_boot",
      "skl_system_design",
      "skl_microservices",
      "skl_agile",
    ],
    iconName: "compass",
    readingMinutes: 4,
    featured: true,
    order: 3,
    visibility: "public",
  },

  {
    id: "story_vault_no_blueprint",
    slug: "the-secret-you-can-still-read",
    title: "The Secret You Can Still Read",
    headline:
      "Moving credentials into a vault is the easy part. Deciding who can no longer see them is the decision.",
    org: "UBS",
    type: "Security Engineering",
    date: { year: 2023, month: 11 },
    star: {
      situation:
        "A department-wide mandate required every application to move secrets out of codebases and environment variables into an enterprise vault. I was assigned to lead our integration, with no prior exposure to enterprise secrets management and no internal blueprints — nobody on the team had done it either.",
      task: "Not just make the application read passwords from somewhere else, but design an access model that was actually defensible, from nothing.",
      action:
        "I spent real time in the documentation understanding the vault structure and RBAC model before writing code, because the access model determined everything downstream. Migrating the keys wasn't enough: if the development team could still read production secrets, all we'd done was move where they were stored. So I built strict application profiles with read-only access and separated human access entirely, leaving production secrets with Production Support alone, then handled certificate generation so transit was encrypted end to end.",
      result:
        "Shipped to production, eliminating hardcoded secrets exposure with an RBAC-compliant posture. It made developer life harder.",
    },
    body: `Department-wide mandate: every application moves its secrets out of codebases and environment variables and into the enterprise vault.

I was assigned to lead our integration. I'd never touched enterprise secrets management, and there were no internal blueprints — nobody on the team had done it either. The mandate said what, not how.

### Reading before writing

I spent real time in the documentation understanding the vault's structure and its role-based access model before touching any code.

That's not diligence for its own sake. The access model decides everything downstream: how the application authenticates, what an attacker gets if they compromise it, who can rotate what, what the audit trail looks like. Get it wrong and you discover it later, and then you're not adjusting the integration, you're redoing it.

### The trap

It's a comfortable one, because it satisfies the mandate completely.

You migrate the keys. Secrets are out of the codebase. Out of environment variables. In the vault. Checklist done, audit passed, move on.

But if the development team can still read production secrets, the number of people who can see them hasn't changed. The attack surface is the set of humans with access, and you haven't touched it. You've changed where the file lives.

So I built it differently. Strict application profiles — the application gets read access to what it needs and nothing else. And human access separated entirely: the development team had no ability to view or modify production secrets at all. That sat with Production Support. Then certificate generation, so the secrets were encrypted in transit as well as at rest.

### What it cost

It made developer life harder.

Debugging a production secrets issue used to mean looking at the value. Now it means going through Production Support. That's slower, it's more annoying, and on a bad day it's the difference between fixing something in ten minutes and fixing it in two hours.

That friction is the mechanism, not a side effect. The security property *is* that a developer can't do that any more.

But it was a real cost, paid by real colleagues, and anyone weighing up doing the same thing should know it's there. A security decision that costs nothing wasn't a decision; it was a formality. This one cost something, which is how I know it did something.

### What shipped

The integration went to production and eliminated our hardcoded secrets exposure.

Least privilege is easy to state and uncomfortable to implement, because implementing it means taking access away from specific people you work with who had perfectly good reasons for wanting it. The principle is free. The application of it isn't.`,
    relatedExperienceIds: ["exp_ubs_swe"],
    skillIds: [
      "skl_vault",
      "skl_secure_coding",
      "skl_ssl_tls",
      "skl_threat_modeling",
      "skl_java",
      "skl_linux",
    ],
    iconName: "lock",
    readingMinutes: 4,
    featured: false,
    order: 10,
    visibility: "public",
  },

  {
    id: "story_handover",
    slug: "making-myself-replaceable",
    title: "Making Myself Replaceable",
    headline:
      "I spent three years becoming the person who knew where everything was buried, and my notice period undoing that.",
    org: "UBS",
    type: "Ownership",
    date: { year: 2024, month: 6 },
    star: {
      situation:
        "By the end of my time at UBS I understood our core application end to end. It had been built before me without coding standards or documentation; I'd spent three years refactoring it toward standards and writing what documentation existed. Most of what I knew about its behaviour still lived only in my head, because I'd learned it by hitting it.",
      task: "I was leaving for my Master's, and a successor team was inheriting it.",
      action:
        "Spent my notice period on the handover rather than winding down. Documented the hidden services nobody knew were running, the behaviours you only find by encountering them, the post-migration infrastructure, and a full map of consumers and providers — each with emergency contacts and the exact scope of its integration. Then ran knowledge-transfer sessions with the team.",
      result:
        "They took over an application they could operate, instead of one they'd have had to reverse-engineer during their first incident.",
    },
    body: `By the end of my three years I was the person who understood our core application end to end.

I'd led the Azure migration. Found the intermittent 500s that had been there a year. Rewritten the Drools workflow, redesigned the batch pipeline's event flow, rebuilt the deployment scripts after a configuration drift incident I caused myself.

The application had been built before my time without coding standards and with almost no documentation. Three years of my work had gone into changing that — refactoring toward standards, writing the Confluence pages that existed. But a lot of what I knew about how it actually behaved had never made it out of my head, because I'd learned it by running into it.

Then I was leaving for my Master's, and a successor team was inheriting it.

### What a notice period is usually for

Winding down. Closing out what you can, handing over tickets, going to fewer meetings. Nobody would have said a word.

The problem is what that leaves behind. The team inheriting this application would meet its undocumented behaviours the way I had — during an incident, at speed, with something broken. Every quirk I'd found by hitting it, they'd find by hitting it, except they'd be doing it with production down and the person who knew the answer on another continent.

### What I documented

Properly, on Confluence, over the notice period.

**The hidden services.** Processes running that nobody currently on the team knew existed. Every long-lived application accumulates these. They're invisible until they fail, and then they're invisible *and* on fire.

**The behaviours you only find by encountering them.** The thing that looks broken and isn't. The sequence that has to happen in a specific order for a reason lost to history.

**The infrastructure after the migration.** The Azure estate as it actually was, rather than as the original plan described it.

**The full consumer and provider map.** Every upstream and downstream integration, and for each one: emergency contacts, and exactly how tightly it was coupled to us.

Then knowledge-transfer sessions with the team, because a document nobody has read isn't knowledge transfer.

### The emergency contacts

That's the part I'd point at.

You don't write that down for completeness. You write it when you're specifically picturing a 3am incident you won't be there for, and trying to make it fifteen minutes shorter for someone you'll probably never meet.

### Why this one matters to me

Most of my stories have the same shape. Something was broken, other people hadn't fixed it, I fixed it. The year-old bug. The six-month bug. Taking architecture back from a vendor. Getting pulled into the Sev-1.

All true. Told one after another they describe someone who's good at being indispensable — and being indispensable isn't a virtue. It's a bus factor of one with better PR.

This is the one where there was nothing in it for me. I was leaving. Nobody would have checked. And I spent the time deliberately making myself replaceable, because the alternative was leaving a team to reverse-engineer three years of undocumented decisions during their first bad week.

The last useful thing I could do was make what I knew not depend on me.`,
    relatedExperienceIds: ["exp_ubs_swe"],
    skillIds: [
      "skl_technical_writing",
      "skl_system_design",
      "skl_mentorship",
      "skl_cloud_migration",
      "skl_azure",
    ],
    iconName: "users",
    readingMinutes: 4,
    featured: false,
    order: 11,
    visibility: "public",
  },

  {
    id: "story_hardening_the_sandbox",
    slug: "a-hole-you-put-there-on-purpose",
    title: "A Hole You Put There on Purpose",
    headline:
      "Building an exam environment where 150 students run attack code, and everything holds except the one thing that's supposed to break.",
    org: "Arizona State University",
    type: "Security Engineering",
    date: { year: 2025, month: 6 },
    star: {
      situation:
        "ASU's software security course runs hands-on exams where students exploit real vulnerabilities. The platform gave each student their own container and handled isolation between students. My job was inside that boundary: make sure a student could exploit exactly what the exercise intended and nothing else.",
      task: "A security challenge is a deliberate hole. The intended hole has to be reachable while everything around it stays locked, on a machine the student has full access to. Too loose and they solve it by a route that teaches nothing; too tight and they can't solve it at all.",
      action:
        "Restricted the environment with landrun, controlling which directories a student could reach and what each service could touch. The harder part was the services — a challenge ran several processes on different ports, and exposing them directly would let a student step outside the intended attack surface, so I proxied them to sandboxed instances instead. I also tracked flag submission timestamps and analysed logs for collaboration patterns.",
      result:
        "It held across 150 students running exploit code. The intended surfaces stayed exploitable, the rest stayed locked, and integrity violations surfaced through the log analysis.",
    },
    body: `ASU's software security course runs hands-on exams. Students don't answer questions about vulnerabilities — they break real ones, live, while being graded.

The platform gave each student their own container per challenge and handled keeping students isolated from each other. My work was inside that boundary: making sure that within a challenge, a student could exploit exactly what the exercise intended and nothing else.

### The design problem

A security challenge is a hole you put there on purpose. You *want* the student to break something — that's the entire point, and a challenge with no vulnerability teaches nothing.

Which makes this a strange thing to build. The intended hole has to be reachable. Everything around it has to be locked. And the person you're defending against has full access to the machine, is actively looking for a way through, and is being graded on finding one.

Too loose and they reach past the exercise and solve it by a route that teaches them nothing. Too tight and they can't solve it at all.

From the student's side, both failures look identical: the thing doesn't work.

### What I built

Directory and capability restrictions with landrun — controlling what a student could reach and what each service could touch. That's the straightforward half.

The services were harder. A challenge ran several processes on different ports, and exposing them directly would have let a student talk to something in a way the exercise never anticipated and reach the flag by a path that wasn't the lesson. So instead of exposing the real services, I proxied them to sandboxed copies on separate ports, which meant I decided exactly what was reachable and how.

### Prevention is a guess until you check

The mistake in most security designs is treating prevention as enough. You build the controls, you think about them carefully, you conclude they hold — and what you've actually produced is a hypothesis you never test.

So I instrumented the other side too: flag submission timestamps, and log analysis looking for the patterns that show up when people are working together. Partly defence in depth, mostly a feedback channel. If the controls were wrong, that was how I'd find out instead of never finding out.

### What happened

It held across 150 students running exploit code. The intended surfaces stayed exploitable, the rest stayed locked, and the integrity violations that did happen showed up in the logs and went to the department.

### The layer

The platform owned multi-tenancy — keeping students isolated from each other — and the orchestration. I didn't build that. What I owned was hardening inside the container I was handed.

That's a real isolation problem at a smaller layer, and it's where I first felt the tension between a boundary being airtight and the environment staying usable. Those two goals genuinely fight each other, and the fight is what pulled me toward this kind of work.`,
    relatedExperienceIds: ["exp_asu_ta"],
    skillIds: [
      "skl_docker",
      "skl_landrun",
      "skl_linux",
      "skl_bash",
      "skl_python",
      "skl_binary_exploitation",
      "skl_threat_modeling",
      "skl_secure_coding",
      "skl_flask",
    ],
    iconName: "shield",
    readingMinutes: 4,
    featured: false,
    order: 12,
    visibility: "public",
  },

  {
    id: "story_sandbox_crashed",
    slug: "i-tested-that-it-worked",
    title: "I Tested That It Worked",
    headline:
      "The exam environment I built passed every test and fell over the moment the whole class used it at once.",
    org: "Arizona State University",
    type: "Failure",
    date: { year: 2025, month: 9 },
    star: {
      situation:
        "First live exam on the environment I'd built. Everything had passed functional testing. Under real concurrent load — the whole class at once, mid-exam — it didn't hold, and students started getting errors during something they were being graded on.",
      task: "Two problems, and the second was worse. Fix the environment. But the exam was also burned: students had seen the challenges, so it couldn't be re-run. We needed a fresh exam, and the schedule gave us about two days.",
      action:
        "Worked the fix and the replacement exam in parallel. The fix was straightforward once I understood the failure mode. The harder call was accepting the original exam was unrecoverable, since any salvage would have advantaged the students who'd seen more of it.",
      result:
        "A new exam ran within two days on a fixed environment, and it held.",
    },
    body: `First live exam on the environment I'd built.

Everything had passed functional testing. I'd gone through the challenges, checked the restrictions held, confirmed the proxied services behaved, verified the intended exploits worked and the unintended paths didn't.

Then the whole class hit it at once, mid-exam, and it fell over. The layer hosting the sandboxes went down and students started getting errors during something they were being graded on.

That's about as bad as it gets in this job.

### Two problems, and the second was worse

The environment failing was the obvious one, and the easier one.

The harder one: the exam was burned. Students had already seen the challenges. We couldn't just fix the infrastructure and re-run it, because whoever had got furthest before it died now had an advantage that had nothing to do with how good they were.

We needed a completely new exam. The schedule gave us about two days.

### What I did

Both in parallel. The fix was the straightforward part once I understood what had actually failed.

The harder call was the exam, and it wasn't technical. Accepting the original was unrecoverable rather than trying to rescue it. Rescue was tempting — writing a new exam in two days is a lot of work, and there were partial-credit schemes that looked defensible if you didn't look hard. But every one of them favoured the students who'd seen more of the original, and there was no version of that which was fair.

So we wrote a new one.

### What happened

A new exam ran within two days on a fixed environment, and it held.

### The part I carry

I tested that it worked. I never tested that it worked when everyone used it at once.

Those are different questions and I'd only asked the easy one. Every test I ran was a correctness test — does this do the right thing — and correctness with one user tells you almost nothing about behaviour under load. I knew that as an abstract fact. I hadn't turned it into something I actually did.

I still don't know whether my container configuration drove the load that took the hosting layer down or whether that layer fell over on its own. Both are plausible and I never got a clean answer.

Load and concurrency are now things I plan for instead of things I find out about.`,
    relatedExperienceIds: ["exp_asu_ta"],
    skillIds: [
      "skl_docker",
      "skl_linux",
      "skl_incident_response",
      "skl_system_design",
    ],
    iconName: "zap",
    readingMinutes: 3,
    featured: false,
    order: 13,
    visibility: "public",
  },

  {
    id: "story_stepping_stones",
    slug: "from-60-to-80",
    title: "From 60 to 80",
    headline:
      "The course had a reputation for being brutal. The problem wasn't the students, and it wasn't the material.",
    org: "Arizona State University",
    type: "Mentorship",
    date: { year: 2025, month: 12 },
    star: {
      situation:
        "The advanced labs required real memory corruption work. Many students arrived without a security background and got stuck on the tooling — debuggers, disassemblers — long before reaching the actual lesson. The class average had historically sat below 60%.",
      task: "Close the gap between what the labs assumed and what students actually had.",
      action:
        "Broke the single large lab into a sequence of small ones, each isolating one idea, so a stuck student could see which part they were stuck on. Separately, changed how I ran office hours: instead of showing a working solution, I debugged the student's own broken code with them, and scheduled extra sessions in the two-day window before exams when demand actually peaked.",
      result:
        "Class average rose from below 60% to around 80%, and office hours shifted from tooling confusion to real security questions.",
    },
    body: `The advanced labs in ASU's software security course ask students to do real memory corruption work — break a program's memory in a specific way and take control of what it does next.

That's the lesson. But you can't get to it if you're still fighting the debugger. A lot of students arrived without a security background, and the tools were the obstacle before the material ever was. They were failing before the actual content started.

The class average had historically sat below 60%.

### The diagnosis

The easy conclusion is that the material is hard. It is hard. But that framing suggests the fix is more support for a difficult subject, and that's not what was going on.

The problem was that the lab was one big task. Five different things had to go right, all at once, with unfamiliar tools, graded as a single unit. A student stuck on one of them produced exactly the same output as a student stuck on all five: nothing works, no idea which part is wrong.

You can't learn from that. There's no signal in it.

### Stepping stones

So I broke it into a sequence of smaller challenges, each one isolating a single idea, each one solvable on its own with a clear pass or fail.

By the time a student reached the final one, the individual pieces were already theirs and the only thing left was putting them together — which is the actual lesson, and which they could now see clearly instead of guessing at through a fog of four other unsolved problems.

### The office hours change

Smaller, and it mattered as much.

The default move when a student is stuck is to show them a working solution. It fixes the immediate problem, they leave happy, the queue moves. I stopped doing it.

Instead, when someone brought me code that didn't work, we used *their* code as the starting point and found where their understanding had diverged from what the machine was actually doing. Much slower per student. Also the only version where anything sticks — because the skill isn't "write this exploit," it's "work out why yours doesn't run," and you can't teach that by handing someone a template.

I also looked at when students were actually submitting and added office hours in the two days before exams, where the demand really was rather than where the timetable assumed it would be.

### What happened

The class average went from below 60% to around 80%.

The measure I found more convincing was the questions. Before, office hours were mostly people confused about tools — how do I run this, why won't the debugger show me that. After, students were asking about the security concepts themselves. The floor had come up enough that the conversation could happen at the level the course was actually about.`,
    relatedExperienceIds: ["exp_asu_ta"],
    skillIds: [
      "skl_mentorship",
      "skl_binary_exploitation",
      "skl_gdb",
      "skl_ghidra_ida",
      "skl_c_cpp",
      "skl_x86_asm",
    ],
    iconName: "graduation",
    readingMinutes: 3,
    featured: false,
    order: 14,
    visibility: "public",
  },
];
