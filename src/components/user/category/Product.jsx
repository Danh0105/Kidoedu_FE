import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import ModalCart from "../ModalCart";
import ModalBuy from "../ModalBuy";
import { pickRibbonFromStatus } from "../../../hooks/useUiUtils"; // <-- chỉnh path nếu khác

const PLACEHOLDER_IMG = "https://via.placeholder.com/600x600?text=No+Image";

const formatCurrency = (value) =>
    new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" })
        .format(Number(value || 0));

const trimText = (s = "", max = 50) =>
    s.length > max ? s.slice(0, max) + "..." : s;

export default function Product({ prod }) {
    const [product, setProduct] = useState(null);
    const [images, setImages] = useState([]);
    const [showModalCart, setShowModalCart] = useState(false);
    const [showModalBuy, setShowModalBuy] = useState(false);
    const [hovered, setHovered] = useState(false);
    // Skeleton khi chưa có prod
    if (!prod) {
        return (
            <div className="card nav-link" style={{ width: 268 }}>
                <div className="ratio ratio-1x1 bg-body-tertiary rounded" />
                <div className="p-2">
                    <div className="placeholder-glow">
                        <span className="placeholder col-9" />
                        <span className="placeholder col-12 mt-2" />
                        <span className="placeholder col-4 mt-2" />
                    </div>
                </div>
            </div>
        );
    }

    const id = prod.product_id;
    const name = prod.product_name ?? "";
    const desc = prod.short_description ?? "";
    const price = prod.price ?? 0;
    const status = prod?.status ?? prod?.data?.status; // <-- lấy status
    const ribbon = pickRibbonFromStatus(status);       // <-- chọn ribbon từ status

    const firstImage =
        prod?.images?.[0]?.image_url ||      // detail: mảng images
        prod?.image_url ||                   // list/search: image_url đơn
        PLACEHOLDER_IMG;

    const fetchProductAndOpen = async (pid, openType) => {
        try {
            const res = await axios.get(`https://kidoedu.vn/products/${pid}`);
            const data = res.data?.data || null;
            setProduct(data);
            setImages((data?.images || []).map((img) => img?.image_url).filter(Boolean));

            if (openType === "cart") setShowModalCart(true);
            if (openType === "buy") setShowModalBuy(true);
        } catch (err) {
            console.error("Lỗi khi lấy sản phẩm:", err);
        }
    };

    const handleAddToCart = () => fetchProductAndOpen(id, "cart");
    const handleBuy = () => fetchProductAndOpen(id, "buy");

    return (
        <div
            className="card nav-link p-2 position-relative shadow-sm"
            style={{ height: 404.1, width: 268, overflow: "visible" }}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
        >
            {/* Ribbon góc trái */}
            {ribbon.map((rb, i) => (
                <span
                    key={i}
                    className={`position-absolute top-0 ${rb.position === "left" ? "start-0 " : "end-0 "} badge ${rb.className} px-3 d-flex align-items-center fst-italic shadow-sm`}
                    style={{
                        // bo đúng góc gắn vào
                        borderTopLeftRadius: rb.position === "left" ? 0 : "999rem",
                        borderTopRightRadius: rb.position === "right" ? 0 : "999rem",
                        borderBottomLeftRadius: "999rem",
                        borderBottomRightRadius: "999rem",
                        height: 32,
                        zIndex: 3,
                        pointerEvents: "none", // tránh che click ảnh
                    }}
                >
                    {rb.text}
                </span>
            ))}

            <Link to={`/productdetail/${id}`} className="nav-link p-0">
                <img
                    src={firstImage}
                    alt={name || "product"}
                    className="card-img-top object-fit-contain bg-white"
                    style={{ height: 180 }}
                    onError={(e) => {
                        e.currentTarget.src = PLACEHOLDER_IMG;
                    }}
                />
            </Link>
            <div className="row p-0 d-flex justify-content-center mt-4">
                <h5 className="card-title" style={{ fontSize: 15, fontWeight: 700 }}>
                    <Link to={`/productdetail/${id}`} className="nav-link p-0">
                        {trimText(name, 25)}
                    </Link>
                </h5>

                <div style={{ height: 42 }} className="mb-2">
                    <Link to={`/productdetail/${id}`} className="nav-link p-0">
                        <p className="card-text mt-2" style={{ fontSize: 14 }}>
                            {trimText(desc, 50)}
                        </p>
                    </Link>
                </div>

                <p className="card-text text-danger mb-3">{formatCurrency(price)}</p>

                <div className="d-flex justify-content-between gap-2">
                    <button
                        onClick={handleAddToCart}
                        className="btn btn-danger"
                        style={{ fontSize: 15 }}
                    >
                        Thêm vào giỏ
                    </button>
                    <button
                        onClick={handleBuy}
                        className="btn btn-primary"
                        style={{ fontSize: 15 }}
                    >
                        Mua ngay
                    </button>
                </div>
                <div>
                    <div
                        style={{
                            position: "absolute",
                            left: 12,
                            right: 12,
                            bottom: -8,                 // lòi ra khỏi card 1 chút
                            height: hovered ? 10 : 6,   // to hơn khi hover
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
                    product={product}
                    images={images}
                />
                <ModalBuy
                    show={showModalBuy}
                    onClose={() => setShowModalBuy(false)}
                    product={product}
                    images={images}
                    p={prod}
                />

            </div>
        </div>
    );
}
