"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import SiteNav from "@/components/SiteNav";
import SiteFooter from "@/components/SiteFooter";
import BlackSlab from "@/components/BlackSlab";
import Breadcrumbs from "@/components/Breadcrumbs";
import RelatedCalculators from "@/components/RelatedCalculators";
import FAQ from "@/components/FAQ";
import { calculateSIPRealReturn } from "@/lib/finance";
import { useLanguage, interpolate } from "@/lib/i18n";

export default function InvestmentsCalculatorClient() {
  const { lang, t } = useLanguage();
  const inv = t.investmentsCalc;

  const [monthlySIP, setMonthlySIP] = useState(20000);
  const [tenureYears, setTenureYears] = useState(15);
  const [cagr, setCagr] = useState(12);
  const [inflation, setInflation] = useState(6);
  const [stepUp, setStepUp] = useState(10);
  const ltcgTax = 12.5;

  const result = useMemo(() => {
    return calculateSIPRealReturn({
      monthlySIP,
      tenureYears,
      expectedAnnualReturnPercent: cagr,
      inflationRatePercent: inflation,
      annualStepUpPercent: stepUp,
      ltcgTaxPercent: ltcgTax,
      lang,
    });
  }, [monthlySIP, tenureYears, cagr, inflation, stepUp, ltcgTax, lang]);

  const valueAxisPercent = Math.min(
    Math.max((result.realEffectiveCAGRPercent / 15) * 100, 10),
    90
  );
  const benchmarkAxisPercent = Math.min(
    Math.max(((1.07 / (1 + inflation / 100) - 1) * 100 / 15) * 100, 10),
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
            { label: inv.title },
          ]}
        />

        {/* Header with Illustration */}
        <div className="grid items-center gap-8 pt-10 pb-8 [grid-template-columns:repeat(auto-fit,minmax(300px,1fr))]">
          <div className="max-w-2xl">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-rule bg-paper px-3 py-1 text-xs font-bold text-muted">
              <span className="h-1.5 w-1.5 rounded-full bg-ink" />
              {inv.badge}
            </div>
            <h1
              className="m-0 mb-3 font-black text-ink tracking-tight"
              style={{
                fontSize: "clamp(30px, 4.5vw, 48px)",
                lineHeight: 1.1,
              }}
            >
              {inv.title}
            </h1>
            <p className="m-0 text-base sm:text-lg leading-relaxed text-muted">
              {inv.subtitle}
            </p>
          </div>
          <div className="relative flex justify-center sm:justify-end">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 -z-10 rounded-full bg-ink/5 blur-3xl"
            />
            <Image
              src="/images/sip-real-growth.webp"
              alt="Illustration of compounding coin stacks and real purchasing power growth"
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
                {inv.inputSection}
              </h2>

              {/* Monthly SIP Amount */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-bold text-ink">{inv.monthlySipLabel}</label>
                  <span className="font-extrabold text-ink tabular-nums text-base">
                    ₹{monthlySIP.toLocaleString("en-IN")}{t.common.perMonth}
                  </span>
                </div>
                <input
                  type="range"
                  min={1000}
                  max={200000}
                  step={1000}
                  value={monthlySIP}
                  onChange={(e) => setMonthlySIP(Number(e.target.value))}
                  className="w-full accent-ink cursor-pointer"
                />
                <div className="flex justify-between text-[11px] text-muted mt-1">
                  <span>₹1,000</span>
                  <span>₹1,00,000</span>
                  <span>₹2,00,000</span>
                </div>
              </div>

              {/* Tenure Years */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-bold text-ink">{inv.tenureLabel}</label>
                  <span className="font-extrabold text-ink tabular-nums text-base">
                    {tenureYears} {t.common.years}
                  </span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={35}
                  step={1}
                  value={tenureYears}
                  onChange={(e) => setTenureYears(Number(e.target.value))}
                  className="w-full accent-ink cursor-pointer"
                />
                <div className="flex justify-between text-[11px] text-muted mt-1">
                  <span>1 {t.common.year}</span>
                  <span>15 {t.common.years}</span>
                  <span>35 {t.common.years}</span>
                </div>
              </div>

              {/* Annual Step-Up % */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-bold text-ink">{inv.stepUpLabel}</label>
                  <span className="font-extrabold text-ink tabular-nums text-base">
                    {stepUp}% {t.common.perYear}
                  </span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={25}
                  step={1}
                  value={stepUp}
                  onChange={(e) => setStepUp(Number(e.target.value))}
                  className="w-full accent-ink cursor-pointer"
                />
                <div className="flex justify-between text-[11px] text-muted mt-1">
                  <span>{inv.stepUpFixed}</span>
                  <span>{inv.stepUpHike}</span>
                  <span>25%</span>
                </div>
              </div>

              <div className="border-t border-rule pt-6 space-y-6">
                <h2 className="text-xs font-extrabold uppercase tracking-widest text-muted">
                  {inv.factorsSection}
                </h2>

                {/* Expected CAGR */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-bold text-ink">{inv.cagrLabel}</label>
                    <span className="font-extrabold text-ink tabular-nums text-base">
                      {cagr}% {t.common.pa}
                    </span>
                  </div>
                  <input
                    type="range"
                    min={6}
                    max={20}
                    step={0.5}
                    value={cagr}
                    onChange={(e) => setCagr(Number(e.target.value))}
                    className="w-full accent-ink cursor-pointer"
                  />
                  <div className="flex justify-between text-[11px] text-muted mt-1">
                    <span>{inv.cagrConservative}</span>
                    <span>{inv.cagrNifty}</span>
                    <span>{inv.cagrAggressive}</span>
                  </div>
                </div>

                {/* Inflation Rate */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-bold text-ink">{inv.inflationLabel}</label>
                    <span className="font-extrabold text-ink tabular-nums text-base">
                      {inflation}% {t.common.pa}
                    </span>
                  </div>
                  <input
                    type="range"
                    min={3}
                    max={10}
                    step={0.5}
                    value={inflation}
                    onChange={(e) => setInflation(Number(e.target.value))}
                    className="w-full accent-ink cursor-pointer"
                  />
                  <div className="flex justify-between text-[11px] text-muted mt-1">
                    <span>3%</span>
                    <span>{inv.inflationRbi}</span>
                    <span>10%</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Numbers Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div className="rounded-xl border border-rule bg-paper p-4">
                <div className="text-xs text-muted font-semibold">{inv.quickSummary.totalInvested}</div>
                <div className="text-lg font-black text-ink mt-1 tabular-nums">
                  ₹{(result.totalInvested / 100000).toFixed(2)} {t.common.lakh}
                </div>
              </div>
              <div className="rounded-xl border border-rule bg-paper p-4">
                <div className="text-xs text-muted font-semibold">{inv.quickSummary.nominalFutureCorpus}</div>
                <div className="text-lg font-black text-ink mt-1 tabular-nums">
                  ₹{(result.nominalFutureCorpus / 100000).toFixed(2)} {t.common.lakh}
                </div>
              </div>
              <div className="rounded-xl border border-rule bg-paper p-4 col-span-2 sm:col-span-1">
                <div className="text-xs text-muted font-semibold">{inv.quickSummary.todayPurchasingPower}</div>
                <div className="text-lg font-black text-emerald-800 mt-1 tabular-nums">
                  ₹{(result.realPurchasingPowerToday / 100000).toFixed(2)} {t.common.lakh}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Verdict Slab */}
          <div className="lg:col-span-6 flex flex-col justify-between space-y-6">
            <BlackSlab
              key={`sip-${lang}`}
              eyebrow={inv.verdictEyebrow}
              statement={interpolate(inv.verdictStatement, { inflation })}
              value={result.verdictHeadline}
              tone="gain"
              axis={{
                valuePercent: valueAxisPercent,
                benchmarkPercent: benchmarkAxisPercent,
                valueLabel: interpolate(inv.axisEquityLabel, { realCagr: result.realEffectiveCAGRPercent.toFixed(1) }),
                benchmarkLabel: interpolate(inv.axisFdLabel, {
                  realFd: (((1.07 / (1 + inflation / 100) - 1) * 100)).toFixed(1),
                }),
              }}
              comparison={result.verdictSummary}
              className="shadow-md"
            />

            {/* Tax Drag & Compounding Reality */}
            <div className="rounded-2xl border border-rule bg-paper p-6">
              <h3 className="text-xs font-black uppercase tracking-wider text-ink mb-3 flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-ink" />
                {inv.realityCheckTitle}
              </h3>
              <p className="text-sm leading-relaxed text-muted mb-4">
                {interpolate(inv.realityCheckDesc, {
                  stepUp,
                  multiplier: result.wealthMultiplier.toFixed(1),
                })}
              </p>
              <div className="rounded-lg bg-wash p-3.5 text-xs text-muted space-y-1.5 font-mono">
                <div className="flex justify-between">
                  <span>{inv.grossGains}</span>
                  <span className="font-bold text-ink">₹{Math.round(result.totalGains).toLocaleString("en-IN")}</span>
                </div>
                <div className="flex justify-between">
                  <span>{inv.ltcgTax}</span>
                  <span className="font-bold text-rose-700">-₹{Math.round(result.ltcgTaxAmount).toLocaleString("en-IN")}</span>
                </div>
                <div className="flex justify-between border-t border-rule pt-1">
                  <span>{inv.netWealth}</span>
                  <span className="font-bold text-ink">₹{Math.round(result.postTaxNominalCorpus).toLocaleString("en-IN")}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Year-by-Year Growth Table */}
        <div className="mt-6 mb-16 rounded-2xl border border-rule bg-paper p-6 sm:p-8">
          <h2 className="text-lg font-black text-ink mb-1">{inv.tableTitle}</h2>
          <p className="text-xs text-muted mb-6">{inv.tableSubtitle}</p>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b-2 border-rule text-xs font-extrabold uppercase text-muted">
                  <th className="py-3 px-3">{inv.colYear}</th>
                  <th className="py-3 px-3">{inv.colMonthlySip}</th>
                  <th className="py-3 px-3">{inv.colTotalInvested}</th>
                  <th className="py-3 px-3">{inv.colNominalCorpus}</th>
                  <th className="py-3 px-3">{inv.colRealPurchasingPower}</th>
                  <th className="py-3 px-3">{inv.colUnrealizedGains}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-rule/70">
                {result.yearlySchedule.map((row) => (
                  <tr key={row.year} className="hover:bg-wash/50">
                    <td className="py-3 px-3 tabular-nums font-bold">{t.common.year} {row.year}</td>
                    <td className="py-3 px-3 tabular-nums">₹{Math.round(row.monthlyAmount).toLocaleString("en-IN")}</td>
                    <td className="py-3 px-3 tabular-nums">₹{Math.round(row.totalInvestedTillDate).toLocaleString("en-IN")}</td>
                    <td className="py-3 px-3 tabular-nums font-bold">₹{Math.round(row.nominalCorpus).toLocaleString("en-IN")}</td>
                    <td className="py-3 px-3 tabular-nums text-emerald-800 font-bold">
                      ₹{Math.round(row.realPurchasingPower).toLocaleString("en-IN")}
                    </td>
                    <td className="py-3 px-3 tabular-nums text-muted">
                      +₹{Math.round(row.gains).toLocaleString("en-IN")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <FAQ items={inv.faq} heading={t.nav.faqHeading} />

        <RelatedCalculators currentSlug="investments" t={t} heading={t.nav.relatedCalculatorsHeading} />

        <SiteFooter />
      </div>
    </div>
  );
}
