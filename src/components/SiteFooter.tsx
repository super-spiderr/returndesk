"use client";

import Link from "next/link";
import { useLanguage } from "@/lib/i18n";

export default function SiteFooter() {
  const { t } = useLanguage();

  return (
    <footer className="mt-20 border-t border-rule pt-8 pb-12 text-[13px] text-muted">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <span className="font-extrabold text-ink text-base">{t.nav.brand}</span>
          <p className="m-0 text-xs text-muted mt-1">
            {t.footer.description}
          </p>
        </div>
        <div className="flex flex-wrap gap-4 text-xs font-bold text-ink">
          <Link href="/calculators/loans" className="hover:underline">
            {t.footer.loansPrepayment}
          </Link>
          <Link href="/calculators/salary-tax" className="hover:underline">
            {t.footer.salaryTax}
          </Link>
          <Link href="/calculators/investments" className="hover:underline">
            {t.footer.investmentsSIP}
          </Link>
          <Link href="/calculators/chit-fund" className="hover:underline">
            {t.footer.chitFunds}
          </Link>
        </div>
      </div>
      <div className="flex flex-wrap gap-4 text-xs font-bold text-muted mb-4">
        <Link href="/about" className="hover:text-ink hover:underline">
          {t.footer.about}
        </Link>
        <Link href="/contact" className="hover:text-ink hover:underline">
          {t.footer.contact}
        </Link>
        <Link href="/privacy" className="hover:text-ink hover:underline">
          {t.footer.privacy}
        </Link>
        <Link href="/terms" className="hover:text-ink hover:underline">
          {t.footer.terms}
        </Link>
        <Link href="/disclaimer" className="hover:text-ink hover:underline">
          {t.footer.disclaimerLink}
        </Link>
      </div>
      <div className="flex flex-wrap justify-between gap-3 text-xs text-muted/80 border-t border-rule/60 pt-4">
        <span>{t.footer.copyright}</span>
        <span>{t.footer.disclaimer}</span>
      </div>
    </footer>
  );
}
