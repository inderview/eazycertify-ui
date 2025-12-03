const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001/api'

export interface ContactFormData {
  name: string
  email: string
  subject: string
  reason: 'bug' | 'suggestion' | 'feature_request' | 'support' | 'billing' | 'partnership' | 'other'
  reasonOther?: string
  message: string
  pageUrl?: string
}

export async function submitContact(data: ContactFormData): Promise<{ id: string }> {
  const response = await fetch(`${API_BASE}/contact`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Failed to send message' }))
    throw new Error(error.message || 'Failed to send message')
  }

  return response.json()
}
