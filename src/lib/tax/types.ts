// Shape of one financial year's tax rules. A new Union Budget never edits an
// existing file here — it adds a new one and registers it in `index.ts`, so a
// calculation always states which year's rules produced it.

export interface TaxSlab {
  /** Upper bound of this bracket's taxable income, in rupees. `null` = no upper bound. */
  upTo: number | null;
  ratePercent: number;
}

export interface TaxRegimeRules {
  standardDeduction: number;
  slabs: TaxSlab[];
  /** Section 87A: tax is rebated to zero when taxable income is at or below this. */
  rebateTaxableIncomeLimit: number;
  cessPercent: number;
}

export interface OldRegimeRules extends TaxRegimeRules {
  hra: { metroPercent: number; nonMetroPercent: number };
  section80CMax: number;
  section80DMax: number;
  section24bMax: number;
  nps80CCD1BMax: number;
}

export interface TaxYearRules {
  /** e.g. "2025-26" */
  financialYear: string;
  /** ISO date this rule set was last verified against the Finance Act / Budget. */
  lastUpdated: string;
  oldRegime: OldRegimeRules;
  newRegime: TaxRegimeRules;
}
