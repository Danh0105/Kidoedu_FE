import React, { useState, useEffect, useMemo, useRef } from "react";
import { Link } from "react-router-dom";
import ModalCart from "../ModalCart";
import ModalBuy from "../ModalBuy";
import { pickRibbonFromStatus } from "../../../hooks/useUiUtils";
import "../css/Product.css";
import axios from "axios";
import AnimateCard from "../AnimateCard";
const PLACEHOLDER_IMG = "https://placehold.co/600x600?text=No+Image";

const formatCurrency = (value) =>
    new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
    }).format(Number(value || 0));

const trimText = (s = "", max = 50) =>
    s.length > max ? s.slice(0, max) + "..." : s;

export default function Product({ prod }) {
    const [showModalCart, setShowModalCart] = useState(false);
    const [showModalBuy, setShowModalBuy] = useState(false);
    const [hovered, setHovered] = useState(false);
    const id = prod?.productId;
    const slug = prod?.slug;
    const name = prod?.productName ?? "";
    const desc = prod?.shortDescription ?? "";
    const status = prod?.status ?? prod?.data?.status;
    const ribbon = pickRibbonFromStatus(status);
    const scrollRef = useRef(null);
    const firstImage =
        prod?.images?.find(img => img.isPrimary)?.imageUrl ||
        prod?.imageUrl;

    const variants = prod?.variants ?? [];
    const basePriceRange = useMemo(() => {
        if (!variants?.length) return null;

        const basePrices = [];

        for (const v of variants) {
            const base = v?.prices?.find(p => p.priceType === "base");

            if (base) {
                const n = Number(base.price);
                if (Number.isFinite(n)) {
                    basePrices.push(n);
                }
            }
        }

        if (!basePrices.length) return null;

        return {
            min: Math.min(...basePrices),
            max: Math.max(...basePrices),
        };
    }, [variants]);
    const priceRange = useMemo(() => {
        if (!variants?.length) return null;

        const now = new Date();
        const selectedPrices = [];

        for (const v of variants) {
            const prices = v?.prices ?? [];

            // tìm promo hợp lệ
            const promo = prices.find(p => {
                if (p.priceType !== "promo") return false;

                const start = p.startAt ? new Date(p.startAt) : null;
                const end = p.endAt ? new Date(p.endAt) : null;

                return (
                    (!start || start <= now) &&
                    (!end || end >= now)
                );
            });

            // nếu có promo hợp lệ → dùng promo
            if (promo) {
                const n = Number(promo.price);
                if (Number.isFinite(n)) selectedPrices.push(n);
                continue;
            }

            // nếu không có promo → lấy base
            const base = prices.find(p => p.priceType === "base");
            if (base) {
                const n = Number(base.price);
                if (Number.isFinite(n)) selectedPrices.push(n);
            }
        }

        if (!selectedPrices.length) return null;

        return {
            min: Math.min(...selectedPrices),
            max: Math.max(...selectedPrices),
        };
    }, [variants]);


    const fetchProductAndOpen = async (pid, openType) => {
        try {
            if (openType === "cart") setShowModalCart(true);
            if (openType === "buy") setShowModalBuy(true);
        } catch (err) {
            console.error("Lỗi khi lấy sản phẩm:", err);
        }
    };
    const [banners, setBanners] = useState([]);
    // Stable axios instance
    const loadBanners = async () => {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/banners/12`);
        setBanners(res.data);
    };

    useEffect(() => {
        loadBanners();
    }, []);
    const handleAddToCart = () => fetchProductAndOpen(id, "cart");
    const handleBuy = () => fetchProductAndOpen(id, "buy");

    // 🧾 Chọn hiển thị giá
    const displayedPrice = priceRange
        ? (priceRange.min === priceRange.max
            ? formatCurrency(priceRange.min)
            : `${formatCurrency(priceRange.min)} - ${formatCurrency(priceRange.max)}`)
        : <></>;
    const displayedBasePrice = useMemo(() => {
        if (!basePriceRange) return "Liên hệ";

        const { min, max } = basePriceRange;

        if (min === max) {
            return min.toLocaleString("vi-VN") + " ₫";
        }

        return (
            min.toLocaleString("vi-VN") +
            " - " +
            max.toLocaleString("vi-VN") +
            " ₫"
        );
    }, [basePriceRange]);

    const maxDiscountPercent = useMemo(() => {
        if (!variants?.length) return null;

        const now = new Date();
        let maxPercent = 0;

        for (const v of variants) {
            const prices = v?.prices ?? [];

            const base = prices.find(p => p.priceType === "base");
            if (!base) continue;

            const basePrice = Number(base.price);
            if (!Number.isFinite(basePrice) || basePrice <= 0) continue;

            const promo = prices.find(p => {
                if (p.priceType !== "promo") return false;

                const start = p.startAt ? new Date(p.startAt) : null;
                const end = p.endAt ? new Date(p.endAt) : null;

                return (!start || start <= now) && (!end || end >= now);
            });

            if (!promo) continue;

            const promoPrice = Number(promo.price);
            if (!Number.isFinite(promoPrice) || promoPrice >= basePrice) continue;

            const percent = ((basePrice - promoPrice) / basePrice) * 100;

            maxPercent = Math.max(maxPercent, Math.round(percent));
        }

        return maxPercent > 0 ? maxPercent : null;
    }, [variants]);
    if (!prod) {
        return (
            <div
                className="card shadow-sm border-0 rounded-4 p-2 product-skeleton"
                style={{ width: "100%", overflow: "hidden" }}
            >
                {/* Image */}
                <div className="ratio ratio-1x1 placeholder-glow mb-3">
                    <span className="placeholder col-12 h-100 rounded-3"></span>
                </div>

                {/* Title */}
                <div className="px-2">
                    <div className="placeholder-glow mb-2">
                        <span className="placeholder col-9"></span>
                    </div>

                    {/* Description */}
                    <div className="placeholder-glow mb-3">
                        <span className="placeholder col-12"></span>
                        <span className="placeholder col-10 mt-1"></span>
                    </div>

                    {/* Price */}
                    <div className="placeholder-glow mb-3">
                        <span className="placeholder col-5"></span>
                    </div>

                    {/* Promo badges */}
                    <div className="d-flex gap-2 mb-3 placeholder-glow">
                        <span className="placeholder col-3 rounded-pill"></span>
                        <span className="placeholder col-3 rounded-pill"></span>
                        <span className="placeholder col-3 rounded-pill"></span>
                    </div>

                    {/* Buttons */}
                    <div className="d-flex gap-2 placeholder-glow">
                        <span className="placeholder btn btn-danger col-6"></span>
                        <span className="placeholder btn btn-primary col-6"></span>
                    </div>
                </div>
            </div>
        );
    }


    return (
        <>

            <AnimateCard scrollRootRef={scrollRef} className="col position-relative">
                <div
                    className="card nav-link p-2 position-relative shadow-sm border-0 rounded-4"
                    style={{ width: "100%", overflow: "hidden", height: 510 }}
                    onMouseLeave={() => setHovered(false)}
                >
                    {/* Ribbon góc */}
                    {ribbon.map((rb, i) => (
                        <span
                            key={i}
                            className={`position-absolute top-0 ${rb.position === "left" ? "start-0" : "end-0"
                                } badge ${rb.className} px-3 d-flex align-items-center fst-italic shadow-sm`}
                            style={{
                                borderTopLeftRadius: rb.position === "left" ? 0 : "999rem",
                                borderTopRightRadius: rb.position === "right" ? 0 : "999rem",
                                borderBottomLeftRadius: "999rem",
                                borderBottomRightRadius: "999rem",
                                height: 32,
                                zIndex: 3,
                                pointerEvents: "none",
                            }}
                        >
                            {rb.text}
                        </span>
                    ))}

                    {/* Ảnh sản phẩm */}
                    <Link to={`/productdetail/${slug}`} className="nav-link p-0">
                        <div
                            className="product-image-wrapper"
                            style={{ height: 230 }}
                            onMouseEnter={() => setHovered(true)}
                        >
                            <img
                                src={process.env.REACT_APP_API_URL + firstImage}
                                alt={name || "product"}
                                className="product-image-store"
                                onError={(e) => (e.currentTarget.src = PLACEHOLDER_IMG)}
                            />



                            {/* Badge nhỏ phía dưới ảnh (tuỳ bạn) */}
                            <img
                                height={22}
                                className="product-small-badge"
                                src={process.env.REACT_APP_API_URL + banners.imageUrl}
                                alt=""

                            />
                        </div>

                    </Link>


                    {/* Hover actions */}
                    <div
                        className="d-flex gap-2 justify-content-center"
                        style={{
                            position: "absolute",
                            left: 8,
                            right: 8,
                            bottom: 120,
                            background: "rgba(255,255,255,.95)",
                            backdropFilter: "blur(4px)",
                            borderRadius: 12,
                            padding: 8,
                            boxShadow: "0 6px 18px rgba(0,0,0,.12)",
                            transition: "all .3s ease",
                            zIndex: 9999,

                            opacity: hovered ? 1 : 0,
                            transform: hovered ? "translateY(0)" : "translateY(20px)",
                            pointerEvents: hovered ? "auto" : "none",
                        }}
                    >
                        <button className="btn btn-sm btn-outline-secondary">Xem nhanh</button>
                        <button className="btn btn-sm btn-outline-secondary">So sánh</button>
                        <button className="btn btn-sm btn-outline-danger">
                            <i className="bi bi-heart"></i>
                        </button>
                    </div>

                    {/* Thông tin sản phẩm */}
                    <div className="row p-0 d-flex justify-content-center mt-1 flex-column" style={{ flex: "1 1 auto" }}>
                        <h5 className="card-title" style={{ fontSize: 15, fontWeight: 700 }}>
                            <Link to={`/productdetail/${slug}`} className="nav-link p-0">
                                {trimText(name, 25)}
                            </Link>
                        </h5>

                        {variants.length > 0 && (
                            <div className="mb-1">
                                <div className="variant-list">
                                    {variants.map((v) => {

                                        return (
                                            <div
                                                key={v.variantId}
                                                className={`variant-box-store `}
                                            >
                                                <div className="variant-name-store">{v.variantName}</div>

                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                        <p className="card-text text-danger mb-1 fw-bold">{displayedPrice}</p>


                        {maxDiscountPercent && (
                            <div className="discount-badge">
                                <span className="fw-bold">Khuyến mãi: </span>
                                <span className="text-muted text-decoration-line-through">

                                    {displayedBasePrice}
                                    <span className="badge bg-danger ms-2">
                                        -{maxDiscountPercent}%
                                    </span>
                                </span>
                            </div>

                        )}

                        {/* Promo badges */}
                        <div
                            className="rounded-3 px-2 py-1 mb-1 d-flex gap-2 align-items-center"
                            style={{ background: "rgba(13,110,253,.08)" }}
                        >
                            <span className="badge bg-success-subtle text-success border border-success">
                                Freeship
                            </span>
                            <span className="badge bg-warning-subtle text-warning border border-warning">
                                Trả góp 0%
                            </span>
                            <span className="badge bg-info-subtle text-info border border-info">
                                Đổi trả 7N
                            </span>
                        </div>
                        {prod?.promotionApplicabilities?.length > 0 ? (
                            <div className="mb-3 w-100 p-1" >
                                <button className="btn btn-sm btn-warning  w-100 text-center" style={{ zIndex: 2 }}>
                                    <span className="promo-icon">🎁</span>
                                    <span style={{ fontSize: "12px" }}>{prod?.promotionApplicabilities?.[0]?.promotion.name}</span>
                                </button>
                            </div>
                        ) : (<></>)}
                        <div className="d-flex justify-content-between gap-2 position-absolute w-100 px-2" style={{ bottom: 12 }}>
                            <button onClick={handleAddToCart} className="btn btn-danger">
                                Thêm vào giỏ hàng
                            </button>
                            <button onClick={handleBuy} className="btn btn-primary">
                                Mua ngay
                            </button>

                            {/* Hiệu ứng gradient */}
                            <div
                                style={{
                                    position: "absolute",
                                    left: 12,
                                    right: 12,
                                    bottom: -20,
                                    height: hovered ? 10 : 6,
                                    borderRadius: 999,
                                    background:
                                        "linear-gradient(90deg,#ff6b6b 0%,#f8d21a 50%,#2ea8ff 100%)",
                                    boxShadow: hovered
                                        ? "0 6px 18px rgba(255,107,107,.35)"
                                        : "0 3px 10px rgba(0,0,0,.10)",
                                    transition: "all .25s ease",
                                    zIndex: 1,
                                    pointerEvents: "none",
                                }}
                            />
                        </div>
                    </div>
                </div>
            </AnimateCard>
            {/* Modals */}
            <ModalCart
                show={showModalCart}
                onClose={() => setShowModalCart(false)}
                product={prod}
            />
            <ModalBuy
                show={showModalBuy}
                onClose={() => setShowModalBuy(false)}
                product={prod}

            />
        </>

    );
}

