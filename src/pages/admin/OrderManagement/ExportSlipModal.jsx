export default function ExportSlipModal({ show, onClose, order }) {
    if (!show || !order) return null;

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="modal fade show" style={{ display: "block" }}>
            <div className="modal-dialog modal-lg">
                <div className="modal-content">

                    <style>
                        {`
                        @media print {
                            body * {
                                visibility: hidden;
                            }
                            #print-area, #print-area * {
                                visibility: visible;
                            }
                            #print-area {
                                position: absolute;
                                inset: 0;
                                width: 100%;
                            }
                        }
                        `}
                    </style>

                    {/* ======= VÙNG IN ======= */}
                    <div id="print-area">
                        <div className="modal-header">
                            <h5 className="modal-title">
                                Phiếu Xuất Kho – DH{String(order.orderId).padStart(4, "0")}
                            </h5>
                        </div>

                        <div className="modal-body">
                            <p><strong>Khách hàng:</strong> {order.shippingAddress?.full_name}</p>
                            <p><strong>SĐT:</strong>{order.shippingAddress?.phone_number}</p>
                            <p><strong>Địa chỉ:</strong>{order.shippingAddress?.street} {order.shippingAddress?.ward} {order.shippingAddress?.district} {order.shippingAddress?.city}</p>

                            <hr />

                            <table className="table table-bordered">
                                <thead className="table-light">
                                    <tr>
                                        <th>Sản phẩm</th>
                                        <th className="text-center">SL</th>
                                        <th className="text-end">Giá</th>
                                        <th className="text-end">Thành tiền</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {order.items?.map((item, i) => (
                                        <tr key={i}>
                                            <td>{item.variant?.product?.productName} {item.variant?.variantName}</td>
                                            <td className="text-center">{item.quantity}</td>
                                            <td className="text-end">
                                                {(item.pricePerUnit).toLocaleString("vi-VN")} đ
                                            </td>
                                            <td className="text-end">
                                                {(item.pricePerUnit * item.quantity).toLocaleString("vi-VN")} đ
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>

                            <h5 className="text-end mt-3">
                                Tổng cộng:
                                <span className="fw-bold text-danger">
                                    {(order.totalAmount ?? 0).toLocaleString("vi-VN")} đ
                                </span>
                            </h5>
                        </div>
                    </div>

                    {/* ======= FOOTER KHÔNG IN ======= */}
                    <div className="modal-footer d-print-none">
                        <button className="btn btn-secondary" onClick={onClose}>
                            Đóng
                        </button>
                        <button className="btn btn-success" onClick={handlePrint}>
                            In Phiếu
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
}
