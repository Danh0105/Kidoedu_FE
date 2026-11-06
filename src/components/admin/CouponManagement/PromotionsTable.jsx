import React, { useEffect, useState } from "react";
import './PromotionsTable.css';
export default function PromotionsTable({
    data,
    onEdit,
    onApply,
    onDelete,
    onCreateVoucher,
}) {
    const [showDescModal, setShowDescModal] = useState(false);
    const [selectedDesc, setSelectedDesc] = useState("");
    const formatDiscount = (p) =>
        p.discountType === "percentage"
            ? `${p.discountValue}%`
            : `${Number(p.discountValue).toLocaleString()} ₫`;
    useEffect(() => {
        if (!showDescModal) return;

        const handleEsc = (e) => {
            if (e.key === "Escape") setShowDescModal(false);
        };

        document.addEventListener("keydown", handleEsc);
        document.body.style.overflow = "hidden";

        return () => {
            document.removeEventListener("keydown", handleEsc);
            document.body.style.overflow = "";
        };
    }, [showDescModal]);
    return (
        <>
            {/* Header actions */}


            <table className="table table-bordered table-hover align-middle">
                <thead className="table-light">
                    <tr>
                        <th>#</th>
                        <th>Khuyến mãi</th>
                        <th style={{ width: "300px" }}>Nội dung</th>
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

                            </td>
                            <td>
                                <div className="text-muted small limit-3-lines">
                                    {p.description}
                                </div>

                                {p.description?.length > 120 && (
                                    <button
                                        className="btn btn-link btn-sm p-0"
                                        onClick={() => {
                                            setSelectedDesc(p.description);
                                            setShowDescModal(true);
                                        }}
                                    >
                                        Xem thêm
                                    </button>
                                )}
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
                {showDescModal && (
                    <>
                        {/* Backdrop */}
                        <div
                            className="custom-backdrop"
                            onClick={() => setShowDescModal(false)}
                        />

                        {/* Modal */}
                        <div className="custom-modal-wrapper">
                            <div className="custom-modal">
                                <div className="custom-modal-header">
                                    <h5>Mô tả sản phẩm</h5>
                                    <button
                                        className="close-btn"
                                        onClick={() => setShowDescModal(false)}
                                    >
                                        ×
                                    </button>
                                </div>

                                <div className="custom-modal-body">
                                    <div
                                        dangerouslySetInnerHTML={{ __html: selectedDesc }}
                                    />
                                </div>

                                <div className="custom-modal-footer">
                                    <button
                                        className="btn btn-secondary"
                                        onClick={() => setShowDescModal(false)}
                                    >
                                        Đóng
                                    </button>
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </table >
        </>
    );
}
