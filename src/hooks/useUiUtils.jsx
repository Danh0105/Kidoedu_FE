// src/hooks/useUiUtils.js
import { useEffect, useState, useCallback } from "react";

/** Debounce một giá trị bất kỳ */
export function useDebounce(value, delay = 400) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

/** Xây pager có dấu … theo windowSize */
export function buildPager(totalPages, current, windowSize = 2) {
  if (!totalPages) return [];
  const out = [];
  const add = (num, label = String(num), currentFlag = false) =>
    out.push({ key: `${label}-${num}`, num, label, current: currentFlag });

  const start = Math.max(1, current - windowSize);
  const end = Math.min(totalPages, current + windowSize);

  if (start > 1) {
    add(1, "1", current === 1);
    if (start > 2) out.push({ key: "ellipsis-start", ellipsis: true });
  }
  for (let i = start; i <= end; i++) add(i, String(i), i === current);
  if (end < totalPages) {
    if (end < totalPages - 1) out.push({ key: "ellipsis-end", ellipsis: true });
    add(totalPages, String(totalPages), current === totalPages);
  }
  return out;
}

/** Format tiền VND an toàn */
export function toVND(n) {
  return Number(n || 0).toLocaleString("vi-VN", {
    style: "currency",
    currency: "VND",
  });
}

/** Ghép baseURL và query params an toàn */
export const useSafeBuildUrl = (apiBase) =>
  useCallback(
    (path, params) => {
      const base = String(apiBase || "").replace(/\/+$/, "");
      const url = new URL(path, base);
      for (const [k, v] of Object.entries(params || {})) {
        if (v !== undefined && v !== null) url.searchParams.set(k, String(v));
      }
      return url.toString();
    },
    [apiBase]
  );

export const pickBadgesFromStatus = (raw) => {
  const s = Number(raw ?? 0);
  const tags = [];
  if (s === 1 || s === 12) tags.push({ text: "Nổi bật", className: "bg-warning text-dark" });
  if (s === 2 || s === 12) tags.push({ text: "Mới", className: "bg-danger" });
  return tags;
};
export const pickRibbonFromStatus = (raw) => {
  const s = Number(raw ?? 0);
  // Mặc định: trái
  if (s === 2) return [{ text: "Mới", className: "bg-danger", position: "left" }];
  if (s === 1) return [{ text: "Nổi bật", className: "bg-warning text-dark", position: "left" }];
  if (s === 12) {
    return [
      { text: "Mới", className: "bg-danger", position: "left" },
      { text: "Nổi bật", className: "bg-warning text-dark", position: "right" },
    ];
  }
  return [];
};