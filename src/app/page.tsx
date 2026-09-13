"use client";

import Image from "next/image";
import Link from "next/link";
import SiteNav from "@/components/SiteNav";
import SiteFooter from "@/components/SiteFooter";
import VerdictShowcase from "@/components/VerdictShowcase";
import ClusterCard from "@/components/ClusterCard";
import { clusterHref, clusters } from "@/lib/registry";
import { useLanguage } from "@/lib/i18n";

export default function Home() {
  const { t } = useLanguage();
  const sortedClusters = [...clusters].sort((a, b) => a.order - b.order);

  return (
    <div className="relative overflow-hidden bg-wash text-ink">
      {/* Faint watermark texture, ink not brand colour — lime/red stay
          reserved for the verdict slab below. */}
      <svg
        viewBox="0 0 900 900"
        aria-hidden="true"
        className="animate-drift pointer-events-none absolute -top-64 -right-64 h-[900px] w-[900px]"
      >
        <circle
          cx="450"
          cy="450"
          r="180"
          fill="none"
          stroke="#161C24"
          strokeOpacity="0.045"
          strokeWidth="26"
        />
        <circle
          cx="450"
          cy="450"
          r="280"
          fill="none"
          stroke="#161C24"
          strokeOpacity="0.045"
          strokeWidth="26"
        />
        <circle
          cx="450"
          cy="450"
          r="380"
          fill="none"
          stroke="#161C24"
          strokeOpacity="0.045"
          strokeWidth="26"
        />
      </svg>

      <div className="relative mx-auto max-w-7xl px-6">
        <SiteNav />

        <header className="grid items-center gap-8 py-16 sm:py-20 [grid-template-columns:repeat(auto-fit,minmax(300px,1fr))]">
          <div className="max-w-2xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-rule px-3.5 py-1.5 text-[12.5px] font-bold text-muted">
              <span className="inline-block h-2 w-2 rounded-full bg-ink" />
              {t.home.heroBadge}
            </div>
            <h1
              className="m-0 mb-5 font-black"
              style={{
                fontSize: "clamp(36px, 6.5vw, 84px)",
                letterSpacing: "-0.04em",
                lineHeight: 1.05,
              }}
            >
              {t.home.heroTitle}
            </h1>
            <p className="max-w-lg text-lg sm:text-xl leading-snug font-medium text-muted">
              {t.home.heroSubtitle}{" "}
              <strong className="text-ink">
                {t.home.heroSubtitleBold}
              </strong>{" "}
              {t.home.heroSubtitleEnd}
            </p>
            <div className="mt-8 flex flex-wrap gap-3.5">
              <a
                href="#calculators"
                className="group inline-flex items-center gap-2 rounded-md bg-ink px-6 py-4 text-base font-extrabold text-paper no-underline shadow-[0_1px_0_rgba(22,28,36,0.06)] transition-all hover:bg-[#2A313B] hover:shadow-md"
              >
                {t.home.exploreToolsBtn}{" "}
                <span className="inline-block transition-transform group-hover:translate-x-1">
                  ↓
                </span>
              </a>
              <Link
                href="/calculators/chit-fund"
                className="inline-flex items-center gap-2 rounded-md border border-rule px-6 py-4 text-base font-bold text-ink no-underline transition-colors hover:border-ink hover:bg-paper"
              >
                <span className="h-2 w-2 rounded-full bg-emerald-600 animate-pulse" />
                {t.home.chitFundLiveBtn}
              </Link>
            </div>

            <ul className="mt-8 grid gap-2.5 border-t border-rule pt-6 sm:grid-cols-2">
              {t.home.heroBulletPoints.map((point) => (
                <li
                  key={point}
                  className="flex items-start gap-2 text-[14.5px] leading-snug text-muted"
                >
                  <svg
                    viewBox="0 0 20 20"
                    aria-hidden="true"
                    className="mt-0.5 h-4 w-4 shrink-0 text-ink"
                  >
                    <circle
                      cx="10"
                      cy="10"
                      r="8.5"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.6"
                    />
                    <path
                      d="M6.2 10.3 L8.8 12.8 L13.8 7.4"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  {point}
                </li>
              ))}
            </ul>
          </div>
          <div className="relative">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 -z-10 rounded-full bg-ink/5 blur-3xl"
            />
            <Image
              src="/images/increasing-coins.webp"
              alt="Illustration of rupee coin stacks growing next to an upward arrow"
              width={1000}
              height={914}
              priority
              className="h-[300px] w-full object-contain sm:h-[380px]"
            />
          </div>
        </header>

        <section id="how-it-works" className="pt-4">
          <h2 className="m-0 mb-6 border-b-2 border-ink pb-2 text-[13px] font-bold text-muted">
            {t.home.howItWorksTitle}
          </h2>
          <div className="grid gap-7 [grid-template-columns:repeat(auto-fit,minmax(220px,1fr))]">
            {t.home.howItWorksSteps.map((step) => (
              <div key={step.n}>
                <div
                  className="tabular-nums mb-2.5 font-extrabold text-rule"
                  style={{ fontSize: "34px", letterSpacing: "-0.03em" }}
                >
                  {step.n}
                </div>
                <h3 className="m-0 mb-1.5 text-lg font-extrabold text-ink">
                  {step.title}
                </h3>
                <p className="m-0 text-[14.5px] leading-relaxed text-muted">
                  {step.body}
                </p>
              </div>
            ))}
          </div>
        </section>

        <VerdictShowcase />

        <section id="calculators" className="pt-18">
          <h2 className="m-0 mb-6 border-b-2 border-ink pb-2 text-[13px] font-bold text-muted">
            {t.home.theDeskTitle}
          </h2>
          <div className="grid gap-4 [grid-template-columns:repeat(auto-fit,minmax(240px,1fr))]">
            {sortedClusters.map((cluster) => (
              <ClusterCard
                key={cluster.slug}
                cluster={cluster}
                href={clusterHref(cluster)}
              />
            ))}
          </div>
        </section>

        <section className="mt-18 rounded-xl border border-rule bg-paper p-9 text-ink">
          <div className="grid items-center gap-7 [grid-template-columns:repeat(auto-fit,minmax(280px,1fr))]">
            <div>
              <div className="mb-4 text-[13px] font-bold text-muted">
                {t.home.whyReturnDeskPre}
              </div>
              <h2
                className="m-0 mb-3.5 font-extrabold"
                style={{
                  fontSize: "clamp(26px, 3.2vw, 40px)",
                  letterSpacing: "-0.03em",
                  lineHeight: 1.15,
                }}
              >
                {t.home.whyReturnDeskTitle}
              </h2>
              <p className="m-0 text-base leading-relaxed text-muted">
                {t.home.whyReturnDeskDesc}
              </p>
            </div>
            <Image
              src="/images/funnel.png"
              alt="Illustration contrasting a crowd funnelled toward a single glowing coin with a figure freely stacking coins at an open desk"
              width={1536}
              height={1024}
              className="h-[240px] w-full rounded-xl object-cover"
            />
          </div>

          <div className="mt-9 grid gap-5 border-t border-rule pt-8 sm:grid-cols-3">
            {t.home.comparisons.map((point) => (
              <div key={point.title}>
                <div className="mb-1.5 text-[15px] font-extrabold text-ink">
                  {point.title}
                </div>
                <div className="text-[14.5px] leading-relaxed text-muted">
                  {point.body}
                </div>
              </div>
            ))}
          </div>
        </section>

        <SiteFooter />
      </div>
    </div>
  );
}
