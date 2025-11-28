
export function pickPricesFromVariant(variant) {
    if (!variant) {
        return { basePrice: null, promoPrice: null, finalPrice: 0 };
    }

    if (!Array.isArray(variant.prices)) {
        const cur = typeof variant.currentPrice === "number" ? variant.currentPrice : 0;
        return {
            basePrice: cur || null,
            promoPrice: null,
            finalPrice: cur || 0,
        };
    }

    let baseRecord = null;
    let promoRecord = null;

    variant.prices.forEach((p) => {
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

    return {
        basePrice,
        promoPrice,
        finalPrice: promoPrice ?? basePrice ?? 0,
    };
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
    };
}
