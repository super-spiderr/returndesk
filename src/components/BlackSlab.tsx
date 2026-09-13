// The signature component. Every one of the ~50 calculators ends here: a
// near-black panel with a plain-language statement, the headline number in
// lime (gain) or red (cost), a benchmark axis placing it against the
// alternative, and a comparison sentence — because colour alone never
// carries the verdict. Only the props change from calculator to calculator;
// this component itself should not need to change.

export interface BlackSlabAxis {
  /** Position (0–100) of the user's own figure along the benchmark line. */
  valuePercent: number;
  /** Position (0–100) of the alternative being compared against. */
  benchmarkPercent: number;
  /** Label under the dot, e.g. "your chit". */
  valueLabel: string;
  /** Label under the tick, e.g. "personal loan 11.5%". */
  benchmarkLabel: string;
}

export interface BlackSlabProps {
  eyebrow?: string;
  /** Plain sentence introducing the number, e.g. "Winning in month 4, you are borrowing at". */
  statement: string;
  /** The headline figure, e.g. "16.2%". */
  value: string;
  /** "gain" renders in lime, "cost" renders in red — never the only signal, see comparison. */
  tone: "gain" | "cost";
  axis: BlackSlabAxis;
  /** The verdict stated in words, so nobody needs the colour. */
  comparison: string;
  className?: string;
}

export default function BlackSlab({
  eyebrow = "THE VERDICT",
  statement,
  value,
  tone,
  axis,
  comparison,
  className = "",
}: BlackSlabProps) {
  const color = tone === "gain" ? "var(--lime)" : "var(--red)";

  return (
    <div
      className={`relative overflow-hidden rounded-2xl border border-dark-border bg-dark-surface p-6 sm:p-9 ${className}`}
    >
      <svg
        viewBox="0 0 900 900"
        aria-hidden="true"
        className="animate-drift pointer-events-none absolute -top-40 -right-40 h-[560px] w-[560px]"
      >
        <circle cx="450" cy="450" r="180" fill="none" stroke="#fff" strokeOpacity="0.045" strokeWidth="26" />
        <circle cx="450" cy="450" r="280" fill="none" stroke="#fff" strokeOpacity="0.045" strokeWidth="26" />
        <circle cx="450" cy="450" r="380" fill="none" stroke="#fff" strokeOpacity="0.045" strokeWidth="26" />
      </svg>

      <div className="relative flex flex-col justify-between h-full">
        <div>
          <div className="mb-5 border-b border-white/20 pb-2.5 text-xs font-bold tracking-widest uppercase text-dark-muted">
            {eyebrow}
          </div>
          
          <p className="mb-4 sm:mb-6 text-lg sm:text-xl leading-snug font-medium text-white">
            {statement}
          </p>
          
          <div
            className="tabular-nums font-black my-4 sm:my-6 leading-[1.05] tracking-tight break-words"
            style={{ fontSize: "clamp(42px, 5.5vw, 76px)", color }}
          >
            {value}
          </div>
        </div>

        <div>
          <div className="relative my-6 sm:my-8 h-1 rounded-full bg-[#2F3742]">
            <div
              className="absolute top-[-5px] h-3.5 w-3.5 -translate-x-1/2 rounded-full ring-4 ring-dark-surface transition-all duration-300"
              style={{ left: `${Math.min(Math.max(axis.valuePercent, 4), 96)}%`, background: color }}
            />
            <div
              className="absolute top-[-9px] h-6 w-1 rounded -translate-x-1/2 bg-white/70 shadow-sm transition-all duration-300"
              style={{ left: `${Math.min(Math.max(axis.benchmarkPercent, 4), 96)}%` }}
            />
          </div>

          <div className="flex justify-between items-center text-xs font-medium text-dark-muted">
            <span className="flex items-center gap-1.5">
              <span className="inline-block h-2 w-2 rounded-full" style={{ background: color }} />
              {axis.valueLabel}
            </span>
            <span className="flex items-center gap-1.5 text-right">
              <span className="inline-block h-3 w-0.5 bg-white/70" />
              {axis.benchmarkLabel}
            </span>
          </div>

          <p className="mt-6 pt-4 border-t border-white/10 text-sm sm:text-base leading-relaxed text-dark-soft">
            {comparison}
          </p>
        </div>
      </div>
    </div>
  );
}
