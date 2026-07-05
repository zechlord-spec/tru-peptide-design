import type { LucideIcon } from 'lucide-react'
import {
  Sparkles,
  Scale,
  Dumbbell,
  Brain,
  Flame,
  Hourglass,
  HeartPulse,
  Moon,
  ShieldCheck,
  Zap,
  Activity,
  Leaf,
  BatteryCharging,
  FlaskConical,
} from 'lucide-react'

/**
 * Client-safe registry that maps a serializable icon key (a plain string) to a
 * Lucide icon component.
 *
 * Domain data (Systems, Goals) carries an `iconKey` string instead of a React
 * component so the objects stay JSON-serializable — they can travel across the
 * network from a real backend and through the React server/client boundary
 * unchanged. UI code resolves the component with `iconFor(iconKey)` at render
 * time.
 *
 * When wiring a real backend, return one of these keys for each system/goal.
 * Add new keys here as the icon vocabulary grows.
 */
export const ICON_REGISTRY = {
  Sparkles,
  Scale,
  Dumbbell,
  Brain,
  Flame,
  Hourglass,
  HeartPulse,
  Moon,
  ShieldCheck,
  Zap,
  Activity,
  Leaf,
  BatteryCharging,
  FlaskConical,
} satisfies Record<string, LucideIcon>

export type IconKey = keyof typeof ICON_REGISTRY

/** Resolve an icon key to a Lucide component, falling back to a neutral icon. */
export function iconFor(key: string): LucideIcon {
  return (ICON_REGISTRY as Record<string, LucideIcon>)[key] ?? FlaskConical
}
