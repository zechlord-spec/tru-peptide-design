'use client'

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts'
import { DollarSign, ShoppingBag, TrendingUp, Percent } from 'lucide-react'
import {
  MONTHLY,
  CATEGORY_BREAKDOWN,
  TOP_PRODUCTS,
  TRAFFIC,
  KPIS,
  money,
} from '@/lib/admin-data'
import { SectionHeader, StatCard } from '@/components/admin/ui'

const NAVY = '#081b35'
const GOLD = '#c6a15b'
const PIE_COLORS = ['#081b35', '#c6a15b', '#6b6355', '#8ba0b8', '#d3bd9f', '#b08949']

function ChartCard({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <h3 className="mb-4 font-heading text-sm font-semibold text-foreground">{title}</h3>
      <div className="h-64 w-full">{children}</div>
    </div>
  )
}

const tooltipStyle = {
  borderRadius: 12,
  border: '1px solid #d3bd9f',
  background: '#f8f4ef',
  fontSize: 12,
  color: '#20242a',
}

export function AnalyticsSection() {
  const yearRevenue = MONTHLY.reduce((s, m) => s + m.revenue, 0)
  const yearOrders = MONTHLY.reduce((s, m) => s + m.orders, 0)

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Analytics"
        description="Revenue trends, product performance, and acquisition insights."
      />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Annual revenue" value={money(yearRevenue)} icon={DollarSign} delta={14.2} />
        <StatCard label="Annual orders" value={yearOrders.toLocaleString()} icon={ShoppingBag} delta={9.7} />
        <StatCard label="Avg. order value" value={money(KPIS.aov)} icon={TrendingUp} delta={3.1} />
        <StatCard label="Conversion rate" value="3.8%" icon={Percent} delta={0.4} />
      </div>

      <ChartCard title="Revenue over time">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={MONTHLY} margin={{ top: 8, right: 8, left: -12, bottom: 0 }}>
            <defs>
              <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={GOLD} stopOpacity={0.5} />
                <stop offset="100%" stopColor={GOLD} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#d3bd9f" vertical={false} />
            <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#6b6355' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 12, fill: '#6b6355' }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${v / 1000}k`} />
            <Tooltip contentStyle={tooltipStyle} formatter={(v) => money(Number(v))} />
            <Area type="monotone" dataKey="revenue" stroke={GOLD} strokeWidth={2.5} fill="url(#rev)" />
          </AreaChart>
        </ResponsiveContainer>
      </ChartCard>

      <div className="grid gap-4 lg:grid-cols-2">
        <ChartCard title="Orders per month">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={MONTHLY} margin={{ top: 8, right: 8, left: -12, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#d3bd9f" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#6b6355' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: '#6b6355' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={tooltipStyle} cursor={{ fill: 'rgba(8,27,53,0.05)' }} />
              <Bar dataKey="orders" fill={NAVY} radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Catalog by category">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={CATEGORY_BREAKDOWN}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={85}
                paddingAngle={2}
              >
                {CATEGORY_BREAKDOWN.map((_, i) => (
                  <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={tooltipStyle} />
              <Legend
                verticalAlign="bottom"
                iconType="circle"
                wrapperStyle={{ fontSize: 11, color: '#6b6355' }}
              />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <ChartCard title="Top products by units sold">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={TOP_PRODUCTS} layout="vertical" margin={{ top: 4, right: 12, left: 12, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#d3bd9f" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 12, fill: '#6b6355' }} axisLine={false} tickLine={false} />
              <YAxis
                type="category"
                dataKey="name"
                tick={{ fontSize: 11, fill: '#6b6355' }}
                axisLine={false}
                tickLine={false}
                width={90}
              />
              <Tooltip contentStyle={tooltipStyle} cursor={{ fill: 'rgba(8,27,53,0.05)' }} />
              <Bar dataKey="units" fill={GOLD} radius={[0, 6, 6, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Traffic sources">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={TRAFFIC}
                dataKey="value"
                nameKey="source"
                cx="50%"
                cy="50%"
                outerRadius={85}
                paddingAngle={2}
              >
                {TRAFFIC.map((_, i) => (
                  <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={tooltipStyle} formatter={(v) => `${Number(v)}%`} />
              <Legend
                verticalAlign="bottom"
                iconType="circle"
                wrapperStyle={{ fontSize: 11, color: '#6b6355' }}
              />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
    </div>
  )
}
