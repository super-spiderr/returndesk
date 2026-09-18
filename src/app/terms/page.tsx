import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import TrustPageLayout from "@/components/TrustPageLayout";

export const metadata: Metadata = pageMetadata(
  "/terms",
  "Terms of Use",
  "The terms governing use of returndesk's free financial calculators."
);

export default function TermsPage() {
  return (
    <TrustPageLayout title="Terms of Use" lastUpdated="18 September 2026" breadcrumbLabel="Terms">
      <h2>Acceptance of these terms</h2>
      <p>
        By using returndesk, you agree to these terms. If you don&apos;t agree with them, please don&apos;t
        use the site.
      </p>

      <h2>What the service is</h2>
      <p>
        ReturnDesk provides free, publicly accessible financial calculators for the Indian context. No
        account or payment is required to use them.
      </p>

      <h2>Not professional advice</h2>
      <p>
        Nothing on this site is financial, tax, legal, or investment advice. Calculators produce
        mathematical results based on the inputs and assumptions stated on each page — see our{" "}
        <a href="/disclaimer">disclaimer</a> for details. Decisions based on these results are yours
        alone, and we recommend verifying anything significant with a qualified professional.
      </p>

      <h2>Accuracy</h2>
      <p>
        We make a genuine effort to keep formulas and tax rules current and correct, and tax calculators
        state the financial year they apply to. Even so, financial products, interest rates, and tax law
        can change, and we don&apos;t guarantee that every figure is error-free or current at the moment
        you use it.
      </p>

      <h2>Acceptable use</h2>
      <p>
        Don&apos;t attempt to disrupt the site, scrape it at a rate that degrades service for others, or
        use it for an unlawful purpose.
      </p>

      <h2>Intellectual property</h2>
      <p>
        The site&apos;s design, text, and calculator logic belong to returndesk unless otherwise noted.
        You&apos;re welcome to link to any page or share a result; please don&apos;t republish our content
        as your own.
      </p>

      <h2>Limitation of liability</h2>
      <p>
        The site is provided &quot;as is&quot;, without warranty of any kind. To the fullest extent
        permitted by law, returndesk is not liable for any loss or damage arising from your use of, or
        reliance on, this site.
      </p>

      <h2>Changes to these terms</h2>
      <p>
        We may update these terms as the site changes. The date at the top of this page reflects the last
        update.
      </p>

      <h2>Governing law</h2>
      <p>These terms are governed by the laws of India.</p>

      <h2>Contact</h2>
      <p>
        Questions about these terms can be sent to <a href="/contact">our contact page</a>.
      </p>
    </TrustPageLayout>
  );
}
