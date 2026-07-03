import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { Account } from '@/components/shop/account'

export const metadata = {
  title: 'Account — TRU PEPTIDE',
  description: 'Manage your account and view your order history.',
}

export default function AccountPage() {
  return (
    <>
      <SiteHeader />
      <main className="min-h-screen bg-background pt-24">
        <Account />
      </main>
      <SiteFooter />
    </>
  )
}
