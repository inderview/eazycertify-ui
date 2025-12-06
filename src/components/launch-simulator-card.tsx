'use client'

import { createSupabaseBrowserClient } from '@/lib/supabase/client'

interface LaunchSimulatorCardProps {
  examId: number
}

export function LaunchSimulatorCard({ examId }: LaunchSimulatorCardProps) {
  const supabase = createSupabaseBrowserClient()

  const handleLaunchSimulator = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session?.user) {
        alert('Please sign in to take the exam')
        return
      }

      const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:3001/api'
      const { getDeviceFingerprint } = await import('@/lib/device-fingerprint')
      const fingerprint = getDeviceFingerprint()

      // Create new attempt
      const res = await fetch(`${API_BASE}/attempts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: session.user.id,
          examId,
          deviceFingerprint: fingerprint,
          ipAddress: '', // Can be filled from server side if needed
          userAgent: navigator.userAgent,
        }),
      })

      if (!res.ok) {
        const error = await res.text()
        throw new Error(error || 'Failed to create exam attempt')
      }

      const attempt = await res.json()
      window.location.href = `/simulator?attemptId=${attempt.id}`
    } catch (e: any) {
      alert(e.message || 'Failed to launch simulator')
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 w-full md:w-[320px]">
      <div className="space-y-3">
        <div>
          <h3 className="text-base font-bold text-slate-900">Ready to take the full exam?</h3>
          <p className="text-xs text-slate-500 mt-1">Experience the real exam simulator with timed questions and instant results.</p>
        </div>
        <button
          onClick={handleLaunchSimulator}
          className="w-full px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold text-sm rounded-lg hover:shadow-md transition-all transform hover:scale-[1.02] flex items-center justify-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Launch Simulator
        </button>
      </div>
    </div>
  )
}
