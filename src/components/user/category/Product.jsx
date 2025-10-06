import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import ModalCart from "../ModalCart";
import ModalBuy from "../ModalBuy";

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

    // Skeleton khi chưa có prod (không đổi UX: vẫn là card)
    if (!prod) {
        return (
            <div className="card nav-link" style={{ width: "268px" }}>
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
    const firstImage =
        prod?.images?.[0]?.image_url      // trường hợp API detail trả mảng images
        || prod?.image_url                // trường hợp API list/search trả image_url
        || PLACEHOLDER_IMG;

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
        <div className="card nav-link p-2" style={{ height: "404.1px", width: "268px" }}>
            <Link to={`/productdetail/${id}`} className="nav-link p-0">
                <img
                    src={firstImage}
                    alt={name || "product"}
                    className="card-img-top object-fit-contain"
                    onError={(e) => { e.currentTarget.src = PLACEHOLDER_IMG; }}
                />
            </Link>

            <div className="row p-0 d-flex justify-content-center mt-4">
                <h5 className="card-title" style={{ fontSize: "15px", fontWeight: 700 }}>
                    <Link to={`/productdetail/${id}`} className="nav-link p-0">
                        {trimText(name, 25)}
                    </Link>
                </h5>

                <div style={{ height: "42px" }} className="mb-2">
                    <Link to={`/productdetail/${id}`} className="nav-link p-0">
                        <p className="card-text mt-2" style={{ fontSize: "14px" }}>
                            {trimText(desc, 50)}
                        </p>
                    </Link>
                </div>

                <p className="card-text text-danger">{formatCurrency(price)}</p>

                <div className="d-flex justify-content-between gap-2">
                    <button
                        onClick={handleAddToCart}
                        className="btn btn-danger"
                        style={{ fontSize: "15px" }}
                    >
                        Thêm vào giỏ
                    </button>
                    <button
                        onClick={handleBuy}
                        className="btn btn-primary"
                        style={{ fontSize: "15px" }}
                    >
                        Mua ngay
                    </button>
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
