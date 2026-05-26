export function HowItWorksIllustration({ className = '' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 800 200"
      fill="none"
      className={className}
      role="img"
      aria-label="Schedule, clean, deliver"
    >
      <defs>
        <linearGradient id="flow-line" x1="0" y1="0" x2="800" y2="0">
          <stop stopColor="oklch(0.42 0.15 260)" stopOpacity="0.15" />
          <stop offset="0.5" stopColor="oklch(0.6 0.14 175)" stopOpacity="0.4" />
          <stop offset="1" stopColor="oklch(0.42 0.15 260)" stopOpacity="0.15" />
        </linearGradient>
      </defs>
      <rect x="0" y="88" width="800" height="4" rx="2" fill="url(#flow-line)" />
      {[120, 400, 680].map((cx, i) => (
        <g key={i} transform={`translate(${cx - 60} 24)`}>
          <rect width="120" height="152" rx="20" fill="white" stroke="oklch(0.42 0.15 260)" strokeOpacity="0.12" strokeWidth="1.5" />
          <circle cx="60" cy="44" r="28" fill={i === 1 ? 'oklch(0.6 0.14 175 / 0.15)' : 'oklch(0.42 0.15 260 / 0.1)'} />
          <text x="60" y="50" textAnchor="middle" fill="oklch(0.42 0.15 260)" fontSize="22" fontWeight="800" fontFamily="system-ui">
            {i + 1}
          </text>
          <text x="60" y="100" textAnchor="middle" fill="oklch(0.35 0 0)" fontSize="13" fontWeight="700" fontFamily="system-ui">
            {['Schedule', 'We clean', 'Deliver'][i]}
          </text>
          <text x="60" y="122" textAnchor="middle" fill="oklch(0.55 0 0)" fontSize="10" fontFamily="system-ui">
            {['Book online', 'Expert care', 'To your door'][i]}
          </text>
        </g>
      ))}
    </svg>
  )
}
