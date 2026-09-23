import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import SiteNav from "@/components/SiteNav";
import SiteFooter from "@/components/SiteFooter";
import Breadcrumbs from "@/components/Breadcrumbs";
import BlackSlab from "@/components/BlackSlab";
import FAQ from "@/components/FAQ";
import { pageMetadata } from "@/lib/seo";
import { calculateIncomeTax } from "@/lib/finance";
import { LATEST_TAX_YEAR, taxYearDisplayLabel } from "@/lib/tax";
import {
  CTC_LAKHS,
  ctcLabel,
  ctcToSlug,
  slugToCtc,
  nearbyCtc,
  defaultAssumptions,
} from "@/lib/salaryPages";

export const dynamicParams = false;
// Static export has no server to revalidate on a schedule — "monthly
// updates" means rebuilding and redeploying (this repo's git push already
// triggers that), not per-page ISR.
export const dynamic = "force-static";

export function generateStaticParams() {
  return CTC_LAKHS.map((lakhs) => ({ ctc: ctcToSlug(lakhs) }));
}

function getPageData(ctcSlug: string) {
  const lakhs = slugToCtc(ctcSlug);
  if (lakhs === null) return null;
  const assumptions = defaultAssumptions(lakhs);
  const result = calculateIncomeTax(assumptions);
  return { lakhs, assumptions, result };
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ ctc: string }>;
}): Promise<Metadata> {
  const { ctc } = await params;
  const data = getPageData(ctc);
  if (!data) return {};
  const yearLabel = taxYearDisplayLabel(LATEST_TAX_YEAR);
  const title = `₹${data.lakhs} LPA In-Hand Salary Calculator, Old vs New Regime — ${yearLabel}`;
  const description = `₹${data.lakhs} LPA CTC: exact monthly in-hand pay, tax, and the Old vs New regime verdict, with a full slab-by-slab breakdown for ${yearLabel}.`;
  return pageMetadata(`/salary-calculator/${ctc}`, title, description);
}

export default async function CtcOverviewPage({
  params,
}: {
  params: Promise<{ ctc: string }>;
}) {
  const { ctc } = await params;
  const data = getPageData(ctc);
  if (!data) notFound();
  const { lakhs, assumptions, result } = data;

  const isOldWinner = result.optimalRegime === "Old";
  const isEqual = result.optimalRegime === "Equal";
  const winner = isOldWinner ? result.oldRegime : result.newRegime;
  const loser = isOldWinner ? result.newRegime : result.oldRegime;

  const valueAxisPercent = Math.min(
    Math.max((1 - winner.totalTax / Math.max(1, assumptions.grossAnnualSalary)) * 100, 10),
    90
  );
  const benchmarkAxisPercent = Math.min(
    Math.max((1 - loser.totalTax / Math.max(1, assumptions.grossAnnualSalary)) * 100, 10),
    90
  );

  const nearby = nearbyCtc(lakhs);

  const faqItems = [
    {
      question: `What is the in-hand salary for ${ctcLabel(lakhs)}?`,
      answer: `At ${ctcLabel(lakhs)} CTC with typical HRA and deductions, monthly in-hand pay is about ₹${Math.round(
        result.oldRegime.monthlyInHand
      ).toLocaleString("en-IN")} under the Old Regime and ₹${Math.round(
        result.newRegime.monthlyInHand
      ).toLocaleString("en-IN")} under the New Regime. Your own number will differ based on your actual HRA, rent, and investments — see the assumptions below.`,
    },
    {
      question: `Which tax regime is better at ${ctcLabel(lakhs)}?`,
      answer: isEqual
        ? `At ${ctcLabel(lakhs)} with these assumptions, both regimes result in the same tax liability.`
        : `The ${isOldWinner ? "Old" : "New"} Regime wins by about ₹${Math.round(
            result.annualSavings
          ).toLocaleString("en-IN")} a year for someone at ${ctcLabel(
            lakhs
          )} claiming the assumptions on this page. Your own deductions can shift this — the breakeven point is ₹${Math.round(
            result.breakevenDeductionNeeded
          ).toLocaleString("en-IN")} in total Old Regime deductions.`,
    },
    {
      question: `How much income tax do I pay at ${ctcLabel(lakhs)}?`,
      answer: `Estimated annual tax (including cess) is ₹${Math.round(
        result.oldRegime.totalTax
      ).toLocaleString("en-IN")} under the Old Regime and ₹${Math.round(
        result.newRegime.totalTax
      ).toLocaleString("en-IN")} under the New Regime, for ${taxYearDisplayLabel(
        LATEST_TAX_YEAR
      )}. See the slab-by-slab breakdown on each regime's own page.`,
    },
  ];

  return (
    <div className="relative overflow-hidden bg-wash text-ink min-h-screen">
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
        <SiteNav />

        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "Salary Calculator", href: "/salary-calculator" },
            { label: ctcLabel(lakhs) },
          ]}
        />

        <header className="pt-8 pb-8 max-w-3xl">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-rule bg-paper px-3 py-1 text-xs font-bold text-muted">
            <span className="h-1.5 w-1.5 rounded-full bg-ink" />
            {taxYearDisplayLabel(LATEST_TAX_YEAR)} · CTC {ctcLabel(lakhs)}
          </div>
          <h1
            className="m-0 mb-4 font-black text-ink tracking-tight"
            style={{ fontSize: "clamp(28px, 4vw, 44px)", lineHeight: 1.1 }}
          >
            ₹{lakhs} LPA In-Hand Salary Calculator (Old vs New Regime)
          </h1>
          <p className="m-0 text-base sm:text-lg leading-relaxed text-muted">
            Real slab-by-slab math for a {ctcLabel(lakhs)} CTC — not a rounded estimate. See the
            exact monthly take-home under each regime, which one wins, and why.
          </p>
        </header>

        <div className="grid gap-8 lg:grid-cols-12 pb-10">
          <div className="lg:col-span-6">
            <BlackSlab
              eyebrow="THE VERDICT"
              statement={`At ${ctcLabel(lakhs)}, with the assumptions below, you keep more under the`}
              value={isOldWinner ? "Old Regime" : isEqual ? "Either regime" : "New Regime"}
              tone="gain"
              axis={{
                valuePercent: valueAxisPercent,
                benchmarkPercent: benchmarkAxisPercent,
                valueLabel: isOldWinner ? "old regime" : "new regime",
                benchmarkLabel: isOldWinner ? "new regime" : "old regime",
              }}
              comparison={result.verdictSummary}
            />
          </div>

          <div className="lg:col-span-6 rounded-2xl border border-rule bg-paper p-6 sm:p-7">
            <h2 className="text-xs font-extrabold uppercase tracking-widest text-muted mb-4">
              Monthly in-hand at {ctcLabel(lakhs)}
            </h2>
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b-2 border-rule text-[11px] font-extrabold uppercase text-muted">
                  <th className="py-2 pr-2">Regime</th>
                  <th className="py-2 pr-2 text-right">Monthly in-hand</th>
                  <th className="py-2 text-right">Annual tax</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-rule/70">
                <tr>
                  <td className="py-2.5 pr-2 font-bold text-ink">Old Regime</td>
                  <td className="py-2.5 pr-2 text-right tabular-nums font-bold text-ink">
                    ₹{Math.round(result.oldRegime.monthlyInHand).toLocaleString("en-IN")}
                  </td>
                  <td className="py-2.5 text-right tabular-nums text-muted">
                    ₹{Math.round(result.oldRegime.totalTax).toLocaleString("en-IN")}
                  </td>
                </tr>
                <tr>
                  <td className="py-2.5 pr-2 font-bold text-ink">New Regime</td>
                  <td className="py-2.5 pr-2 text-right tabular-nums font-bold text-ink">
                    ₹{Math.round(result.newRegime.monthlyInHand).toLocaleString("en-IN")}
                  </td>
                  <td className="py-2.5 text-right tabular-nums text-muted">
                    ₹{Math.round(result.newRegime.totalTax).toLocaleString("en-IN")}
                  </td>
                </tr>
              </tbody>
            </table>
            <div className="mt-5 grid grid-cols-2 gap-3">
              <Link
                href={`/salary-calculator/${ctc}/old-regime`}
                className="rounded-lg border border-rule px-4 py-2.5 text-center text-sm font-bold text-ink no-underline hover:border-ink hover:bg-wash"
              >
                Full Old Regime breakdown →
              </Link>
              <Link
                href={`/salary-calculator/${ctc}/new-regime`}
                className="rounded-lg border border-rule px-4 py-2.5 text-center text-sm font-bold text-ink no-underline hover:border-ink hover:bg-wash"
              >
                Full New Regime breakdown →
              </Link>
            </div>
          </div>
        </div>

        <section className="mb-10 rounded-2xl border border-rule bg-paper p-6 sm:p-8 text-sm text-muted space-y-4">
          <h2 className="text-xs font-black uppercase tracking-wider text-ink">
            Worked example
          </h2>
          <p className="leading-relaxed">
            On a {ctcLabel(lakhs)} CTC (₹{assumptions.grossAnnualSalary.toLocaleString("en-IN")}
            /year), assuming a basic pay of ₹{assumptions.basicSalaryAnnual.toLocaleString("en-IN")},
            HRA received of ₹{assumptions.hraReceivedAnnual.toLocaleString("en-IN")}, rent paid of ₹
            {assumptions.rentPaidAnnual.toLocaleString("en-IN")} in a metro city, Section 80C of ₹
            {assumptions.section80C.toLocaleString("en-IN")}, Section 80D of ₹
            {assumptions.section80D.toLocaleString("en-IN")}, and NPS (80CCD1B) of ₹
            {assumptions.nps80CCD1B.toLocaleString("en-IN")}: the Old Regime brings taxable income
            down to ₹{Math.round(result.oldRegime.taxableIncome).toLocaleString("en-IN")}, for a
            total tax of ₹{Math.round(result.oldRegime.totalTax).toLocaleString("en-IN")} (
            {result.oldRegime.effectiveTaxRatePercent.toFixed(1)}% effective rate). The New Regime,
            which only allows the ₹{result.newRegime.totalExemptionsAndDeductions.toLocaleString(
              "en-IN"
            )} standard deduction, taxes ₹
            {Math.round(result.newRegime.taxableIncome).toLocaleString("en-IN")} for a total of ₹
            {Math.round(result.newRegime.totalTax).toLocaleString("en-IN")} (
            {result.newRegime.effectiveTaxRatePercent.toFixed(1)}% effective rate).
          </p>
          <p className="leading-relaxed">
            <strong className="text-ink">These are assumptions, not your numbers.</strong> Your
            actual HRA, rent, and investments will move the result — use the{" "}
            <Link href="/calculators/salary-tax" className="font-bold text-ink hover:underline">
              full interactive calculator
            </Link>{" "}
            to plug in your own figures.
          </p>
          <div className="flex flex-wrap gap-x-6 gap-y-1 text-xs font-bold text-ink pt-2 border-t border-rule">
            <span>{taxYearDisplayLabel(result.financialYear)}</span>
            <span>
              Slabs last updated:{" "}
              {new Date(result.lastUpdated).toLocaleDateString("en-IN", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
            <a
              href="https://www.incometax.gov.in/iec/foportal/help/individual/return-applicable-1"
              target="_blank"
              rel="noopener noreferrer nofollow"
              className="hover:underline"
            >
              Source: Income Tax Department ↗
            </a>
          </div>
        </section>

        <FAQ items={faqItems} heading="Questions about this CTC" />

        <section className="mb-16">
          <h2 className="text-xs font-extrabold uppercase tracking-widest text-muted mb-4">
            Nearby CTC amounts
          </h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {nearby.map((value) => (
              <Link
                key={value}
                href={`/salary-calculator/${ctcToSlug(value)}`}
                className="rounded-xl border border-rule bg-paper px-4 py-3 text-center no-underline transition-colors hover:border-ink hover:bg-wash"
              >
                <span className="block text-base font-black text-ink tabular-nums">
                  {ctcLabel(value)}
                </span>
              </Link>
            ))}
          </div>
          <div className="mt-4 flex flex-wrap gap-4 text-sm font-bold text-ink">
            <Link href="/salary-calculator" className="hover:underline">
              ← All CTC amounts
            </Link>
            <Link href="/calculators/salary-tax" className="hover:underline">
              Full interactive calculator →
            </Link>
          </div>
        </section>

        <SiteFooter />
      </div>
    </div>
  );
}
