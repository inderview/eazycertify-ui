'use client'

import { useState, useEffect } from 'react'
import { QuestionCard } from './question-card'

type Option = {
  id: number
  text: string
  is_correct: boolean
  option_order?: number
  group_id?: number
}

type Group = {
  id: number
  label: string
  mode: string
  group_order?: number
}

type Question = {
  id: number
  text: string
  explanation?: string
  topic?: string
  type: string
  question_option?: Option[]
  question_group?: Group[]
}

export function YesNoQuestion({ question, index, readOnly }: { question: Question, index: number, readOnly?: boolean }) {
  const [selections, setSelections] = useState<Record<number, number>>({}) // group_id -> option_id
  const [revealed, setRevealed] = useState(false)

  // Group options by group_id
  const getGroupOptions = (groupId: number) => {
    return question.question_option?.filter(opt => opt.group_id === groupId).sort((a, b) => (a.option_order || 0) - (b.option_order || 0)) || []
  }

  const handleSelectionChange = (groupId: number, optionId: number) => {
    if (readOnly) return
    setSelections(prev => ({
      ...prev,
      [groupId]: optionId
    }))
  }

  const sortedGroups = question.question_group?.sort((a, b) => (a.group_order || 0) - (b.group_order || 0)) || []

  return (
    <QuestionCard index={index} topic={question.topic}>
      <div 
        className="prose prose-slate max-w-none mb-8 text-slate-800 font-medium whitespace-pre-wrap"
        dangerouslySetInnerHTML={{ __html: question.text }}
      />

      <div className="mb-8 p-6 bg-white rounded-xl border-2 border-slate-300">
        <h4 className="font-bold text-slate-900 text-lg mb-6">Answer Area</h4>
        
        <div className="overflow-x-auto">
          <table className="w-full min-w-[500px]">
            <thead>
              <tr>
                <th className="text-left pb-4 font-bold text-slate-900 w-2/3">Statements</th>
                <th className="text-center pb-4 font-bold text-slate-900 w-24">Yes</th>
                <th className="text-center pb-4 font-bold text-slate-900 w-24">No</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {sortedGroups.map((group) => {
                const groupOptions = getGroupOptions(group.id)
                // Assuming options are strictly "Yes" and "No"
                const yesOption = groupOptions.find(o => o.text.toLowerCase() === 'yes')
                const noOption = groupOptions.find(o => o.text.toLowerCase() === 'no')
                const userSelection = selections[group.id]

                return (
                  <tr key={group.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-4 pr-4 text-slate-800 font-medium">
                      {group.label}
                    </td>
                    <td className="py-4 text-center align-middle">
                      {yesOption && (
                        <div className="flex justify-center">
                          <label className={`relative flex items-center justify-center w-6 h-6 rounded-full border-2 transition-all
                            ${readOnly ? 'cursor-default' : 'cursor-pointer'}
                            ${userSelection === yesOption.id ? 'border-blue-600 bg-blue-600' : 'border-slate-400 bg-white'}
                            ${revealed && yesOption.is_correct ? '!border-green-500 !bg-green-500' : ''}
                            ${revealed && userSelection === yesOption.id && !yesOption.is_correct ? '!border-red-500 !bg-red-500' : ''}
                          `}>
                            <input 
                              type="radio" 
                              name={`group-${group.id}`}
                              className="sr-only"
                              checked={userSelection === yesOption.id}
                              onChange={() => handleSelectionChange(group.id, yesOption.id)}
                            />
                            {(userSelection === yesOption.id || (revealed && yesOption.is_correct)) && (
                              <div className="w-2.5 h-2.5 bg-white rounded-full" />
                            )}
                          </label>
                        </div>
                      )}
                    </td>
                    <td className="py-4 text-center align-middle">
                      {noOption && (
                        <div className="flex justify-center">
                          <label className={`relative flex items-center justify-center w-6 h-6 rounded-full border-2 transition-all
                            ${readOnly ? 'cursor-default' : 'cursor-pointer'}
                            ${userSelection === noOption.id ? 'border-blue-600 bg-blue-600' : 'border-slate-400 bg-white'}
                            ${revealed && noOption.is_correct ? '!border-green-500 !bg-green-500' : ''}
                            ${revealed && userSelection === noOption.id && !noOption.is_correct ? '!border-red-500 !bg-red-500' : ''}
                          `}>
                            <input 
                              type="radio" 
                              name={`group-${group.id}`}
                              className="sr-only"
                              checked={userSelection === noOption.id}
                              onChange={() => handleSelectionChange(group.id, noOption.id)}
                            />
                            {(userSelection === noOption.id || (revealed && noOption.is_correct)) && (
                              <div className="w-2.5 h-2.5 bg-white rounded-full" />
                            )}
                          </label>
                        </div>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
          
          {(!question.question_group || question.question_group.length === 0) && (
            <div className="text-sm text-slate-500 italic mt-4">
              No statements defined for this question.
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
