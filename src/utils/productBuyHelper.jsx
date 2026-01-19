
export function pickPricesFromVariant(variant) {
    if (!variant) {
        return { basePrice: null, promoPrice: null, finalPrice: null };
    }

    // Không có price list → fallback currentPrice
    if (!Array.isArray(variant?.prices)) {
        const price = Number(variant.currentPrice || 0);
        return {
            basePrice: price,
            promoPrice: null,
            finalPrice: price,
        };
    }

    // Lấy giá từ mảng
    const promo = variant?.prices.find((p) => p.priceType === "promo");
    const base = variant?.prices.find((p) => p.priceType === "base");

    const basePrice = base ? Number(base.price) : null;
    const promoPrice = promo ? Number(promo.price) : null;
    const finalPrice = promoPrice ?? basePrice ?? null;

    return { basePrice, promoPrice, finalPrice };
}

/** Chuẩn hoá sản phẩm để đưa sang Checkout */
export function makeCheckoutProduct({
    product,
    variant,
    quantity,
    selectedAttr,
}) {
    const { basePrice, promoPrice, finalPrice } = pickPricesFromVariant(variant);

    const img =
        variant?.imageUrl ||
        product?.images?.find((i) => i.isPrimary)?.imageUrl ||
        "/placeholder.png";

    return {
        data: product,
        quantity,
        variantId: variant?.variantId ?? null,
        imageUrl: img,
        variantName: variant?.variantName,
        productName: product?.productName,
        attributes: variant?.attributes || {},
        productId: product?.productId,
        selected: false,
        variant,
        selectedAttr,
        pricing: finalPrice,
        basePrice,
        promoPrice,
        promotion: product.promotionApplicabilities
    };
}
