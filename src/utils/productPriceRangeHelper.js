export function buildProductPriceRange(variants = []) {
    if (!variants.length) return null;

    const now = new Date();

    const prices = variants.map((v) => {
        const list = v?.prices ?? [];

        const base = list.find(p => p.priceType === "base");
        const promo = list.find(p => {
            if (p.priceType !== "promo") return false;

            const start = p.startAt ? new Date(p.startAt) : null;
            const end = p.endAt ? new Date(p.endAt) : null;

            return (!start || start <= now) &&
                (!end || end >= now);
        });

        const basePrice = Number(base?.price || 0);
        const promoPrice = Number(promo?.price || 0);

        if (promo && promoPrice > 0 && promoPrice < basePrice) {
            return {
                final: promoPrice,
                base: basePrice,
                discount: Math.round(((basePrice - promoPrice) / basePrice) * 100)
            };
        }

        return {
            final: basePrice,
            base: basePrice,
            discount: 0
        };
    });

    const finals = prices.map(p => p.final).filter(Boolean);
    const bases = prices.map(p => p.base).filter(Boolean);
    const discounts = prices.map(p => p.discount);

    return {
        min: Math.min(...finals),
        max: Math.max(...finals),
        baseMin: Math.min(...bases),
        baseMax: Math.max(...bases),
        maxDiscount: Math.max(...discounts)
    };
}