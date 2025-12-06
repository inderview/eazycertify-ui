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
          const email = session.user.email
          const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:3001/api'
          const res = await fetch(`${apiBase}/purchases/my-purchases?userId=${session.user.id}&email=${email}`)
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
      
      <main className="flex-1 container mx-auto px-4 py-8 max-w-6xl">
        <h1 className="text-3xl font-bold text-slate-800 mb-8">My Profile</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: User Profile Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 py-8 flex flex-col items-center justify-center">
                <div className="w-24 h-24 bg-white rounded-full p-1 shadow-lg">
                  <div className="w-full h-full bg-slate-50 rounded-full flex items-center justify-center text-3xl font-bold text-blue-600 uppercase">
                    {displayName.charAt(0)}
                  </div>
                </div>
              </div>
              
              <div className="px-6 py-6">
                <div className="text-center mb-6">
                  <h2 className="text-xl font-bold text-slate-900">{displayName}</h2>
                  <p className="text-sm text-slate-500">{user.email}</p>
                </div>
                
                <div className="space-y-3 pt-4 border-t border-slate-100">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Last Login</span>
                    <span className="font-medium text-slate-900">{lastLogin}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Member Since</span>
                    <span className="font-medium text-slate-900">
                      {new Date(user.created_at || Date.now()).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Subscriptions */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
                <h2 className="font-bold text-lg text-slate-800">My Subscriptions</h2>
                <span className="text-xs font-medium bg-blue-50 text-blue-700 px-2 py-1 rounded-full">
                  {purchases.length} Active
                </span>
              </div>
              
              <div className="p-6">
                {purchases.length > 0 ? (
                  <div className="grid gap-4">
                    {purchases.map((purchase) => (
                      <div key={purchase.id} className="group border border-slate-200 rounded-xl p-4 hover:border-blue-300 hover:shadow-md transition-all bg-slate-50/50">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <span className="bg-slate-900 text-white text-xs font-bold px-2 py-0.5 rounded">
                                {purchase.examCode}
                              </span>
                              <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                                purchase.status === 'Active' 
                                  ? 'bg-emerald-100 text-emerald-700' 
                                  : 'bg-amber-100 text-amber-700'
                              }`}>
                                {purchase.status}
                              </span>
                            </div>
                            <h3 className="font-bold text-slate-800 text-lg mb-1 group-hover:text-blue-600 transition-colors">
                              {purchase.examTitle}
                            </h3>
                            <div className="flex items-center gap-4 text-sm text-slate-500">
                              <span className="flex items-center gap-1">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                Expires {new Date(purchase.expiresAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                              </span>
                              <span className="flex items-center gap-1">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                Premium Access
                              </span>
                            </div>
                          </div>
                          
                          {purchase.status === 'Active' && (
                            <Link 
                              href={`/exams/${purchase.examCode}`}
                              className="shrink-0 bg-blue-600 text-white px-5 py-2.5 rounded-lg font-semibold text-sm hover:bg-blue-700 transition-colors shadow-sm hover:shadow flex items-center justify-center gap-2"
                            >
                              <span>Start Practicing</span>
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                              </svg>
                            </Link>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-medium text-slate-900 mb-1">No Active Subscriptions</h3>
                    <p className="text-slate-500 mb-6">You haven't purchased any exam packages yet.</p>
                    <Link href="/" className="text-blue-600 font-medium hover:underline">
                      Browse Exams
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
