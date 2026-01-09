import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import OrderDetailModal from "./OrderDetailModal";
import ExportSlipModal from "./ExportSlipModal";
import CreateOrderModal from "./CreateOrderModal";
import "../../../components/admin/css/statusSelect.css";
import { hasPermission } from "../../../utils/permission";
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
    const [showCreate, setShowCreate] = useState(false);
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(20);
    const [meta, setMeta] = useState({ totalItems: 0, totalPages: 0 });
    /* ======================= API ======================= */
    const fetchOrders = async () => {
        setLoading(true);
        try {
            const res = await axios.get(
                `${API_BASE}/orders?page=${page}&limit=${limit}`
            );

            setOrders(res.data.data);
            setMeta(res.data.meta);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, [page]);



    const deleteOrder = async (id) => {
        if (!window.confirm("Bạn chắc chắn muốn xóa đơn hàng này?")) return;

        try {
            await axios.delete(`${API_BASE}/orders/${id}`);
            setOrders((prev) => prev.filter((o) => o.orderId !== id));
        } catch (err) {
            console.error("Lỗi xoá đơn:", err);
            alert(err.response?.data.message);
        }
    };

    const updateStatus = async (id, status) => {
        try {
            await axios.patch(`${API_BASE}/orders/${id}/status`, { status });
            setOrders((prev) =>
                prev.map((o) => (o.orderId === id ? { ...o, status } : o))
            );
        } catch (err) {
            console.error(err.response?.data);
            alert(err.response?.data.message);
        }
    };


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
    const PAYMENT_STATUS_MAP = {
        Pending: { label: "Chờ thanh toán", color: "warning" },
        Paid: { label: "Đã thanh toán", color: "success" },
        Failed: { label: "Thanh toán thất bại", color: "danger" },
        Cancelled: { label: "Đã hủy", color: "secondary" },
        Expired: { label: "Hết hạn", color: "dark" },
    };
    const PAYMENT_METHOD_MAP = {
        momo: {
            label: "MoMo",
            icon: "https://homepage.momocdn.net/fileuploads/svg/momo-file-240411162904.svg",
        },
        vnpay: {
            label: "VNPay",
            icon: "https://stcd02206177151.cloud.edgevnpay.vn/assets/images/logo-icon/logo-primary.svg",
        },
        cod: {
            label: "COD",
            icon: "https://cdn-icons-png.flaticon.com/512/1041/1041872.png",
        },
    };

    /* ======================= RENDER ======================= */
    return (
        <div className="card shadow-sm">
            <div className="card-body">

                {/* Header */}
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h4 className="fw-bold">Quản lý đơn hàng</h4>
                    <button
                        className="btn btn-success"
                        onClick={() => setShowCreate(true)}
                    >
                        + Tạo đơn hàng
                    </button>
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
                    <nav aria-label="Page navigation example">
                        <ul className="pagination justify-content-end">

                            {/* Previous */}
                            <li className={`page-item ${page === 1 ? "disabled" : ""}`}>
                                <button
                                    className="page-link"
                                    onClick={() => setPage(p => Math.max(1, p - 1))}
                                >
                                    Previous
                                </button>
                            </li>

                            {/* Page numbers */}
                            {Array.from({ length: meta.totalPages }).map((_, i) => (
                                <li
                                    key={i}
                                    className={`page-item ${page === i + 1 ? "active" : ""}`}
                                >
                                    <button
                                        className="page-link"
                                        onClick={() => setPage(i + 1)}
                                    >
                                        {i + 1}
                                    </button>
                                </li>
                            ))}

                            {/* Next */}
                            <li className={`page-item ${page === meta.totalPages ? "disabled" : ""}`}>
                                <button
                                    className="page-link"
                                    onClick={() =>
                                        setPage(p => Math.min(meta.totalPages, p + 1))
                                    }
                                >
                                    Next
                                </button>
                            </li>

                        </ul>
                    </nav>

                    <table className="table align-middle table-hover">
                        <thead className="table-light">
                            <tr>
                                <th>Mã đơn</th>
                                <th>Khách hàng</th>
                                {/* <th>Email</th>
                                <th>SĐT</th> */}
                                <th>Ngày đặt</th>
                                <th>Trạng thái</th>
                                <th>Payment Method</th>
                                <th>Payment Status</th>
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
                                        {/*                                         <td>{o.user?.email || ""}</td>
                                        <td>{o.shippingAddress?.phone_number || ""}</td>
 */}                                        <td>{formatDate(o.orderDate)}</td>

                                        <td>
                                            {hasPermission(["order.update"]) ? (
                                                <select
                                                    className="form-select status-select"
                                                    value={o.status}
                                                    onChange={(e) => updateStatus(o.orderId, e.target.value)}
                                                >
                                                    <option value="Pending" className="opt-pending">Pending</option>
                                                    <option value="Confirmed" className="opt-confirmed">Confirmed</option>
                                                    <option value="Shipping" className="opt-shipping">Shipping</option>
                                                    <option value="Completed" className="opt-completed">Completed</option>
                                                    <option value="Cancelled" className="opt-cancelled">Cancelled</option>
                                                </select>
                                            ) : (
                                                <span>{o.status}</span>
                                            )}
                                        </td>

                                        <td className="text-start fw-semibold align-middle">
                                            <div className="d-flex align-items-center gap-2">
                                                {PAYMENT_METHOD_MAP[o.paymentMethod]?.icon && (
                                                    <img
                                                        src={PAYMENT_METHOD_MAP[o.paymentMethod].icon}
                                                        alt={o.paymentMethod}
                                                        style={{ width: 24, height: 24, objectFit: "contain" }}
                                                    />
                                                )}
                                                <span>
                                                    {PAYMENT_METHOD_MAP[o.paymentMethod]?.label || "Không xác định"}
                                                </span>
                                            </div>
                                        </td>


                                        <td className="text-start fw-semibold ">
                                            <span className={`align-middle badge bg-${PAYMENT_STATUS_MAP[o.paymentStatus]?.color || "dark"}`}>
                                                {PAYMENT_STATUS_MAP[o.paymentStatus]?.label || "Không xác định"}
                                            </span>
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

                                            {hasPermission(["order.delete"]) && (
                                                <button
                                                    className="btn btn-sm btn-danger"
                                                    onClick={() => deleteOrder(o.orderId)}
                                                >
                                                    Xoá
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                        </tbody>
                    </table>
                    {/* Pagination */}

                    <nav aria-label="Page navigation example">
                        <ul className="pagination justify-content-end">

                            {/* Previous */}
                            <li className={`page-item ${page === 1 ? "disabled" : ""}`}>
                                <button
                                    className="page-link"
                                    onClick={() => setPage(p => Math.max(1, p - 1))}
                                >
                                    Previous
                                </button>
                            </li>

                            {/* Page numbers */}
                            {Array.from({ length: meta.totalPages }).map((_, i) => (
                                <li
                                    key={i}
                                    className={`page-item ${page === i + 1 ? "active" : ""}`}
                                >
                                    <button
                                        className="page-link"
                                        onClick={() => setPage(i + 1)}
                                    >
                                        {i + 1}
                                    </button>
                                </li>
                            ))}

                            {/* Next */}
                            <li className={`page-item ${page === meta.totalPages ? "disabled" : ""}`}>
                                <button
                                    className="page-link"
                                    onClick={() =>
                                        setPage(p => Math.min(meta.totalPages, p + 1))
                                    }
                                >
                                    Next
                                </button>
                            </li>

                        </ul>
                    </nav>

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
                <CreateOrderModal
                    show={showCreate}
                    onClose={() => setShowCreate(false)}
                    onCreated={(newOrder) => {
                        setOrders((prev) => [newOrder, ...prev]);
                    }}
                />

            </div>
        </div>
    );
}
