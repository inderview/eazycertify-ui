/* eslint-disable react/no-unescaped-entities */
'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:3001/api'

export default function AdminLoginPage () {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('adminToken') : null
    if (token) {
      router.replace('/admin')
    }
  }, [router])

  async function onSubmit (e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      const res = await fetch(`${API_BASE}/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      if (!res.ok) {
        const txt = await res.text()
        throw new Error(txt || 'Login failed')
      }
      const data = await res.json() as { token: string, role: string }
      localStorage.setItem('adminToken', data.token)
      localStorage.setItem('adminRole', data.role)
      router.replace('/admin')
    } catch (err: any) {
      setError(err.message ?? 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--background)] px-4">
      <div className="w-full max-w-md rounded-xl border border-gray-200/40 bg-white/80 shadow-md backdrop-blur-md dark:bg-zinc-900/60 dark:border-zinc-800">
        <div className="p-6 sm:p-8">
          <h1 className="text-2xl font-semibold text-center mb-1">Admin Login</h1>
          <p className="text-center text-sm text-gray-500 dark:text-gray-400 mb-6">
            Sign in to manage vendors, exams and question banks.
          </p>

          {error && (
            <div className="mb-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-900/30 dark:border-red-900/50 dark:text-red-300">
              {error}
            </div>
          )}

          <form onSubmit={onSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium">Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 dark:bg-zinc-950 dark:border-zinc-800"
                placeholder="admin@eazycertify.local"
                autoComplete="username"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium">Password</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 dark:bg-zinc-950 dark:border-zinc-800"
                placeholder="••••••••"
                autoComplete="current-password"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-md bg-blue-600 text-white py-2.5 text-sm font-medium hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed transition"
            >
              {loading ? 'Signing in…' : "Sign in"}
            </button>
          </form>

          <div className="mt-6 text-xs text-gray-500 dark:text-gray-400 text-center">
            Protected admin area • v1
          </div>
        </div>
      </div>
    </div>
  )
}


