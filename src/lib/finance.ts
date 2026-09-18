// Shared finance math, written once and reused by every calculator.
// Single source of truth for EMI / Tax / IRR / XIRR / Compounding.

import { getTaxYearRules, LATEST_TAX_YEAR } from "./tax";
import type { TaxSlab, OldRegimeRules } from "./tax";

/**
 * Monthly EMI for a fully-amortising loan.
 * @param principal Loan amount.
 * @param annualRatePercent Annual interest rate, e.g. 11.5 for 11.5%.
 * @param months Loan tenure in months.
 */
export function emi(
  principal: number,
  annualRatePercent: number,
  months: number
): number {
  if (months <= 0 || principal <= 0) return 0;
  const r = annualRatePercent / 12 / 100;
  if (r === 0) return principal / months;
  const factor = Math.pow(1 + r, months);
  return (principal * r * factor) / (factor - 1);
}

/** Total interest paid over the life of an EMI loan. */
export function totalInterest(
  principal: number,
  annualRatePercent: number,
  months: number
): number {
  if (months <= 0 || principal <= 0) return 0;
  return emi(principal, annualRatePercent, months) * months - principal;
}

/** Future value of a one-time investment, compounded annually. */
export function futureValueLumpsum(
  principal: number,
  annualRatePercent: number,
  years: number
): number {
  return principal * Math.pow(1 + annualRatePercent / 100, years);
}

/**
 * Future value of a monthly SIP (systematic investment plan), contributions
 * made at the start of each month, growing at a fixed annual rate.
 */
export function futureValueSIP(
  monthlyAmount: number,
  annualRatePercent: number,
  months: number
): number {
  if (months <= 0 || monthlyAmount <= 0) return 0;
  const r = annualRatePercent / 12 / 100;
  if (r === 0) return monthlyAmount * months;
  return monthlyAmount * (((Math.pow(1 + r, months) - 1) / r) * (1 + r));
}

/**
 * Internal rate of return for evenly-spaced periodic cash flows (first entry
 * is the outlay, typically negative). Solved via Newton-Raphson.
 */
export function irr(cashflows: number[], guess = 0.1): number | null {
  if (cashflows.length < 2) return null;
  const maxIterations = 150;
  const tolerance = 1e-7;
  let rate = guess;

  for (let i = 0; i < maxIterations; i++) {
    let npv = 0;
    let dNpv = 0;
    for (let t = 0; t < cashflows.length; t++) {
      npv += cashflows[t] / Math.pow(1 + rate, t);
      if (t > 0) {
        dNpv -= (t * cashflows[t]) / Math.pow(1 + rate, t + 1);
      }
    }
    if (Math.abs(npv) < tolerance) return rate;
    if (dNpv === 0) break;
    const next = rate - npv / dNpv;
    if (!Number.isFinite(next)) break;
    rate = next;
  }
  return Number.isFinite(rate) ? rate : null;
}

export interface DatedCashFlow {
  date: Date;
  amount: number;
}

/**
 * XIRR for irregularly-dated cash flows. Returns the annualised rate as a
 * decimal (0.112 for 11.2%), or null if it doesn't converge.
 */
export function xirr(cashflows: DatedCashFlow[], guess = 0.1): number | null {
  if (cashflows.length < 2) return null;
  const t0 = cashflows[0].date.getTime();
  const years = cashflows.map(
    (cf) => (cf.date.getTime() - t0) / (365 * 86400000)
  );

  const npv = (rate: number) =>
    cashflows.reduce(
      (sum, cf, i) => sum + cf.amount / Math.pow(1 + rate, years[i]),
      0
    );
  const dNpv = (rate: number) =>
    cashflows.reduce(
      (sum, cf, i) =>
        years[i] === 0
          ? sum
          : sum - (years[i] * cf.amount) / Math.pow(1 + rate, years[i] + 1),
      0
    );

  let rate = guess;
  const maxIterations = 150;
  const tolerance = 1e-7;

  for (let i = 0; i < maxIterations; i++) {
    const value = npv(rate);
    if (Math.abs(value) < tolerance) return rate;
    const derivative = dNpv(rate);
    if (derivative === 0) break;
    const next = rate - value / derivative;
    if (!Number.isFinite(next)) break;
    rate = next;
  }
  return Number.isFinite(rate) ? rate : null;
}

// -------------------------------------------------------------
// CHIT FUND ENGINE
// -------------------------------------------------------------

export interface ChitFundParams {
  chitValue: number; // Total pot, e.g. ₹5,00,000
  months: number; // Tenure, e.g. 25 or 50 months
  foremanCommissionPercent: number; // usually 5%
  isBorrower: boolean;
  bidMonth: number; // Month user wins bid (1 to months)
  bidDiscountPercent: number; // Maximum auction discount, e.g. 25-30%
  lang?: "en" | "ta";
}

export interface ChitFundResult {
  monthlyInstallmentNominal: number;
  actualTakeHomePrize: number; // Chit Value - Bid Discount
  foremanCommission: number;
  totalDistributedDividend: number;
  averageMonthlyPayment: number;
  totalPaidOverTenure: number;
  effectiveXirrPercent: number;
  personalLoanRatePercent: number;
  fdRatePercent: number;
  verdictTone: "gain" | "cost";
  verdictHeadline: string;
  verdictSummary: string;
  schedule: {
    month: number;
    nominalDue: number;
    dividendReceived: number;
    netPaid: number;
    cashflow: number;
  }[];
}

export function calculateChitFund(params: ChitFundParams): ChitFundResult {
  const {
    chitValue,
    months,
    foremanCommissionPercent,
    isBorrower,
    bidMonth,
    bidDiscountPercent,
    lang = "en",
  } = params;
  const isTa = lang === "ta";

  const monthlyInstallmentNominal = chitValue / months;
  const foremanCommission = (chitValue * foremanCommissionPercent) / 100;
  const actualTakeHomePrize =
    chitValue - (chitValue * bidDiscountPercent) / 100;

  // Build cashflow series across tenure
  const cashflows: number[] = [];
  const schedule: ChitFundResult["schedule"] = [];

  let totalPaidOverTenure = 0;
  let totalDistributedDividendPool = 0;

  for (let m = 1; m <= months; m++) {
    // Bid discount gradually tapers from peak down to foreman commission
    const progress = (m - 1) / Math.max(1, months - 1);
    const monthDiscountPercent =
      bidDiscountPercent -
      progress * (bidDiscountPercent - foremanCommissionPercent);
    const totalBidDiscount = (chitValue * monthDiscountPercent) / 100;
    const currentMonthDivPool = Math.max(
      0,
      totalBidDiscount - foremanCommission
    );
    totalDistributedDividendPool += currentMonthDivPool;

    const div = m === 1 ? 0 : currentMonthDivPool / months;

    const netPayment = Math.max(0, monthlyInstallmentNominal - div);
    totalPaidOverTenure += netPayment;

    let cf = -netPayment;
    if (m === bidMonth) {
      cf += actualTakeHomePrize;
    }

    cashflows.push(cf);
    schedule.push({
      month: m,
      nominalDue: monthlyInstallmentNominal,
      dividendReceived: div,
      netPaid: netPayment,
      cashflow: cf,
    });
  }

  const monthlyIrr = irr(cashflows, 0.01) ?? 0.01;
  const effectiveAnnualXirr =
    (Math.pow(1 + Math.abs(monthlyIrr), 12) - 1) *
    100 *
    (monthlyIrr < 0 ? -1 : 1);

  const personalLoanRatePercent = 11.5;
  const fdRatePercent = 7.0;

  let verdictTone: "gain" | "cost" = "cost";
  let verdictHeadline = "";
  let verdictSummary = "";

  if (isBorrower) {
    const costBorrowing = Math.abs(effectiveAnnualXirr);
    if (costBorrowing > personalLoanRatePercent) {
      verdictTone = "cost";
      const diff = (costBorrowing - personalLoanRatePercent).toFixed(1);
      verdictHeadline = isTa ? `${costBorrowing.toFixed(1)}% APR` : `${costBorrowing.toFixed(1)}% APR`;
      verdictSummary = isTa
        ? `மாதம் ${bidMonth}-ல் ஏலம் எடுப்பது ${costBorrowing.toFixed(1)}% வட்டிச் சுமையைத் தருகிறது. ${personalLoanRatePercent}% வட்டி கொண்ட வழக்கமான வங்கிக் கடன் ${diff}% மலிவானது.`
        : `Borrowing in Month ${bidMonth} costs ${costBorrowing.toFixed(1)}% effective APR. A standard bank personal loan at ${personalLoanRatePercent}% is cheaper by ${diff} percentage points.`;
    } else {
      verdictTone = "gain";
      verdictHeadline = isTa ? `${costBorrowing.toFixed(1)}% APR` : `${costBorrowing.toFixed(1)}% APR`;
      verdictSummary = isTa
        ? `மாதம் ${bidMonth}-ல் ஏலம் எடுப்பது ${costBorrowing.toFixed(1)}% வட்டி விகிதத்தில் கிடைக்கிறது, இது வழக்கமான வங்கிக் கடன்களை விட குறைவான வட்டியாகும்.`
        : `Borrowing in Month ${bidMonth} gives an effective interest rate of ${costBorrowing.toFixed(1)}%, beating standard personal loans.`;
    }
  } else {
    // Investor / Saver
    const gainXirr = effectiveAnnualXirr;
    if (gainXirr > fdRatePercent) {
      verdictTone = "gain";
      const diff = (gainXirr - fdRatePercent).toFixed(1);
      verdictHeadline = isTa ? `${gainXirr.toFixed(1)}% XIRR` : `${gainXirr.toFixed(1)}% XIRR`;
      verdictSummary = isTa
        ? `முழு காலமும் தொடர்வதன் மூலம் உங்கள் ஆண்டு வருமானம் ${gainXirr.toFixed(1)}% — இது வங்கி FD (${fdRatePercent}%)-ஐ விட ${diff}% அதிகம்.`
        : `By staying till the end, your effective return is ${gainXirr.toFixed(1)}% p.a. — outperforming bank FDs (${fdRatePercent}%) by ${diff} points.`;
    } else {
      verdictTone = "cost";
      verdictHeadline = isTa ? `${gainXirr.toFixed(1)}% XIRR` : `${gainXirr.toFixed(1)}% XIRR`;
      verdictSummary = isTa
        ? `${gainXirr.toFixed(1)}% லாபப்பங்கு வருமானம் பாதுகாப்பான வங்கி FD-களை விடக் குறைவாகும், மேலும் இதில் வங்கி வைப்பு நிதி காப்பீடும் இல்லை.`
        : `Dividend return of ${gainXirr.toFixed(1)}% trails safe bank fixed deposits without providing regulatory deposit insurance.`;
    }
  }

  return {
    monthlyInstallmentNominal,
    actualTakeHomePrize,
    foremanCommission,
    totalDistributedDividend: totalDistributedDividendPool,
    averageMonthlyPayment: totalPaidOverTenure / months,
    totalPaidOverTenure,
    effectiveXirrPercent: Math.abs(effectiveAnnualXirr),
    personalLoanRatePercent,
    fdRatePercent,
    verdictTone,
    verdictHeadline,
    verdictSummary,
    schedule,
  };
}

// -------------------------------------------------------------
// SALARY & INCOME TAX ENGINE (Old vs New Regime)
// -------------------------------------------------------------

export interface TaxParams {
  grossAnnualSalary: number; // CTC or Gross salary
  basicSalaryAnnual: number; // Basic pay (used for HRA)
  hraReceivedAnnual: number;
  rentPaidAnnual: number;
  isMetroCity: boolean; // 50% vs 40% for HRA
  section80C: number;
  section80D: number;
  section24b: number; // Home Loan Interest
  nps80CCD1B: number;
  otherDeductions: number;
  /** e.g. "2025-26". Defaults to the latest supported year — see `@/lib/tax`. */
  financialYear?: string;
  lang?: "en" | "ta";
}

export interface TaxRegimeResult {
  regime: "Old" | "New";
  grossSalary: number;
  totalExemptionsAndDeductions: number;
  taxableIncome: number;
  taxBeforeCess: number;
  rebate87A: number;
  cess: number;
  totalTax: number;
  monthlyInHand: number;
  effectiveTaxRatePercent: number;
  breakdown: { slab: string; rate: string; tax: number }[];
}

export interface IncomeTaxComparisonResult {
  financialYear: string;
  lastUpdated: string;
  oldRegime: TaxRegimeResult;
  newRegime: TaxRegimeResult;
  optimalRegime: "Old" | "New" | "Equal";
  annualSavings: number;
  monthlySavings: number;
  breakevenDeductionNeeded: number;
  verdictHeadline: string;
  verdictSummary: string;
}

/**
 * Progressive slab tax for one regime's bracket structure, plus a display
 * breakdown covering every bracket (₹0 rows included for brackets the income
 * doesn't reach, so the full slab structure is always visible).
 */
function computeSlabTax(
  taxableIncome: number,
  slabs: TaxSlab[]
): { tax: number; breakdown: { slab: string; rate: string; tax: number }[] } {
  let tax = 0;
  let lowerBound = 0;
  const breakdown: { slab: string; rate: string; tax: number }[] = [];

  for (const bracket of slabs) {
    const upperBound = bracket.upTo ?? Infinity;
    const amountInBracket = Math.max(0, Math.min(taxableIncome, upperBound) - lowerBound);
    const taxForBracket = (amountInBracket * bracket.ratePercent) / 100;
    tax += taxForBracket;

    breakdown.push({
      slab:
        bracket.upTo === null
          ? `Above ₹${lowerBound.toLocaleString("en-IN")}`
          : lowerBound === 0
          ? `Up to ₹${bracket.upTo.toLocaleString("en-IN")}`
          : `₹${(lowerBound + 1).toLocaleString("en-IN")} – ₹${bracket.upTo.toLocaleString("en-IN")}`,
      rate: bracket.ratePercent === 0 ? "Nil" : `${bracket.ratePercent}%`,
      tax: taxForBracket,
    });

    lowerBound = upperBound;
  }

  return { tax, breakdown };
}

/** Old Regime total tax (incl. 87A rebate and cess) for a given deduction total — used to search for the breakeven point. */
function oldRegimeTaxForDeductions(
  grossAnnualSalary: number,
  totalDeductions: number,
  oldRegime: OldRegimeRules
): number {
  const taxableIncome = Math.max(0, grossAnnualSalary - totalDeductions);
  let tax = computeSlabTax(taxableIncome, oldRegime.slabs).tax;
  if (taxableIncome <= oldRegime.rebateTaxableIncomeLimit) tax = 0;
  return tax + (tax * oldRegime.cessPercent) / 100;
}

/**
 * Minimum total Old Regime deductions needed to bring its tax at or below
 * `targetTax` (the New Regime's tax), found by binary search since Old
 * Regime tax is non-increasing as deductions rise.
 */
function computeBreakevenDeductions(
  grossAnnualSalary: number,
  targetTax: number,
  oldRegime: OldRegimeRules
): number {
  let lo = 0;
  let hi = grossAnnualSalary;
  for (let i = 0; i < 40; i++) {
    const mid = (lo + hi) / 2;
    if (oldRegimeTaxForDeductions(grossAnnualSalary, mid, oldRegime) <= targetTax) {
      hi = mid;
    } else {
      lo = mid;
    }
  }
  return Math.round(hi);
}

export function calculateIncomeTax(params: TaxParams): IncomeTaxComparisonResult {
  const {
    grossAnnualSalary,
    basicSalaryAnnual,
    hraReceivedAnnual,
    rentPaidAnnual,
    isMetroCity,
    section80C,
    section80D,
    section24b,
    nps80CCD1B,
    otherDeductions,
    financialYear = LATEST_TAX_YEAR,
    lang = "en",
  } = params;
  const isTa = lang === "ta";
  const rules = getTaxYearRules(financialYear);

  // 1. HRA Exemption (Old Regime)
  let hraExemption = 0;
  if (hraReceivedAnnual > 0 && rentPaidAnnual > 0) {
    const basicLimit =
      (basicSalaryAnnual *
        (isMetroCity ? rules.oldRegime.hra.metroPercent : rules.oldRegime.hra.nonMetroPercent)) /
      100;
    const rentMinusTenPercentBasic = Math.max(0, rentPaidAnnual - basicSalaryAnnual * 0.1);
    hraExemption = Math.min(hraReceivedAnnual, basicLimit, rentMinusTenPercentBasic);
  }

  const capped80C = Math.min(rules.oldRegime.section80CMax, Math.max(0, section80C));
  const capped80D = Math.min(rules.oldRegime.section80DMax, Math.max(0, section80D));
  const capped24b = Math.min(rules.oldRegime.section24bMax, Math.max(0, section24b));
  const cappedNPS = Math.min(rules.oldRegime.nps80CCD1BMax, Math.max(0, nps80CCD1B));

  const totalOldDeductions =
    rules.oldRegime.standardDeduction +
    hraExemption +
    capped80C +
    capped80D +
    capped24b +
    cappedNPS +
    Math.max(0, otherDeductions);

  const oldTaxableIncome = Math.max(0, grossAnnualSalary - totalOldDeductions);
  const { tax: oldSlabTax, breakdown: oldBreakdown } = computeSlabTax(
    oldTaxableIncome,
    rules.oldRegime.slabs
  );

  let oldTax = oldSlabTax;
  let oldRebate87A = 0;
  if (oldTaxableIncome <= rules.oldRegime.rebateTaxableIncomeLimit) {
    oldRebate87A = oldTax;
    oldTax = 0;
  }
  const oldCess = (oldTax * rules.oldRegime.cessPercent) / 100;
  const totalOldTax = oldTax + oldCess;
  const oldMonthlyInHand = (grossAnnualSalary - totalOldTax) / 12;

  // -----------------------------------------------------------
  // 2. New Regime
  const newTaxableIncome = Math.max(0, grossAnnualSalary - rules.newRegime.standardDeduction);
  const { tax: newSlabTax, breakdown: newBreakdown } = computeSlabTax(
    newTaxableIncome,
    rules.newRegime.slabs
  );

  let newTax = newSlabTax;
  let newRebate87A = 0;
  if (newTaxableIncome <= rules.newRegime.rebateTaxableIncomeLimit) {
    newRebate87A = newTax;
    newTax = 0;
  }
  const newCess = (newTax * rules.newRegime.cessPercent) / 100;
  const totalNewTax = newTax + newCess;
  const newMonthlyInHand = (grossAnnualSalary - totalNewTax) / 12;

  const breakevenDeductionNeeded = computeBreakevenDeductions(
    grossAnnualSalary,
    totalNewTax,
    rules.oldRegime
  );

  let optimalRegime: "Old" | "New" | "Equal" = "Equal";
  let annualSavings = 0;
  let verdictHeadline = isTa ? "வரி சமமானது" : "Tax is Equal";
  let verdictSummary = isTa
    ? "இரண்டு வரி முறைகளிலும் வரிச் சுமை சமமாகவே உள்ளது."
    : "Both tax regimes result in the exact same tax liability.";

  if (totalOldTax < totalNewTax) {
    optimalRegime = "Old";
    annualSavings = totalNewTax - totalOldTax;
    verdictHeadline = isTa
      ? `₹${Math.round(annualSavings).toLocaleString("en-IN")}/ஆண்டு`
      : `₹${Math.round(annualSavings).toLocaleString("en-IN")}/yr`;
    verdictSummary = isTa
      ? `பழைய வரி முறை ஆண்டுக்கு ₹${Math.round(annualSavings).toLocaleString(
          "en-IN"
        )} சேமிக்கிறது (மாதம் +₹${Math.round(annualSavings / 12).toLocaleString(
          "en-IN"
        )} கைக்கு வரும் சம்பளம்), ஏனெனில் உங்கள் மொத்தக் கழிவுகள் (₹${Math.round(
          totalOldDeductions
        ).toLocaleString("en-IN")}) சமநிலை வரம்பை விட அதிகம்.`
      : `Old Regime wins by ₹${Math.round(annualSavings).toLocaleString(
          "en-IN"
        )} per year (+₹${Math.round(annualSavings / 12).toLocaleString(
          "en-IN"
        )}/mo in-hand) because your total deductions (₹${Math.round(
          totalOldDeductions
        ).toLocaleString("en-IN")}) exceed the breakeven mark.`;
  } else if (totalNewTax < totalOldTax) {
    optimalRegime = "New";
    annualSavings = totalOldTax - totalNewTax;
    verdictHeadline = isTa
      ? `₹${Math.round(annualSavings).toLocaleString("en-IN")}/ஆண்டு`
      : `₹${Math.round(annualSavings).toLocaleString("en-IN")}/yr`;
    verdictSummary = isTa
      ? `புதிய வரி முறை ஆண்டுக்கு ₹${Math.round(annualSavings).toLocaleString(
          "en-IN"
        )} சேமிக்கிறது (மாதம் +₹${Math.round(annualSavings / 12).toLocaleString(
          "en-IN"
        )} கைக்கு வரும் சம்பளம்), இதில் முதலீட்டு லாக்-இன் தேவையில்லை மற்றும் வரி அடுக்குகள் குறைவு.`
      : `New Regime wins by ₹${Math.round(annualSavings).toLocaleString(
          "en-IN"
        )} per year (+₹${Math.round(annualSavings / 12).toLocaleString(
          "en-IN"
        )}/mo in-hand) with zero investment lock-in and lower baseline tax slabs.`;
  }

  return {
    financialYear: rules.financialYear,
    lastUpdated: rules.lastUpdated,
    oldRegime: {
      regime: "Old",
      grossSalary: grossAnnualSalary,
      totalExemptionsAndDeductions: totalOldDeductions,
      taxableIncome: oldTaxableIncome,
      taxBeforeCess: oldTax + oldRebate87A,
      rebate87A: oldRebate87A,
      cess: oldCess,
      totalTax: totalOldTax,
      monthlyInHand: oldMonthlyInHand,
      effectiveTaxRatePercent: grossAnnualSalary > 0 ? (totalOldTax / grossAnnualSalary) * 100 : 0,
      breakdown: oldBreakdown,
    },
    newRegime: {
      regime: "New",
      grossSalary: grossAnnualSalary,
      totalExemptionsAndDeductions: rules.newRegime.standardDeduction,
      taxableIncome: newTaxableIncome,
      taxBeforeCess: newTax + newRebate87A,
      rebate87A: newRebate87A,
      cess: newCess,
      totalTax: totalNewTax,
      monthlyInHand: newMonthlyInHand,
      effectiveTaxRatePercent: grossAnnualSalary > 0 ? (totalNewTax / grossAnnualSalary) * 100 : 0,
      breakdown: newBreakdown,
    },
    optimalRegime,
    annualSavings,
    monthlySavings: annualSavings / 12,
    breakevenDeductionNeeded,
    verdictHeadline,
    verdictSummary,
  };
}

// -------------------------------------------------------------
// INVESTMENTS & SIP ENGINE (Step-Up & Real Returns)
// -------------------------------------------------------------

export interface SIPParams {
  monthlySIP: number;
  tenureYears: number;
  expectedAnnualReturnPercent: number; // e.g. 12%
  inflationRatePercent: number; // e.g. 6%
  annualStepUpPercent: number; // e.g. 10%
  ltcgTaxPercent: number; // e.g. 12.5%
  lang?: "en" | "ta";
}

export interface SIPYearlyItem {
  year: number;
  monthlyAmount: number;
  investedThisYear: number;
  totalInvestedTillDate: number;
  nominalCorpus: number;
  realPurchasingPower: number;
  gains: number;
}

export interface SIPResult {
  totalInvested: number;
  nominalFutureCorpus: number;
  totalGains: number;
  ltcgTaxAmount: number;
  postTaxNominalCorpus: number;
  realPurchasingPowerToday: number;
  realEffectiveCAGRPercent: number;
  bankFdNominalCorpus: number;
  bankFdRealPower: number;
  wealthMultiplier: number;
  yearlySchedule: SIPYearlyItem[];
  verdictHeadline: string;
  verdictSummary: string;
}

export function calculateSIPRealReturn(params: SIPParams): SIPResult {
  const {
    monthlySIP,
    tenureYears,
    expectedAnnualReturnPercent,
    inflationRatePercent,
    annualStepUpPercent,
    ltcgTaxPercent,
    lang = "en",
  } = params;
  const isTa = lang === "ta";

  let currentMonthly = monthlySIP;
  let totalInvested = 0;
  let currentNominalCorpus = 0;
  let currentFdCorpus = 0;

  const yearlySchedule: SIPYearlyItem[] = [];
  const monthlyRate = expectedAnnualReturnPercent / 12 / 100;
  const monthlyFdRate = 0.07 / 12; // Standard 7% bank FD

  for (let y = 1; y <= tenureYears; y++) {
    let investedThisYear = 0;

    for (let m = 1; m <= 12; m++) {
      currentNominalCorpus = (currentNominalCorpus + currentMonthly) * (1 + monthlyRate);
      currentFdCorpus = (currentFdCorpus + currentMonthly) * (1 + monthlyFdRate);
      investedThisYear += currentMonthly;
      totalInvested += currentMonthly;
    }

    const inflationDiscountFactor = Math.pow(1 + inflationRatePercent / 100, y);
    const realPower = currentNominalCorpus / inflationDiscountFactor;

    yearlySchedule.push({
      year: y,
      monthlyAmount: currentMonthly,
      investedThisYear,
      totalInvestedTillDate: totalInvested,
      nominalCorpus: currentNominalCorpus,
      realPurchasingPower: realPower,
      gains: currentNominalCorpus - totalInvested,
    });

    if (annualStepUpPercent > 0) {
      currentMonthly = currentMonthly * (1 + annualStepUpPercent / 100);
    }
  }

  const totalGains = Math.max(0, currentNominalCorpus - totalInvested);

  // LTCG Tax under budget: 12.5% on gains exceeding ₹1.25 Lakh (cumulative exemption)
  const taxableGains = Math.max(0, totalGains - 125000);
  const ltcgTaxAmount = (taxableGains * ltcgTaxPercent) / 100;
  const postTaxNominalCorpus = currentNominalCorpus - ltcgTaxAmount;

  // Real purchasing power today
  const finalInflationFactor = Math.pow(1 + inflationRatePercent / 100, tenureYears);
  const realPurchasingPowerToday = postTaxNominalCorpus / finalInflationFactor;

  // Real effective CAGR = ((1 + nominalRate)/(1 + inflation) - 1) - tax drag
  const nominalFactor = 1 + expectedAnnualReturnPercent / 100;
  const inflationFactor = 1 + inflationRatePercent / 100;
  const realEffectiveCAGRPercent =
    ((nominalFactor / inflationFactor - 1) * 100) - (ltcgTaxAmount / totalInvested) * 0.5;

  const fdFinalInflation = currentFdCorpus / finalInflationFactor;
  const wealthMultiplier = totalInvested > 0 ? currentNominalCorpus / totalInvested : 1;

  const verdictHeadline = isTa
    ? `${Math.max(0, realEffectiveCAGRPercent).toFixed(1)}% உண்மை வளர்ச்சி`
    : `${Math.max(0, realEffectiveCAGRPercent).toFixed(1)}% Real`;
  const verdictSummary = isTa
    ? `உங்கள் பெயரளவு ${expectedAnnualReturnPercent}% CAGR வருமானம், 12.5% LTCG வரிக்குப் பிறகு ஆண்டுக்கு ${Math.max(
        0,
        realEffectiveCAGRPercent
      ).toFixed(1)}% உண்மையான வாங்கும் திறனை உருவாக்குகிறது — இது வங்கி FD (${(
        (1.07 / (1 + inflationRatePercent / 100) - 1) *
        100
      ).toFixed(1)}%)-ஐ விட ${(
        currentNominalCorpus / Math.max(1, currentFdCorpus)
      ).toFixed(1)} மடங்கு அதிகம்.`
    : `Your nominal ${expectedAnnualReturnPercent}% CAGR delivers ${Math.max(
        0,
        realEffectiveCAGRPercent
      ).toFixed(1)}% in true inflation-adjusted purchasing power after 12.5% LTCG tax — outpacing bank FDs (${(
        (1.07 / (1 + inflationRatePercent / 100) - 1) *
        100
      ).toFixed(1)}% real) by ${(
        currentNominalCorpus / Math.max(1, currentFdCorpus)
      ).toFixed(1)}×.`;

  return {
    totalInvested,
    nominalFutureCorpus: currentNominalCorpus,
    totalGains,
    ltcgTaxAmount,
    postTaxNominalCorpus,
    realPurchasingPowerToday,
    realEffectiveCAGRPercent: Math.max(0, realEffectiveCAGRPercent),
    bankFdNominalCorpus: currentFdCorpus,
    bankFdRealPower: fdFinalInflation,
    wealthMultiplier,
    yearlySchedule,
    verdictHeadline,
    verdictSummary,
  };
}

// -------------------------------------------------------------
// LOANS & PREPAYMENT ENGINE
// -------------------------------------------------------------

export interface LoanPrepaymentParams {
  loanPrincipal: number; // e.g. ₹40,00,000
  annualInterestRatePercent: number; // e.g. 8.75%
  tenureYears: number; // e.g. 20 years
  prepaymentType: "lumpSum" | "monthlyExtra" | "yearlyExtra";
  lumpSumAmount: number; // e.g. ₹2,00,000
  lumpSumMonth: number; // e.g. Month 36 (Year 3)
  extraMonthlyAmount: number; // e.g. ₹5,000 extra per month
  extraYearlyAmount: number; // e.g. ₹50,000 extra per year
  lang?: "en" | "ta";
}

export interface LoanAmortizationYear {
  year: number;
  startingBalance: number;
  principalPaid: number;
  interestPaid: number;
  extraPrepaymentPaid: number;
  endingBalance: number;
}

export interface LoanPrepaymentResult {
  standardMonthlyEMI: number;
  originalTotalInterest: number;
  originalTotalPayment: number;
  newTotalInterest: number;
  newTotalPayment: number;
  totalInterestSaved: number;
  originalTenureMonths: number;
  newTenureMonths: number;
  monthsSaved: number;
  yearsSaved: number;
  effectivePrepaymentRatePercent: number;
  verdictHeadline: string;
  verdictSummary: string;
  yearlySchedule: LoanAmortizationYear[];
}

export function calculateLoanPrepayment(
  params: LoanPrepaymentParams
): LoanPrepaymentResult {
  const {
    loanPrincipal,
    annualInterestRatePercent,
    tenureYears,
    prepaymentType,
    lumpSumAmount,
    lumpSumMonth,
    extraMonthlyAmount,
    extraYearlyAmount,
    lang = "en",
  } = params;
  const isTa = lang === "ta";

  const originalTenureMonths = tenureYears * 12;
  const standardMonthlyEMI = emi(
    loanPrincipal,
    annualInterestRatePercent,
    originalTenureMonths
  );
  const originalTotalInterest =
    standardMonthlyEMI * originalTenureMonths - loanPrincipal;
  const originalTotalPayment = loanPrincipal + originalTotalInterest;

  const monthlyRate = annualInterestRatePercent / 12 / 100;

  let balance = loanPrincipal;
  let newTotalInterest = 0;
  let newTotalPayment = 0;
  let month = 0;

  const yearlySchedule: LoanAmortizationYear[] = [];
  let currentYearPrincipal = 0;
  let currentYearInterest = 0;
  let currentYearPrepayment = 0;
  let yearStartBalance = balance;

  while (balance > 0.01 && month < originalTenureMonths * 2) {
    month++;
    const interestForMonth = balance * monthlyRate;
    const principalForMonth = standardMonthlyEMI - interestForMonth;

    let extraThisMonth = 0;
    if (prepaymentType === "lumpSum" && month === lumpSumMonth) {
      extraThisMonth += lumpSumAmount;
    } else if (prepaymentType === "monthlyExtra") {
      extraThisMonth += extraMonthlyAmount;
    } else if (prepaymentType === "yearlyExtra" && month % 12 === 0) {
      extraThisMonth += extraYearlyAmount;
    }

    if (principalForMonth + extraThisMonth >= balance) {
      // Last payment
      const actualPrincipal = balance;
      newTotalInterest += interestForMonth;
      newTotalPayment += actualPrincipal + interestForMonth;

      currentYearPrincipal += actualPrincipal;
      currentYearInterest += interestForMonth;
      currentYearPrepayment += Math.max(0, actualPrincipal - principalForMonth);
      balance = 0;
    } else {
      balance -= principalForMonth + extraThisMonth;
      newTotalInterest += interestForMonth;
      newTotalPayment += principalForMonth + interestForMonth + extraThisMonth;

      currentYearPrincipal += principalForMonth;
      currentYearInterest += interestForMonth;
      currentYearPrepayment += extraThisMonth;
    }

    if (month % 12 === 0 || balance === 0) {
      const yearNumber = Math.ceil(month / 12);
      yearlySchedule.push({
        year: yearNumber,
        startingBalance: yearStartBalance,
        principalPaid: currentYearPrincipal,
        interestPaid: currentYearInterest,
        extraPrepaymentPaid: currentYearPrepayment,
        endingBalance: Math.max(0, balance),
      });
      yearStartBalance = balance;
      currentYearPrincipal = 0;
      currentYearInterest = 0;
      currentYearPrepayment = 0;
    }
  }

  const newTenureMonths = month;
  const monthsSaved = Math.max(0, originalTenureMonths - newTenureMonths);
  const yearsSaved = Number((monthsSaved / 12).toFixed(1));
  const totalInterestSaved = Math.max(0, originalTotalInterest - newTotalInterest);

  // Prepaying avoids future interest at the loan's own rate — this is a
  // reduction in a known liability, not an investment return, so it isn't
  // described as a "yield" or "guaranteed"/"risk-free" here.
  const effectivePrepaymentRatePercent = annualInterestRatePercent;

  const savedInLakhs = (totalInterestSaved / 100000).toFixed(2);
  const verdictHeadline = isTa ? `₹${savedInLakhs} இலட்சம் சேமிப்பு` : `₹${savedInLakhs} Lakh`;
  const verdictSummary = isTa
    ? `உங்கள் கடனில் ${monthsSaved} மாதங்கள் (${yearsSaved} ஆண்டுகள்) குறைகிறது மற்றும் ₹${Math.round(
        totalInterestSaved
      ).toLocaleString(
        "en-IN"
      )} வட்டி சேமிக்கப்படுகிறது — இது தோராயமாக உங்கள் கடனின் ${annualInterestRatePercent}% வட்டி விகிதத்திற்குச் சமமான சேமிப்பாகும், வங்கி விதிமுறைகளுக்கு உட்பட்டது.`
    : `You cut ${monthsSaved} months (${yearsSaved} years) off your loan and save ₹${Math.round(
        totalInterestSaved
      ).toLocaleString(
        "en-IN"
      )} in interest — a saving roughly equivalent to your loan's own ${annualInterestRatePercent}% rate, subject to your lender's terms and any tax treatment that applies to you.`;

  return {
    standardMonthlyEMI,
    originalTotalInterest,
    originalTotalPayment,
    newTotalInterest,
    newTotalPayment,
    totalInterestSaved,
    originalTenureMonths,
    newTenureMonths,
    monthsSaved,
    yearsSaved,
    effectivePrepaymentRatePercent,
    verdictHeadline,
    verdictSummary,
    yearlySchedule,
  };
}
