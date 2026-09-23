import type { TaxYearRules } from "./types";
import { fy2024_25 } from "./fy2024-25";
import { fy2025_26 } from "./fy2025-26";
import { fy2026_27 } from "./fy2026-27";

export type { TaxYearRules, TaxRegimeRules, OldRegimeRules, TaxSlab } from "./types";

export const taxYears: Record<string, TaxYearRules> = {
  "2024-25": fy2024_25,
  "2025-26": fy2025_26,
  "2026-27": fy2026_27,
};

/** Financial year selected by default when a page doesn't specify one. */
export const LATEST_TAX_YEAR = "2026-27";

export const availableTaxYears = Object.keys(taxYears);

export function getTaxYearRules(financialYear: string): TaxYearRules {
  return taxYears[financialYear] ?? taxYears[LATEST_TAX_YEAR];
}

/**
 * "Tax Year" replaced the old Financial Year / Assessment Year framework
 * under the Income Tax Act, 2025, effective from tax year 2026-27 — but
 * that Act wasn't in force for earlier years, so this only applies the new
 * name from 2026-27 onward and keeps plain "FY" for anything before it.
 * Titles/meta descriptions use this (people search both ways); short UI
 * toggles like the FY-picker buttons stay as plain "FY {year}" — there's
 * no room there for the full dual name, and it's unambiguous in context.
 */
export function taxYearDisplayLabel(financialYear: string): string {
  const startYear = Number(financialYear.split("-")[0]);
  return startYear >= 2026 ? `Tax Year ${financialYear} (FY ${financialYear})` : `FY ${financialYear}`;
}
