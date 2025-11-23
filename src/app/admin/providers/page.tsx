'use client'

import { useEffect, useState } from 'react'

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:3001/api'

type Provider = {
  id: number
  name: string
  logoUrl?: string
  status: 'active' | 'inactive'
}

export default function ProvidersPage () {
  const [items, setItems] = useState<Provider[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [form, setForm] = useState({ name: '', logoUrl: '', status: 'active' as 'active' | 'inactive' })
  const [editingId, setEditingId] = useState<number | null>(null)

  async function load () {
    try {
      const token = localStorage.getItem('adminToken') ?? ''
      const res = await fetch(`${API_BASE}/admin/providers`, { headers: { Authorization: `Bearer ${token}` } })
      if (!res.ok) throw new Error('Failed to load providers')
      const data = await res.json()
      setItems(data)
    } catch (e: any) {
      setError(e.message ?? 'Error loading providers')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  async function onCreate (e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    const token = localStorage.getItem('adminToken') ?? ''
    const res = await fetch(`${API_BASE}/admin/providers`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(form),
    })
    if (!res.ok) {
      const text = await res.text()
      setError(text || 'Failed to create provider')
      return
    }
    setForm({ name: '', logoUrl: '', status: 'active' })
    await load()
  }

  async function onSave (id: number, data: Partial<Provider>) {
    const token = localStorage.getItem('adminToken') ?? ''
    const res = await fetch(`${API_BASE}/admin/providers/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(data),
    })
    if (!res.ok) {
      const text = await res.text()
      setError(text || 'Failed to update provider')
      return
    }
    setEditingId(null)
    await load()
  }

  async function onDelete (id: number) {
    const token = localStorage.getItem('adminToken') ?? ''
    const res = await fetch(`${API_BASE}/admin/providers/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    })
    if (!res.ok) {
      const text = await res.text()
      setError(text || 'Failed to delete provider')
      return
    }
    await load()
  }

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-gray-200/60 bg-white p-6 shadow-sm dark:bg-zinc-900 dark:border-zinc-800">
        <h2 className="text-lg font-semibold">Providers</h2>
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">Manage vendors like AWS, Microsoft, Google Cloud, CompTIA.</p>

        {error && <div className="mt-3 rounded border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:bg-red-900/30 dark:border-red-900/50 dark:text-red-300">{error}</div>}

        <form onSubmit={onCreate} className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-3">
          <input
            className="rounded-md border border-gray-300 px-3 py-2 text-sm dark:bg-zinc-950 dark:border-zinc-800"
            placeholder="Vendor Name"
            value={form.name}
            onChange={e => setForm(prev => ({ ...prev, name: e.target.value }))}
            required
          />
          <input
            className="rounded-md border border-gray-300 px-3 py-2 text-sm dark:bg-zinc-950 dark:border-zinc-800"
            placeholder="Logo URL (https://...)"
            value={form.logoUrl}
            onChange={e => setForm(prev => ({ ...prev, logoUrl: e.target.value }))}
          />
          <select
            className="rounded-md border border-gray-300 px-3 py-2 text-sm dark:bg-zinc-950 dark:border-zinc-800"
            value={form.status}
            onChange={e => setForm(prev => ({ ...prev, status: e.target.value as 'active' | 'inactive' }))}
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
          <button className="rounded-md bg-blue-600 text-white text-sm px-4 py-2 hover:bg-blue-700">Add Provider</button>
        </form>
      </div>

      <div className="rounded-xl border border-gray-200/60 bg-white p-6 shadow-sm dark:bg-zinc-900 dark:border-zinc-800">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-500 dark:text-gray-400">
                <th className="py-2 pr-3">Logo</th>
                <th className="py-2 pr-3">Name</th>
                <th className="py-2 pr-3">Status</th>
                <th className="py-2 pr-3 w-40">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td className="py-4" colSpan={4}>Loading...</td></tr>
              ) : items.length === 0 ? (
                <tr><td className="py-4" colSpan={4}>No providers yet.</td></tr>
              ) : items.map(p => (
                <tr key={p.id} className="border-t border-gray-100 dark:border-zinc-800">
                  <td className="py-2 pr-3">
                    {p.logoUrl ? <img src={p.logoUrl} alt="" className="h-6 w-6 rounded" /> : <span className="text-gray-400">—</span>}
                  </td>
                  <td className="py-2 pr-3">
                    {editingId === p.id ? (
                      <input
                        defaultValue={p.name}
                        onBlur={e => onSave(p.id, { name: e.target.value })}
                        className="rounded-md border border-gray-300 px-2 py-1 text-sm dark:bg-zinc-950 dark:border-zinc-800"
                      />
                    ) : (
                      p.name
                    )}
                  </td>
                  <td className="py-2 pr-3">
                    <select
                      value={p.status}
                      onChange={e => onSave(p.id, { status: e.target.value as 'active' | 'inactive' })}
                      className="rounded-md border border-gray-300 px-2 py-1 text-sm dark:bg-zinc-950 dark:border-zinc-800"
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </td>
                  <td className="py-2 pr-3">
                    <div className="flex gap-2">
                      <button
                        className="rounded-md border px-3 py-1 hover:bg-gray-50 dark:border-zinc-800 dark:hover:bg-zinc-900"
                        onClick={() => setEditingId(p.id)}
                      >
                        Edit
                      </button>
                      <button
                        className="rounded-md border px-3 py-1 hover:bg-gray-50 text-red-600 border-red-200 dark:border-red-900/40 dark:hover:bg-red-900/10"
                        onClick={() => onDelete(p.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}


