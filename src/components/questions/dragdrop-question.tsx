'use client'

import { useState } from 'react'
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

interface DragDropQuestionProps {
  question: Question
  index: number
  readOnly?: boolean
  isMarked?: boolean
  onToggleMark?: () => void
}

export function DragDropQuestion({ question, index, readOnly, isMarked, onToggleMark }: DragDropQuestionProps) {
  const [revealed, setRevealed] = useState(false)
  const [draggedItem, setDraggedItem] = useState<number | null>(null)
  const [assignments, setAssignments] = useState<Record<number, number>>({}) // group_id -> option_id

  // Get all draggable items (options from all groups)
  const getAllOptions = () => {
    return question.question_option?.sort((a, b) => (a.option_order || 0) - (b.option_order || 0)) || []
  }

  // Get options for a specific group
  const getGroupOptions = (groupId: number) => {
    return question.question_option?.filter(opt => opt.group_id === groupId) || []
  }

  // Get the correct option for a group
  const getCorrectOption = (groupId: number) => {
    return question.question_option?.find(opt => opt.group_id === groupId && opt.is_correct)
  }

  // Check if an option is already assigned
  const isOptionAssigned = (optionId: number) => {
    return Object.values(assignments).includes(optionId)
  }

  // Get the assigned option for a group
  const getAssignedOption = (groupId: number) => {
    const optionId = assignments[groupId]
    return optionId ? question.question_option?.find(opt => opt.id === optionId) : null
  }

  // Check if assignment is correct
  const isAssignmentCorrect = (groupId: number) => {
    const assigned = assignments[groupId]
    const correct = getCorrectOption(groupId)
    return assigned === correct?.id
  }

  const handleDragStart = (optionId: number) => {
    if (revealed || readOnly) return
    setDraggedItem(optionId)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleDrop = (groupId: number) => {
    if (revealed || readOnly || draggedItem === null) return
    
    setAssignments(prev => ({
      ...prev,
      [groupId]: draggedItem
    }))
    setDraggedItem(null)
  }

  const handleRemoveAssignment = (groupId: number) => {
    if (revealed || readOnly) return
    
    setAssignments(prev => {
      const next = { ...prev }
      delete next[groupId]
      return next
    })
  }

  const sortedGroups = question.question_group?.sort((a, b) => (a.group_order || 0) - (b.group_order || 0)) || []
  const allOptions = getAllOptions()

  return (
    <QuestionCard index={index} topic={question.topic} isMarked={isMarked} onToggleMark={onToggleMark}>
      <div 
        className="prose prose-slate max-w-none mb-8 text-slate-800 font-medium whitespace-pre-wrap"
        dangerouslySetInnerHTML={{ __html: question.text }}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Left Side - Features (Draggable Items) */}
        <div className="bg-white rounded-xl border-2 border-slate-300 p-6">
          <h4 className="font-bold text-slate-900 text-lg mb-4">Features</h4>
          <div className="space-y-3">
            {allOptions.map((option) => {
              const isAssigned = isOptionAssigned(option.id)
              const isDragging = draggedItem === option.id
              
              return (
                <div
                  key={option.id}
                  draggable={!revealed && !readOnly && !isAssigned}
                  onDragStart={() => handleDragStart(option.id)}
                  className={`
                    px-4 py-3 rounded-lg border-2 transition-all text-sm
                    ${isAssigned 
                      ? 'bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed opacity-50' 
                      : revealed || readOnly
                        ? 'bg-white border-slate-300 cursor-default'
                        : 'bg-white border-slate-300 cursor-move hover:border-blue-400 hover:bg-blue-50'
                    }
                    ${isDragging ? 'opacity-50 scale-95' : ''}
                  `}
                >
                  {option.text}
                </div>
              )
            })}
          </div>
        </div>

        {/* Right Side - Answer Area (Drop Zones) */}
        <div className="bg-white rounded-xl border-2 border-slate-300 p-6">
          <h4 className="font-bold text-slate-900 text-lg mb-4">Answer Area</h4>
          <div className="space-y-4">
            {sortedGroups.map((group) => {
              const assignedOption = getAssignedOption(group.id)
              const correctOption = getCorrectOption(group.id)
              const isCorrect = isAssignmentCorrect(group.id)
              
              return (
                <div key={group.id} className="space-y-2">
                  <div className="text-sm font-semibold text-slate-700">
                    {group.label}
                  </div>
                  
                  <div
                    onDragOver={handleDragOver}
                    onDrop={() => handleDrop(group.id)}
                    className={`
                      min-h-[60px] px-4 py-3 rounded-lg border-2 transition-all relative
                      ${assignedOption
                        ? revealed
                          ? isCorrect
                            ? 'bg-emerald-50 border-emerald-500'
                            : 'bg-red-50 border-red-500'
                          : 'bg-blue-50 border-blue-400'
                        : revealed || readOnly
                          ? 'bg-slate-50 border-slate-200'
                          : 'bg-slate-50 border-dashed border-slate-300 hover:border-blue-400 hover:bg-blue-50/30'
                      }
                    `}
                  >
                    {assignedOption ? (
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-sm flex-1">{assignedOption.text}</span>
                        
                        {/* Remove button (only when not revealed and not readOnly) */}
                        {!revealed && !readOnly && (
                          <button
                            onClick={() => handleRemoveAssignment(group.id)}
                            className="flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-full hover:bg-slate-200 transition-colors"
                            title="Remove"
                          >
                            <svg className="w-4 h-4 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        )}

                        {/* Status icons when revealed */}
                        {revealed && (
                          <div className="flex-shrink-0">
                            {isCorrect ? (
                              <div className="w-6 h-6 flex items-center justify-center bg-emerald-500 text-white rounded-full">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                </svg>
                              </div>
                            ) : (
                              <div className="w-6 h-6 flex items-center justify-center bg-red-500 text-white rounded-full">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="text-sm text-slate-400 italic">
                        {revealed || readOnly ? 'No answer' : 'Drag an item here'}
                      </div>
                    )}

                    {/* Show correct answer when revealed and wrong/empty */}
                    {revealed && (!assignedOption || !isCorrect) && correctOption && (
                      <div className="mt-2 pt-2 border-t border-slate-300 text-sm text-emerald-700 font-medium">
                        ✓ Correct answer: {correctOption.text}
                      </div>
                    )}
                  </div>
                </div>
              )
            })}

            {(!question.question_group || question.question_group.length === 0) && (
              <div className="text-sm text-slate-500 italic">
                No answer areas defined for this question.
              </div>
            )}
          </div>
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
