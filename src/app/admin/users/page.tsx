'use client'

import { useEffect, useState } from 'react'
import { Card } from '@/components/admin/Card'

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:3001/api'

type User = {
  id: string
  email: string
  fullName?: string
  avatarUrl?: string
  provider: string
  createdAt: string
  updatedAt: string
}

type UsersResponse = {
  data: User[]
  total: number
  page: number
  totalPages: number
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [total, setTotal] = useState(0)
  const limit = 20

  async function load(pageNum: number) {
    try {
      setLoading(true)
      const token = localStorage.getItem('adminToken') ?? ''
      const res = await fetch(`${API_BASE}/users?page=${pageNum}&limit=${limit}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (!res.ok) throw new Error('Failed to load users')
      const data: UsersResponse = await res.json()
      setUsers(data.data)
      setTotal(data.total)
      setPage(data.page)
      setTotalPages(data.totalPages)
    } catch (e: any) {
      setError(e.message ?? 'Error loading users')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load(page)
  }, [page])

  return (
    <div className="space-y-6">
      <Card
        title="Users"
        description="View all registered users on the platform."
        headerRight={
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Total: {total} users
          </div>
        }
      >
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-zinc-950/40">
                <th className="py-2 px-3">Email</th>
                <th className="py-2 px-3">Full Name</th>
                <th className="py-2 px-3">Provider</th>
                <th className="py-2 px-3">Joined</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td className="py-4 px-3" colSpan={4}>
                    Loading...
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td className="py-4 px-3 text-red-600" colSpan={4}>
                    {error}
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td className="py-4 px-3" colSpan={4}>
                    No users found.
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr
                    key={user.id}
                    className="border-t border-gray-100 dark:border-zinc-800 hover:bg-gray-50/50 dark:hover:bg-zinc-900/40"
                  >
                    <td className="py-2 px-3">
                      <div className="flex items-center gap-2">
                        {user.avatarUrl && (
                          <img
                            src={user.avatarUrl}
                            alt=""
                            className="w-8 h-8 rounded-full"
                          />
                        )}
                        <span className="font-medium">{user.email}</span>
                      </div>
                    </td>
                    <td className="py-2 px-3 text-gray-700 dark:text-gray-300">
                      {user.fullName || '—'}
                    </td>
                    <td className="py-2 px-3">
                      <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10 capitalize">
                        {user.provider}
                      </span>
                    </td>
                    <td className="py-2 px-3 text-gray-500">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-200 dark:border-zinc-800">
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Page {page} of {totalPages}
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-4 py-2 text-sm font-medium rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed dark:border-zinc-700 dark:hover:bg-zinc-800"
              >
                Previous
              </button>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="px-4 py-2 text-sm font-medium rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed dark:border-zinc-700 dark:hover:bg-zinc-800"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </Card>
    </div>
  )
}
