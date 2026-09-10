import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { flattenError } from "zod";
import { getDb } from "@/content/firestore/client";
import type { ContactSubmission } from "@/content/types";
import { sendContactNotification } from "./email";
import { getClientIp, isRateLimited } from "./rate-limit";
import { contactFormSchema } from "./schema";
import { verifyTurnstile } from "./turnstile";

export async function POST(request: Request): Promise<Response> {
  const body = await request.json().catch(() => null);
  if (body === null || typeof body !== "object") {
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 },
    );
  }

  // No honeypot, no submit-timing check: both were tried and dropped after
  // producing real false positives against genuine visitors (browser
  // extension autofill, then field-history suggestions — see
  // plan-progress.md). What's left: Turnstile actually verifies a human
  // solved a real challenge, and the rate limiter below caps abuse volume
  // even in the case that's somehow bypassed. Bot crawlers hitting this
  // form specifically aren't an expected threat for a personal portfolio
  // at this scale — revisit if that assumption turns out wrong.
  const result = contactFormSchema.safeParse(body);
  if (!result.success) {
    return NextResponse.json(
      { error: flattenError(result.error).fieldErrors },
      { status: 400 },
    );
  }

  const ip = getClientIp(request);

  // Turnstile before the rate limit, deliberately: it's a free external
  // check that filters out the bulk of bot traffic, so the (now in-memory,
  // but still worth minimizing) rate-limit bookkeeping only runs for
  // requests that already proved they're not a script (see rate-limit.ts).
  const verified = await verifyTurnstile(result.data.turnstileToken, ip);
  if (!verified) {
    return NextResponse.json(
      { error: "Verification failed. Please try again." },
      { status: 403 },
    );
  }

  if (isRateLimited(ip)) {
    return NextResponse.json(
      { error: "Too many submissions. Please try again later." },
      { status: 429 },
    );
  }

  // Firestore's `.set()` rejects `undefined` field values outright (`null`
  // is fine, `undefined` is not) — `company`/`role` are optional in the
  // schema, and `user-agent`/`referer` aren't guaranteed headers, so all
  // four are conditionally spread in rather than assigned directly, which
  // would otherwise write a literal `undefined` whenever they're absent.
  const userAgent = request.headers.get("user-agent");
  const referer = request.headers.get("referer");

  const submission: ContactSubmission = {
    id: randomUUID(),
    name: result.data.name,
    contact: result.data.contact,
    message: result.data.message,
    createdAt: new Date().toISOString(),
    status: "new",
    ...(result.data.company ? { company: result.data.company } : {}),
    ...(result.data.role ? { role: result.data.role } : {}),
    ...((userAgent || referer) && {
      meta: {
        ...(userAgent ? { userAgent } : {}),
        ...(referer ? { referer } : {}),
      },
    }),
  };

  await getDb().collection("contact").doc(submission.id).set(submission);
  await sendContactNotification(result.data);

  return NextResponse.json({ ok: true });
}
