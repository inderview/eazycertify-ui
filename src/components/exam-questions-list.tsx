'use client'

import { useState } from 'react'
import { MultipleChoiceQuestion } from './questions/multiple-choice-question'
import { HotspotQuestion } from './questions/hotspot-question'
import { YesNoQuestion } from './questions/yesno-question'
import { DragDropQuestion } from './questions/dragdrop-question'

interface Option {
  id: number
  text: string
  is_correct: boolean
  option_order?: number
  group_id?: number
}

interface Group {
  id: number
  label: string
  mode: string
  group_order?: number
}

interface Question {
  id: number
  text: string
  explanation?: string
  topic?: string
  type: string
  question_option: Option[]
  question_group: Group[]
}

import { useEffect } from 'react'
import PricingModal from './PricingModal'
import { createSupabaseBrowserClient } from '@/lib/supabase/client'

interface ExamQuestionsListProps {
  questions: Question[]
  examId: number
  examCode: string
  examTitle: string
  hasAccess?: boolean
}

export default function ExamQuestionsList({ questions, examId, examCode, examTitle, hasAccess: initialHasAccess = false }: ExamQuestionsListProps) {
  const [hasAccess, setHasAccess] = useState(initialHasAccess)
  const [mode, setMode] = useState<'practice' | 'view'>('practice')
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(5)
  const [pageInput, setPageInput] = useState('')
  const [showPricingModal, setShowPricingModal] = useState(false)
  const [markedQuestions, setMarkedQuestions] = useState<Set<number>>(new Set())
  const [showOnlyMarked, setShowOnlyMarked] = useState(false)
  
  const [lockError, setLockError] = useState<string | null>(null)
  
  const supabase = createSupabaseBrowserClient()

  useEffect(() => {
    const checkAccess = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (session?.user) {
        try {
          // Use the API_BASE from env or default
          const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:3001/api'
          
          // Get device fingerprint
          const { getDeviceFingerprint } = await import('@/lib/device-fingerprint')
          const fingerprint = getDeviceFingerprint()
          
          const res = await fetch(`${API_BASE}/purchases/check-access?examId=${examId}&userId=${session.user.id}&deviceFingerprint=${encodeURIComponent(fingerprint)}`)
          const data = await res.json()
          
          if (res.ok) {
            if (data.hasAccess) {
              setHasAccess(true)
            }
          } else if (res.status === 403 && data.isLocked) {
             setLockError(data.error)
             setHasAccess(false)
          }
        } catch (err) {
          console.error('Error checking access:', err)
        }
      }
    }
    checkAccess()
  }, [examId])

  if (lockError) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-8 text-center max-w-2xl mx-auto my-12">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-3xl">🚫</span>
        </div>
        <h3 className="text-xl font-bold text-red-900 mb-2">Account Locked</h3>
        <p className="text-red-700 mb-6">{lockError}</p>
        <button 
          onClick={() => window.location.href = '/support'}
          className="bg-red-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-red-700 transition-colors"
        >
          Contact Support
        </button>
      </div>
    )
  }

  const toggleMarkQuestion = (questionId: number) => {
    setMarkedQuestions(prev => {
      const next = new Set(prev)
      if (next.has(questionId)) {
        next.delete(questionId)
      } else {
        next.add(questionId)
      }
      return next
    })
  }

  // Filter questions based on showOnlyMarked
  const filteredQuestions = showOnlyMarked 
    ? questions.filter(q => markedQuestions.has(q.id))
    : questions

  // Calculate pagination
  const totalPages = Math.ceil(filteredQuestions.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentQuestions = filteredQuestions.slice(startIndex, endIndex)
  
  const FREE_LIMIT = Number(process.env.NEXT_PUBLIC_FREE_QUESTION_LIMIT) || 10
  const isPaywallActive = !hasAccess && startIndex >= FREE_LIMIT

  // Reset to page 1 when itemsPerPage changes
  const handleItemsPerPageChange = (newItemsPerPage: number) => {
    setItemsPerPage(newItemsPerPage)
    setCurrentPage(1)
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    // Scroll to top of questions
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleGoToPage = () => {
    const pageNum = parseInt(pageInput)
    if (!isNaN(pageNum) && pageNum >= 1 && pageNum <= totalPages) {
      handlePageChange(pageNum)
      setPageInput('')
    }
  }

  const handlePageInputKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleGoToPage()
    }
  }

  const readOnly = mode === 'view'

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
    <div>
      {showPricingModal && (
        <PricingModal
          examId={examId}
          examCode={examCode}
          examTitle={examTitle}
          onClose={() => setShowPricingModal(false)}
        />
      )}

      {/* Launch Simulator Button */}
      <div className="mb-6 p-6 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg text-white shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-2xl font-bold mb-1">Ready to take the full exam?</h3>
            <p className="text-blue-100">Experience the real exam simulator with timed questions and instant results.</p>
          </div>
          <button
            onClick={handleLaunchSimulator}
            className="px-8 py-4 bg-white text-blue-600 font-bold rounded-xl hover:bg-blue-50 transition-all transform hover:scale-105 shadow-lg flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Launch Simulator
          </button>
        </div>
      </div>

      {/* Mode and Pagination Controls - Top */}
      <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 bg-white rounded-lg border border-slate-200 shadow-sm">
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-slate-700">Mode:</span>
          <div className="inline-flex rounded-lg border border-slate-300 p-1 bg-slate-50">
            <button
              onClick={() => setMode('practice')}
              className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${
                mode === 'practice'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Practice Mode
            </button>
            <button
              onClick={() => setMode('view')}
              className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${
                mode === 'view'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              View Mode
            </button>
          </div>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          {markedQuestions.size > 0 && (
            <button
              onClick={() => {
                setShowOnlyMarked(!showOnlyMarked)
                setCurrentPage(1) // Reset to first page when toggling
              }}
              className={`px-4 py-1.5 text-sm font-medium rounded-lg border transition-all flex items-center gap-2 ${
                showOnlyMarked
                  ? 'bg-yellow-100 border-yellow-400 text-yellow-800'
                  : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50'
              }`}
            >
              <svg className="w-4 h-4" fill={showOnlyMarked ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
              </svg>
              {showOnlyMarked ? `Showing ${markedQuestions.size} Marked` : `Review ${markedQuestions.size} Marked`}
            </button>
          )}
          <span className="text-sm font-medium text-slate-700">Questions per page:</span>
          <select
            value={itemsPerPage}
            onChange={(e) => handleItemsPerPageChange(Number(e.target.value))}
            className="px-3 py-1.5 text-sm border border-slate-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>
        </div>
      </div>

      {/* Questions List or Paywall */}
      <div className="space-y-8">
        {isPaywallActive ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center shadow-sm">
            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-4xl">🔒</span>
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-3">Premium Content</h3>
            <p className="text-slate-600 max-w-md mx-auto mb-8">
              You've reached the limit of free questions. Unlock the full exam to continue practicing with all {questions.length} questions.
            </p>
            <button
              onClick={() => setShowPricingModal(true)}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-4 rounded-xl text-lg font-bold hover:shadow-lg transition-all transform hover:-translate-y-1"
            >
              Unlock Full Access
            </button>
            <p className="mt-4 text-sm text-slate-500">
              One-time payment • Lifetime access • Money-back guarantee
            </p>
          </div>
        ) : (
          currentQuestions.map((question, index) => {
            const globalIndex = startIndex + index + 1
            
            // If we are on a mixed page (some free, some paid), block the paid ones
            if (!hasAccess && globalIndex > FREE_LIMIT) {
               return (
                 <div key={question.id} className="bg-slate-50 rounded-lg border border-slate-200 p-8 text-center">
                    <span className="text-2xl">🔒</span>
                    <p className="mt-2 text-slate-600 font-medium">Premium Question {globalIndex}</p>
                    <button onClick={() => setShowPricingModal(true)} className="mt-2 text-blue-600 hover:underline text-sm">Unlock Full Access</button>
                 </div>
               )
            }

            switch (question.type) {
              case 'hotspot':
                return (
                  <HotspotQuestion 
                    key={question.id} 
                    question={question} 
                    index={globalIndex}
                    readOnly={readOnly}
                    isMarked={markedQuestions.has(question.id)}
                    onToggleMark={() => toggleMarkQuestion(question.id)}
                  />
                )
              case 'dragdrop':
                return (
                  <DragDropQuestion 
                    key={question.id} 
                    question={question} 
                    index={globalIndex}
                    readOnly={readOnly}
                    isMarked={markedQuestions.has(question.id)}
                    onToggleMark={() => toggleMarkQuestion(question.id)}
                  />
                )
              case 'yesno':
                return (
                  <YesNoQuestion 
                    key={question.id} 
                    question={question} 
                    index={globalIndex}
                    readOnly={readOnly}
                    isMarked={markedQuestions.has(question.id)}
                    onToggleMark={() => toggleMarkQuestion(question.id)}
                  />
                )
              case 'single':
              case 'multi':
              default:
                return (
                  <MultipleChoiceQuestion 
                    key={question.id} 
                    question={question} 
                    index={globalIndex}
                    readOnly={readOnly}
                    isMarked={markedQuestions.has(question.id)}
                    onToggleMark={() => toggleMarkQuestion(question.id)}
                  />
                )
            }
          })
        )}
      </div>

      {/* Pagination Controls - Bottom */}
      {totalPages > 1 && (
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-white rounded-lg border border-slate-200 shadow-sm">
          <div className="text-sm text-slate-600">
            Showing {startIndex + 1} to {Math.min(endIndex, filteredQuestions.length)} of {filteredQuestions.length} questions
            {showOnlyMarked && <span className="ml-1 text-yellow-700 font-medium">(marked only)</span>}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-1.5 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-md hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Previous
            </button>

            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-600">Page {currentPage} of {totalPages}</span>
              <span className="text-slate-300">|</span>
              <span className="text-sm text-slate-600">Go to:</span>
              <input
                type="number"
                min="1"
                max={totalPages}
                value={pageInput}
                onChange={(e) => setPageInput(e.target.value)}
                onKeyPress={handlePageInputKeyPress}
                placeholder={currentPage.toString()}
                className="w-16 px-2 py-1 text-sm text-center border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={handleGoToPage}
                className="px-3 py-1 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
              >
                Go
              </button>
            </div>

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-3 py-1.5 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-md hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
