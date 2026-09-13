// Dedicated SVG illustration matching ReturnDesk's signature aesthetic:
// House outline, tenure acceleration scissors / clock, and lime (#85E04C) savings trajectory.

export default function LoanPrepaymentIllustration({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 400 280"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Illustration of home loan prepayment cutting tenure"
      className={className}
    >
      {/* Background Soft Glow */}
      <circle cx="210" cy="140" r="110" fill="#161C24" fillOpacity="0.03" />

      {/* Modern House Outline */}
      <path
        d="M80 130 L160 65 L240 130 V240 H80 Z"
        fill="#FFFFFF"
        stroke="#161C24"
        strokeWidth="3.5"
        strokeLinejoin="round"
      />
      {/* Roof overhang line */}
      <path d="M65 140 L160 60 L255 140" stroke="#161C24" strokeWidth="4" strokeLinecap="round" />

      {/* Chimney */}
      <path d="M205 90 V70 H225 V105" stroke="#161C24" strokeWidth="3" fill="#FFFFFF" />

      {/* Door */}
      <rect x="135" y="175" width="45" height="65" rx="4" fill="#EFF0F2" stroke="#161C24" strokeWidth="3" />
      <circle cx="170" cy="208" r="3" fill="#161C24" />

      {/* Window */}
      <rect x="100" y="150" width="30" height="30" rx="3" fill="#FFFFFF" stroke="#161C24" strokeWidth="2.5" />
      <line x1="115" y1="150" x2="115" y2="180" stroke="#161C24" strokeWidth="2" />
      <line x1="100" y1="165" x2="130" y2="165" stroke="#161C24" strokeWidth="2" />

      {/* Fast Forward Clock */}
      <g transform="translate(245, 60)">
        <circle cx="45" cy="45" r="40" fill="#FFFFFF" stroke="#161C24" strokeWidth="3.5" />
        <circle cx="45" cy="45" r="4" fill="#161C24" />
        <path d="M45 22 V45 L62 55" stroke="#161C24" strokeWidth="3.5" strokeLinecap="round" />
        
        {/* Curved Acceleration Arrow */}
        <path
          d="M10 25 C25 2 65 2 80 20"
          stroke="#85E04C"
          strokeWidth="3.5"
          strokeLinecap="round"
          fill="none"
        />
        <path d="M72 15 L82 22 L82 10" fill="#85E04C" />
      </g>

      {/* Coin Stacks on Bottom Right */}
      <g transform="translate(270, 160)">
        <ellipse cx="40" cy="75" rx="28" ry="10" fill="#EFF0F2" stroke="#161C24" strokeWidth="3" />
        <ellipse cx="40" cy="63" rx="28" ry="10" fill="#FFFFFF" stroke="#161C24" strokeWidth="3" />
        <ellipse cx="40" cy="51" rx="28" ry="10" fill="#FFFFFF" stroke="#161C24" strokeWidth="3" />
        <ellipse cx="40" cy="39" rx="28" ry="10" fill="#85E04C" stroke="#161C24" strokeWidth="3" />
        <text x="33" y="44" fill="#161C24" fontSize="15" fontWeight="900" fontFamily="sans-serif">₹</text>
      </g>

      {/* Prepayment Milestone Badge */}
      <g transform="translate(70, 20)">
        <rect width="135" height="28" rx="14" fill="#161C24" />
        <circle cx="16" cy="14" r="5" fill="#85E04C" />
        <text x="28" y="18" fill="#FFFFFF" fontSize="10.5" fontWeight="800" fontFamily="sans-serif" letterSpacing="0.5">
          -54 MO TENURE
        </text>
      </g>
    </svg>
  );
}
