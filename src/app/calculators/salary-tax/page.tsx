"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import SiteNav from "@/components/SiteNav";
import SiteFooter from "@/components/SiteFooter";
import BlackSlab from "@/components/BlackSlab";
import { calculateIncomeTax } from "@/lib/finance";
import { useLanguage, interpolate } from "@/lib/i18n";

export default function SalaryTaxCalculatorPage() {
  const { lang, t } = useLanguage();
  const s = t.salaryTaxCalc;

  const [grossSalary, setGrossSalary] = useState(1500000);
  const basicPercent = 50;
  const [hraReceived, setHraReceived] = useState(300000);
  const [rentPaid, setRentPaid] = useState(240000);
  const [isMetro, setIsMetro] = useState(true);
  const [section80C, setSection80C] = useState(150000);
  const [section80D, setSection80D] = useState(25000);
  const [section24b, setSection24b] = useState(0);
  const [nps80CCD1B, setNps80CCD1B] = useState(50000);

  const basicSalaryAnnual = (grossSalary * basicPercent) / 100;

  const result = useMemo(() => {
    return calculateIncomeTax({
      grossAnnualSalary: grossSalary,
      basicSalaryAnnual,
      hraReceivedAnnual: hraReceived,
      rentPaidAnnual: rentPaid,
      isMetroCity: isMetro,
      section80C,
      section80D,
      section24b,
      nps80CCD1B,
      otherDeductions: 0,
      lang,
    });
  }, [
    grossSalary,
    basicSalaryAnnual,
    hraReceived,
    rentPaid,
    isMetro,
    section80C,
    section80D,
    section24b,
    nps80CCD1B,
    lang,
  ]);

  const isOldWinner = result.optimalRegime === "Old";
  const winningTax = isOldWinner ? result.oldRegime.totalTax : result.newRegime.totalTax;
  const losingTax = isOldWinner ? result.newRegime.totalTax : result.oldRegime.totalTax;

  const valueAxisPercent = Math.min(
    Math.max((1 - winningTax / Math.max(1, grossSalary)) * 100, 10),
    90
  );
  const benchmarkAxisPercent = Math.min(
    Math.max((1 - losingTax / Math.max(1, grossSalary)) * 100, 10),
    90
  );

  return (
    <div className="relative overflow-hidden bg-wash text-ink min-h-screen">
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
        <SiteNav />

        {/* Header with Illustration */}
        <div className="grid items-center gap-8 pt-10 pb-8 [grid-template-columns:repeat(auto-fit,minmax(300px,1fr))]">
          <div className="max-w-2xl">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-rule bg-paper px-3 py-1 text-xs font-bold text-muted">
              <span className="h-1.5 w-1.5 rounded-full bg-ink" />
              {s.badge}
            </div>
            <h1
              className="m-0 mb-3 font-black text-ink tracking-tight"
              style={{
                fontSize: "clamp(30px, 4.5vw, 48px)",
                lineHeight: 1.1,
              }}
            >
              {s.title}
            </h1>
            <p className="m-0 text-base sm:text-lg leading-relaxed text-muted">
              {s.subtitle}
            </p>
          </div>
          <div className="relative flex justify-center sm:justify-end">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 -z-10 rounded-full bg-ink/5 blur-3xl"
            />
            <Image
              src="/images/salary-tax.webp"
              alt="Illustration of tax calculation scales weighing salary payslip against deductions"
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
                {s.incomeSection}
              </h2>

              {/* Gross Annual CTC */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-bold text-ink">{s.grossSalaryLabel}</label>
                  <span className="font-extrabold text-ink tabular-nums text-base">
                    ₹{grossSalary.toLocaleString("en-IN")}
                  </span>
                </div>
                <input
                  type="range"
                  min={300000}
                  max={5000000}
                  step={50000}
                  value={grossSalary}
                  onChange={(e) => setGrossSalary(Number(e.target.value))}
                  className="w-full accent-ink cursor-pointer"
                />
                <div className="flex justify-between text-[11px] text-muted mt-1">
                  <span>₹3 {t.common.lakh}</span>
                  <span>₹25 {t.common.lakh}</span>
                  <span>₹50 {t.common.lakh}</span>
                </div>
              </div>

              {/* HRA & Rent Details */}
              <div className="border-t border-rule pt-6 space-y-4">
                <h2 className="text-xs font-extrabold uppercase tracking-widest text-muted">
                  {s.hraSection}
                </h2>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-muted mb-1 block">{s.hraReceivedLabel}</label>
                    <input
                      type="number"
                      value={hraReceived}
                      onChange={(e) => setHraReceived(Number(e.target.value))}
                      className="w-full rounded-lg border border-rule bg-wash px-3 py-2 text-sm font-bold text-ink"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-muted mb-1 block">{s.rentPaidLabel}</label>
                    <input
                      type="number"
                      value={rentPaid}
                      onChange={(e) => setRentPaid(Number(e.target.value))}
                      className="w-full rounded-lg border border-rule bg-wash px-3 py-2 text-sm font-bold text-ink"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <label className="text-xs font-bold text-muted">{s.cityTypeLabel}</label>
                  <button
                    type="button"
                    onClick={() => setIsMetro(true)}
                    className={`px-3 py-1 rounded-md text-xs font-bold cursor-pointer border ${
                      isMetro ? "bg-ink text-paper border-ink" : "bg-wash text-muted border-rule"
                    }`}
                  >
                    {s.metroBtn}
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsMetro(false)}
                    className={`px-3 py-1 rounded-md text-xs font-bold cursor-pointer border ${
                      !isMetro ? "bg-ink text-paper border-ink" : "bg-wash text-muted border-rule"
                    }`}
                  >
                    {s.nonMetroBtn}
                  </button>
                </div>
              </div>

              {/* Section Deductions */}
              <div className="border-t border-rule pt-6 space-y-4">
                <h2 className="text-xs font-extrabold uppercase tracking-widest text-muted">
                  {s.deductionsSection}
                </h2>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <div className="flex justify-between text-xs font-bold text-muted mb-1">
                      <span>{s.sec80CLabel}</span>
                      <span className="text-ink">{s.sec80CMax}</span>
                    </div>
                    <input
                      type="number"
                      max={150000}
                      value={section80C}
                      onChange={(e) => setSection80C(Number(e.target.value))}
                      className="w-full rounded-lg border border-rule bg-wash px-3 py-2 text-sm font-bold text-ink"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-bold text-muted mb-1">
                      <span>{s.sec80DLabel}</span>
                      <span className="text-ink">{s.sec80DMax}</span>
                    </div>
                    <input
                      type="number"
                      max={100000}
                      value={section80D}
                      onChange={(e) => setSection80D(Number(e.target.value))}
                      className="w-full rounded-lg border border-rule bg-wash px-3 py-2 text-sm font-bold text-ink"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <div className="flex justify-between text-xs font-bold text-muted mb-1">
                      <span>{s.sec24bLabel}</span>
                      <span className="text-ink">{s.sec24bMax}</span>
                    </div>
                    <input
                      type="number"
                      max={200000}
                      value={section24b}
                      onChange={(e) => setSection24b(Number(e.target.value))}
                      className="w-full rounded-lg border border-rule bg-wash px-3 py-2 text-sm font-bold text-ink"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-bold text-muted mb-1">
                      <span>{s.npsLabel}</span>
                      <span className="text-ink">{s.npsMax}</span>
                    </div>
                    <input
                      type="number"
                      max={50000}
                      value={nps80CCD1B}
                      onChange={(e) => setNps80CCD1B(Number(e.target.value))}
                      className="w-full rounded-lg border border-rule bg-wash px-3 py-2 text-sm font-bold text-ink"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* In-Hand Delta Summary Cards */}
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-xl border border-rule bg-paper p-4">
                <div className="text-xs text-muted font-semibold">{s.oldRegimeInHand}</div>
                <div className="text-xl font-black text-ink mt-1 tabular-nums">
                  ₹{Math.round(result.oldRegime.monthlyInHand).toLocaleString("en-IN")}{t.common.perMonth}
                </div>
                <div className="text-[11px] text-muted mt-0.5">{s.taxLabel} ₹{Math.round(result.oldRegime.totalTax).toLocaleString("en-IN")}</div>
              </div>
              <div className="rounded-xl border border-rule bg-paper p-4">
                <div className="text-xs text-muted font-semibold">{s.newRegimeInHand}</div>
                <div className="text-xl font-black text-ink mt-1 tabular-nums">
                  ₹{Math.round(result.newRegime.monthlyInHand).toLocaleString("en-IN")}{t.common.perMonth}
                </div>
                <div className="text-[11px] text-muted mt-0.5">{s.taxLabel} ₹{Math.round(result.newRegime.totalTax).toLocaleString("en-IN")}</div>
              </div>
            </div>
          </div>

          {/* Right Column: Verdict Slab */}
          <div className="lg:col-span-6 flex flex-col justify-between space-y-6">
            <BlackSlab
              key={`tax-${lang}`}
              eyebrow={s.verdictEyebrow}
              statement={
                isOldWinner
                  ? interpolate(s.verdictStatementOld, {
                      deductions: Math.round(result.oldRegime.totalExemptionsAndDeductions).toLocaleString("en-IN"),
                    })
                  : s.verdictStatementNew
              }
              value={result.verdictHeadline}
              tone="gain"
              axis={{
                valuePercent: valueAxisPercent,
                benchmarkPercent: benchmarkAxisPercent,
                valueLabel: isOldWinner ? s.oldRegimeLabel : s.newRegimeLabel,
                benchmarkLabel: isOldWinner ? s.newRegimeLabel : s.oldRegimeLabel,
              }}
              comparison={result.verdictSummary}
              className="shadow-md"
            />

            {/* Deductions Breakeven Insight */}
            <div className="rounded-2xl border border-rule bg-paper p-6">
              <h3 className="text-xs font-black uppercase tracking-wider text-ink mb-3 flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-ink" />
                {s.breakevenTitle}
              </h3>
              <p className="text-sm leading-relaxed text-muted mb-4">
                {interpolate(s.breakevenDesc, {
                  income: (grossSalary / 100000).toFixed(1),
                  breakeven: result.breakevenDeductionNeeded.toLocaleString("en-IN"),
                })}
              </p>
              <div className="rounded-lg bg-wash p-3.5 text-xs text-muted space-y-1.5">
                <div className="flex justify-between">
                  <span>{s.yourTotalDeductions}</span>
                  <span className="font-bold text-ink">₹{Math.round(result.oldRegime.totalExemptionsAndDeductions).toLocaleString("en-IN")}</span>
                </div>
                <div className="flex justify-between">
                  <span>{s.newRegimeStdDed}</span>
                  <span className="font-bold text-ink">{s.newRegimeStdDedValue}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <SiteFooter />
      </div>
    </div>
  );
}
