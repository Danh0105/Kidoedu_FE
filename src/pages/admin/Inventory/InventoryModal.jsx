import React, { useState, useEffect } from "react";
import axios from "axios";
import SupplierCreateModal from "./SupplierCreateModal";

const API_BASE = process.env.REACT_APP_API_URL;

export default function InventoryModal({ show, onClose, data, onSaved }) {
    const [type, setType] = useState("import");
    const [date, setDate] = useState("");
    const [note, setNote] = useState("");
    const [items, setItems] = useState([]);
    const [supplierId, setSupplierId] = useState(null);

    const [suppliers, setSuppliers] = useState([]);
    const [products, setProducts] = useState([]);

    const [showSupplierModal, setShowSupplierModal] = useState(false);

    /* ==================== FETCH SUPPLIERS + PRODUCTS ==================== */
    const fetchData = async () => {
        try {
            const [sRes, pRes] = await Promise.all([
                axios.get(`${API_BASE}/suppliers`),
                axios.get(`${API_BASE}/products`)
            ]);

            setSuppliers(
                Array.isArray(sRes.data)
                    ? sRes.data
                    : Array.isArray(sRes.data?.data)
                        ? sRes.data.data
                        : []
            );

            setProducts(Array.isArray(pRes.data?.data) ? pRes.data.data : []);
        } catch (err) {
            console.error("Lỗi tải suppliers/products:", err);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    /* ==================== LOAD WHEN EDIT ==================== */
    useEffect(() => {
        if (data) {
            setType(data.type);
            setDate(data.date?.split("T")[0] || "");
            setNote(data.note || "");
            setSupplierId(data.supplierId || null);
            setItems(
                data.items?.map((i) => ({
                    productId: i.productId,
                    productName: i.productName,
                    variantId: i.variantId,
                    variantName: i.variantName,
                    quantity: i.quantity,
                    unit_cost: i.unit_cost
                })) || []
            );
        } else {
            setType("import");
            setDate(new Date().toISOString().split("T")[0]);
            setNote("");
            setSupplierId(null);
            setItems([]);
        }
    }, [data]);

    /* ==================== ADD ROW ==================== */
    const addRow = () => {
        setItems((prev) => [
            ...prev,
            {
                productId: "",
                productName: "",
                variantId: "",
                variantName: "",
                quantity: 1,
                unit_cost: ""
            }
        ]);
    };

    /* ==================== REMOVE ROW ==================== */
    const removeRow = (i) => {
        setItems((prev) => prev.filter((_, idx) => idx !== i));
    };

    /* ==================== UPDATE ROW ==================== */
    const updateRow = (i, field, value) => {
        setItems((prev) =>
            prev.map((row, idx) =>
                idx === i ? { ...row, [field]: value } : row
            )
        );
    };

    /* ==================== SAVE RECEIPT ==================== */
    const save = async () => {
        if (type === "import" && !supplierId) {
            alert("Vui lòng chọn nhà cung cấp!");
            return;
        }

        if (!items.length) {
            alert("Vui lòng thêm ít nhất 1 sản phẩm!");
            return;
        }

        for (const it of items) {
            if (!it.variantId) {
                alert("Có dòng chưa chọn biến thể!");
                return;
            }
            if (!it.quantity || Number(it.quantity) <= 0) {
                alert("Số lượng phải > 0");
                return;
            }
            if (type === "import" && (!it.unit_cost || Number(it.unit_cost) <= 0)) {
                alert("Giá nhập phải > 0");
                return;
            }
        }

        const normalizedItems = items.map((it) => ({
            variantId: Number(it.variantId),
            quantity: Number(it.quantity),
            unitCost: type === "import" ? Number(it.unitCost) : 0
        }));

        const payload = {
            type,
            date,
            note,
            supplierId: type === "import" ? supplierId : null,
            items: normalizedItems,
            totalQuantity: normalizedItems.reduce((s, i) => s + i.quantity, 0)
        };

        try {
            if (data) {
                await axios.put(`${API_BASE}/inventory/${data.receipt_id}`, payload);
            } else {
                await axios.post(`${API_BASE}/inventory`, payload);
            }

            onSaved();
            onClose();
        } catch (err) {
            console.error("Lỗi lưu phiếu:", err);
            alert(err?.response?.data?.message || "Không thể lưu phiếu!");
        }
    };

    /* ==================== MAIN MODAL ==================== */
    if (!show) return null;

    return (
        <>
            <div className="modal fade show" style={{ display: "block", background: "rgba(0,0,0,0.4)" }}>
                <div className="modal-dialog modal-lg">
                    <div className="modal-content">

                        <div className="modal-header">
                            <h5 className="modal-title">{data ? "Cập nhật phiếu" : "Tạo phiếu mới"}</h5>
                            <button className="btn-close" onClick={onClose}></button>
                        </div>

                        <div className="modal-body">

                            {/* SUPPLIER */}
                            {type === "import" && (
                                <div className="mb-3">
                                    <label className="form-label">Nhà cung cấp</label>

                                    <div className="d-flex gap-2">
                                        <select
                                            className="form-select"
                                            value={supplierId || ""}
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
                                            + Thêm
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* TYPE */}
                            <div className="mb-3">
                                <label className="form-label">Loại phiếu</label>
                                <select
                                    className="form-select"
                                    value={type}
                                    onChange={(e) => setType(e.target.value)}
                                >
                                    <option value="import">Nhập kho</option>
                                    <option value="export">Xuất kho</option>
                                </select>
                            </div>

                            {/* DATE */}
                            <div className="mb-3">
                                <label className="form-label">Ngày</label>
                                <input
                                    type="date"
                                    className="form-control"
                                    value={date}
                                    onChange={(e) => setDate(e.target.value)}
                                />
                            </div>

                            {/* NOTE */}
                            <div className="mb-3">
                                <label className="form-label">Ghi chú</label>
                                <textarea
                                    className="form-control"
                                    rows="2"
                                    value={note}
                                    onChange={(e) => setNote(e.target.value)}
                                ></textarea>
                            </div>

                            <hr />

                            {/* ==================== PRODUCT TABLE ==================== */}
                            <h6 className="fw-bold mb-3">Danh sách sản phẩm</h6>

                            <table className="table table-bordered">
                                <thead className="table-light">
                                    <tr>
                                        <th style={{ width: "30%" }}>Sản phẩm</th>
                                        <th style={{ width: "30%" }}>Biến thể</th>
                                        <th style={{ width: "15%" }}>Số lượng</th>
                                        {type === "import" && (
                                            <th style={{ width: "20%" }}>Giá nhập</th>
                                        )}
                                        <th style={{ width: "5%" }}></th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {items.map((item, i) => {
                                        const product = products.find(p => p.productId == item.productId);
                                        const variants = product?.variants || [];

                                        return (
                                            <tr key={i}>
                                                {/* PRODUCT */}
                                                <td>
                                                    <select
                                                        className="form-select"
                                                        value={item.productId}
                                                        onChange={(e) => {
                                                            const pid = e.target.value;
                                                            const prod = products.find(p => p.productId == pid);

                                                            updateRow(i, "productId", pid);
                                                            updateRow(i, "productName", prod?.productName || "");
                                                            updateRow(i, "variantId", "");
                                                            updateRow(i, "variantName", "");
                                                        }}
                                                    >
                                                        <option value="">-- Chọn sản phẩm --</option>
                                                        {products.map((p) => (
                                                            <option key={p.productId} value={p.productId}>
                                                                {p.productName}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </td>

                                                {/* VARIANT */}
                                                <td>
                                                    <select
                                                        className="form-select"
                                                        value={item.variantId}
                                                        disabled={!item.productId}
                                                        onChange={(e) => {
                                                            const vid = e.target.value;
                                                            const v = variants.find(v => v.variantId == vid);

                                                            updateRow(i, "variantId", vid);
                                                            updateRow(i, "variantName", v?.variantName || "");
                                                        }}
                                                    >
                                                        <option value="">-- Chọn biến thể --</option>
                                                        {variants.map((v) => (
                                                            <option key={v.variantId} value={v.variantId}>
                                                                {v.variantName}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </td>

                                                {/* QUANTITY */}
                                                <td>
                                                    <input
                                                        type="number"
                                                        className="form-control"
                                                        value={item.quantity}
                                                        onChange={(e) =>
                                                            updateRow(i, "quantity", e.target.value)
                                                        }
                                                    />
                                                </td>

                                                {/* UNIT COST */}
                                                {type === "import" && (
                                                    <td>
                                                        <input
                                                            type="number"
                                                            className="form-control"
                                                            value={item.unit_cost || ""}
                                                            onChange={(e) =>
                                                                updateRow(i, "unit_cost", e.target.value)
                                                            }
                                                            placeholder="0"
                                                        />
                                                    </td>
                                                )}

                                                {/* DELETE */}
                                                <td>
                                                    <button
                                                        className="btn btn-sm btn-danger"
                                                        onClick={() => removeRow(i)}
                                                    >
                                                        Xoá
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>

                            <button className="btn btn-outline-primary" onClick={addRow}>
                                + Thêm dòng
                            </button>

                        </div>

                        <div className="modal-footer">
                            <button className="btn btn-secondary" onClick={onClose}>
                                Đóng
                            </button>
                            <button className="btn btn-success" onClick={save}>
                                Lưu phiếu
                            </button>
                        </div>

                    </div>
                </div>
            </div>

            {/* ==================== SUPPLIER MODAL ==================== */}
            <SupplierCreateModal
                show={showSupplierModal}
                onClose={() => setShowSupplierModal(false)}
                onSaved={() => fetchData()}
            />
        </>
    );
}
