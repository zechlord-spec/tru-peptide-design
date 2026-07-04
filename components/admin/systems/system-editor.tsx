'use client'

import { useState } from 'react'
import {
  Pin,
  PinOff,
  Save,
  Loader2,
  Plus,
  Trash2,
  Layers,
  Eye,
  EyeOff,
  ArrowUp,
  ArrowDown,
} from 'lucide-react'
import type { AdminProduct, AdminSystem } from '@/lib/catalog/types'
import {
  createStackAction,
  deleteStackAction,
  reorderPinsAction,
  setSystemNoteAction,
  setSystemPinAction,
  updateStackAction,
} from '@/app/actions/catalog'
import { EmptyState } from '@/components/admin/ui'

function nameFor(products: AdminProduct[], slug: string) {
  return products.find((p) => p.slug === slug)?.name ?? slug
}

export function SystemEditor({
  system,
  products,
  onChanged,
}: {
  system: AdminSystem
  products: AdminProduct[]
  onChanged: () => Promise<unknown>
}) {
  const [note, setNote] = useState(system.note)
  const [savingNote, setSavingNote] = useState(false)
  const [busy, setBusy] = useState<string | null>(null)

  // Members of this system (tag-driven), used for pin + stack selection.
  const members = products
    .filter((p) => system.memberSlugs.includes(p.slug))
    .sort((a, b) => a.name.localeCompare(b.name))
  const pinnedSet = new Set(system.pinnedSlugs)

  async function saveNote() {
    setSavingNote(true)
    try {
      await setSystemNoteAction(system.slug, note)
      await onChanged()
    } finally {
      setSavingNote(false)
    }
  }

  async function togglePin(slug: string) {
    setBusy(`pin-${slug}`)
    try {
      await setSystemPinAction(system.slug, slug, !pinnedSet.has(slug))
      await onChanged()
    } finally {
      setBusy(null)
    }
  }

  async function movePin(slug: string, dir: -1 | 1) {
    const order = [...system.pinnedSlugs]
    const i = order.indexOf(slug)
    const j = i + dir
    if (i < 0 || j < 0 || j >= order.length) return
    ;[order[i], order[j]] = [order[j], order[i]]
    setBusy(`pin-${slug}`)
    try {
      await reorderPinsAction(system.slug, order)
      await onChanged()
    } finally {
      setBusy(null)
    }
  }

  return (
    <div className="space-y-8">
      {/* Educational note */}
      <section>
        <h3 className="font-heading text-sm font-semibold text-foreground">Educational note</h3>
        <p className="mt-1 text-xs text-muted-foreground">
          Shown at the top of the {system.trademark} protocol section on the storefront.
        </p>
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          rows={3}
          placeholder="e.g. These compounds are studied for metabolic support. Always consult research literature…"
          className="mt-3 w-full rounded-xl border border-border bg-background p-3 text-sm text-foreground outline-none focus:border-ring"
        />
        <div className="mt-2 flex justify-end">
          <button
            type="button"
            onClick={saveNote}
            disabled={savingNote || note === system.note}
            className="btn-premium inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground disabled:opacity-50"
          >
            {savingNote ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />}
            Save note
          </button>
        </div>
      </section>

      {/* Pinned products */}
      <section>
        <h3 className="font-heading text-sm font-semibold text-foreground">
          Pinned products{' '}
          <span className="font-normal text-muted-foreground">({system.pinnedSlugs.length})</span>
        </h3>
        <p className="mt-1 text-xs text-muted-foreground">
          Pinned products always appear first in the ranked grid, in the order below.
        </p>

        {system.pinnedSlugs.length > 0 && (
          <ol className="mt-3 space-y-2">
            {system.pinnedSlugs.map((slug, idx) => (
              <li
                key={slug}
                className="flex items-center gap-2 rounded-xl border border-primary/30 bg-primary/5 px-3 py-2"
              >
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-[11px] font-bold text-primary-foreground">
                  {idx + 1}
                </span>
                <span className="min-w-0 flex-1 truncate text-sm font-medium text-foreground">
                  {nameFor(products, slug)}
                </span>
                <button
                  type="button"
                  onClick={() => movePin(slug, -1)}
                  disabled={idx === 0 || busy === `pin-${slug}`}
                  className="rounded-full p-1.5 text-muted-foreground hover:bg-secondary disabled:opacity-30"
                  aria-label="Move up"
                >
                  <ArrowUp className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => movePin(slug, 1)}
                  disabled={idx === system.pinnedSlugs.length - 1 || busy === `pin-${slug}`}
                  className="rounded-full p-1.5 text-muted-foreground hover:bg-secondary disabled:opacity-30"
                  aria-label="Move down"
                >
                  <ArrowDown className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => togglePin(slug)}
                  disabled={busy === `pin-${slug}`}
                  className="inline-flex items-center gap-1 rounded-full border border-border bg-background px-2.5 py-1 text-xs font-medium text-foreground hover:bg-secondary"
                >
                  <PinOff className="h-3.5 w-3.5" /> Unpin
                </button>
              </li>
            ))}
          </ol>
        )}

        <div className="mt-4">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Members ({members.length})
          </p>
          {members.length === 0 ? (
            <EmptyState message="No products are tagged for this system yet. Tag products in the Product Tagging tab." />
          ) : (
            <div className="flex flex-wrap gap-2">
              {members.map((m) => {
                const pinned = pinnedSet.has(m.slug)
                return (
                  <button
                    key={m.slug}
                    type="button"
                    onClick={() => togglePin(m.slug)}
                    disabled={busy === `pin-${m.slug}`}
                    className={
                      pinned
                        ? 'inline-flex items-center gap-1.5 rounded-full bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground'
                        : 'inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5 text-xs font-medium text-foreground hover:border-primary/40'
                    }
                  >
                    <Pin className="h-3.5 w-3.5" />
                    {m.name}
                  </button>
                )
              })}
            </div>
          )}
        </div>
      </section>

      {/* Recommended stacks */}
      <StackManager system={system} products={products} members={members} onChanged={onChanged} />
    </div>
  )
}

function StackManager({
  system,
  products,
  members,
  onChanged,
}: {
  system: AdminSystem
  products: AdminProduct[]
  members: AdminProduct[]
  onChanged: () => Promise<unknown>
}) {
  const [creating, setCreating] = useState(false)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [selected, setSelected] = useState<string[]>([])
  const [busy, setBusy] = useState<string | null>(null)

  // Stack selection can draw from all products, but default the picker to members.
  const pickable = members.length > 0 ? members : products

  function toggleSelected(slug: string) {
    setSelected((prev) =>
      prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug],
    )
  }

  async function create() {
    if (!title.trim() || selected.length === 0) return
    setBusy('create')
    try {
      await createStackAction(system.slug, {
        title: title.trim(),
        description: description.trim(),
        productSlugs: selected,
      })
      await onChanged()
      setTitle('')
      setDescription('')
      setSelected([])
      setCreating(false)
    } finally {
      setBusy(null)
    }
  }

  async function toggleActive(id: number, active: boolean) {
    setBusy(`stack-${id}`)
    try {
      await updateStackAction(id, { active })
      await onChanged()
    } finally {
      setBusy(null)
    }
  }

  async function remove(id: number) {
    setBusy(`stack-${id}`)
    try {
      await deleteStackAction(id)
      await onChanged()
    } finally {
      setBusy(null)
    }
  }

  return (
    <section>
      <div className="flex items-center justify-between">
        <h3 className="font-heading text-sm font-semibold text-foreground">
          Recommended stacks{' '}
          <span className="font-normal text-muted-foreground">({system.stacks.length})</span>
        </h3>
        <button
          type="button"
          onClick={() => setCreating((v) => !v)}
          className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-3 py-1.5 text-xs font-medium text-foreground hover:bg-secondary"
        >
          <Plus className="h-3.5 w-3.5" />
          New stack
        </button>
      </div>
      <p className="mt-1 text-xs text-muted-foreground">
        Curated product bundles shown above the ranked grid. If none are active, sensible defaults
        are used.
      </p>

      {creating && (
        <div className="mt-4 rounded-2xl border border-border bg-card p-4">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Stack title (e.g. Weight Management Stack)"
            className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-ring"
          />
          <input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Short description"
            className="mt-2 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-ring"
          />
          <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Products ({selected.length} selected)
          </p>
          <div className="mt-2 flex flex-wrap gap-2">
            {pickable.map((p) => {
              const active = selected.includes(p.slug)
              return (
                <button
                  key={p.slug}
                  type="button"
                  onClick={() => toggleSelected(p.slug)}
                  className={
                    active
                      ? 'rounded-full bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground'
                      : 'rounded-full border border-border bg-background px-3 py-1.5 text-xs font-medium text-foreground hover:border-primary/40'
                  }
                >
                  {p.name}
                </button>
              )
            })}
          </div>
          <div className="mt-4 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setCreating(false)}
              className="rounded-full border border-border bg-background px-4 py-2 text-xs font-medium text-foreground hover:bg-secondary"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={create}
              disabled={busy === 'create' || !title.trim() || selected.length === 0}
              className="btn-premium inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground disabled:opacity-50"
            >
              {busy === 'create' ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <Plus className="h-3.5 w-3.5" />
              )}
              Create stack
            </button>
          </div>
        </div>
      )}

      {system.stacks.length > 0 ? (
        <div className="mt-4 space-y-2">
          {system.stacks.map((stack) => (
            <div
              key={stack.id}
              className="flex flex-wrap items-center gap-3 rounded-2xl border border-border bg-card p-4"
            >
              <span className="flex h-9 w-9 flex-none items-center justify-center rounded-full bg-accent/15 text-accent">
                <Layers className="h-4 w-4" />
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <h4 className="truncate font-heading text-sm font-semibold text-foreground">
                    {stack.title}
                  </h4>
                  {!stack.active && (
                    <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
                      Hidden
                    </span>
                  )}
                </div>
                <p className="mt-0.5 truncate text-xs text-muted-foreground">
                  {stack.productSlugs.map((s) => nameFor(products, s)).join(' · ')}
                </p>
              </div>
              <button
                type="button"
                onClick={() => toggleActive(stack.id, !stack.active)}
                disabled={busy === `stack-${stack.id}`}
                className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-3 py-1.5 text-xs font-medium text-foreground hover:bg-secondary"
              >
                {stack.active ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                {stack.active ? 'Hide' : 'Show'}
              </button>
              <button
                type="button"
                onClick={() => remove(stack.id)}
                disabled={busy === `stack-${stack.id}`}
                className="inline-flex items-center gap-1.5 rounded-full border border-destructive/30 bg-background px-3 py-1.5 text-xs font-medium text-destructive hover:bg-destructive/10"
              >
                <Trash2 className="h-3.5 w-3.5" />
                Delete
              </button>
            </div>
          ))}
        </div>
      ) : (
        !creating && (
          <p className="mt-4 rounded-2xl border border-dashed border-border p-6 text-center text-xs text-muted-foreground">
            No custom stacks yet — the storefront shows built-in defaults.
          </p>
        )
      )}
    </section>
  )
}
