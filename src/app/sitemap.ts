import type { MetadataRoute } from "next";
import { calculators } from "@/lib/registry";
import { SITE_URL } from "@/lib/site";

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

  return [
    {
      url: SITE_URL,
      changeFrequency: "weekly",
      priority: 1,
    },
    ...calculatorEntries,
    ...trustEntries,
  ];
}
