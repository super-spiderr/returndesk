import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import TrustPageLayout from "@/components/TrustPageLayout";

export const metadata: Metadata = pageMetadata(
  "/contact",
  "Contact",
  "How to reach returndesk with corrections, questions, or feedback about a calculator."
);

export default function ContactPage() {
  return (
    <TrustPageLayout title="Contact" lastUpdated="18 September 2026" breadcrumbLabel="Contact">
      <h2>Email</h2>
      <p>
        For corrections, bugs, or questions about how a calculator works, write to{" "}
        <a href="mailto:hello@returndesk.in">hello@returndesk.in</a>. This is an independently run site,
        so replies may take a few days.
      </p>

      <h2>What we can help with</h2>
      <ul>
        <li>A calculation that looks wrong, or a tax rule that&apos;s changed</li>
        <li>Bugs, broken pages, or display issues</li>
        <li>Suggestions for a calculator or guide you&apos;d find useful</li>
      </ul>

      <h2>What we can&apos;t help with</h2>
      <p>
        We can&apos;t offer personalised financial, tax, or investment advice by email. For decisions
        specific to your situation, please consult a qualified professional — see our{" "}
        <a href="/disclaimer">disclaimer</a>.
      </p>
    </TrustPageLayout>
  );
}
