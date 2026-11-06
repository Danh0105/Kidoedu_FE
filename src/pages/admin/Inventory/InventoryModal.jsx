import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import Select from "react-select";
import SupplierCreateModal from "./SupplierCreateModal";
import VariantPriceModal from "./VariantPriceModal";
import { inventoryApi } from "../../../services/inventory";

const API_BASE = process.env.REACT_APP_API_URL;

export default function InventoryModal({ show, onClose, data, onSaved }) {

    const [type, setType] = useState("import");
    const [date, setDate] = useState("");
    const [note, setNote] = useState("");
    const [items, setItems] = useState([]);
    const [supplierId, setSupplierId] = useState(null);

    const [suppliersData, setSuppliersData] = useState([]);
    const [productsData, setProductsData] = useState([]);

    const [showSupplierModal, setShowSupplierModal] = useState(false);

    const [warehouseId, setWarehouseId] = useState(null);
    const [warehouses, setWarehouses] = useState([]);
    const [showPriceModal, setShowPriceModal] = useState(false);
    const [priceList, setPriceList] = useState([]);
    const [currentRowIndex, setCurrentRowIndex] = useState(null);
    /* ================= LOAD DATA ================= */
    const fetchData = async () => {
        try {
            const [supplierRes, productRes, warehouseRes] = await Promise.all([
                inventoryApi.getSuppliers(),
                inventoryApi.getProducts(),
                inventoryApi.getWarehouses(),
            ]);

            setSuppliersData(supplierRes.data || []);
            setProductsData(productRes.data?.data || []);
            setWarehouses(warehouseRes.data || []);
        } catch (err) {
            console.error("Load data error:", err);
        }
    };
    useEffect(() => {

        fetchData();

    }, [show]);

    /* ================= INIT FORM ================= */

    useEffect(() => {

        if (!show) return;

        if (!data) {
            setType("import");
            setDate(new Date().toISOString().split("T")[0]);
            setNote("");
            setSupplierId(null);
            setWarehouseId(null);   // thêm
            setItems([]);
            return;
        }

        setType(data.type || "import");

        setDate(
            (data.receiptDate || data.createdAt || "")
                .toString()
                .split("T")[0]
        );

        setNote(data.note || "");

        setSupplierId(data.supplier?.supplierId || data.supplierId || null);

        setItems(
            (data.items || []).map(i => ({
                productId: i.variant?.product?.productId || "",
                variantId: i.variantId || "",
                quantity: Number(i.quantity || 1),
                unitCost: Number(i.unitCost || 0)
            }))
        );

    }, [data, show]);

    /* ================= OPTIONS ================= */

    const productOptions = useMemo(() => {
        return productsData.map((p, index) => ({
            value: index,
            label: p.productName
        }));
    }, [productsData]);

    /* ================= TOTAL ================= */

    const totalAmount = items.reduce(
        (sum, it) => sum + (Number(it.quantity) * Number(it.unitCost)),
        0
    );

    /* ================= ITEM ACTIONS ================= */

    const addRow = () => {
        setItems(prev => [
            ...prev,
            { productId: null, variantId: "", quantity: 1, unitCost: 0 }
        ]);
    };

    const removeRow = (index) => {

        setItems(prev => prev.filter((_, i) => i !== index));

    };

    const updateRow = (index, field, value) => {

        setItems(prev =>
            prev.map((row, i) =>
                i === index ? { ...row, [field]: value } : row
            )
        );

    };

    /* ================= SAVE ================= */

    const save = async () => {

        if (!date) return alert("Vui lòng chọn ngày!");
        if (type === "import" && !supplierId)
            return alert("Vui lòng chọn nhà cung cấp!");
        if (!warehouseId)
            return alert("Vui lòng chọn kho!");
        if (!items.length)
            return alert("Vui lòng thêm ít nhất 1 sản phẩm!");

        for (const it of items) {

            if (!it.variantId)
                return alert("Có dòng chưa chọn biến thể!");

            if (Number(it.quantity) <= 0)
                return alert("Số lượng phải > 0!");

            if (type === "import" && Number(it.unitCost) <= 0)
                return alert("Giá nhập phải > 0!");

        }

        const payload = {
            type,
            date,
            note,

            warehouseId: Number(warehouseId),   // thêm

            supplierId: type === "import"
                ? Number(supplierId)
                : null,

            items: items.map(it => ({
                variantId: Number(it.variantId),
                quantity: Number(it.quantity),
                unitCost: type === "import"
                    ? Number(it.unitCost)
                    : totalAmount
            }))
        };
        console.log("Payload:", payload);
        try {

            if (data) {

                await axios.patch(
                    `${API_BASE}/inventory/${data.receiptId}`,
                    payload
                );

            } else {

                await axios.post(
                    `${API_BASE}/inventory`,
                    payload
                );

            }

            onSaved?.();
            onClose?.();

        } catch (err) {

            alert(
                err?.response?.data?.message ||
                "Không thể lưu phiếu!"
            );

        }

    };

    if (!show) return null;

    return (

        <>

            <div className="modal fade show"
                style={{ display: "block", background: "rgba(0,0,0,0.4)" }}>

                <div className="modal-dialog modal-lg">

                    <div className="modal-content">

                        {/* HEADER */}

                        <div className="modal-header">

                            <h5 className="modal-title">
                                {data ? "Cập nhật phiếu" : "Tạo phiếu mới"}
                            </h5>

                            <button className="btn-close" onClick={onClose} />

                        </div>

                        {/* BODY */}

                        <div className="modal-body">

                            {/* TYPE */}

                            <div className="mb-3">

                                <label className="form-label">
                                    Loại phiếu
                                </label>

                                <select
                                    className="form-select"
                                    value={type}
                                    onChange={(e) => setType(e.target.value)}
                                >
                                    <option value="import">Nhập kho</option>
                                    <option value="export">Xuất kho</option>
                                </select>

                            </div>
                            {/* WAREHOUSE */}
                            <div className="mb-3">
                                <label className="form-label">
                                    Kho
                                </label>

                                <select
                                    className="form-select"
                                    value={warehouseId || ""}
                                    onChange={(e) => setWarehouseId(Number(e.target.value))}
                                >

                                    <option value="">
                                        -- Chọn kho --
                                    </option>

                                    {warehouses.map(w => (
                                        <option
                                            key={w.warehouseId}
                                            value={w.warehouseId}
                                        >
                                            {w.warehouseName}
                                        </option>
                                    ))}

                                </select>
                            </div>
                            {/* SUPPLIER */}

                            {type === "import" && (

                                <div className="mb-3">

                                    <label className="form-label">
                                        Nhà cung cấp
                                    </label>

                                    <div className="d-flex gap-2">

                                        <select
                                            className="form-select"
                                            value={supplierId || ""}
                                            onChange={(e) =>
                                                setSupplierId(Number(e.target.value))
                                            }
                                        >

                                            <option value="">
                                                -- Chọn nhà cung cấp --
                                            </option>
                                            {suppliersData.map(s => (
                                                <option
                                                    key={s.supplierId}
                                                    value={s.supplierId}
                                                >
                                                    {s.supplierName} - {s.phone}
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

                                <label className="form-label">
                                    Ghi chú
                                </label>

                                <textarea
                                    className="form-control"
                                    rows="2"
                                    value={note}
                                    onChange={(e) => setNote(e.target.value)}
                                />

                            </div>

                            <hr />

                            <h6 className="fw-bold mb-3">
                                Danh sách sản phẩm
                            </h6>

                            {/* TABLE */}

                            <table className="table table-bordered">

                                <thead className="table-light">

                                    <tr>
                                        <th>Sản phẩm</th>
                                        <th>Biến thể</th>
                                        <th>Số lượng</th>
                                        {type === "import" && <th>Giá nhập</th>}
                                        <th></th>
                                    </tr>

                                </thead>

                                <tbody>

                                    {items.map((item, i) => {

                                        const product = productsData[item.productId];
                                        const variants = product?.variants || [];

                                        return (

                                            <tr key={i}>

                                                {/* PRODUCT */}

                                                <td style={{ width: 250 }}>

                                                    <Select
                                                        options={productOptions}
                                                        value={productOptions[item.productId] || null}
                                                        onChange={(opt) => {
                                                            updateRow(i, "productId", opt.value);
                                                            updateRow(i, "variantId", "");
                                                        }}
                                                        placeholder="Chọn sản phẩm..."
                                                    />

                                                </td>

                                                {/* VARIANT */}

                                                <td>

                                                    <select
                                                        className="form-select"
                                                        value={item.variantId}
                                                        disabled={item.productId === null || item.productId === undefined}
                                                        onChange={(e) => {

                                                            const variantId = Number(e.target.value);

                                                            const variant = variants.find(v => v.variantId === variantId);

                                                            updateRow(i, "variantId", variantId);

                                                            if (type === "export" && variant) {

                                                                setCurrentRowIndex(i);
                                                                setPriceList(variant.imports || []);
                                                                setShowPriceModal(true);

                                                            }

                                                        }}
                                                    >

                                                        <option value="">
                                                            -- Chọn biến thể --
                                                        </option>

                                                        {variants.map(v => (

                                                            <option
                                                                key={v.variantId}
                                                                value={v.variantId}
                                                            >

                                                                {v.variantName}
                                                                {" "}
                                                                (Tồn: {v.stockQuantity || 0})

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
                                                            value={item.unitCost}
                                                            onChange={(e) =>
                                                                updateRow(i, "unitCost", e.target.value)
                                                            }
                                                        />

                                                    </td>

                                                )}

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

                            <button
                                className="btn btn-outline-primary"
                                onClick={addRow}
                            >
                                + Thêm dòng
                            </button>

                            {/* TOTAL */}

                            <div className="text-end mt-3">

                                <h5>
                                    Tổng tiền: {totalAmount.toLocaleString()} đ
                                </h5>

                            </div>

                        </div>

                        {/* FOOTER */}

                        <div className="modal-footer">

                            <button
                                className="btn btn-secondary"
                                onClick={onClose}
                            >
                                Đóng
                            </button>

                            <button
                                className="btn btn-success"
                                onClick={save}
                            >
                                Lưu phiếu
                            </button>

                        </div>

                    </div>

                </div>

            </div>

            <SupplierCreateModal
                show={showSupplierModal}
                onClose={() => setShowSupplierModal(false)}
                onSaved={onSaved}
            />
            <VariantPriceModal
                show={showPriceModal}
                prices={priceList}
                onClose={() => {
                    setShowPriceModal(false);
                    setCurrentRowIndex(null);
                }}
                onSelect={(price) => {

                    if (currentRowIndex !== null) {
                        updateRow(currentRowIndex, "unitCost", price);
                    }

                    setShowPriceModal(false);
                    setCurrentRowIndex(null);

                }}
            />
        </>

    );

}