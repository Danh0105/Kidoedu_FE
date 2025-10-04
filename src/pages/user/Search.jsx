// SearchProducts.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";

/**
 * Props:
 *  - apiBase: string (vd "http://localhost:3000")
 *  - pageSizeOptions?: number[] (default: [6, 12, 24, 48])
 */
export default function SearchProducts({ apiBase = "https://kidoedu.vn", pageSizeOptions = 12 }) {
  // UI state
  const [q, setQ] = useState("");
  const [limit, setLimit] = useState(pageSizeOptions[1] ?? 12);
  const [page, setPage] = useState(1);

  // Data state
  const [items, setItems] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, pages: 0, total: 0, limit });
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  // debounce
  const debouncedQ = useDebounce(q, 500);
  const canSearch = debouncedQ.trim().length > 0;
  const firstRender = useRef(true);

  // Fetch
  const fetchData = async (signal) => {
    if (!canSearch) {
      setItems([]);
      setPagination({ page: 1, pages: 0, total: 0, limit });
      return;
    }
    setLoading(true);
    setErr("");
    try {
      const url = new URL("/search/products", apiBase);
      url.searchParams.set("q", debouncedQ);
      url.searchParams.set("page", String(page));
      url.searchParams.set("limit", String(limit));

      const res = await fetch(url.toString(), { signal });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();

      setItems(data.items || []);
      setPagination(data.pagination || { page, pages: 0, total: 0, limit });
    } catch (e) {
      if (e.name !== "AbortError") setErr(e?.message || "Đã có lỗi xảy ra");
    } finally {
      setLoading(false);
    }
  };

  // Auto fetch khi q/page/limit đổi
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    const ctl = new AbortController();
    fetchData(ctl.signal);
    return () => ctl.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedQ, page, limit]);

  // Cuộn lên đầu trang khi đổi page
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [page]);

  const pager = useMemo(
    () => buildPager(pagination.pages, pagination.page, 2),
    [pagination.pages, pagination.page]
  );

  return (
    <div className="container py-4">
      {/* Header / Search bar */}
      <div className="d-flex flex-column gap-2 gap-md-3 mb-3">
        <h1 className="h4 mb-0">Tìm kiếm sản phẩm</h1>
        <div className="row g-2 align-items-center">
          <div className="col-12 col-md-8">
            <input
              className="form-control form-control-lg"
              placeholder="Nhập từ khóa (vd: rover, may lanh lg, ...)"
              value={q}
              onChange={(e) => { setQ(e.target.value); setPage(1); }}
            />
          </div>
          {/* <div className="col-6 col-md-2">
            <select
              className="form-select"
              value={limit}
              onChange={(e) => { setLimit(Number(e.target.value)); setPage(1); }}
              aria-label="Số kết quả mỗi trang"
            >
              {pageSizeOptions.map(n => <option key={n} value={n}>{n}/trang</option>)}
            </select>
          </div> */}
          <div className="col-6 col-md-2 d-grid">
            <button
              className="btn btn-primary"
              onClick={() => fetchData()}
              disabled={!q.trim() || loading}
            >
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" aria-hidden="true" />
                  Đang tìm…
                </>
              ) : "Tìm kiếm"}
            </button>
          </div>
        </div>
      </div>

      {/* Status */}
      {err && <div className="alert alert-danger">Lỗi: {err}</div>}
      {!err && !loading && !canSearch && (
        <div className="text-muted">Nhập từ khóa để bắt đầu tìm kiếm.</div>
      )}
      {!err && !loading && canSearch && pagination.total === 0 && (
        <div className="alert alert-warning">Không tìm thấy kết quả phù hợp.</div>
      )}

      {/* Summary + small pager */}
      {!err && pagination.total > 0 && (
        <div className="d-flex justify-content-between align-items-center mb-2">
          <div>
            Tìm thấy <strong>{pagination.total}</strong> sản phẩm
          </div>
          <div className="btn-group btn-group-sm" role="group">
            <button
              className="btn btn-outline-secondary"
              disabled={pagination.page <= 1}
              onClick={() => setPage(p => Math.max(1, p - 1))}
            >
              Trước
            </button>
            <span className="btn btn-outline-secondary disabled">
              Trang {pagination.page}/{pagination.pages || 1}
            </span>
            <button
              className="btn btn-outline-secondary"
              disabled={pagination.page >= pagination.pages}
              onClick={() => setPage(p => Math.min(pagination.pages, p + 1))}
            >
              Sau
            </button>
          </div>
        </div>
      )}

      {/* Grid results */}
      <div className="row g-3">
        {items.map((it) => (
          <div key={it.product_id} className="col-12 col-sm-6 col-lg-4 col-xl-3">
            <CardProduct item={it} />
          </div>
        ))}
      </div>

      {/* Pagination */}
      {pagination.pages > 1 && (
        <nav className="mt-4" aria-label="pagination">
          <ul className="pagination justify-content-center flex-wrap gap-1">
            <li className={`page-item ${pagination.page === 1 ? "disabled" : ""}`}>
              <button className="page-link" onClick={() => setPage(p => Math.max(1, p - 1))}>«</button>
            </li>
            {pager.map(p =>
              p.ellipsis ? (
                <li key={p.key} className="page-item disabled">
                  <span className="page-link">…</span>
                </li>
              ) : (
                <li key={p.key} className={`page-item ${p.current ? "active" : ""}`}>
                  <button className="page-link" onClick={() => setPage(p.num)}>{p.label}</button>
                </li>
              )
            )}
            <li className={`page-item ${pagination.page === pagination.pages ? "disabled" : ""}`}>
              <button className="page-link" onClick={() => setPage(p => Math.min(pagination.pages, p + 1))}>»</button>
            </li>
          </ul>
        </nav>
      )}
    </div>
  );
}

/* ========== Helpers & sub-components (trong cùng file) ========== */

function CardProduct({ item }) {
  const img = item.image_url || "https://via.placeholder.com/640x480?text=No+Image";
  return (
    <div className="card h-100 shadow-sm">
      <div className="ratio ratio-4x3 bg-light">
        <img
          src={img}
          alt={item.product_name}
          className="card-img-top"
          style={{ objectFit: "cover" }}
          onError={(e) => { e.currentTarget.src = "https://via.placeholder.com/640x480?text=No+Image"; }}
        />
      </div>
      <div className="card-body d-flex flex-column">
        <h2 className="h6 card-title mb-2" title={item.product_name}>
          {item.product_name}
        </h2>
        <div className="text-muted small mb-2">rank: {Number(item.rank || 0).toFixed(4)}</div>
        <div className="mt-auto">
          <a href={`#/product/${item.product_id}`} className="btn btn-outline-primary w-100">
            Xem chi tiết
          </a>
        </div>
      </div>
    </div>
  );
}

function useDebounce(value, delay = 400) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

function buildPager(totalPages, current, windowSize = 2) {
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
