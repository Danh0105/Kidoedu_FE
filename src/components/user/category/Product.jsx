import React, { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import ModalCart from "../ModalCart";
import ModalBuy from "../ModalBuy";
import { pickRibbonFromStatus } from "../../../hooks/useUiUtils";
import "../css/Product.css";
import axios from "axios";
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
    const name = prod?.productName ?? "";
    const desc = prod?.shortDescription ?? "";
    const basePrice = prod?.price ?? 0;
    const status = prod?.status ?? prod?.data?.status;
    const ribbon = pickRibbonFromStatus(status);


    const firstImage =
        prod?.images?.find(img => img.isPrimary)?.imageUrl ||
        PLACEHOLDER_IMG;


    // 🧮 Fetch giá theo biến thể
    // 🧮 Fetch dải giá theo biến thể (min - max)
    const priceRange = useMemo(() => {
        const variants = prod?.variants ?? [];
        const allPrices = [];

        for (const v of variants) {
            const prices = v?.prices ?? [];
            for (const p of prices) {
                const n = Number(p?.price);
                if (Number.isFinite(n)) {
                    allPrices.push(n);
                }
            }
        }

        if (!allPrices.length) return null;

        const min = Math.min(...allPrices);
        const max = Math.max(...allPrices);
        return { min, max };
    }, [prod]);


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
        : formatCurrency(basePrice);


    // 🩶 Loading skeleton
    if (!prod) {
        return (
            <div
                className="card shadow-sm border-0 rounded-4 overflow-hidden p-2 placeholder-glow"
                style={{ width: 268 }}
            >
                <div
                    className="bg-light placeholder w-100 rounded mb-3"
                    style={{ height: 180 }}
                ></div>
                <div className="p-2 text-center">
                    <p className="placeholder-glow mb-2">
                        <span className="placeholder col-8"></span>
                    </p>
                    <p className="placeholder-glow mb-2">
                        <span className="placeholder col-6"></span>
                    </p>
                    <p className="placeholder-glow mb-3">
                        <span className="placeholder col-4"></span>
                    </p>
                    <div className="d-flex justify-content-center gap-2">
                        <span className="placeholder btn btn-danger col-5"></span>
                        <span className="placeholder btn btn-primary col-5"></span>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div
            className="card nav-link p-2 position-relative shadow-sm border-0 rounded-4"
            style={{ width: 268, overflow: "hidden" }}
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
            <Link to={`/productdetail/${id}`} className="nav-link p-0">
                <div
                    className="product-image-wrapper"
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
                onMouseEnter={() => setHovered(true)}
                className="d-flex gap-2 justify-content-center"
                style={{
                    position: "absolute",
                    left: 8,
                    right: 8,
                    bottom: hovered ? 220 : -48,
                    background: "rgba(255,255,255,.92)",
                    backdropFilter: "blur(4px)",
                    borderRadius: 12,
                    padding: 8,
                    boxShadow: "0 6px 18px rgba(0,0,0,.12)",
                    transition: "bottom .25s ease",
                    zIndex: 2,
                }}
            >
                <button className="btn btn-sm btn-outline-secondary">Xem nhanh</button>
                <button className="btn btn-sm btn-outline-secondary">So sánh</button>
                <button className="btn btn-sm btn-outline-danger">
                    <i className="bi bi-heart"></i>
                </button>
            </div>

            {/* Thông tin sản phẩm */}
            <div className="row p-0 d-flex justify-content-center mt-4">
                <h5 className="card-title" style={{ fontSize: 15, fontWeight: 700 }}>
                    <Link to={`/productdetail/${id}`} className="nav-link p-0">
                        {trimText(name, 25)}
                    </Link>
                </h5>

                <div style={{ height: 42 }} className="mb-2">
                    <Link to={`/productdetail/${id}`} className="nav-link p-0">
                        <p
                            className="card-text mt-2"
                            style={{ fontSize: 14 }}
                            dangerouslySetInnerHTML={{
                                __html: trimHtml(desc, 50)
                            }}
                        ></p>

                    </Link>
                </div>

                <p className="card-text text-danger mb-2 fw-bold">{displayedPrice}</p>

                {/* Promo badges */}
                <div
                    className="rounded-3 px-2 py-1 mb-3 d-flex gap-2 align-items-center"
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

                <div className="d-flex justify-content-between gap-2">
                    <button onClick={handleAddToCart} className="btn btn-danger">
                        Thêm vào giỏ
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
                            bottom: -8,
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

            </div>
        </div>
    );
}
function trimHtml(html, maxLength) {
    const div = document.createElement("div");
    div.innerHTML = html;
    const text = div.innerText || div.textContent;
    return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
}
