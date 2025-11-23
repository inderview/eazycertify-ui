'use client'

export function StatCard ({
  title,
  value,
  subtitle,
  accent = 'bg-blue-600',
}: {
  title: string
  value: string | number
  subtitle?: string
  accent?: string
}) {
  return (
    <div className="relative overflow-hidden rounded-xl border border-gray-200/60 bg-white shadow-sm dark:bg-zinc-900 dark:border-zinc-800">
      <div className={`absolute inset-x-0 top-0 h-1 ${accent}`} />
      <div className="p-4 md:p-5">
        <div className="text-sm text-gray-500 dark:text-gray-400">{title}</div>
        <div className="mt-1 text-2xl font-semibold">{value}</div>
        {subtitle ? (
          <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">{subtitle}</div>
        ) : null}
      </div>
    </div>
  )
}


