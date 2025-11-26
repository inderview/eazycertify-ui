'use client'

import { useEffect, useMemo, useState } from 'react'
import { Tabs } from '@/components/admin/Tabs'
import { Card } from '@/components/admin/Card'

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:3001/api'

type Provider = { id: number, name: string }
type Exam = {
  id: number, providerId: number, code: string, title: string
}
type Question = {
  id: number
  examId: number
  type: 'single' | 'multi' | 'ordering' | 'yesno'
  text: string
  topic?: string
  difficulty: 'easy' | 'medium' | 'hard'
  status: 'draft' | 'published'
  flagged: boolean
}
type Block = { id: number, title: string }

export default function QuestionsPage () {
  const [tab, setTab] = useState<'grid' | 'form' | 'blocks'>('grid')
  const [editingId, setEditingId] = useState<number | null>(null)
  const [preview, setPreview] = useState<{ open: boolean, data: any | null }>({ open: false, data: null })
  const [providers, setProviders] = useState<Provider[]>([])
  const [exams, setExams] = useState<Exam[]>([])
  const [blocks, setBlocks] = useState<Block[]>([])
  const [items, setItems] = useState<Question[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Filters
  const [filter, setFilter] = useState({ examId: 0, difficulty: '', status: '', flagged: '', topic: '' })

  // Form
  const [form, setForm] = useState({
    examId: 0,
    type: 'single' as 'single' | 'multi' | 'ordering' | 'yesno' | 'hotspot' | 'dragdrop',
    text: '',
    topic: '',
    difficulty: 'easy' as 'easy' | 'medium' | 'hard',
    status: 'draft' as 'draft' | 'published',
    flagged: false,
    blockId: 0,
    explanation: '',
    referenceUrl: '',
    attachments: '',
    options: [{ text: '', isCorrect: true }] as { text: string, isCorrect: boolean }[],
    groups: [] as { label: string, mode: 'single' | 'multi', options: { text: string, isCorrect: boolean }[] }[],
  })

  const token = useMemo(() => (typeof window !== 'undefined' ? localStorage.getItem('adminToken') ?? '' : ''), [])

  async function loadRefs () {
    const [provRes, examRes, blockRes] = await Promise.all([
      fetch(`${API_BASE}/admin/providers`, { headers: { Authorization: `Bearer ${token}` } }),
      fetch(`${API_BASE}/admin/exams`, { headers: { Authorization: `Bearer ${token}` } }),
      fetch(`${API_BASE}/admin/blocks`, { headers: { Authorization: `Bearer ${token}` } }),
    ])
    setProviders(await provRes.json())
    setExams(await examRes.json())
    setBlocks(await blockRes.json())
  }

  async function loadQuestions () {
    setLoading(true)
    const qs = new URLSearchParams()
    if (filter.examId) qs.set('examId', String(filter.examId))
    if (filter.difficulty) qs.set('difficulty', filter.difficulty)
    if (filter.status) qs.set('status', filter.status)
    if (filter.flagged) qs.set('flagged', filter.flagged)
    if (filter.topic) qs.set('topic', filter.topic)
    const res = await fetch(`${API_BASE}/admin/questions?${qs.toString()}`, { headers: { Authorization: `Bearer ${token}` } })
    const data = await res.json()
    setItems(data)
    setLoading(false)
  }

  useEffect(() => { (async () => { await loadRefs(); await loadQuestions() })() }, [])

  async function onCreate (e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    if (!form.examId) return setError('Select Exam')
    const payload = {
      ...form,
      examId: Number(form.examId),
      blockId: form.blockId ? Number(form.blockId) : undefined,
      options: (form.type === 'hotspot' || form.type === 'dragdrop')
        ? []
        : form.options.map((o, i) => ({
            text: o.text,
            isCorrect: form.type === 'ordering' ? true : o.isCorrect,
            optionOrder: i + 1,
          })),
      groups: (form.type === 'hotspot' || form.type === 'dragdrop') ? form.groups.map((g, gi) => ({
        label: g.label,
        mode: g.mode,
        groupOrder: gi + 1,
        options: g.options.map((o, i) => ({ ...o, optionOrder: i + 1 })),
      })) : undefined,
    }
    const res = await fetch(`${API_BASE}/admin/questions${editingId ? `/${editingId}` : ''}`, {
      method: editingId ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(payload),
    })
    if (!res.ok) {
      const text = await res.text()
      setError(text || 'Failed to create question')
      return
    }
    setForm(prev => ({ ...prev, text: '', explanation: '', referenceUrl: '', options: [{ text: '', isCorrect: true }], groups: [] }))
    setEditingId(null)
    await loadQuestions()
    setTab('grid')
  }

  async function onCreateBlock (title: string, scenario: string, images?: string) {
    const res = await fetch(`${API_BASE}/admin/blocks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ title, scenario, images }),
    })
    if (!res.ok) return
    await loadRefs()
  }

  async function onPreviewForm () {
    setPreview({ open: true, data: { question: { text: form.text, type: form.type, difficulty: form.difficulty, status: form.status }, options: form.options, groups: form.groups } })
  }

  async function onPreviewRow (id: number) {
    const res = await fetch(`${API_BASE}/admin/questions/${id}/detail`, { headers: { Authorization: `Bearer ${token}` } })
    const data = await res.json()
    setPreview({ open: true, data })
  }

  async function onEditRow (id: number) {
    const res = await fetch(`${API_BASE}/admin/questions/${id}/detail`, { headers: { Authorization: `Bearer ${token}` } })
    const data = await res.json()
    const q = data.question
    setForm({
      examId: q.examId,
      type: q.type,
      text: q.text,
      topic: q.topic ?? '',
      difficulty: q.difficulty,
      status: q.status,
      flagged: q.flagged,
      blockId: q.blockId ?? 0,
      explanation: q.explanation ?? '',
      referenceUrl: q.referenceUrl ?? '',
      attachments: q.attachments ?? '',
      options: data.options?.map((o: any) => ({ text: o.text, isCorrect: o.isCorrect })) ?? [{ text: '', isCorrect: true }],
      groups: data.groups?.map((g: any) => ({ label: g.label, mode: g.mode, options: g.options.map((o: any) => ({ text: o.text, isCorrect: o.isCorrect })) })) ?? [],
    })
    setEditingId(id)
    setTab('form')
  }

  async function onDeleteRow (id: number) {
    if (!confirm('Delete this question?')) return
    const res = await fetch(`${API_BASE}/admin/questions/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } })
    if (!res.ok) return
    await loadQuestions()
  }

  return (
    <div className="space-y-6">
      <Card title="Question Bank" description="Add and manage questions for exams.">
        <Tabs
          tabs={[{ key: 'grid', label: 'Grid' }, { key: 'form', label: 'Data Entry' }, { key: 'blocks', label: 'Blocks' }]}
          active={tab}
          onChange={(k) => setTab(k as any)}
        />
      </Card>

      {tab === 'grid' && (
        <Card>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-3 mb-4">
            <select className="rounded-md border px-3 py-2 text-sm" value={filter.examId} onChange={e => setFilter(prev => ({ ...prev, examId: Number(e.target.value) }))}>
              <option value={0}>All Exams</option>
              {exams.map(ex => <option key={ex.id} value={ex.id}>{ex.title}</option>)}
            </select>
            <select className="rounded-md border px-3 py-2 text-sm" value={filter.difficulty} onChange={e => setFilter(prev => ({ ...prev, difficulty: e.target.value }))}>
              <option value="">All Difficulty</option>
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
            <select className="rounded-md border px-3 py-2 text-sm" value={filter.status} onChange={e => setFilter(prev => ({ ...prev, status: e.target.value }))}>
              <option value="">All Status</option>
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
            <select className="rounded-md border px-3 py-2 text-sm" value={filter.flagged} onChange={e => setFilter(prev => ({ ...prev, flagged: e.target.value }))}>
              <option value="">All</option>
              <option value="true">Flagged</option>
              <option value="false">Not Flagged</option>
            </select>
            <input className="rounded-md border px-3 py-2 text-sm" placeholder="Topic" value={filter.topic} onChange={e => setFilter(prev => ({ ...prev, topic: e.target.value }))} />
          </div>
          <div className="mb-4">
            <button className="rounded-md border px-3 py-1 text-sm" onClick={loadQuestions}>Apply Filters</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-600 bg-gray-50">
                  <th className="py-2 pr-3">ID</th>
                  <th className="py-2 pr-3">Preview</th>
                  <th className="py-2 pr-3">Type</th>
                  <th className="py-2 pr-3">Difficulty</th>
                  <th className="py-2 pr-3">Status</th>
                  <th className="py-2 pr-3">Flag</th>
                  <th className="py-2 pr-3 w-40">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td className="py-4" colSpan={6}>Loading...</td></tr>
                ) : items.length === 0 ? (
                  <tr><td className="py-4" colSpan={6}>No questions.</td></tr>
                ) : items.map(q => (
                  <tr key={q.id} className="border-t hover:bg-gray-50">
                    <td className="py-2 pr-3">{q.id}</td>
                    <td className="py-2 pr-3 max-w-[520px] truncate" title={q.text.replace(/<[^>]+>/g, '')}>
                      {q.text.replace(/<[^>]+>/g, '').slice(0, 120)}
                    </td>
                    <td className="py-2 pr-3">{q.type}</td>
                    <td className="py-2 pr-3 capitalize">{q.difficulty}</td>
                    <td className="py-2 pr-3 capitalize">{q.status}</td>
                    <td className="py-2 pr-3">{q.flagged ? 'Yes' : 'No'}</td>
                    <td className="py-2 pr-3">
                      <div className="flex gap-2">
                        <button className="rounded-md border px-2 py-1" onClick={() => onPreviewRow(q.id)}>Preview</button>
                        <button className="rounded-md border px-2 py-1" onClick={() => onEditRow(q.id)}>Edit</button>
                        <button className="rounded-md border px-2 py-1 text-red-600 border-red-200" onClick={() => onDeleteRow(q.id)}>Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {tab === 'form' && (
        <Card>
          {error && <div className="mb-3 rounded border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div>}
          <div className="mb-3 flex items-center gap-2">
            <button type="button" className="rounded-md border px-3 py-1 text-sm" onClick={onPreviewForm}>Preview</button>
            {editingId && (
              <button type="button" className="rounded-md border px-3 py-1 text-sm" onClick={() => { setEditingId(null) }}>Cancel Edit</button>
            )}
          </div>
          <form onSubmit={onCreate} className="grid grid-cols-1 md:grid-cols-6 gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium">Exam</label>
              <select className="rounded-md border px-3 py-2 text-sm" value={form.examId} onChange={e => setForm(prev => ({ ...prev, examId: Number(e.target.value) }))}>
                <option value={0}>Select Exam</option>
                {exams.map(ex => <option key={ex.id} value={ex.id}>{ex.title}</option>)}
              </select>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium">Type</label>
              <select className="rounded-md border px-3 py-2 text-sm" value={form.type} onChange={e => setForm(prev => ({ ...prev, type: e.target.value as any }))}>
                <option value="single">Single Select</option>
                <option value="multi">Multi-Select</option>
                <option value="ordering">Drag-and-Drop (Ordering)</option>
                <option value="yesno">Yes/No (Multi-part)</option>
                <option value="hotspot">Hotspot (Grouped picks)</option>
                <option value="dragdrop">Drag & Drop (Matching)</option>
              </select>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium">Difficulty</label>
              <select className="rounded-md border px-3 py-2 text-sm" value={form.difficulty} onChange={e => setForm(prev => ({ ...prev, difficulty: e.target.value as any }))}>
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium">Status</label>
              <select className="rounded-md border px-3 py-2 text-sm" value={form.status} onChange={e => setForm(prev => ({ ...prev, status: e.target.value as any }))}>
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium">Topic/Domain</label>
              <input className="rounded-md border px-3 py-2 text-sm" value={form.topic} onChange={e => setForm(prev => ({ ...prev, topic: e.target.value }))} />
            </div>
            <div className="flex items-end">
              <label className="inline-flex items-center text-sm gap-2">
                <input type="checkbox" checked={form.flagged} onChange={e => setForm(prev => ({ ...prev, flagged: e.target.checked }))} />
                Flagged
              </label>
            </div>

            <div className="md:col-span-6 flex flex-col gap-1">
              <label className="text-xs font-medium">Question Text (rich)</label>
              <textarea rows={5} className="rounded-md border px-3 py-2 text-sm" value={form.text} onChange={e => setForm(prev => ({ ...prev, text: e.target.value }))} />
            </div>

            <div className="md:col-span-6 grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium">Explanation</label>
                <textarea rows={3} className="rounded-md border px-3 py-2 text-sm" value={form.explanation} onChange={e => setForm(prev => ({ ...prev, explanation: e.target.value }))} />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium">Reference URL</label>
                <input className="rounded-md border px-3 py-2 text-sm" value={form.referenceUrl} onChange={e => setForm(prev => ({ ...prev, referenceUrl: e.target.value }))} />
              </div>
            </div>

            <div className="md:col-span-6 grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium">Attachments (comma-separated URLs)</label>
                <input className="rounded-md border px-3 py-2 text-sm" value={form.attachments} onChange={e => setForm(prev => ({ ...prev, attachments: e.target.value }))} />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium">Case Study Block (optional)</label>
                <select className="rounded-md border px-3 py-2 text-sm" value={form.blockId} onChange={e => setForm(prev => ({ ...prev, blockId: Number(e.target.value) }))}>
                  <option value={0}>None</option>
                  {blocks.map(b => <option key={b.id} value={b.id}>{b.title}</option>)}
                </select>
              </div>
            </div>

            {form.type !== 'hotspot' && form.type !== 'dragdrop' ? (
              <div className="md:col-span-6">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-medium">
                    {form.type === 'ordering' ? 'Answer Options (top to bottom is the correct order)' : 'Answer Options'}
                  </label>
                  <button type="button" className="rounded-md border px-2 py-1 text-xs" onClick={() => setForm(prev => ({ ...prev, options: [...prev.options, { text: '', isCorrect: false }] }))}>Add Option</button>
                </div>
                <div className="space-y-2">
                  {form.options.map((opt, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <input className="flex-1 rounded-md border px-3 py-2 text-sm" placeholder={`Option ${idx + 1}`} value={opt.text} onChange={e => setForm(prev => {
                        const next = [...prev.options]; next[idx].text = e.target.value; return { ...prev, options: next }
                      })} />
                      {form.type !== 'ordering' && (
                        <label className="text-xs inline-flex items-center gap-1">
                          <input type="checkbox" checked={opt.isCorrect} onChange={e => setForm(prev => {
                            const next = [...prev.options]; next[idx].isCorrect = e.target.checked; return { ...prev, options: next }
                          })} />
                          Correct
                        </label>
                      )}
                      <button type="button" className="rounded-md border px-2 py-1 text-xs" onClick={() => setForm(prev => ({ ...prev, options: prev.options.filter((_, i) => i !== idx) }))}>Remove</button>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="md:col-span-6">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-medium">{form.type === 'hotspot' ? 'Groups (Hotspot)' : 'Targets (Drag & Drop)'}</label>
                  <button type="button" className="rounded-md border px-2 py-1 text-xs" onClick={() => setForm(prev => ({ ...prev, groups: [...prev.groups, { label: '', mode: 'single', options: [{ text: '', isCorrect: true }] }] }))}>Add Group</button>
                </div>
                <div className="space-y-4">
                  {form.groups.map((g, gi) => (
                    <div key={gi} className="rounded-md border p-3">
                      <div className="flex items-center gap-2 mb-2">
                        <input className="flex-1 rounded-md border px-3 py-2 text-sm" placeholder={form.type === 'hotspot' ? 'Group label' : 'Target label'} value={g.label} onChange={e => setForm(prev => {
                          const next = [...prev.groups]; next[gi].label = e.target.value; return { ...prev, groups: next }
                        })} />
                        <select className="rounded-md border px-3 py-2 text-sm" value={g.mode} onChange={e => setForm(prev => {
                          const next = [...prev.groups]; next[gi].mode = e.target.value as any; return { ...prev, groups: next }
                        })}>
                          <option value="single">Single</option>
                          <option value="multi">Multi</option>
                        </select>
                        <button type="button" className="rounded-md border px-2 py-1 text-xs" onClick={() => setForm(prev => ({ ...prev, groups: prev.groups.filter((_, i) => i !== gi) }))}>Remove Group</button>
                      </div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-medium">{form.type === 'hotspot' ? 'Options' : 'Choices for this target'}</span>
                        <button type="button" className="rounded-md border px-2 py-1 text-xs" onClick={() => setForm(prev => {
                          const next = [...prev.groups]; next[gi].options.push({ text: '', isCorrect: false }); return { ...prev, groups: next }
                        })}>Add Option</button>
                      </div>
                      <div className="space-y-2">
                        {g.options.map((opt, oi) => (
                          <div key={oi} className="flex items-center gap-2">
                            <input className="flex-1 rounded-md border px-3 py-2 text-sm" placeholder={`Option ${oi + 1}`} value={opt.text} onChange={e => setForm(prev => {
                              const next = [...prev.groups]; next[gi].options[oi].text = e.target.value; return { ...prev, groups: next }
                            })} />
                            <label className="text-xs inline-flex items-center gap-1">
                              <input type="checkbox" checked={opt.isCorrect} onChange={e => setForm(prev => {
                                const next = [...prev.groups]; next[gi].options[oi].isCorrect = e.target.checked; return { ...prev, groups: next }
                              })} />
                              Correct
                            </label>
                            <button type="button" className="rounded-md border px-2 py-1 text-xs" onClick={() => setForm(prev => {
                              const next = [...prev.groups]; next[gi].options = next[gi].options.filter((_, i) => i !== oi); return { ...prev, groups: next }
                            })}>Remove</button>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="md:col-span-6">
              <button className="rounded-md bg-blue-600 text-white text-sm px-4 py-2 hover:bg-blue-700">{editingId ? 'Update Question' : 'Create Question'}</button>
            </div>
          </form>
        </Card>
      )}

      {tab === 'blocks' && (
        <Card>
          <BlocksPanel blocks={blocks} onCreate={onCreateBlock} />
        </Card>
      )}

      <Preview open={preview.open} data={preview.data} onClose={() => setPreview({ open: false, data: null })} />
    </div>
  )
}

function BlocksPanel ({ blocks, onCreate }: { blocks: Block[], onCreate: (title: string, scenario: string, images?: string) => Promise<void> }) {
  const [title, setTitle] = useState('')
  const [scenario, setScenario] = useState('')
  const [images, setImages] = useState('')

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <h3 className="font-medium mb-2">Create Block</h3>
        <div className="flex flex-col gap-2">
          <input className="rounded-md border px-3 py-2 text-sm" placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} />
          <textarea className="rounded-md border px-3 py-2 text-sm" rows={6} placeholder="Scenario text" value={scenario} onChange={e => setScenario(e.target.value)} />
          <input className="rounded-md border px-3 py-2 text-sm" placeholder="Image URLs (comma-separated)" value={images} onChange={e => setImages(e.target.value)} />
          <div>
            <button className="rounded-md bg-blue-600 text-white text-sm px-4 py-2 hover:bg-blue-700" onClick={() => onCreate(title, scenario, images || undefined)}>Create Block</button>
          </div>
        </div>
      </div>
      <div>
        <h3 className="font-medium mb-2">Existing Blocks</h3>
        <ul className="space-y-2">
          {blocks.map(b => (
            <li key={b.id} className="rounded-md border px-3 py-2 text-sm flex items-center justify-between">
              <span>{b.title}</span>
              <span className="text-xs text-gray-500">ID: {b.id}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

function Preview ({ open, data, onClose }: { open: boolean, data: any, onClose: () => void }) {
  if (!open || !data) return null
  const q = data.question
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-[min(90vw,800px)] rounded-xl border bg-white p-6 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Preview</h3>
          <button className="rounded-md border px-2 py-1" onClick={onClose}>Close</button>
        </div>
        <div className="space-y-3">
          <div className="text-sm text-gray-600">Type: {q.type}</div>
          <div className="whitespace-pre-wrap">{q.text}</div>
          {q.type === 'single' || q.type === 'yesno' ? (
            <ul className="mt-2 space-y-1">
              {(data.options || []).map((o: any, i: number) => (
                <li key={i} className="flex items-center gap-2">
                  <input type="radio" disabled /> <span>{o.text}</span>
                </li>
              ))}
            </ul>
          ) : q.type === 'multi' ? (
            <ul className="mt-2 space-y-1">
              {(data.options || []).map((o: any, i: number) => (
                <li key={i} className="flex items-center gap-2">
                  <input type="checkbox" disabled /> <span>{o.text}</span>
                </li>
              ))}
            </ul>
          ) : q.type === 'ordering' ? (
            <ol className="list-decimal ml-6 mt-2">
              {(data.options || []).map((o: any, i: number) => (
                <li key={i}>{o.text}</li>
              ))}
            </ol>
          ) : (q.type === 'hotspot' || q.type === 'dragdrop') ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
              {(data.groups || []).map((g: any, gi: number) => (
                <div key={gi} className="rounded-md border p-3">
                  <div className="font-medium">{g.label}</div>
                  <ul className="mt-2 list-disc ml-5">
                    {g.options.map((o: any, oi: number) => (
                      <li key={oi}>{o.text}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  )
}

