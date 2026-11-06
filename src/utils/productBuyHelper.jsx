
export function pickPricesFromVariant(variant) {
    if (!variant) {
        return { basePrice: null, promoPrice: null, finalPrice: null };
    }

    if (!Array.isArray(variant?.prices)) {
        const price = Number(variant.currentPrice || 0);
        return {
            basePrice: price,
            promoPrice: null,
            finalPrice: price,
        };
    }

    const now = new Date();
    const prices = variant.prices;

    const base = prices.find((p) => p.priceType === "base");

    const promo = prices.find((p) => {
        if (p.priceType !== "promo") return false;

        const start = p.startAt ? new Date(p.startAt) : null;
        const end = p.endAt ? new Date(p.endAt) : null;

        return (!start || start <= now) && (!end || end >= now);
    });

    const basePrice = base ? Number(base.price) : null;

    let promoPrice = null;

    if (
        promo &&
        Number(promo.price) > 0 &&
        basePrice &&
        Number(promo.price) < basePrice
    ) {
        promoPrice = Number(promo.price);
    }

    const finalPrice = promoPrice ?? basePrice ?? null;

    return { basePrice, promoPrice, finalPrice };
}

export function makeCheckoutProduct({
    product,
    variant,
    quantity,
    selectedAttr,
}) {
    const { basePrice, promoPrice, finalPrice } =
        pickPricesFromVariant(variant);

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
        promotion: product?.promotionApplicabilities ?? [],
    };
}
