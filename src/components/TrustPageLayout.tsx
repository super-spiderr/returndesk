import SiteNav from "@/components/SiteNav";
import SiteFooter from "@/components/SiteFooter";
import Breadcrumbs from "@/components/Breadcrumbs";

export default function TrustPageLayout({
  title,
  lastUpdated,
  breadcrumbLabel,
  children,
}: {
  title: string;
  lastUpdated: string;
  breadcrumbLabel: string;
  children: React.ReactNode;
}) {
  return (
    <div className="relative overflow-hidden bg-wash text-ink min-h-screen">
      <div className="relative mx-auto max-w-3xl px-4 sm:px-6">
        <SiteNav />

        <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: breadcrumbLabel }]} />

        <div className="pt-8 pb-16">
          <h1
            className="m-0 mb-2 font-black text-ink tracking-tight"
            style={{ fontSize: "clamp(28px, 4vw, 42px)", lineHeight: 1.1 }}
          >
            {title}
          </h1>
          <p className="text-xs font-bold text-muted mb-8">Last updated: {lastUpdated}</p>

          <div className="legal-content">{children}</div>
        </div>

        <SiteFooter />
      </div>
    </div>
  );
}
