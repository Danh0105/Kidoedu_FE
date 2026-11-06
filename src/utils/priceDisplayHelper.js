export function buildDisplayPrice({
    basePrice,
    promoPrice,
    quantity = 1,
}) {
    const safeBase = Number(basePrice || 0);
    const safePromo =
        promoPrice != null ? Number(promoPrice) : null;

    const hasPromo =
        safePromo != null && safeBase > safePromo;

    const unitPrice = hasPromo ? safePromo : safeBase;

    const totalPrice = unitPrice * quantity;

    const discountPercent = hasPromo
        ? Math.round(((safeBase - safePromo) / safeBase) * 100)
        : 0;

    return {
        unitPrice,
        basePrice: safeBase,
        promoPrice: safePromo,
        totalPrice,
        hasPromo,
        discountPercent,
    };
}