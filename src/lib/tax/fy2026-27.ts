import type { TaxYearRules } from "./types";

// Budget 2026 (presented 1 Feb 2026), applicable to Tax Year 2026-27. The
// Income Tax Act, 2025 (replacing the 1961 Act) took effect from this year,
// and "Tax Year" is the term it uses in place of the old Financial Year /
// Assessment Year pair — see `taxYearDisplayLabel` in ./index.ts, which is
// what actually surfaces that naming change on the page. The slabs
// themselves are unchanged from FY 2025-26 for both regimes.
export const fy2026_27: TaxYearRules = {
  financialYear: "2026-27",
  lastUpdated: "2026-02-01",
  oldRegime: {
    standardDeduction: 50000,
    slabs: [
      { upTo: 250000, ratePercent: 0 },
      { upTo: 500000, ratePercent: 5 },
      { upTo: 1000000, ratePercent: 20 },
      { upTo: null, ratePercent: 30 },
    ],
    rebateTaxableIncomeLimit: 500000,
    cessPercent: 4,
    hra: { metroPercent: 50, nonMetroPercent: 40 },
    section80CMax: 150000,
    section80DMax: 100000,
    section24bMax: 200000,
    nps80CCD1BMax: 50000,
  },
  newRegime: {
    standardDeduction: 75000,
    slabs: [
      { upTo: 400000, ratePercent: 0 },
      { upTo: 800000, ratePercent: 5 },
      { upTo: 1200000, ratePercent: 10 },
      { upTo: 1600000, ratePercent: 15 },
      { upTo: 2000000, ratePercent: 20 },
      { upTo: 2400000, ratePercent: 25 },
      { upTo: null, ratePercent: 30 },
    ],
    rebateTaxableIncomeLimit: 1200000,
    cessPercent: 4,
  },
};
