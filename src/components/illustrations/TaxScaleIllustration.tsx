// Dedicated SVG illustration matching ReturnDesk's signature aesthetic:
// Bold ink lines (#161C24), subtle depth, and vibrant lime (#85E04C) savings highlights.

export default function TaxScaleIllustration({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 400 280"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Illustration of balanced scale weighing tax regimes"
      className={className}
    >
      {/* Background Soft Glow */}
      <circle cx="200" cy="140" r="110" fill="#161C24" fillOpacity="0.03" />

      {/* Base & Stand */}
      <path
        d="M130 255 H270 M160 255 L190 240 H210 L240 255"
        stroke="#161C24"
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <line x1="200" y1="50" x2="200" y2="240" stroke="#161C24" strokeWidth="4" strokeLinecap="round" />
      <circle cx="200" cy="45" r="8" fill="#161C24" />

      {/* Fulcrum / Beam */}
      <path d="M70 85 L200 45 L330 80" stroke="#161C24" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />

      {/* Left Pan (Old Regime / Deductions) */}
      <line x1="70" y1="85" x2="45" y2="160" stroke="#5A626D" strokeWidth="2.5" />
      <line x1="70" y1="85" x2="95" y2="160" stroke="#5A626D" strokeWidth="2.5" />
      <path d="M35 160 C35 180 105 180 105 160 Z" fill="#FFFFFF" stroke="#161C24" strokeWidth="3" />
      
      {/* Deduction Blocks on Left Pan */}
      <rect x="50" y="125" width="40" height="32" rx="4" fill="#FFFFFF" stroke="#161C24" strokeWidth="2.5" />
      <text x="56" y="145" fill="#161C24" fontSize="10" fontWeight="900" fontFamily="sans-serif">80C</text>
      <path d="M57 150 H83" stroke="#5A626D" strokeWidth="2" strokeLinecap="round" />

      <rect x="42" y="105" width="36" height="24" rx="4" fill="#85E04C" stroke="#161C24" strokeWidth="2.5" />
      <text x="47" y="121" fill="#161C24" fontSize="9" fontWeight="900" fontFamily="sans-serif">HRA</text>

      {/* Right Pan (New Regime / Flat Tax) */}
      <line x1="330" y1="80" x2="305" y2="155" stroke="#5A626D" strokeWidth="2.5" />
      <line x1="330" y1="80" x2="355" y2="155" stroke="#5A626D" strokeWidth="2.5" />
      <path d="M295 155 C295 175 365 175 365 155 Z" fill="#FFFFFF" stroke="#161C24" strokeWidth="3" />

      {/* Flat Standard Deduction Stack on Right Pan */}
      <ellipse cx="330" cy="148" rx="20" ry="7" fill="#FFFFFF" stroke="#161C24" strokeWidth="2.5" />
      <ellipse cx="330" cy="140" rx="20" ry="7" fill="#FFFFFF" stroke="#161C24" strokeWidth="2.5" />
      <ellipse cx="330" cy="132" rx="20" ry="7" fill="#85E04C" stroke="#161C24" strokeWidth="2.5" />
      <text x="325" y="136" fill="#161C24" fontSize="11" fontWeight="900" fontFamily="sans-serif">₹</text>

      {/* Savings Highlight Badge */}
      <g transform="translate(145, 15)">
        <rect width="110" height="26" rx="13" fill="#161C24" />
        <circle cx="14" cy="13" r="5" fill="#85E04C" />
        <text x="26" y="17" fill="#FFFFFF" fontSize="10.5" fontWeight="800" fontFamily="sans-serif" letterSpacing="0.5">
          OPTIMAL TAX
        </text>
      </g>
    </svg>
  );
}
