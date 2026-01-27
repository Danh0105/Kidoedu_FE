import { useMemo } from "react";
import { pickPricesFromVariant } from "../../../utils/productBuyHelper";
import { pickRibbonsFromStatus } from "../../../utils/pickRibbonsFromStatus";

export default function ProductCard({ p, banners }) {

    const ribbons = (pickRibbonsFromStatus?.(p?.status) || []).slice(0, 3);
    const imgSrc = p.images?.find(img => img.isPrimary)?.imageUrl ??
        p.images?.[0]?.imageUrl

    const fmtVND = (n) =>
        Number(n || 0).toLocaleString("vi-VN", {
            style: "currency",
            currency: "VND",
        });
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

    // lưu giá trị khi xem một sản phẩm 
    const saveViewedProduct = (product) => {
    const key = "viewed_products";
    const maxItems = 8;

    let viewed = JSON.parse(localStorage.getItem(key)) || [];
    viewed = viewed.filter(item => item.productId !== product.productId);
    viewed.unshift({
        productId: product.productId,
        productName: product.productName,
        images: product.images,
        price: product.price,
        priceRange: product.priceRange,
        variants: product.variants,
        status: product.status,
    });

    
    if (viewed.length > maxItems) viewed = viewed.slice(0, maxItems);

    localStorage.setItem(key, JSON.stringify(viewed));
};

//end


    return (
        <div className="col-12 col-sm-6 col-md-4 col-lg-3 mb-4 d-flex">
            <article
                className="card product-card shadow-sm border-0 rounded-4 overflow-hidden w-100 h-100"
                itemScope
                itemType="https://schema.org/Product"
            >
                <div className="product-frame">

                    {/* Badge */}
                    {ribbons.map((rb, i) => (
                        <span
                            key={i}
                            className={`badge position-absolute ribbon ${rb.className || "text-bg-warning"}`}
                            data-pos={rb.position || "tl"}
                        >
                            {rb.text}
                        </span>
                    ))}

                    {showDiscountBadge && (
                        <span
                            className="badge position-absolute ribbon text-bg-danger"
                            data-pos="tr"
                        >
                            -{discountPercent}%
                        </span>
                    )}

                    {/* Ảnh sản phẩm */}
                    <a
                        href={`/productdetail/${p.productId}`}
                        aria-label={p?.productName}
                        className="product-image-wrapper"
                        onClick={() => saveViewedProduct(p)}
                    >
                        <img
                            src={process.env.REACT_APP_API_URL + imgSrc}
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
                                if (e.currentTarget.src.endsWith("/placeholder.png")) return;
                                e.currentTarget.src = "/placeholder.png";
                            }}
                        />

                    </a>

                    {/* KHUNG */}
                    <img
                        src={`${process.env.REACT_APP_API_URL}${banners?.imageUrl}`}
                        alt="frame"
                        className="frame-overlay"
                    />

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