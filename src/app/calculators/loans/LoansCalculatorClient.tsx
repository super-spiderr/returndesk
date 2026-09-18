"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import SiteNav from "@/components/SiteNav";
import SiteFooter from "@/components/SiteFooter";
import BlackSlab from "@/components/BlackSlab";
import Breadcrumbs from "@/components/Breadcrumbs";
import RelatedCalculators from "@/components/RelatedCalculators";
import FAQ from "@/components/FAQ";
import { calculateLoanPrepayment } from "@/lib/finance";
import { useLanguage, interpolate } from "@/lib/i18n";

export default function LoansCalculatorClient() {
  const { lang, t } = useLanguage();
  const l = t.loansCalc;

  const [loanPrincipal, setLoanPrincipal] = useState(4000000);
  const [annualRate, setAnnualRate] = useState(8.75);
  const [tenureYears, setTenureYears] = useState(20);
  const [prepaymentType, setPrepaymentType] = useState<"lumpSum" | "monthlyExtra" | "yearlyExtra">("lumpSum");
  const [lumpSumAmount, setLumpSumAmount] = useState(200000);
  const [lumpSumYear, setLumpSumYear] = useState(3);
  const [extraMonthly, setExtraMonthly] = useState(5000);
  const [extraYearly, setExtraYearly] = useState(50000);

  const result = useMemo(() => {
    return calculateLoanPrepayment({
      loanPrincipal,
      annualInterestRatePercent: annualRate,
      tenureYears,
      prepaymentType,
      lumpSumAmount,
      lumpSumMonth: lumpSumYear * 12,
      extraMonthlyAmount: extraMonthly,
      extraYearlyAmount: extraYearly,
      lang,
    });
  }, [
    loanPrincipal,
    annualRate,
    tenureYears,
    prepaymentType,
    lumpSumAmount,
    lumpSumYear,
    extraMonthly,
    extraYearly,
    lang,
  ]);

  const valueAxisPercent = Math.min(
    Math.max((result.totalInterestSaved / Math.max(1, result.originalTotalInterest)) * 100, 10),
    90
  );

  return (
    <div className="relative overflow-hidden bg-wash text-ink min-h-screen">
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
        <SiteNav />

        <Breadcrumbs
          items={[
            { label: t.nav.breadcrumbHome, href: "/" },
            { label: t.nav.breadcrumbCalculators, href: "/#calculators" },
            { label: l.title },
          ]}
        />

        {/* Header with Illustration */}
        <div className="grid items-center gap-8 pt-10 pb-8 [grid-template-columns:repeat(auto-fit,minmax(300px,1fr))]">
          <div className="max-w-2xl">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-rule bg-paper px-3 py-1 text-xs font-bold text-muted">
              <span className="h-1.5 w-1.5 rounded-full bg-ink" />
              {l.badge}
            </div>
            <h1
              className="m-0 mb-3 font-black text-ink tracking-tight"
              style={{
                fontSize: "clamp(30px, 4.5vw, 48px)",
                lineHeight: 1.1,
              }}
            >
              {l.title}
            </h1>
            <p className="m-0 text-base sm:text-lg leading-relaxed text-muted">
              {l.subtitle}
            </p>
          </div>
          <div className="relative flex justify-center sm:justify-end">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 -z-10 rounded-full bg-ink/5 blur-3xl"
            />
            <Image
              src="/images/loans-prepayment.webp"
              alt="Illustration of home loan prepayment trajectory and accelerating debt freedom"
              width={1000}
              height={750}
              priority
              className="h-[220px] sm:h-[280px] w-full object-contain"
            />
          </div>
        </div>

        {/* 2-Column Interface */}
        <div className="grid gap-8 lg:grid-cols-12 pb-16">
          {/* Left Column: Inputs */}
          <div className="lg:col-span-6 space-y-6">
            <div className="rounded-2xl border border-rule bg-paper p-6 sm:p-7 shadow-xs space-y-6">
              <h2 className="text-xs font-extrabold uppercase tracking-widest text-muted">
                {l.detailsSection}
              </h2>

              {/* Loan Amount */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-bold text-ink">{l.principalLabel}</label>
                  <span className="font-extrabold text-ink tabular-nums text-base">
                    ₹{(loanPrincipal / 100000).toFixed(2)} {t.common.lakh}
                  </span>
                </div>
                <input
                  type="range"
                  min={500000}
                  max={20000000}
                  step={100000}
                  value={loanPrincipal}
                  onChange={(e) => setLoanPrincipal(Number(e.target.value))}
                  className="w-full accent-ink cursor-pointer"
                />
                <div className="flex justify-between text-[11px] text-muted mt-1">
                  <span>₹5 {t.common.lakh}</span>
                  <span>₹1 {t.common.crore}</span>
                  <span>₹2 {t.common.crore}</span>
                </div>
              </div>

              {/* Interest Rate */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-bold text-ink">{l.rateLabel}</label>
                  <span className="font-extrabold text-ink tabular-nums text-base">
                    {annualRate}% {t.common.pa}
                  </span>
                </div>
                <input
                  type="range"
                  min={7.0}
                  max={15.0}
                  step={0.1}
                  value={annualRate}
                  onChange={(e) => setAnnualRate(Number(e.target.value))}
                  className="w-full accent-ink cursor-pointer"
                />
                <div className="flex justify-between text-[11px] text-muted mt-1">
                  <span>7.0%</span>
                  <span>{l.rateAvgHint}</span>
                  <span>15.0%</span>
                </div>
              </div>

              {/* Tenure Years */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-bold text-ink">{l.tenureLabel}</label>
                  <span className="font-extrabold text-ink tabular-nums text-base">
                    {tenureYears} {t.common.years} ({tenureYears * 12} {t.common.months})
                  </span>
                </div>
                <input
                  type="range"
                  min={5}
                  max={30}
                  step={1}
                  value={tenureYears}
                  onChange={(e) => setTenureYears(Number(e.target.value))}
                  className="w-full accent-ink cursor-pointer"
                />
                <div className="flex justify-between text-[11px] text-muted mt-1">
                  <span>5 {t.common.years}</span>
                  <span>20 {t.common.years}</span>
                  <span>30 {t.common.years}</span>
                </div>
              </div>

              {/* Prepayment Strategy */}
              <div className="border-t border-rule pt-6 space-y-4">
                <h2 className="text-xs font-extrabold uppercase tracking-widest text-muted">
                  {l.strategySection}
                </h2>

                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setPrepaymentType("lumpSum")}
                    className={`rounded-lg p-2.5 text-xs font-bold text-center cursor-pointer border ${
                      prepaymentType === "lumpSum"
                        ? "bg-ink text-paper border-ink shadow-xs"
                        : "bg-wash text-muted border-rule"
                    }`}
                  >
                    {l.lumpSumBtn}
                  </button>
                  <button
                    type="button"
                    onClick={() => setPrepaymentType("monthlyExtra")}
                    className={`rounded-lg p-2.5 text-xs font-bold text-center cursor-pointer border ${
                      prepaymentType === "monthlyExtra"
                        ? "bg-ink text-paper border-ink shadow-xs"
                        : "bg-wash text-muted border-rule"
                    }`}
                  >
                    {l.extraMonthlyBtn}
                  </button>
                  <button
                    type="button"
                    onClick={() => setPrepaymentType("yearlyExtra")}
                    className={`rounded-lg p-2.5 text-xs font-bold text-center cursor-pointer border ${
                      prepaymentType === "yearlyExtra"
                        ? "bg-ink text-paper border-ink shadow-xs"
                        : "bg-wash text-muted border-rule"
                    }`}
                  >
                    {l.extraYearlyBtn}
                  </button>
                </div>

                {prepaymentType === "lumpSum" && (
                  <div className="space-y-4 pt-2">
                    <div>
                      <div className="flex justify-between items-center mb-1 text-xs font-bold text-muted">
                        <span>{l.lumpSumAmountLabel}</span>
                        <span className="text-ink">₹{lumpSumAmount.toLocaleString("en-IN")}</span>
                      </div>
                      <input
                        type="range"
                        min={25000}
                        max={2000000}
                        step={25000}
                        value={lumpSumAmount}
                        onChange={(e) => setLumpSumAmount(Number(e.target.value))}
                        className="w-full accent-ink cursor-pointer"
                      />
                    </div>
                    <div>
                      <div className="flex justify-between items-center mb-1 text-xs font-bold text-muted">
                        <span>{l.prepayAtYearLabel}</span>
                        <span className="text-ink">{t.common.year} {lumpSumYear}</span>
                      </div>
                      <input
                        type="range"
                        min={1}
                        max={tenureYears - 1}
                        step={1}
                        value={lumpSumYear}
                        onChange={(e) => setLumpSumYear(Number(e.target.value))}
                        className="w-full accent-ink cursor-pointer"
                      />
                    </div>
                  </div>
                )}

                {prepaymentType === "monthlyExtra" && (
                  <div className="pt-2">
                    <div className="flex justify-between items-center mb-1 text-xs font-bold text-muted">
                      <span>{l.extraMonthlyAddedLabel}</span>
                      <span className="text-ink">+₹{extraMonthly.toLocaleString("en-IN")}{t.common.perMonth}</span>
                    </div>
                    <input
                      type="range"
                      min={1000}
                      max={50000}
                      step={1000}
                      value={extraMonthly}
                      onChange={(e) => setExtraMonthly(Number(e.target.value))}
                      className="w-full accent-ink cursor-pointer"
                    />
                  </div>
                )}

                {prepaymentType === "yearlyExtra" && (
                  <div className="pt-2">
                    <div className="flex justify-between items-center mb-1 text-xs font-bold text-muted">
                      <span>{l.extraYearlyAddedLabel}</span>
                      <span className="text-ink">+₹{extraYearly.toLocaleString("en-IN")}{t.common.perYear}</span>
                    </div>
                    <input
                      type="range"
                      min={10000}
                      max={500000}
                      step={10000}
                      value={extraYearly}
                      onChange={(e) => setExtraYearly(Number(e.target.value))}
                      className="w-full accent-ink cursor-pointer"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Quick Metrics Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div className="rounded-xl border border-rule bg-paper p-4">
                <div className="text-xs text-muted font-semibold">{l.quickSummary.standardEmi}</div>
                <div className="text-lg font-black text-ink mt-1 tabular-nums">
                  ₹{Math.round(result.standardMonthlyEMI).toLocaleString("en-IN")}
                </div>
              </div>
              <div className="rounded-xl border border-rule bg-paper p-4">
                <div className="text-xs text-muted font-semibold">{l.quickSummary.tenureShaved}</div>
                <div className="text-lg font-black text-emerald-800 mt-1 tabular-nums">
                  {result.yearsSaved} {t.common.years}
                </div>
              </div>
              <div className="rounded-xl border border-rule bg-paper p-4 col-span-2 sm:col-span-1">
                <div className="text-xs text-muted font-semibold">{l.quickSummary.interestSaved}</div>
                <div className="text-lg font-black text-emerald-800 mt-1 tabular-nums">
                  ₹{(result.totalInterestSaved / 100000).toFixed(2)} {t.common.lakh}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Verdict Slab */}
          <div className="lg:col-span-6 flex flex-col justify-between space-y-6">
            <BlackSlab
              key={`loans-${lang}`}
              eyebrow={l.verdictEyebrow}
              statement={l.verdictStatement}
              value={result.verdictHeadline}
              tone="gain"
              axis={{
                valuePercent: valueAxisPercent,
                benchmarkPercent: 20,
                valueLabel: interpolate(l.axisWithPrepayment, { years: result.yearsSaved }),
                benchmarkLabel: interpolate(l.axisStandardLoan, { years: tenureYears }),
              }}
              comparison={result.verdictSummary}
              className="shadow-md"
            />

            {/* The Mathematical Rule */}
            <div className="rounded-2xl border border-rule bg-paper p-6">
              <h3 className="text-xs font-black uppercase tracking-wider text-ink mb-3 flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-ink" />
                {l.guaranteedYieldTitle}
              </h3>
              <p className="text-sm leading-relaxed text-muted mb-4">
                {interpolate(l.guaranteedYieldDesc, { rate: annualRate })}
              </p>
              <div className="rounded-lg bg-wash p-3.5 text-xs text-muted space-y-1.5 font-mono">
                <div className="flex justify-between">
                  <span>{l.originalInterest}</span>
                  <span className="font-bold text-ink">₹{Math.round(result.originalTotalInterest).toLocaleString("en-IN")}</span>
                </div>
                <div className="flex justify-between">
                  <span>{l.newInterest}</span>
                  <span className="font-bold text-emerald-700">₹{Math.round(result.newTotalInterest).toLocaleString("en-IN")}</span>
                </div>
                <div className="flex justify-between border-t border-rule pt-1">
                  <span>{l.newClosure}</span>
                  <span className="font-bold text-ink">
                    {interpolate(l.monthsVsOriginal, {
                      newMonths: result.newTenureMonths,
                      origMonths: result.originalTenureMonths,
                    })}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Amortization Schedule Table */}
        <div className="mt-6 mb-16 rounded-2xl border border-rule bg-paper p-6 sm:p-8">
          <h2 className="text-lg font-black text-ink mb-1">{l.tableTitle}</h2>
          <p className="text-xs text-muted mb-6">{l.tableSubtitle}</p>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b-2 border-rule text-xs font-extrabold uppercase text-muted">
                  <th className="py-3 px-3">{l.colYear}</th>
                  <th className="py-3 px-3">{l.colOpeningBalance}</th>
                  <th className="py-3 px-3">{l.colPrincipalPaid}</th>
                  <th className="py-3 px-3">{l.colInterestPaid}</th>
                  <th className="py-3 px-3">{l.colPrepayment}</th>
                  <th className="py-3 px-3">{l.colClosingBalance}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-rule/70">
                {result.yearlySchedule.map((row) => (
                  <tr key={row.year} className="hover:bg-wash/50">
                    <td className="py-3 px-3 tabular-nums font-bold">{t.common.year} {row.year}</td>
                    <td className="py-3 px-3 tabular-nums">₹{Math.round(row.startingBalance).toLocaleString("en-IN")}</td>
                    <td className="py-3 px-3 tabular-nums text-ink font-medium">₹{Math.round(row.principalPaid).toLocaleString("en-IN")}</td>
                    <td className="py-3 px-3 tabular-nums text-rose-700">₹{Math.round(row.interestPaid).toLocaleString("en-IN")}</td>
                    <td className="py-3 px-3 tabular-nums font-bold text-emerald-800">
                      {row.extraPrepaymentPaid > 0 ? `₹${Math.round(row.extraPrepaymentPaid).toLocaleString("en-IN")}` : "—"}
                    </td>
                    <td className="py-3 px-3 tabular-nums font-bold text-ink">
                      ₹{Math.round(row.endingBalance).toLocaleString("en-IN")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <FAQ items={l.faq} heading={t.nav.faqHeading} />

        <RelatedCalculators currentSlug="loans" t={t} heading={t.nav.relatedCalculatorsHeading} />

        <SiteFooter />
      </div>
    </div>
  );
}
