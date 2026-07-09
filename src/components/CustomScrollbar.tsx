"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

/**
 * CustomScrollbar
 * ----------------
 * A desktop-only, theme-matched scroll indicator embedded into the right
 * edge of the viewport, full height.
 *
 * Terminology (matches how the component is described in product feedback):
 * - "scroll bar"        -> the draggable pill (`thumbRef` below). Always
 *                          visible, as a thin blue glow with a soft 3D
 *                          drop shadow so it reads as floating just above
 *                          the page.
 * - "scroll bar slider"  -> the rail it travels along (`trackRef` below).
 *                          Fully invisible — no background, no border, no
 *                          blur — it only exists to define the drag range
 *                          and to give clicks-on-empty-rail a big, forgiving
 *                          hit target. It never renders anything.
 *
 * The pill only widens/brightens when the pointer is near it (or while
 * dragging) — never just because the page is scrolling. Position, however,
 * always tracks scroll in real time regardless of proximity, via a
 * spring-smoothed MotionValue so it stays at 60fps without React re-renders.
 *
 * We never touch native scroll behaviour (wheel/keyboard/touch, momentum,
 * accessibility) — only the native scrollbar's *visuals* are hidden (see
 * globals.css), and this is layered on top purely as an indicator + drag
 * handle.
 */

const NEAR_THRESHOLD = 110; // px from the right edge that triggers expansion
const MIN_THUMB_HEIGHT = 32; // px
const EDGE_OFFSET = 6; // distance of the pill from the viewport's right edge
const IDLE_WIDTH = 3; // px
const EXPANDED_WIDTH = 7; // px (~70% of the old 10px expanded width)
const RAIL_WIDTH = 28; // px — invisible click/drag hit-zone width

export default function CustomScrollbar() {
  const trackRef = useRef<HTMLDivElement>(null);

  const [canRender, setCanRender] = useState(false);
  const [hasScrollableContent, setHasScrollableContent] = useState(false);
  const [isNear, setIsNear] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const [thumbHeight, setThumbHeight] = useState(MIN_THUMB_HEIGHT);
  const [reduceMotion, setReduceMotion] = useState(false);

  const dims = useRef({ trackHeight: 0, maxScroll: 0 });
  const rafRef = useRef<number | null>(null);

  const rawTop = useMotionValue(0);
  const smoothTop = useSpring(rawTop, {
    stiffness: 500,
    damping: 42,
    mass: 0.4,
  });

  // Expansion is proximity/drag driven only — scrolling never triggers it.
  const isExpanded =
    (isNear || isDragging) && !isLocked && hasScrollableContent;

  // --- capability detection: fine pointer + hover + desktop width only ---
  useEffect(() => {
    const mq = window.matchMedia(
      "(pointer: fine) and (hover: hover) and (min-width: 768px)",
    );
    const motionMq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setCanRender(mq.matches);
    const updateMotion = () => setReduceMotion(motionMq.matches);
    update();
    updateMotion();
    mq.addEventListener("change", update);
    motionMq.addEventListener("change", updateMotion);
    return () => {
      mq.removeEventListener("change", update);
      motionMq.removeEventListener("change", updateMotion);
    };
  }, []);

  // --- dimension measurement (mount, resize, content growth) ---
  const measureDimensions = useCallback(() => {
    const trackH = trackRef.current?.clientHeight ?? window.innerHeight;
    const scrollH = document.documentElement.scrollHeight;
    const viewH = window.innerHeight;
    const maxScroll = Math.max(scrollH - viewH, 0);

    dims.current = { trackHeight: trackH, maxScroll };
    setHasScrollableContent(maxScroll > 80);

    const th =
      maxScroll > 0
        ? Math.max((viewH / scrollH) * trackH, MIN_THUMB_HEIGHT)
        : trackH;
    setThumbHeight(th);
  }, []);

  // keep a ref mirror of thumbHeight so updatePosition (used inside a
  // scroll listener closure) always reads the latest value cheaply
  const thumbHeightRef = useRef(MIN_THUMB_HEIGHT);
  useEffect(() => {
    thumbHeightRef.current = thumbHeight;
  }, [thumbHeight]);

  // --- position update (every scroll tick, cheap: no layout reads) ---
  const updatePosition = useCallback(() => {
    const { trackHeight, maxScroll } = dims.current;
    const progress =
      maxScroll > 0 ? Math.min(window.scrollY / maxScroll, 1) : 0;
    rawTop.set(progress * Math.max(trackHeight - thumbHeightRef.current, 0));
  }, [rawTop]);

  useEffect(() => {
    if (!canRender) return;

    measureDimensions();
    updatePosition();

    // Position tracking only — this never toggles the expanded/visual state.
    const onScroll = () => {
      if (rafRef.current) return;
      rafRef.current = requestAnimationFrame(() => {
        updatePosition();
        rafRef.current = null;
      });
    };

    const onResize = () => {
      measureDimensions();
      updatePosition();
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);

    const ro = new ResizeObserver(() => {
      measureDimensions();
      updatePosition();
    });
    ro.observe(document.body);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      ro.disconnect();
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [canRender, measureDimensions, updatePosition]);

  // --- proximity detection (the ONLY thing that expands the pill) ---
  useEffect(() => {
    if (!canRender) return;

    const onMouseMove = (e: MouseEvent) => {
      if (isDragging) return;
      setIsNear(window.innerWidth - e.clientX <= NEAR_THRESHOLD);
    };
    const onMouseLeave = () => {
      if (!isDragging) setIsNear(false);
    };

    window.addEventListener("mousemove", onMouseMove);
    document.documentElement.addEventListener("mouseleave", onMouseLeave);
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      document.documentElement.removeEventListener("mouseleave", onMouseLeave);
    };
  }, [canRender, isDragging]);

  // --- modal / body-scroll-lock detection (see Modal.tsx) ---
  useEffect(() => {
    if (!canRender) return;
    const check = () => setIsLocked(document.body.style.overflow === "hidden");
    check();
    const mo = new MutationObserver(check);
    mo.observe(document.body, { attributes: true, attributeFilter: ["style"] });
    return () => mo.disconnect();
  }, [canRender]);

  // --- drag + click-on-rail-to-jump ---
  const ratioFromClientY = useCallback(
    (clientY: number) => {
      const trackEl = trackRef.current;
      if (!trackEl) return 0;
      const rect = trackEl.getBoundingClientRect();
      const { trackHeight } = dims.current;
      const y = clientY - rect.top - thumbHeight / 2;
      return Math.min(
        Math.max(y / Math.max(trackHeight - thumbHeight, 1), 0),
        1,
      );
    },
    [thumbHeight],
  );

  const onThumbPointerDown = (e: React.PointerEvent) => {
    e.preventDefault();
    e.stopPropagation();
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    setIsDragging(true);
    setIsNear(true);
    document.body.style.cursor = "grabbing";
    document.body.style.userSelect = "none";
  };

  const onThumbPointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    const ratio = ratioFromClientY(e.clientY);
    window.scrollTo({ top: ratio * dims.current.maxScroll, behavior: "auto" });
  };

  const endDrag = (e: React.PointerEvent) => {
    setIsDragging(false);
    document.body.style.cursor = "";
    document.body.style.userSelect = "";
    try {
      (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {
      // no-op: pointer capture may already be released
    }
  };

  // Clicking empty rail (not the pill itself, which is a sibling drawn on
  // top) jump-scrolls to that position.
  const onTrackPointerDown = (e: React.PointerEvent) => {
    const ratio = ratioFromClientY(e.clientY);
    window.scrollTo({
      top: ratio * dims.current.maxScroll,
      behavior: reduceMotion ? "auto" : "smooth",
    });
  };

  if (!canRender || !hasScrollableContent) return null;

  return (
    <div
      className="fixed inset-y-5 right-0 z-40 pointer-events-none"
      style={{ width: RAIL_WIDTH }}
      aria-hidden="true"
    >
      {/* Scroll bar slider (rail): invisible, full height, click-to-jump hit-zone only */}
      <div
        ref={trackRef}
        onPointerDown={onTrackPointerDown}
        className="absolute inset-0 pointer-events-auto cursor-pointer"
      />

      {/* Scroll bar (pill): the only visible piece — floats above the page */}
      <motion.div
        onPointerDown={onThumbPointerDown}
        onPointerMove={onThumbPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        className={`absolute rounded-full pointer-events-auto ${
          isDragging ? "cursor-grabbing" : "cursor-grab"
        } ${isExpanded ? "bg-gradient-to-b from-blue-400 to-blue-600" : "bg-blue-500/70"}`}
        style={{
          y: smoothTop,
          right: EDGE_OFFSET,
          width: isExpanded ? EXPANDED_WIDTH : IDLE_WIDTH,
          height: thumbHeight,
          willChange: "transform",
          // Elevation shadow (dark, offset) sells the "floating over the
          // page" 3D feel; the blue glow keeps it tied to the theme.
          boxShadow: isExpanded
            ? "-2px 5px 14px rgba(0,0,0,0.55), 0 0 14px rgba(59,130,246,0.55), 0 0 2px rgba(59,130,246,0.8)"
            : "-1px 3px 7px rgba(0,0,0,0.45), 0 0 6px rgba(59,130,246,0.4)",
          opacity: isExpanded ? 1 : 0.6,
          transition: reduceMotion
            ? "none"
            : "width 280ms cubic-bezier(0.4,0,0.2,1), box-shadow 280ms ease-out, opacity 280ms ease-out, background-color 280ms ease-out",
        }}
      />
    </div>
  );
}
