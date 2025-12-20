import React from "react";

export default function VariantList({ variants, onEdit, onRemove }) {
    if (!variants.length) return null;

    return (
        <div className="card shadow-sm">
            <div className="card-header fw-bold bg-white">Danh sách biến thể</div>

            <div className="list-group list-group-flush">
                {variants.map(v => {
                    const base = v.prices?.find(p => p.priceType === "base")?.price;
                    const promo = v.prices?.find(p => p.priceType === "promo")?.price;

                    return (
                        <div key={v.id} className="list-group-item d-flex gap-3 align-items-center">

                            {/* Ảnh */}
                            <div className="border rounded" style={{ width: 60, height: 60, overflow: "hidden" }}>
                                {v.imageUrl ? (
                                    <img
                                        src={v.imageUrl.startsWith("blob:")
                                            ? v.imageUrl
                                            : process.env.REACT_APP_API_URL + v.imageUrl
                                        }
                                        className="w-100 h-100"
                                        alt=""
                                    />
                                ) : (
                                    <span className="text-muted small">No Img</span>
                                )}
                            </div>

                            {/* INFO */}
                            <div className="flex-grow-1">
                                <div className="fw-bold">{v.variantName}</div>

                                <div>
                                    <span className="text-primary fw-bold">
                                        {Number(base).toLocaleString()}đ
                                    </span>

                                    {promo && (
                                        <span className="text-muted ms-2 text-decoration-line-through">
                                            {Number(promo).toLocaleString()}đ
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* ACTIONS */}
                            <div className="d-flex flex-column gap-2">
                                <a className="btn btn-sm btn-outline-primary" onClick={() => onEdit(v)}>
                                    Sửa
                                </a>
                                <a className="btn btn-sm btn-outline-danger" onClick={() => onRemove(v.id)}>
                                    Xóa
                                </a>
                            </div>

                        </div>
                    );
                })}
            </div>
        </div>
    );
}
