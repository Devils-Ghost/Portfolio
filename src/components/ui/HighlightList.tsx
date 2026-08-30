/**
 * The résumé bullets on a Project or an Experience.
 *
 * One component rather than two because the two entities carry the same field
 * for the same reason, and a recruiter reading both should see one treatment.
 */
export default function HighlightList({ items }: { items: string[] }) {
  if (!items.length) return null;

  return (
    <ul className="flex flex-col gap-3 text-gray-300 leading-relaxed">
      {items.map((item, i) => (
        <li key={i} className="flex items-start gap-3">
          <span
            aria-hidden
            className="mt-[0.6em] h-1.5 w-1.5 shrink-0 rounded-full bg-blue-500"
          />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}
