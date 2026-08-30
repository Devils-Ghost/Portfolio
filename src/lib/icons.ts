import {
  Award,
  Bug,
  Cloud,
  Code,
  Compass,
  Cpu,
  Flag,
  GraduationCap,
  Handshake,
  Lock,
  Medal,
  Search,
  Shield,
  Star,
  Trophy,
  Users,
  Wrench,
  Zap,
  type LucideIcon,
} from "lucide-react";
import type { IconName } from "@/content/types";

/**
 * The icon registry (PROJECT_PLAN.md §1.3 ③).
 *
 * Content stores `iconName: "flag"` — a string — never a component reference.
 * A React component can't be serialized, so it can't come out of Firestore,
 * can't cross a Server→Client Component boundary, and can't go in JSON. The
 * resolution happens here, at render time, and only here.
 *
 * Adding an icon means adding it to `IconName` in content/types.ts, to
 * `iconNameSchema` in content/schema.ts, and to this map. The assertions
 * below make sure you can't do two of the three: a name without an entry, or
 * an entry without a name, is a `tsc` error rather than a blank square.
 */
export const ICONS = {
  flag: Flag,
  trophy: Trophy,
  medal: Medal,
  star: Star,
  award: Award,
  code: Code,
  shield: Shield,
  bug: Bug,
  cloud: Cloud,
  cpu: Cpu,
  users: Users,
  graduation: GraduationCap,
  wrench: Wrench,
  search: Search,
  lock: Lock,
  zap: Zap,
  compass: Compass,
  handshake: Handshake,
} as const satisfies Record<IconName, LucideIcon>;

// The `satisfies` above catches a missing entry. This catches a surplus one —
// a key here that `IconName` doesn't know about, which the admin panel's
// dropdown would offer and the schema would then reject.
type _NoStrayIcons = keyof typeof ICONS extends IconName ? true : never;
const _iconKeysAreIconNames: _NoStrayIcons = true;
void _iconKeysAreIconNames;

/** Every name the admin panel's icon picker can offer. */
export const ICON_NAMES = Object.keys(ICONS) as IconName[];
