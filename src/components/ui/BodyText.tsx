import { Fragment } from "react";

/**
 * Renders a content `body` field: blank-line-separated paragraphs, with runs
 * of `- ` lines turned into a list.
 *
 * Interim, deliberately. `body` is markdown and Phase 5 brings a real MDX
 * renderer for `/blog`; until then this covers the two shapes the content
 * actually uses — prose paragraphs (projects, engagements) and XYZ bullet
 * lists (experiences) — without pulling a parser in for it. Anything richer
 * than that renders as plain text rather than as escaped syntax, which is the
 * right failure mode for a placeholder.
 */
export default function BodyText({
  body,
  className = "text-gray-300 leading-relaxed",
}: {
  body: string;
  className?: string;
}) {
  const blocks = body
    .split(/\n{2,}/)
    .map((b) => b.trim())
    .filter(Boolean);

  return (
    <div className={className}>
      {blocks.map((block, i) => {
        const lines = block.split("\n").map((l) => l.trim());
        const isList = lines.every((l) => l.startsWith("- "));

        if (isList) {
          return (
            <ul key={i} className="list-disc pl-5 space-y-2 mb-4 last:mb-0">
              {lines.map((line, j) => (
                <li key={j}>{line.slice(2)}</li>
              ))}
            </ul>
          );
        }

        return (
          <p key={i} className="mb-4 last:mb-0">
            {lines.map((line, j) => (
              <Fragment key={j}>
                {j > 0 && <br />}
                {line}
              </Fragment>
            ))}
          </p>
        );
      })}
    </div>
  );
}
