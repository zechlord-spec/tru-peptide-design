'use client'

import { Calculator } from 'lucide-react'
import { AdminCard, Field, FieldGrid, DataTable, Th, Td, StatusBadge } from './primitives'
import { formatUSD, formatPct, grossMargin, marginBand } from './format'

export type PerVialEconomicsCardProps = {
  supplierKitCost: number
  /** Nominal vials packaged per kit. */
  kitQuantity: number
  /** Sellable vials used as the planning baseline (e.g. 10). */
  planningSellableVials: number
  currentRetail: number
  /** Capital needed to purchase one kit. Defaults to the kit cost. */
  capitalRequired?: number
  /** Sellable-vial scenarios to model. Defaults to [10, 9, 8]. */
  scenarios?: number[]
  className?: string
}

/**
 * Per-vial economics for a kit-sourced product. Cost-per-vial, effective cost
 * across sellable-vial scenarios, and gross margin are derived purely from the
 * supplied kit cost and retail price.
 */
export function PerVialEconomicsCard({
  supplierKitCost,
  kitQuantity,
  planningSellableVials,
  currentRetail,
  capitalRequired,
  scenarios = [10, 9, 8],
  className = '',
}: PerVialEconomicsCardProps) {
  const nominalCostPerVial = kitQuantity > 0 ? supplierKitCost / kitQuantity : 0
  const planningCost =
    planningSellableVials > 0 ? supplierKitCost / planningSellableVials : nominalCostPerVial
  const planningMargin = grossMargin(currentRetail, planningCost)
  const capital = capitalRequired ?? supplierKitCost

  return (
    <AdminCard
      className={className}
      icon={<Calculator className="h-4 w-4" aria-hidden="true" />}
      title="Per-vial economics"
      subtitle="Effective cost scales with sellable yield per kit"
    >
      <FieldGrid columns={3}>
        <Field label="Supplier kit cost" value={formatUSD(supplierKitCost)} />
        <Field label="Kit quantity" value={`${kitQuantity} vials`} />
        <Field label="Nominal cost / vial" value={formatUSD(nominalCostPerVial)} emphasis />
        <Field label="Planning sellable / kit" value={`${planningSellableVials} vials`} />
        <Field label="Current retail" value={formatUSD(currentRetail)} />
        <Field label="Capital / kit" value={formatUSD(capital)} />
      </FieldGrid>

      <div className="mt-4">
        <DataTable
          caption="Effective cost per vial and gross margin by sellable-vial scenario"
          head={
            <>
              <Th>Sellable vials / kit</Th>
              <Th numeric>Effective cost / vial</Th>
              <Th numeric>Gross margin</Th>
            </>
          }
        >
          {scenarios.map((n) => {
            const eff = n > 0 ? supplierKitCost / n : 0
            const m = grossMargin(currentRetail, eff)
            const band = marginBand(m)
            const isPlanning = n === planningSellableVials
            return (
              <tr key={n} className={isPlanning ? 'bg-primary/5' : ''}>
                <Td>
                  <span className="flex items-center gap-2">
                    {n} vials
                    {isPlanning ? <StatusBadge tone="positive">Planning</StatusBadge> : null}
                  </span>
                </Td>
                <Td numeric>{formatUSD(eff)}</Td>
                <Td numeric>
                  <span
                    className={
                      band === 'negative'
                        ? 'text-destructive'
                        : band === 'caution'
                          ? 'text-accent-foreground'
                          : 'text-primary'
                    }
                  >
                    {formatPct(m)}
                  </span>
                </Td>
              </tr>
            )
          })}
        </DataTable>
      </div>

      <div className="mt-4 flex items-center justify-between rounded-lg bg-secondary/60 px-3 py-2.5">
        <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
          Gross margin @ planning cost
        </span>
        <span
          className={`font-heading text-lg font-semibold ${
            marginBand(planningMargin) === 'negative'
              ? 'text-destructive'
              : marginBand(planningMargin) === 'caution'
                ? 'text-accent-foreground'
                : 'text-primary'
          }`}
        >
          {formatPct(planningMargin)}
        </span>
      </div>
    </AdminCard>
  )
}
