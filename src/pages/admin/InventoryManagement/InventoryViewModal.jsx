import React from "react";

export default function InventoryViewModal({ show, onClose, data }) {
    if (!show || !data) return null;

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
                        <button type="button" className="btn-close" onClick={onClose}></button>
                    </div>

                    {/* BODY */}
                    <div className="modal-body">

                        {/* Thông tin chung */}
                        <div className="mb-2">
                            <strong>Ngày:</strong>{" "}
                            {new Date(data.receiptDate).toLocaleDateString("vi-VN")}
                        </div>

                        <div className="mb-2">
                            <strong>Nhà cung cấp:</strong>{" "}
                            {data.supplier?.supplierName || "—"}
                        </div>

                        <div className="mb-3">
                            <strong>Ghi chú:</strong> {data.note || "—"}
                        </div>

                        <hr />

                        {/* Bảng sản phẩm */}
                        <h6 className="fw-bold">Danh sách sản phẩm</h6>

                        <div className="table-responsive">
                            <table className="table table-bordered table-hover table-sm mt-2">
                                <thead className="table-light">
                                    <tr>
                                        <th>Mã biến thể</th>
                                        <th>Số lượng</th>
                                        <th>Đơn giá</th>
                                        <th>Thành tiền</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {data.items?.map((it) => (
                                        <tr key={it.itemId}>
                                            <td>{it.variantId}</td>
                                            <td>{it.quantity}</td>
                                            <td>{Number(it.unitCost).toLocaleString("vi-VN")} đ</td>
                                            <td>{Number(it.lineTotal).toLocaleString("vi-VN")} đ</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <div className="text-end mt-3">
                            <strong>Tổng tiền:</strong>{" "}
                            {Number(data.totalAmount).toLocaleString("vi-VN")} đ
                        </div>

                    </div>

                    {/* FOOTER */}
                    <div className="modal-footer">
                        <button className="btn btn-secondary" onClick={onClose}>
                            Đóng
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
}
