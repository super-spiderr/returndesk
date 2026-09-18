import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import TrustPageLayout from "@/components/TrustPageLayout";

export const metadata: Metadata = pageMetadata(
  "/about",
  "About",
  "ReturnDesk is a set of free Indian personal finance calculators built around one idea: show the math, then say plainly what it means."
);

export default function AboutPage() {
  return (
    <TrustPageLayout title="About returndesk" lastUpdated="18 September 2026" breadcrumbLabel="About">
      <h2>The calculator that takes your side</h2>
      <p>
        Most financial calculators stop at a number: an EMI, a maturity value, a tax figure. ReturnDesk
        goes one step further. Every calculator on this site follows the same structure — inputs, a
        calculation, the transparent mathematics behind it, a comparison against a reasonable
        alternative, and a plain-English verdict explaining what the number actually means for you.
      </p>
      <p>
        We call this the Verdict Engine. It doesn&apos;t decide anything for you — it does the arithmetic a
        bank, broker, or chit fund foreman would rather you didn&apos;t do yourself, states the assumptions
        behind it, and hands you the comparison in plain language.
      </p>

      <h2>What we actually check</h2>
      <p>
        Behind every result is ordinary, verifiable financial mathematics — EMI amortisation, XIRR,
        compounding, and the current income tax slabs for the financial year you select. We show the
        formula, not just the output, so you can check our work instead of taking it on faith.
      </p>

      <h2>What this is not</h2>
      <p>
        ReturnDesk does not provide personalised financial, tax, or investment advice, and it is not a
        SEBI-registered investment adviser. Every verdict is a mathematical comparison based on the
        numbers you enter and the assumptions stated on that page — not a recommendation tailored to
        your circumstances. See our <a href="/disclaimer">disclaimer</a> for the full picture.
      </p>

      <h2>No login, nothing for sale</h2>
      <p>
        Every calculator is free and works without creating an account. Nothing you type is sent to a
        server for storage — the calculations run entirely in your browser.
      </p>

      <h2>How this stays free</h2>
      <p>
        ReturnDesk is currently supported by its own running costs alone. The site may show advertising
        served by Google to help cover hosting and development as it grows. Ads, if and when shown, never
        influence a calculator&apos;s math or its verdict — see our{" "}
        <a href="/privacy">privacy policy</a> for how that advertising works.
      </p>

      <h2>Get in touch</h2>
      <p>
        Found a calculation that looks off, or a tax rule that&apos;s changed? We&apos;d genuinely like to
        know — see the <a href="/contact">contact page</a>.
      </p>
    </TrustPageLayout>
  );
}
