'use client'

import { useState, useEffect, useRef } from 'react'
import { QuestionCard } from './question-card'

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
  question_group: Group[]
  question_option: Option[]
}

interface HotspotQuestionProps {
  question: Question
  index: number
  readOnly?: boolean
  isMarked?: boolean
  onToggleMark?: () => void
}

// Custom Dropdown Component
function CustomDropdown({ 
  options, 
  value, 
  onChange, 
  revealed,
  isCorrect,
  disabled
}: { 
  options: Option[]
  value: number | null
  onChange: (id: number) => void
  revealed: boolean
  isCorrect: boolean
  disabled?: boolean
}) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const selectedOption = options.find(opt => opt.id === value)

  // Sync open state with revealed state
  useEffect(() => {
    setIsOpen(revealed)
  }, [revealed])

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        // Don't close if revealed
        if (!revealed) {
          setIsOpen(false)
        }
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen, revealed])

  const handleSelect = (optionId: number) => {
    if (disabled) return
    onChange(optionId)
    // Don't close if revealed
    if (!revealed) {
      setIsOpen(false)
    }
  }

  const handleToggle = () => {
    if (disabled && !revealed) return
    // Allow toggling even when revealed
    setIsOpen(!isOpen)
  }

  return (
    <div ref={dropdownRef} className="relative">
      <button
        type="button"
        onClick={handleToggle}
        disabled={disabled && !revealed}
        className={`w-full bg-white border-2 rounded-md px-4 py-2.5 text-base text-left
          ${revealed && value 
            ? isCorrect 
              ? 'border-green-500' 
              : 'border-red-500'
            : 'border-slate-300 hover:border-slate-400'
          }
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
          disabled:opacity-60 disabled:cursor-not-allowed
          flex items-center justify-between`}
      >
        <span className={selectedOption ? 'text-slate-900' : 'text-slate-500'}>
          {selectedOption ? selectedOption.text : 'Select an option...'}
        </span>
        <svg 
          className={`w-5 h-5 text-slate-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className={`${revealed ? 'relative' : 'absolute z-10'} w-full mt-1 bg-white border-2 border-slate-300 rounded-md shadow-lg max-h-96 overflow-auto`}>
          {options.map((option) => (
            <button
              key={option.id}
              type="button"
              onClick={() => handleSelect(option.id)}
              disabled={disabled && !revealed}
              className={`w-full px-4 py-2.5 text-left text-base hover:bg-slate-50 transition-colors
                ${revealed && option.is_correct ? '!bg-green-200' : ''}
                ${value === option.id && !option.is_correct ? 'bg-blue-50' : ''}
                ${value === option.id && option.is_correct && !revealed ? 'bg-blue-50' : ''}
                border-b border-slate-200 last:border-b-0`}
            >
              {option.text}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export function HotspotQuestion({ question, index, readOnly, isMarked, onToggleMark }: HotspotQuestionProps) {
  const [selections, setSelections] = useState<Record<number, number>>({}) // group_id -> option_id
  const [revealed, setRevealed] = useState(false)

  // Group options by group_id
  const getGroupOptions = (groupId: number) => {
    return question.question_option?.filter(opt => opt.group_id === groupId).sort((a, b) => (a.option_order || 0) - (b.option_order || 0)) || []
  }

  const getCorrectOption = (groupId: number) => {
    return question.question_option?.find(opt => opt.group_id === groupId && opt.is_correct)
  }

  const handleSelectionChange = (groupId: number, optionId: number) => {
    if (readOnly) return
    setSelections(prev => ({
      ...prev,
      [groupId]: optionId
    }))
  }

  const isSelectionCorrect = (groupId: number) => {
    const selection = selections[groupId]
    const correct = getCorrectOption(groupId)
    return selection === correct?.id
  }

  const sortedGroups = question.question_group?.sort((a, b) => (a.group_order || 0) - (b.group_order || 0)) || []

  return (
    <QuestionCard index={index} topic={question.topic} isMarked={isMarked} onToggleMark={onToggleMark}>
      <div 
        className="prose prose-slate max-w-none mb-8 text-slate-800 font-medium whitespace-pre-wrap"
        dangerouslySetInnerHTML={{ __html: question.text }}
      />

      <div className="mb-8 p-6 bg-white rounded-xl border-2 border-slate-300">
        <h4 className="font-bold text-slate-900 text-lg mb-6">Answer Area</h4>
        
        <div className="space-y-5">
          {sortedGroups.map((group) => {
            const groupOptions = getGroupOptions(group.id)
            const correctOption = getCorrectOption(group.id)
            const userSelection = selections[group.id]
            const isCorrect = isSelectionCorrect(group.id)
            
            return (
              <div key={group.id} className="flex flex-col md:flex-row md:items-start gap-3">
                <div className="md:w-56 text-base font-semibold text-slate-800 md:text-right md:pt-2">
                  {group.label}
                </div>
                <div className="flex-1 max-w-md relative">
                  <CustomDropdown
                    options={groupOptions}
                    value={userSelection || null}
                    onChange={(optionId) => handleSelectionChange(group.id, optionId)}
                    revealed={revealed}
                    isCorrect={isCorrect}
                    disabled={readOnly}
                  />
                  
                  {/* Show correct answer when revealed and user got it wrong */}
                  {revealed && userSelection && !isCorrect && correctOption && (
                    <div className="mt-2 text-sm text-green-700 font-medium">
                      ✓ Correct answer: {correctOption.text}
                    </div>
                  )}
                  
                  {revealed && userSelection && isCorrect && (
                    <div className="mt-2 text-sm text-green-700 font-medium">
                      ✓ Correct!
                    </div>
                  )}
                </div>
              </div>
            )
          })}
          
          {(!question.question_group || question.question_group.length === 0) && (
            <div className="text-sm text-slate-500 italic">
              No interaction groups defined for this question.
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button
          onClick={() => setRevealed(!revealed)}
          className="bg-[#0078D4] text-white px-6 py-2.5 rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors"
        >
          {revealed ? 'Hide Solution' : 'Reveal Solution'}
        </button>
      </div>

      {revealed && question.explanation && (
        <div className="mt-6 p-5 bg-slate-50 rounded-xl border border-slate-200 text-sm text-slate-600">
          <h4 className="font-semibold text-slate-800 mb-2">Explanation:</h4>
          <div className="whitespace-pre-wrap" dangerouslySetInnerHTML={{ __html: question.explanation }} />
        </div>
      )}
    </QuestionCard>
  )
}
