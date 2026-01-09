import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import InventoryModal from "./InventoryModal";
import InventoryViewModal from "./InventoryViewModal";
import { hasPermission } from "../../../utils/permission";

const API_BASE = process.env.REACT_APP_API_URL;

export default function InventoryManager() {
    const [list, setList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState("");
    const [viewModal, setViewModal] = useState(false);
    const [products, setProducts] = useState([]);
    const [suppliers, setSuppliers] = useState([]);

    const [showModal, setShowModal] = useState(false);
    const [selectedReceipt, setSelectedReceipt] = useState(null);

    /* ======================= FETCH LIST ======================= */
    const fetchAllData = async () => {
        try {
            const [inventoryRes, productRes, supplierRes] = await Promise.all([
                axios.get(`${API_BASE}/inventory`),
                axios.get(`${API_BASE}/products`),
                axios.get(`${API_BASE}/suppliers`)
            ]);

            // inventory
            const raw = Array.isArray(inventoryRes.data)
                ? inventoryRes.data
                : inventoryRes.data?.data || [];

            setList(
                raw.map((r) => ({
                    receiptId: r.receiptId,
                    receiptCode: r.receiptCode,
                    createdAt: r.createdAt,
                    note: r.note,
                    totalAmount: r.totalAmount,
                    supplier: r.supplier || null,
                    items: r.items || [],
                }))
            );

            // products + variants
            setProducts(
                Array.isArray(productRes.data?.data)
                    ? productRes.data.data
                    : productRes.data || []
            );

            // suppliers
            setSuppliers(
                Array.isArray(supplierRes.data?.data)
                    ? supplierRes.data.data
                    : supplierRes.data || []
            );

        } catch (err) {
            console.error("Lỗi tải dữ liệu:", err);
        }
    };

    useEffect(() => {
        fetchAllData();
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
    const openModal = (receipt) => {
        if (!receipt) {
            setSelectedReceipt(null);
            setShowModal(true);
            return;
        }

        const normalized = {
            receiptId: receipt.receiptId,
            type: "import", // nếu BE chưa trả type
            date: receipt.createdAt?.split("T")[0],
            note: receipt.note || "",
            supplierId: receipt.supplier?.supplierId || null,

            items: receipt.items.map((i) => ({
                productId: i.variant.product.productId,
                productName: i.variant.product.productName,

                variantId: i.variantId,
                variantName: i.variant.variantName,

                quantity: i.quantity,
                unitCost: Number(i.unitCost),
            })),
        };

        setSelectedReceipt(normalized);
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

                    {hasPermission(["inventory.create"]) && (
                        <button
                            className="btn btn-primary"
                            onClick={() => openModal(null)}
                        >
                            + Tạo phiếu mới
                        </button>
                    )}
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
                                            <button
                                                className="btn btn-link p-0"
                                                onClick={() => openViewModal(r)}
                                                style={{ textDecoration: "underline" }}
                                            >
                                                {r.receiptCode}
                                            </button>
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
                                            {hasPermission(["inventory.update"]) && (
                                                <button
                                                    className="btn btn-sm btn-outline-secondary me-2"
                                                    onClick={() => openModal(r)}
                                                >
                                                    Sửa
                                                </button>
                                            )}
                                            {hasPermission(["inventory.delete"]) && (


                                                <button
                                                    className="btn btn-sm btn-outline-danger"
                                                    onClick={() => deleteItem(r.receiptId)}
                                                >
                                                    Xoá
                                                </button>
                                            )}
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
                        data={selectedReceipt}
                        products={products}
                        suppliers={suppliers}
                        onSaved={fetchAllData}
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
