import { Suspense } from 'react'
import ExamTile from '@/components/exam-tile'
import { ProviderFilter } from './components/provider-filter'
import { SearchAndSort } from './components/search-and-sort'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'

export const metadata = {
  title: 'Exams | EazyCertify',
  description: 'Browse all certification exams',
}

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:3001/api'

async function getProviders() {
  try {
    const res = await fetch(`${API_BASE}/exams/providers`, { cache: 'no-store' })
    if (!res.ok) throw new Error('Failed to fetch providers')
    return res.json()
  } catch (error) {
    console.error(error)
    return []
  }
}

async function getExams(searchParams: any) {
  try {
    const params = new URLSearchParams()
    if (searchParams.providerId) params.set('providerId', searchParams.providerId)
    if (searchParams.search) params.set('search', searchParams.search)
    if (searchParams.sort) params.set('sort', searchParams.sort)

    const res = await fetch(`${API_BASE}/exams?${params.toString()}`, { cache: 'no-store' })
    if (!res.ok) throw new Error('Failed to fetch exams')
    return res.json()
  } catch (error) {
    console.error(error)
    return []
  }
}

export default async function ExamsPage(props: { searchParams: Promise<any> }) {
  const searchParams = await props.searchParams
  const [providers, exams] = await Promise.all([
    getProviders(),
    getExams(searchParams)
  ])

  return (
    <div className="min-h-screen bg-white">
       <Header />
       
       {/* Filters Section */}
       <div className="bg-white border-b border-slate-100 sticky top-[73px] z-10 pt-4">
          <div className="container mx-auto px-4">
             <ProviderFilter providers={providers} />
             <SearchAndSort />
          </div>
       </div>

       {/* Results */}
       <div className="container mx-auto px-4 py-8 pb-20">
          <div className="flex justify-between items-center mb-6">
             <h1 className="text-2xl font-bold text-slate-800">All Exams</h1>
             <span className="text-slate-500 text-sm">{exams.length} exams found</span>
          </div>
          
          {exams.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
               {exams.map((exam: any) => (
                  <ExamTile 
                     key={exam.id}
                     code={exam.code}
                     title={exam.title}
                     providerName={exam.providerName}
                     totalQuestions={exam.totalQuestionsInBank}
                     imageUrl={exam.imageUrl}
                     hot={exam.sortOrder < 10} // Mock logic for hot
                     updatedAt={exam.updatedAt}
                  />
               ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold text-slate-800 mb-2">No exams found</h3>
              <p className="text-slate-500">Try adjusting your search or filters</p>
            </div>
          )}
       </div>

       <Footer />
    </div>
  )
}
