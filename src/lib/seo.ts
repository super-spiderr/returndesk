// Shared metadata builder for calculator pages. Reads from the registry (the
// single source of truth for calculator copy) so title/description/canonical/
// OG data never has to be duplicated per-page.

import type { Metadata } from "next";
import { getCalculator } from "./registry";
import { SITE_URL } from "./site";

/** Metadata for a plain content page (trust pages, guides) that isn't in the calculator registry. */
export function pageMetadata(path: string, title: string, description: string): Metadata {
  return {
    title,
    description,
    alternates: {
      canonical: path,
    },
    openGraph: {
      title,
      description,
      url: path,
      type: "website",
    },
    twitter: {
      card: "summary",
      title,
      description,
    },
  };
}

export function calculatorMetadata(slug: string): Metadata {
  const calculator = getCalculator(slug);
  if (!calculator) return {};

  const path = `/calculators/${calculator.slug}`;
  const { title, metaDescription, ogImage } = calculator;

  return {
    title,
    description: metaDescription,
    alternates: {
      canonical: path,
    },
    openGraph: {
      title,
      description: metaDescription,
      url: path,
      type: "website",
      images: [{ url: ogImage }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: metaDescription,
      images: [ogImage],
    },
  };
}

/**
 * WebApplication structured data for a calculator page. Each calculator is a
 * free, no-login tool, which the schema states explicitly via `offers`.
 */
export function calculatorJsonLd(slug: string) {
  const calculator = getCalculator(slug);
  if (!calculator) return null;

  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: calculator.title,
    url: `${SITE_URL}/calculators/${calculator.slug}`,
    description: calculator.metaDescription,
    applicationCategory: "FinanceApplication",
    operatingSystem: "Any",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "INR",
    },
  };
}
