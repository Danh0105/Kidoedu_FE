import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import InventoryModal from "./InventoryModal";
import InventoryViewModal from "./InventoryViewModal";

const API_BASE = process.env.REACT_APP_API_URL;

export default function InventoryManager() {
    const [list, setList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState("");
    const [viewModal, setViewModal] = useState(false);

    const [showModal, setShowModal] = useState(false);
    const [selectedReceipt, setSelectedReceipt] = useState(null);

    /* ======================= FETCH LIST ======================= */
    const fetchList = async () => {
        setLoading(true);

        try {
            const res = await axios.get(`${API_BASE}/inventory`);
            const raw = Array.isArray(res.data) ? res.data : res.data?.data || [];

            const formatted = raw.map((r) => ({
                receiptId: r.receiptId,
                receiptCode: r.receiptCode,
                receiptDate: r.receiptDate,
                supplierId: r.supplierId,
                referenceNo: r.referenceNo,
                note: r.note,
                totalAmount: r.totalAmount,
                createdAt: r.createdAt,
                updatedAt: r.updatedAt,
                supplier: r.supplier || null,
                items: r.items || []     // 👈 QUAN TRỌNG — Lấy items luôn
            }));

            setList(formatted);
        } catch (err) {
            console.error("Lỗi tải phiếu kho:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchList();
    }, []);

    /* ======================= SEARCH ========================= */
    const filteredList = useMemo(() => {
        const key = search.trim().toLowerCase();
        if (!key) return list;

        return list.filter(
            (p) =>
                p.receiptCode?.toLowerCase().includes(key) ||
                p.supplier?.supplierName?.toLowerCase().includes(key)
        );
    }, [search, list]);

    /* ======================= OPEN MODAL ======================= */
    const openModal = (item) => {
        setSelectedReceipt(item || null);
        setShowModal(true);
    };

    /* ======================= DELETE RECEIPT ======================= */
    const deleteItem = async (receiptId) => {
        if (!window.confirm("Bạn có chắc muốn xoá phiếu này?")) return;

        try {
            await axios.delete(`${API_BASE}/inventory/${receiptId}`);
            setList((prev) => prev.filter((x) => x.receiptId !== receiptId));
        } catch (err) {
            alert(err.response?.data.message);
        }
    };
    const openViewModal = (item) => {
        setSelectedReceipt(item);
        setViewModal(true);
    };

    /* ======================= RENDER UI ======================= */
    return (
        <div className="card shadow-sm">
            <div className="card-body">

                {/* HEADER */}
                <div className="d-flex justify-content-between mb-4">
                    <h4 className="fw-bold">Quản lý phiếu nhập / xuất kho</h4>

                    <button className="btn btn-primary" onClick={() => openModal(null)}>
                        + Tạo phiếu mới
                    </button>
                </div>

                {/* SEARCH */}
                <input
                    className="form-control mb-3"
                    style={{ maxWidth: 300 }}
                    placeholder="Tìm theo mã phiếu / nhà cung cấp..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />

                {/* TABLE */}
                <div className="table-responsive">
                    <table className="table table-hover align-middle">
                        <thead className="table-light">
                            <tr>
                                <th>Mã phiếu</th>
                                <th>Nhà cung cấp</th>
                                <th>Ngày</th>
                                <th className="text-end">Tổng tiền</th>
                                <th>Ghi chú</th>
                                <th className="text-center">Thao tác</th>
                            </tr>
                        </thead>

                        <tbody>
                            {loading && (
                                <tr>
                                    <td colSpan={6} className="text-center">Đang tải...</td>
                                </tr>
                            )}

                            {!loading && filteredList.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="text-center">
                                        Không có phiếu nào
                                    </td>
                                </tr>
                            )}

                            {!loading &&
                                filteredList.map((r) => (
                                    <tr key={r.receiptId}>

                                        {/* CLICK MÃ PHIẾU = XEM CHI TIẾT */}
                                        <td>
                                            <td>
                                                <button
                                                    className="btn btn-link p-0"
                                                    onClick={() => openViewModal(r)}
                                                    style={{ textDecoration: "underline" }}
                                                >
                                                    {r.receiptCode}
                                                </button>
                                            </td>

                                        </td>

                                        {/* NCC */}
                                        <td>{r.supplier?.supplierName || "Kho nội bộ"}</td>

                                        {/* DATE */}
                                        <td>{new Date(r.createdAt).toLocaleDateString("vi-VN")}</td>

                                        {/* TOTAL */}
                                        <td className="text-end">
                                            {Number(r.totalAmount).toLocaleString("vi-VN")} đ
                                        </td>

                                        <td>{r.note || ""}</td>

                                        <td className="text-center">
                                            <button
                                                className="btn btn-sm btn-outline-primary me-2"
                                                onClick={() => openModal(r)}
                                            >
                                                Sửa
                                            </button>

                                            <button
                                                className="btn btn-sm btn-outline-danger"
                                                onClick={() => deleteItem(r.receiptId)}
                                            >
                                                Xoá
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                        </tbody>
                    </table>
                </div>

                {/* MODAL */}
                {showModal && (
                    <InventoryModal
                        show={showModal}
                        onClose={() => setShowModal(false)}
                        data={selectedReceipt}    // 👈 Lấy từ list, không gọi API
                        onSaved={fetchList}
                    />
                )}
                {viewModal && (
                    <InventoryViewModal
                        show={viewModal}
                        onClose={() => setViewModal(false)}
                        data={selectedReceipt}
                    />
                )}

            </div>
        </div>
    );
}
