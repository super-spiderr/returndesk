import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import TrustPageLayout from "@/components/TrustPageLayout";

export const metadata: Metadata = pageMetadata(
  "/privacy",
  "Privacy Policy",
  "What returndesk collects (almost nothing), how calculator inputs are handled, and how Google-served advertising uses cookies on this site."
);

export default function PrivacyPage() {
  return (
    <TrustPageLayout title="Privacy Policy" lastUpdated="18 September 2026" breadcrumbLabel="Privacy">
      <h2>Overview</h2>
      <p>
        ReturnDesk does not require an account, and we do not collect or store the financial figures you
        enter into a calculator. This page explains what does happen when you use the site.
      </p>

      <h2>Calculator inputs</h2>
      <p>
        Every calculator runs entirely in your browser. The numbers you type — salary, loan amount, SIP
        amount, and so on — are used to compute a result on your device and are never transmitted to or
        stored on our servers, because the site itself has no backend to send them to.
      </p>

      <h2>Cookies and advertising</h2>
      <p>
        This site uses Google AdSense to display advertising. Google and its partners may use cookies or
        similar technologies to serve ads based on your prior visits to this and other websites. You can
        review or opt out of personalised advertising through{" "}
        <a href="https://adssettings.google.com" target="_blank" rel="noopener noreferrer">
          Google Ads Settings
        </a>, and read more about how Google uses data in{" "}
        <a
          href="https://policies.google.com/technologies/partner-sites"
          target="_blank"
          rel="noopener noreferrer"
        >
          Google&apos;s partner sites policy
        </a>.
      </p>

      <h2>Analytics</h2>
      <p>
        ReturnDesk does not currently run any analytics or tracking scripts of its own. If that changes,
        this policy will be updated to say what is collected and why.
      </p>

      <h2>Third-party links</h2>
      <p>
        Pages on this site may link to external resources or advertisers. We aren&apos;t responsible for
        the privacy practices of sites we don&apos;t control.
      </p>

      <h2>Children&apos;s privacy</h2>
      <p>ReturnDesk is a general-audience financial tool and is not directed at children.</p>

      <h2>Changes to this policy</h2>
      <p>
        We may update this policy as the site changes. The date at the top of this page reflects the last
        update.
      </p>

      <h2>Contact</h2>
      <p>
        Questions about this policy can be sent to <a href="/contact">our contact page</a>.
      </p>
    </TrustPageLayout>
  );
}
