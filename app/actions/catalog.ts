'use server'

import { revalidatePath } from 'next/cache'
import { getAdminCatalog } from '@/lib/catalog/recommendations'
import {
  createStack,
  deleteStack,
  reorderPins,
  reorderStacks,
  setProductBenefit,
  setProductFeatured,
  setProductTags,
  setSystemNote,
  setSystemPin,
  updateStack,
} from '@/lib/catalog/admin-service'

function revalidateSystems() {
  revalidatePath('/systems')
  revalidatePath('/systems/[slug]', 'page')
  revalidatePath('/admin')
  revalidatePath('/')
}

// ---- Read ----

export async function getAdminCatalogAction() {
  return getAdminCatalog()
}

// ---- Product mutations ----

export async function setProductTagsAction(slug: string, tags: string[] | null) {
  await setProductTags(slug, tags)
  revalidateSystems()
}

export async function setProductFeaturedAction(slug: string, featured: boolean) {
  await setProductFeatured(slug, featured)
  revalidateSystems()
}

export async function setProductBenefitAction(slug: string, benefit: string | null) {
  await setProductBenefit(slug, benefit)
  revalidateSystems()
}

// ---- System pin mutations ----

export async function setSystemPinAction(systemSlug: string, slug: string, pinned: boolean) {
  await setSystemPin(systemSlug, slug, pinned)
  revalidateSystems()
}

export async function reorderPinsAction(systemSlug: string, orderedSlugs: string[]) {
  await reorderPins(systemSlug, orderedSlugs)
  revalidateSystems()
}

// ---- Educational note ----

export async function setSystemNoteAction(systemSlug: string, note: string) {
  await setSystemNote(systemSlug, note)
  revalidateSystems()
}

// ---- Stack mutations ----

export async function createStackAction(
  systemSlug: string,
  data: { title: string; description?: string; productSlugs: string[] },
) {
  const id = await createStack(systemSlug, data)
  revalidateSystems()
  return { id }
}

export async function updateStackAction(
  id: number,
  patch: { title?: string; description?: string; productSlugs?: string[]; active?: boolean },
) {
  await updateStack(id, patch)
  revalidateSystems()
}

export async function deleteStackAction(id: number) {
  await deleteStack(id)
  revalidateSystems()
}

export async function reorderStacksAction(systemSlug: string, ids: number[]) {
  await reorderStacks(systemSlug, ids)
  revalidateSystems()
}
