// Single source of truth for every calculator on the site. This drives the
// sitemap, the homepage index, related-calculator links, and page metadata.

export type ClusterStatus = "live" | "soon";

export interface Cluster {
  order: number;
  slug: string;
  title: string;
  /** One-line description used on the homepage cluster card. */
  description: string;
  status: ClusterStatus;
  calculatorSlug: string;
}

export interface CalculatorPage {
  /** Route: /calculators/{slug} */
  slug: string;
  /** Cluster this page belongs to, by cluster slug. */
  cluster: string;
  title: string;
  subtitle: string;
  /** Used for <title> and meta description on the page itself. */
  metaDescription: string;
}

export const clusters: Cluster[] = [
  {
    order: 1,
    slug: "chit-funds",
    title: "Chit funds",
    description:
      "The real interest rate hiding in your chit — borrow or invest, get the verdict.",
    status: "live",
    calculatorSlug: "chit-fund",
  },
  {
    order: 2,
    slug: "salary-tax",
    title: "Salary & tax",
    description: "In-hand salary, old vs new regime, HRA exemption and breakeven.",
    status: "live",
    calculatorSlug: "salary-tax",
  },
  {
    order: 3,
    slug: "investments",
    title: "Investments & SIP",
    description: "Step-up SIP, inflation-adjusted real purchasing power, LTCG tax.",
    status: "live",
    calculatorSlug: "investments",
  },
  {
    order: 4,
    slug: "loans",
    title: "Loans & Prepayment",
    description: "EMI with prepayment, interest saved, tenure reduction, loan vs invest.",
    status: "live",
    calculatorSlug: "loans",
  },
];

export const calculators: CalculatorPage[] = [
  {
    slug: "chit-fund",
    cluster: "chit-funds",
    title: "Chit Fund Calculator",
    subtitle: "Find the real interest rate hiding in your chit fund auction.",
    metaDescription:
      "Work out the real interest rate in your chit fund — as a borrower or as a subscriber — compared against a personal loan or a fixed deposit.",
  },
  {
    slug: "salary-tax",
    cluster: "salary-tax",
    title: "Old vs New Tax Regime Calculator",
    subtitle: "Compare exact monthly in-hand pay, deductions, and find your breakeven point.",
    metaDescription:
      "Calculate your income tax under Old vs New Tax Regime for FY 2024-25 and 2025-26 with HRA, 80C, 80D and standard deduction.",
  },
  {
    slug: "investments",
    cluster: "investments",
    title: "SIP Real Return & Wealth Calculator",
    subtitle: "See your true post-tax, inflation-adjusted purchasing power with step-up compounding.",
    metaDescription:
      "Calculate nominal vs real inflation-adjusted SIP corpus with annual step-up and 12.5% LTCG tax impact.",
  },
  {
    slug: "loans",
    cluster: "loans",
    title: "Loan EMI & Prepayment Calculator",
    subtitle: "Calculate exact interest saved, months shaved, and guaranteed tax-free prepayment yield.",
    metaDescription:
      "Calculate home loan EMI, prepayment interest savings, tenure reduction, and risk-free return on prepaying principal.",
  },
];

/** First live calculator page for a cluster, if any exist yet. */
export function clusterHref(cluster: Cluster): string | undefined {
  const page = calculators.find((c) => c.cluster === cluster.slug);
  return page ? `/calculators/${page.slug}` : undefined;
}

export function getCalculator(slug: string): CalculatorPage | undefined {
  return calculators.find((c) => c.slug === slug);
}
