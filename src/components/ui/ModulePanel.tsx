import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * The gradient panel used by Certifications, Beyond the Code and
 * Achievements & Awards.
 *
 * The three are meant to read as siblings, so the chrome — gradient, top
 * accent line, icon tile, title — is defined once here rather than copied
 * three times. Only the accent hue and the contents differ.
 *
 * Tailwind can't build class names at runtime, so each accent is a row of
 * literal classes rather than an interpolated colour.
 */
const ACCENTS = {
  blue: {
    line: "from-blue-600/0 via-blue-500/50 to-blue-600/0",
    tile: "bg-blue-500/10 border-blue-500/20 text-blue-400",
  },
  indigo: {
    line: "from-purple-600/0 via-indigo-500/50 to-purple-600/0",
    tile: "bg-indigo-500/10 border-indigo-500/20 text-indigo-400",
  },
  purple: {
    line: "from-fuchsia-600/0 via-purple-500/50 to-fuchsia-600/0",
    tile: "bg-purple-500/10 border-purple-500/20 text-purple-400",
  },
} as const;

export type PanelAccent = keyof typeof ACCENTS;

export default function ModulePanel({
  icon,
  title,
  accent,
  children,
  className,
}: {
  icon: ReactNode;
  title: string;
  accent: PanelAccent;
  children: ReactNode;
  className?: string;
}) {
  const { line, tile } = ACCENTS[accent];

  return (
    <div
      className={cn(
        "relative bg-gradient-to-b from-surface to-surface-deep border border-white/5 rounded-3xl p-8 md:p-10 shadow-2xl overflow-hidden group",
        className,
      )}
    >
      {/* Subtle top accent line */}
      <div
        className={cn(
          "absolute top-0 left-0 w-full h-1 bg-gradient-to-r opacity-50 group-hover:opacity-100 transition-opacity duration-500",
          line,
        )}
      />

      <div className="flex items-center gap-3 mb-8 text-white relative z-10">
        <div className={cn("p-2 rounded-lg border", tile)}>{icon}</div>
        <h3 className="text-2xl font-bold tracking-tight">{title}</h3>
      </div>

      <div className="relative z-10">{children}</div>
    </div>
  );
}
