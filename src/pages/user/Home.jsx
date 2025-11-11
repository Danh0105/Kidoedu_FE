import "../../App.css";
import Carousel from "../../components/user/Carousel";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";
import { Menu, Cpu } from "lucide-react";
import ProductHome from "../../components/user/ProductHome";
import ModalBuy from "../../components/user/ModalBuy";

// ======================= Helpers =======================
const pickRibbonsFromStatus = (raw) => {
    const s = Number(raw ?? 0);
    if (s === 2) return [{ text: "Mới", className: "bg-danger", position: "left" }];
    if (s === 1)
        return [{ text: "Nổi bật", className: "bg-warning text-dark", position: "left" }];
    if (s === 12)
        return [
            { text: "Mới", className: "bg-danger", position: "left" },
            { text: "Nổi bật", className: "bg-warning text-dark", position: "right" },
        ];
    return [];
};

const Ribbon = ({ text, position, className }) => (
    <span
        className={`position-absolute top-0 ${position === "left" ? "start-0 ms-2" : "end-0 me-2"
            } mt-2 badge ${className} px-3 d-flex align-items-center fst-italic shadow-sm`}
        style={{
            borderTopLeftRadius: position === "left" ? 0 : "999rem",
            borderTopRightRadius: position === "right" ? 0 : "999rem",
            borderBottomLeftRadius: "999rem",
            borderBottomRightRadius: "999rem",
            height: 32,
            zIndex: 3,
            pointerEvents: "none",
        }}
    >
        {text}
    </span>
);

const formatCurrency = (value) =>
    new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(
        Number(value || 0)
    );

// Single place to render a price range or single price
const displayedPrice = ({ minPrice, maxPrice }) =>
    Number(minPrice) === Number(maxPrice)
        ? formatCurrency(minPrice)
        : `${formatCurrency(minPrice)} - ${formatCurrency(maxPrice)}`;

// ======================= Component =======================
export default function Home({ apiBase = `${process.env.REACT_APP_API_URL}` }) {
    // ---- State
    const [categories, setCategories] = useState([]);
    const [selectedCatId, setSelectedCatId] = useState(null);
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(false);

    const [allProducts, setAllProducts] = useState([]);
    const [featuredProducts, setFeaturedProducts] = useState([]);
    const [newProducts, setNewProducts] = useState([]);

    const [showAllFeatured, setShowAllFeatured] = useState(false);
    const [showAllNew, setShowAllNew] = useState(false);

    const [showModalBuy, setShowModalBuy] = useState(false);
    const [buyProduct, setBuyProduct] = useState(null);

    // Stable axios instance
    const api = useMemo(
        () =>
            axios.create({
                baseURL: (apiBase || "").replace(/\/+$/, ""),
                timeout: 15000,
            }),
        [apiBase]
    );

    // ======================= Data fetching =======================
    const fetchCategories = useCallback(async () => {
        try {
            const res = await api.get("/categories");
            const all = res?.data || [];
            // keep only roots where parent is null (support both parent and parentId)
            const roots = all.filter((c) => c.parent === null || c.parentId === null);
            setCategories(roots);
            // choose first category if none selected
            if (!selectedCatId && roots.length) {
                const firstId = roots[0].categoryId ?? roots[0].category_id ?? roots[0].id;
                setSelectedCatId(firstId ?? null);
            }
        } catch (e) {
            console.error("fetchCategories error:", e);
        }
    }, [api, selectedCatId]);

    const fetchProducts = useCallback(async () => {
        try {
            const res = await api.get("/products");
            const list = res?.data?.data || [];

            // Enrich each product with variants + price range
            const enriched = await Promise.all(
                list.map(async (p) => {
                    try {
                        const rVar = await api.get(`/products/${p.productId}/variants`);
                        const variants = rVar?.data?.items || [];
                        if (!variants.length) return null;

                        const pricePromises = variants.map((v) =>
                            api
                                .get(`/products/${p.productId}/variants/${v.variantId}/prices`)
                                .then((r) => {
                                    const arr = Array.isArray(r.data) ? r.data : r.data?.items || [];
                                    // pick latest by start_at if exists, else first
                                    const latest = [...arr].sort((a, b) => {
                                        const ta = new Date(a.start_at || a.startAt || 0).getTime();
                                        const tb = new Date(b.start_at || b.startAt || 0).getTime();
                                        return tb - ta;
                                    })[0];
                                    return latest?.price ?? null;
                                })
                                .catch(() => null)
                        );

                        const prices = (await Promise.all(pricePromises)).filter((x) => x != null).map(Number);
                        if (!prices.length) return null;

                        const minPrice = Math.min(...prices);
                        const maxPrice = Math.max(...prices);

                        const variantsWithPrice = variants.map((v, i) => ({
                            ...v,
                            price: Number.isFinite(prices[i]) ? Number(prices[i]) : null,
                        }));

                        return { ...p, variants: variantsWithPrice, minPrice, maxPrice };
                    } catch {
                        return null;
                    }
                })
            );

            const finalList = enriched.filter(Boolean);
            setAllProducts(finalList);
            setFeaturedProducts(finalList.filter((p) => p?.status === 1 || p?.status === 12));
            setNewProducts(finalList.filter((p) => p?.status === 2 || p?.status === 12));
        } catch (e) {
            console.error("fetchProducts error:", e);
        }
    }, [api]);

    const fetchProductsByCategory = useCallback(
        async (categoryId) => {
            try {
                const catId = categoryId ?? selectedCatId;
                if (!catId) return;
                setLoading(true);
                const res = await api.get("/search/products", { params: { category_id: catId } });
                const data = res?.data ?? {};
                setItems(Array.isArray(data.items) ? data.items : []);
            } catch (e) {
                console.error("Error fetching products by category:", e);
            } finally {
                setLoading(false);
            }
        },
        [api, selectedCatId]
    );

    // Initial load
    useEffect(() => {
        fetchCategories();
        fetchProducts();
    }, [fetchCategories, fetchProducts]);

    // When selected category changes → fetch category products
    useEffect(() => {
        if (selectedCatId != null) fetchProductsByCategory(selectedCatId);
    }, [selectedCatId, fetchProductsByCategory]);

    // ======================= Actions =======================
    const handleBuy = useCallback(
        (id) => {
            const found = allProducts.find((p) => p?.productId === id) || null;
            setBuyProduct(found);
            setShowModalBuy(true);
        },
        [allProducts]
    );

    // ======================= UI bits =======================
    const SkeletonCard = () => (
        <div className="card border-0 shadow-sm rounded-4 overflow-hidden p-2 placeholder-glow" style={{ maxWidth: 300 }}>
            <div className="bg-light placeholder rounded w-100 mb-3" style={{ height: 200 }} />
            <div className="card-body text-center">
                <p className="placeholder-glow mb-2"><span className="placeholder col-8" /></p>
                <p className="placeholder-glow mb-3"><span className="placeholder col-5" /></p>
                <div className="d-flex justify-content-center">
                    <span className="placeholder btn btn-primary col-6" />
                </div>
            </div>
        </div>
    );

    const CategorySidebar = () => (
        <div className="bg-white border rounded shadow-sm" style={{ minWidth: 260 }}>
            <div className="bg-danger text-white fw-bold d-flex align-items-center px-3 py-2">
                <Menu size={20} className="me-2" /> MENU
            </div>

            <ul className="list-group list-group-flush">
                {categories.length > 0 ? (
                    categories.map((cat) => {
                        const id = cat.categoryId ?? cat.category_id ?? cat.id;
                        const isActive = String(selectedCatId) === String(id);
                        return (
                            <li
                                key={id}
                                className={`list-group-item list-group-item-action d-flex align-items-center justify-content-between ${isActive ? "active border-danger bg-danger-subtle text-danger fw-semibold" : ""
                                    }`}
                                style={{ cursor: "pointer" }}
                                onClick={() => setSelectedCatId(id)}
                            >
                                <div className="d-flex align-items-center">
                                    <Cpu size={18} className={`me-2 ${isActive ? "text-danger" : "text-primary"}`} />
                                    <span>{cat.categoryName || cat.name}</span>
                                </div>
                            </li>
                        );
                    })
                ) : (
                    Array.from({ length: 5 }).map((_, i) => (
                        <li key={i} className="list-group-item placeholder-glow">
                            <span className="placeholder col-8" />
                        </li>
                    ))
                )}
            </ul>
        </div>
    );

    const ProductGrid = () => (
        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-3 flex-grow-1 ps-3">
            {loading
                ? Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="col d-flex justify-content-center"><SkeletonCard /></div>
                ))
                : items.length > 0
                    ? items.map((prod) => {
                        const ribbons = pickRibbonsFromStatus(prod?.status);
                        return (
                            <div className="col position-relative" key={prod.productId}>
                                {ribbons.map((rb, i) => (
                                    <Ribbon key={i} text={rb.text} position={rb.position} className={rb.className} />
                                ))}
                                <ProductHome prod={prod} onBuy={() => handleBuy(prod.productId)} />
                            </div>
                        );
                    })
                    : <p className="text-center text-muted">Không có sản phẩm nào</p>}
        </div>
    );

    const ProductSection = ({ title, products, showAll, toggleShow }) => {
        const visible = showAll ? products : products.slice(0, 4);
        return (
            <section className="my-5">
                <div className="text-center mb-4">
                    <h2 className="fw-bold" style={{ fontSize: "2rem" }}>{title}</h2>
                    <div style={{ height: 3, width: 80, backgroundColor: "hsl(0,75%,60%)", margin: "10px auto", borderRadius: 3 }} />
                </div>

                <div className="row justify-content-center">
                    {visible.length > 0 ? (
                        visible.map((p) => <ProductCard key={p.productId} p={p} />)
                    ) : (
                        <p className="text-center text-muted">Đang cập nhật sản phẩm...</p>
                    )}
                </div>

                {products.length > 4 && (
                    <div className="text-center mt-3">
                        <button onClick={toggleShow} className="btn btn-outline-danger rounded-pill px-4">
                            {showAll ? "Thu gọn" : "Xem thêm"}
                        </button>
                    </div>
                )}
            </section>
        );
    };

    const ProductCard = ({ p }) => {
        const ribbons = (pickRibbonsFromStatus?.(p?.status) || []).slice(0, 3);
        const imgSrc = p?.variants?.[0]?.imageUrl || p?.imageUrl || "/placeholder.png";

        // sale price (if you later add p.price & p.sale_price on top-level)
        const hasSale = p?.sale_price && Number(p.sale_price) < Number(p.price);
        const discountPercent = hasSale
            ? Math.round(((Number(p.price) - Number(p.sale_price)) / Number(p.price)) * 100)
            : 0;

        return (
            <div className="col-12 col-sm-6 col-md-4 col-lg-3 mb-4 d-flex">
                <article className="card product-card shadow-sm border-0 rounded-4 overflow-hidden w-100 h-100" itemScope itemType="https://schema.org/Product">
                    <div className="position-relative">
                        {ribbons.map((rb, i) => (
                            <span key={i} className={`badge position-absolute ribbon ${rb.className || "text-bg-warning"}`} data-pos={rb.position || "tl"}>
                                {rb.text}
                            </span>
                        ))}
                        {hasSale && (
                            <span className="badge position-absolute ribbon text-bg-danger" data-pos="tr" aria-label={`Giảm ${discountPercent}%`}>
                                -{discountPercent}%
                            </span>
                        )}

                        <a href={`/productdetail/${p.productId}`} className="d-block ratio ratio-4x3 bg-light-subtle" aria-label={p?.productName}>
                            <img
                                src={imgSrc}
                                alt={p?.productName}
                                loading="lazy"
                                decoding="async"
                                className="w-100 h-100"
                                style={{ objectFit: "scale-down", objectPosition: "center", padding: 8 }}
                                onError={(e) => {
                                    if (e.currentTarget.src.endsWith("/placeholder.png")) return;
                                    e.currentTarget.src = "/placeholder.png";
                                }}
                            />
                        </a>
                    </div>

                    <div className="card-body d-flex flex-column text-center">
                        <h3 className="product-title fw-semibold text-body-emphasis mb-2 two-line-clamp" title={p?.productName} itemProp="name">
                            {p?.productName}
                        </h3>

                        <div className="mb-3" itemProp="offers" itemScope itemType="https://schema.org/Offer">
                            <span className="fs-5 fw-bold text-danger" itemProp="price">
                                {displayedPrice(p)}
                            </span>
                            <meta itemProp="priceCurrency" content="VND" />
                            <link itemProp="availability" href="https://schema.org/InStock" />
                        </div>

                        <div className="mt-auto">
                            <button type="button" onClick={() => handleBuy(p.productId)} className="btn btn-cta w-50 d-inline-flex align-items-center justify-content-center gap-2">
                                <CartIcon />
                                <span>Mua ngay</span>
                            </button>
                        </div>
                    </div>
                </article>
            </div>
        );
    };

    function CartIcon(props) {
        return (
            <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true" {...props}>
                <path d="M7 4h-2l-1 2h2l3.6 7.59-1.35 2.44A2 2 0 0 0 10 19h9v-2h-9l1.1-2h6.45a2 2 0 0 0 1.8-1.1l3.58-7.16A1 1 0 0 0 22 4H7zM7 20a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm10 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4z" />
            </svg>
        );
    }

    // ======================= Render =======================
    return (
        <div style={{ backgroundColor: "#fff" }}>
            <Carousel />
            <div className="container py-4">
                <div className="d-none d-md-flex" style={{ height: "calc(80vh - 100px)" }}>
                    <CategorySidebar />
                    <div style={{ overflowY: "auto", flex: 1 }}>
                        <ProductGrid />
                    </div>
                </div>

                <ProductSection
                    title="🆕 Sản phẩm mới"
                    products={newProducts}
                    showAll={showAllNew}
                    toggleShow={() => setShowAllNew((v) => !v)}
                />

                <ProductSection
                    title="⭐ Sản phẩm nổi bật"
                    products={featuredProducts}
                    showAll={showAllFeatured}
                    toggleShow={() => setShowAllFeatured((v) => !v)}
                />
            </div>

            {/* Modal Buy (global) */}
            <ModalBuy show={showModalBuy} onClose={() => setShowModalBuy(false)} product={buyProduct || {}} />
        </div>
    );
}
