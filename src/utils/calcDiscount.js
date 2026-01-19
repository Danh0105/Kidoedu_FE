const calcDiscount = (total, promo) => {
    if (!promo) return 0;

    if (promo.discountType === 'percentage') {
        return Math.floor((total * Number(promo.discountValue)) / 100);
    }

    if (promo.discountType === 'fixed_amount') {
        return Math.min(Number(promo.discountValue), total);
    }

    return 0;
};
export default calcDiscount;