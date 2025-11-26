import React from 'react'

interface QuestionCardProps {
  index: number
  topic?: string
  children: React.ReactNode
}

export function QuestionCard({ index, topic, children }: QuestionCardProps) {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between bg-[#0078D4] px-6 py-3 text-white">
        <h3 className="font-semibold">Question #{index}</h3>
        {topic && <span className="text-sm opacity-90">Topic {topic}</span>}
      </div>
      
      {/* Content */}
      <div className="p-6">
        {children}
      </div>
    </div>
  )
}
