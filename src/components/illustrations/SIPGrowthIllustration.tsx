// Dedicated SVG illustration matching ReturnDesk's signature aesthetic:
// Compounding stair of rupee coins, growth arrow, and lime green (#85E04C) purchasing power highlight.

export default function SIPGrowthIllustration({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 400 280"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Illustration of compounding SIP growth and real purchasing power"
      className={className}
    >
      {/* Background Soft Glow */}
      <circle cx="210" cy="140" r="110" fill="#161C24" fillOpacity="0.03" />

      {/* Ground Baseline */}
      <line x1="40" y1="245" x2="360" y2="245" stroke="#DCDFE4" strokeWidth="3" strokeLinecap="round" />

      {/* Upward Compounding Curve */}
      <path
        d="M50 210 C140 200 220 130 335 45"
        stroke="#85E04C"
        strokeWidth="4"
        strokeLinecap="round"
        fill="none"
      />
      {/* Growth Arrowhead */}
      <path d="M315 45 L340 42 L338 67" fill="#85E04C" stroke="#161C24" strokeWidth="2" strokeLinejoin="round" />

      {/* Column 1: Step 1 */}
      <g transform="translate(60, 195)">
        <ellipse cx="22" cy="45" rx="18" ry="7" fill="#EFF0F2" stroke="#161C24" strokeWidth="2.5" />
        <ellipse cx="22" cy="37" rx="18" ry="7" fill="#FFFFFF" stroke="#161C24" strokeWidth="2.5" />
        <text x="17" y="40" fill="#161C24" fontSize="9" fontWeight="900" fontFamily="sans-serif">₹</text>
      </g>

      {/* Column 2: Step 2 */}
      <g transform="translate(115, 165)">
        <ellipse cx="22" cy="75" rx="18" ry="7" fill="#EFF0F2" stroke="#161C24" strokeWidth="2.5" />
        <ellipse cx="22" cy="67" rx="18" ry="7" fill="#FFFFFF" stroke="#161C24" strokeWidth="2.5" />
        <ellipse cx="22" cy="59" rx="18" ry="7" fill="#FFFFFF" stroke="#161C24" strokeWidth="2.5" />
        <ellipse cx="22" cy="51" rx="18" ry="7" fill="#FFFFFF" stroke="#161C24" strokeWidth="2.5" />
        <text x="17" y="54" fill="#161C24" fontSize="9" fontWeight="900" fontFamily="sans-serif">₹</text>
      </g>

      {/* Column 3: Step 3 */}
      <g transform="translate(170, 125)">
        <ellipse cx="22" cy="115" rx="18" ry="7" fill="#EFF0F2" stroke="#161C24" strokeWidth="2.5" />
        <ellipse cx="22" cy="107" rx="18" ry="7" fill="#FFFFFF" stroke="#161C24" strokeWidth="2.5" />
        <ellipse cx="22" cy="99" rx="18" ry="7" fill="#FFFFFF" stroke="#161C24" strokeWidth="2.5" />
        <ellipse cx="22" cy="91" rx="18" ry="7" fill="#FFFFFF" stroke="#161C24" strokeWidth="2.5" />
        <ellipse cx="22" cy="83" rx="18" ry="7" fill="#FFFFFF" stroke="#161C24" strokeWidth="2.5" />
        <ellipse cx="22" cy="75" rx="18" ry="7" fill="#85E04C" stroke="#161C24" strokeWidth="2.5" />
        <text x="17" y="79" fill="#161C24" fontSize="10" fontWeight="900" fontFamily="sans-serif">₹</text>
      </g>

      {/* Column 4: Step 4 */}
      <g transform="translate(225, 80)">
        <ellipse cx="22" cy="160" rx="18" ry="7" fill="#EFF0F2" stroke="#161C24" strokeWidth="2.5" />
        <ellipse cx="22" cy="152" rx="18" ry="7" fill="#FFFFFF" stroke="#161C24" strokeWidth="2.5" />
        <ellipse cx="22" cy="144" rx="18" ry="7" fill="#FFFFFF" stroke="#161C24" strokeWidth="2.5" />
        <ellipse cx="22" cy="136" rx="18" ry="7" fill="#FFFFFF" stroke="#161C24" strokeWidth="2.5" />
        <ellipse cx="22" cy="128" rx="18" ry="7" fill="#FFFFFF" stroke="#161C24" strokeWidth="2.5" />
        <ellipse cx="22" cy="120" rx="18" ry="7" fill="#FFFFFF" stroke="#161C24" strokeWidth="2.5" />
        <ellipse cx="22" cy="112" rx="18" ry="7" fill="#FFFFFF" stroke="#161C24" strokeWidth="2.5" />
        <ellipse cx="22" cy="104" rx="18" ry="7" fill="#85E04C" stroke="#161C24" strokeWidth="2.5" />
        <text x="17" y="108" fill="#161C24" fontSize="10" fontWeight="900" fontFamily="sans-serif">₹</text>
      </g>

      {/* Sprouting Plant on top column */}
      <g transform="translate(290, 80)">
        <ellipse cx="22" cy="160" rx="20" ry="7" fill="#EFF0F2" stroke="#161C24" strokeWidth="3" />
        <ellipse cx="22" cy="150" rx="20" ry="7" fill="#FFFFFF" stroke="#161C24" strokeWidth="3" />
        <ellipse cx="22" cy="140" rx="20" ry="7" fill="#FFFFFF" stroke="#161C24" strokeWidth="3" />
        <ellipse cx="22" cy="130" rx="20" ry="7" fill="#85E04C" stroke="#161C24" strokeWidth="3" />
        <text x="16" y="135" fill="#161C24" fontSize="12" fontWeight="900" fontFamily="sans-serif">₹</text>

        {/* Sprout */}
        <path d="M22 130 V90" stroke="#161C24" strokeWidth="3" strokeLinecap="round" />
        <path d="M22 105 C10 95 8 80 20 85 C22 92 22 100 22 105 Z" fill="#85E04C" stroke="#161C24" strokeWidth="2.5" />
        <path d="M22 95 C34 85 36 70 24 75 C22 82 22 90 22 95 Z" fill="#85E04C" stroke="#161C24" strokeWidth="2.5" />
      </g>

      {/* Wealth Multiplier Badge */}
      <g transform="translate(45, 25)">
        <rect width="135" height="28" rx="14" fill="#161C24" />
        <circle cx="16" cy="14" r="5" fill="#85E04C" />
        <text x="28" y="18" fill="#FFFFFF" fontSize="10.5" fontWeight="800" fontFamily="sans-serif" letterSpacing="0.5">
          REAL PURCHASING
        </text>
      </g>
    </svg>
  );
}
