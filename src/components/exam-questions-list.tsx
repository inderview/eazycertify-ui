'use client'

import { useState } from 'react'
import { MultipleChoiceQuestion } from './questions/multiple-choice-question'
import { HotspotQuestion } from './questions/hotspot-question'
import { YesNoQuestion } from './questions/yesno-question'

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

interface ExamQuestionsListProps {
  questions: Question[]
}

export default function ExamQuestionsList({ questions }: ExamQuestionsListProps) {
  const [mode, setMode] = useState<'practice' | 'view'>('practice')
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(5)
  const [pageInput, setPageInput] = useState('')

  // Calculate pagination
  const totalPages = Math.ceil(questions.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentQuestions = questions.slice(startIndex, endIndex)

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

  return (
    <div>
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

        <div className="flex items-center gap-3">
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

      {/* Questions List */}
      <div className="space-y-8">
        {currentQuestions.map((question, index) => {
          const globalIndex = startIndex + index + 1
          
          switch (question.type) {
            case 'hotspot':
              return (
                <HotspotQuestion 
                  key={question.id} 
                  question={question} 
                  index={globalIndex}
                  readOnly={readOnly}
                />
              )
            case 'dragdrop':
              return (
                <HotspotQuestion 
                  key={question.id} 
                  question={question} 
                  index={globalIndex}
                  readOnly={readOnly}
                />
              )
            case 'yesno':
              return (
                <YesNoQuestion 
                  key={question.id} 
                  question={question} 
                  index={globalIndex}
                  readOnly={readOnly}
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
                />
              )
          }
        })}
      </div>

      {/* Pagination Controls - Bottom */}
      {totalPages > 1 && (
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-white rounded-lg border border-slate-200 shadow-sm">
          <div className="text-sm text-slate-600">
            Showing {startIndex + 1} to {Math.min(endIndex, questions.length)} of {questions.length} questions
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
