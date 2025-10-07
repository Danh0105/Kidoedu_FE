// SearchProducts.jsx (refactor - clean)
import React, { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { useDebounce, buildPager, toVND, useSafeBuildUrl } from "../../hooks/useUiUtils";

/**
 * Props:
 *  - apiBase: string (vd "https://kidoedu.vn")
 *  - pageSizeOptions: number[] (vd [6, 12, 24, 48])
 */
export default function SearchProducts({
  apiBase = "https://kidoedu.vn",
  pageSizeOptions = [6, 12, 24, 48],
}) {
  // -------- UI state ----------
  const [q, setQ] = useState("");
  const [limit, setLimit] = useState(pageSizeOptions?.[1] ?? 12);
  const [page, setPage] = useState(1);

  // -------- Data state --------
  const [items, setItems] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    pages: 0,
    total: 0,
    limit,
  });
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  // -------- Helpers -----------
  const debouncedQ = useDebounce(q, 500);
  const canSearch = debouncedQ.trim().length > 0;
  const firstRender = useRef(true);

  const safeBuildUrl = useSafeBuildUrl(apiBase);

  const fetchData = useCallback(
    async (signal) => {
      if (!canSearch) {
        setItems([]);
        setPagination({ page: 1, pages: 0, total: 0, limit });
        return;
      }
      setLoading(true);
      setErr("");

      try {
        const url = safeBuildUrl("/search/products", {
          q: debouncedQ,
          page,
          limit,
        });

        const res = await fetch(url, { signal });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();

        setItems(data.items || []);
        setPagination({
          page: Number(data.page) || page,
          pages: Number(data.pages) || 0,
          total: Number(data.total) || 0,
          limit: Number(data.limit) || limit,
        });
      } catch (e) {
        if (e.name !== "AbortError") {
          setErr(e.message || "Đã xảy ra lỗi khi tìm kiếm");
        }
      } finally {
        setLoading(false);
      }
    },
    [canSearch, debouncedQ, page, limit, safeBuildUrl]
  );

  // Auto fetch khi q/page/limit đổi
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    const ctl = new AbortController();
    fetchData(ctl.signal);
    return () => ctl.abort();
  }, [fetchData]);

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
        <h2 className="h5 mb-0">Tìm kiếm sản phẩm</h2>
        <div className="row g-2">
          <div className="col-12 col-md-6">
            <input
              type="search"
              className="form-control"
              placeholder="Nhập từ khóa (vd: robot, stem, kit...)"
              value={q}
              onChange={(e) => {
                setQ(e.target.value);
                setPage(1); // reset page khi sửa từ khóa
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") setQ((s) => s.trim());
              }}
              aria-label="Từ khóa tìm kiếm"
            />
          </div>

          <div className="col-6 col-md-3">
            <select
              className="form-select"
              value={limit}
              onChange={(e) => {
                setLimit(Number(e.target.value) || 12);
                setPage(1); // reset page khi đổi page size
              }}
              aria-label="Số sản phẩm mỗi trang"
            >
              {(Array.isArray(pageSizeOptions) && pageSizeOptions.length
                ? pageSizeOptions
                : [6, 12, 24, 48]
              ).map((opt) => (
                <option key={opt} value={opt}>
                  {opt} / trang
                </option>
              ))}
            </select>
          </div>

          <div className="col-6 col-md-3">
            <button
              className="btn btn-primary w-100"
              onClick={() => setQ((s) => s.trim())}
              disabled={loading}
            >
              {loading ? (
                <>
                  <span
                    className="spinner-border spinner-border-sm me-2"
                    aria-hidden="true"
                  />
                  Đang tìm…
                </>
              ) : (
                "Tìm kiếm"
              )}
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
        <div className="alert alert-warning">
          Không tìm thấy kết quả phù hợp.
        </div>
      )}

      {/* Summary + small pager (top) */}
      {!err && pagination.total > 0 && (
        <div className="d-flex justify-content-between align-items-center mb-2">
          <div>
            Tìm thấy <strong>{pagination.total}</strong> sản phẩm
          </div>
          <SmallPager
            page={pagination.page}
            pages={pagination.pages}
            onPrev={() => setPage((p) => Math.max(1, p - 1))}
            onNext={() => setPage((p) => Math.min(pagination.pages, p + 1))}
          />
        </div>
      )}

      {/* Results */}
      <ResultsGrid items={items} loading={loading} />

      {/* Pager (bottom) */}
      {pagination.pages > 1 && (
        <nav className="mt-4" aria-label="Phân trang">
          <ul className="pagination justify-content-center">
            <li className={`page-item ${pagination.page <= 1 ? "disabled" : ""}`}>
              <button
                className="page-link"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                aria-label="Trang trước"
              >
                «
              </button>
            </li>

            {pager.map((p) =>
              p.ellipsis ? (
                <li key={p.key} className="page-item disabled">
                  <span className="page-link">…</span>
                </li>
              ) : (
                <li
                  key={p.key}
                  className={`page-item ${p.current ? "active" : ""}`}
                >
                  <button
                    className="page-link"
                    onClick={() => setPage(p.num)}
                    aria-current={p.current ? "page" : undefined}
                  >
                    {p.label}
                  </button>
                </li>
              )
            )}

            <li
              className={`page-item ${pagination.page >= pagination.pages ? "disabled" : ""
                }`}
            >
              <button
                className="page-link"
                onClick={() =>
                  setPage((p) => Math.min(pagination.pages, p + 1))
                }
                aria-label="Trang sau"
              >
                »
              </button>
            </li>
          </ul>
        </nav>
      )}
    </div>
  );
}

/* ====================== Components ====================== */

function ResultsGrid({ items, loading }) {
  if (loading) {
    return (
      <div className="row g-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div className="col-12 col-sm-6 col-md-4" key={i}>
            <div className="card">
              <div className="ratio ratio-4x3 bg-light placeholder" />
              <div className="card-body">
                <div className="placeholder-glow">
                  <span className="placeholder col-7" />
                  <span className="placeholder col-5 ms-2" />
                  <span className="placeholder col-4 d-block mt-2" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="row g-3">
      {items?.map((it) => {
        const id = it?.product_id ?? it?.id;
        const name = it?.product_name ?? it?.name ?? "Sản phẩm";
        const img = it?.images?.[0]?.image_url ?? it?.image_url;
        const price = toVND(it?.price || it?.sale_price || it?.min_price || 0);

        return (
          <div className="col-12 col-sm-6 col-md-4" key={id}>
            <div className="card h-100">
              {img ? (
                <img
                  src={img}
                  alt={name}
                  className="card-img-top"
                  style={{ objectFit: "cover", aspectRatio: "4/3" }}
                  loading="lazy"
                />
              ) : (
                <div className="ratio ratio-4x3 bg-light d-flex align-items-center justify-content-center text-muted">
                  No Image
                </div>
              )}
              <div className="card-body d-flex flex-column">
                <h6 className="card-title mb-2 text-truncate">{name}</h6>
                <div className="mt-auto fw-bold text-danger">{price}</div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function SmallPager({ page, pages, onPrev, onNext }) {
  if (pages <= 1) return null;
  return (
    <div className="btn-group btn-group-sm" role="group" aria-label="Phân trang nhỏ">
      <button className="btn btn-outline-secondary" disabled={page <= 1} onClick={onPrev}>
        Trước
      </button>
      <span className="btn btn-outline-secondary disabled">
        {page} / {pages}
      </span>
      <button className="btn btn-outline-secondary" disabled={page >= pages} onClick={onNext}>
        Sau
      </button>
    </div>
  );
}

/* ====================== Utils ====================== */



