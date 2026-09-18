import type { TaxYearRules } from "./types";

// Budget 2025 (presented 1 Feb 2025), applicable to FY 2025-26 / AY 2026-27.
// New regime slabs and the Section 87A rebate threshold both changed from
// FY 2024-25; the Old Regime is unchanged.
export const fy2025_26: TaxYearRules = {
  financialYear: "2025-26",
  lastUpdated: "2025-02-01",
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
