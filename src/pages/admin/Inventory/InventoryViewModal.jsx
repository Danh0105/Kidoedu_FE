import React from "react";

export default function InventoryViewModal({ show, onClose, data }) {
    if (!show || !data) return null;
    console.log("InventoryModal show:", data);
    const formatMoney = (value) =>
        Number(value || 0).toLocaleString("vi-VN");

    const formatDate = (value) =>
        value ? new Date(value).toLocaleDateString("vi-VN") : "—";

    const total =
        data.items?.reduce(
            (sum, it) =>
                sum + Number(it.unitCost || 0) * Number(it.quantity || 0),
            0
        ) || 0;

    return (
        <div
            className="modal fade show"
            style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}
        >
            <div className="modal-dialog modal-lg modal-dialog-centered">
                <div className="modal-content">

                    {/* HEADER */}
                    <div className="modal-header">
                        <h5 className="modal-title">
                            Chi tiết phiếu: {data.receiptCode}
                        </h5>
                        <button
                            type="button"
                            className="btn-close"
                            onClick={onClose}
                        />
                    </div>

                    {/* BODY */}
                    <div className="modal-body">

                        {/* Thông tin chung */}
                        <div className="mb-2">
                            <strong>Ngày:</strong>{" "}
                            {formatDate(data.createdAt || data.receiptDate)}
                        </div>

                        <div className="mb-2">
                            <strong>Nhà cung cấp:</strong>{" "}
                            {data.supplier?.supplierName || "Kho nội bộ"}
                        </div>

                        {data.type && (
                            <div className="mb-2">
                                <strong>Loại phiếu:</strong>{" "}
                                <span
                                    className={
                                        data.type === "import"
                                            ? "badge bg-success"
                                            : "badge bg-danger"
                                    }
                                >
                                    {data.type === "import"
                                        ? "Nhập kho"
                                        : "Xuất kho"}
                                </span>
                            </div>
                        )}

                        <div className="mb-3">
                            <strong>Ghi chú:</strong>{" "}
                            {data.note || "—"}
                        </div>

                        <hr />

                        {/* Bảng sản phẩm */}
                        <h6 className="fw-bold">Danh sách sản phẩm</h6>

                        <div className="table-responsive">
                            <table className="table table-bordered table-hover table-sm mt-2">
                                <thead className="table-light">
                                    <tr>
                                        <th>Sản phẩm</th>
                                        <th className="text-center">Số lượng</th>
                                        <th className="text-end">Đơn giá</th>
                                        <th className="text-end">Thành tiền</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {data.items?.length ? (
                                        data.items.map((it, index) => (
                                            <tr key={index}>
                                                <td>
                                                    {it.variant?.product?.productName}{" "}
                                                    {it.variant?.variantName}
                                                </td>
                                                <td className="text-center">
                                                    {it.quantity}
                                                </td>
                                                <td className="text-end">
                                                    {formatMoney(it.unitCost)} đ
                                                </td>
                                                <td className="text-end">
                                                    {formatMoney(
                                                        Number(it.unitCost || 0) *
                                                        Number(it.quantity || 0)
                                                    )}{" "}
                                                    đ
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={4} className="text-center">
                                                Không có sản phẩm
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        <div className="text-end mt-3 fs-5">
                            <strong>Tổng tiền:</strong>{" "}
                            {formatMoney(total || data.totalAmount)} đ
                        </div>
                    </div>

                    {/* FOOTER */}
                    <div className="modal-footer">
                        <button
                            className="btn btn-secondary"
                            onClick={onClose}
                        >
                            Đóng
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
}