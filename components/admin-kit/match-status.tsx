import type { StatusTone } from './primitives'
import { StatusBadge } from './primitives'
import {
  CheckCircle2,
  HelpCircle,
  Sparkles,
  PackagePlus,
  AlertTriangle,
  Eye,
} from 'lucide-react'

/** Normalization outcome for an imported supplier line. */
export type MatchStatus =
  | 'exact'
  | 'probable'
  | 'new-strength'
  | 'new-product'
  | 'naming-conflict'
  | 'manual-review'

export const MATCH_STATUS_META: Record<
  MatchStatus,
  { label: string; tone: StatusTone; icon: typeof CheckCircle2 }
> = {
  exact: { label: 'Exact match', tone: 'positive', icon: CheckCircle2 },
  probable: { label: 'Probable match', tone: 'caution', icon: HelpCircle },
  'new-strength': { label: 'New strength', tone: 'info', icon: Sparkles },
  'new-product': { label: 'New product', tone: 'info', icon: PackagePlus },
  'naming-conflict': { label: 'Naming conflict', tone: 'negative', icon: AlertTriangle },
  'manual-review': { label: 'Manual review', tone: 'negative', icon: Eye },
}

export function MatchStatusBadge({ status }: { status: MatchStatus }) {
  const meta = MATCH_STATUS_META[status]
  const Icon = meta.icon
  return (
    <StatusBadge tone={meta.tone} icon={<Icon className="h-3 w-3" aria-hidden="true" />}>
      {meta.label}
    </StatusBadge>
  )
}
