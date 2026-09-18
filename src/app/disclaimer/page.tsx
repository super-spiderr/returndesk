import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import TrustPageLayout from "@/components/TrustPageLayout";

export const metadata: Metadata = pageMetadata(
  "/disclaimer",
  "Disclaimer",
  "returndesk's calculators are mathematical illustrations based on stated assumptions, not personalised financial, tax, or investment advice."
);

export default function DisclaimerPage() {
  return (
    <TrustPageLayout title="Disclaimer" lastUpdated="18 September 2026" breadcrumbLabel="Disclaimer">
      <h2>Not financial advice</h2>
      <p>
        ReturnDesk is an independent calculation tool, not a SEBI-registered investment adviser and not a
        chartered accountant. Every verdict a calculator produces is a mathematical comparison based on
        the numbers you enter and the assumptions stated on that page — not a personal recommendation.
      </p>

      <h2>Results depend on your assumptions</h2>
      <p>
        Interest rates, expected returns, inflation, and tax figures are inputs you choose or defaults we
        provide for illustration. Change any of them and the result changes. Every calculator states its
        basis and comparison alongside the result — read that before treating a verdict as a conclusion.
      </p>

      <h2>Investment and loan calculators</h2>
      <p>
        Projected returns (for SIPs, lumpsum investments, or chit fund dividends) are estimates based on
        the growth rate you enter, not a guarantee of future performance. Market-linked instruments carry
        risk, and past or assumed rates of return do not predict future ones. Loan and prepayment figures
        assume the interest rate and tenure you enter stay constant; actual lender terms may differ.
      </p>

      <h2>Tax calculators</h2>
      <p>
        Tax results are tied to the financial year selected on that calculator, shown alongside a
        &quot;rules last verified&quot; date. Tax law changes with each Union Budget — a calculator will
        say explicitly which year&apos;s rules it used, and a new year is added only when we&apos;ve
        verified the updated slabs, not applied retroactively to old results.
      </p>

      <h2>No guarantee of accuracy</h2>
      <p>
        We take reasonable care to keep formulas correct and current, but we don&apos;t warrant that every
        figure is free of error or fully up to date at the moment you use it. Verify anything significant
        against an official source or a qualified professional before acting on it.
      </p>

      <h2>Contact</h2>
      <p>
        Spotted a calculation that looks wrong? Please tell us via <a href="/contact">our contact page</a>
        — see also our <a href="/terms">terms of use</a> and <a href="/privacy">privacy policy</a>.
      </p>
    </TrustPageLayout>
  );
}
