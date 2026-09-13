// Dedicated SVG illustration matching ReturnDesk's signature aesthetic:
// Chit fund auction pot, bid tokens, and lime green (#85E04C) transparent dividend highlight.

export default function ChitFundIllustration({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 400 280"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Illustration of chit fund pot and auction tokens"
      className={className}
    >
      {/* Background Soft Glow */}
      <circle cx="200" cy="140" r="110" fill="#161C24" fillOpacity="0.03" />

      {/* Main Chit Pot / Vault Bowl */}
      <path
        d="M100 130 C100 230 300 230 300 130 Z"
        fill="#FFFFFF"
        stroke="#161C24"
        strokeWidth="3.5"
        strokeLinejoin="round"
      />
      <ellipse cx="200" cy="130" rx="100" ry="25" fill="#EFF0F2" stroke="#161C24" strokeWidth="3.5" />
      <ellipse cx="200" cy="130" rx="80" ry="18" fill="#FFFFFF" stroke="#161C24" strokeWidth="2.5" />

      {/* Gold & Lime Coin Pile in Pot */}
      <ellipse cx="170" cy="130" rx="22" ry="8" fill="#85E04C" stroke="#161C24" strokeWidth="2.5" />
      <ellipse cx="220" cy="126" rx="24" ry="9" fill="#FFFFFF" stroke="#161C24" strokeWidth="2.5" />
      <ellipse cx="195" cy="120" rx="26" ry="10" fill="#85E04C" stroke="#161C24" strokeWidth="2.5" />
      <text x="190" y="124" fill="#161C24" fontSize="11" fontWeight="900" fontFamily="sans-serif">₹</text>

      {/* Auction Tokens / Bids */}
      <g transform="translate(60, 160)">
        <circle cx="25" cy="25" r="22" fill="#FFFFFF" stroke="#161C24" strokeWidth="3" />
        <circle cx="25" cy="25" r="16" stroke="#5A626D" strokeWidth="1.5" strokeDasharray="3 3" />
        <text x="17" y="30" fill="#161C24" fontSize="13" fontWeight="900" fontFamily="sans-serif">25%</text>
      </g>

      <g transform="translate(290, 155)">
        <circle cx="25" cy="25" r="22" fill="#85E04C" stroke="#161C24" strokeWidth="3" />
        <circle cx="25" cy="25" r="16" stroke="#161C24" strokeWidth="1.5" strokeDasharray="3 3" />
        <text x="18" y="30" fill="#161C24" fontSize="13" fontWeight="900" fontFamily="sans-serif">BID</text>
      </g>

      {/* Transparent Ledger Badge */}
      <g transform="translate(130, 25)">
        <rect width="140" height="28" rx="14" fill="#161C24" />
        <circle cx="16" cy="14" r="5" fill="#85E04C" />
        <text x="28" y="18" fill="#FFFFFF" fontSize="10.5" fontWeight="800" fontFamily="sans-serif" letterSpacing="0.5">
          TRUE XIRR MATH
        </text>
      </g>
    </svg>
  );
}
