import {
  ExternalLink,
  FileText,
  GitBranch,
  PlayCircle,
  ScrollText,
  ShieldCheck,
  type LucideIcon,
} from "lucide-react";
import type { LinkKind, ResourceLink } from "@/content/types";

/**
 * Renders a `ResourceLink[]` as buttons.
 *
 * The content model stores links as an array of tagged links rather than
 * `{github?, live?, doc?}` (PROJECT_PLAN.md §3.1), so adding a kind is a row
 * in this table instead of a new field on three entities. `label` on the link
 * overrides the default for its kind — an empty string counts as absent, so a
 * record that leaves it blank still gets the sensible default.
 *
 * Phase 2 promotes `kind: "video"` to an embedded player inside the project
 * modal; until then it's a button like the rest.
 */
const PRESENTATION: Record<
  LinkKind,
  { label: string; icon: LucideIcon; primary?: boolean }
> = {
  github: { label: "Source Code", icon: GitBranch },
  live: { label: "Live Demo", icon: ExternalLink, primary: true },
  video: { label: "Watch Demo", icon: PlayCircle },
  report: { label: "Read Report", icon: FileText },
  paper: { label: "Read Paper", icon: ScrollText },
  credential: { label: "Verify Credential", icon: ShieldCheck },
  external: { label: "Open Link", icon: ExternalLink },
};

export default function ResourceLinks({ links }: { links: ResourceLink[] }) {
  if (!links.length) return null;

  return (
    <div className="flex flex-wrap gap-4">
      {links.map((link, i) => {
        const { label, icon: Icon, primary } = PRESENTATION[link.kind];
        return (
          <a
            key={`${link.kind}-${link.url}-${i}`}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium transition-colors ${
              primary
                ? "bg-blue-600 hover:bg-blue-500 text-white"
                : "bg-white/10 hover:bg-white/20 text-white"
            }`}
          >
            <Icon size={18} /> {link.label?.trim() || label}
          </a>
        );
      })}
    </div>
  );
}
