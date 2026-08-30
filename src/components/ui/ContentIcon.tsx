import { createElement } from "react";
import type { LucideProps } from "lucide-react";
import { ICONS } from "@/lib/icons";
import type { IconName } from "@/content/types";

/**
 * Draws the icon a content record names (PROJECT_PLAN.md §1.3 ③).
 *
 * Content stores `iconName: "flag"`, never a component, so something has to
 * turn the string back into one. Doing that inline — `const Icon =
 * ICONS[name]` in the middle of a card — trips `react-hooks/static-components`:
 * the React Compiler can't tell a lookup in a frozen map from a component
 * defined on the fly, and the two have very different remount behaviour.
 *
 * Going through `createElement` here says what's actually happening — pick an
 * existing component out of a table and render it — and keeps every card free
 * of the lint suppression it would otherwise need.
 */
export default function ContentIcon({
  name,
  ...props
}: { name: IconName } & LucideProps) {
  return createElement(ICONS[name], props);
}
