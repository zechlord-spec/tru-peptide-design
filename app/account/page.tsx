import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { Dashboard } from '@/components/shop/dashboard'

export const metadata = {
  title: 'Dashboard — TRU PEPTIDE',
  description:
    'Manage your orders, saved products, COA downloads, favorites, recently viewed compounds, and account settings.',
}

export default function AccountPage() {
  return (
    <>
      <SiteHeader />
      <main className="min-h-screen bg-background pt-24">
        <Dashboard />
      </main>
      <SiteFooter />
    </>
  )
}
