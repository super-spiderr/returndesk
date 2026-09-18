"use client";

import { interpolate } from "@/lib/i18n";

export default function TablePagination({
  page,
  pageCount,
  onPageChange,
  labels,
}: {
  page: number;
  pageCount: number;
  onPageChange: (page: number) => void;
  labels: { previous: string; next: string; pageOf: string };
}) {
  if (pageCount <= 1) return null;

  return (
    <div className="mt-4 flex items-center justify-between gap-3 text-xs font-bold">
      <button
        type="button"
        onClick={() => onPageChange(page - 1)}
        disabled={page === 0}
        className="rounded-md border border-rule px-3 py-1.5 text-ink cursor-pointer transition-colors hover:border-ink disabled:cursor-not-allowed disabled:opacity-40"
      >
        {labels.previous}
      </button>
      <span className="text-muted">{interpolate(labels.pageOf, { page: page + 1, total: pageCount })}</span>
      <button
        type="button"
        onClick={() => onPageChange(page + 1)}
        disabled={page === pageCount - 1}
        className="rounded-md border border-rule px-3 py-1.5 text-ink cursor-pointer transition-colors hover:border-ink disabled:cursor-not-allowed disabled:opacity-40"
      >
        {labels.next}
      </button>
    </div>
  );
}
