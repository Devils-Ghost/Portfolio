"use client";

import {
  Suspense,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Modal from "@/components/ui/Modal";
import { MODAL_REGISTRY } from "./registry";
import type { Content, DetailTarget } from "@/content/types";

interface DetailModalContextValue {
  open: (target: DetailTarget) => void;
  back: () => void;
  close: () => void;
  canGoBack: boolean;
}

const DetailModalContext = createContext<DetailModalContextValue | null>(
  null,
);

/**
 * Opens, closes and navigates the one global modal layer (site-behavior.md
 * §4.6). Any component under `<DetailModalHost>` can call this — a skill
 * pill, a project card, the navbar's "Let's Talk" — without needing to know
 * where the modal actually renders.
 */
export function useDetailModal(): DetailModalContextValue {
  const ctx = useContext(DetailModalContext);
  if (!ctx) {
    throw new Error("useDetailModal must be used within <DetailModalHost>");
  }
  return ctx;
}

function parseTarget(raw: string | null): DetailTarget | null {
  if (!raw) return null;
  if (raw === "contact") return { kind: "contact" };

  const separator = raw.indexOf(":");
  if (separator === -1) return null;
  const kind = raw.slice(0, separator);
  const id = raw.slice(separator + 1);
  if (!id) return null;

  switch (kind) {
    case "project":
    case "experience":
    case "engagement":
    case "story":
    case "skill":
    case "award":
    case "softskill":
      return { kind, id };
    default:
      return null;
  }
}

function serializeTarget(target: DetailTarget): string {
  return target.kind === "contact"
    ? "contact"
    : `${target.kind}:${target.id}`;
}

function sameTarget(a: DetailTarget | null, b: DetailTarget | null): boolean {
  if (a === null || b === null) return a === b;
  return serializeTarget(a) === serializeTarget(b);
}

/**
 * The one global modal layer (PROJECT_PLAN.md §3.5, §D5). State lives in the
 * `?d=` query param, so a modal is shareable and reopens on a hard refresh.
 *
 * The context (`open`/`back`/`close`/`canGoBack`) is provided here, around
 * `children`, without depending on `useSearchParams()` — that hook requires
 * a Suspense boundary, and if `children` (the whole site) sat inside that
 * boundary, every consumer of `useDetailModal()` would break the moment
 * Next.js needed to show the fallback. Only the part that actually has to
 * read the current `?d=` value — resolving it against `content` and
 * rendering the right modal body — is isolated in `ModalRenderer` below.
 *
 * `content` arrives as a prop from the server — `(site)/layout.tsx` reads it
 * with `getContent()` — so resolving a deep-linked target (turning
 * `?d=project:x` into that project's title and body) needs no client-side
 * fetch. The layout also forces this route to render per request rather
 * than being statically cached at build time, which is what makes a deep
 * link's modal content show up in the HTML the server sends rather than
 * only after client-side hydration.
 */
export default function DetailModalHost({
  content,
  children,
}: {
  content: Content;
  children: ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();

  // How many modal-only history entries deep the current session is, since
  // the last time no modal was open. `open()` increments it; a `popstate`
  // (the browser's own Back button, or our `back()` calling `router.back()`)
  // decrements it. This is what lets the Back affordance know there's a
  // previous modal to return to, rather than this being a modal opened
  // straight off a deep link with nothing behind it — "push on open, pop on
  // back, clear on close" (PROJECT_PLAN.md §3.5).
  const depthRef = useRef(0);
  const [canGoBack, setCanGoBack] = useState(false);

  useEffect(() => {
    function onPopState() {
      depthRef.current = Math.max(0, depthRef.current - 1);
      setCanGoBack(depthRef.current > 0);
    }
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  const open = useCallback(
    (next: DetailTarget) => {
      depthRef.current += 1;
      setCanGoBack(true);
      router.push(`${pathname}?d=${serializeTarget(next)}`, {
        scroll: false,
      });
    },
    [pathname, router],
  );

  const close = useCallback(() => {
    depthRef.current = 0;
    setCanGoBack(false);
    router.push(pathname, { scroll: false });
  }, [pathname, router]);

  const back = useCallback(() => {
    if (depthRef.current > 0) {
      router.back();
    } else {
      close();
    }
  }, [close, router]);

  const value = useMemo<DetailModalContextValue>(
    () => ({ open, back, close, canGoBack }),
    [open, back, close, canGoBack],
  );

  return (
    <DetailModalContext.Provider value={value}>
      {children}
      <Suspense fallback={null}>
        <ModalRenderer
          content={content}
          close={close}
          back={back}
          canGoBack={canGoBack}
          setCanGoBack={setCanGoBack}
        />
      </Suspense>
    </DetailModalContext.Provider>
  );
}

/**
 * The only piece that reads `?d=` — everything it needs beyond that (`close`,
 * `back`, `canGoBack`) comes down as props from the host above, which owns
 * that state independently of search params.
 */
function ModalRenderer({
  content,
  close,
  back,
  canGoBack,
  setCanGoBack,
}: {
  content: Content;
  close: () => void;
  back: () => void;
  canGoBack: boolean;
  setCanGoBack: (value: boolean) => void;
}) {
  const searchParams = useSearchParams();
  const target = useMemo(
    () => parseTarget(searchParams.get("d")),
    [searchParams],
  );

  // Held so the modal keeps showing its content while it plays the close
  // animation, instead of the body vanishing the instant `target` goes null.
  const [renderedTarget, setRenderedTarget] = useState<DetailTarget | null>(
    null,
  );

  // Reacting to `target` changing that didn't come from the host's `open()`
  // — a pasted deep link, or a hardware Back that jumped past what the host
  // was tracking — adjusted during render rather than in an effect, per
  // React's documented pattern for "adjusting state when a prop changes"
  // (react.dev/learn/you-might-not-need-an-effect). `prevTarget` only exists
  // to detect that change; nothing else reads it.
  const [prevTarget, setPrevTarget] = useState<DetailTarget | null>(null);
  if (!sameTarget(target, prevTarget)) {
    setPrevTarget(target);
    if (target === null) {
      setCanGoBack(false);
    } else {
      setRenderedTarget(target);
    }
  }

  const entry = renderedTarget
    ? MODAL_REGISTRY[renderedTarget.kind]
    : undefined;
  const id =
    renderedTarget && "id" in renderedTarget ? renderedTarget.id : undefined;

  return (
    <Modal
      isOpen={target !== null && Boolean(entry)}
      onClose={close}
      onBack={canGoBack ? back : undefined}
      className={entry?.width}
      label={entry?.label(id, content) ?? ""}
    >
      {entry && <entry.Body id={id} content={content} />}
    </Modal>
  );
}
