'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { StatCard } from '@/components/admin/StatCard'
import { LineChart } from '@/components/admin/LineChart'
import { DonutChart } from '@/components/admin/DonutChart'

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:3001/api'

export default function AdminDashboardPage () {
  const router = useRouter()
  const [email, setEmail] = useState<string | null>(null)
  const [role, setRole] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [stats, setStats] = useState<any | null>(null)
  const [series, setSeries] = useState<number[]>([])

  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('adminToken') : null
    if (!token) {
      router.replace('/admin/login')
      return
    }

    ;(async () => {
      try {
        const res = await fetch(`${API_BASE}/admin/me`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        if (!res.ok) throw new Error('Unauthorized')
        const data = await res.json() as { email: string, role: string }
        setEmail(data.email)
        setRole(data.role)

        const statsRes = await fetch(`${API_BASE}/admin/stats`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        if (!statsRes.ok) throw new Error('Failed to load stats')
        const statsData = await statsRes.json()
        setStats(statsData)

        // mock time-series for "Real-time Analytics"
        const s = Array.from({ length: 12 }, (_, i) => 60 + Math.round(40 * Math.sin(i / 2) + (Math.random() * 10 - 5)))
        setSeries(s)
      } catch (e: any) {
        setError('Your session expired. Please sign in again.')
        localStorage.removeItem('adminToken')
        localStorage.removeItem('adminRole')
        router.replace('/admin/login')
      }
    })()
  }, [router])

  const fmtCurrency = (n: number) => new Intl.NumberFormat(undefined, { style: 'currency', currency: 'USD' }).format(n)

  return (
    <main className="min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="mb-2">
          <h1 className="text-xl font-semibold">Dashboard</h1>
          {error ? (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{error}</p>
          ) : (
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {email ? `Signed in as ${email} (${role})` : 'Loading...'}
            </p>
          )}
        </div>

        {/* 8 tiles as requested */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          <StatCard title="Total Users" value={stats?.totalUsers ?? '—'} accent="bg-blue-600" />
          <StatCard title="Users Registered Today" value={stats?.totalUsersToday ?? '—'} accent="bg-cyan-600" />
          <StatCard title="Subscriptions Today" value={stats?.totalSubscribedToday ?? '—'} accent="bg-green-600" />
          <StatCard title="Revenue Today" value={typeof stats?.revenueToday === 'number' ? fmtCurrency(stats.revenueToday) : '—'} accent="bg-indigo-600" />

          <StatCard title="Overall Revenue" value={typeof stats?.overallRevenue === 'number' ? fmtCurrency(stats.overallRevenue) : '—'} accent="bg-purple-600" />
          <StatCard title="Overall Users / Active Subs" value={`${stats?.overallUsers ?? '—'} / ${stats?.overallActiveSubscriptions ?? '—'}`} accent="bg-teal-600" />
          <StatCard title="Total Exams" value={stats?.totalExams ?? '—'} accent="bg-amber-600" />
          <StatCard title="Total Providers" value={stats?.totalProviders ?? '—'} accent="bg-rose-600" />
        </div>

        {/* Charts row: Real-time Analytics & Device Analytics */}
        <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 rounded-xl border border-gray-200/60 bg-white shadow-sm dark:bg-zinc-900 dark:border-zinc-800">
            <div className="p-4 border-b border-gray-200/60 dark:border-zinc-800">
              <div className="text-sm font-medium">Real-time Analytics</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Sessions & Page Views</div>
            </div>
            <div className="p-4">
              <LineChart points={series} />
            </div>
          </div>

          <div className="rounded-xl border border-gray-200/60 bg-white shadow-sm dark:bg-zinc-900 dark:border-zinc-800">
            <div className="p-4 border-b border-gray-200/60 dark:border-zinc-800">
              <div className="text-sm font-medium">Device Analytics</div>
            </div>
            <div className="p-4">
              <DonutChart
                segments={[
                  { label: 'Desktop', value: 46, color: '#3b82f6' },
                  { label: 'Mobile', value: 39, color: '#22c55e' },
                  { label: 'Tablet', value: 15, color: '#a855f7' },
                ]}
              />
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}


