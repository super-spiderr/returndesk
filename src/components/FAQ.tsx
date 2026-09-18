export interface FAQItem {
  question: string;
  answer: string;
}

/**
 * Renders visible FAQ content and its FAQPage JSON-LD from the same `items`
 * array — the schema is only ever a reflection of what's actually on screen.
 */
export default function FAQ({ items, heading }: { items: FAQItem[]; heading: string }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };

  return (
    <section className="mt-6 mb-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <h2 className="text-lg font-black text-ink mb-4">{heading}</h2>
      <div className="space-y-3">
        {items.map((item) => (
          <details key={item.question} className="group rounded-xl border border-rule bg-paper p-4">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-sm font-bold text-ink">
              {item.question}
              <span className="shrink-0 text-muted transition-transform group-open:rotate-45">+</span>
            </summary>
            <p className="mt-2 text-sm leading-relaxed text-muted">{item.answer}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
