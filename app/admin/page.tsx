import { AdminShell } from '@/components/admin/admin-shell'

export const metadata = {
  title: 'Admin Console — TRU PEPTIDE',
  description:
    'Manage inventory, orders, products, customers, COAs, testimonials, blog, systems, goals, the compound library, and analytics.',
}

export default function AdminPage() {
  return <AdminShell />
}
