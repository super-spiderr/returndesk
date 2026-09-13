// Sits on the white comparison section, so this stays strictly ink + muted —
// lime/red are reserved for verdicts and the dark homepage brand treatment,
// never for a plain illustration on a white background.

export default function FunnelVsDesk({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 480 220"
      role="img"
      aria-label="Illustration comparing a figure funnelled toward a product with a figure standing freely at an open desk"
      className={className}
    >
      <line
        x1="240"
        y1="10"
        x2="240"
        y2="210"
        stroke="#5A626D"
        strokeOpacity="0.35"
        strokeWidth="2"
        strokeDasharray="6 8"
      />

      <g stroke="#161C24" strokeWidth="3" fill="none" strokeLinejoin="round">
        <path d="M50 30 L170 30 L130 110 L90 110 Z" />
        <line x1="110" y1="110" x2="110" y2="150" />
      </g>
      <g stroke="#161C24" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="110" cy="15" r="11" />
        <path d="M96 30 q14 -18 28 0" />
      </g>
      <g stroke="#161C24" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="110" cy="168" r="11" />
        <path d="M94 205 q16 -24 32 0 l0 12 l-32 0 Z" />
      </g>

      <rect x="310" y="150" width="130" height="14" rx="7" fill="none" stroke="#161C24" strokeWidth="3" />
      <line x1="330" y1="164" x2="330" y2="195" stroke="#161C24" strokeWidth="3" />
      <line x1="420" y1="164" x2="420" y2="195" stroke="#161C24" strokeWidth="3" />
      <g stroke="#5A626D" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="375" cy="90" r="13" />
        <path d="M375 103 L375 140" />
        <path d="M355 120 L375 108 L395 120" />
        <path d="M360 150 L375 140 L390 150" />
      </g>
    </svg>
  );
}
