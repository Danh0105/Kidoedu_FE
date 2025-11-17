import React, { useEffect, useState } from "react";
import axios from "axios";

const API_BASE = process.env.REACT_APP_API_URL;

export default function OrderManager() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);
    const [q, setQ] = useState(""); // search local

    // ===== Helpers =====
    const formatCurrency = (v) =>
        new Intl.NumberFormat("vi-VN").format(Number(v)) + " đ";

    const formatDate = (v) =>
        v ? new Date(v).toLocaleString("vi-VN") : "";

    const buildOrderCode = (o) =>
        `DH${String(o.orderId).padStart(4, "0")}`;

    const getCustomerName = (o) =>
        o.user?.fullName || o.user?.username || "Khách lẻ";

    // =========================== LOAD ORDERS ===========================
    const fetchOrders = async () => {
        try {
            setLoading(true);

            const res = await axios.get(`${API_BASE}/orders`);

            if (Array.isArray(res.data)) {
                setOrders(res.data);
            } else if (Array.isArray(res.data.data)) {
                setOrders(res.data.data);
            } else {
                setOrders([]);
            }
        } catch (err) {
            console.error("Lỗi tải đơn hàng:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    // =========================== DELETE ===========================
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

    // =========================== UPDATE STATUS ===========================
    const updateStatus = async (id, status) => {
        try {
            await axios.put(`${API_BASE}/orders/${id}/status`, { status });

            setOrders((prev) =>
                prev.map((o) =>
                    o.orderId === id ? { ...o, status } : o
                )
            );
        } catch (err) {
            console.error("Lỗi cập nhật trạng thái:", err);
            alert("Không cập nhật được trạng thái đơn hàng!");
        }
    };

    // =========================== SEARCH FILTER ===========================
    const filteredOrders = orders.filter((o) => {
        const key = q.trim().toLowerCase();
        if (!key) return true;

        return (
            buildOrderCode(o).toLowerCase().includes(key) ||
            getCustomerName(o).toLowerCase().includes(key)
        );
    });

    return (
        <div className="card shadow-sm">
            <div className="card-body">
                {/* Header */}
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h4 className="fw-bold">Quản lý đơn hàng</h4>

                    <div style={{ width: 260 }}>
                        <input
                            className="form-control"
                            placeholder="Tìm kiếm đơn hàng"
                            value={q}
                            onChange={(e) => setQ(e.target.value)}
                        />
                    </div>
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
                                        <td className="fw-semibold">{buildOrderCode(o)}</td>
                                        <td>{getCustomerName(o)}</td>
                                        <td>{o.user?.email || ""}</td>
                                        <td>{o.user?.address?.phone_number || ""}</td>
                                        <td>{formatDate(o.orderDate)}</td>

                                        <td>
                                            <select
                                                value={o.status}
                                                className="form-select form-select-sm"
                                                onChange={(e) =>
                                                    updateStatus(o.orderId, e.target.value)
                                                }
                                            >
                                                <option value="Pending">Pending</option>
                                                <option value="Confirmed">Confirmed</option>
                                                <option value="Shipping">Shipping</option>
                                                <option value="Completed">Completed</option>
                                                <option value="Cancelled">Cancelled</option>
                                            </select>
                                        </td>

                                        <td className="text-end fw-semibold">
                                            {formatCurrency(o.totalAmount)}
                                        </td>

                                        <td className="text-center">
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
            </div>
        </div>
    );
}
