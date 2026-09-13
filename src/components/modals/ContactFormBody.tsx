"use client";

import { useEffect, useRef, useState } from "react";
import Script from "next/script";
import { Send, Mail, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { socialUrl } from "@/content/selectors";
import type { ModalBodyProps } from "./registry";

const TURNSTILE_SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

// A widget id (opaque string Cloudflare hands back from `render()`), not a
// boolean — `remove()` needs it to know exactly which rendered widget to
// tear down, since a page could in principle host more than one.
interface TurnstileApi {
  render(
    container: HTMLElement,
    options: { sitekey: string; callback: (token: string) => void },
  ): string;
  remove(widgetId: string): void;
}

declare global {
  interface Window {
    turnstile?: TurnstileApi;
  }
}

type Status = "idle" | "loading" | "success" | "error";

/**
 * `ContactFormBody` — the one `{kind:"contact"}` modal every "Let's Talk" /
 * "Get in Touch" trigger dispatches to (docs/project-plan.md §1.3 ⑤). Phase 3:
 * wired to the real `POST /api/contact` — Zod validation server-side,
 * Turnstile + rate limiting, a real send/store, replacing the placeholder
 * `alert()`. No honeypot field, no submit-timing check: both were tried
 * and dropped after producing real false positives against genuine
 * visitors (docs/plan-progress.md) — Turnstile plus the rate limiter are the
 * defenses that stayed.
 */
export default function ContactFormBody({ content }: ModalBodyProps) {
  const emailHref = socialUrl(content.site.socials, "email") ?? "mailto:";
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const [scriptReady, setScriptReady] = useState(false);
  const turnstileContainerRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | null>(null);

  // Render the widget imperatively rather than relying on Turnstile's
  // script auto-scanning the page for `.cf-turnstile` divs: this modal
  // mounts and unmounts every time it opens/closes, and the auto-scan only
  // runs once, when the script first loads — reopening the modal would
  // create a new container the script never re-scans for, leaving the
  // widget permanently un-rendered (and the submit button permanently
  // disabled) on every visit after the first. Rendering in an effect keyed
  // to this component's own lifecycle, and explicitly `remove()`-ing on
  // unmount, keeps Cloudflare's internal widget registry in sync with
  // what's actually still in the DOM instead of pointing at a removed node.
  useEffect(() => {
    if (!scriptReady || !turnstileContainerRef.current || !TURNSTILE_SITE_KEY)
      return;

    widgetIdRef.current = window.turnstile!.render(
      turnstileContainerRef.current,
      {
        sitekey: TURNSTILE_SITE_KEY,
        callback: (token) => setTurnstileToken(token),
      },
    );

    return () => {
      if (widgetIdRef.current) {
        window.turnstile?.remove(widgetIdRef.current);
        widgetIdRef.current = null;
      }
    };
  }, [scriptReady]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!turnstileToken) return;

    setStatus("loading");
    setErrorMessage(null);

    const formData = new FormData(event.currentTarget);
    const payload = Object.fromEntries(formData.entries());

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...payload, turnstileToken }),
      });

      if (!response.ok) {
        const data: { error?: unknown } = await response
          .json()
          .catch(() => ({}));
        setErrorMessage(
          typeof data.error === "string"
            ? data.error
            : "Something went wrong. Please try again.",
        );
        setStatus("error");
        return;
      }

      setStatus("success");
    } catch {
      setErrorMessage("Network error. Please check your connection.");
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="flex flex-col items-center text-center py-6 gap-3">
        <CheckCircle2 className="text-blue-400" size={40} />
        <h3 className="text-xl font-bold text-white tracking-tight">
          Message sent
        </h3>
        <p className="text-gray-400 text-sm">
          Thanks for reaching out — I&apos;ll get back to you soon.
        </p>
      </div>
    );
  }

  return (
    <div>
      <h3 className="text-xl font-bold text-white tracking-tight mb-4">
        Let&apos;s Connect
      </h3>

      <Script
        src="https://challenges.cloudflare.com/turnstile/v0/api.js"
        async
        defer
        onReady={() => setScriptReady(true)}
      />

      <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Name"
          required
          className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-blue-500 text-white text-sm"
        />
        <input
          type="text"
          name="company"
          placeholder="Company"
          className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-blue-500 text-white text-sm"
        />
        <input
          type="text"
          name="role"
          placeholder="Role"
          className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-blue-500 text-white text-sm"
        />
        <input
          type="text"
          name="contact"
          placeholder="Contact Information (Email/Phone)"
          required
          className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-blue-500 text-white text-sm"
        />
        <textarea
          name="message"
          placeholder="Personalized Message"
          rows={4}
          required
          className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-blue-500 text-white text-sm resize-none"
        ></textarea>

        <div ref={turnstileContainerRef} />

        {status === "error" && errorMessage && (
          <div className="flex items-center gap-2 text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
            <AlertCircle size={16} className="shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <button
          type="submit"
          disabled={status === "loading" || !turnstileToken}
          className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2 mt-2"
        >
          {status === "loading" ? (
            <>
              <Loader2 size={16} className="animate-spin" /> Sending...
            </>
          ) : (
            <>
              <Send size={16} /> Send Message
            </>
          )}
        </button>
      </form>

      <div className="flex items-center gap-3 my-4">
        <div className="flex-1 h-px bg-white/10"></div>
        <span className="text-xs text-meta font-medium tracking-widest">
          OR
        </span>
        <div className="flex-1 h-px bg-white/10"></div>
      </div>

      <a
        href={emailHref}
        className="w-full py-2.5 bg-white/5 border border-white/10 hover:bg-white/10 text-gray-300 hover:text-white rounded-lg transition-colors flex items-center justify-center gap-2 text-sm"
      >
        <Mail size={16} /> Send customized email instead
      </a>
    </div>
  );
}
