"use client";

import Link from "next/link";
import type { Cluster } from "@/lib/registry";
import { useLanguage } from "@/lib/i18n";

export default function ClusterCard({ cluster, href }: { cluster: Cluster; href?: string }) {
  const { lang, t } = useLanguage();
  const isLive = cluster.status === "live" && Boolean(href);
  const orderLabel = String(cluster.order).padStart(2, "0");

  const localizedInfo = (() => {
    switch (cluster.slug) {
      case "chit-funds":
        return t.clusters.chitFunds;
      case "salary-tax":
        return t.clusters.salaryTax;
      case "investments":
        return t.clusters.investments;
      case "loans":
        return t.clusters.loans;
      default:
        return { title: cluster.title, description: cluster.description };
    }
  })();

  const statusText = isLive
    ? lang === "ta" ? "நேரலை" : "LIVE NOW"
    : lang === "ta" ? "விரைவில்" : "SOON";

  const openBtnText = lang === "ta" ? "கால்குலேட்டரைத் திறக்க →" : "Open Calculator →";

  const body = (
    <div className="grid content-start gap-3">
      <div className="flex items-center justify-between">
        <span className="text-xs font-extrabold uppercase tracking-wider text-muted">
          {orderLabel} · {statusText}
        </span>
        {isLive && (
          <span className="inline-block h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
        )}
      </div>
      <span className="text-xl font-black text-ink tracking-tight">{localizedInfo.title}</span>
      <span className="text-sm leading-relaxed text-muted">{localizedInfo.description}</span>
      {isLive && (
        <span className="mt-2 inline-flex items-center gap-1.5 text-sm font-extrabold text-ink group-hover:translate-x-1 transition-transform">
          {openBtnText}
        </span>
      )}
    </div>
  );

  if (isLive && href) {
    return (
      <Link
        href={href}
        className="group rounded-2xl border-2 border-ink bg-paper p-6 no-underline transition-all hover:bg-wash hover:shadow-md hover:border-ink cursor-pointer"
      >
        {body}
      </Link>
    );
  }

  return <div className="rounded-2xl border border-rule bg-paper p-6 opacity-70">{body}</div>;
}
