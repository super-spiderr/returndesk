import type { MetadataRoute } from "next";
import { calculators } from "@/lib/registry";
import { SITE_URL } from "@/lib/site";
import { CTC_LAKHS, REGIME_SLUGS, ctcToSlug } from "@/lib/salaryPages";

// Static export has no server to regenerate this on request.
export const dynamic = "force-static";

const trustPages = ["about", "contact", "privacy", "terms", "disclaimer"];

export default function sitemap(): MetadataRoute.Sitemap {
  const calculatorEntries: MetadataRoute.Sitemap = calculators.map((calculator) => ({
    url: `${SITE_URL}/calculators/${calculator.slug}`,
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  const trustEntries: MetadataRoute.Sitemap = trustPages.map((slug) => ({
    url: `${SITE_URL}/${slug}`,
    changeFrequency: "yearly",
    priority: 0.3,
  }));

  // Driven by the same CTC_LAKHS list that feeds the hub page and
  // generateStaticParams — a new CTC value shows up here automatically.
  const salaryHubEntry: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/salary-calculator`, changeFrequency: "monthly", priority: 0.7 },
  ];
  const salaryCtcEntries: MetadataRoute.Sitemap = CTC_LAKHS.map((lakhs) => ({
    url: `${SITE_URL}/salary-calculator/${ctcToSlug(lakhs)}`,
    changeFrequency: "monthly",
    priority: 0.6,
  }));
  const salaryRegimeEntries: MetadataRoute.Sitemap = CTC_LAKHS.flatMap((lakhs) =>
    REGIME_SLUGS.map((regime) => ({
      url: `${SITE_URL}/salary-calculator/${ctcToSlug(lakhs)}/${regime}`,
      changeFrequency: "monthly" as const,
      priority: 0.5,
    }))
  );

  return [
    {
      url: SITE_URL,
      changeFrequency: "weekly",
      priority: 1,
    },
    ...calculatorEntries,
    ...trustEntries,
    ...salaryHubEntry,
    ...salaryCtcEntries,
    ...salaryRegimeEntries,
  ];
}
