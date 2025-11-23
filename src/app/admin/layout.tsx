'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Sidebar } from '@/components/admin/Sidebar'
import { Topbar } from '@/components/admin/Topbar'

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:3001/api'

export default function AdminLayout ({ children }: { children: React.ReactNode }) {
  const router = useRouter()

  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('adminToken') : null
    if (!token) {
      router.replace('/admin/login')
      return
    }
    // optional: ping /admin/me in background to validate token quickly
    ;(async () => {
      try {
        const res = await fetch(`${API_BASE}/admin/me`, { headers: { Authorization: `Bearer ${token}` } })
        if (!res.ok) throw new Error('unauthorized')
      } catch {
        localStorage.removeItem('adminToken')
        router.replace('/admin/login')
      }
    })()
  }, [router])

  return (
    <div className="min-h-screen flex bg-[var(--background)] text-[var(--foreground)]">
      <Sidebar />
      <div className="flex-1 min-w-0">
        <Topbar />
        <div className="p-4 md:p-6">{children}</div>
      </div>
    </div>
  )
}


