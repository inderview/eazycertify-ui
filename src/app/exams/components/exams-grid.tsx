'use client'

import { useEffect, useState } from 'react'
import ExamTile from '@/components/exam-tile'
import { createSupabaseBrowserClient } from '@/lib/supabase/client'

interface ExamsGridProps {
  exams: any[]
}

export function ExamsGrid({ exams }: ExamsGridProps) {
  const [purchases, setPurchases] = useState<any[]>([])
  const supabase = createSupabaseBrowserClient()

  useEffect(() => {
    const fetchPurchases = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      console.log('ExamsGrid: Session:', session?.user?.id)
      
      if (session?.user) {
        try {
          const email = session.user.email
          const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001/api'
          const url = `${API_BASE}/purchases/my-purchases?userId=${session.user.id}&email=${email}`
          console.log('ExamsGrid: Fetching purchases from:', url)
          
          const res = await fetch(url)
          if (res.ok) {
            const data = await res.json()
            console.log('ExamsGrid: Purchases loaded:', data)
            setPurchases(data)
          } else {
            console.log('ExamsGrid: Failed to fetch purchases:', res.status)
          }
        } catch (error) {
          console.error('ExamsGrid: Error fetching purchases:', error)
        }
      } else {
        console.log('ExamsGrid: No active session')
      }
    }

    fetchPurchases()
  }, [])

  if (exams.length === 0) {
    return (
        <div className="text-center py-20">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-xl font-semibold text-slate-800 mb-2">No exams found</h3>
          <p className="text-slate-500">Try adjusting your search or filters</p>
        </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
       {exams.map((exam: any) => {
          const purchase = purchases.find(p => p.examCode === exam.code)
          console.log(`ExamsGrid: Matching exam ${exam.code}`, { 
            purchase, 
            hasPurchase: !!purchase,
            expiresAt: purchase?.expiresAt,
            purchaseCodes: purchases.map(p => p.examCode)
          })
          return (
            <ExamTile 
               key={exam.id}
               examId={exam.id}
               code={exam.code}
               title={exam.title}
               providerName={exam.providerName}
               totalQuestions={exam.totalQuestionsInBank}
               imageUrl={exam.imageUrl}
               hot={exam.sortOrder < 10}
               updatedAt={exam.updatedAt}
               expiresAt={purchase?.expiresAt}
            />
          )
       })}
    </div>
  )
}
