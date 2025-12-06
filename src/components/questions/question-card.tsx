import React, { useState, useEffect } from 'react'

interface QuestionCardProps {
  index: number
  topic?: string
  children: React.ReactNode
  isMarked?: boolean
  onToggleMark?: () => void
  collapsed?: boolean
}

export function QuestionCard({ index, topic, children, isMarked, onToggleMark, collapsed = false }: QuestionCardProps) {
  const [isCollapsed, setIsCollapsed] = useState(collapsed)

  useEffect(() => {
    setIsCollapsed(collapsed)
  }, [collapsed])

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      {/* Header */}
      <div 
        className="flex items-center justify-between bg-[#0078D4] px-6 py-3 text-white cursor-pointer hover:bg-[#006cbd] transition-colors select-none"
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        <div className="flex items-center gap-4">
          <h3 className="font-semibold">Question #{index}</h3>

          {onToggleMark && (
            <button
              onClick={(e) => {
                e.stopPropagation()
                onToggleMark()
              }}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium transition-colors border ${
                isMarked 
                  ? 'bg-yellow-400 text-slate-900 border-yellow-400' 
                  : 'bg-white/10 text-white border-white/20 hover:bg-white/20'
              }`}
            >
              <svg className="w-3.5 h-3.5" fill={isMarked ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
              </svg>
              {isMarked ? 'Marked for Review' : 'Review Later'}
            </button>
          )}
        </div>
        
        <div className="flex items-center gap-3">
          {topic && <span className="text-sm opacity-90">Topic {topic}</span>}
          <svg 
            className={`w-5 h-5 transition-transform duration-200 ${isCollapsed ? '-rotate-90' : 'rotate-0'}`} 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
      
      {/* Content */}
      {!isCollapsed && (
        <div className="p-6">
          {children}
        </div>
      )}
    </div>
  )
}
