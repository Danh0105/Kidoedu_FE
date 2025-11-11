// Store.jsx
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useDebounce, buildPager } from "../../hooks/useUiUtils";
import axios from "axios";
import "../../components/user/css/Store.css";
import Product from "../../components/user/category/Product";
import SidebarCategories from "../../components/user/SidebarCategories";

/* --------- Hook breakpoint để phân nhánh Desktop/Mobile ---------- */
function useIsDesktop() {
    const get = () => window.matchMedia("(min-width: 992px)").matches; // Bootstrap lg breakpoint
    const [isDesktop, setIsDesktop] = useState(get);
    useEffect(() => {
        const mq = window.matchMedia("(min-width: 992px)");
        const handler = () => setIsDesktop(mq.matches);
        mq.addEventListener?.("change", handler);
        window.addEventListener("resize", handler);
        return () => {
            mq.removeEventListener?.("change", handler);
            window.removeEventListener("resize", handler);
        };
    }, []);
    return isDesktop;
}

/* --------- (Tuỳ chọn) Skeleton để hiển thị khi loading mobile --------- */
function ProductSkeleton() {
    return (
        <div className="card shadow-sm border-0">
            <div className="ratio ratio-1x1 bg-light rounded-top" />
            <div className="card-body">
                <div className="placeholder-glow">
                    <span className="placeholder col-8"></span>
                    <span className="placeholder col-10 mt-2"></span>
                    <span className="placeholder col-6 mt-2"></span>
                </div>
            </div>
        </div>
    );
}

export default function Store({
    apiBase = process.env.REACT_APP_API_URL,
    pageSizeOptions = [6, 12, 24, 48],
}) {
    // -------- API client ----------
    const api = useMemo(
        () =>
            axios.create({
                baseURL: apiBase.replace(/\/+$/, ""),
                timeout: 10000,
            }),
        [apiBase]
    );

    // -------- UI state -------------
    const [q, setQ] = useState("");
    const [limit, setLimit] = useState(pageSizeOptions?.[1] ?? 12);
    const [page, setPage] = useState(1);
    const [selectedCatId, setSelectedCatId] = useState(null);

    // sort ('' | 'price_asc' | 'price_desc')
    const [sort, setSort] = useState("");

    // -------- Data state -----------
    const [items, setItems] = useState([]);
    const [meta, setMeta] = useState({ page: 1, last_page: 0, total: 0, limit });
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [err, setErr] = useState("");

    // -------- Helpers --------------
    const debouncedQ = useDebounce(q, 500);
    const firstLoad = useRef(true);
    const isDesktop = useIsDesktop();

    const roots = useMemo(
        () => categories.filter((c) => c.parent === null),
        [categories]
    );

    const sortLabel = useMemo(() => {
        if (sort === "price_asc") return "Giá thấp → cao";
        if (sort === "price_desc") return "Giá cao → thấp";
        return "Sắp xếp";
    }, [sort]);

    // -------- Fetchers -------------
    const fetchCategories = useCallback(async () => {
        try {
            const res = await api.get("/categories");
            setCategories(res.data ?? []);
        } catch (e) {
            console.error(e);
        }
    }, [api]);

    const fetchProducts = useCallback(
        async (abortSignal) => {
            setLoading(true);
            setErr("");

            try {
                const baseParams = { page, limit };
                if (selectedCatId) baseParams.category_id = selectedCatId;
                if (sort) baseParams.sort = sort;

                let res;

                if (debouncedQ.trim()) {
                    res = await api.get("/search/products", {
                        params: { q: debouncedQ, ...baseParams },
                        signal: abortSignal,
                    });
                    const data = res.data ?? {};
                    setItems(data.items ?? []);
                    setMeta({
                        page: data.pagination?.page ?? page,
                        last_page: data.pagination?.pages ?? 0,
                        total: data.pagination?.total ?? 0,
                        limit: data.pagination?.limit ?? limit,
                    });
                } else {
                    res = await api.get("/products", { params: baseParams, signal: abortSignal });
                    const data = res.data?.data || [];

                    setItems(data ?? []);
                    setMeta(data ?? { page, last_page: 0, total: 0, limit });

                    if (selectedCatId) {
                        res = await api.get("/search/products", {
                            params: { ...baseParams },
                            signal: abortSignal,
                        });
                        const data = res.data ?? {};
                        setItems(data.items ?? []);
                        setMeta({
                            page: data.pagination?.page ?? page,
                            last_page: data.pagination?.pages ?? 0,
                            total: data.pagination?.total ?? 0,
                            limit: data.pagination?.limit ?? limit,
                        });
                    }
                }
            } catch (e) {
                if (e.name !== "CanceledError" && e.code !== "ERR_CANCELED") {
                    setErr(e?.message || "Đã có lỗi xảy ra");
                }
            } finally {
                setLoading(false);
            }
        },
        [api, page, limit, debouncedQ, selectedCatId, sort]
    );

    // -------- Effects --------------
    useEffect(() => {
        fetchCategories();
    }, [fetchCategories]);

    useEffect(() => {
        if (firstLoad.current) {
            firstLoad.current = false;
        }
        const ctl = new AbortController();
        fetchProducts(ctl.signal);
        return () => ctl.abort();
    }, [fetchProducts]);

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    }, [page]);

    // -------- FE fallback sort ------
    const sortedItems = useMemo(() => {
        if (!Array.isArray(items) || !items.length || !sort) return items;
        const getPrice = (p) => Number(p?.price ?? 0);
        const copy = [...items];
        if (sort === "price_asc") copy.sort((a, b) => getPrice(a) - getPrice(b));
        if (sort === "price_desc") copy.sort((a, b) => getPrice(b) - getPrice(a));
        return copy;
    }, [items, sort]);

    /* ====================== RENDER ====================== */

    /* ---------- DESKTOP: giữ nguyên layout của bạn ---------- */
    if (isDesktop) {
        return (
            <div className="container" style={{ maxWidth: "95%" }}>
                <div className="d-flex bg-white p-2">
                    {/* Sidebar */}
                    <SidebarCategories
                        roots={roots}
                        selectedCatId={selectedCatId}
                        onSelect={(id) => {
                            setSelectedCatId(id == null ? null : Number(id));
                            setPage(1);
                        }}
                        onClear={() => {
                            setSelectedCatId(null);
                            setPage(1);
                        }}
                    />

                    {/* Main */}
                    <section className="p-2 flex-fill">
                        {/* Filter & Search */}
                        <div className="row g-2 align-items-center mb-3 d-flex justify-content-between">
                            <div className="col-auto">
                                <div className="dropdown">
                                    <button
                                        className="btn btn-outline-secondary dropdown-toggle"
                                        type="button"
                                        data-bs-toggle="dropdown"
                                    >
                                        {sortLabel}
                                    </button>
                                    <ul className="dropdown-menu">
                                        <li>
                                            <button
                                                className={`dropdown-item ${sort === "price_asc" ? "active" : ""}`}
                                                onClick={() => {
                                                    setSort("price_asc");
                                                    setPage(1);
                                                }}
                                            >
                                                Giá thấp → cao
                                            </button>
                                        </li>
                                        <li>
                                            <button
                                                className={`dropdown-item ${sort === "price_desc" ? "active" : ""}`}
                                                onClick={() => {
                                                    setSort("price_desc");
                                                    setPage(1);
                                                }}
                                            >
                                                Giá cao → thấp
                                            </button>
                                        </li>
                                        {sort && (
                                            <>
                                                <li><hr className="dropdown-divider" /></li>
                                                <li>
                                                    <button
                                                        className="dropdown-item"
                                                        onClick={() => {
                                                            setSort("");
                                                            setPage(1);
                                                        }}
                                                    >
                                                        Bỏ sắp xếp
                                                    </button>
                                                </li>
                                            </>
                                        )}
                                    </ul>
                                </div>
                            </div>

                            <div className="col-4 ">
                                <input
                                    type="search"
                                    className="form-control"
                                    placeholder="Tìm kiếm sản phẩm"
                                    value={q}
                                    onChange={(e) => {
                                        setQ(e.target.value);
                                        setPage(1);
                                    }}
                                />
                            </div>
                        </div>

                        {err && <div className="alert alert-danger">Lỗi: {err}</div>}

                        {/* Product List */}
                        <div className="d-flex flex-wrap" style={{ width: "1120px", gap: "10px" }}>
                            {sortedItems.length ? (
                                sortedItems.map((prod) => (
                                    <div className="col" key={prod.productId} style={{ flex: "0 0 10%" }}>
                                        <Product prod={prod} status={prod?.status} />
                                    </div>
                                ))
                            ) : (
                                <div className="col">
                                    <p className="text-muted mb-0">
                                        {loading ? "Đang tải dữ liệu…" : "Không có sản phẩm nào"}
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Pagination */}
                        {meta?.last_page > 1 && (
                            <nav className="mt-3" aria-label="Pagination">
                                <ul className="pagination justify-content-center flex-wrap">
                                    <li className={`page-item ${meta.page <= 1 ? "disabled" : ""}`}>
                                        <button
                                            className="page-link"
                                            onClick={() => setPage((p) => Math.max(1, p - 1))}
                                        >
                                            «
                                        </button>
                                    </li>

                                    {buildPager(meta.last_page, meta.page, 2).map((p) =>
                                        p.ellipsis ? (
                                            <li key={p.key} className="page-item disabled">
                                                <span className="page-link">…</span>
                                            </li>
                                        ) : (
                                            <li
                                                key={p.key}
                                                className={`page-item ${p.current ? "active" : ""}`}
                                            >
                                                <button className="page-link" onClick={() => setPage(p.num)}>
                                                    {p.label}
                                                </button>
                                            </li>
                                        )
                                    )}

                                    <li
                                        className={`page-item ${meta.page >= meta.last_page ? "disabled" : ""}`}
                                    >
                                        <button
                                            className="page-link"
                                            onClick={() => setPage((p) => Math.min(meta.last_page, p + 1))}
                                        >
                                            »
                                        </button>
                                    </li>
                                </ul>
                            </nav>
                        )}
                    </section>
                </div>
            </div>
        );
    }

    /* ---------- MOBILE/TABLET: giao diện responsive mới ---------- */
    return (
        <div className="container-xxl">
            <div className="row g-3">
                {/* Nút mở danh mục (Offcanvas) */}
                <div className="d-lg-none">
                    <button
                        className="btn btn-outline-secondary w-100"
                        type="button"
                        data-bs-toggle="offcanvas"
                        data-bs-target="#storeSidebar"
                        aria-controls="storeSidebar"
                    >
                        Danh mục
                    </button>

                    <div className="offcanvas offcanvas-start" tabIndex="-1" id="storeSidebar" aria-labelledby="storeSidebarLabel">
                        <div className="offcanvas-header">
                            <h5 id="storeSidebarLabel" className="mb-0">Danh mục</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
                        </div>
                        <div className="offcanvas-body">
                            <SidebarCategories
                                roots={roots}
                                selectedCatId={selectedCatId}
                                onSelect={(id) => { setSelectedCatId(id == null ? null : Number(id)); setPage(1); }}
                                onClear={() => { setSelectedCatId(null); setPage(1); }}
                            />
                        </div>
                    </div>
                </div>

                {/* Main */}
                <section className="col-12">
                    {/* Toolbar sticky */}
                    <div
                        className="bg-white border rounded-3 px-2 py-2 d-flex flex-wrap gap-2 align-items-center sticky-top"
                        style={{ top: 64, zIndex: 1029 }}
                    >
                        {/* Sort (select nhỏ gọn) */}
                        <div className="flex-grow-0">
                            <select
                                className="form-select form-select-sm"
                                value={sort}
                                onChange={(e) => { setSort(e.target.value); setPage(1); }}
                            >
                                <option value="">{sortLabel}</option>
                                <option value="price_asc">Giá thấp → cao</option>
                                <option value="price_desc">Giá cao → thấp</option>
                            </select>
                        </div>

                        {/* Search full width */}
                        <div className="flex-grow-1">
                            <label htmlFor="q" className="visually-hidden">Tìm kiếm sản phẩm</label>
                            <input
                                id="q"
                                type="search"
                                className="form-control form-control-sm"
                                placeholder="Tìm kiếm sản phẩm"
                                value={q}
                                onChange={(e) => { setQ(e.target.value); setPage(1); }}
                            />
                        </div>

                        {/* Đếm kết quả (ẩn nếu 0) */}
                        {meta?.total > 0 && (
                            <div className="ms-auto small text-muted d-none d-sm-inline">
                                {meta.total.toLocaleString()} sản phẩm
                            </div>
                        )}
                    </div>

                    {err && <div className="alert alert-danger mt-2 mb-0">Lỗi: {err}</div>}

                    {/* Grid sản phẩm: 1 cột mobile, 2 cột sm, 3 cột md */}
                    <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-2 g-sm-3 mt-2">
                        {loading && !sortedItems.length && (
                            Array.from({ length: 6 }).map((_, i) => (
                                <div key={`sk-${i}`} className="col">
                                    <ProductSkeleton />
                                </div>
                            ))
                        )}

                        {!loading && sortedItems.length > 0 && sortedItems.map((prod) => (
                            <div key={prod.productId} className="col">
                                <div className="product-card">
                                    <Product prod={prod} status={prod?.status} />
                                </div>
                            </div>
                        ))}

                        {!loading && !sortedItems.length && (
                            <div className="col-12">
                                <div className="text-center text-muted py-4">Không có sản phẩm nào</div>
                            </div>
                        )}
                    </div>


                    {/* Pagination */}
                    {meta?.last_page > 1 && (
                        <nav className="mt-3" aria-label="Pagination">
                            <ul className="pagination justify-content-center flex-wrap">
                                <li className={`page-item ${meta.page <= 1 ? "disabled" : ""}`}>
                                    <button className="page-link" onClick={() => setPage((p) => Math.max(1, p - 1))}>«</button>
                                </li>

                                {buildPager(meta.last_page, meta.page, 1).map((p) =>
                                    p.ellipsis ? (
                                        <li key={p.key} className="page-item disabled"><span className="page-link">…</span></li>
                                    ) : (
                                        <li key={p.key} className={`page-item ${p.current ? "active" : ""}`}>
                                            <button className="page-link" onClick={() => setPage(p.num)}>{p.label}</button>
                                        </li>
                                    )
                                )}

                                <li className={`page-item ${meta.page >= meta.last_page ? "disabled" : ""}`}>
                                    <button className="page-link" onClick={() => setPage((p) => Math.min(meta.last_page, p + 1))}>»</button>
                                </li>
                            </ul>
                        </nav>
                    )}
                </section>
            </div>
        </div>
    );
}



