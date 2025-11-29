import "../../App.css";
import Carousel from "../../components/user/Carousel";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";
import { Menu, Cpu, ChevronRight, Layers } from "lucide-react";
import ProductHome from "../../components/user/ProductHome";
import ModalBuy from "../../components/user/ModalBuy";
import PromoRow from "../../components/user/PromoRow";

// ======================= Helpers =======================
const pickRibbonsFromStatus = (raw) => {
    const s = Number(raw ?? 0);
    if (s === 2) return [{ text: "Mới", className: "bg-danger", position: "left" }];
    if (s === 1) return [{ text: "Nổi bật", className: "bg-warning text-dark", position: "left" }];
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

const fmtVND = (n) =>
    Number(n || 0).toLocaleString("vi-VN", {
        style: "currency",
        currency: "VND",
    });

/** Helper: lấy basePrice/promoPrice/finalPrice từ 1 variant (dùng cho ProductCard) */
function pickPricesFromVariant(variant) {
    if (!variant) {
        return {
            basePrice: null,
            promoPrice: null,
            finalPrice: 0,
            hasPromo: false,
        };
    }

    const prices = Array.isArray(variant.prices) ? variant.prices : [];
    let baseRecord = null;
    let promoRecord = null;

    prices.forEach((p) => {
        if (!p) return;
        if (p.priceType === "base") {
            if (!baseRecord || new Date(p.startAt) > new Date(baseRecord.startAt)) {
                baseRecord = p;
            }
        }
        if (p.priceType === "promo") {
            if (!promoRecord || new Date(p.startAt) > new Date(promoRecord.startAt)) {
                promoRecord = p;
            }
        }
    });

    const basePrice = baseRecord ? Number(baseRecord.price) : null;
    const promoPrice = promoRecord ? Number(promoRecord.price) : null;
    const finalPrice = promoPrice ?? basePrice ?? 0;
    const hasPromo =
        promoPrice != null && (basePrice ?? promoPrice) > promoPrice;

    return { basePrice, promoPrice, finalPrice, hasPromo };
}

// ======================= Component =======================
const PLACEHOLDER_IMG = "https://placehold.co/120x120?text=No+Image";

export default function Home({ apiBase = `${process.env.REACT_APP_API_URL}` }) {
    // ---- State
    const [allCats, setAllCats] = useState([]); // tất cả danh mục (chuẩn hoá id/parent)
    const [rootCats, setRootCats] = useState([]); // danh mục gốc
    const [hoverCatId, setHoverCatId] = useState(null); // id danh mục gốc đang hover
    const [hoverPanel, setHoverPanel] = useState(null);
    const [showHoverPanel, setShowHoverPanel] = useState(false); // đang hiển thị panel danh mục con
    const [selectedCatId, setSelectedCatId] = useState(null); // danh mục (thường là con) đã chọn để hiển thị sản phẩm

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
            // Chuẩn hoá
            const norm = all.map((c) => ({
                ...c,
                _id: c.categoryId ?? c.category_id ?? c.id,
                _parentId:
                    c.parentId ??
                    (typeof c.parent === "object" && c.parent
                        ? c.parent.categoryId ?? c.parent.id ?? c.parent.category_id
                        : c.parent ?? null),
                _name: c.categoryName ?? c.name,
            }));
            setAllCats(norm);
            setRootCats(norm.filter((c) => c._parentId === null));
            // Không auto chọn → mặc định hiển thị Carousel
        } catch (e) {
            console.error("fetchCategories error:", e);
        }
    }, [api]);

    const fetchProducts = useCallback(async () => {
        try {
            const res = await api.get("/products");
            const list = res?.data?.data || [];

            setAllProducts(list);
            setNewProducts(list.filter(p => (p.status & 1) > 0));
            setFeaturedProducts(list.filter(p => (p.status & 2) > 0));
        } catch (e) {
            console.error("fetchProducts error:", e);
        }
    }, [api]);

    // ==== Actions chung khi rời toàn bộ khu vực menu + panel
    const handleLeaveAll = useCallback(() => {
        setHoverCatId(null);
        setShowHoverPanel(false);
        setSelectedCatId(null);
    }, []);

    const fetchProductsByCategory = useCallback(
        async (categoryId) => {
            try {
                const catId = categoryId ?? selectedCatId;
                if (!catId) return;
                setLoading(true);
                const res = await api.get("/search/products", {
                    params: { category_id: catId },
                });
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

    // Khi click chọn danh mục (con) → tải sản phẩm
    useEffect(() => {
        if (selectedCatId != null) fetchProductsByCategory(selectedCatId);
    }, [selectedCatId, fetchProductsByCategory]);

    // ========== Derived: children by hovered root ==========
    const childrenOfHover = useMemo(() => {
        if (!hoverCatId) return [];
        return allCats.filter((c) => String(c._parentId) === String(hoverCatId));
    }, [allCats, hoverCatId]);

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
        <div
            className="card border-0 shadow-sm rounded-4 overflow-hidden p-2 placeholder-glow"
            style={{ maxWidth: 300 }}
        >
            <div
                className="bg-light placeholder rounded w-100 mb-3"
                style={{ height: 200 }}
            />
            <div className="card-body text-center">
                <p className="placeholder-glow mb-2">
                    <span className="placeholder col-8" />
                </p>
                <p className="placeholder-glow mb-3">
                    <span className="placeholder col-5" />
                </p>
                <div className="d-flex justify-content-center">
                    <span className="placeholder btn btn-primary col-6" />
                </div>
            </div>
        </div>
    );

    // ===== Sidebar (hover để mở panel, UI gọn gàng) =====
    const CategorySidebar = () => (
        <div
            className="bg-white border rounded shadow-sm position-relative"
            style={{ minWidth: 260 }}
        >
            <div className="bg-danger text-white fw-bold d-flex align-items-center px-3 py-2">
                <Menu size={20} className="me-2" /> MENU
            </div>

            <ul className="list-group list-group-flush">
                {rootCats.length > 0 ? (
                    rootCats.map((cat) => {
                        const id = cat._id;
                        const isHover = String(hoverCatId) === String(id);
                        return (
                            <li
                                key={id}
                                className={`list-group-item list-group-item-action d-flex align-items-center justify-content-between ${isHover ? "bg-danger-subtle text-danger fw-semibold" : ""
                                    }`}
                                style={{ cursor: "pointer" }}
                                onMouseEnter={() => {
                                    setHoverCatId(id);
                                    setShowHoverPanel(true); // Ẩn Carousel, hiện panel danh mục con
                                    setSelectedCatId(null); // đảm bảo chưa vào chế độ sản phẩm
                                }}
                            >
                                <div className="d-flex align-items-center">
                                    <Cpu
                                        size={18}
                                        className={`me-2 ${isHover ? "text-danger" : "text-primary"
                                            }`}
                                    />
                                    <span>{cat._name}</span>
                                </div>
                                <ChevronRight size={16} className="text-muted" />
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

    // ===== Panel danh mục con trong khu vực nội dung =====
    const SubcategoryPanel = () => {
        const title =
            rootCats.find((r) => String(r._id) === String(hoverCatId))?._name ||
            "Danh mục";
        return (
            <div className="ps-3 w-100">
                <div
                    className="card border-0 shadow-sm rounded-4"
                    style={{
                        minHeight: 260,
                        transition: "opacity 160ms ease, transform 160ms ease",
                        opacity: 1,
                        transform: "translateY(0)",
                    }}
                >
                    <div className="card-body">
                        <div className="d-flex align-items-center mb-3">
                            <div
                                className="me-2 d-flex align-items-center justify-content-center rounded-circle bg-danger-subtle"
                                style={{ width: 36, height: 36 }}
                            >
                                <Layers size={18} className="text-danger" />
                            </div>
                            <div>
                                <h5 className="mb-0">{title}</h5>
                                <small className="text-muted">
                                    Chọn danh mục con để xem sản phẩm
                                </small>
                            </div>
                        </div>

                        {/* Grid danh mục con: 2–3 cột tự co giãn */}
                        <div className="row row-cols-1 row-cols-sm-2 row-cols-lg-3 g-3">
                            {childrenOfHover.length > 0 ? (
                                childrenOfHover.map((child) => (
                                    <div key={child._id} className="col">
                                        <button
                                            className="w-100 btn btn-light border d-flex align-items-center justify-content-between rounded-4 py-3 px-3 shadow-sm"
                                            onClick={() => {
                                                setSelectedCatId(child._id); // chuyển sang chế độ sản phẩm
                                                setShowHoverPanel(false);
                                                setHoverCatId(null);
                                            }}
                                        >
                                            <span className="d-flex align-items-center">
                                                <Cpu size={18} className="me-2 text-primary" />
                                                <span className="fw-semibold">{child._name}</span>
                                            </span>
                                            <ChevronRight size={16} className="text-muted" />
                                        </button>
                                    </div>
                                ))
                            ) : (
                                <div className="col">
                                    <div className="alert alert-light border rounded-4 mb-0">
                                        Chưa có danh mục con.
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    // ===== Vùng nội dung bên phải =====
    const ContentArea = () => {
        // 1) Đã chọn danh mục → hiển thị sản phẩm
        if (selectedCatId != null) {
            return (
                <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-3 flex-grow-1 ps-3">
                    {loading
                        ? Array.from({ length: 6 }).map((_, i) => (
                            <div key={i} className="col d-flex justify-content-center">
                                <SkeletonCard />
                            </div>
                        ))
                        : items.length > 0
                            ? items.map((prod) => {
                                const ribbons = pickRibbonsFromStatus(prod?.status);
                                return (
                                    <div className="col position-relative" key={prod.productId}>
                                        {ribbons.map((rb, i) => (
                                            <Ribbon
                                                key={i}
                                                text={rb.text}
                                                position={rb.position}
                                                className={rb.className}
                                            />
                                        ))}
                                        <ProductHome
                                            prod={prod}
                                            onBuy={() => handleBuy(prod.productId)}
                                        />
                                    </div>
                                );
                            })
                            : (
                                <p className="text-center text-muted">
                                    Chưa có sản phẩm trong danh mục này.
                                </p>
                            )}
                </div>
            );
        }

        // 2) Đang hover menu → hiển thị panel danh mục con (ẩn Carousel)
        if ((showHoverPanel || hoverPanel) && hoverCatId) {
            return <SubcategoryPanel />;
        }

        // 3) Mặc định → Carousel
        return (
            <div className="flex-grow-1 ps-3 w-100">
                <Carousel />
            </div>
        );
    };

    // ======================= Render =======================
    return (
        <div >
            <div className="container py-4 bg-white bg-opacity-75 rounded-4 shadow-sm">
                {/* Desktop layout: Sidebar + Content */}
                <div
                    className="d-none d-md-flex"
                    style={{ minHeight: "calc(80vh - 100px)" }}
                    onMouseLeave={handleLeaveAll}
                >
                    <CategorySidebar />
                    <div style={{ overflowY: "auto", flex: 1 }}>
                        <ContentArea />
                    </div>
                </div>

                <PromoRow
                    items={[
                        {
                            src: "https://cdn.tgdd.vn/Files/2021/12/27/1406967/tivi-samsung-giam-cuc-soc-den-28-mua-cuoi-nam.jpg",
                            href: "https://cdn.tgdd.vn/Files/2021/12/27/1406967/tivi-samsung-giam-cuc-soc-den-28-mua-cuoi-nam.jpg",
                            alt: "Duy nhất 11.11 - Nồi cơm PHILIPS",
                        },
                        {
                            src: "https://cdn11.dienmaycholon.vn/filewebdmclnew/DMCL21/Picture//Tm/Tm_picture_3053/1111_244_800.png.webp",
                            href: "https://cdn11.dienmaycholon.vn/filewebdmclnew/DMCL21/Picture//Tm/Tm_picture_3053/1111_244_800.png.webp",
                            alt: "Thách đấu online - Giảm đến 50%",
                        },
                        {
                            src: "https://mediamart.vn/images/uploads/2023/6e6eff39-2dc5-4a93-809b-fff5eab21d4f.png",
                            href: "https://mediamart.vn/images/uploads/2023/6e6eff39-2dc5-4a93-809b-fff5eab21d4f.png",
                            alt: "Lễ hội máy sấy - Giá từ 3.990 triệu",
                        },
                    ]}
                />

                {/* Sản phẩm mới */}
                <section className="my-5">
                    <div className="text-center mb-4">
                        <h2 className="fw-bold" style={{ fontSize: "2rem" }}>
                            🆕 Sản phẩm mới
                        </h2>
                        <div
                            style={{
                                height: 3,
                                width: 80,
                                backgroundColor: "hsl(0,75%,60%)",
                                margin: "10px auto",
                                borderRadius: 3,
                            }}
                        />
                    </div>
                    <div className="row justify-content-center">
                        {(showAllNew ? newProducts : newProducts.slice(0, 4)).map((p) => (
                            <ProductCard key={p.productId} p={p} />
                        ))}
                        {!newProducts.length && (
                            <p className="text-center text-muted">
                                Đang cập nhật sản phẩm...
                            </p>
                        )}
                    </div>
                    {newProducts.length > 4 && (
                        <div className="text-center mt-3">
                            <button
                                onClick={() => setShowAllNew((v) => !v)}
                                className="btn btn-outline-danger rounded-pill px-4"
                            >
                                {showAllNew ? "Thu gọn" : "Xem thêm"}
                            </button>
                        </div>
                    )}
                </section>

                {/* Sản phẩm nổi bật */}
                <section className="my-5">
                    <div className="text-center mb-4">
                        <h2 className="fw-bold" style={{ fontSize: "2rem" }}>
                            ⭐ Sản phẩm nổi bật
                        </h2>
                        <div
                            style={{
                                height: 3,
                                width: 80,
                                backgroundColor: "hsl(0,75%,60%)",
                                margin: "10px auto",
                                borderRadius: 3,
                            }}
                        />
                    </div>
                    <div className="row justify-content-center">
                        {(showAllFeatured ? featuredProducts : featuredProducts.slice(0, 4)).map(
                            (p) => (
                                <ProductCard key={p.productId} p={p} />
                            )
                        )}
                        {!featuredProducts.length && (
                            <p className="text-center text-muted">
                                Đang cập nhật sản phẩm...
                            </p>
                        )}
                    </div>
                    {featuredProducts.length > 4 && (
                        <div className="text-center mt-3">
                            <button
                                onClick={() => setShowAllFeatured((v) => !v)}
                                className="btn btn-outline-danger rounded-pill px-4"
                            >
                                {showAllFeatured ? "Thu gọn" : "Xem thêm"}
                            </button>
                        </div>
                    )}
                </section>
            </div>

            {/* Modal Buy (global) */}
            <ModalBuy
                show={showModalBuy}
                onClose={() => setShowModalBuy(false)}
                product={buyProduct || {}}
            />
        </div>
    );
}

// ===== Product card (reused in sections) =====
function ProductCard({ p }) {
    const ribbons = (pickRibbonsFromStatus?.(p?.status) || []).slice(0, 3);
    const imgSrc = p.images?.find(img => img.isPrimary)?.imageUrl ??
        p.images?.[0]?.imageUrl ??
        PLACEHOLDER_IMG;

    // Tóm tắt giá từ variants nếu có
    const {
        minFinal,
        maxFinal,
        minBase,
        maxBase,
        anyPromo,
        discountPercent,
    } = useMemo(() => {
        const variants = Array.isArray(p?.variants) ? p.variants : [];

        // ⭐ Ưu tiên giá p.price nếu tồn tại
        if (p?.price != null && !isNaN(p.price) && Number(p.price) !== 0) {
            const price = Number(p.price);
            return {
                minFinal: price,
                maxFinal: price,
                minBase: null,
                maxBase: null,
                anyPromo: false,
                discountPercent: 0,
            };
        }

        if (!variants.length) {
            const min = Number(p?.priceRange?.min);
            const max = Number(p?.priceRange?.max || min);
            return {
                minFinal: min,
                maxFinal: max,
                minBase: null,
                maxBase: null,
                anyPromo: false,
                discountPercent: 0,
            };
        }

        const finalPrices = [];
        const basePrices = [];
        let maxDiscount = 0;
        let hasPromo = false;

        variants.forEach((v) => {
            const { basePrice, promoPrice, finalPrice, hasPromo: vPromo } =
                pickPricesFromVariant(v);

            if (finalPrice > 0) finalPrices.push(finalPrice);
            if (basePrice != null) basePrices.push(basePrice);

            if (vPromo && basePrice && promoPrice && basePrice > promoPrice) {
                hasPromo = true;
                const pct = Math.round(((basePrice - promoPrice) / basePrice) * 100);
                if (pct > maxDiscount) maxDiscount = pct;
            }
        });

        if (!finalPrices.length) {
            const min = Number(p?.priceRange?.min);
            const max = Number(p?.priceRange?.max || min);
            return {
                minFinal: min,
                maxFinal: max,
                minBase: null,
                maxBase: null,
                anyPromo: false,
                discountPercent: 0,
            };
        }

        const minFinal = Math.min(...finalPrices);
        const maxFinal = Math.max(...finalPrices);
        const minBase = basePrices.length ? Math.min(...basePrices) : null;
        const maxBase = basePrices.length ? Math.max(...basePrices) : null;

        return {
            minFinal,
            maxFinal,
            minBase,
            maxBase,
            anyPromo: hasPromo,
            discountPercent: hasPromo ? maxDiscount : 0,
        };
    }, [p]);

    const hasRangeFinal = minFinal !== maxFinal;
    const hasBaseRange = minBase != null && maxBase != null && minBase !== maxBase;

    const hasSale = anyPromo;
    const showDiscountBadge =
        hasSale && discountPercent && discountPercent > 0;

    return (
        <div className="col-12 col-sm-6 col-md-4 col-lg-3 mb-4 d-flex">
            <article
                className="card product-card shadow-sm border-0 rounded-4 overflow-hidden w-100 h-100"
                itemScope
                itemType="https://schema.org/Product"
            >
                <div className="position-relative">
                    {ribbons.map((rb, i) => (
                        <span
                            key={i}
                            className={`badge position-absolute ribbon ${rb.className || "text-bg-warning"
                                }`}
                            data-pos={rb.position || "tl"}
                        >
                            {rb.text}
                        </span>
                    ))}
                    {showDiscountBadge && (
                        <span
                            className="badge position-absolute ribbon text-bg-danger"
                            data-pos="tr"
                            aria-label={`Giảm ${discountPercent}%`}
                        >
                            -{discountPercent}%
                        </span>
                    )}

                    <a
                        href={`/productdetail/${p.productId}`}
                        className="d-block ratio ratio-4x3 bg-light-subtle"
                        aria-label={p?.productName}
                    >
                        <img
                            src={process.env.REACT_APP_API_URL + imgSrc}
                            alt={p?.productName}
                            loading="lazy"
                            decoding="async"
                            className="w-100 h-100"
                            style={{
                                objectFit: "scale-down",
                                objectPosition: "center",
                                padding: 8,
                            }}
                            onError={(e) => {
                                if (e.currentTarget.src.endsWith("/placeholder.png")) return;
                                e.currentTarget.src = "/placeholder.png";
                            }}
                        />
                    </a>
                </div>

                <div className="card-body d-flex flex-column text-center">
                    <h3
                        className="product-title fw-semibold text-body-emphasis mb-2 two-line-clamp"
                        title={p?.productName}
                        itemProp="name"
                    >
                        {p?.productName}
                    </h3>

                    <div
                        className="mb-3"
                        itemProp="offers"
                        itemScope
                        itemType="https://schema.org/Offer"
                    >
                        {/* Giá khuyến mãi / final */}
                        <span className="fs-5 fw-bold text-danger" itemProp="price">
                            {hasRangeFinal
                                ? `${fmtVND(minFinal)} - ${fmtVND(maxFinal)}`
                                : fmtVND(minFinal)}
                        </span>

                        {/* Giá gốc gạch ngang nếu có promo */}
                        {anyPromo && minBase && minBase > minFinal && (
                            <div className="text-muted text-decoration-line-through small mt-1">
                                {hasBaseRange
                                    ? `${fmtVND(minBase)} - ${fmtVND(maxBase)}`
                                    : fmtVND(minBase)}
                            </div>
                        )}

                        <meta itemProp="priceCurrency" content="VND" />
                        <link
                            itemProp="availability"
                            href="https://schema.org/InStock"
                        />
                    </div>
                </div>
            </article>
        </div>
    );
}
