// Shared finance math, written once and reused by every calculator.
// Single source of truth for EMI / Tax / IRR / XIRR / Compounding.

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
  section80C: number; // Max ₹1.5L
  section80D: number; // Health Insurance (₹25k - ₹1L)
  section24b: number; // Home Loan Interest (Max ₹2L)
  nps80CCD1B: number; // NPS additional (Max ₹50k)
  otherDeductions: number;
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
  oldRegime: TaxRegimeResult;
  newRegime: TaxRegimeResult;
  optimalRegime: "Old" | "New" | "Equal";
  annualSavings: number;
  monthlySavings: number;
  breakevenDeductionNeeded: number;
  verdictHeadline: string;
  verdictSummary: string;
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
    lang = "en",
  } = params;
  const isTa = lang === "ta";

  // 1. Calculate HRA Exemption for Old Regime
  let hraExemption = 0;
  if (hraReceivedAnnual > 0 && rentPaidAnnual > 0) {
    const basicLimit = basicSalaryAnnual * (isMetroCity ? 0.5 : 0.4);
    const rentMinusTenPercentBasic = Math.max(0, rentPaidAnnual - basicSalaryAnnual * 0.1);
    hraExemption = Math.min(hraReceivedAnnual, basicLimit, rentMinusTenPercentBasic);
  }

  // Old Regime Deductions
  const oldStandardDeduction = 50000;
  const capped80C = Math.min(150000, Math.max(0, section80C));
  const capped80D = Math.min(100000, Math.max(0, section80D));
  const capped24b = Math.min(200000, Math.max(0, section24b));
  const cappedNPS = Math.min(50000, Math.max(0, nps80CCD1B));

  const totalOldDeductions =
    oldStandardDeduction +
    hraExemption +
    capped80C +
    capped80D +
    capped24b +
    cappedNPS +
    Math.max(0, otherDeductions);

  const oldTaxableIncome = Math.max(0, grossAnnualSalary - totalOldDeductions);

  // Calculate Old Regime Tax Slabs (General Individual < 60y)
  let oldTax = 0;
  const oldBreakdown: { slab: string; rate: string; tax: number }[] = [];

  if (oldTaxableIncome > 1000000) {
    const taxChunk = (oldTaxableIncome - 1000000) * 0.3;
    oldTax += taxChunk;
    oldBreakdown.push({ slab: "Above ₹10,00,000", rate: "30%", tax: taxChunk });
  }
  if (oldTaxableIncome > 500000) {
    const chunk = Math.min(oldTaxableIncome - 500000, 500000);
    const taxChunk = chunk * 0.2;
    oldTax += taxChunk;
    oldBreakdown.push({ slab: "₹5,00,001 – ₹10,00,000", rate: "20%", tax: taxChunk });
  }
  if (oldTaxableIncome > 250000) {
    const chunk = Math.min(oldTaxableIncome - 250000, 250000);
    const taxChunk = chunk * 0.05;
    oldTax += taxChunk;
    oldBreakdown.push({ slab: "₹2,50,001 – ₹5,00,000", rate: "5%", tax: taxChunk });
  }
  oldBreakdown.push({ slab: "Up to ₹2,50,000", rate: "Nil", tax: 0 });

  // Section 87A rebate for Old Regime (up to ₹5L taxable income)
  let oldRebate87A = 0;
  if (oldTaxableIncome <= 500000) {
    oldRebate87A = oldTax;
    oldTax = 0;
  }
  const oldCess = oldTax * 0.04;
  const totalOldTax = oldTax + oldCess;
  const oldMonthlyInHand = (grossAnnualSalary - totalOldTax) / 12;

  // -----------------------------------------------------------
  // 2. Calculate New Regime Tax Slabs (Budget 2024-25 / FY 24-25 / 25-26)
  const newStandardDeduction = 75000;
  const newTaxableIncome = Math.max(0, grossAnnualSalary - newStandardDeduction);

  let newTax = 0;
  const newBreakdown: { slab: string; rate: string; tax: number }[] = [];

  if (newTaxableIncome > 1500000) {
    const chunk = (newTaxableIncome - 1500000) * 0.3;
    newTax += chunk;
    newBreakdown.push({ slab: "Above ₹15,00,000", rate: "30%", tax: chunk });
  }
  if (newTaxableIncome > 1200000) {
    const chunk = Math.min(newTaxableIncome - 1200000, 300000);
    const taxChunk = chunk * 0.2;
    newTax += taxChunk;
    newBreakdown.push({ slab: "₹12,00,001 – ₹15,00,000", rate: "20%", tax: taxChunk });
  }
  if (newTaxableIncome > 1000000) {
    const chunk = Math.min(newTaxableIncome - 1000000, 200000);
    const taxChunk = chunk * 0.15;
    newTax += taxChunk;
    newBreakdown.push({ slab: "₹10,00,001 – ₹12,00,000", rate: "15%", tax: taxChunk });
  }
  if (newTaxableIncome > 700000) {
    const chunk = Math.min(newTaxableIncome - 700000, 300000);
    const taxChunk = chunk * 0.1;
    newTax += taxChunk;
    newBreakdown.push({ slab: "₹7,00,001 – ₹10,00,000", rate: "10%", tax: taxChunk });
  }
  if (newTaxableIncome > 300000) {
    const chunk = Math.min(newTaxableIncome - 300000, 400000);
    const taxChunk = chunk * 0.05;
    newTax += taxChunk;
    newBreakdown.push({ slab: "₹3,00,001 – ₹7,00,000", rate: "5%", tax: taxChunk });
  }
  newBreakdown.push({ slab: "Up to ₹3,00,000", rate: "Nil", tax: 0 });

  // 87A rebate for New Regime
  let newRebate87A = 0;
  if (newTaxableIncome <= 700000) {
    newRebate87A = newTax;
    newTax = 0;
  }
  const newCess = newTax * 0.04;
  const totalNewTax = newTax + newCess;
  const newMonthlyInHand = (grossAnnualSalary - totalNewTax) / 12;

  const breakevenDeductionNeeded = Math.round(
    Math.max(250000, grossAnnualSalary > 1500000 ? 400000 : 350000)
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
      totalExemptionsAndDeductions: newStandardDeduction,
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
  effectiveGuaranteedYieldPercent: number;
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

  // Prepayment yield is guaranteed tax-free equal to the home loan interest rate
  const effectiveGuaranteedYieldPercent = annualInterestRatePercent;

  const savedInLakhs = (totalInterestSaved / 100000).toFixed(2);
  const verdictHeadline = isTa ? `₹${savedInLakhs} இலட்சம் சேமிப்பு` : `₹${savedInLakhs} Lakh`;
  const verdictSummary = isTa
    ? `உங்கள் கடனில் ${monthsSaved} மாதங்கள் (${yearsSaved} ஆண்டுகள்) குறைகிறது மற்றும் ₹${Math.round(
        totalInterestSaved
      ).toLocaleString(
        "en-IN"
      )} வட்டி சேமிக்கப்படுகிறது — இது உறுதியான, ஆபத்தில்லாத, வரி இல்லாத ${annualInterestRatePercent}% வருமானத்திற்குச் சமம்.`
    : `You cut ${monthsSaved} months (${yearsSaved} years) off your loan and save ₹${Math.round(
        totalInterestSaved
      ).toLocaleString(
        "en-IN"
      )} in interest — effectively earning a guaranteed, risk-free ${annualInterestRatePercent}% tax-free yield.`;

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
    effectiveGuaranteedYieldPercent,
    verdictHeadline,
    verdictSummary,
    yearlySchedule,
  };
}
