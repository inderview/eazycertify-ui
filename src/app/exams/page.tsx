import { Suspense } from 'react'
import ExamTile from '@/components/exam-tile'
import { ProviderFilter } from './components/provider-filter'
import { SearchAndSort } from './components/search-and-sort'
import { ExamsGrid } from './components/exams-grid'
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
          <div className="max-w-7xl mx-auto px-4">
             <ProviderFilter providers={providers} />
             <SearchAndSort />
          </div>
       </div>

       {/* Results */}
       <div className="max-w-7xl mx-auto px-4 py-8 pb-20">
          <div className="flex justify-between items-center mb-6">
             <h1 className="text-2xl font-bold text-slate-800">All Exams</h1>
             <span className="text-slate-500 text-sm">{exams.length} exams found</span>
          </div>
          
          <ExamsGrid exams={exams} />
       </div>

       <Footer />
    </div>
  )
}
