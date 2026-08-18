/** Custom hero illustration — not a stock placeholder. */
export const LaundryHeroVisual = ({ className = '' }: { className?: string }) => {
  return (
    <svg
      viewBox="0 0 520 420"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      role="img"
      aria-label="Pickup, clean, and delivery flow"
    >
      <defs>
        <linearGradient id="hero-bg" x1="0" y1="0" x2="520" y2="420" gradientUnits="userSpaceOnUse">
          <stop stopColor="oklch(0.97 0.02 260)" />
          <stop offset="1" stopColor="oklch(0.95 0.04 190)" />
        </linearGradient>
        <linearGradient id="hero-primary" x1="0" y1="0" x2="1" y2="1">
          <stop stopColor="oklch(0.48 0.15 260)" />
          <stop offset="1" stopColor="oklch(0.42 0.15 260)" />
        </linearGradient>
        <linearGradient id="hero-accent" x1="0" y1="0" x2="1" y2="0">
          <stop stopColor="oklch(0.62 0.14 175)" />
          <stop offset="1" stopColor="oklch(0.55 0.12 190)" />
        </linearGradient>
        <filter id="hero-shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="8" stdDeviation="12" floodColor="oklch(0.42 0.15 260)" floodOpacity="0.12" />
        </filter>
      </defs>

      <rect width="520" height="420" rx="28" fill="url(#hero-bg)" />
      <rect x="24" y="24" width="472" height="372" rx="20" fill="white" fillOpacity="0.65" />

      {/* Step 1 — Pickup at door */}
      <g filter="url(#hero-shadow)" transform="translate(48 72)">
        <rect width="120" height="140" rx="16" fill="white" />
        <path d="M20 100h80v28H20z" fill="oklch(0.92 0.01 260)" />
        <path d="M36 52h48v48H36z" fill="oklch(0.88 0.02 260)" stroke="oklch(0.75 0.05 260)" strokeWidth="2" />
        <rect x="52" y="68" width="16" height="20" rx="2" fill="url(#hero-primary)" />
        <circle cx="60" cy="118" r="6" fill="url(#hero-accent)" />
        <text x="60" y="132" textAnchor="middle" fill="oklch(0.42 0.15 260)" fontSize="11" fontWeight="700" fontFamily="system-ui,sans-serif">
          Pickup
        </text>
      </g>

      {/* Connector */}
      <path d="M180 142h48" stroke="url(#hero-accent)" strokeWidth="3" strokeLinecap="round" strokeDasharray="6 8" />
      <polygon points="228,142 220,137 220,147" fill="url(#hero-accent)" />

      {/* Step 2 — Wash */}
      <g filter="url(#hero-shadow)" transform="translate(200 56)">
        <rect width="120" height="168" rx="16" fill="white" />
        <circle cx="60" cy="78" r="42" fill="oklch(0.94 0.02 260)" stroke="url(#hero-primary)" strokeWidth="3" />
        <circle cx="60" cy="78" r="32" fill="none" stroke="url(#hero-accent)" strokeWidth="2" strokeDasharray="8 6" opacity="0.7">
          <animateTransform attributeName="transform" type="rotate" from="0 60 78" to="360 60 78" dur="12s" repeatCount="indefinite" />
        </circle>
        <path d="M48 78c8-12 24-12 24 0s16 12 24 0" stroke="url(#hero-primary)" strokeWidth="2.5" strokeLinecap="round" fill="none" />
        <rect x="28" y="128" width="64" height="8" rx="4" fill="oklch(0.9 0 0)" />
        <text x="60" y="156" textAnchor="middle" fill="oklch(0.42 0.15 260)" fontSize="11" fontWeight="700" fontFamily="system-ui,sans-serif">
          Clean
        </text>
      </g>

      <path d="M332 142h48" stroke="url(#hero-accent)" strokeWidth="3" strokeLinecap="round" strokeDasharray="6 8" />
      <polygon points="380,142 372,137 372,147" fill="url(#hero-accent)" />

      {/* Step 3 — Folded + deliver */}
      <g filter="url(#hero-shadow)" transform="translate(352 72)">
        <rect width="120" height="140" rx="16" fill="white" />
        <rect x="28" y="48" width="64" height="12" rx="3" fill="url(#hero-primary)" opacity="0.85" />
        <rect x="32" y="62" width="56" height="10" rx="3" fill="url(#hero-primary)" opacity="0.65" />
        <rect x="36" y="74" width="48" height="10" rx="3" fill="url(#hero-primary)" opacity="0.45" />
        <path d="M44 100h52l-8 24H36z" fill="url(#hero-accent)" />
        <circle cx="88" cy="108" r="10" fill="url(#hero-primary)" />
        <text x="60" y="132" textAnchor="middle" fill="oklch(0.42 0.15 260)" fontSize="11" fontWeight="700" fontFamily="system-ui,sans-serif">
          Deliver
        </text>
      </g>

      {/* Bottom route line */}
      <path
        d="M80 300 Q260 260 440 300"
        stroke="url(#hero-primary)"
        strokeWidth="2"
        fill="none"
        opacity="0.2"
      />
      <circle cx="120" cy="288" r="5" fill="url(#hero-accent)" />
      <circle cx="260" cy="272" r="5" fill="url(#hero-primary)" />
      <circle cx="400" cy="288" r="5" fill="url(#hero-accent)" />
    </svg>
  )
}
