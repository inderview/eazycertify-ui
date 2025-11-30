'use client'

import { useEffect, useState } from 'react'
import { Tabs } from '@/components/admin/Tabs'
import { Card } from '@/components/admin/Card'

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:3001/api'

type Provider = {
  id: number
  name: string
  logoUrl?: string
  status: 'active' | 'inactive'
  sortOrder?: number
}

export default function ProvidersPage () {
  const [items, setItems] = useState<Provider[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [form, setForm] = useState({ name: '', logoUrl: '', status: 'active' as 'active' | 'inactive', sortOrder: '' })
  const [editingId, setEditingId] = useState<number | null>(null)
  const [tab, setTab] = useState<'grid' | 'form'>('grid')

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
    setForm({ name: '', logoUrl: '', status: 'active', sortOrder: '' })
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
      <Card
        title="Providers"
        description="Manage vendors like AWS, Microsoft, Google Cloud, CompTIA."
        headerRight={null}
      >
        <Tabs
          tabs={[{ key: 'grid', label: 'Grid' }, { key: 'form', label: 'Data Entry' }]}
          active={tab}
          onChange={(k) => setTab(k as 'grid' | 'form')}
        />
      </Card>

      {tab === 'form' && (
        <Card>
          {error && <div className="mb-3 rounded border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:bg-red-900/30 dark:border-red-900/50 dark:text-red-300">{error}</div>}
          <form onSubmit={onCreate} className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium">Vendor Name</label>
              <input
                className="rounded-md border border-gray-300 px-3 py-2 text-sm dark:bg-zinc-950 dark:border-zinc-800"
                placeholder="Vendor Name"
                value={form.name}
                onChange={e => setForm(prev => ({ ...prev, name: e.target.value }))}
                required
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium">Logo URL</label>
              <input
                className="rounded-md border border-gray-300 px-3 py-2 text-sm dark:bg-zinc-950 dark:border-zinc-800"
                placeholder="https://..."
                value={form.logoUrl}
                onChange={e => setForm(prev => ({ ...prev, logoUrl: e.target.value }))}
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium">Status</label>
              <select
                className="rounded-md border border-gray-300 px-3 py-2 text-sm dark:bg-zinc-950 dark:border-zinc-800"
                value={form.status}
                onChange={e => setForm(prev => ({ ...prev, status: e.target.value as 'active' | 'inactive' }))}
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium">Sort Order (optional)</label>
              <input
                type="number"
                className="rounded-md border border-gray-300 px-3 py-2 text-sm dark:bg-zinc-950 dark:border-zinc-800"
                placeholder="e.g., 1, 2, 3..."
                value={form.sortOrder}
                onChange={e => setForm(prev => ({ ...prev, sortOrder: e.target.value }))}
              />
            </div>
            <div className="flex items-end">
              <button className="rounded-md bg-blue-600 text-white text-sm px-4 py-2 hover:bg-blue-700">Add Provider</button>
            </div>
          </form>
        </Card>
      )}

      {tab === 'grid' && (
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-zinc-950/40">
                  <th className="py-2 pr-3">Logo</th>
                  <th className="py-2 pr-3">Name</th>
                  <th className="py-2 pr-3">Status</th>
                  <th className="py-2 pr-3">Sort Order</th>
                  <th className="py-2 pr-3 w-40">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td className="py-4" colSpan={5}>Loading...</td></tr>
                ) : items.length === 0 ? (
                  <tr><td className="py-4" colSpan={5}>No providers yet.</td></tr>
                ) : items.map(p => (
                  <tr key={p.id} className="border-t border-gray-100 dark:border-zinc-800 hover:bg-gray-50/50 dark:hover:bg-zinc-900/40">
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
                      <input
                        type="number"
                        value={p.sortOrder ?? ''}
                        onChange={e => onSave(p.id, { sortOrder: e.target.value ? Number(e.target.value) : undefined })}
                        className="rounded-md border border-gray-300 px-2 py-1 text-sm w-20 dark:bg-zinc-950 dark:border-zinc-800"
                        placeholder="—"
                      />
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
                          className="rounded-md border px-3 py-1 hover:bg-red-50 text-red-600 border-red-200 dark:border-red-900/40 dark:hover:bg-red-900/10"
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
        </Card>
      )}
    </div>
  )
}


