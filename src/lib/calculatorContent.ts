// Maps a calculator slug to its localized display copy, so RelatedCalculators
// can show the same title/subtitle a visitor already sees on that page,
// without registry.ts (SEO-facing, English-only) taking a dependency on i18n.

import type { TranslationDict } from "./i18n";

export function calculatorDisplayInfo(
  t: TranslationDict
): Record<string, { title: string; subtitle: string }> {
  return {
    "chit-fund": { title: t.chitFundCalc.title, subtitle: t.chitFundCalc.subtitle },
    "salary-tax": { title: t.salaryTaxCalc.title, subtitle: t.salaryTaxCalc.subtitle },
    investments: { title: t.investmentsCalc.title, subtitle: t.investmentsCalc.subtitle },
    loans: { title: t.loansCalc.title, subtitle: t.loansCalc.subtitle },
  };
}
