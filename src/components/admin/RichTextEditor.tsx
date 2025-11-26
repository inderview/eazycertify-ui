import { useEffect, useRef, useState } from 'react'

interface RichTextEditorProps {
  value: string
  onChange: (value: string) => void
  className?: string
  placeholder?: string
}

export function RichTextEditor({ value, onChange, className = '', placeholder }: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null)
  const [isFocused, setIsFocused] = useState(false)

  // Sync value to editor content when value changes externally (and not focused to avoid cursor jumps)
  useEffect(() => {
    if (editorRef.current && value !== editorRef.current.innerHTML && !isFocused) {
      editorRef.current.innerHTML = value
    }
  }, [value, isFocused])

  const handleInput = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML)
    }
  }

  const exec = (command: string, value: string | undefined = undefined) => {
    document.execCommand(command, false, value)
    editorRef.current?.focus()
  }

  return (
    <div className={`rounded-md border border-slate-300 bg-white overflow-hidden ${className}`}>
      <div className="flex items-center gap-1 border-b border-slate-200 bg-slate-50 p-1 flex-wrap">
        <ToolbarButton onClick={() => exec('bold')} label="B" title="Bold" className="font-bold" />
        <ToolbarButton onClick={() => exec('italic')} label="I" title="Italic" className="italic" />
        <ToolbarButton onClick={() => exec('underline')} label="U" title="Underline" className="underline" />
        <div className="w-px h-4 bg-slate-300 mx-1" />
        <ToolbarButton onClick={() => exec('insertUnorderedList')} label="• List" title="Bullet List" />
        <ToolbarButton onClick={() => exec('insertOrderedList')} label="1. List" title="Numbered List" />
        <div className="w-px h-4 bg-slate-300 mx-1" />
        <ToolbarButton onClick={() => exec('formatBlock', 'PRE')} label="Code" title="Code Block" className="font-mono text-xs" />
        <div className="w-px h-4 bg-slate-300 mx-1" />
        <label className="rounded px-2 py-1 text-sm hover:bg-slate-200 text-slate-700 min-w-[24px] flex items-center justify-center cursor-pointer" title="Insert Image">
          <span className="flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
          </span>
          <input 
            type="file" 
            className="hidden" 
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0]
              if (file) {
                const reader = new FileReader()
                reader.onload = (ev) => {
                  exec('insertImage', ev.target?.result as string)
                }
                reader.readAsDataURL(file)
              }
              e.target.value = ''
            }}
          />
        </label>
        <ToolbarButton onClick={() => exec('removeFormat')} label="Clear" title="Clear Formatting" />
      </div>
      <div
        ref={editorRef}
        className="min-h-[150px] p-3 focus:outline-none prose prose-sm max-w-none"
        contentEditable
        onInput={handleInput}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        data-placeholder={placeholder}
      />
      <style jsx>{`
        [contenteditable]:empty:before {
          content: attr(data-placeholder);
          color: #9ca3af;
          pointer-events: none;
        }
      `}</style>
    </div>
  )
}

function ToolbarButton({ onClick, label, title, className = '' }: any) {
  return (
    <button
      type="button"
      onClick={(e) => { e.preventDefault(); onClick() }}
      className={`rounded px-2 py-1 text-sm hover:bg-slate-200 text-slate-700 min-w-[24px] flex items-center justify-center ${className}`}
      title={title}
    >
      {label}
    </button>
  )
}
