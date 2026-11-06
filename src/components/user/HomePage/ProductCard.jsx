import React, { memo, useMemo, useCallback } from "react";
import { pickRibbonsFromStatus } from "../../../utils/pickRibbonsFromStatus";

const API = process.env.REACT_APP_API_URL;

const priceFormatter = new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
});

const fmtVND = (n) => priceFormatter.format(n || 0);

let viewedCache = null;

function getViewedProducts() {
    if (viewedCache) return viewedCache;

    try {
        const raw = localStorage.getItem("viewed_products");
        viewedCache = raw ? JSON.parse(raw) : [];
    } catch {
        viewedCache = [];
    }

    return viewedCache;
}

function ProductCard({ p, banners }) {

    /* ===== IMAGE ===== */

    const imageUrl = useMemo(() => {
        if (!p?.imageUrl) return "/placeholder.png";
        return API + p.imageUrl;
    }, [p?.imageUrl]);

    /* ===== RIBBONS ===== */

    const ribbons = useMemo(() => {
        const r = pickRibbonsFromStatus?.(p?.status) || [];
        return r.length > 3 ? r.slice(0, 3) : r;
    }, [p?.status]);

    /* ===== PRICE ===== */

    const price = Number(p.finalPrice ?? p.price ?? 0);
    const basePrice = Number(p.basePrice ?? 0);

    const discountPercent = useMemo(() => {
        if (!basePrice || basePrice <= price) return 0;
        return Math.round(((basePrice - price) / basePrice) * 100);
    }, [price, basePrice]);

    /* ===== VIEWED PRODUCT ===== */

    const saveViewedProduct = useCallback(() => {
        const maxItems = 8;

        const viewed = getViewedProducts();

        const filtered = viewed.filter(
            (x) => x.productId !== p.productId
        );

        filtered.unshift({
            productId: p.productId,
            productName: p.productName,
            imageUrl: p.imageUrl,
            price: p.price,
            basePrice: p.basePrice,
            status: p.status,
        });

        if (filtered.length > maxItems) filtered.length = maxItems;

        viewedCache = filtered;

        try {
            localStorage.setItem("viewed_products", JSON.stringify(filtered));
        } catch { }

    }, [p]);

    /* ===== RENDER ===== */

    return (
        <div className="col-12 col-sm-6 col-md-4 col-lg-3 mb-4 d-flex">

            <article
                className="card product-card shadow-sm border-0 rounded-4 overflow-hidden w-100 h-100"
                itemScope
                itemType="https://schema.org/Product"
            >

                <div className="product-frame">

                    {/* STATUS RIBBONS */}
                    {ribbons.map((rb, i) => (
                        <span
                            key={i}
                            className={`badge position-absolute ribbon ${rb.className || "text-bg-warning"}`}
                            data-pos={rb.position || "tl"}
                        >
                            {rb.text}
                        </span>
                    ))}

                    {/* DISCOUNT */}
                    {discountPercent > 0 && (
                        <span
                            className="badge position-absolute ribbon text-bg-danger"
                            data-pos="tr"
                        >
                            -{discountPercent}%
                        </span>
                    )}

                    {/* IMAGE */}

                    <a
                        href={`/productdetail/${p.slug || p.productId}`}
                        className="product-image-wrapper"
                        onClick={saveViewedProduct}
                    >

                        <img
                            src={imageUrl}
                            alt={p?.productName}
                            loading="lazy"
                            decoding="async"
                            className="w-100 h-100 product-img"
                            style={{
                                objectFit: "scale-down",
                                objectPosition: "center",
                                padding: 8,
                            }}
                            onError={(e) => {
                                e.currentTarget.src = "/placeholder.png";
                            }}
                        />

                    </a>

                    {/* PROMOTION FRAME */}

                    {banners?.imageUrl && (
                        <img
                            src={API + banners.imageUrl}
                            alt="frame"
                            className="frame-overlay"
                        />
                    )}

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

                        {/* FINAL PRICE */}

                        <span className="text-danger fw-bold fs-5">
                            {fmtVND(price)}
                        </span>

                        {/* BASE PRICE */}

                        {basePrice > price && (
                            <div className="text-muted text-decoration-line-through small">
                                {fmtVND(basePrice)}
                            </div>
                        )}

                        <meta itemProp="priceCurrency" content="VND" />
                        <link itemProp="availability" href="https://schema.org/InStock" />

                    </div>

                </div>

            </article>

        </div>
    );
}

function areEqual(prev, next) {
    return (
        prev.p.productId === next.p.productId &&
        prev.p.price === next.p.price &&
        prev.p.basePrice === next.p.basePrice &&
        prev.banners?.imageUrl === next.banners?.imageUrl
    );
}

export default memo(ProductCard, areEqual);