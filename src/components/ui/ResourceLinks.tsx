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
 * `opens` is the other thing the kind decides. A link that takes the visitor
 * somewhere gets a new tab, so they don't lose the modal they were reading.
 * A link that downloads a file must NOT: the browser handles the response and
 * the page stays put, whereas `target="_blank"` opens a tab that immediately
 * goes blank and sits there. `report`, `paper` and `credential` are all
 * direct-download URLs, so they stay in place.
 *
 * Phase 2 promotes `kind: "video"` to an embedded player inside the project
 * modal; until then it's a button like the rest.
 */
const PRESENTATION: Record<
  LinkKind,
  {
    label: string;
    icon: LucideIcon;
    opens: "new-tab" | "download";
    primary?: boolean;
  }
> = {
  github: { label: "Source Code", icon: GitBranch, opens: "new-tab" },
  live: {
    label: "Live Website",
    icon: ExternalLink,
    opens: "new-tab",
    primary: true,
  },
  video: { label: "Watch Demo", icon: PlayCircle, opens: "new-tab" },
  external: { label: "Open Link", icon: ExternalLink, opens: "new-tab" },
  report: { label: "Read Report", icon: FileText, opens: "download" },
  paper: { label: "Read Paper", icon: ScrollText, opens: "download" },
  credential: {
    label: "Verify Credential",
    icon: ShieldCheck,
    opens: "download",
  },
};

export default function ResourceLinks({ links }: { links: ResourceLink[] }) {
  if (!links.length) return null;

  return (
    <div className="flex flex-wrap gap-4">
      {links.map((link, i) => {
        const { label, icon: Icon, opens, primary } = PRESENTATION[link.kind];
        const newTab = opens === "new-tab";
        return (
          <a
            key={`${link.kind}-${link.url}-${i}`}
            href={link.url}
            {...(newTab
              ? { target: "_blank", rel: "noopener noreferrer" }
              : {})}
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
