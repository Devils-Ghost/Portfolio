import ContentIcon from "@/components/ui/ContentIcon";
import { formatDateMark } from "@/content/selectors";
import type { Award } from "@/content/types";

/**
 * One award, as a compact chip.
 *
 * A chip and not a card, deliberately (PROJECT_PLAN.md §7.1): six awards as
 * six cards would out-weigh the three Featured Work cards above them, and an
 * award is supporting evidence rather than headline content. Compact also
 * means the strip wraps, so the count is never layout-locked the way Featured
 * Work's three hardcoded offsets are.
 *
 * A Server Component. Phase 2 wraps it in a button that opens
 * `AwardModalBody`, where `body`, the source project/experience and the STAR
 * story behind it all become reachable — the fields are already here.
 */
export default function AwardChip({ award }: { award: Award }) {
  return (
    <div className="group flex items-start gap-3 px-4 py-3 rounded-2xl bg-white/[0.02] border border-white/10 hover:border-blue-500/30 hover:bg-white/[0.04] transition-colors duration-300">
      <div className="mt-0.5 shrink-0 text-gray-500 group-hover:text-blue-400 transition-colors">
        <ContentIcon name={award.iconName} size={18} />
      </div>
      <div className="flex flex-col min-w-0">
        <span className="text-gray-200 font-semibold text-sm leading-snug">
          {award.title}
        </span>
        <span className="text-blue-400/80 font-mono text-[11px] uppercase tracking-wider mt-0.5">
          {award.issuer} · {formatDateMark(award.date)}
          {award.rank ? ` · ${award.rank}` : ""}
        </span>
      </div>
    </div>
  );
}
