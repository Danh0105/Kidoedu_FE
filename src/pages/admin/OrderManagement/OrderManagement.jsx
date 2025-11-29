import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import OrderDetailModal from "./OrderDetailModal";
import ExportSlipModal from "./ExportSlipModal";
const API_BASE = process.env.REACT_APP_API_URL;

/* ======================= Helpers ======================= */
const formatCurrency = (v) =>
    `${new Intl.NumberFormat("vi-VN").format(Number(v))} đ`;

const formatDate = (v) =>
    v ? new Date(v).toLocaleString("vi-VN") : "";

const buildOrderCode = (id) =>
    `DH${String(id).padStart(4, "0")}`;

const getCustomerName = (o) =>
    o.user?.fullName || o.user?.username || "Khách lẻ";

/* ======================= Component ======================= */
export default function OrderManager() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);
    const [q, setQ] = useState(""); // search local

    /* ======================= API ======================= */
    const fetchOrders = async () => {
        setLoading(true);
        try {
            const res = await axios.get(`${API_BASE}/orders`);
            const list = Array.isArray(res.data)
                ? res.data
                : Array.isArray(res.data?.data)
                    ? res.data.data
                    : [];

            setOrders(list);
        } catch (err) {
            console.error("Lỗi tải đơn hàng:", err);
        } finally {
            setLoading(false);
        }
    };

    const deleteOrder = async (id) => {
        if (!window.confirm("Bạn chắc chắn muốn xóa đơn hàng này?")) return;

        try {
            await axios.delete(`${API_BASE}/orders/${id}`);
            setOrders((prev) => prev.filter((o) => o.orderId !== id));
        } catch (err) {
            console.error("Lỗi xoá đơn:", err);
            alert("Không thể xoá đơn hàng!");
        }
    };

    const updateStatus = async (id, status) => {
        try {
            await axios.put(`${API_BASE}/orders/${id}/status`, { status });
            setOrders((prev) =>
                prev.map((o) => (o.orderId === id ? { ...o, status } : o))
            );
        } catch (err) {
            console.error("Lỗi cập nhật trạng thái:", err);
            alert("Không cập nhật được trạng thái đơn hàng!");
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    /* ======================= FILTER ======================= */

    const filteredOrders = useMemo(() => {
        const key = q.trim().toLowerCase();
        if (!key) return orders;

        return orders.filter((o) =>
            buildOrderCode(o.orderId).toLowerCase().includes(key) ||
            getCustomerName(o).toLowerCase().includes(key)
        );
    }, [q, orders]);

    /* ======================= Order Detail ======================= */
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [showModal, setShowModal] = useState(false);

    const openDetail = async (orderId) => {
        try {
            const res = await axios.get(`${API_BASE}/orders/${orderId}`);
            setSelectedOrder(res.data);
            setShowModal(true);
        } catch (err) {
            console.error("Lỗi tải chi tiết đơn:", err);
            alert("Không thể tải chi tiết đơn hàng!");
        }
    };

    const closeDetail = () => {
        setShowModal(false);
        setSelectedOrder(null);
    };
    /* ======================= Export Slip ======================= */
    const [showExport, setShowExport] = useState(false);
    const [exportOrder, setExportOrder] = useState(null);

    const openExportSlip = async (orderId) => {
        try {
            const res = await axios.get(`${API_BASE}/orders/${orderId}`);
            setExportOrder(res.data);
            setShowExport(true);
        } catch (err) {
            console.error("Lỗi tải phiếu xuất kho:", err);
            alert("Không thể mở phiếu xuất kho!");
        }
    };

    const closeExportSlip = () => {
        setShowExport(false);
        setExportOrder(null);
    };

    /* ======================= RENDER ======================= */
    return (
        <div className="card shadow-sm">
            <div className="card-body">

                {/* Header */}
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h4 className="fw-bold">Quản lý đơn hàng</h4>

                    <input
                        className="form-control"
                        style={{ width: 260 }}
                        placeholder="Tìm kiếm đơn hàng"
                        value={q}
                        onChange={(e) => setQ(e.target.value)}
                    />
                </div>

                {/* Table */}
                <div className="table-responsive">
                    <table className="table align-middle table-hover">
                        <thead className="table-light">
                            <tr>
                                <th>Mã đơn</th>
                                <th>Khách hàng</th>
                                <th>Email</th>
                                <th>SĐT</th>
                                <th>Ngày đặt</th>
                                <th>Trạng thái</th>
                                <th className="text-end">Tổng tiền</th>
                                <th className="text-center">Thao tác</th>
                            </tr>
                        </thead>

                        <tbody>
                            {loading && (
                                <tr>
                                    <td colSpan={8} className="text-center py-4">
                                        Đang tải...
                                    </td>
                                </tr>
                            )}

                            {!loading && filteredOrders.length === 0 && (
                                <tr>
                                    <td colSpan={8} className="text-center py-4">
                                        Không có đơn hàng nào.
                                    </td>
                                </tr>
                            )}

                            {!loading &&
                                filteredOrders.map((o) => (
                                    <tr key={o.orderId}>
                                        <td>
                                            <button
                                                className="btn btn-link p-0 fw-semibold"
                                                onClick={() => openDetail(o.orderId)}
                                                style={{ textDecoration: "none" }}
                                            >
                                                {buildOrderCode(o.orderId)}
                                            </button>
                                        </td>


                                        <td>{getCustomerName(o)}</td>
                                        <td>{o.user?.email || ""}</td>
                                        <td>{o.shippingAddress?.phone_number || ""}</td>
                                        <td>{formatDate(o.orderDate)}</td>

                                        <td>
                                            <select
                                                value={o.status}
                                                className="form-select form-select-sm"
                                                onChange={(e) =>
                                                    updateStatus(o.orderId, e.target.value)
                                                }
                                            >
                                                {["Pending", "Confirmed", "Shipping",
                                                    "Completed", "Cancelled"].map((st) => (
                                                        <option key={st} value={st}>{st}</option>
                                                    ))}
                                            </select>
                                        </td>

                                        <td className="text-end fw-semibold">
                                            {formatCurrency(o.totalAmount)}
                                        </td>

                                        <td className="text-center">
                                            <button
                                                className="btn btn-sm btn-primary me-2"
                                                onClick={() => openExportSlip(o.orderId)}
                                            >
                                                Phiếu XK
                                            </button>

                                            <button
                                                className="btn btn-sm btn-outline-danger"
                                                onClick={() => deleteOrder(o.orderId)}
                                            >
                                                Xoá
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                        </tbody>
                    </table>
                </div>
                <OrderDetailModal
                    show={showModal}
                    onClose={closeDetail}
                    order={selectedOrder}
                />
                <ExportSlipModal
                    show={showExport}
                    onClose={closeExportSlip}
                    order={exportOrder}
                />

            </div>
        </div>
    );
}
