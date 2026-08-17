"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { SOCIAL_LINKS } from "@/components/icons/SocialIcons";

/**
 * A quiet, persistent rail of social links pinned to the left edge of the
 * viewport — separate from the hero content so it doesn't compete with it,
 * and available site-wide rather than only reachable by scrolling to the
 * Footer. Desktop only (see CustomScrollbar.tsx for the same reasoning:
 * touch devices already get these from the Footer and the mobile nav menu).
 */
export default function SocialRail() {
  const [canRender, setCanRender] = useState(false);
  const [nearFooter, setNearFooter] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia(
      "(pointer: fine) and (hover: hover) and (min-width: 768px)",
    );
    const update = () => setCanRender(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  // Fade out once the Footer (which has its own copy of these same links)
  // scrolls into view, so the two rows never visually overlap.
  useEffect(() => {
    if (!canRender) return;
    const footerEl = document.querySelector("footer");
    if (!footerEl) return;
    const observer = new IntersectionObserver(
      ([entry]) => setNearFooter(entry.isIntersecting),
      { rootMargin: "0px 0px -10% 0px" },
    );
    observer.observe(footerEl);
    return () => observer.disconnect();
  }, [canRender]);

  if (!canRender) return null;

  return (
    <div
      className="fixed left-6 bottom-0 z-40 flex flex-col items-center pointer-events-none"
      style={{
        opacity: nearFooter ? 0 : 1,
        transition: "opacity 400ms ease-out",
      }}
    >
      <div className="group flex flex-col items-center gap-5 mb-4 opacity-50 hover:opacity-100 transition-opacity duration-300">
        {SOCIAL_LINKS.map(({ icon: Icon, href, label }) => (
          <Link
            key={label}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={label}
            className="pointer-events-auto text-gray-400 hover:text-blue-400 hover:-translate-y-1 transition-all duration-300"
          >
            <Icon className="w-[18px] h-[18px]" />
          </Link>
        ))}
        <div className="w-px h-24 bg-white/15 group-hover:bg-white/25 transition-colors duration-300" />
      </div>
    </div>
  );
}
