'use client'

export function DonutChart ({ segments }: { segments: { label: string, value: number, color: string }[] }) {
  const total = segments.reduce((s, x) => s + x.value, 0) || 1
  const radius = 72
  const stroke = 18
  const c = 2 * Math.PI * radius

  let acc = 0

  return (
    <div className="flex items-center gap-4">
      <svg className="w-44 h-44" viewBox="0 0 200 200">
        <g transform="translate(100,100)">
          {segments.map((seg, i) => {
            const len = (seg.value / total) * c
            const dash = `${len} ${c - len}`
            const el = (
              <circle
                key={i}
                r={radius}
                cx="0"
                cy="0"
                fill="transparent"
                stroke={seg.color}
                strokeWidth={stroke}
                strokeDasharray={dash}
                strokeDashoffset={-acc}
                transform="rotate(-90)"
              />
            )
            acc += len
            return el
          })}
        </g>
      </svg>
      <div className="text-sm">
        {segments.map(seg => (
          <div key={seg.label} className="flex items-center gap-2 mb-1">
            <span className="inline-block h-3 w-3 rounded-sm" style={{ backgroundColor: seg.color }} />
            <span className="text-gray-700 dark:text-gray-200">{seg.label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}


