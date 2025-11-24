'use client'

export type TabItem = { key: string, label: string }

export function Tabs ({
  tabs,
  active,
  onChange,
}: {
  tabs: TabItem[]
  active: string
  onChange: (key: string) => void
}) {
  return (
    <div className="px-0">
      <div className="flex gap-2">
        {tabs.map(t => {
          const isActive = t.key === active
          return (
            <button
              key={t.key}
              className={[
                'px-4 py-2 text-sm font-medium rounded-t-md transition-colors border',
                isActive
                  ? 'bg-blue-600 text-white shadow-sm border-blue-600'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300 border-gray-300 dark:bg-zinc-800 dark:text-gray-200 dark:hover:bg-zinc-700 dark:border-zinc-700',
              ].join(' ')}
              onClick={() => onChange(t.key)}
            >
              {t.label}
            </button>
          )
        })}
      </div>
      <div className="h-[3px] w-full bg-blue-500 mt-2 rounded" />
    </div>
  )
}


