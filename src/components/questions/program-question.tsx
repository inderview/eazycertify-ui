'use client'

import { useCallback, useMemo, useState } from 'react'
import type { JSX } from 'react'
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
  slotType?: 'text' | 'select'
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

interface ProgramQuestionProps {
  question: Question
  index: number
  readOnly?: boolean
  isMarked?: boolean
  onToggleMark?: () => void
  globalExpanded?: boolean
  globalRevealed?: boolean
}

export function ProgramQuestion({
  question,
  index,
  readOnly,
  isMarked,
  onToggleMark,
  globalExpanded = true,
  globalRevealed = false,
}: ProgramQuestionProps) {
  const [revealed, setRevealed] = useState(false)
  const [answers, setAnswers] = useState<Record<number, { optionId?: number, text?: string }>>({})
  const [focusedGroupId, setFocusedGroupId] = useState<number | null>(null)
  const [draggingId, setDraggingId] = useState<number | null>(null)

  const isRevealed = globalRevealed || revealed

  const sortedGroups = useMemo(
    () => question.question_group?.sort((a, b) => (a.group_order || 0) - (b.group_order || 0)) || [],
    [question.question_group]
  )

  const globalOptions = useMemo(
    () => (question.question_option || [])
      .filter(opt => !opt.group_id)
      .sort((a, b) => (a.option_order || 0) - (b.option_order || 0)),
    [question.question_option]
  )

  const optionsByGroup = useMemo(() => {
    const map: Record<number, Option[]> = {}
    sortedGroups.forEach(g => {
      const groupOpts = (question.question_option || [])
        .filter(opt => opt.group_id === g.id)
        .sort((a, b) => (a.option_order || 0) - (b.option_order || 0))
      map[g.id] = [...groupOpts, ...globalOptions]
    })
    return map
  }, [globalOptions, question.question_option, sortedGroups])

  const getCorrectOption = (groupId: number) =>
    (question.question_option || []).find(opt => opt.group_id === groupId && opt.is_correct)

  const isAssignmentCorrect = (groupId: number) => {
    const assigned = answers[groupId]?.optionId
    const correct = getCorrectOption(groupId)
    if (assigned !== undefined && correct?.id !== undefined) return assigned === correct.id
    // Text entry fallback
    const entered = answers[groupId]?.text?.trim().toLowerCase()
    const expected = correct?.text?.trim().toLowerCase()
    if (entered && expected) return entered === expected
    return false
  }

  const rawHtml = question.text ?? ''

  const normalizeCode = useCallback((html: string): string => {
    let txt = html
    txt = txt.replace(/<\/?(p|div|li|pre|code)[^>]*>/gi, '\n')
    txt = txt.replace(/<br\s*\/?>/gi, '\n')
    txt = txt.replace(/&nbsp;/gi, ' ')
    txt = txt.replace(/<[^>]+>/g, '')
    txt = txt.replace(/\r\n/g, '\n').replace(/\r/g, '\n')
    txt = txt.replace(/\n{2,}/g, '\n')
    txt = txt.replace(/^\n+/, '').replace(/\n+$/, '')
    return txt
  }, [])

  const codeText = useMemo(() => {
    if (!rawHtml) return ''
    return normalizeCode(rawHtml)
  }, [normalizeCode, rawHtml])

  const stemAndCode = useMemo(() => {
    const markerRegex = /\[(answer|code)\]/i
    const markerMatch = markerRegex.exec(rawHtml)
    if (markerMatch && markerMatch.index !== undefined) {
      const stemHtml = rawHtml.slice(0, markerMatch.index)
      const codePart = rawHtml.slice(markerMatch.index + markerMatch[0].length)
      return { stem: stemHtml, code: normalizeCode(codePart) }
    }
    const slotRegex = /\[slot\s*\d+/i
    const slotMatch = slotRegex.exec(rawHtml)
    if (slotMatch && slotMatch.index !== undefined) {
      const stemHtml = rawHtml.slice(0, slotMatch.index)
      const codePart = rawHtml.slice(slotMatch.index)
      return { stem: stemHtml, code: normalizeCode(codePart) }
    }
    return { stem: '', code: codeText }
  }, [codeText, normalizeCode, rawHtml])

  const allOptions = useMemo(
    () => (question.question_option || []).sort((a, b) => (a.option_order || 0) - (b.option_order || 0)),
    [question.question_option]
  )

  const focusOrFirstEmpty = (groupId?: number) => {
    if (groupId !== undefined) return groupId
    if (focusedGroupId !== null) return focusedGroupId
    const empty = sortedGroups.find(g => {
      const ans = answers[g.id]
      return !ans?.optionId && !ans?.text
    })
    return empty?.id ?? sortedGroups[0]?.id
  }

  const applyOptionToGroup = (opt: Option, targetGroupId?: number) => {
    const gid = focusOrFirstEmpty(targetGroupId)
    if (!gid) return
    setAnswers(prev => ({ ...prev, [gid]: { optionId: opt.id, text: opt.text } }))
  }

  const applyTextToGroup = (text: string, targetGroupId?: number) => {
    const gid = focusOrFirstEmpty(targetGroupId)
    if (!gid) return
    setAnswers(prev => ({ ...prev, [gid]: { text, optionId: undefined } }))
  }

  const handleDrop = (groupId: number, optionId: number) => {
    const opt = allOptions.find(o => o.id === optionId)
    if (!opt) return
    applyOptionToGroup(opt, groupId)
  }

  const slotHasOptions = useCallback((groupId: number) => (optionsByGroup[groupId] || []).length > 0, [optionsByGroup])

  const showValuesPanel = useMemo(() => {
    if (sortedGroups.length === 0) return allOptions.length > 0
    const allDropdowns = sortedGroups.every(g => (g.slotType ?? 'text') === 'select' && slotHasOptions(g.id))
    if (allDropdowns) return false
    return allOptions.length > 0
  }, [allOptions.length, slotHasOptions, sortedGroups])

  const renderCodeWithSlots = () => {
    const nodes: Array<JSX.Element | string> = []
    const regex = /\[slot(?:\s*(\d+))?(?::(select|dropdown|combo))?\]/gi
    let autoIndex = 0
    let lastIndex = 0
    let match: RegExpExecArray | null

    while ((match = regex.exec(stemAndCode.code)) !== null) {
      const slotNumber = match[1] ? Number(match[1]) : (++autoIndex)
      const slotType = (match[2]?.toLowerCase() ?? 'text') as 'text' | 'select'
      const textBefore = stemAndCode.code.slice(lastIndex, match.index)
      if (textBefore) nodes.push(textBefore)

      const group = sortedGroups[slotNumber - 1]
      if (group) {
        const hasOptions = slotHasOptions(group.id)
        const selected = answers[group.id]
        const correct = getCorrectOption(group.id)
        const isCorrect = isAssignmentCorrect(group.id)

        const baseClass = 'inline-flex items-center align-middle mr-2 ml-1 font-mono text-[12px] h-8 border rounded px-2 py-1 bg-white'
        const stateClass = isRevealed
          ? (isCorrect
            ? 'border-emerald-600 bg-emerald-50 font-semibold text-emerald-700'
            : 'border-red-500 bg-red-50 font-semibold text-red-700')
          : 'border-slate-400 hover:border-blue-500 bg-white'

        const statusIcon = isRevealed ? (
          <span
            className={`ml-2 inline-flex items-center justify-center w-5 h-5 rounded-full text-[11px] font-bold ${
              isCorrect ? 'bg-emerald-600 text-white' : 'bg-red-500 text-white'
            }`}
          >
            {isCorrect ? '✓' : '✕'}
          </span>
        ) : null

        const shouldSelect = (group.slotType ?? 'text') === 'select' || slotType === 'select'

        if (shouldSelect && hasOptions) {
          nodes.push(
            <span key={`slot-${group.id}`} className="inline-flex items-center">
              <select
                value={selected?.optionId ?? ''}
                disabled={isRevealed || readOnly}
                onFocus={() => setFocusedGroupId(group.id)}
                onChange={e => {
                  const val = Number(e.target.value)
                  if (Number.isNaN(val)) return
                  const opt = allOptions.find(o => o.id === val)
                  if (!opt) return
                  applyOptionToGroup(opt, group.id)
                }}
                className={`${baseClass} min-w-[180px] ${stateClass}`}
              >
                <option value="">{isRevealed ? 'Not selected' : 'Select option'}</option>
                {(optionsByGroup[group.id] || []).map(opt => (
                  <option key={opt.id} value={opt.id}>
                    {opt.text}
                  </option>
                ))}
              </select>
              {statusIcon}
              {isRevealed && !isCorrect && correct ? (
                <span className="ml-2 text-[11px] text-emerald-700 font-semibold">Correct: {correct.text}</span>
              ) : null}
            </span>
          )
        } else {
          nodes.push(
            <span
              key={`slot-${group.id}`}
              className="inline-flex items-center"
              onDragOver={e => e.preventDefault()}
              onDrop={e => {
                const data = e.dataTransfer.getData('text/plain')
                const id = Number(data)
                if (!Number.isNaN(id)) handleDrop(group.id, id)
              }}
            >
              <input
                value={selected?.text ?? ''}
                disabled={isRevealed || readOnly}
                onFocus={() => setFocusedGroupId(group.id)}
                onChange={e => applyTextToGroup(e.target.value, group.id)}
                className={`${baseClass} min-w-[180px] ${stateClass}`}
                placeholder={isRevealed ? 'Not answered' : 'Type or drop value'}
              />
              {statusIcon}
              {isRevealed && !isCorrect && correct ? (
                <span className="ml-2 text-[11px] text-emerald-700 font-semibold">Correct: {correct.text}</span>
              ) : null}
            </span>
          )
        }
      } else {
        nodes.push('[slot]')
      }
      lastIndex = regex.lastIndex
    }

    const remaining = stemAndCode.code.slice(lastIndex)
    if (remaining) nodes.push(remaining)

    return nodes
  }

  return (
    <QuestionCard index={index} topic={question.topic} isMarked={isMarked} onToggleMark={onToggleMark} collapsed={!globalExpanded}>
      {stemAndCode.stem ? (
        <div
          className="mb-4 text-[13px] text-slate-800 leading-5 prose prose-sm max-w-none"
          dangerouslySetInnerHTML={{ __html: stemAndCode.stem }}
        />
      ) : null}

      <div className="mb-4">
        <div className={`flex flex-col ${showValuesPanel ? 'lg:flex-row gap-4' : ''}`}>
          {showValuesPanel && (
            <div className="min-w-[220px] max-w-[260px] flex-1 bg-white border border-slate-300 rounded p-2">
              <div className="font-semibold text-xs text-slate-800 mb-2">Values</div>
              <div className="space-y-1">
                {allOptions.map(opt => (
                  <div
                    key={opt.id}
                    draggable={!isRevealed && !readOnly}
                    onDragStart={e => {
                      if (isRevealed || readOnly) return
                      setDraggingId(opt.id)
                      e.dataTransfer.setData('text/plain', String(opt.id))
                    }}
                    onDragEnd={() => setDraggingId(null)}
                    onClick={() => !isRevealed && !readOnly && applyOptionToGroup(opt)}
                    className={`
                      px-2 py-1 border rounded text-[12px] font-mono cursor-pointer h-8 flex items-center
                      ${draggingId === opt.id ? 'bg-blue-50 border-blue-400' : 'bg-slate-50 border-slate-300 hover:border-blue-400'}
                    `}
                  >
                    {opt.text}
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex-1">
            <div className="mb-2 text-sm font-semibold text-slate-700">Answer Area</div>
            <div className="overflow-auto">
              <pre
                className="inline-block whitespace-pre font-mono text-[13px] leading-[1.2] bg-white border border-slate-300 rounded-sm px-2.5 py-1.5 text-slate-900 overflow-x-auto m-0"
                style={{ fontFamily: 'ui-monospace, SFMono-Regular, Consolas, "Courier New", monospace' }}
              >
                {renderCodeWithSlots()}
              </pre>
            </div>
          </div>
        </div>
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



