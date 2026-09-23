import type { Metadata } from "next";
import Link from "next/link";
import SiteNav from "@/components/SiteNav";
import SiteFooter from "@/components/SiteFooter";
import Breadcrumbs from "@/components/Breadcrumbs";
import FAQ from "@/components/FAQ";
import { pageMetadata } from "@/lib/seo";
import { LATEST_TAX_YEAR, taxYearDisplayLabel } from "@/lib/tax";
import { CTC_LAKHS, ctcLabel, ctcToSlug } from "@/lib/salaryPages";

export const dynamic = "force-static";

const YEAR_LABEL = taxYearDisplayLabel(LATEST_TAX_YEAR);
const TITLE = `Salary Calculator: In-Hand Pay by CTC — ${YEAR_LABEL}`;
const DESCRIPTION =
  "Find your exact in-hand monthly salary, tax, and Old vs New regime verdict for your CTC — pick your amount below for the full breakdown.";

export const metadata: Metadata = pageMetadata("/salary-calculator", TITLE, DESCRIPTION);

const bands: { label: string; min: number; max: number }[] = [
  { label: "₹3 – 10 LPA", min: 0, max: 10 },
  { label: "₹11 – 20 LPA", min: 11, max: 20 },
  { label: "₹22 – 50 LPA", min: 21, max: 50 },
];

const faqItems = [
  {
    question: "What does CTC mean, and why is it different from in-hand salary?",
    answer:
      "CTC (cost to company) is everything your employer spends on you in a year — basic pay, HRA, allowances, PF contribution, and sometimes insurance. In-hand salary is what actually lands in your bank account each month, after income tax and your own PF/professional tax deductions come out. The gap between the two is usually 15–25% of CTC.",
  },
  {
    question: "Should I choose the Old or New tax regime?",
    answer:
      "It comes down to how much you claim in deductions. If your HRA exemption, Section 80C (₹1.5L), 80D, and home loan interest add up to more than roughly 25–30% of your CTC, the Old Regime usually wins. If you claim little beyond the standard deduction, the New Regime's lower slabs usually come out ahead. Each page below shows the exact breakeven for that CTC.",
  },
  {
    question: "How current are these numbers?",
    answer: `Every page uses the tax slabs in effect for ${YEAR_LABEL}. The tax year and last-updated date are shown on every page — check that before relying on the figures for a year that's since changed.`,
  },
];

export default function SalaryCalculatorHub() {
  return (
    <div className="relative overflow-hidden bg-wash text-ink min-h-screen">
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
        <SiteNav />

        <Breadcrumbs
          items={[{ label: "Home", href: "/" }, { label: "Salary Calculator" }]}
        />

        <header className="pt-8 pb-10 max-w-3xl">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-rule bg-paper px-3 py-1 text-xs font-bold text-muted">
            <span className="h-1.5 w-1.5 rounded-full bg-ink" />
            {YEAR_LABEL} · UPDATED SLABS
          </div>
          <h1
            className="m-0 mb-4 font-black text-ink tracking-tight"
            style={{ fontSize: "clamp(30px, 4.5vw, 48px)", lineHeight: 1.1 }}
          >
            {TITLE}
          </h1>
          <p className="m-0 text-base sm:text-lg leading-relaxed text-muted">
            {DESCRIPTION} Every amount below is its own page with a full Old vs New regime
            comparison, a slab-by-slab breakdown, and a plain-language verdict — not just a
            number swapped into a template.
          </p>
          <p className="mt-4 text-sm text-muted">
            Have a CTC that isn&apos;t listed, or want to plug in your own HRA and deductions?{" "}
            <Link href="/calculators/salary-tax" className="font-bold text-ink hover:underline">
              Use the full interactive calculator →
            </Link>
          </p>
        </header>

        <section aria-labelledby="ctc-list-heading" className="pb-16">
          <h2
            id="ctc-list-heading"
            className="m-0 mb-6 border-b-2 border-ink pb-2 text-[13px] font-bold text-muted"
          >
            PICK YOUR CTC
          </h2>
          <div className="space-y-8">
            {bands.map((band) => {
              const values = CTC_LAKHS.filter((v) => v >= band.min && v <= band.max);
              if (values.length === 0) return null;
              return (
                <div key={band.label}>
                  <h3 className="mb-3 text-xs font-extrabold uppercase tracking-widest text-muted">
                    {band.label}
                  </h3>
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">
                    {values.map((lakhs) => (
                      <Link
                        key={lakhs}
                        href={`/salary-calculator/${ctcToSlug(lakhs)}`}
                        className="rounded-xl border border-rule bg-paper px-4 py-3 text-center no-underline transition-colors hover:border-ink hover:bg-wash"
                      >
                        <span className="block text-base font-black text-ink tabular-nums">
                          {ctcLabel(lakhs)}
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <FAQ items={faqItems} heading="Common questions" />

        <SiteFooter />
      </div>
    </div>
  );
}
