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
  REGIME_SLUGS,
  ctcLabel,
  ctcToSlug,
  slugToCtc,
  regimeLabel,
  regimeSlugToKey,
  nearbyCtc,
  defaultAssumptions,
  type RegimeSlug,
} from "@/lib/salaryPages";

export const dynamicParams = false;
// Static export has no server to revalidate on a schedule — "monthly
// updates" means rebuilding and redeploying, not per-page ISR.
export const dynamic = "force-static";

export function generateStaticParams() {
  return CTC_LAKHS.flatMap((lakhs) =>
    REGIME_SLUGS.map((regime) => ({ ctc: ctcToSlug(lakhs), regime }))
  );
}

function getPageData(ctcSlug: string, regimeSlug: string) {
  const lakhs = slugToCtc(ctcSlug);
  const regime = REGIME_SLUGS.includes(regimeSlug as RegimeSlug)
    ? (regimeSlug as RegimeSlug)
    : null;
  if (lakhs === null || regime === null) return null;
  const assumptions = defaultAssumptions(lakhs);
  const result = calculateIncomeTax(assumptions);
  const regimeResult = regimeSlugToKey(regime) === "Old" ? result.oldRegime : result.newRegime;
  const otherRegime: RegimeSlug = regime === "old-regime" ? "new-regime" : "old-regime";
  return { lakhs, regime, otherRegime, assumptions, result, regimeResult };
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ ctc: string; regime: string }>;
}): Promise<Metadata> {
  const { ctc, regime } = await params;
  const data = getPageData(ctc, regime);
  if (!data) return {};
  const yearLabel = taxYearDisplayLabel(LATEST_TAX_YEAR);
  const title = `₹${data.lakhs} LPA In-Hand Salary Under ${regimeLabel(
    data.regime
  )} — ${yearLabel}`;
  const description = `Full slab-by-slab breakdown of tax and in-hand pay for a ₹${data.lakhs} LPA CTC under the ${regimeLabel(
    data.regime
  )}, ${yearLabel}.`;
  return pageMetadata(`/salary-calculator/${ctc}/${regime}`, title, description);
}

export default async function CtcRegimePage({
  params,
}: {
  params: Promise<{ ctc: string; regime: string }>;
}) {
  const { ctc, regime } = await params;
  const data = getPageData(ctc, regime);
  if (!data) notFound();
  const { lakhs, otherRegime, assumptions, result, regimeResult } = data;

  const isOld = data.regime === "old-regime";
  const label = regimeLabel(data.regime);
  const nearby = nearbyCtc(lakhs);

  const faqItems = [
    {
      question: `What is the in-hand salary for ${ctcLabel(lakhs)} under the ${label}?`,
      answer: `Monthly in-hand pay is about ₹${Math.round(regimeResult.monthlyInHand).toLocaleString(
        "en-IN"
      )}, after ₹${Math.round(regimeResult.totalTax).toLocaleString(
        "en-IN"
      )} a year in tax (${regimeResult.effectiveTaxRatePercent.toFixed(
        1
      )}% effective rate), assuming the deductions listed below.`,
    },
    {
      question: `How is tax calculated at ${ctcLabel(lakhs)} under the ${label}?`,
      answer: `Taxable income of ₹${Math.round(regimeResult.taxableIncome).toLocaleString(
        "en-IN"
      )} is taxed slab by slab (see the table below), giving ₹${Math.round(
        regimeResult.taxBeforeCess
      ).toLocaleString("en-IN")} before cess. A 4% health and education cess adds ₹${Math.round(
        regimeResult.cess
      ).toLocaleString("en-IN")}, for a total of ₹${Math.round(regimeResult.totalTax).toLocaleString(
        "en-IN"
      )}.`,
    },
    {
      question: `Is the ${isOld ? "Old" : "New"} Regime or ${
        isOld ? "New" : "Old"
      } Regime better at ${ctcLabel(lakhs)}?`,
      answer: `For someone at ${ctcLabel(lakhs)} with these assumptions, the ${
        result.optimalRegime === "Equal"
          ? "two regimes result in equal tax"
          : `${result.optimalRegime} Regime wins by about ₹${Math.round(
              result.annualSavings
            ).toLocaleString("en-IN")} a year`
      }. See the full comparison on the CTC overview page.`,
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
            { label: ctcLabel(lakhs), href: `/salary-calculator/${ctc}` },
            { label },
          ]}
        />

        <header className="pt-8 pb-8 max-w-3xl">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-rule bg-paper px-3 py-1 text-xs font-bold text-muted">
            <span className="h-1.5 w-1.5 rounded-full bg-ink" />
            {taxYearDisplayLabel(LATEST_TAX_YEAR)} · {label.toUpperCase()}
          </div>
          <h1
            className="m-0 mb-4 font-black text-ink tracking-tight"
            style={{ fontSize: "clamp(28px, 4vw, 44px)", lineHeight: 1.1 }}
          >
            ₹{lakhs} LPA In-Hand Salary Under {label}
          </h1>
          <p className="m-0 text-base sm:text-lg leading-relaxed text-muted">
            Slab-by-slab tax breakdown for a {ctcLabel(lakhs)} CTC under the {label},{" "}
            {taxYearDisplayLabel(LATEST_TAX_YEAR)}.
          </p>
        </header>

        <div className="grid gap-8 lg:grid-cols-12 pb-10">
          <div className="lg:col-span-5 space-y-4">
            <div className="rounded-xl border border-rule bg-paper p-5">
              <div className="text-xs text-muted font-semibold">Monthly in-hand</div>
              <div className="text-3xl font-black text-ink mt-1 tabular-nums">
                ₹{Math.round(regimeResult.monthlyInHand).toLocaleString("en-IN")}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-xl border border-rule bg-paper p-4">
                <div className="text-xs text-muted font-semibold">Taxable income</div>
                <div className="text-lg font-black text-ink mt-1 tabular-nums">
                  ₹{Math.round(regimeResult.taxableIncome).toLocaleString("en-IN")}
                </div>
              </div>
              <div className="rounded-xl border border-rule bg-paper p-4">
                <div className="text-xs text-muted font-semibold">Total tax + cess</div>
                <div className="text-lg font-black text-ink mt-1 tabular-nums">
                  ₹{Math.round(regimeResult.totalTax).toLocaleString("en-IN")}
                </div>
              </div>
              <div className="rounded-xl border border-rule bg-paper p-4">
                <div className="text-xs text-muted font-semibold">Effective tax rate</div>
                <div className="text-lg font-black text-ink mt-1 tabular-nums">
                  {regimeResult.effectiveTaxRatePercent.toFixed(1)}%
                </div>
              </div>
              <div className="rounded-xl border border-rule bg-paper p-4">
                <div className="text-xs text-muted font-semibold">Deductions claimed</div>
                <div className="text-lg font-black text-ink mt-1 tabular-nums">
                  ₹{Math.round(regimeResult.totalExemptionsAndDeductions).toLocaleString("en-IN")}
                </div>
              </div>
            </div>
            <Link
              href={`/salary-calculator/${ctc}/${otherRegime}`}
              className="block rounded-lg border border-rule px-4 py-2.5 text-center text-sm font-bold text-ink no-underline hover:border-ink hover:bg-wash"
            >
              Compare with the {regimeLabel(otherRegime)} →
            </Link>
          </div>

          <div className="lg:col-span-7 rounded-2xl border border-rule bg-paper p-6 sm:p-7">
            <h2 className="text-xs font-extrabold uppercase tracking-widest text-muted mb-4">
              Slab-by-slab breakdown
            </h2>
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b-2 border-rule text-[11px] font-extrabold uppercase text-muted">
                  <th className="py-2 pr-2">Slab</th>
                  <th className="py-2 pr-2">Rate</th>
                  <th className="py-2 text-right">Tax</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-rule/70">
                {regimeResult.breakdown.map((row) => (
                  <tr key={row.slab}>
                    <td className="py-2 pr-2 text-muted">{row.slab}</td>
                    <td className="py-2 pr-2 tabular-nums text-ink font-medium">{row.rate}</td>
                    <td className="py-2 text-right tabular-nums font-bold text-ink">
                      ₹{Math.round(row.tax).toLocaleString("en-IN")}
                    </td>
                  </tr>
                ))}
                {regimeResult.rebate87A > 0 && (
                  <tr>
                    <td className="py-2 pr-2 text-muted" colSpan={2}>
                      Section 87A rebate
                    </td>
                    <td className="py-2 text-right tabular-nums font-bold text-ink">
                      −₹{Math.round(regimeResult.rebate87A).toLocaleString("en-IN")}
                    </td>
                  </tr>
                )}
                <tr>
                  <td className="py-2 pr-2 text-muted" colSpan={2}>
                    Health &amp; education cess (4%)
                  </td>
                  <td className="py-2 text-right tabular-nums font-bold text-ink">
                    ₹{Math.round(regimeResult.cess).toLocaleString("en-IN")}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <BlackSlab
          eyebrow="THE VERDICT"
          statement={`Comparing both regimes at ${ctcLabel(lakhs)}, you keep more under the`}
          value={
            result.optimalRegime === "Equal"
              ? "Either regime"
              : result.optimalRegime === "Old"
              ? "Old Regime"
              : "New Regime"
          }
          tone="gain"
          axis={{
            valuePercent: 60,
            benchmarkPercent: 40,
            valueLabel: isOld ? "old regime" : "new regime",
            benchmarkLabel: isOld ? "new regime" : "old regime",
          }}
          comparison={result.verdictSummary}
          className="mb-10"
        />

        {isOld && (
          <section className="mb-10 rounded-2xl border border-rule bg-paper p-6 sm:p-8 text-sm text-muted space-y-3">
            <h2 className="text-xs font-black uppercase tracking-wider text-ink">
              Deductions assumed on this page
            </h2>
            <div className="grid grid-cols-2 gap-x-6 gap-y-2 sm:grid-cols-4">
              <div>
                <div className="text-[11px] uppercase tracking-wide">HRA received</div>
                <div className="font-bold text-ink tabular-nums">
                  ₹{assumptions.hraReceivedAnnual.toLocaleString("en-IN")}
                </div>
              </div>
              <div>
                <div className="text-[11px] uppercase tracking-wide">Rent paid (metro)</div>
                <div className="font-bold text-ink tabular-nums">
                  ₹{assumptions.rentPaidAnnual.toLocaleString("en-IN")}
                </div>
              </div>
              <div>
                <div className="text-[11px] uppercase tracking-wide">Section 80C</div>
                <div className="font-bold text-ink tabular-nums">
                  ₹{assumptions.section80C.toLocaleString("en-IN")}
                </div>
              </div>
              <div>
                <div className="text-[11px] uppercase tracking-wide">Section 80D</div>
                <div className="font-bold text-ink tabular-nums">
                  ₹{assumptions.section80D.toLocaleString("en-IN")}
                </div>
              </div>
            </div>
            <p className="leading-relaxed pt-2">
              These are typical assumptions, not your numbers.{" "}
              <Link href="/calculators/salary-tax" className="font-bold text-ink hover:underline">
                Use the full calculator
              </Link>{" "}
              to enter your own HRA, rent, and investments.
            </p>
          </section>
        )}

        <div className="mb-10 flex flex-wrap gap-x-6 gap-y-1 text-xs font-bold text-ink border-t border-b border-rule py-4">
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

        <FAQ items={faqItems} heading={`Questions about ${label} at ${ctcLabel(lakhs)}`} />

        <section className="mb-16">
          <h2 className="text-xs font-extrabold uppercase tracking-widest text-muted mb-4">
            Nearby CTC amounts, {label}
          </h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {nearby.map((value) => (
              <Link
                key={value}
                href={`/salary-calculator/${ctcToSlug(value)}/${data.regime}`}
                className="rounded-xl border border-rule bg-paper px-4 py-3 text-center no-underline transition-colors hover:border-ink hover:bg-wash"
              >
                <span className="block text-base font-black text-ink tabular-nums">
                  {ctcLabel(value)}
                </span>
              </Link>
            ))}
          </div>
          <div className="mt-4 flex flex-wrap gap-4 text-sm font-bold text-ink">
            <Link href={`/salary-calculator/${ctc}`} className="hover:underline">
              ← {ctcLabel(lakhs)} overview
            </Link>
            <Link href="/salary-calculator" className="hover:underline">
              All CTC amounts
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
