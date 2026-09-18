import type { TaxYearRules } from "./types";
import { fy2024_25 } from "./fy2024-25";
import { fy2025_26 } from "./fy2025-26";

export type { TaxYearRules, TaxRegimeRules, OldRegimeRules, TaxSlab } from "./types";

export const taxYears: Record<string, TaxYearRules> = {
  "2024-25": fy2024_25,
  "2025-26": fy2025_26,
};

/** Financial year selected by default when a page doesn't specify one. */
export const LATEST_TAX_YEAR = "2025-26";

export const availableTaxYears = Object.keys(taxYears);

export function getTaxYearRules(financialYear: string): TaxYearRules {
  return taxYears[financialYear] ?? taxYears[LATEST_TAX_YEAR];
}
