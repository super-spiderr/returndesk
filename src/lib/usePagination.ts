"use client";

import { useState } from "react";

/**
 * Client-side pagination over an already-computed array (amortization
 * schedules etc. are cheap to compute in full; only rendering is paginated).
 * Clamps to a valid page inline, so a shrinking array (e.g. a shorter
 * tenure) never leaves the view stuck on a page that no longer exists.
 */
export function usePagination<T>(items: T[], pageSize: number) {
  const [page, setPage] = useState(0);
  const pageCount = Math.max(1, Math.ceil(items.length / pageSize));
  const safePage = Math.min(page, pageCount - 1);
  const pageItems = items.slice(safePage * pageSize, safePage * pageSize + pageSize);

  return { page: safePage, setPage, pageCount, pageItems };
}
