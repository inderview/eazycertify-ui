'use client'

import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import Image from 'next/image'

interface Provider {
  id: number
  name: string
  logoUrl: string
  examCount: number
}

export function ProviderFilter({ providers }: { providers: Provider[] }) {
  const searchParams = useSearchParams()
  const currentProviderId = searchParams.get('providerId')

  const totalExams = providers.reduce((acc, p) => acc + p.examCount, 0)

  // Helper to get provider specific styling
  const getProviderStyle = (name: string) => {
    if (name.includes('Azure')) return { icon: '🔷', color: 'text-blue-500' }
    if (name.includes('AWS')) return { icon: '🟠', color: 'text-orange-500' }
    if (name.includes('Google')) return { icon: '🔴', color: 'text-red-500' }
    if (name.includes('Cisco')) return { icon: '🔵', color: 'text-blue-600' }
    if (name.includes('CompTIA')) return { icon: '🔶', color: 'text-orange-600' }
    return { icon: '📦', color: 'text-slate-500' }
  }

  return (
    <div className="flex flex-wrap gap-3 items-center mb-8 overflow-x-auto pb-2 scrollbar-hide">
      <Link
        href="/exams"
        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all whitespace-nowrap ${
          !currentProviderId
            ? 'bg-blue-600 text-white shadow-lg shadow-blue-200'
            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
        }`}
      >
        <span>🌐</span>
        <span>All Providers</span>
        <span className={`px-2 py-0.5 rounded-full text-xs ${
          !currentProviderId ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-500'
        }`}>
          {totalExams}
        </span>
      </Link>

      {providers.map((provider) => {
        const style = getProviderStyle(provider.name)
        const isActive = currentProviderId === String(provider.id)
        
        return (
          <Link
            key={provider.id}
            href={`/exams?providerId=${provider.id}`}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all whitespace-nowrap ${
              isActive
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-200'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
             <span>{style.icon}</span>
             <span>{provider.name}</span>
             <span className={`px-2 py-0.5 rounded-full text-xs ${
               isActive ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-500'
             }`}>
               {provider.examCount}
             </span>
          </Link>
        )
      })}
    </div>
  )
}
