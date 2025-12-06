'use client'

import { useState } from 'react'
import { QuestionCard } from './question-card'

interface Option {
  id: number
  text: string
  is_correct: boolean
  option_order?: number
}

interface Question {
  id: number
  text: string
  explanation?: string
  topic?: string
  type: string
  question_option: Option[]
}

interface MultipleChoiceQuestionProps {
  question: Question
  index: number
  isMarked?: boolean
  onToggleMark?: () => void
}

export function MultipleChoiceQuestion({ question, index, readOnly, isMarked, onToggleMark, globalExpanded = true, globalRevealed = false }: MultipleChoiceQuestionProps & { readOnly?: boolean, globalExpanded?: boolean, globalRevealed?: boolean }) {
  const [revealed, setRevealed] = useState(false)
  const [selectedOptions, setSelectedOptions] = useState<number[]>([])

  const isMulti = question.type === 'multi'
  const isRevealed = globalRevealed || revealed

  const handleOptionClick = (optionId: number) => {
    if (isRevealed || readOnly) return

    if (isMulti) {
      setSelectedOptions(prev => 
        prev.includes(optionId) 
          ? prev.filter(id => id !== optionId)
          : [...prev, optionId]
      )
    } else {
      setSelectedOptions([optionId])
    }
  }

  const isSelected = (id: number) => selectedOptions.includes(id)

  return (
    <QuestionCard index={index} topic={question.topic} isMarked={isMarked} onToggleMark={onToggleMark} collapsed={!globalExpanded}>
      <div 
        className="prose prose-slate max-w-none mb-8 text-slate-800 font-medium whitespace-pre-wrap"
        dangerouslySetInnerHTML={{ __html: question.text }}
      />

      <div className="space-y-3 mb-8">
        {question.question_option.map((option) => {
          const selected = isSelected(option.id)
          const correct = option.is_correct
          
          let containerClass = `bg-white border-slate-200 ${readOnly ? 'cursor-default' : 'hover:border-blue-300 hover:bg-slate-50 cursor-pointer'}`
          let indicatorClass = "border-slate-300 bg-white"
          let indicatorContent = null

          if (isRevealed) {
            if (correct) {
               // Correct answer (whether selected or not)
               containerClass = "bg-emerald-50 border-emerald-200"
               indicatorClass = "border-emerald-500 bg-emerald-500 text-white"
               indicatorContent = (
                 <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                 </svg>
               )
            } else if (selected) {
               // Wrong answer selected
               containerClass = "bg-red-50 border-red-200"
               indicatorClass = "border-red-500 bg-red-500 text-white"
               indicatorContent = (
                 <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                 </svg>
               )
            }
          } else if (selected) {
             // Selected but not revealed
             containerClass = "bg-blue-50 border-blue-300 shadow-sm"
             indicatorClass = "border-blue-500 bg-blue-500 text-white"
             if (isMulti) {
               indicatorContent = (
                 <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                 </svg>
               )
             } else {
               indicatorContent = <div className="w-2 h-2 bg-white rounded-full" />
             }
          }

          return (
            <div 
              key={option.id}
              onClick={() => handleOptionClick(option.id)}
              className={`
                relative flex items-center gap-3 p-4 rounded-xl border transition-all select-none
                ${containerClass}
              `}
            >
              {/* Input Control (Radio/Checkbox) visual representation */}
              <div className={`
                w-5 h-5 flex items-center justify-center flex-shrink-0 transition-colors
                ${isMulti ? 'rounded-md' : 'rounded-full'}
                ${indicatorClass}
                border
              `}>
                {indicatorContent}
              </div>
              
              <span className={`text-sm flex-1 ${isRevealed && correct ? 'text-emerald-900 font-medium' : (isRevealed && selected && !correct ? 'text-red-900 font-medium' : 'text-slate-700')}`}>
                {option.text}
              </span>

              {/* Right side status icon for revealed state */}
              {isRevealed && (
                <div className="flex-shrink-0 ml-2">
                  {correct && (
                    <span className="flex items-center justify-center w-6 h-6 bg-emerald-100 text-emerald-600 rounded-full" title="Correct Answer">
                       <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                       </svg>
                    </span>
                  )}
                  {selected && !correct && (
                    <span className="flex items-center justify-center w-6 h-6 bg-red-100 text-red-600 rounded-full" title="Incorrect Selection">
                       <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                       </svg>
                    </span>
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>

      <div className="flex items-center gap-4">
        <button
          onClick={() => setRevealed(!revealed)}
          className="bg-[#0078D4] text-white px-6 py-2.5 rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors"
        >
          {isRevealed ? 'Hide Solution' : 'Reveal Solution'}
        </button>
      </div>

      {isRevealed && question.explanation && (
        <div className="mt-6 p-5 bg-slate-50 rounded-xl border border-slate-200 text-sm text-slate-600">
          <h4 className="font-semibold text-slate-800 mb-2">Explanation:</h4>
          <div className="whitespace-pre-wrap" dangerouslySetInnerHTML={{ __html: question.explanation }} />
        </div>
      )}
    </QuestionCard>
  )
}
