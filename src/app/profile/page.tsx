'use client'

import { useEffect, useState } from 'react'
import { createSupabaseBrowserClient } from '@/lib/supabase/client'
import { User } from '@supabase/supabase-js'
import Link from 'next/link'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'

interface Purchase {
  id: number
  examId: number
  examCode: string
  examTitle: string
  expiresAt: string
  createdAt: string
  amount: number
  status: 'Active' | 'Inactive'
}

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null)
  const [purchases, setPurchases] = useState<Purchase[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createSupabaseBrowserClient()

  useEffect(() => {
    const fetchData = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      
      if (session?.user) {
        setUser(session.user)
        
        // Fetch purchases
        try {
          const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/purchases/my-purchases?userId=${session.user.id}`)
          if (res.ok) {
            const data = await res.json()
            setPurchases(data)
          }
        } catch (error) {
          console.error('Error fetching purchases:', error)
        }
      }
      
      setLoading(false)
    }

    fetchData()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
        <Footer />
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-slate-800 mb-4">Please Sign In</h2>
            <p className="text-slate-600 mb-6">You need to be logged in to view your profile.</p>
            <Link href="/login" className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
              Sign In
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  const displayName = user.user_metadata?.full_name || user.user_metadata?.name || user.email?.split('@')[0] || 'User'
  const lastLogin = new Date(user.last_sign_in_at || Date.now()).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    hour12: true
  })

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8 max-w-5xl">
        
        {/* User Profile Section */}
        <div className="border border-[#007bff] rounded mb-8 overflow-hidden">
          <div className="bg-[#007bff] text-white px-4 py-3 flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <h2 className="font-bold text-lg">{displayName} - User Profile</h2>
          </div>
          <div className="p-6 bg-white">
            <div className="space-y-2 text-sm text-slate-700">
              <div className="flex">
                <span className="font-semibold w-24 text-slate-500">Username:</span>
                <span className="font-bold text-slate-800">{displayName}</span>
              </div>
              <div className="flex">
                <span className="font-semibold w-24 text-slate-500">E-mail:</span>
                <span className="text-slate-800">{user.email}</span>
              </div>
              <div className="flex">
                <span className="font-semibold w-24 text-slate-500">Last login:</span>
                <span className="text-slate-800">{lastLogin}</span>
              </div>
              <div className="flex">
                <span className="font-semibold w-24 text-slate-500">Comments #:</span>
                <span className="text-slate-800">0</span>
              </div>
            </div>
          </div>
        </div>

        {/* Subscriptions Section */}
        <div className="border border-[#28a745] rounded overflow-hidden">
          <div className="bg-[#28a745] text-white px-4 py-3">
            <h2 className="font-bold text-lg">My Subscriptions</h2>
          </div>
          <div className="p-6 bg-white">
            {purchases.length > 0 ? (
              <div className="space-y-3">
                {purchases.map((purchase) => (
                  <div key={purchase.id} className="flex flex-wrap items-center gap-2 text-sm text-slate-700 border-b border-slate-100 pb-2 last:border-0 last:pb-0">
                    <span className="text-slate-600">Order Number: {purchase.id}.</span>
                    <Link href={`/exams/${purchase.examCode}`} className="text-[#007bff] hover:underline font-medium">
                      {purchase.examTitle}
                    </Link>
                    <span>- Premium Access</span>
                    <span className="text-slate-600">
                      (Expires {new Date(purchase.expiresAt).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })})
                    </span>
                    <span className={`px-2 py-0.5 rounded text-xs font-bold text-white ${
                      purchase.status === 'Active' ? 'bg-[#28a745]' : 'bg-[#ffc107] text-slate-900'
                    }`}>
                      {purchase.status}
                    </span>
                    <button className="text-[#007bff] hover:underline ml-1">
                      Receipt
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-slate-500 text-sm">No active subscriptions found.</p>
            )}
          </div>
        </div>

      </main>
      <Footer />
    </div>
  )
}
