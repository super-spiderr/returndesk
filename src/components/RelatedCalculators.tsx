import Link from "next/link";
import { calculators } from "@/lib/registry";
import { calculatorDisplayInfo } from "@/lib/calculatorContent";
import type { TranslationDict } from "@/lib/i18n";

export default function RelatedCalculators({
  currentSlug,
  t,
  heading,
}: {
  currentSlug: string;
  t: TranslationDict;
  heading: string;
}) {
  const displayInfo = calculatorDisplayInfo(t);
  const items = calculators
    .filter((c) => c.slug !== currentSlug)
    .map((c) => ({ slug: c.slug, ...displayInfo[c.slug] }));

  return (
    <section className="mt-6 mb-16">
      <h2 className="text-xs font-extrabold uppercase tracking-widest text-muted mb-4">{heading}</h2>
      <div className="grid gap-4 sm:grid-cols-3">
        {items.map((item) => (
          <Link
            key={item.slug}
            href={`/calculators/${item.slug}`}
            className="block rounded-2xl border border-rule bg-paper p-5 no-underline hover:border-ink transition-colors"
          >
            <div className="text-sm font-black text-ink mb-1">{item.title}</div>
            <div className="text-xs text-muted leading-relaxed">{item.subtitle}</div>
          </Link>
        ))}
      </div>
    </section>
  );
}
