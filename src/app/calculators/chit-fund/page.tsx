import type { Metadata } from "next";
import { calculatorMetadata, calculatorJsonLd } from "@/lib/seo";
import ChitFundCalculatorClient from "./ChitFundCalculatorClient";

export const metadata: Metadata = calculatorMetadata("chit-fund");

export default function ChitFundCalculatorPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(calculatorJsonLd("chit-fund")) }}
      />
      <ChitFundCalculatorClient />
    </>
  );
}
