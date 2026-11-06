import React, { useEffect, useState } from "react";
import axios from "axios";
import OrderDetailModal from "./OrderDetailModal";
import ExportSlipModal from "./ExportSlipModal";
import CreateOrderModal from "./CreateOrderModal";
import "../../../components/admin/css/statusSelect.css";
import { hasPermission } from "../../../utils/permission";
import { getAuthInfo } from "../../../utils/getAuthInfo";
import vietqr from '../../../assets/admin/vietqr.png';

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
const ROW_STATUS_CLASS = {
    Pending: "table-warning",
    Confirmed: "table-info",
    Shipping: "table-primary",
    Completed: "table-success",
    Cancelled: "table-danger",
};

/* ======================= Component ======================= */
export default function OrderManager() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);
    const [q, setQ] = useState(""); // search local
    const [showCreate, setShowCreate] = useState(false);
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(20);
    const [meta, setMeta] = useState({
        totalItems: 0,
        totalPages: 0,
        page: 1,
        limit: 20,
    });
    const [filters, setFilters] = useState({
        status: "",
        paymentStatus: "",
        fromDate: "",
        toDate: "",
        minTotal: "",
        maxTotal: "",
    });
    const [showCostModal, setShowCostModal] = useState(false);
    const [confirmOrder, setConfirmOrder] = useState(null);
    const [costItems, setCostItems] = useState([]);
    /* ======================= API ======================= */
    const fetchOrders = async () => {
        setLoading(true);
        try {
            const params = {
                page,
                limit,
                ...(filters.status && { status: filters.status }),
                ...(filters.paymentStatus && { payment_status: filters.paymentStatus }),
                ...(filters.fromDate && { from_date: filters.fromDate }),
                ...(filters.toDate && { to_date: filters.toDate }),
                ...(filters.minTotal !== "" && { min_total: Number(filters.minTotal) }),
                ...(filters.maxTotal !== "" && { max_total: Number(filters.maxTotal) }),
                ...(q.trim() && { q: q.trim() }),
            };
            const res = await axios.get(`${API_BASE}/orders`, { params });
            console.log("API RESPONSE:", res.data);
            setOrders(res?.data?.data || []);

            setMeta({
                totalItems: res?.data?.meta?.totalItems || 0,
                totalPages: res?.data?.meta?.totalPages || 0,
                page: res?.data?.meta?.page || 1,
                limit: res?.data?.meta?.limit || 20,
            });
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        const timeout = setTimeout(() => {
            fetchOrders();
        }, 400);

        return () => clearTimeout(timeout);
    }, [page, filters, q]);



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

        if (status === "Confirmed") {

            try {

                const res = await axios.get(`${API_BASE}/orders/${id}`);

                const order = res.data;

                const items = await Promise.all(
                    order.items.map(async (i) => {

                        const res = await axios.get(
                            `${API_BASE}/orders/batches/${i.variantId}`
                        );

                        return {
                            variantId: i.variantId,
                            quantity: i.quantity,
                            batches: res.data,
                            unitCost: res.data?.[0]?.unit_cost || 0,
                            batchId: res.data?.[0]?.batch_id || null,
                            productName: i.variant.product.productName,
                            variantName: i.variant.variantName
                        };
                    })
                );
                console.log("Order items for cost modal:", order);

                setCostItems(items);
                setConfirmOrder(order);
                setShowCostModal(true);

                return;

            } catch (err) {

                alert("Không tải được chi tiết đơn");

                return;
            }
        }

        try {

            const adminId = getAuthInfo();

            await axios.patch(`${API_BASE}/orders/${id}/status`, {
                status,
                adminId: adminId.role.id,
            });

            setOrders(prev =>
                prev.map(o =>
                    o.orderId === id ? { ...o, status } : o
                )
            );

        } catch (err) {

            alert(err.response?.data?.message || "Có lỗi xảy ra");

        }
    };
    const submitConfirmOrder = async () => {
        try {

            await axios.post(`${API_BASE}/orders/confirm/${confirmOrder.orderId}`, {
                items: costItems
            });

            setOrders(prev =>
                prev.map(o =>
                    o.orderId === confirmOrder.orderId
                        ? { ...o, status: "Confirmed" }
                        : o
                )
            );

            setShowCostModal(false);
            setConfirmOrder(null);

        } catch (err) {

            alert(err.response?.data?.message || "Xác nhận đơn thất bại");

        }
    };

    /* ======================= FILTER ======================= */




    /* ======================= Order Detail ======================= */
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [showModal, setShowModal] = useState(false);

    const openDetail = async (order) => {
        try {
            console.log(order);

            setSelectedOrder(order);
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
        vietqr: {
            label: "VietQR",
            icon: vietqr,
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
                    <button
                        className="btn btn-success"
                        onClick={() => setShowCreate(true)}
                    >
                        + Tạo đơn hàng
                    </button>

                    <div className="d-flex gap-2 align-items-center">
                        <input
                            className="form-control"
                            style={{ width: 260 }}
                            placeholder="Tìm kiếm đơn hàng"
                            value={q}
                            onChange={(e) => setQ(e.target.value)}
                        />



                        <select
                            className="form-select"
                            style={{ width: 200 }}
                            value={filters.paymentStatus}
                            onChange={(e) =>
                                setFilters(prev => ({ ...prev, paymentStatus: e.target.value }))
                            }
                        >
                            <option value="">Tất cả thanh toán</option>
                            <option value="Pending">Chờ thanh toán</option>
                            <option value="Paid">Đã thanh toán</option>
                            <option value="Failed">Thất bại</option>
                            <option value="Expired">Hết hạn</option>
                        </select>
                        <input
                            type="date"
                            className="form-control"
                            value={filters.fromDate}
                            onChange={(e) =>
                                setFilters(prev => ({ ...prev, fromDate: e.target.value }))
                            }
                        />

                        <input
                            type="date"
                            className="form-control"
                            value={filters.toDate}
                            onChange={(e) =>
                                setFilters(prev => ({ ...prev, toDate: e.target.value }))
                            }
                        />

                        <input
                            type="number"
                            className="form-control"
                            placeholder="Tổng tiền từ"
                            value={filters.minTotal}
                            onChange={(e) =>
                                setFilters(prev => ({ ...prev, minTotal: e.target.value }))
                            }
                        />

                        <input
                            type="number"
                            className="form-control"
                            placeholder="Tổng tiền đến"
                            value={filters.maxTotal}
                            onChange={(e) =>
                                setFilters(prev => ({ ...prev, maxTotal: e.target.value }))
                            }
                        />
                        <button
                            className="btn btn-outline-secondary"
                            onClick={() => {
                                setQ("");
                                setFilters({
                                    status: "",
                                    paymentStatus: "",
                                    fromDate: "",
                                    toDate: "",
                                    minTotal: "",
                                    maxTotal: "",
                                });
                            }}
                        >
                            Reset
                        </button>

                    </div>

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
                            {Array.from({ length: meta?.totalPages || 0 }).map((_, i) => (
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
                                <th>Discount</th>
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

                            {!loading && orders.length === 0 && (
                                <tr>
                                    <td colSpan={8} className="text-center py-4">
                                        Không có đơn hàng nào.
                                    </td>
                                </tr>
                            )}

                            {!loading &&
                                orders.map((o) => (
                                    <tr
                                        key={o.orderId}
                                        className={ROW_STATUS_CLASS[o.status] || ""}
                                    >

                                        <td>
                                            {o.user.customerType === "business" ? (
                                                <a
                                                    className="text-decoration-none fw-semibold text-danger"
                                                    onClick={() => openDetail(o)}
                                                >
                                                    {buildOrderCode(o.orderId)}
                                                </a>
                                            ) : (
                                                <button
                                                    className="btn btn-link p-0 fw-semibold"
                                                    onClick={() => openDetail(o)}
                                                    style={{ textDecoration: "none" }}
                                                >
                                                    {buildOrderCode(o.orderId)}
                                                </button>
                                            )}
                                        </td>


                                        <td>{getCustomerName(o)}</td>

                                        {/* 
                                        <td>{o.user?.email || ""}</td>
                                        <td>{o.shippingAddress?.phone_number || ""}</td>
                                        */}

                                        <td>{formatDate(o.orderDate)}</td>


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
                                        <td className="fw-semibold">
                                            {o.promotion?.discount_value != null ? (
                                                <span className="badge bg-success">
                                                    {o.promotion.name}
                                                </span>
                                            ) : (
                                                <span className="badge bg-secondary">No Discount</span>
                                            )}
                                        </td>

                                        <td className="text-end fw-semibold">
                                            {formatCurrency(o.subtotal)}
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
                            {Array.from({ length: meta?.totalPages || 0 }).map((_, i) => (
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
                {showCostModal && (

                    <div className="modal fade show" style={{ display: "block" }}>
                        <div className="modal-dialog modal-lg">
                            <div className="modal-content">

                                <div className="modal-header">
                                    <h5 className="modal-title">
                                        Chọn giá nhập để xác nhận đơn
                                    </h5>

                                    <button
                                        className="btn-close"
                                        onClick={() => setShowCostModal(false)}
                                    />
                                </div>

                                <div className="modal-body">

                                    <table className="table">
                                        <thead>
                                            <tr>
                                                <th>Sản phẩm</th>
                                                <th>Biến thể</th>
                                                <th>Số lượng</th>
                                                <th>Giá nhập</th>
                                            </tr>
                                        </thead>

                                        <tbody>

                                            {costItems.map((item, index) => (
                                                <tr key={index}>

                                                    <td>{item.productName}</td>

                                                    <td>{item.variantName}</td>

                                                    <td>{item.quantity}</td>

                                                    <td>

                                                        <select
                                                            className="form-select"
                                                            value={item.batchId}
                                                            onChange={(e) => {

                                                                const batchId = Number(e.target.value);
                                                                const batch = item.batches.find(b => b.batch_id === batchId);

                                                                setCostItems(prev => {
                                                                    const copy = [...prev];
                                                                    copy[index].batchId = batchId;
                                                                    copy[index].unitCost = batch.unit_cost;
                                                                    return copy;
                                                                });

                                                            }}
                                                        >
                                                            {item.batches.map(b => (
                                                                <option key={b.batch_id} value={b.batch_id}>
                                                                    {Number(b.unit_cost).toLocaleString("vi-VN")} đ
                                                                    (Tồn: {b.remaining_quantity})
                                                                </option>
                                                            ))}
                                                        </select>

                                                    </td>

                                                </tr>
                                            ))}

                                        </tbody>
                                    </table>

                                </div>

                                <div className="modal-footer">

                                    <button
                                        className="btn btn-secondary"
                                        onClick={() => setShowCostModal(false)}
                                    >
                                        Huỷ
                                    </button>

                                    <button
                                        className="btn btn-success"
                                        onClick={submitConfirmOrder}
                                    >
                                        Xác nhận đơn
                                    </button>

                                </div>

                            </div>
                        </div>
                    </div>

                )}
            </div >
        </div >
    );
}
