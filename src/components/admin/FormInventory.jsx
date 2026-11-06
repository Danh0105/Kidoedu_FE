import React, { useEffect } from "react";

export default function FormInventory({ productId, variants = [] }) {
    const modalId = `inventoryModal-${productId}`;
    const modalLabel = `inventoryModalLabel-${productId}`;

    useEffect(() => {
        import("bootstrap/dist/js/bootstrap.bundle.min.js");
    }, []);

    return (
        <>
            {/* Nút mở popup */}
            <button
                type="button"
                className="btn btn-outline-primary btn-sm"
                data-bs-toggle="modal"
                data-bs-target={`#${modalId}`}
            >
                Xem
            </button>

            {/* Modal Bootstrap */}
            <div
                className="modal fade"
                id={modalId}
                tabIndex="-1"
                aria-labelledby={modalLabel}
                aria-hidden="true"
            >
                <div className="modal-dialog modal-lg">
                    <div className="modal-content">

                        <div className="modal-header">
                            <h5 className="modal-title" id={modalLabel}>
                                Tồn kho – Product #{productId}
                            </h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
                        </div>

                        <div className="modal-body">

                            {variants.length === 0 ? (
                                <p className="text-center">Không có biến thể</p>
                            ) : (
                                <table className="table table-bordered">
                                    <thead className="table-light">
                                        <tr>
                                            <th>Tên biến thể</th>
                                            <th>SKU</th>
                                            <th>Tồn kho</th>
                                            <th>Tồn tối thiểu</th>
                                            <th>Trạng thái</th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {variants.map(v => {
                                            const inv = v.inventory;

                                            let status = "Không có dữ liệu";
                                            let statusClass = "text-secondary";

                                            if (inv) {
                                                if (inv.stock_quantity === 0) {
                                                    status = "Hết hàng";
                                                    statusClass = "text-danger fw-bold";
                                                } else if (inv.stock_quantity < inv.safety_stock) {
                                                    status = "Dưới mức an toàn";
                                                    statusClass = "text-warning fw-bold";
                                                } else {
                                                    status = "Còn hàng";
                                                    statusClass = "text-success fw-bold";
                                                }
                                            }

                                            return (
                                                <tr key={v.variantId}>
                                                    <td>{v.variantName}</td>
                                                    <td>{v.sku}</td>
                                                    <td>{inv?.stock_quantity ?? "-"}</td>
                                                    <td>{inv?.safety_stock ?? "-"}</td>
                                                    <td className={statusClass}>{status}</td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            )}

                        </div>

                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">
                                Đóng
                            </button>
                        </div>

                    </div>
                </div>
            </div>
        </>
    );
}
