'use client'

import { useEffect, useState } from 'react'
import { Card } from '@/components/admin/Card'
import { RichTextEditor } from '@/components/admin/RichTextEditor'

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:3001/api'

type ContactMessage = {
  id: string
  name: string
  email: string
  subject: string
  reason: string
  reasonOther?: string
  message: string
  status: 'new' | 'in_progress' | 'resolved' | 'closed'
  createdAt: string
  reply?: string
  repliedAt?: string
}

export default function ContactRequestsPage() {
  const [items, setItems] = useState<ContactMessage[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null)
  const [replyMessage, setReplyMessage] = useState('')
  const [sendingReply, setSendingReply] = useState(false)

  async function load() {
    try {
      const token = localStorage.getItem('adminToken') ?? ''
      const res = await fetch(`${API_BASE}/contact`, { headers: { Authorization: `Bearer ${token}` } })
      if (!res.ok) throw new Error('Failed to load contact requests')
      const data = await res.json()
      setItems(data)
    } catch (e: any) {
      setError(e.message ?? 'Error loading contact requests')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  async function sendReply(e: React.FormEvent) {
    e.preventDefault()
    if (!selectedMessage) return

    setSendingReply(true)
    try {
      const token = localStorage.getItem('adminToken') ?? ''
      const res = await fetch(`${API_BASE}/contact/${selectedMessage.id}/reply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ message: replyMessage }),
      })

      if (!res.ok) {
        throw new Error('Failed to send reply')
      }

      // Refresh list and close modal
      await load()
      setSelectedMessage(null)
      setReplyMessage('')
    } catch (e: any) {
      alert(e.message || 'Error sending reply')
    } finally {
      setSendingReply(false)
    }
  }

  return (
    <div className="space-y-6">
      <Card
        title="Contact Requests"
        description="View and reply to user inquiries submitted via the Contact Us page."
        headerRight={null}
      >
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-zinc-950/40">
                <th className="py-2 px-3">Date</th>
                <th className="py-2 px-3">Name</th>
                <th className="py-2 px-3">Subject</th>
                <th className="py-2 px-3">Reason</th>
                <th className="py-2 px-3">Status</th>
                <th className="py-2 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td className="py-4 px-3" colSpan={6}>Loading...</td></tr>
              ) : items.length === 0 ? (
                <tr><td className="py-4 px-3" colSpan={6}>No contact requests found.</td></tr>
              ) : items.map(item => (
                <tr key={item.id} className="border-t border-gray-100 dark:border-zinc-800 hover:bg-gray-50/50 dark:hover:bg-zinc-900/40">
                  <td className="py-2 px-3 text-gray-500">
                    {new Date(item.createdAt).toLocaleDateString()}
                  </td>
                  <td className="py-2 px-3">
                    <div className="font-medium">{item.name}</div>
                    <div className="text-xs text-gray-500">{item.email}</div>
                  </td>
                  <td className="py-2 px-3 font-medium text-gray-900 dark:text-gray-100">
                    {item.subject}
                  </td>
                  <td className="py-2 px-3">
                    <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
                      {item.reason}
                    </span>
                  </td>
                  <td className="py-2 px-3">
                    <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${
                      item.status === 'new' 
                        ? 'bg-green-50 text-green-700 ring-green-600/20' 
                        : item.status === 'resolved'
                        ? 'bg-gray-50 text-gray-600 ring-gray-500/10'
                        : 'bg-yellow-50 text-yellow-800 ring-yellow-600/20'
                    }`}>
                      {item.status.toUpperCase()}
                    </span>
                  </td>
                  <td className="py-2 px-3 text-right">
                    <button
                      onClick={() => setSelectedMessage(item)}
                      className="text-blue-600 hover:text-blue-900 font-medium"
                    >
                      View & Reply
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* View/Reply Modal */}
      {selectedMessage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-xl bg-white p-6 shadow-2xl dark:bg-zinc-900">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold">Message Details</h3>
              <button 
                onClick={() => setSelectedMessage(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 mb-6">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="block text-gray-500">From</span>
                  <span className="font-medium">{selectedMessage.name} ({selectedMessage.email})</span>
                </div>
                <div>
                  <span className="block text-gray-500">Date</span>
                  <span className="font-medium">{new Date(selectedMessage.createdAt).toLocaleString()}</span>
                </div>
                <div>
                  <span className="block text-gray-500">Reason</span>
                  <span className="font-medium">{selectedMessage.reason} {selectedMessage.reasonOther ? `(${selectedMessage.reasonOther})` : ''}</span>
                </div>
                <div>
                  <span className="block text-gray-500">Status</span>
                  <span className="font-medium capitalize">{selectedMessage.status}</span>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg dark:bg-zinc-800">
                <h4 className="font-medium mb-2">{selectedMessage.subject}</h4>
                <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                  {selectedMessage.message}
                </p>
              </div>
            </div>

            {selectedMessage.reply && (
              <div className="border-t border-gray-200 dark:border-zinc-800 pt-6 mb-6">
                <div className="flex items-center gap-2 mb-3">
                  <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                  </svg>
                  <h4 className="font-medium text-green-600">Admin Reply</h4>
                  <span className="text-xs text-gray-500">
                    {selectedMessage.repliedAt && new Date(selectedMessage.repliedAt).toLocaleString()}
                  </span>
                </div>
                <div 
                  className="bg-green-50 p-4 rounded-lg dark:bg-green-900/20 prose prose-sm max-w-none"
                  dangerouslySetInnerHTML={{ __html: selectedMessage.reply }}
                />
              </div>
            )}

            <form onSubmit={sendReply} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Reply to User</label>
                <RichTextEditor
                  value={replyMessage}
                  onChange={setReplyMessage}
                  placeholder="Type your reply here..."
                  className="dark:bg-zinc-950 dark:border-zinc-800"
                />
              </div>

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedMessage(null)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg dark:text-gray-300 dark:hover:bg-zinc-800"
                >
                  Close
                </button>
                <button
                  type="submit"
                  disabled={sendingReply}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg disabled:opacity-50"
                >
                  {sendingReply ? 'Sending...' : 'Send Reply'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
