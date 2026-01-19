import React from "react";

export default function PromotionsTable({
    data,
    onEdit,
    onApply,
    onDelete,
    onCreateVoucher,
}) {
    const formatDiscount = (p) =>
        p.discountType === "percentage"
            ? `${p.discountValue}%`
            : `${Number(p.discountValue).toLocaleString()} ₫`;

    return (
        <>
            {/* Header actions */}


            <table className="table table-bordered table-hover align-middle">
                <thead className="table-light">
                    <tr>
                        <th>#</th>
                        <th>Khuyến mãi</th>
                        <th>Giảm</th>
                        <th>Voucher</th>
                        <th>Thời gian</th>
                        <th>Trạng thái</th>
                        <th>Hành động</th>
                    </tr>
                </thead>

                <tbody>
                    {data.map((p, i) => (
                        <tr key={p.id}>
                            <td>{i + 1}</td>

                            <td>
                                <b>{p.name}</b>
                                <div className="text-muted small">{p.description}</div>
                            </td>

                            <td>{formatDiscount(p)}</td>

                            {/* Voucher info */}
                            <td>
                                {p.isVoucher ? (
                                    <>
                                        <span className="badge bg-secondary me-1">
                                            {p.code}
                                        </span>
                                        <div className="small text-muted">
                                            Đã dùng: {p.usedCount}/{p.usageLimit ?? '∞'}
                                        </div>
                                    </>
                                ) : (
                                    <span className="text-muted fst-italic">
                                        Chưa tạo
                                    </span>
                                )}
                            </td>


                            <td>
                                {new Date(p.startDate).toLocaleDateString()} →{" "}
                                {new Date(p.endDate).toLocaleDateString()}
                            </td>

                            <td>
                                {p.isActive ? (
                                    <span className="badge bg-success">Hoạt động</span>
                                ) : (
                                    <span className="badge bg-danger">Ngừng</span>
                                )}
                            </td>

                            <td >
                                <div className="d-flex justify-content-center align-items-center mb-1">
                                    <button
                                        className="btn btn-sm btn-success"
                                        disabled={p.isVoucher}
                                        onClick={() => onCreateVoucher(p)}
                                    >
                                        + Tạo voucher
                                    </button>

                                </div>
                                <div className="d-flex justify-content-center align-items-center">


                                    <button
                                        className="btn btn-sm btn-primary me-1"
                                        onClick={() => onEdit?.(p)}
                                    >
                                        Sửa
                                    </button>

                                    <button
                                        className="btn btn-sm btn-warning me-1"
                                        onClick={() => onApply?.(p)}
                                    >
                                        Phạm vi
                                    </button>
                                    <button
                                        className="btn btn-sm btn-outline-danger"
                                        onClick={() => onDelete?.(p.id)}
                                    >
                                        Xoá
                                    </button>
                                </div>

                            </td>
                        </tr>
                    ))}
                </tbody>
            </table >
        </>
    );
}
