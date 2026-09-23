"use client";

import Link from "next/link";
import { useLanguage } from "@/lib/i18n";

// Site is light-only: chrome stays fully monochrome, since lime/red are
// reserved for verdicts and never appear on a button, badge, link, or header.
// Links get a grow-in underline on hover for a bit of life without touching
// colour — pure CSS, no JS, so it costs nothing on 90+ static pages.
const linkUnderline =
  "relative no-underline after:absolute after:left-0 after:-bottom-0.5 after:h-[1.5px] after:w-0 after:bg-ink after:transition-all after:duration-300 hover:after:w-full";

export default function SiteNav() {
  const { lang, toggleLang, t } = useLanguage();

  return (
    <nav className="flex flex-wrap items-center justify-between gap-y-3 border-b border-rule py-4.5">
      <Link
        href="/"
        className="shrink-0 text-xl font-extrabold tracking-tight text-ink no-underline transition-transform duration-200 hover:scale-[1.02] active:scale-[0.98]"
      >
        {t.nav.brand}
      </Link>
      <div className="flex flex-wrap items-center gap-3 sm:gap-6 text-xs sm:text-[13px] font-bold text-muted">
        <Link href="/#calculators" className={`${linkUnderline} hover:text-ink transition-colors`}>
          {t.nav.allTools}
        </Link>
        <Link
          href="/calculators/loans"
          className={`hidden sm:inline-block ${linkUnderline} hover:text-ink transition-colors`}
        >
          {t.nav.loans}
        </Link>
        <Link
          href="/calculators/salary-tax"
          className={`hidden sm:inline-block ${linkUnderline} hover:text-ink transition-colors`}
        >
          {t.nav.salaryTax}
        </Link>
        <Link
          href="/calculators/investments"
          className={`hidden sm:inline-block ${linkUnderline} hover:text-ink transition-colors`}
        >
          {t.nav.investments}
        </Link>
        <Link
          href="/calculators/chit-fund"
          className="rounded-md border border-rule px-3 py-1.5 text-ink no-underline transition-all duration-200 hover:border-ink hover:bg-paper hover:shadow-[0_2px_10px_rgba(22,28,36,0.08)] active:scale-[0.97]"
        >
          {t.nav.chitFund}
        </Link>
        <button
          type="button"
          onClick={toggleLang}
          className="inline-flex items-center gap-1.5 rounded-md bg-wash border border-rule px-2.5 py-1.5 text-xs font-extrabold text-ink hover:bg-paper hover:border-ink hover:shadow-[0_2px_10px_rgba(22,28,36,0.08)] transition-all duration-200 cursor-pointer active:scale-[0.97]"
          title={lang === "en" ? "தமிழில் பார்க்க" : "Switch to English"}
        >
          <span className="text-[13px]">🌐</span>
          <span>{t.nav.switchLanguage}</span>
        </button>
      </div>
    </nav>
  );
}
