import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import SupplierForm from "./SupplierForm";

/**
 * Tạo 1 dòng rỗng cho bảng chi tiết
 */
function createEmptyItem() {
    const id =
        (typeof crypto !== "undefined" &&
            crypto.randomUUID &&
            crypto.randomUUID()) ||
        String(Date.now() + Math.random());

    return {
        id,
        variantId: null,
        variantName: "",
        variantSku: "",
        qty: 1,
        unitCost: 0,
    };
}

/**
 * InventoryPanel – Phiếu nhập kho (tạo chứng từ nhập và các dòng hàng)
 *
 * Props:
 *  - variants: danh sách biến thể local từ VariantForm (tempVariants)
 *  - onSaved?: (payload)=>void
 *  - onChange?: (draft)=>void   // trả draft cho ModalLG dùng làm initialReceipt
 *  - apiBase?: string (default: process.env.REACT_APP_API_URL)
 *  - endpoints?: {
 *      createReceipt: ()=>string,
 *    }
 */
export default function InventoryPanel({
    variants = [],
    onSaved,
    onChange,
    apiBase = process.env.REACT_APP_API_URL,
    endpoints,
}) {
    const [saving, setSaving] = useState(false);
    const [err, setErr] = useState(null);

    // Modal nhà cung cấp
    const [showSupplierModal, setShowSupplierModal] = useState(false);
    const [supplierData, setSupplierData] = useState(null);

    // Header fields
    const [receiptCode, setReceiptCode] = useState("");
    const [receiptDate, setReceiptDate] = useState(() =>
        new Date().toISOString().slice(0, 10)
    );
    const [referenceNo, setReferenceNo] = useState("");
    const [note, setNote] = useState("");
    const [showItems, setShowItems] = useState(true);

    // Line items
    const [items, setItems] = useState(() => [createEmptyItem()]);

    const url = useMemo(() => {
        const createReceipt =
            endpoints?.createReceipt ||
            (() => `${apiBase}/inventory-receipts`);
        return { createReceipt };
    }, [apiBase, endpoints]);

    const addRow = () => setItems((prev) => [...prev, createEmptyItem()]);

    const removeRow = (id) =>
        setItems((prev) =>
            prev.length > 1 ? prev.filter((r) => r.id !== id) : prev
        );

    const setRow = (id, patch) =>
        setItems((prev) =>
            prev.map((r) => (r.id === id ? { ...r, ...patch } : r))
        );

    const subtotal = (r) =>
        (Number(r.qty) || 0) * (Number(r.unitCost) || 0);

    const grandTotal = items.reduce((s, r) => s + subtotal(r), 0);

    const valid = useMemo(() => {
        if (!receiptDate) return false;
        if (!items.length) return false;
        for (const r of items) {
            if (!r.variantId) return false;
            if (!Number.isFinite(Number(r.qty)) || Number(r.qty) <= 0)
                return false;
            if (
                !Number.isFinite(Number(r.unitCost)) ||
                Number(r.unitCost) < 0
            )
                return false;
        }
        return true;
    }, [receiptDate, items]);

    // Bắn draft lên ModalLG mỗi khi có thay đổi
    useEffect(() => {
        if (typeof onChange !== "function") return;

        onChange({
            supplierName: supplierData?.supplierName || "",
            supplierPhone:
                supplierData?.supplierPhone || supplierData?.phone || "",
            supplierEmail:
                supplierData?.supplierEmail || supplierData?.email || "",
            supplierAddress:
                supplierData?.supplierAddress || supplierData?.address || "",
            supplierNote:
                supplierData?.supplierNote || supplierData?.note || "",
            supplierRefCode:
                supplierData?.supplierRefCode || supplierData?.refCode || "",
            receiptCode,
            receiptDate,
            referenceNo,
            note,
            items,
        });
    }, [
        supplierData,
        receiptCode,
        receiptDate,
        referenceNo,
        note,
        items,
        onChange,
    ]);

    const submit = async () => {
        if (!valid) return;

        const payload = {
            receipt_code: receiptCode || undefined,
            receipt_date: receiptDate,
            supplier: supplierData?.supplierName || undefined,
            reference_no: referenceNo || undefined,
            note: note || undefined,
            items: items.map((r) => ({
                // Khi dùng riêng InventoryPanel để tạo phiếu nhập thực sự,
                // variantId phải là id thật trong DB
                variant_id: Number(r.variantId),
                quantity: Number(r.qty),
                unit_cost: Number(r.unitCost),
            })),
        };

        try {
            setSaving(true);
            setErr(null);
            const res = await axios.post(url.createReceipt(), payload);
            onSaved?.(res?.data?.data || res?.data || payload);

            // Reset form
            setReceiptCode("");
            setReferenceNo("");
            setNote("");
            setSupplierData(null);
            setItems([createEmptyItem()]);
        } catch (e) {
            console.error(e);
            setErr("Lưu phiếu nhập thất bại");
        } finally {
            setSaving(false);
        }
    };

    // chọn biến thể từ danh sách variantsFromForm
    const handleSelectVariant = (rowId, variantIdStr) => {
        const v = variants.find((vv) => String(vv.id) === variantIdStr);
        setRow(rowId, {
            variantId: v?.id || null,
            variantName: v?.variant_name || "",
            variantSku: v?.sku || "",
        });
    };

    return (
        <div className="p-2">
            <div className="card shadow-sm border-0">
                {/* ===== Header card ===== */}
                <div className="card-header bg-white d-flex flex-wrap align-items-center justify-content-between">
                    <div>
                        <h5 className="mb-0 fw-semibold">Phiếu nhập kho</h5>
                    </div>
                    {/* nút thêm nhà cung cấp đưa lên header cho cân đối */}
                    <button
                        type="button"
                        className="btn btn-outline-primary btn-sm"
                        title="Thêm nhà cung cấp mới"
                        onClick={() => setShowSupplierModal(true)}
                    >
                        + Thêm nhà cung cấp
                    </button>
                </div>

                <div className="card-body">
                    {/* ===== Nhà cung cấp + thông tin chung ===== */}
                    <div className="mb-3">
                        <label className="form-label mb-1">Nhà cung cấp</label>
                        <div className="border rounded-3 p-2 bg-light-subtle">
                            {supplierData ? (
                                <>
                                    <div className="fw-semibold">
                                        {supplierData.supplierName}
                                    </div>
                                    <div className="small text-muted">
                                        {supplierData.supplierPhone && (
                                            <>📞 {supplierData.supplierPhone} · </>
                                        )}
                                        {supplierData.supplierEmail && (
                                            <>✉ {supplierData.supplierEmail} · </>
                                        )}
                                        {supplierData.supplierRefCode && (
                                            <>Mã: {supplierData.supplierRefCode}</>
                                        )}
                                    </div>
                                    {supplierData.supplierAddress && (
                                        <div className="small">
                                            📍 {supplierData.supplierAddress}
                                        </div>
                                    )}
                                    {supplierData.supplierNote && (
                                        <div className="small text-muted mt-1">
                                            Ghi chú: {supplierData.supplierNote}
                                        </div>
                                    )}
                                </>
                            ) : (
                                <span className="text-muted">
                                    Chưa chọn nhà cung cấp
                                </span>
                            )}
                        </div>
                    </div>

                    <div className="row g-3 mb-3">
                        {/* Mã phiếu */}
                        <div className="col-12 col-md-4">
                            <label className="form-label mb-1">Mã phiếu</label>
                            <input
                                className="form-control"
                                value={receiptCode}
                                onChange={(e) => setReceiptCode(e.target.value)}
                                placeholder="Tự động hoặc nhập tay"
                            />
                        </div>

                        {/* Ngày nhập */}
                        <div className="col-12 col-md-4">
                            <label className="form-label mb-1">Ngày nhập</label>
                            <input
                                type="date"
                                className="form-control"
                                value={receiptDate}
                                onChange={(e) => setReceiptDate(e.target.value)}
                            />
                        </div>

                        {/* Số tham chiếu */}
                        <div className="col-12 col-md-4">
                            <label className="form-label mb-1">Số tham chiếu</label>
                            <input
                                className="form-control"
                                value={referenceNo}
                                onChange={(e) => setReferenceNo(e.target.value)}
                                placeholder="Số hóa đơn / PO..."
                            />
                        </div>

                        {/* Ghi chú */}
                        <div className="col-12 col-md-8">
                            <label className="form-label mb-1">Ghi chú</label>
                            <textarea
                                className="form-control"
                                rows={2}
                                value={note}
                                onChange={(e) => setNote(e.target.value)}
                                placeholder="Ghi chú thêm (thời gian giao hàng, người giao, tình trạng hàng...)"
                            />
                        </div>
                    </div>

                    {/* ===== Tiêu đề có collapse cho bảng chi tiết ===== */}
                    <div className="d-flex align-items-center justify-content-between mb-2">
                        <h6 className="mb-0 fw-semibold">Chi tiết hàng</h6>
                        <button
                            type="button"
                            className="btn btn-sm btn-outline-secondary"
                            onClick={() => setShowItems((prev) => !prev)}
                        >
                            {showItems ? "Thu gọn" : "Mở chi tiết"}
                        </button>
                    </div>

                    {/* ===== Bảng chi tiết hàng (collapse) ===== */}
                    <div className={`collapse ${showItems ? "show" : ""}`}>
                        <div className="table-responsive mt-1">
                            <table className="table align-middle mb-0">
                                <thead className="table-light">
                                    <tr className="align-middle">
                                        <th style={{ width: 380 }}>Biến thể</th>
                                        <th style={{ width: 120 }} className="text-end">
                                            Số lượng
                                        </th>
                                        <th style={{ width: 160 }} className="text-end">
                                            Đơn giá (₫)
                                        </th>
                                        <th style={{ width: 160 }} className="text-end">
                                            Thành tiền
                                        </th>
                                        <th style={{ width: 60 }}></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {items.map((r) => (
                                        <tr key={r.id}>
                                            <td>
                                                <select
                                                    className="form-select"
                                                    value={r.variantId || ""}
                                                    onChange={(e) =>
                                                        handleSelectVariant(
                                                            r.id,
                                                            e.target.value
                                                        )
                                                    }
                                                >
                                                    <option value="">
                                                        -- Chọn biến thể --
                                                    </option>
                                                    {variants.map((v) => (
                                                        <option key={v.id} value={v.id}>
                                                            {v.variant_name ||
                                                                "(Chưa đặt tên)"}{" "}
                                                            {v.sku ? ` - [${v.sku}]` : ""}
                                                        </option>
                                                    ))}
                                                </select>
                                                {r.variantSku && (
                                                    <div className="small text-muted mt-1">
                                                        SKU: {r.variantSku}
                                                    </div>
                                                )}
                                            </td>
                                            <td
                                                className="text-end"
                                                style={{ maxWidth: 120 }}
                                            >
                                                <input
                                                    type="number"
                                                    min={1}
                                                    className="form-control text-end"
                                                    value={r.qty}
                                                    onChange={(e) =>
                                                        setRow(r.id, {
                                                            qty: Math.max(
                                                                1,
                                                                Number(e.target.value)
                                                            ),
                                                        })
                                                    }
                                                />
                                            </td>
                                            <td
                                                className="text-end"
                                                style={{ maxWidth: 180 }}
                                            >
                                                <div className="input-group">

                                                    <input
                                                        type="number"
                                                        min={0}
                                                        className="form-control text-end"
                                                        value={r.unitCost}
                                                        onChange={(e) =>
                                                            setRow(r.id, {
                                                                unitCost: Math.max(
                                                                    0,
                                                                    Number(e.target.value)
                                                                ),
                                                            })
                                                        }
                                                    />
                                                </div>
                                            </td>
                                            <td className="text-end fw-semibold">
                                                {formatCurrency(subtotal(r))}
                                            </td>
                                            <td className="text-center">
                                                <button
                                                    type="button"
                                                    className="btn btn-outline-danger btn-sm"
                                                    onClick={() => removeRow(r.id)}
                                                    disabled={items.length === 1}
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
                                                type="button"
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
                    </div>

                    {err && (
                        <div
                            className="alert alert-danger py-2 px-3 mt-3 mb-0"
                            role="alert"
                        >
                            {err}
                        </div>
                    )}
                </div>

                {/* ===== Footer: Tổng tiền + nút hành động ===== */}
                <div className="card-footer bg-white d-flex flex-column flex-md-row align-items-md-center justify-content-end gap-2">

                    <div className="d-flex gap-2 justify-content-end">
                        {/*     <button
                            type="button"
                            className="btn btn-outline-secondary"
                            onClick={() => window.history.back()}
                        >
                            Hủy
                        </button> */}
                        {/*  <button
                            type="button"
                            className="btn btn-primary"
                            disabled={!valid || saving}
                            onClick={submit}
                        >
                            {saving ? "Đang lưu…" : "Lưu phiếu nhập"}
                        </button> */}
                    </div>
                    <div className="text-end text-muted small">
                        Tổng tiền:
                        <span className="ms-2 fs-5 fw-semibold text-primary">
                            {formatCurrency(grandTotal)}
                        </span>
                    </div>
                </div>
            </div>

            {/* Modal thêm / sửa nhà cung cấp */}
            {showSupplierModal && (
                <div
                    className="modal d-block"
                    tabIndex="-1"
                    onClick={() => setShowSupplierModal(false)}
                    style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
                >
                    <div
                        className="modal-dialog modal-md modal-dialog-centered"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">
                                    {supplierData
                                        ? "Sửa nhà cung cấp"
                                        : "Thêm nhà cung cấp"}
                                </h5>
                                <button
                                    type="button"
                                    className="btn-close"
                                    onClick={() => setShowSupplierModal(false)}
                                />
                            </div>
                            <div className="modal-body">
                                <SupplierForm
                                    initialData={supplierData}
                                    onCancel={() => setShowSupplierModal(false)}
                                    onSubmit={(data) => {
                                        setSupplierData(data);
                                        setShowSupplierModal(false);
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

function formatCurrency(v) {
    try {
        return new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
        }).format(Number(v || 0));
    } catch {
        return String(v);
    }
}
