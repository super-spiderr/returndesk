import type { Metadata } from "next";
import { calculatorMetadata, calculatorJsonLd } from "@/lib/seo";
import LoansCalculatorClient from "./LoansCalculatorClient";

export const metadata: Metadata = calculatorMetadata("loans");

export default function LoansCalculatorPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(calculatorJsonLd("loans")) }}
      />
      <LoansCalculatorClient />
    </>
  );
}
