import React from "react";

export default function VariantPriceModal({
    show,
    prices = [],
    onSelect,
    onClose
}) {

    if (!show) return null;

    const uniquePrices = [
        ...new Set(
            prices
                .filter(p => p.type === "import")
                .map(p => p.unitCost)
        )
    ];

    return (
        <div
            className="modal fade show"
            style={{ display: "block", background: "rgba(0,0,0,0.4)" }}
        >
            <div className="modal-dialog">
                <div className="modal-content">

                    <div className="modal-header">
                        <h5 className="modal-title">
                            Chọn giá nhập
                        </h5>
                        <button className="btn-close" onClick={onClose} />
                    </div>

                    <div className="modal-body">

                        {uniquePrices.length === 0 && (
                            <div className="text-muted">
                                Chưa có lịch sử giá
                            </div>
                        )}

                        {uniquePrices.map((price, i) => (
                            <button
                                key={i}
                                className="btn btn-outline-primary w-100 mb-2"
                                onClick={() => onSelect(price)}
                            >
                                {price.toLocaleString()} đ
                            </button>
                        ))}

                        <hr />

                        <button
                            className="btn btn-success w-100"
                            onClick={() => onSelect(0)}
                        >
                            Nhập giá mới
                        </button>

                    </div>

                </div>
            </div>
        </div>
    );
}