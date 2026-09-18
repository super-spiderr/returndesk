import type { TaxYearRules } from "./types";

// Budget 2024 (presented 23 Jul 2024), applicable to FY 2024-25 / AY 2025-26.
export const fy2024_25: TaxYearRules = {
  financialYear: "2024-25",
  lastUpdated: "2024-07-23",
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
      { upTo: 300000, ratePercent: 0 },
      { upTo: 700000, ratePercent: 5 },
      { upTo: 1000000, ratePercent: 10 },
      { upTo: 1200000, ratePercent: 15 },
      { upTo: 1500000, ratePercent: 20 },
      { upTo: null, ratePercent: 30 },
    ],
    rebateTaxableIncomeLimit: 700000,
    cessPercent: 4,
  },
};
