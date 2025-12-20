import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import SupplierCreateModal from "../../../pages/admin/Inventory/SupplierCreateModal";

/* ===========================================================
   Helpers
=========================================================== */
const uuid = () => crypto?.randomUUID?.() || `${Date.now()}-${Math.random()}`;

const createEmptyItem = () => ({
    id: uuid(),
    variantId: "",
    variantSku: "",
    qty: 1,
    unitCost: 0,
});

const formatCurrency = (v) =>
    new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
    }).format(Number(v || 0));

/* ===========================================================
   MAIN COMPONENT
=========================================================== */
export default function InventoryPanelEdit({
    variants = [],
    onChange,
    apiBase = process.env.REACT_APP_API_URL,
    endpoints,
}) {
    /* ---------------- State ---------------- */
    const [suppliers, setSuppliers] = useState([]);
    const [supplierId, setSupplierId] = useState("");
    const [showSupplierModal, setShowSupplierModal] = useState(false);

    const [receiptCode, setReceiptCode] = useState("");
    const [receiptDate, setReceiptDate] = useState(() =>
        new Date().toISOString().slice(0, 10)
    );
    const [note, setNote] = useState("");

    const [items, setItems] = useState([createEmptyItem()]);
    const [showItems, setShowItems] = useState(true);
    const [err, setErr] = useState(null);

    /* ---------------- API Endpoints ---------------- */
    const api = useMemo(() => {
        const createReceipt =
            endpoints?.createReceipt || (() => `${apiBase}/inventory-receipts`);
        return { createReceipt };
    }, [apiBase, endpoints]);

    /* ===========================================================
       Fetch suppliers
    ============================================================ */
    const fetchSuppliers = async () => {
        try {
            const res = await axios.get(`${apiBase}/suppliers`);
            const list = Array.isArray(res.data)
                ? res.data
                : Array.isArray(res.data?.data)
                    ? res.data.data
                    : [];
            setSuppliers(list);
        } catch (error) {
            console.error("Lỗi tải suppliers:", error);
        }
    };

    useEffect(() => {
        fetchSuppliers();
    }, []);

    /* ===========================================================
       Sync draft to parent
    ============================================================ */
    useEffect(() => {
        onChange?.({
            supplierId,
            receiptCode,
            receiptDate,
            note,
            items,
        });
    }, [supplierId, receiptCode, receiptDate, note, items]);

    /* ===========================================================
       Derived Data
    ============================================================ */
    const selectedVariantIds = items
        .map((i) => i.variantId)
        .filter(Boolean);

    const grandTotal = useMemo(
        () => items.reduce((sum, r) => sum + r.qty * r.unitCost, 0),
        [items]
    );

    const valid = useMemo(
        () =>
            !!receiptDate &&
            items.every(
                (r) =>
                    r.variantId &&
                    Number(r.qty) > 0 &&
                    Number(r.unitCost) >= 0
            ),
        [receiptDate, items]
    );

    /* ===========================================================
       Item Handlers
    ============================================================ */
    const addRow = () => setItems((prev) => [...prev, createEmptyItem()]);

    const removeRow = (id) =>
        setItems((prev) =>
            prev.length > 1 ? prev.filter((r) => r.id !== id) : prev
        );

    const updateRow = (id, patch) =>
        setItems((prev) =>
            prev.map((r) => (r.id === id ? { ...r, ...patch } : r))
        );

    /* 
       FIXED — Lưu variantId, variantSku và các thông tin khác
    */
    const handleSelectVariant = (rowId, variantId) => {
        const v = variants.find((x) => String(x.id) === String(variantId));

        updateRow(rowId, {
            variantId,
            variantSku: v?.sku || "",
        });
    };

    /* ===========================================================
       UI
    ============================================================ */
    return (
        <div className="p-2">
            <div className="card shadow-sm border-0">
                {/* Header */}
                <div className="card-header bg-white d-flex justify-content-between align-items-center">
                    <h5 className="mb-0 fw-semibold">Nhà cung cấp</h5>

                    <div className="d-flex gap-2">
                        <select
                            className="form-select"
                            value={supplierId}
                            onChange={(e) => setSupplierId(e.target.value)}
                        >
                            <option value="">-- Chọn nhà cung cấp --</option>
                            {suppliers.map((s) => (
                                <option key={s.supplierId} value={s.supplierId}>
                                    {s.supplierName}
                                </option>
                            ))}
                        </select>

                        <button
                            className="btn btn-primary"
                            onClick={() => setShowSupplierModal(true)}
                        >
                            +
                        </button>
                    </div>
                </div>

                {/* Body */}
                <div className="card-body">
                    <div className="row g-3 mb-3">
                        <div className="col-md-6">
                            <label className="form-label">Mã phiếu</label>
                            <input
                                className="form-control"
                                value={receiptCode}
                                onChange={(e) => setReceiptCode(e.target.value)}
                            />
                        </div>

                        <div className="col-md-6">
                            <label className="form-label">Ngày nhập</label>
                            <input
                                type="date"
                                className="form-control"
                                value={receiptDate}
                                onChange={(e) => setReceiptDate(e.target.value)}
                            />
                        </div>

                        <div className="col-md-12">
                            <label className="form-label">Ghi chú</label>
                            <textarea
                                className="form-control"
                                rows={2}
                                value={note}
                                onChange={(e) => setNote(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Items */}
                    <div className="d-flex justify-content-between mb-2">
                        <h6 className="fw-semibold">Chi tiết hàng</h6>
                        <button
                            className="btn btn-sm btn-outline-secondary"
                            onClick={() => setShowItems((v) => !v)}
                        >
                            {showItems ? "Thu gọn" : "Mở chi tiết"}
                        </button>
                    </div>

                    {showItems && (
                        <div className="table-responsive">
                            <table className="table align-middle">
                                <thead className="table-light">
                                    <tr>
                                        <th>Biến thể</th>
                                        <th className="text-center" style={{ width: "70px" }}>Số lượng</th>
                                        <th className="text-center">Đơn giá</th>
                                        <th className="text-center" style={{ width: "130px" }}>Thành tiền</th>
                                        <th></th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {items.map((r) => (
                                        <tr key={r.id}>
                                            {/* Variant */}
                                            <td>
                                                <select
                                                    className="form-select"
                                                    value={r.variantId}
                                                    onChange={(e) =>
                                                        handleSelectVariant(r.id, e.target.value)
                                                    }
                                                >
                                                    <option value=""> Chọn biến thể </option>

                                                    {variants.map((v) => {
                                                        const disabled =
                                                            selectedVariantIds.includes(v.id) &&
                                                            v.id !== r.variantId;

                                                        const label = `${v.variantName}${v.sku ? ` - [${v.sku}]` : ""
                                                            }${disabled ? " (đã chọn)" : ""}`;

                                                        return (
                                                            <option
                                                                key={v.id}
                                                                value={v.id}
                                                                disabled={disabled}
                                                            >
                                                                {label}
                                                            </option>
                                                        );
                                                    })}
                                                </select>
                                            </td>

                                            {/* Qty */}
                                            <td className="text-end">
                                                <input
                                                    type="number"
                                                    min={1}
                                                    className="form-control text-end"
                                                    value={r.qty}
                                                    onChange={(e) =>
                                                        updateRow(r.id, {
                                                            qty: Math.max(1, +e.target.value),
                                                        })
                                                    }
                                                />
                                            </td>

                                            {/* Cost */}
                                            <td className="text-end">
                                                <input
                                                    type="number"
                                                    min={0}
                                                    className="form-control text-end"
                                                    value={r.unitCost}
                                                    onChange={(e) =>
                                                        updateRow(r.id, {
                                                            unitCost: Math.max(0, +e.target.value),
                                                        })
                                                    }
                                                />
                                            </td>

                                            {/* Subtotal */}
                                            <td className="text-end fw-semibold">
                                                {formatCurrency(r.qty * r.unitCost)}
                                            </td>

                                            {/* Remove */}
                                            <td>
                                                <button
                                                    className="btn btn-outline-danger btn-sm"
                                                    disabled={items.length === 1}
                                                    onClick={() => removeRow(r.id)}
                                                >
                                                    ×
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>

                                <tfoot>
                                    <tr>
                                        <td colSpan={5}>
                                            <button
                                                className="btn btn-outline-primary"
                                                onClick={addRow}
                                            >
                                                + Thêm dòng
                                            </button>
                                        </td>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>
                    )}

                    {err && <div className="alert alert-danger mt-3">{err}</div>}
                </div>

                {/* Footer */}
                <div className="card-footer d-flex justify-content-end">
                    <div className="text-end">
                        Tổng tiền:
                        <span className="ms-2 fs-5 fw-semibold text-primary">
                            {formatCurrency(grandTotal)}
                        </span>
                    </div>
                </div>
            </div>

            {/* Supplier Modal */}
            <SupplierCreateModal
                show={showSupplierModal}
                onClose={() => setShowSupplierModal(false)}
                onSaved={() => {
                    fetchSuppliers();
                    setShowSupplierModal(false);
                }}
            />
        </div>
    );
}
