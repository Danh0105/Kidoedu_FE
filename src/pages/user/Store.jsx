// Store.jsx
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import axios from "axios";


import Product from "../../components/user/category/Product";
import SidebarCategories from "../../components/user/SidebarCategories";

/**
 * Props:
 *  - apiBase: BE base URL (vd "https://kidoedu.vn")
 *  - pageSizeOptions: mảng số item/trang
 */
export default function Store({
    apiBase = "https://kidoedu.vn",
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
    const [limit, setLimit] = useState(pageSizeOptions?.[1] ?? 12); // default 12/trang
    const [page, setPage] = useState(1);
    const [selectedCatId, setSelectedCatId] = useState(null);

    // -------- Data state -----------
    const [items, setItems] = useState([]);
    const [meta, setMeta] = useState({ page: 1, last_page: 0, total: 0, limit });
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [err, setErr] = useState("");

    // -------- Helpers --------------
    const debouncedQ = useDebounce(q, 500);
    const firstLoad = useRef(true);

    const roots = useMemo(
        () => categories.filter((c) => c.parent === null),
        [categories]
    );

    // -------- Fetchers -------------
    const fetchCategories = useCallback(async () => {
        try {
            const res = await api.get("/categories");
            setCategories(res.data ?? []);
        } catch (e) {
            console.error(e);
        }
    }, [api]);

    const fetchProducts = useCallback(async (abortSignal) => {
        setLoading(true);
        setErr("");

        try {
            const params = { page, limit };
            if (selectedCatId) params.category_id = selectedCatId;  // <-- THÊM DÒNG NÀY

            let res;
            // Có từ khóa -> dùng /search/products
            if ((debouncedQ).trim()) {
                res = await api.get("/search/products", {
                    params: { q: debouncedQ, page, limit, category_id: selectedCatId || undefined }, // <-- GỬI KÈM
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
                // Không có từ khóa -> /products bình thường
                res = await api.get("/products", { params, signal: abortSignal });
                setItems(res.data?.data ?? []);
                setMeta(res.data?.meta ?? { page, last_page: 0, total: 0, limit });
            }
            if (!(debouncedQ).trim() && selectedCatId) {
                console.log(2)
                // Không có từ khóa -> /products bình thường
                res = await api.get("/search/products", {
                    params: { page, limit, category_id: selectedCatId },
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
        } catch (e) {
            if (e.name !== "CanceledError" && e.code !== "ERR_CANCELED") {
                setErr(e?.message || "Đã có lỗi xảy ra");
            }
        } finally {
            setLoading(false);
        }
    }, [api, page, limit, debouncedQ, selectedCatId]);

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

    // Cuộn lên khi đổi trang
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    }, [page]);

    // -------- Render ---------------
    return (
        <div className="container" style={{ maxWidth: "95%" }}>
            {/*        <Slick1 /> */}

            <div className="d-flex bg-white p-2">
                {/* Sidebar */}
                <SidebarCategories
                    roots={roots}
                    selectedCatId={selectedCatId}
                    onSelect={(id) => {
                        setSelectedCatId(id == null ? null : Number(id)); // ✅ ép về number
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
                                    Sắp xếp
                                </button>
                                <ul className="dropdown-menu">
                                    <li>
                                        <button className="dropdown-item" disabled>
                                            Giá thấp → cao (demo)
                                        </button>
                                    </li>
                                    <li>
                                        <button className="dropdown-item" disabled>
                                            Giá cao → thấp (demo)
                                        </button>
                                    </li>
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

                        {/*     <div className="col-auto">
                            <select
                                className="form-select"
                                value={limit}
                                onChange={(e) => {
                                    setLimit(Number(e.target.value));
                                    setPage(1);
                                }}
                            >
                                {pageSizeOptions.map((n) => (
                                    <option key={n} value={n}>
                                        {n}/trang
                                    </option>
                                ))}
                            </select>
                        </div> */}

                        {/*  <div className="col-auto">
                            <button
                                className="btn btn-primary"
                                onClick={() => fetchProducts()}
                                disabled={loading}
                            >
                                {loading ? (
                                    <>
                                        <span
                                            className="spinner-border spinner-border-sm me-2"
                                            aria-hidden="true"
                                        />
                                        Đang tải…
                                    </>
                                ) : (
                                    "Làm mới"
                                )}
                            </button>
                        </div> */}
                    </div>

                    {err && <div className="alert alert-danger">Lỗi: {err}</div>}

                    {/* Product List */}
                    <div className="d-flex flex-wrap" style={{ width: "1120px", gap: "10px" }}>
                        {items.length ? (
                            items.map((prod) => (
                                <div className="col" key={prod.product_id} style={{ flex: "0 0 10%" }}>
                                    <Product prod={prod} />
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
                                    className={`page-item ${meta.page >= meta.last_page ? "disabled" : ""
                                        }`}
                                >
                                    <button
                                        className="page-link"
                                        onClick={() =>
                                            setPage((p) => Math.min(meta.last_page, p + 1))
                                        }
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

/* ------------------ helpers ------------------ */

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
