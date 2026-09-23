"use client";

import Image from "next/image";
import Link from "next/link";
import { useLanguage } from "@/lib/i18n";

// Site is light-only: chrome stays fully monochrome, since lime/red are
// reserved for verdicts and never appear on a button, badge, link, or header.
// The logo mark itself is the one exception — it's a brand asset, not a UI
// colour choice, so it keeps its own green.
export default function SiteNav() {
  const { lang, toggleLang, t } = useLanguage();

  return (
    <nav className="flex flex-wrap items-center justify-between gap-y-3 border-b border-rule py-4.5">
      <Link
        href="/"
        className="flex shrink-0 items-center gap-2 text-xl font-extrabold tracking-tight text-ink no-underline hover:opacity-85 transition-opacity"
      >
        <Image src="/images/logo-icon.png" alt="" width={128} height={128} priority className="h-8 w-8 shrink-0" />
        {t.nav.brand}
      </Link>
      <div className="flex flex-wrap items-center gap-3 sm:gap-6 text-xs sm:text-[13px] font-bold text-muted">
        <Link href="/#calculators" className="no-underline hover:text-ink transition-colors">
          {t.nav.allTools}
        </Link>
        <Link href="/calculators/loans" className="hidden sm:inline-block no-underline hover:text-ink transition-colors">
          {t.nav.loans}
        </Link>
        <Link href="/calculators/salary-tax" className="hidden sm:inline-block no-underline hover:text-ink transition-colors">
          {t.nav.salaryTax}
        </Link>
        <Link href="/calculators/investments" className="hidden sm:inline-block no-underline hover:text-ink transition-colors">
          {t.nav.investments}
        </Link>
        <Link href="/calculators/chit-fund" className="rounded-md border border-rule px-3 py-1.5 text-ink no-underline hover:border-ink hover:bg-paper transition-all">
          {t.nav.chitFund}
        </Link>
        <button
          type="button"
          onClick={toggleLang}
          className="inline-flex items-center gap-1.5 rounded-md bg-wash border border-rule px-2.5 py-1.5 text-xs font-extrabold text-ink hover:bg-paper hover:border-ink transition-all cursor-pointer shadow-2xs"
          title={lang === "en" ? "தமிழில் பார்க்க" : "Switch to English"}
        >
          <span className="text-[13px]">🌐</span>
          <span>{t.nav.switchLanguage}</span>
        </button>
      </div>
    </nav>
  );
}
