'use client'

// Simple SVG line chart (sparkline style)
export function LineChart ({ points }: { points: number[] }) {
  const width = 600
  const height = 220
  const padding = 24
  const len = points.length || 1
  const max = Math.max(...points, 1)
  const min = Math.min(...points, 0)
  const range = Math.max(max - min, 1)
  const stepX = (width - padding * 2) / (len - 1 || 1)

  const toX = (i: number) => padding + i * stepX
  const toY = (v: number) => padding + (1 - (v - min) / range) * (height - padding * 2)

  const d = points
    .map((v, i) => `${i === 0 ? 'M' : 'L'} ${toX(i)} ${toY(v)}`)
    .join(' ')

  const area = `M ${toX(0)} ${toY(points[0] ?? 0)} ${points.map((v, i) => `L ${toX(i)} ${toY(v)}`).join(' ')} L ${toX(len - 1)} ${height - padding} L ${toX(0)} ${height - padding} Z`

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-56">
      <defs>
        <linearGradient id="lineFill" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
        </linearGradient>
      </defs>
      <rect x="0" y="0" width={width} height={height} fill="transparent" />
      <path d={area} fill="url(#lineFill)" />
      <path d={d} fill="none" stroke="#3b82f6" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  )
}


