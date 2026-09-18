"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import SiteNav from "@/components/SiteNav";
import SiteFooter from "@/components/SiteFooter";
import BlackSlab from "@/components/BlackSlab";
import Breadcrumbs from "@/components/Breadcrumbs";
import RelatedCalculators from "@/components/RelatedCalculators";
import FAQ from "@/components/FAQ";
import TablePagination from "@/components/TablePagination";
import { calculateChitFund } from "@/lib/finance";
import { usePagination } from "@/lib/usePagination";
import { useLanguage, interpolate } from "@/lib/i18n";

export default function ChitFundCalculatorClient() {
  const { lang, t } = useLanguage();
  const c = t.chitFundCalc;

  const [chitValue, setChitValue] = useState(500000);
  const [months, setMonths] = useState(25);
  const [foremanCommissionPercent, setForemanCommissionPercent] = useState(5);
  const [isBorrower, setIsBorrower] = useState(true);
  const [bidMonth, setBidMonth] = useState(4);
  const [bidDiscountPercent, setBidDiscountPercent] = useState(25);

  // Keep bidMonth within 1..months
  const safeBidMonth = Math.min(Math.max(1, bidMonth), months);

  const result = useMemo(() => {
    return calculateChitFund({
      chitValue,
      months,
      foremanCommissionPercent,
      isBorrower,
      bidMonth: safeBidMonth,
      bidDiscountPercent,
      lang,
    });
  }, [
    chitValue,
    months,
    foremanCommissionPercent,
    isBorrower,
    safeBidMonth,
    bidDiscountPercent,
    lang,
  ]);

  const schedulePagination = usePagination(result.schedule, 10);

  const valueAxisPercent = isBorrower
    ? Math.min(Math.max((result.effectiveXirrPercent / 30) * 100, 5), 95)
    : Math.min(Math.max((result.effectiveXirrPercent / 15) * 100, 5), 95);

  const benchmarkAxisPercent = isBorrower
    ? (result.personalLoanRatePercent / 30) * 100
    : (result.fdRatePercent / 15) * 100;

  return (
    <div className="relative overflow-hidden bg-wash text-ink min-h-screen">
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
        <SiteNav />

        <Breadcrumbs
          items={[
            { label: t.nav.breadcrumbHome, href: "/" },
            { label: t.nav.breadcrumbCalculators, href: "/#calculators" },
            { label: c.title },
          ]}
        />

        {/* Page Header with Illustration */}
        <div className="grid items-center gap-8 pt-10 pb-8 [grid-template-columns:repeat(auto-fit,minmax(300px,1fr))]">
          <div className="max-w-2xl">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-rule bg-paper px-3 py-1 text-xs font-bold text-muted">
              <span className="h-1.5 w-1.5 rounded-full bg-ink" />
              {c.badge}
            </div>
            <h1
              className="m-0 mb-3 font-black text-ink tracking-tight"
              style={{
                fontSize: "clamp(30px, 4.5vw, 48px)",
                lineHeight: 1.1,
              }}
            >
              {c.title}
            </h1>
            <p className="m-0 text-base sm:text-lg leading-relaxed text-muted">
              {c.subtitle}
            </p>
          </div>
          <div className="relative flex justify-center sm:justify-end">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 -z-10 rounded-full bg-ink/5 blur-3xl"
            />
            <Image
              src="/images/chit-fund-committee.webp"
              alt="Illustration of chit fund committee drawing winning lot"
              width={900}
              height={821}
              priority
              className="h-[220px] sm:h-[280px] w-full object-contain"
            />
          </div>
        </div>

        {/* Main 2-Column Calculator Interface */}
        <div className="grid gap-8 lg:grid-cols-12 pb-16">
          {/* Left Column: Inputs and Controls */}
          <div className="lg:col-span-6 space-y-6">
            <div className="rounded-2xl border border-rule bg-paper p-6 sm:p-7 shadow-xs">
              <h2 className="text-xs font-extrabold uppercase tracking-widest text-muted mb-5">
                {c.roleSection}
              </h2>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setIsBorrower(true)}
                  className={`flex flex-col items-center justify-center rounded-xl p-4 text-center transition-all cursor-pointer border ${
                    isBorrower
                      ? "bg-ink text-paper border-ink shadow-sm"
                      : "bg-wash text-muted hover:bg-[#e2e5e9] border-rule"
                  }`}
                >
                  <span className="text-2xl mb-1">🪙</span>
                  <span className="text-sm font-bold">{c.borrowerBtn}</span>
                  <span className="text-xs opacity-80 mt-0.5">{c.borrowerSub}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setIsBorrower(false)}
                  className={`flex flex-col items-center justify-center rounded-xl p-4 text-center transition-all cursor-pointer border ${
                    !isBorrower
                      ? "bg-ink text-paper border-ink shadow-sm"
                      : "bg-wash text-muted hover:bg-[#e2e5e9] border-rule"
                  }`}
                >
                  <span className="text-2xl mb-1">📈</span>
                  <span className="text-sm font-bold">{c.investorBtn}</span>
                  <span className="text-xs opacity-80 mt-0.5">{c.investorSub}</span>
                </button>
              </div>

              <div className="mt-8 space-y-6 border-t border-rule pt-6">
                <h2 className="text-xs font-extrabold uppercase tracking-widest text-muted">
                  {c.groupSection}
                </h2>

                {/* Chit Pot Value */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-bold text-ink">{c.totalChitValue}</label>
                    <span className="font-extrabold text-ink tabular-nums text-base">
                      ₹{chitValue.toLocaleString("en-IN")}
                    </span>
                  </div>
                  <input
                    type="range"
                    min={50000}
                    max={5000000}
                    step={25000}
                    value={chitValue}
                    onChange={(e) => setChitValue(Number(e.target.value))}
                    className="w-full accent-ink cursor-pointer"
                  />
                  <div className="flex justify-between text-[11px] text-muted mt-1">
                    <span>₹50K</span>
                    <span>₹25 {t.common.lakh}</span>
                    <span>₹50 {t.common.lakh}</span>
                  </div>
                </div>

                {/* Tenure Months */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-bold text-ink">{c.tenureMembers}</label>
                    <span className="font-extrabold text-ink tabular-nums text-base">
                      {months} {t.common.months}
                    </span>
                  </div>
                  <input
                    type="range"
                    min={10}
                    max={60}
                    step={5}
                    value={months}
                    onChange={(e) => {
                      const newM = Number(e.target.value);
                      setMonths(newM);
                      if (bidMonth > newM) setBidMonth(newM);
                    }}
                    className="w-full accent-ink cursor-pointer"
                  />
                  <div className="flex justify-between text-[11px] text-muted mt-1">
                    <span>10 {t.common.months}</span>
                    <span>25 {t.common.months}</span>
                    <span>50 {t.common.months}</span>
                    <span>60 {t.common.months}</span>
                  </div>
                </div>

                {/* Bid Month (if borrower) */}
                {isBorrower && (
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="text-sm font-bold text-ink">{c.bidMonthLabel}</label>
                      <span className="font-extrabold text-ink tabular-nums text-base">
                        {t.common.month} {safeBidMonth}
                      </span>
                    </div>
                    <input
                      type="range"
                      min={1}
                      max={months}
                      step={1}
                      value={safeBidMonth}
                      onChange={(e) => setBidMonth(Number(e.target.value))}
                      className="w-full accent-ink cursor-pointer"
                    />
                    <div className="flex justify-between text-[11px] text-muted mt-1">
                      <span>{c.bidMonthHintFirst}</span>
                      <span>{c.bidMonthHintLast} {months}</span>
                    </div>
                  </div>
                )}

                {/* Bid Discount % */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-bold text-ink">
                      {isBorrower ? c.auctionDiscountBorrower : c.auctionDiscountInvestor}
                    </label>
                    <span className="font-extrabold text-ink tabular-nums text-base">
                      {bidDiscountPercent}% (₹{((chitValue * bidDiscountPercent) / 100).toLocaleString("en-IN")})
                    </span>
                  </div>
                  <input
                    type="range"
                    min={5}
                    max={40}
                    step={1}
                    value={bidDiscountPercent}
                    onChange={(e) => setBidDiscountPercent(Number(e.target.value))}
                    className="w-full accent-ink cursor-pointer"
                  />
                  <div className="flex justify-between text-[11px] text-muted mt-1">
                    <span>{c.discountHintMin}</span>
                    <span>{c.discountHintMid}</span>
                    <span>{c.discountHintMax}</span>
                  </div>
                </div>

                {/* Foreman Commission */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-bold text-ink">{c.foremanCommission}</label>
                    <span className="font-extrabold text-ink tabular-nums text-base">
                      {foremanCommissionPercent}% (₹{((chitValue * foremanCommissionPercent) / 100).toLocaleString("en-IN")})
                    </span>
                  </div>
                  <input
                    type="range"
                    min={2}
                    max={7}
                    step={0.5}
                    value={foremanCommissionPercent}
                    onChange={(e) => setForemanCommissionPercent(Number(e.target.value))}
                    className="w-full accent-ink cursor-pointer"
                  />
                  <div className="flex justify-between text-[11px] text-muted mt-1">
                    <span>2%</span>
                    <span>{c.foremanStandard}</span>
                    <span>7%</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Math Summary Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div className="rounded-xl border border-rule bg-paper p-4">
                <div className="text-xs text-muted font-semibold">{c.quickSummary.nominalInstallment}</div>
                <div className="text-lg font-black text-ink mt-1 tabular-nums">
                  ₹{Math.round(result.monthlyInstallmentNominal).toLocaleString("en-IN")}
                </div>
              </div>
              <div className="rounded-xl border border-rule bg-paper p-4">
                <div className="text-xs text-muted font-semibold">{c.quickSummary.prizeInHand}</div>
                <div className="text-lg font-black text-ink mt-1 tabular-nums">
                  ₹{Math.round(result.actualTakeHomePrize).toLocaleString("en-IN")}
                </div>
              </div>
              <div className="rounded-xl border border-rule bg-paper p-4 col-span-2 sm:col-span-1">
                <div className="text-xs text-muted font-semibold">{c.quickSummary.totalPaid}</div>
                <div className="text-lg font-black text-ink mt-1 tabular-nums">
                  ₹{Math.round(result.totalPaidOverTenure).toLocaleString("en-IN")}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Verdict Slab & Explanations */}
          <div className="lg:col-span-6 flex flex-col justify-between space-y-6">
            <BlackSlab
              key={`${isBorrower ? "borrower" : "investor"}-${lang}`}
              eyebrow={isBorrower ? c.verdictEyebrowBorrower : c.verdictEyebrowInvestor}
              statement={
                isBorrower
                  ? interpolate(c.verdictStatementBorrower, { month: safeBidMonth })
                  : c.verdictStatementInvestor
              }
              value={result.verdictHeadline}
              tone={result.verdictTone}
              axis={{
                valuePercent: valueAxisPercent,
                benchmarkPercent: benchmarkAxisPercent,
                valueLabel: isBorrower ? c.axisChitApr : c.axisChitXirr,
                benchmarkLabel: isBorrower ? c.axisPersonalLoan : c.axisBankFd,
              }}
              comparison={result.verdictSummary}
              className="shadow-md"
            />

            {/* Mathematical Transparency Card */}
            <div className="rounded-2xl border border-rule bg-paper p-6">
              <h3 className="text-xs font-black uppercase tracking-wider text-ink mb-3 flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-ink" />
                {c.mathProofTitle}
              </h3>
              <p className="text-sm leading-relaxed text-muted mb-4">
                {interpolate(c.mathProofDesc, {
                  months,
                  prize: result.actualTakeHomePrize.toLocaleString("en-IN"),
                })}
              </p>
              <div className="rounded-lg bg-wash p-3.5 font-mono text-xs text-ink space-y-1">
                <div>
                  {interpolate(c.mathFormulaForeman, {
                    chitValue: chitValue.toLocaleString("en-IN"),
                    commission: foremanCommissionPercent,
                    amount: result.foremanCommission.toLocaleString("en-IN"),
                  })}
                </div>
                <div>
                  {interpolate(c.mathFormulaDiscount, {
                    chitValue: chitValue.toLocaleString("en-IN"),
                    discount: bidDiscountPercent,
                    amount: ((chitValue * bidDiscountPercent) / 100).toLocaleString("en-IN"),
                  })}
                </div>
                <div>{c.mathFormulaDividend}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Schedule Table Preview */}
        <div className="mt-6 mb-16 rounded-2xl border border-rule bg-paper p-6 sm:p-8">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-lg font-black text-ink">{c.scheduleTitle}</h2>
              <p className="text-xs text-muted">{c.scheduleSubtitle}</p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b-2 border-rule text-xs font-extrabold uppercase text-muted">
                  <th className="py-3 px-3">{c.colMonth}</th>
                  <th className="py-3 px-3">{c.colNominalDue}</th>
                  <th className="py-3 px-3">{c.colDividendCredit}</th>
                  <th className="py-3 px-3">{c.colNetOutflow}</th>
                  <th className="py-3 px-3">{c.colNetCashFlow}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-rule/70">
                {schedulePagination.pageItems.map((row) => (
                  <tr
                    key={row.month}
                    className={
                      isBorrower && row.month === safeBidMonth
                        ? "bg-emerald-50/70 font-semibold"
                        : "hover:bg-wash/50"
                    }
                  >
                    <td className="py-3 px-3 tabular-nums">
                      {t.common.month} {row.month}{" "}
                      {isBorrower && row.month === safeBidMonth && (
                        <span className="ml-1 text-[11px] font-bold text-emerald-800 bg-emerald-200/70 rounded px-1.5 py-0.5">
                          {c.badgePrizeWon}
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-3 tabular-nums">₹{Math.round(row.nominalDue).toLocaleString("en-IN")}</td>
                    <td className="py-3 px-3 tabular-nums text-emerald-700">₹{Math.round(row.dividendReceived).toLocaleString("en-IN")}</td>
                    <td className="py-3 px-3 tabular-nums">₹{Math.round(row.netPaid).toLocaleString("en-IN")}</td>
                    <td className={`py-3 px-3 tabular-nums font-bold ${row.cashflow > 0 ? "text-emerald-700" : "text-ink"}`}>
                      {row.cashflow > 0 ? "+" : ""}₹{Math.round(row.cashflow).toLocaleString("en-IN")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <TablePagination
            page={schedulePagination.page}
            pageCount={schedulePagination.pageCount}
            onPageChange={schedulePagination.setPage}
            labels={{ previous: t.nav.previousPage, next: t.nav.nextPage, pageOf: t.nav.pageOf }}
          />
        </div>

        <FAQ items={c.faq} heading={t.nav.faqHeading} />

        <RelatedCalculators currentSlug="chit-fund" t={t} heading={t.nav.relatedCalculatorsHeading} />

        <SiteFooter />
      </div>
    </div>
  );
}
