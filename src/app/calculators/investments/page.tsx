import type { Metadata } from "next";
import { calculatorMetadata, calculatorJsonLd } from "@/lib/seo";
import InvestmentsCalculatorClient from "./InvestmentsCalculatorClient";

export const metadata: Metadata = calculatorMetadata("investments");

export default function InvestmentsCalculatorPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(calculatorJsonLd("investments")) }}
      />
      <InvestmentsCalculatorClient />
    </>
  );
}
