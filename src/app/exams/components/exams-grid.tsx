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
      if (session?.user) {
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
          return (
            <ExamTile 
               key={exam.id}
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
