'use client'

export function Card ({
  title,
  description,
  headerRight,
  children,
}: {
  title?: string
  description?: string
  headerRight?: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <div className="rounded-2xl border border-gray-200/70 bg-white shadow-sm dark:bg-zinc-900 dark:border-zinc-800">
      {(title || description || headerRight) && (
        <div className="flex items-start justify-between gap-4 p-6">
          <div>
            {title && <h2 className="text-lg font-semibold">{title}</h2>}
            {description && <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{description}</p>}
          </div>
          {headerRight}
        </div>
      )}
      <div className="px-6 pb-6">
        {children}
      </div>
    </div>
  )
}


