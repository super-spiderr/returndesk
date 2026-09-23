"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import BlackSlab, { BlackSlabAxis } from "./BlackSlab";
import Reveal from "./Reveal";
import AnimatedNumber from "./AnimatedNumber";
import { useLanguage } from "@/lib/i18n";

interface ScenarioItem {
  id: string;
  category: string;
  tabLabel: string;
  icon: string;
  eyebrow: string;
  statement: string;
  value: string;
  tone: "gain" | "cost";
  axis: BlackSlabAxis;
  comparison: string;
  breakdown: {
    label: string;
    value: string;
    subtext: string;
  }[];
  verdictTakeaway: string;
}

export default function VerdictShowcase() {
  const [activeId, setActiveId] = useState("loans");
  const { lang, t } = useLanguage();

  const scenarios: ScenarioItem[] = [
    {
      id: "loans",
      category: t.showcase.scenarios.loans.category,
      tabLabel: t.showcase.scenarios.loans.tabLabel,
      icon: "🏠",
      eyebrow: t.showcase.scenarios.loans.eyebrow,
      statement: t.showcase.scenarios.loans.statement,
      value: t.showcase.scenarios.loans.value,
      tone: "gain",
      axis: {
        valuePercent: 78,
        benchmarkPercent: 28,
        valueLabel: t.showcase.scenarios.loans.valueLabel,
        benchmarkLabel: t.showcase.scenarios.loans.benchmarkLabel,
      },
      comparison: t.showcase.scenarios.loans.comparison,
      breakdown: t.showcase.scenarios.loans.breakdown,
      verdictTakeaway: t.showcase.scenarios.loans.verdictTakeaway,
    },
    {
      id: "investments",
      category: t.showcase.scenarios.investments.category,
      tabLabel: t.showcase.scenarios.investments.tabLabel,
      icon: "📈",
      eyebrow: t.showcase.scenarios.investments.eyebrow,
      statement: t.showcase.scenarios.investments.statement,
      value: t.showcase.scenarios.investments.value,
      tone: "gain",
      axis: {
        valuePercent: 68,
        benchmarkPercent: 22,
        valueLabel: t.showcase.scenarios.investments.valueLabel,
        benchmarkLabel: t.showcase.scenarios.investments.benchmarkLabel,
      },
      comparison: t.showcase.scenarios.investments.comparison,
      breakdown: t.showcase.scenarios.investments.breakdown,
      verdictTakeaway: t.showcase.scenarios.investments.verdictTakeaway,
    },
    {
      id: "tax",
      category: t.showcase.scenarios.tax.category,
      tabLabel: t.showcase.scenarios.tax.tabLabel,
      icon: "💼",
      eyebrow: t.showcase.scenarios.tax.eyebrow,
      statement: t.showcase.scenarios.tax.statement,
      value: t.showcase.scenarios.tax.value,
      tone: "gain",
      axis: {
        valuePercent: 72,
        benchmarkPercent: 44,
        valueLabel: t.showcase.scenarios.tax.valueLabel,
        benchmarkLabel: t.showcase.scenarios.tax.benchmarkLabel,
      },
      comparison: t.showcase.scenarios.tax.comparison,
      breakdown: t.showcase.scenarios.tax.breakdown,
      verdictTakeaway: t.showcase.scenarios.tax.verdictTakeaway,
    },
    {
      id: "chit-fund",
      category: t.showcase.scenarios.chitFund.category,
      tabLabel: t.showcase.scenarios.chitFund.tabLabel,
      icon: "🪙",
      eyebrow: t.showcase.scenarios.chitFund.eyebrow,
      statement: t.showcase.scenarios.chitFund.statement,
      value: t.showcase.scenarios.chitFund.value,
      tone: "cost",
      axis: {
        valuePercent: 58,
        benchmarkPercent: 38,
        valueLabel: t.showcase.scenarios.chitFund.valueLabel,
        benchmarkLabel: t.showcase.scenarios.chitFund.benchmarkLabel,
      },
      comparison: t.showcase.scenarios.chitFund.comparison,
      breakdown: t.showcase.scenarios.chitFund.breakdown,
      verdictTakeaway: t.showcase.scenarios.chitFund.verdictTakeaway,
    },
  ];

  const current = scenarios.find((s) => s.id === activeId) ?? scenarios[0];

  return (
    <Reveal>
    <section className="mt-16 rounded-3xl border border-rule bg-paper p-6 sm:p-10 shadow-sm">
      {/* Section Header with generous margin */}
      <div className="max-w-3xl">
        <div className="mb-3.5 inline-flex items-center gap-2 rounded-full bg-wash px-3.5 py-1.5 text-xs font-bold tracking-wide text-muted border border-rule">
          <span className="h-2 w-2 rounded-full bg-ink" />
          {t.showcase.badge}
        </div>
        <h2
          className="m-0 mb-4 font-extrabold text-ink"
          style={{
            fontSize: "clamp(28px, 4vw, 42px)",
            letterSpacing: "-0.035em",
            lineHeight: 1.15,
          }}
        >
          {t.showcase.title}
        </h2>
        <p className="m-0 text-base sm:text-lg leading-relaxed text-muted">
          {t.showcase.subtitle}
        </p>
      </div>

      {/* Interactive Scenario Selector Tabs with clear gap and breathing room */}
      <div className="mt-10 flex flex-wrap gap-3 border-b border-rule pb-6">
        {scenarios.map((scenario) => {
          const isActive = scenario.id === activeId;
          return (
            <button
              key={scenario.id}
              type="button"
              onClick={() => setActiveId(scenario.id)}
              className={`relative flex items-center gap-2.5 rounded-xl px-4.5 py-3 text-sm font-bold transition-colors cursor-pointer ${
                isActive
                  ? "text-paper"
                  : "bg-wash text-muted hover:bg-[#e2e5e9] hover:text-ink border border-rule"
              }`}
            >
              {isActive && (
                <motion.span
                  layoutId="showcase-tab-bg"
                  className="absolute inset-0 rounded-xl bg-ink shadow-md"
                  transition={{ type: "spring", stiffness: 400, damping: 32 }}
                />
              )}
              <span className="relative text-base">{scenario.icon}</span>
              <span className="relative">{scenario.tabLabel}</span>
              <span
                className={`relative ml-1.5 rounded-md px-2 py-0.5 text-[10.5px] font-extrabold tracking-wide uppercase ${
                  isActive
                    ? scenario.tone === "gain"
                      ? "bg-emerald-900/70 text-lime-300"
                      : "bg-rose-900/70 text-rose-300"
                    : "bg-paper text-muted border border-rule/60"
                }`}
              >
                {scenario.tone === "gain" ? t.common.saveGain : t.common.costTrap}
              </span>
            </button>
          );
        })}
      </div>

      {/* Main Showcase Grid */}
      <AnimatePresence mode="wait">
        <motion.div
          key={current.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="mt-8 grid items-stretch gap-8 lg:grid-cols-12"
        >
          {/* Left Side: The Signature BlackSlab Verdict */}
          <div className="lg:col-span-7 flex flex-col justify-between">
            <BlackSlab
              key={`${current.id}-${lang}`}
              eyebrow={current.eyebrow}
              statement={current.statement}
              value={current.value}
              tone={current.tone}
              axis={current.axis}
              comparison={current.comparison}
              className="h-full shadow-lg"
            />
          </div>

          {/* Right Side: What this means / Mathematical Context Panel */}
          <div className="lg:col-span-5 flex flex-col justify-between rounded-2xl border border-rule bg-wash/70 p-6 sm:p-8">
            <div>
              <div className="flex items-center justify-between border-b border-rule pb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-muted">
                  {lang === "ta" ? "வகை" : "Category"} · {current.category}
                </span>
                <span
                  className={`text-xs font-extrabold px-2.5 py-1 rounded-full ${
                    current.tone === "gain"
                      ? "bg-emerald-100 text-emerald-800"
                      : "bg-rose-100 text-rose-800"
                  }`}
                >
                  {current.tone === "gain" ? t.common.recommendedMove : t.common.cautionaryOutcome}
                </span>
              </div>

              {/* Key Metrics Breakdown with generous spacing */}
              <div className="mt-6 space-y-3.5">
                {current.breakdown.map((item) => (
                  <div
                    key={item.label}
                    className="flex items-center justify-between rounded-xl border border-rule bg-paper p-4 shadow-xs"
                  >
                    <div className="pr-3">
                      <div className="text-xs font-bold text-muted uppercase tracking-wide">{item.label}</div>
                      <div className="text-xs text-muted/80 mt-0.5">{item.subtext}</div>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="font-black text-ink text-base sm:text-lg tabular-nums">
                        {item.value}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Verdict Takeaway Box */}
              <div className="mt-6 rounded-xl border border-rule bg-paper p-4.5 shadow-xs">
                <div className="text-xs font-extrabold uppercase tracking-wide text-ink mb-1.5 flex items-center gap-1.5">
                  <svg className="w-4 h-4 text-ink" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M12 16v-4M12 8h.01" />
                  </svg>
                  {t.common.mathematicalVerdict}
                </div>
                <p className="m-0 text-sm leading-relaxed text-muted font-medium">
                  {current.verdictTakeaway}
                </p>
              </div>
            </div>

            {/* Bottom Trust Indicators with clear spacing */}
            <div className="mt-8 pt-6 border-t border-rule grid grid-cols-3 gap-3 text-center">
              <div className="p-2">
                <div className="text-xl sm:text-2xl font-black text-ink">
                  <AnimatedNumber value={50} suffix="+" />
                </div>
                <div className="text-xs font-medium text-muted mt-0.5">{t.common.plannedTools}</div>
              </div>
              <div className="p-2 border-x border-rule">
                <div className="text-xl sm:text-2xl font-black text-ink">₹0</div>
                <div className="text-xs font-medium text-muted mt-0.5">{t.common.freeForever}</div>
              </div>
              <div className="p-2">
                <div className="text-xl sm:text-2xl font-black text-ink">0</div>
                <div className="text-xs font-medium text-muted mt-0.5">{t.common.productsSold}</div>
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </section>
    </Reveal>
  );
}
