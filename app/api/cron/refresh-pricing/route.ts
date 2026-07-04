import { NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { refreshAllPricing } from '@/lib/pricing/service'

export const dynamic = 'force-dynamic'
export const maxDuration = 300

export async function GET(request: Request) {
  const authHeader = request.headers.get('authorization')
  const secret = process.env.CRON_SECRET

  // Vercel Cron sends `Authorization: Bearer <CRON_SECRET>`.
  if (secret && authHeader !== `Bearer ${secret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const result = await refreshAllPricing()
    revalidatePath('/')
    revalidatePath('/products')
    revalidatePath('/products/[slug]', 'page')
    revalidatePath('/admin')
    return NextResponse.json({ ok: true, ...result })
  } catch (err) {
    console.log('[v0] cron refresh-pricing failed', String(err))
    return NextResponse.json({ ok: false, error: String(err) }, { status: 500 })
  }
}
