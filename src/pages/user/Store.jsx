import React, {
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
    lazy,
    Suspense,
} from "react";

import { useSearchParams } from "react-router-dom";

import { useDebounce, buildPager } from "../../hooks/useUiUtils";

import "../../components/user/css/Store.css";

import {
    fetchAllProductsApi,
} from "../../services/Product";

import { fetchCategoriesApi } from "../../services/Category";

import { useSEO } from "../../hooks/useSEO";

/* ================= Lazy Components ================= */

const Product = lazy(() =>
    import("../../components/user/category/Product")
);

const SidebarCategories = lazy(() =>
    import("../../components/user/SidebarCategories")
);

const ViewProducts = lazy(() =>
    import("../../components/user/HomePage/ViewProducts")
);

/* ================= Breakpoint Hook ================= */

function useIsDesktop() {
    const get = () =>
        window.matchMedia("(min-width: 992px)").matches;

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

/* ================= Store ================= */

export default function Store({
    pageSizeOptions = [6, 12, 24, 48],
}) {
    const [searchParams, setSearchParams] = useSearchParams();

    const page = Number(searchParams.get("page") || 1);

    const selectedCatId = searchParams.get("cat")
        ? Number(searchParams.get("cat"))
        : null;

    const queryParams = useMemo(() => {
        return {
            min_price: searchParams.get("min") || "",
            max_price: searchParams.get("max") || "",
            featured: searchParams.get("featured") === "1",
            discount: searchParams.get("discount") === "1",
            sort: searchParams.get("sort") || "",
        };
    }, [
        searchParams.get("min"),
        searchParams.get("max"),
        searchParams.get("featured"),
        searchParams.get("discount"),
        searchParams.get("sort"),
    ]);

    const [q, setQ] = useState("");

    const [limit] = useState(pageSizeOptions?.[1] ?? 12);

    const [items, setItems] = useState([]);

    const [meta, setMeta] = useState({
        page: 1,
        last_page: 0,
        total: 0,
        limit,
    });

    const [categories, setCategories] = useState([]);

    const [loading, setLoading] = useState(false);

    const [err, setErr] = useState("");

    const debouncedQ = useDebounce(q, 300);

    const abortRef = useRef(null);

    const isDesktop = useIsDesktop();

    const roots = useMemo(() => {
        const arr = [];

        for (const c of categories) {
            if (c.parent === null) arr.push(c);
        }

        return arr;
    }, [categories]);

    /* ================= Fetch Categories ================= */

    useEffect(() => {
        fetchCategoriesApi()
            .then((data) => setCategories(data ?? []))
            .catch(console.error);
    }, []);

    /* ================= Fetch Products ================= */

    const fetchProducts = useCallback(async (signal) => {
        setLoading(true);
        setErr("");

        try {
            const params = {
                page,
                limit,
                status: 4,
                ...(selectedCatId != null && {
                    category_id: selectedCatId,
                }),
                ...(queryParams.sort && { sort: queryParams.sort }),
                ...(queryParams.min_price && {
                    min_price: queryParams.min_price,
                }),
                ...(queryParams.max_price && {
                    max_price: queryParams.max_price,
                }),
                ...(queryParams.featured && { featured: 1 }),
                ...(queryParams.discount && { discount: 1 }),
            };

            const res = await fetchAllProductsApi(
                debouncedQ.trim()
                    ? { ...params, q: debouncedQ }
                    : params,
                signal
            );

            setItems(res.data ?? []);

            setMeta({
                page: res.meta?.page ?? 1,
                last_page: res.meta?.last_page ?? 0,
                total: res.meta?.total ?? 0,
                limit: res.meta?.limit ?? limit,
            });
        } catch (e) {
            if (
                e.name !== "CanceledError" &&
                e.code !== "ERR_CANCELED"
            ) {
                setErr(e?.message || "Đã có lỗi xảy ra");
            }
        } finally {
            setLoading(false);
        }
    }, [page, selectedCatId, queryParams, debouncedQ, limit]);

    useEffect(() => {
        if (abortRef.current) abortRef.current.abort();

        const ctl = new AbortController();

        abortRef.current = ctl;

        fetchProducts(ctl.signal);

        return () => ctl.abort();
    }, [fetchProducts]);

    /* ================= Update URL ================= */

    const updateParams = (newParams) => {
        const params = new URLSearchParams(searchParams);

        Object.entries(newParams).forEach(([key, value]) => {
            if (!value || value === "" || value === false) {
                params.delete(key);
            } else {
                params.set(key, value);
            }
        });

        params.set("page", 1);

        setSearchParams(params);
    };

    const changeCategory = (id) => {
        updateParams({ cat: id });
    };

    const changePage = (p) => {
        const params = new URLSearchParams(searchParams);

        params.set("page", p);

        setSearchParams(params);
    };

    const pager = useMemo(() => {
        return buildPager(meta.last_page, meta.page, 2);
    }, [meta.last_page, meta.page]);

    useSEO({
        title: "Cửa hàng thiết bị giáo dục | KIDO EDU",
        description:
            "Mua thiết bị giáo dục, phần mềm, giải pháp chuyển đổi số với giá tốt tại KIDO EDU.",
        canonical: "https://kidoedu.vn/store",
    });

    /* ================= Render ================= */

    return (
        <div className="container py-4 bg-white rounded-4 shadow-sm">

            <Suspense fallback={null}>
                <SidebarCategories
                    roots={roots}
                    selectedCatId={selectedCatId}
                    onSelect={changeCategory}
                    onClear={() => setSearchParams({})}
                />
            </Suspense>

            {/* Filter */}

            <div className="store-filter-box mb-3 p-3 border rounded bg-light">

                <div className="row g-2 align-items-center">

                    <div className="col-md-3">
                        <input
                            className="form-control"
                            placeholder="Tìm sản phẩm..."
                            value={q}
                            onChange={(e) => setQ(e.target.value)}
                        />
                    </div>

                    <div className="col-md-2">
                        <input
                            type="number"
                            className="form-control"
                            placeholder="Giá từ"
                            value={queryParams.min_price}
                            onChange={(e) =>
                                updateParams({ min: e.target.value })
                            }
                        />
                    </div>

                    <div className="col-md-2">
                        <input
                            type="number"
                            className="form-control"
                            placeholder="Giá đến"
                            value={queryParams.max_price}
                            onChange={(e) =>
                                updateParams({ max: e.target.value })
                            }
                        />
                    </div>

                    <div className="col-md-2">
                        <select
                            className="form-select"
                            value={queryParams.sort}
                            onChange={(e) =>
                                updateParams({ sort: e.target.value })
                            }
                        >
                            <option value="">Sắp xếp</option>
                            <option value="newest">Mới nhất</option>
                            <option value="price_asc">Giá tăng</option>
                            <option value="price_desc">Giá giảm</option>
                            <option value="best_seller">Bán chạy</option>
                        </select>
                    </div>

                    <div className="col-md-1">
                        <button
                            className="btn btn-outline-secondary w-100"
                            onClick={() => {
                                setQ("");
                                setSearchParams({});
                            }}
                        >
                            Reset
                        </button>
                    </div>

                </div>

            </div>

            {/* Products */}

            <section className="p-2">

                {err && (
                    <div className="alert alert-danger">
                        Lỗi: {err}
                    </div>
                )}

                <Suspense fallback={<div>Loading...</div>}>

                    <div className="product-grid-fixed">

                        {loading
                            ? Array.from({ length: limit }).map((_, i) => (
                                <Product key={i} />
                            ))
                            : items.length > 0
                                ? items.map((prod) => (
                                    <Product
                                        key={prod.productId}
                                        prod={prod}
                                    />
                                ))
                                : (
                                    <p className="text-muted text-center">
                                        Không có sản phẩm
                                    </p>
                                )}

                    </div>

                </Suspense>

                {/* Pagination */}

                {meta?.last_page > 1 && (

                    <nav className="mt-3">

                        <ul className="pagination justify-content-center">

                            {pager.map((p) =>
                                p.ellipsis ? (
                                    <li
                                        key={p.key}
                                        className="page-item disabled"
                                    >
                                        <span className="page-link">…</span>
                                    </li>
                                ) : (
                                    <li
                                        key={p.key}
                                        className={`page-item ${p.current ? "active" : ""
                                            }`}
                                    >
                                        <button
                                            className="page-link"
                                            onClick={() =>
                                                changePage(p.num)
                                            }
                                        >
                                            {p.label}
                                        </button>
                                    </li>
                                )
                            )}

                        </ul>

                    </nav>

                )}

                {/* Viewed Products */}

                <Suspense fallback={null}>
                    <ViewProducts />
                </Suspense>

            </section>

        </div>
    );
}