import React from "react";
import VariantImage from "./VariantImage";
import GenerateSKU from "../../../../utils/GenerateSKU";
function toDatetimeLocal(value) {
    if (!value) return "";

    const d = new Date(value);

    const pad = (n) => String(n).padStart(2, "0");

    return (
        d.getFullYear() +
        "-" +
        pad(d.getMonth() + 1) +
        "-" +
        pad(d.getDate()) +
        "T" +
        pad(d.getHours()) +
        ":" +
        pad(d.getMinutes())
    );
}

export default function VariantEditorFields({ variant, update }) {
    console.log();

    const updatePrice = (priceType, value) => {
        const prices = Array.isArray(variant.prices) ? [...variant.prices] : [];

        const idx = prices.findIndex(p => p.priceType === priceType);

        if (idx >= 0) {
            prices[idx] = { ...prices[idx], price: value };
        } else {
            prices.push({ priceType, price: value });
        }

        update({ prices });
    };
    const updatePromoTime = (field, value) => {
        const prices = [...(variant.prices || [])];
        const idx = prices.findIndex(p => p.priceType === "promo");

        if (idx < 0) return;

        prices[idx] = {
            ...prices[idx],
            [field]: value
        };

        update({ prices });
    };

    return (
        <div className="row g-3">

            {/* Tên biến thể */}
            <div className="col-md-6">
                <label className="form-label fw-bold small">Tên biến thể *</label>
                <input
                    className="form-control"
                    value={variant.variantName || ""}
                    onChange={(e) => update({ variantName: e.target.value })}
                />
            </div>

            {/* SKU */}
            <div className="col-md-8">
                <label className="form-label fw-bold small">SKU</label>
                <div className="d-flex gap-2">
                    <input
                        className="form-control"
                        value={variant.sku || ""}
                        onChange={(e) => update({ sku: e.target.value })}
                    />
                    <a
                        className="btn btn-sm btn-outline-primary d-flex align-items-center justify-content-center"
                        style={{ width: "78px" }}
                        onClick={() =>
                            update({ sku: GenerateSKU(variant.variantName || "") })
                        }
                    >
                        Tạo mã
                    </a>

                </div>
            </div>

            {/* Barcode */}
            <div className="col-md-4">
                <label className="form-label fw-bold small">Barcode</label>
                <input
                    className="form-control"
                    value={variant.barcode || ""}
                    onChange={(e) => update({ barcode: e.target.value })}
                />
            </div>

            {/* Base price */}
            <div className="col-12">
                <label className="form-label fw-bold small">Giá bán *</label>
                <input
                    type="number"
                    className="form-control"
                    value={
                        Number(variant?.prices?.find(p => p.priceType === "base")?.price) ?? ""
                    }
                    onChange={(e) => updatePrice("base", Number(e.target.value))}
                />

            </div>

            {/* Promo price */}
            <div className="col-12">
                <label className="form-label fw-bold small">Giá khuyến mãi</label>
                <input
                    type="number"
                    className="form-control"
                    value={
                        Number(variant?.prices?.find(p => p.priceType === "promo")?.price) ?? ""
                    }
                    onChange={(e) => updatePrice("promo", Number(e.target.value))}
                />

                <div className="row mt-2">
                    <div className="col-md-6">
                        <div className=" input-group">
                            <span className="input-group-text bg-white small">Bắt đầu</span>
                            <input
                                type="datetime-local"
                                className="form-control"
                                value={toDatetimeLocal(
                                    variant?.prices?.find(p => p.priceType === "promo")?.startAt
                                )}
                                onChange={(e) => updatePromoTime("startAt", e.target.value)}
                            />


                        </div>
                    </div>
                    <div className="col-md-6">
                        <div className=" input-group">
                            <span className="input-group-text bg-white small">Kết thúc</span>
                            <input
                                type="datetime-local"
                                className="form-control"
                                value={toDatetimeLocal(
                                    variant?.prices?.find(p => p.priceType === "promo")?.endAt
                                )}
                                onChange={(e) => updatePromoTime("endAt", e.target.value)}
                            />


                        </div>
                    </div>

                </div>
            </div>

            <VariantImage variant={variant} update={update} />
        </div>
    );
}
