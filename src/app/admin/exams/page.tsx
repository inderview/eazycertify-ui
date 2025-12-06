'use client'

import { useEffect, useState } from 'react'
import { Tabs } from '@/components/admin/Tabs'
import { Card } from '@/components/admin/Card'

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:3001/api'

type Provider = { id: number, name: string }
type Exam = {
  id: number
  providerId: number
  code: string
  title: string
  version: string
  status: 'draft' | 'active' | 'archived'
  timeLimitMinutes: number
  passingScorePercent: number
  totalQuestionsInBank: number
  questionsPerMockTest: number
  price?: number
  purchasable?: boolean
  sortOrder?: number
  imageUrl?: string
  configuration?: {
    topicDistribution?: Record<string, number>
    typeDistribution?: Record<string, number>
    overlapPolicy?: {
      minNewPercent?: number
      maxRepeatFromLast?: number
    }
  }
}

function DistributionEditor({ label, value, onChange, options }: { label: string, value: Record<string, number>, onChange: (val: Record<string, number>) => void, options?: string[] }) {
  const [newKey, setNewKey] = useState('')
  const [newCount, setNewCount] = useState(0)

  const add = () => {
    if (!newKey) return
    onChange({ ...value, [newKey]: newCount })
    setNewKey('')
    setNewCount(0)
  }

  const remove = (key: string) => {
    const next = { ...value }
    delete next[key]
    onChange(next)
  }

  return (
    <div className="flex flex-col gap-2 border p-3 rounded-md dark:border-zinc-800">
      <label className="text-xs font-medium">{label}</label>
      <div className="flex gap-2">
        {options ? (
          <select
            className="flex-1 rounded-md border border-gray-300 px-2 py-1 text-sm dark:bg-zinc-950 dark:border-zinc-800"
            value={newKey}
            onChange={e => setNewKey(e.target.value)}
          >
            <option value="">Select Type</option>
            {options.map(opt => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        ) : (
          <input 
            placeholder="Name" 
            className="flex-1 rounded-md border border-gray-300 px-2 py-1 text-sm dark:bg-zinc-950 dark:border-zinc-800"
            value={newKey} 
            onChange={e => setNewKey(e.target.value)} 
          />
        )}
        <input 
          type="number" 
          placeholder="Count" 
          className="w-20 rounded-md border border-gray-300 px-2 py-1 text-sm dark:bg-zinc-950 dark:border-zinc-800"
          value={newCount} 
          onChange={e => setNewCount(Number(e.target.value))} 
        />
        <button type="button" onClick={add} className="bg-blue-600 text-white px-3 rounded-md text-sm">+</button>
      </div>
      <div className="flex flex-col gap-1 mt-2">
        {Object.entries(value).map(([k, v]) => (
          <div key={k} className="flex justify-between items-center bg-gray-50 dark:bg-zinc-900 p-2 rounded text-sm">
            <span>{k}: {v}</span>
            <button type="button" onClick={() => remove(k)} className="text-red-500">×</button>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function ExamsPage () {
  const [providers, setProviders] = useState<Provider[]>([])
  const [items, setItems] = useState<Exam[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [tab, setTab] = useState<'grid' | 'form'>('grid')
  const [editingId, setEditingId] = useState<number | null>(null)
  const [form, setForm] = useState({
    providerId: 0,
    code: '',
    title: '',
    version: '',
    status: 'draft' as 'draft' | 'active' | 'archived',
    timeLimitMinutes: 60,
    passingScorePercent: 70,
    totalQuestionsInBank: 0,
    questionsPerMockTest: 65,
    price: '' as string | number,
    purchasable: false,
    sortOrder: '' as string | number,
    imageUrl: '',
    configuration: {
      topicDistribution: {} as Record<string, number>,
      typeDistribution: {} as Record<string, number>,
      overlapPolicy: {
        minNewPercent: 0,
        maxRepeatFromLast: 0
      }
    }
  })

  async function loadData () {
    try {
      const token = localStorage.getItem('adminToken') ?? ''
      const [provRes, examsRes] = await Promise.all([
        fetch(`${API_BASE}/admin/providers`, { headers: { Authorization: `Bearer ${token}` } }),
        fetch(`${API_BASE}/admin/exams`, { headers: { Authorization: `Bearer ${token}` } }),
      ])
      if (!provRes.ok) throw new Error('Failed to load providers')
      if (!examsRes.ok) throw new Error('Failed to load exams')
      setProviders(await provRes.json())
      setItems(await examsRes.json())
    } catch (e: any) {
      setError(e.message ?? 'Error loading exams')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadData() }, [])

  async function onSubmit (e: React.FormEvent) {
    e.preventDefault()
    if (editingId) {
      await onUpdate(editingId, {
        ...form,
        providerId: Number(form.providerId),
        timeLimitMinutes: Number(form.timeLimitMinutes),
        passingScorePercent: Number(form.passingScorePercent),
        totalQuestionsInBank: Number(form.totalQuestionsInBank),
        questionsPerMockTest: Number(form.questionsPerMockTest),
        price: form.price === '' ? undefined : Number(form.price),
        purchasable: form.purchasable,
        sortOrder: form.sortOrder === '' ? undefined : Number(form.sortOrder),
      })
      setEditingId(null)
      setTab('grid')
      resetForm()
    } else {
      await onCreate(e)
    }
  }

  function resetForm() {
    setForm({
      providerId: 0,
      code: '',
      title: '',
      version: '',
      status: 'draft',
      timeLimitMinutes: 60,
      passingScorePercent: 70,
      totalQuestionsInBank: 0,
      questionsPerMockTest: 65,
      price: '',
      purchasable: false,
      sortOrder: '',
      imageUrl: '',
      configuration: {
        topicDistribution: {},
        typeDistribution: {},
        overlapPolicy: { minNewPercent: 0, maxRepeatFromLast: 0 }
      }
    })
    setEditingId(null)
  }

  async function onCreate (e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    const token = localStorage.getItem('adminToken') ?? ''
    const payload = {
      ...form,
      providerId: Number(form.providerId),
      timeLimitMinutes: Number(form.timeLimitMinutes),
      passingScorePercent: Number(form.passingScorePercent),
      totalQuestionsInBank: Number(form.totalQuestionsInBank),
      questionsPerMockTest: Number(form.questionsPerMockTest),
      price: form.price === '' ? undefined : Number(form.price),
      purchasable: form.purchasable,
    }
    const res = await fetch(`${API_BASE}/admin/exams`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(payload),
    })
    if (!res.ok) {
      const text = await res.text()
      setError(text || 'Failed to create exam')
      return
    }
    resetForm()
    await loadData()
  }

  async function onUpdate (id: number, data: Partial<Exam>) {
    const token = localStorage.getItem('adminToken') ?? ''
    const res = await fetch(`${API_BASE}/admin/exams/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(data),
    })
    if (!res.ok) {
      const text = await res.text()
      setError(text || 'Failed to update exam')
      return
    }
    await loadData()
  }

  async function onDelete (id: number) {
    const token = localStorage.getItem('adminToken') ?? ''
    const res = await fetch(`${API_BASE}/admin/exams/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    })
    if (!res.ok) {
      const text = await res.text()
      setError(text || 'Failed to delete exam')
      return
    }
    await loadData()
  }

  return (
    <div className="space-y-6">
      <Card title="Exams" description="Create and manage exams under providers.">
        <Tabs
          tabs={[{ key: 'grid', label: 'Grid' }, { key: 'form', label: 'Data Entry' }]}
          active={tab}
          onChange={(k) => setTab(k as 'grid' | 'form')}
        />
      </Card>

      {tab === 'form' && (
        <Card title={editingId ? 'Edit Exam' : 'Add Exam'}>
          {error && <div className="mb-3 rounded border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:bg-red-900/30 dark:border-red-900/50 dark:text-red-300">{error}</div>}

        <form onSubmit={onSubmit} className="grid grid-cols-1 md:grid-cols-6 gap-3">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium">Provider</label>
            <select
              required
              className="rounded-md border border-gray-300 px-3 py-2 text-sm dark:bg-zinc-950 dark:border-zinc-800"
              value={form.providerId || ''}
              onChange={e => setForm(prev => ({ ...prev, providerId: Number(e.target.value) }))}
            >
              <option value="">Select Provider</option>
              {providers.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium">Exam Code</label>
            <input
              className="rounded-md border border-gray-300 px-3 py-2 text-sm dark:bg-zinc-950 dark:border-zinc-800"
              placeholder="e.g., SAA-C03"
              value={form.code}
              onChange={e => setForm(prev => ({ ...prev, code: e.target.value }))}
              required
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium">Exam Title</label>
            <input
              className="rounded-md border border-gray-300 px-3 py-2 text-sm dark:bg-zinc-950 dark:border-zinc-800"
              placeholder="Solutions Architect Associate"
              value={form.title}
              onChange={e => setForm(prev => ({ ...prev, title: e.target.value }))}
              required
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium">Version</label>
            <input
              className="rounded-md border border-gray-300 px-3 py-2 text-sm dark:bg-zinc-950 dark:border-zinc-800"
              placeholder="v3.0"
              value={form.version}
              onChange={e => setForm(prev => ({ ...prev, version: e.target.value }))}
              required
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium">Status</label>
            <select
              className="rounded-md border border-gray-300 px-3 py-2 text-sm dark:bg-zinc-950 dark:border-zinc-800"
              value={form.status}
              onChange={e => setForm(prev => ({ ...prev, status: e.target.value as any }))}
            >
              <option value="draft">Draft</option>
              <option value="active">Active</option>
              <option value="archived">Archived</option>
            </select>
          </div>

          <div className="flex gap-2">
            <button className="rounded-md bg-blue-600 text-white text-sm px-4 py-2 hover:bg-blue-700">
              {editingId ? 'Update Exam' : 'Add Exam'}
            </button>
            {editingId && (
              <button
                type="button"
                onClick={() => {
                  resetForm()
                  setTab('grid')
                }}
                className="rounded-md border border-gray-300 px-4 py-2 text-sm hover:bg-gray-50 dark:border-zinc-800 dark:hover:bg-zinc-900"
              >
                Cancel
              </button>
            )}
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium">Time Limit (minutes)</label>
            <input
              type="number"
              className="rounded-md border border-gray-300 px-3 py-2 text-sm dark:bg-zinc-950 dark:border-zinc-800"
              value={form.timeLimitMinutes}
              onChange={e => setForm(prev => ({ ...prev, timeLimitMinutes: Number(e.target.value) }))}
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium">Passing Score (%)</label>
            <input
              type="number"
              className="rounded-md border border-gray-300 px-3 py-2 text-sm dark:bg-zinc-950 dark:border-zinc-800"
              value={form.passingScorePercent}
              onChange={e => setForm(prev => ({ ...prev, passingScorePercent: Number(e.target.value) }))}
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium">Total Questions in Bank</label>
            <input
              type="number"
              className="rounded-md border border-gray-300 px-3 py-2 text-sm dark:bg-zinc-950 dark:border-zinc-800"
              value={form.totalQuestionsInBank}
              onChange={e => setForm(prev => ({ ...prev, totalQuestionsInBank: Number(e.target.value) }))}
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium">Questions per Mock Test</label>
            <input
              type="number"
              className="rounded-md border border-gray-300 px-3 py-2 text-sm dark:bg-zinc-950 dark:border-zinc-800"
              value={form.questionsPerMockTest}
              onChange={e => setForm(prev => ({ ...prev, questionsPerMockTest: Number(e.target.value) }))}
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium">Price (optional)</label>
            <input
              type="number"
              className="rounded-md border border-gray-300 px-3 py-2 text-sm dark:bg-zinc-950 dark:border-zinc-800"
              value={form.price}
              onChange={e => setForm(prev => ({ ...prev, price: e.target.value }))}
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="purchasable"
              className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              checked={form.purchasable}
              onChange={e => setForm(prev => ({ ...prev, purchasable: e.target.checked }))}
            />
            <label htmlFor="purchasable" className="text-xs font-medium cursor-pointer">Purchasable (Allow users to buy)</label>
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

          <div className="flex flex-col gap-1 md:col-span-6">
            <label className="text-xs font-medium">Image URL (optional)</label>
            <input
              type="url"
              className="rounded-md border border-gray-300 px-3 py-2 text-sm dark:bg-zinc-950 dark:border-zinc-800"
              placeholder="https://example.com/image.jpg"
              value={form.imageUrl}
              onChange={e => setForm(prev => ({ ...prev, imageUrl: e.target.value }))}
            />
          </div>

          <div className="md:col-span-6 border-t pt-4 mt-2">
            <h3 className="text-sm font-medium mb-3">Mock Exam Configuration</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <DistributionEditor 
                label="Topic Distribution (Topic -> Count)" 
                value={form.configuration.topicDistribution} 
                onChange={val => setForm(prev => ({ ...prev, configuration: { ...prev.configuration, topicDistribution: val } }))}
              />
              <DistributionEditor 
                label="Question Type Distribution (Fallback)" 
                value={form.configuration.typeDistribution} 
                onChange={val => setForm(prev => ({ ...prev, configuration: { ...prev.configuration, typeDistribution: val } }))}
                options={['single', 'multi', 'ordering', 'yesno', 'hotspot', 'dragdrop']}
              />
              <div className="flex flex-col gap-2 border p-3 rounded-md dark:border-zinc-800">
                <label className="text-xs font-medium">Overlap Policy</label>
                <div className="flex gap-2 items-center">
                  <label className="text-xs w-32">Min New % (0-1)</label>
                  <input 
                    type="number" 
                    step="0.1"
                    className="flex-1 rounded-md border border-gray-300 px-2 py-1 text-sm dark:bg-zinc-950 dark:border-zinc-800"
                    value={form.configuration.overlapPolicy.minNewPercent}
                    onChange={e => setForm(prev => ({ ...prev, configuration: { ...prev.configuration, overlapPolicy: { ...prev.configuration.overlapPolicy, minNewPercent: Number(e.target.value) } } }))}
                  />
                </div>
                <div className="flex gap-2 items-center">
                  <label className="text-xs w-32">Max Repeat Last</label>
                  <input 
                    type="number" 
                    className="flex-1 rounded-md border border-gray-300 px-2 py-1 text-sm dark:bg-zinc-950 dark:border-zinc-800"
                    value={form.configuration.overlapPolicy.maxRepeatFromLast}
                    onChange={e => setForm(prev => ({ ...prev, configuration: { ...prev.configuration, overlapPolicy: { ...prev.configuration.overlapPolicy, maxRepeatFromLast: Number(e.target.value) } } }))}
                  />
                </div>
              </div>
            </div>
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
                <th className="py-2 pr-3">Provider</th>
                <th className="py-2 pr-3">Code</th>
                <th className="py-2 pr-3">Title</th>
                <th className="py-2 pr-3">Version</th>
                <th className="py-2 pr-3">Status</th>
                <th className="py-2 pr-3">Time</th>
                <th className="py-2 pr-3">Pass%</th>
                <th className="py-2 pr-3">Bank</th>
                <th className="py-2 pr-3">Mock Qs</th>
                <th className="py-2 pr-3">Price</th>
                <th className="py-2 pr-3">Purchasable</th>
                <th className="py-2 pr-3">Sort</th>
                <th className="py-2 pr-3 w-32">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td className="py-4" colSpan={13}>Loading...</td></tr>
              ) : items.length === 0 ? (
                <tr><td className="py-4" colSpan={13}>No exams yet.</td></tr>
              ) : items.map(ex => (
                <tr key={ex.id} className="border-t border-gray-100 dark:border-zinc-800 hover:bg-gray-50/50 dark:hover:bg-zinc-900/40">
                  <td className="py-2 pr-3">{providers.find(p => p.id === ex.providerId)?.name ?? ex.providerId}</td>
                  <td className="py-2 pr-3">{ex.code}</td>
                  <td className="py-2 pr-3">{ex.title}</td>
                  <td className="py-2 pr-3">{ex.version}</td>
                  <td className="py-2 pr-3">
                    <select
                      value={ex.status}
                      onChange={e => onUpdate(ex.id, { status: e.target.value as any })}
                      className="rounded-md border border-gray-300 px-2 py-1 text-sm dark:bg-zinc-950 dark:border-zinc-800"
                    >
                      <option value="draft">Draft</option>
                      <option value="active">Active</option>
                      <option value="archived">Archived</option>
                    </select>
                  </td>
                  <td className="py-2 pr-3">{ex.timeLimitMinutes}m</td>
                  <td className="py-2 pr-3">{ex.passingScorePercent}%</td>
                  <td className="py-2 pr-3">{ex.totalQuestionsInBank}</td>
                  <td className="py-2 pr-3">{ex.questionsPerMockTest}</td>
                  <td className="py-2 pr-3">{ex.price ?? '—'}</td>
                  <td className="py-2 pr-3">
                    <div className="relative group">
                      <button
                        onClick={() => onUpdate(ex.id, { purchasable: !ex.purchasable })}
                        className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
                          ex.purchasable
                            ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                            : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400 cursor-not-allowed'
                        }`}
                      >
                        {ex.purchasable ? '✓ Yes' : '✗ No'}
                      </button>
                      {!ex.purchasable && (
                        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                          Coming Soon
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="py-2 pr-3">
                    <input
                      type="number"
                      value={ex.sortOrder ?? ''}
                      onChange={e => onUpdate(ex.id, { sortOrder: e.target.value ? Number(e.target.value) : undefined })}
                      className="rounded-md border border-gray-300 px-2 py-1 text-sm w-16 dark:bg-zinc-950 dark:border-zinc-800"
                      placeholder="—"
                    />
                  </td>
                  <td className="py-2 pr-3">
                    <div className="flex gap-2">
                      <button
                        className="rounded-md border px-3 py-1 hover:bg-gray-50 dark:border-zinc-800 dark:hover:bg-zinc-900"
                        onClick={() => {
                          setEditingId(ex.id)
                          setForm({
                            providerId: ex.providerId,
                            code: ex.code,
                            title: ex.title,
                            version: ex.version,
                            status: ex.status,
                            timeLimitMinutes: ex.timeLimitMinutes,
                            passingScorePercent: ex.passingScorePercent,
                            totalQuestionsInBank: ex.totalQuestionsInBank,
                            questionsPerMockTest: ex.questionsPerMockTest,
                            price: ex.price ?? '',
                            purchasable: ex.purchasable ?? false,
                            sortOrder: ex.sortOrder ?? '',
                            imageUrl: ex.imageUrl ?? '',
                            configuration: {
                              topicDistribution: ex.configuration?.topicDistribution ?? {},
                              typeDistribution: ex.configuration?.typeDistribution ?? {},
                              overlapPolicy: {
                                minNewPercent: ex.configuration?.overlapPolicy?.minNewPercent ?? 0,
                                maxRepeatFromLast: ex.configuration?.overlapPolicy?.maxRepeatFromLast ?? 0
                              }
                            }
                          })
                          setTab('form')
                        }}
                      >
                        Edit
                      </button>
                      <button
                        className="rounded-md border px-3 py-1 hover:bg-red-50 text-red-600 border-red-200 dark:border-red-900/40 dark:hover:bg-red-900/10"
                        onClick={() => onDelete(ex.id)}
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


