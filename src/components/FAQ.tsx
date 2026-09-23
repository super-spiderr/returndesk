import Reveal from "@/components/Reveal";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";

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
      <Reveal>
        <Accordion type="single" collapsible className="space-y-3">
          {items.map((item) => (
            <AccordionItem key={item.question} value={item.question}>
              <AccordionTrigger>{item.question}</AccordionTrigger>
              <AccordionContent>{item.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </Reveal>
    </section>
  );
}
