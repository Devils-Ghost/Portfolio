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

  // Honeypot: a hidden form field (name: "website") real visitors never see
  // or fill in, but bots that auto-fill every input often do. Checked
  // before real validation/rate-limiting/Turnstile — there's no reason to
  // spend any of that work on traffic we're about to discard anyway.
  // Responds as a normal success, so a bot gets no signal it was caught.
  if (typeof body.website === "string" && body.website.length > 0) {
    return NextResponse.json({ ok: true });
  }

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

  const submission: ContactSubmission = {
    id: randomUUID(),
    name: result.data.name,
    company: result.data.company,
    role: result.data.role,
    contact: result.data.contact,
    message: result.data.message,
    createdAt: new Date().toISOString(),
    status: "new",
    meta: {
      userAgent: request.headers.get("user-agent") ?? undefined,
      referer: request.headers.get("referer") ?? undefined,
    },
  };

  await getDb().collection("contact").doc(submission.id).set(submission);
  await sendContactNotification(result.data);

  return NextResponse.json({ ok: true });
}
