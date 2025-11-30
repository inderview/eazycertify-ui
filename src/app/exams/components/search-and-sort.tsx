'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useState, useRef, useEffect } from 'react'

export function SearchAndSort() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [search, setSearch] = useState(searchParams.get('search') || '')
  const [suggestions, setSuggestions] = useState<any[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [isSortOpen, setIsSortOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  
  const currentSort = searchParams.get('sort') || 'recent'
  
  const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:3001/api'
  
  const sortOptions = [
    { value: 'recent', label: 'Recently Updated' },
    { value: 'popular', label: 'Most Popular' },
    { value: 'beginner', label: 'Beginner Friendly' },
    { value: 'advanced', label: 'Advanced Level' },
  ]

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowSuggestions(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Debounce fetch suggestions
  const fetchSuggestions = async (query: string) => {
    if (!query || query.length < 2) {
      setSuggestions([])
      return
    }
    
    try {
      const res = await fetch(`${API_BASE}/exams?search=${encodeURIComponent(query)}`)
      if (res.ok) {
        const data = await res.json()
        setSuggestions(data.slice(0, 5)) // Limit to 5 suggestions
        setShowSuggestions(true)
      }
    } catch (error) {
      console.error('Error fetching suggestions:', error)
    }
  }

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    setSearch(val)
    
    // Simple debounce
    const timeoutId = setTimeout(() => fetchSuggestions(val), 300)
    return () => clearTimeout(timeoutId)
  }

  const handleSearch = (term?: string) => {
    const query = term || search
    const params = new URLSearchParams(searchParams.toString())
    if (query) {
      params.set('search', query)
    } else {
      params.delete('search')
    }
    router.push(`/exams?${params.toString()}`)
    setShowSuggestions(false)
    setSearch(query)
  }

  const handleSort = (sort: string) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('sort', sort)
    router.push(`/exams?${params.toString()}`)
    setIsSortOpen(false)
  }

  return (
    <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8 relative z-20">
      {/* Search Bar */}
      <div className="flex w-full md:w-auto gap-3 relative flex-1 max-w-2xl" ref={dropdownRef}>
        <div className="relative w-full group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-slate-400 group-focus-within:text-slate-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
            </div>
            <input 
              type="text" 
              value={search}
              onChange={handleSearchChange}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              onFocus={() => search.length >= 2 && setShowSuggestions(true)}
              placeholder="Search exams (e.g. AZ-900, AWS)..."
              className="w-full pl-11 pr-32 py-3 bg-white border border-slate-200 rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-200 focus:border-slate-400 transition-all text-slate-700 placeholder:text-slate-400"
            />
            <div className="absolute inset-y-1 right-1">
                <button 
                  onClick={() => handleSearch()}
                  className="h-full px-6 bg-slate-900 text-white font-semibold rounded-xl hover:shadow-md hover:bg-slate-800 transition-all text-sm"
                >
                  Search
                </button>
            </div>
            
            {/* Suggestions Dropdown */}
            {showSuggestions && suggestions.length > 0 && (
                <div className="absolute top-full left-0 w-full mt-2 bg-white border border-slate-100 rounded-2xl shadow-xl overflow-hidden z-50">
                    <div className="px-4 py-2 bg-slate-50 border-b border-slate-100 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                        Suggestions
                    </div>
                    {suggestions.map((exam) => (
                        <button
                            key={exam.id}
                            onClick={() => handleSearch(exam.code)}
                            className="w-full text-left px-4 py-3 hover:bg-slate-50 border-b border-slate-50 last:border-0 flex justify-between items-center group transition-colors"
                        >
                            <div className="flex items-center gap-3">
                                {exam.imageUrl ? (
                                    <div className="h-8 w-8 relative rounded-lg overflow-hidden bg-white border border-slate-100">
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img 
                                            src={exam.imageUrl} 
                                            alt={exam.code} 
                                            className="object-contain w-full h-full p-1"
                                        />
                                    </div>
                                ) : (
                                    <div className="h-8 w-8 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center text-xs font-bold border border-slate-200">
                                        {exam.code.split('-')[0]}
                                    </div>
                                )}
                                <div>
                                    <div className="font-semibold text-slate-800 group-hover:text-slate-900">{exam.code}</div>
                                    <div className="text-xs text-slate-500 truncate max-w-[200px]">{exam.title}</div>
                                </div>
                            </div>
                            <span className="text-xs font-medium text-slate-400 group-hover:text-slate-600">
                                {exam.providerName}
                            </span>
                        </button>
                    ))}
                </div>
            )}
        </div>
      </div>

      {/* Sort Dropdown */}
      <div className="relative min-w-[180px]">
         <button 
            onClick={() => setIsSortOpen(!isSortOpen)}
            className="w-full flex items-center justify-between gap-2 px-4 py-3 bg-white border border-slate-200 rounded-2xl text-slate-600 font-medium hover:border-slate-400 hover:text-slate-900 transition-all shadow-sm"
         >
            <span className="text-sm">
                <span className="text-slate-400 mr-2">Sort by:</span>
                {sortOptions.find(o => o.value === currentSort)?.label}
            </span>
            <svg className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${isSortOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
         </button>

         {isSortOpen && (
            <div className="absolute right-0 top-full mt-2 w-full bg-white shadow-xl rounded-2xl py-2 z-20 border border-slate-100 overflow-hidden animate-in fade-in zoom-in-95 duration-100">
                {sortOptions.map((option) => (
                    <button
                        key={option.value}
                        onClick={() => handleSort(option.value)}
                        className={`w-full text-left px-4 py-2.5 text-sm hover:bg-slate-50 flex items-center justify-between group ${
                            currentSort === option.value ? 'bg-slate-50 text-slate-900 font-medium' : 'text-slate-600'
                        }`}
                    >
                        {option.label}
                        {currentSort === option.value && (
                            <svg className="w-4 h-4 text-slate-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        )}
                    </button>
                ))}
            </div>
         )}
      </div>
    </div>
  )
}
