// Single source of truth for the /salary-calculator programmatic cluster.
// Add a CTC value here and it shows up in the hub, generateStaticParams, and
// the sitemap — nowhere else needs to change.
//
// Each page's numbers come from real slab math (see calculateIncomeTax in
// lib/finance.ts), not a name swapped into a template — the CTC value itself
// drives every figure on the page.

export const CTC_LAKHS: number[] = [
  3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 22, 24, 25,
  26, 28, 30, 32, 35, 38, 40, 45, 50,
];

export type RegimeSlug = "old-regime" | "new-regime";
export const REGIME_SLUGS: RegimeSlug[] = ["old-regime", "new-regime"];

/** 12 -> "12-lpa", 4.5 -> "4-5-lpa" */
export function ctcToSlug(lakhs: number): string {
  return `${String(lakhs).replace(".", "-")}-lpa`;
}

/** "12-lpa" -> 12, only for values actually in CTC_LAKHS (else null). */
export function slugToCtc(slug: string): number | null {
  const match = slug.match(/^(\d+(?:-\d+)?)-lpa$/);
  if (!match) return null;
  const value = Number(match[1].replace("-", "."));
  return CTC_LAKHS.includes(value) ? value : null;
}

export function ctcLabel(lakhs: number): string {
  return `₹${lakhs} LPA`;
}

export function ctcToAnnualRupees(lakhs: number): number {
  return Math.round(lakhs * 100000);
}

export function regimeLabel(regime: RegimeSlug): string {
  return regime === "old-regime" ? "Old Regime" : "New Regime";
}

export function regimeSlugToKey(regime: RegimeSlug): "Old" | "New" {
  return regime === "old-regime" ? "Old" : "New";
}

/** Nearest other CTC values (by distance, then ascending) — used for related-page links. */
export function nearbyCtc(lakhs: number, count = 4): number[] {
  return [...CTC_LAKHS]
    .filter((value) => value !== lakhs)
    .sort((a, b) => Math.abs(a - lakhs) - Math.abs(b - lakhs))
    .slice(0, count)
    .sort((a, b) => a - b);
}

/**
 * Standard assumption profile for the programmatic pages, scaled to CTC.
 * There's no per-user HRA/rent/investment data at this URL — only a CTC
 * figure — so every page states these assumptions plainly and links to the
 * full interactive calculator for a personalised number.
 *
 * Ratios mirror the interactive calculator's own defaults (HRA 20% of CTC,
 * rent 16% of CTC, metro city, full 80C/80D/NPS where the CTC can plausibly
 * support it) so the two tools never quietly disagree with each other.
 */
export function defaultAssumptions(ctcLakhs: number) {
  const ctc = ctcToAnnualRupees(ctcLakhs);
  const basicSalaryAnnual = Math.round(ctc * 0.5);
  const hraReceivedAnnual = Math.round(ctc * 0.2);
  const rentPaidAnnual = Math.round(ctc * 0.16);
  const section80C = Math.min(150000, Math.round(ctc * 0.3));
  const section80D = Math.min(25000, Math.round(ctc * 0.05));
  const nps80CCD1B = Math.min(50000, Math.round(ctc * 0.1));

  return {
    grossAnnualSalary: ctc,
    basicSalaryAnnual,
    hraReceivedAnnual,
    rentPaidAnnual,
    isMetroCity: true,
    section80C,
    section80D,
    section24b: 0,
    nps80CCD1B,
    otherDeductions: 0,
  };
}
