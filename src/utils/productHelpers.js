// utils/productHelpers.js

export const toggleBitmask = (current, value) =>
    (current & value) !== 0 ? current & ~value : current | value;

export const ensureNumber = (v) => {
    const n = Number(v);
    return Number.isFinite(n) ? n : null;
};

export const extractPrices = (p) => {

    const prices = [];

    if (p[0].priceType === 'base') {
        prices.push({
            priceType: "base",
            price: Number(p[0].price)
        });
    }

    if (p[1]?.priceType === 'promo') {
        prices.push({
            priceType: "promo",
            price: Number(p[1]?.price),
            startAt: p[1]?.startAt || null,
            endAt: p[1]?.endAt || null
        });
    }

    return prices;
};

export const buildVariantsPayload = (variants = []) => {
    return variants.map(v => ({
        variantName: v.variantName?.trim(),
        sku: v.sku?.trim(),
        barcode: v.barcode?.trim(),
        status: v.status ?? 0,
        specs: v.specs ?? [],
        prices: extractPrices(v.prices),
        inventory: v.inventory ?? []
    }));
};  
