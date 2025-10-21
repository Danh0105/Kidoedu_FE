import "../../App.css";
import CDS from "../../assets/user/CDS.png";
import STEM from "../../assets/user/STEM.png";
import ROBOT from "../../assets/user/ROBOT.png";
import Carousel from "../../components/user/Carousel";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";
import {
    Menu,
    Tv,
    Smartphone,
    Cpu,
    Wrench,
    HomeIcon,
    Gem,
    Zap,
    Gift,
} from "lucide-react";
import ProductHome from "../../components/user/ProductHome";
import ModalBuy from "../../components/user/ModalBuy";

// --- Ribbon helper (2 góc khi status = 12) ---
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

export default function Home({ apiBase = `${process.env.REACT_APP_API_URL}` }) {
    const [categories, setCategories] = useState([]);
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(false);
    const [featuredProducts, setFeaturedProducts] = useState([]);
    const [newProducts, setNewProducts] = useState([]);
    const [showAllFeatured, setShowAllFeatured] = useState(false);
    const [showAllNew, setShowAllNew] = useState(false);
    const [selectedCatId, setSelectedCatId] = useState(null);

    // Modal Buy (đặt 1 lần)
    const [showModalBuy, setShowModalBuy] = useState(false);
    const [buyProduct, setBuyProduct] = useState(null);
    const [buyImages, setBuyImages] = useState([]);

    const api = useMemo(
        () =>
            axios.create({
                baseURL: apiBase.replace(/\/+$/, ""),
                timeout: 10000,
            }),
        [apiBase]
    );

    // ===== APIs =====
    const fetchCategories = useCallback(async () => {
        try {
            const res = await api.get("/categories");
            const all = res.data || [];
            const roots = all.filter((c) => c.parent === null);
            setCategories(roots);
        } catch (e) {
            console.error("fetchCategories error:", e);
        }
    }, [api]);


    const checkCategory = useCallback(
        async (categoryId) => {
            try {
                if (!categoryId) categoryId = 10;
                setLoading(true);
                const res = await api.get("/search/products", {
                    params: { category_id: categoryId },
                });
                const data = res.data ?? {};
                setItems(data.items ?? []);
            } catch (e) {
                console.error("Error fetching products by category:", e);
            } finally {
                setLoading(false);
            }
        },
        [api]
    );

    const fetchProducts = useCallback(async () => {
        try {
            const res = await api.get("/products");
            const data = res.data?.data || [];
            setFeaturedProducts(data.filter((p) => p.status === 1 || p.status === 12));
            setNewProducts(data.filter((p) => p.status === 2 || p.status === 12));
        } catch (e) {
            console.error("fetchProducts error:", e);
        }
    }, [api]);

    // Lần đầu chỉ fetch dữ liệu, không gọi checkCategory ở đây
    useEffect(() => {
        fetchCategories();
        fetchProducts();
    }, [fetchCategories, fetchProducts]);

    // Khi có categories => tự động chọn danh mục đầu tiên
    useEffect(() => {
        if (categories.length > 0 && !selectedCatId) {
            const firstCatId = categories[0].category_id;
            setSelectedCatId(firstCatId);
            checkCategory(firstCatId);
        }
    }, [categories, selectedCatId, checkCategory]);

    // Khi người dùng click đổi danh mục => load lại sản phẩm
    useEffect(() => {
        if (selectedCatId) {
            checkCategory(selectedCatId);
        }
    }, [selectedCatId, checkCategory]);

    // ===== Actions =====
    const handleBuy = async (id) => {
        try {
            const res = await api.get(`/products/${id}`);
            const data = res.data?.data || null;
            setBuyProduct(data);
            setBuyImages(
                (data?.images || []).map((img) => img?.image_url).filter(Boolean)
            );
            setShowModalBuy(true);
        } catch (e) {
            console.error("handleBuy error:", e);
        }
    };

    // ===== Placeholder UI =====
    const SkeletonCard = () => (
        <div
            className="card border-0 shadow-sm rounded-4 overflow-hidden p-2 placeholder-glow"
            style={{ maxWidth: 300 }}
        >
            <div
                className="bg-light placeholder rounded w-100 mb-3"
                style={{ height: 200 }}
            ></div>
            <div className="card-body text-center">
                <p className="placeholder-glow mb-2">
                    <span className="placeholder col-8"></span>
                </p>
                <p className="placeholder-glow mb-3">
                    <span className="placeholder col-5"></span>
                </p>
                <div className="d-flex justify-content-center">
                    <span className="placeholder btn btn-primary col-6"></span>
                </div>
            </div>
        </div>
    );

    // ===== UI pieces =====
    const CategorySidebar = () => (
        <div className="bg-white border rounded shadow-sm" style={{ minWidth: 260 }}>
            <div className="bg-danger text-white fw-bold d-flex align-items-center px-3 py-2">
                <Menu size={20} className="me-2" /> MENU
            </div>

            <ul className="list-group list-group-flush">
                {categories.length > 0 ? (
                    categories.map((cat) => (
                        <li
                            key={cat.category_id}
                            className={`list-group-item list-group-item-action d-flex align-items-center justify-content-between ${selectedCatId === cat.category_id
                                ? "active border-danger bg-danger-subtle text-danger fw-semibold"
                                : ""
                                }`}
                            style={{ cursor: "pointer" }}
                            onClick={() => {
                                setSelectedCatId(cat.category_id);
                                checkCategory(cat.category_id);
                            }}
                        >
                            <div className="d-flex align-items-center">
                                <Cpu
                                    size={18}
                                    className={`me-2 ${selectedCatId === cat.category_id
                                        ? "text-danger"
                                        : "text-primary"
                                        }`}
                                />
                                <span>{cat.category_name}</span>
                            </div>
                            <span
                                className={`badge ${selectedCatId === cat.category_id
                                    ? "bg-danger text-white"
                                    : "bg-danger-subtle text-danger"
                                    }`}
                            >
                                SALE
                            </span>
                        </li>
                    ))
                ) : (
                    Array.from({ length: 5 }).map((_, i) => (
                        <li key={i} className="list-group-item placeholder-glow">
                            <span className="placeholder col-8"></span>
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
                    <div key={i} className="col d-flex justify-content-center">
                        <SkeletonCard />
                    </div>
                ))
                : items.length > 0
                    ? items.map((prod) => {
                        const ribbons = pickRibbonsFromStatus(prod?.status);
                        return (
                            <div className="col position-relative" key={prod.product_id}>
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
                                    onBuy={() => handleBuy(prod.product_id)}
                                />
                            </div>
                        );
                    })
                    : (
                        <p className="text-center text-muted">Không có sản phẩm nào</p>
                    )}
        </div>
    );

    const ProductSection = ({ title, products, showAll, toggleShow }) => {
        const visibleProducts = showAll ? products : products.slice(0, 4);

        return (
            <section className="my-5">
                <div className="text-center mb-4">
                    <h2 className="fw-bold" style={{ fontSize: "2rem" }}>
                        {title}
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
                    {visibleProducts.length > 0 ? (
                        visibleProducts.map((p) => <ProductCard key={p.product_id} p={p} />)
                    ) : (
                        <p className="text-center text-muted">Đang cập nhật sản phẩm...</p>
                    )}
                </div>

                {products.length > 4 && (
                    <div className="text-center mt-3">
                        <button
                            onClick={toggleShow}
                            className="btn btn-outline-danger rounded-pill px-4"
                        >
                            {showAll ? "Thu gọn" : "Xem thêm"}
                        </button>
                    </div>
                )}
            </section>
        );
    };

    // ProductCard.jsx

    // util: format VND ngắn gọn, không bị undefined
    const formatVND = (n) =>
        new Intl.NumberFormat("vi-VN", { maximumFractionDigits: 0 }).format(Number(n || 0));

    /**
     * ProductCard
     * @param {object} props
     * @param {object} props.product - dữ liệu sản phẩm
     * @param {(id:string)=>void} props.onBuy - callback khi bấm "Mua ngay"
     * @param {string} [props.className] - className bổ sung
     * @param {(status:any)=>Array<{text:string,position?:'tl'|'tr'|'bl'|'br',className?:string}>} props.pickRibbonsFromStatus
     * @param {string} props.fallbackImage - ảnh dự phòng
     */
    function ProductCard({
        p,
        onBuy,
        className = "",
        pickRibbonsFromStatus,
        fallbackImage,
    }) {
        const [buying, setBuying] = useState(false);
        const ribbons = (pickRibbonsFromStatus?.(p?.status) || []).slice(0, 3);
        const imgSrc = p?.images?.[0]?.image_url || fallbackImage;

        const handleBuy = async (id) => {
            try {
                const res = await api.get(`/products/${id}`);
                const data = res.data?.data || null;
                setBuyProduct(data);
                setBuyImages(
                    (data?.images || []).map((img) => img?.image_url).filter(Boolean)
                );
                setShowModalBuy(true);
            } catch (e) {
                console.error("handleBuy error:", e);
            }
        };

        // Nếu có giá khuyến mãi, tính % giảm
        const hasSale = p?.sale_price && Number(p.sale_price) < Number(p.price);
        const discountPercent = hasSale
            ? Math.round(((Number(p.price) - Number(p.sale_price)) / Number(p.price)) * 100)
            : 0;

        return (
            <div className={`col-12 col-sm-6 col-md-4 col-lg-3 mb-4 d-flex ${className}`}>
                <article
                    className="card product-card shadow-sm border-0 rounded-4 overflow-hidden w-100 h-100"
                    itemScope
                    itemType="https://schema.org/Product"
                >
                    <div className="position-relative">
                        {/* Ribbons/Badges */}
                        {ribbons.map((rb, i) => (
                            <span
                                key={i}
                                className={`badge position-absolute ribbon ${rb.className || "text-bg-warning"}`}
                                data-pos={rb.position || "tl"}
                            >
                                {rb.text}
                            </span>
                        ))}
                        {hasSale && (
                            <span className="badge position-absolute ribbon text-bg-danger" data-pos="tr" aria-label={`Giảm ${discountPercent}%`}>
                                -{discountPercent}%
                            </span>
                        )}

                        {/* Khung ảnh tỉ lệ cố định để tránh layout shift */}
                        <a
                            href={`/productdetail/${p.product_id}`}
                            className="d-block ratio ratio-4x3 bg-light-subtle"
                            aria-label={p?.product_name}
                        >
                            <img
                                src={imgSrc}
                                alt={p?.product_name}
                                loading="lazy"
                                decoding="async"
                                className="w-100 h-100"
                                style={{ objectFit: 'scale-down', objectPosition: 'center', padding: '8px' }} // ✅ không phóng to
                                onError={(e) => {
                                    if (fallbackImage && e.currentTarget.src !== fallbackImage) {
                                        e.currentTarget.src = fallbackImage;
                                    }
                                }}
                            />
                        </a>

                    </div>

                    <div className="card-body d-flex flex-column text-center">
                        <h3
                            className="product-title fw-semibold text-body-emphasis mb-2 two-line-clamp"
                            title={p?.product_name}
                            itemProp="name"
                        >
                            {p?.product_name}
                        </h3>

                        {/* Giá */}
                        <div className="mb-3" itemProp="offers" itemScope itemType="https://schema.org/Offer">
                            {hasSale ? (
                                <>
                                    <div className="d-flex justify-content-center align-items-baseline gap-2">
                                        <span className="fs-5 fw-bold text-danger" itemProp="price">
                                            {formatVND(p.sale_price)} ₫
                                        </span>
                                        <s className="text-secondary small">{formatVND(p.price)} ₫</s>
                                    </div>
                                    <meta itemProp="priceCurrency" content="VND" />
                                </>
                            ) : (
                                <>
                                    <span className="fs-5 fw-bold text-danger" itemProp="price">
                                        {formatVND(p.price)} ₫
                                    </span>
                                    <meta itemProp="priceCurrency" content="VND" />
                                </>
                            )}
                            <link itemProp="availability" href="https://schema.org/InStock" />
                        </div>

                        {/* CTA */}
                        <div className="mt-auto">
                            <button
                                type="button"
                                onClick={() => handleBuy(p.product_id)}
                                className="btn btn-cta w-50 d-inline-flex align-items-center justify-content-center gap-2"
                                disabled={buying}
                                aria-pressed={buying}
                                aria-busy={buying}
                            >
                                {buying ? (
                                    <>
                                        <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true" />
                                        <span>Đang thêm...</span>
                                    </>
                                ) : (
                                    <>
                                        <span className="btn-icon" aria-hidden="true"><CartIcon /></span>
                                        <span>Mua ngay</span>
                                    </>
                                )}
                                <span className="visually-hidden">Thêm sản phẩm vào giỏ</span>
                            </button>

                        </div>
                    </div>
                </article>
            </div>
        );
    }


    function CartIcon(props) {
        // SVG thuần để khỏi phụ thuộc thư viện icon
        return (
            <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true" {...props}>
                <path d="M7 4h-2l-1 2h2l3.6 7.59-1.35 2.44A2 2 0 0 0 10 19h9v-2h-9l1.1-2h6.45a2 2 0 0 0 1.8-1.1l3.58-7.16A1 1 0 0 0 22 4H7zM7 20a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm10 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4z" />
            </svg>
        );
    }

    return (
        <div style={{ backgroundColor: "#fff" }}>
            <Carousel />
            <div className="container py-4">
                {/*  <div className="d-none d-md-flex" style={{ height: "calc(80vh - 100px)" }}>
                    <CategorySidebar />
                    <div style={{ overflowY: "auto", flex: 1 }}>
                        <ProductGrid />
                    </div>
                </div> */}

                {/* Hero Section */}
                {/*            <div className="text-center my-5">
                    <h1 className="fw-bold mb-3">
                        <span>Ai cũng có thể trở thành </span>
                        <span style={{ color: "hsl(0,75%,60%)" }}>người đặc biệt</span>
                    </h1>
                    <p className="lead">
                        Và <span style={{ color: "hsl(0,75%,60%)" }}>bạn</span> cũng có thể là người tiếp theo!
                    </p>
                </div> */}

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

                {/* Khóa học */}
                {/*     <section className="my-5">
                    <div className="text-center mb-4">
                        <h2 className="fw-bold" style={{ fontSize: "2rem" }}>
                            📘 Khóa học nổi bật
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
                    <div className="row justify-content-center text-center">
                        {[CDS, STEM, ROBOT].map((img, idx) => (
                            <div
                                key={idx}
                                className="col-lg-4 col-md-6 mb-4 d-flex justify-content-center"
                            >
                                <div className="card shadow-sm border-0 rounded-4 overflow-hidden">
                                    <img
                                        src={img}
                                        alt={`Course ${idx + 1}`}
                                        className="img-fluid"
                                        style={{ height: 300, objectFit: "cover" }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </section> */}
            </div>

            {/* Modal Buy (global) */}
            <ModalBuy
                show={showModalBuy}
                onClose={() => setShowModalBuy(false)}
                product={buyProduct}
                images={buyImages}
            />
        </div>
    );
}
