import 'server-only'
import { and, eq, sql } from 'drizzle-orm'
import { db } from '@/lib/db'
import { productMeta, systemProducts, truStacks, systemNotes } from '@/lib/db/schema'
import { isTag } from './tags'

// ---- Product metadata ----

export async function setProductTags(slug: string, tags: string[] | null) {
  const clean = tags ? Array.from(new Set(tags.filter(isTag))) : null
  await db
    .insert(productMeta)
    .values({ productSlug: slug, tags: clean, updatedAt: new Date() })
    .onConflictDoUpdate({
      target: productMeta.productSlug,
      set: { tags: clean, updatedAt: new Date() },
    })
}

export async function setProductFeatured(slug: string, featured: boolean) {
  await db
    .insert(productMeta)
    .values({ productSlug: slug, featured, updatedAt: new Date() })
    .onConflictDoUpdate({
      target: productMeta.productSlug,
      set: { featured, updatedAt: new Date() },
    })
}

export async function setProductBenefit(slug: string, benefit: string | null) {
  const value = benefit && benefit.trim() ? benefit.trim() : null
  await db
    .insert(productMeta)
    .values({ productSlug: slug, benefit: value, updatedAt: new Date() })
    .onConflictDoUpdate({
      target: productMeta.productSlug,
      set: { benefit: value, updatedAt: new Date() },
    })
}

// ---- Per-system pinning / assignment ----

export async function setSystemPin(systemSlug: string, slug: string, pinned: boolean) {
  // When pinning, place it after the current max position.
  let position = 0
  if (pinned) {
    const rows = await db
      .select({ max: sql<number>`coalesce(max(${systemProducts.position}), 0)` })
      .from(systemProducts)
      .where(eq(systemProducts.systemSlug, systemSlug))
    position = (rows[0]?.max ?? 0) + 1
  }
  await db
    .insert(systemProducts)
    .values({ systemSlug, productSlug: slug, pinned, included: true, position, updatedAt: new Date() })
    .onConflictDoUpdate({
      target: [systemProducts.systemSlug, systemProducts.productSlug],
      set: { pinned, included: true, position, updatedAt: new Date() },
    })
}

export async function reorderPins(systemSlug: string, orderedSlugs: string[]) {
  await Promise.all(
    orderedSlugs.map((slug, index) =>
      db
        .insert(systemProducts)
        .values({
          systemSlug,
          productSlug: slug,
          pinned: true,
          included: true,
          position: index + 1,
          updatedAt: new Date(),
        })
        .onConflictDoUpdate({
          target: [systemProducts.systemSlug, systemProducts.productSlug],
          set: { position: index + 1, pinned: true, included: true, updatedAt: new Date() },
        }),
    ),
  )
}

// ---- Educational notes ----

export async function setSystemNote(systemSlug: string, note: string) {
  await db
    .insert(systemNotes)
    .values({ systemSlug, note, updatedAt: new Date() })
    .onConflictDoUpdate({
      target: systemNotes.systemSlug,
      set: { note, updatedAt: new Date() },
    })
}

// ---- Recommended stacks ----

export async function createStack(
  systemSlug: string,
  data: { title: string; description?: string; productSlugs: string[] },
) {
  const rows = await db
    .select({ max: sql<number>`coalesce(max(${truStacks.position}), 0)` })
    .from(truStacks)
    .where(eq(truStacks.systemSlug, systemSlug))
  const position = (rows[0]?.max ?? 0) + 1
  const inserted = await db
    .insert(truStacks)
    .values({
      systemSlug,
      title: data.title,
      description: data.description ?? '',
      productSlugs: data.productSlugs,
      position,
      active: true,
    })
    .returning({ id: truStacks.id })
  return inserted[0]?.id
}

export async function updateStack(
  id: number,
  patch: { title?: string; description?: string; productSlugs?: string[]; active?: boolean },
) {
  await db.update(truStacks).set(patch).where(eq(truStacks.id, id))
}

export async function deleteStack(id: number) {
  await db.delete(truStacks).where(eq(truStacks.id, id))
}

export async function reorderStacks(systemSlug: string, ids: number[]) {
  await Promise.all(
    ids.map((id, index) =>
      db
        .update(truStacks)
        .set({ position: index + 1 })
        .where(and(eq(truStacks.id, id), eq(truStacks.systemSlug, systemSlug))),
    ),
  )
}
