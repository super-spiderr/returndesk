import type { Metadata } from "next";
import { calculatorMetadata, calculatorJsonLd } from "@/lib/seo";
import SalaryTaxCalculatorClient from "./SalaryTaxCalculatorClient";

export const metadata: Metadata = calculatorMetadata("salary-tax");

export default function SalaryTaxCalculatorPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(calculatorJsonLd("salary-tax")) }}
      />
      <SalaryTaxCalculatorClient />
    </>
  );
}
