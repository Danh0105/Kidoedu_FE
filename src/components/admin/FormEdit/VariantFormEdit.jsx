import React, {
    useEffect,
    useImperativeHandle,
    useRef,
    useState
} from "react";

/* -------------------------------------------------------------------------- */
/*                                   HELPERS                                  */
/* -------------------------------------------------------------------------- */

const generateId = () => Date.now().toString(36) + Math.random().toString(36).substr(2);
const newRow = () => ({ id: generateId(), key: "", value: "" });

// Chuyển Attributes Object -> UI Rows
const normalizeAttributes = (raw) => {
    if (!raw) return [newRow()];

    let rows = [];

    if (Array.isArray(raw)) {
        rows = raw.map(x => ({
            id: generateId(),
            key: x.key || x.name || "",
            value: x.value ?? ""
        }));
    } else if (typeof raw === "object") {
        rows = Object.entries(raw).map(([k, v]) => ({
            id: generateId(),
            key: k,
            value: Array.isArray(v) ? v.join(", ") : String(v ?? "")
        }));
    }

    return rows.length ? rows : [newRow()];
};

// 🎯 CHỈNH QUAN TRỌNG NHẤT: Chuỗi → Mảng
const toAttributesObject = (rows) =>
    rows.reduce((acc, r) => {
        if (!r.key?.trim()) return acc;

        const key = r.key.trim();
        const raw = r.value || "";

        // Xử lý nhiều giá trị dạng “Đỏ, Xanh”
        const arr = raw
            .split(",")
            .map(x => x.trim())
            .filter(x => x.length > 0);

        acc[key] = arr;
        return acc;
    }, {});
/* -------------------------------------------------------------------------- */
/*                                  COMPONENT                                 */
/* -------------------------------------------------------------------------- */

const VariantFormEdit = React.forwardRef(({ data, onChange }, ref) => {

    /* ---------------- State ---------------- */
    const [tempVariants, setTempVariants] = useState([]);
    const [editingId, setEditingId] = useState(null);
    const [originalImageUrl, setOriginalImageUrl] = useState("");

    // Fields
    const [variantName, setVariantName] = useState("");
    const [sku, setSku] = useState("");
    const [barcode, setBarcode] = useState("");
    const [basePrice, setBasePrice] = useState("");
    const [promoPrice, setPromoPrice] = useState("");

    // Attributes & Images
    const [rows, setRows] = useState([newRow()]);
    const [imageFile, setImageFile] = useState(null);
    const [preview, setPreview] = useState("");

    const [errors, setErrors] = useState({});
    const [saving, setSaving] = useState(false);

    // Refs
    const collapseRef = useRef(null);
    const isInternalUpdate = useRef(false);

    /* ---------------- Effects ---------------- */

    // 1. Nhận dữ liệu từ Parent
    useEffect(() => {
        if (isInternalUpdate.current) {
            isInternalUpdate.current = false;
            return;
        }

        if (data) {
            const safe = data.map(v => ({
                ...v,
                id: String(v.id || generateId()),
                prices: v.prices || []
            }));
            setTempVariants(safe);
        }
    }, [data]);

    // 2. Trả dữ liệu ra Parent
    useEffect(() => {
        if (typeof onChange === "function" && isInternalUpdate.current) {
            onChange(tempVariants);
        }
    }, [tempVariants, onChange]);

    // 3. Cleanup Preview URL
    useEffect(() => {
        return () => {
            if (preview && preview.startsWith("blob:"))
                URL.revokeObjectURL(preview);
        };
    }, [preview]);

    /* ---------------- Validation ---------------- */

    const validateForm = () => {
        const e = {};
        if (!variantName.trim()) e.variantName = "Vui lòng nhập tên biến thể";
        if (!basePrice || isNaN(Number(basePrice))) e.basePrice = "Giá bán không hợp lệ";

        setErrors(e);
        return Object.keys(e).length === 0;
    };

    /* ---------------- RESET FORM ---------------- */

    const resetForm = () => {
        setVariantName("");
        setSku("");
        setBarcode("");
        setBasePrice("");
        setPromoPrice("");
        setRows([newRow()]);
        setImageFile(null);
        setPreview("");
        setOriginalImageUrl("");
        setEditingId(null);
        setErrors({});
    };

    /* ---------------- EDIT VARIANT ---------------- */

    const handleEdit = (v) => {
        setEditingId(String(v.id));

        const base = v.prices?.find(p => p.priceType === "base")?.price || "";
        const promo = v.prices?.find(p => p.priceType === "promo")?.price || "";

        setVariantName(v.variantName || "");
        setSku(v.sku || "");
        setBarcode(v.barcode || "");
        setBasePrice(base);
        setPromoPrice(promo);

        setRows(normalizeAttributes(v.attributes));

        setPreview(v.imageUrl || "");
        setOriginalImageUrl(v.imageUrl || "");
        setImageFile(null);

        // Mở collapse
        if (collapseRef.current) {
            if (window.bootstrap) {
                const bs = window.bootstrap.Collapse.getOrCreateInstance(collapseRef.current);
                bs.show();
            } else {
                collapseRef.current.classList.add("show");
            }
        }

        setTimeout(() => {
            collapseRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
        }, 150);
    };

    /* ---------------- REMOVE VARIANT ---------------- */

    const handleRemove = (id) => {
        if (!window.confirm("Bạn chắc chắn muốn xóa biến thể?")) return;

        isInternalUpdate.current = true;
        setTempVariants(prev => prev.filter(v => String(v.id) !== String(id)));

        if (String(id) === String(editingId)) resetForm();
    };

    /* ---------------- IMAGE ---------------- */

    const handleFileChange = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (preview && preview.startsWith("blob:"))
            URL.revokeObjectURL(preview);

        setPreview(URL.createObjectURL(file));
        setImageFile(file);
    };

    /* ---------------- SAVE ---------------- */

    const handleSave = () => {
        if (!validateForm()) return;

        setSaving(true);

        const attributes = toAttributesObject(rows); // 🎯 CHỖ QUAN TRỌNG

        const prices = [
            { priceType: "base", price: Number(basePrice) }
        ];

        if (promoPrice && !isNaN(Number(promoPrice))) {
            prices.push({ priceType: "promo", price: Number(promoPrice) });
        }

        const currentSku = sku.trim() || `SKU_${generateId()}`;

        const newVariant = {
            id: editingId || generateId(),
            variantName: variantName.trim(),
            sku: currentSku,
            barcode: barcode.trim(),
            attributes,
            prices,
            imageFile: imageFile || null,
            imageUrl: imageFile ? preview : originalImageUrl
        };

        setTempVariants(prev => {
            isInternalUpdate.current = true;

            if (editingId) {
                return prev.map(v =>
                    String(v.id) === String(editingId) ? { ...v, ...newVariant } : v
                );
            }

            return [...prev, newVariant];
        });

        setSaving(false);
        resetForm();
    };

    /* ---------------- RENDER UI ---------------- */

    return (
        <div className="container-fluid p-0">

            {/* BUTTON ADD */}
            <div className="d-flex justify-content-center mb-3">
                <button
                    className="btn btn-outline-primary d-flex align-items-center gap-2"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#variant-collapse"
                    onClick={resetForm}
                >
                    <i className="bi bi-plus-circle"></i>
                    Thêm Biến Thể Mới
                </button>
            </div>

            {/* FORM COLLAPSE */}
            <div
                className="collapse"
                id="variant-collapse"
                ref={collapseRef}
            >
                <div className="card card-body bg-light shadow-sm border-0 mb-4">

                    <div className="d-flex justify-content-between align-items-center border-bottom pb-2 mb-3">
                        <h6 className="fw-bold text-primary m-0 text-uppercase">
                            {editingId ? "Cập nhật biến thể" : "Tạo biến thể mới"}
                        </h6>

                        {editingId && (
                            <button type="button" className="btn btn-sm btn-secondary" onClick={resetForm}>
                                Hủy & Tạo mới
                            </button>
                        )}
                    </div>

                    <div className="row g-3">

                        {/* Tên biến thể */}
                        <div className="col-md-6">
                            <label className="form-label fw-bold small">Tên biến thể *</label>
                            <input
                                type="text"
                                className={`form-control ${errors.variantName ? "is-invalid" : ""}`}
                                value={variantName}
                                onChange={(e) => setVariantName(e.target.value)}
                                placeholder="VD: Màu Đỏ - Size L"
                            />
                            {errors.variantName && <div className="invalid-feedback">{errors.variantName}</div>}
                        </div>

                        {/* SKU */}
                        <div className="col-md-3">
                            <label className="form-label fw-bold small">SKU</label>
                            <input className="form-control" value={sku} onChange={(e) => setSku(e.target.value)} />
                        </div>

                        {/* BARCODE */}
                        <div className="col-md-3">
                            <label className="form-label fw-bold small">Barcode</label>
                            <input className="form-control" value={barcode} onChange={(e) => setBarcode(e.target.value)} />
                        </div>

                        {/* Giá */}
                        <div className="col-12">
                            <label className="form-label fw-bold small">Giá bán *</label>
                            <input
                                type="number"
                                className={`form-control ${errors.basePrice ? "is-invalid" : ""}`}
                                value={basePrice}
                                onChange={(e) => setBasePrice(e.target.value)}
                            />
                            {errors.basePrice && <div className="text-danger small">{errors.basePrice}</div>}
                        </div>

                        {/* Giá KM */}
                        <div className="col-12">
                            <label className="form-label fw-bold small">Giá khuyến mãi</label>
                            <input
                                type="number"
                                className="form-control"
                                value={promoPrice}
                                onChange={(e) => setPromoPrice(e.target.value)}
                                placeholder="Không bắt buộc"
                            />
                        </div>

                        {/* Ảnh */}
                        <div className="col-12">
                            <label className="form-label fw-bold small">Hình ảnh</label>

                            <div className="d-flex gap-3 align-items-start">
                                <div
                                    className="border rounded bg-white d-flex justify-content-center align-items-center"
                                    style={{ width: 80, height: 80, overflow: "hidden" }}
                                >
                                    {preview ? (
                                        <img
                                            src={preview.startsWith("blob:") ? preview : process.env.REACT_APP_API_URL + preview}
                                            alt="Preview"
                                            style={{ width: "100%", height: "100%", objectFit: "cover" }}
                                        />
                                    ) : <span className="text-muted small">No Img</span>}
                                </div>

                                <input type="file" className="form-control" accept="image/*" onChange={handleFileChange} />
                            </div>
                        </div>

                        {/* Thuộc tính */}
                        <div className="col-12">
                            <label className="form-label fw-bold small">Thuộc tính</label>

                            <div className="border rounded bg-white">
                                <table className="table table-sm mb-0 align-middle">
                                    <thead className="table-light">
                                        <tr>
                                            <th className="ps-3">Tên (VD: Màu)</th>
                                            <th>Giá trị (VD: Đỏ, Xanh)</th>
                                            <th className="text-end pe-2" style={{ width: 50 }}>#</th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {rows.map(r => (
                                            <tr key={r.id}>
                                                {/* KEY */}
                                                <td className="ps-3">
                                                    <input
                                                        className="form-control form-control-sm bg-light"
                                                        value={r.key}
                                                        onChange={(e) =>
                                                            setRows(prev => prev.map(x =>
                                                                x.id === r.id ? { ...x, key: e.target.value } : x
                                                            ))
                                                        }
                                                    />
                                                </td>

                                                {/* VALUE */}
                                                <td>
                                                    <input
                                                        className="form-control form-control-sm bg-light"
                                                        value={r.value}
                                                        onChange={(e) =>
                                                            setRows(prev => prev.map(x =>
                                                                x.id === r.id ? { ...x, value: e.target.value } : x
                                                            ))
                                                        }
                                                        placeholder="VD: Xanh, Đỏ"
                                                    />
                                                </td>

                                                {/* REMOVE */}
                                                <td className="text-end pe-2">
                                                    <button
                                                        className="btn btn-link text-danger p-0"
                                                        disabled={rows.length === 1}
                                                        onClick={() =>
                                                            setRows(prev => prev.length > 1
                                                                ? prev.filter(x => x.id !== r.id)
                                                                : prev
                                                            )
                                                        }
                                                    >
                                                        <i className="bi bi-trash"></i>
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>

                                    <tfoot>
                                        <tr>
                                            <td colSpan={3} className="p-0">
                                                <button
                                                    className="btn btn-light w-100 btn-sm text-primary fw-bold rounded-0"
                                                    onClick={() => setRows(prev => [...prev, newRow()])}
                                                >
                                                    + Thêm dòng
                                                </button>
                                            </td>
                                        </tr>
                                    </tfoot>
                                </table>
                            </div>
                        </div>

                        {/* ACTION */}
                        <div className="col-12 text-end pt-3 border-top">
                            <button
                                className="btn btn-secondary me-2"
                                data-bs-toggle="collapse"
                                data-bs-target="#variant-collapse"
                            >
                                Đóng
                            </button>

                            <button
                                className="btn btn-primary px-4 fw-bold"
                                disabled={saving}
                                onClick={handleSave}
                            >
                                {saving ? "Đang lưu..." : editingId ? "Cập nhật" : "Lưu"}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* LIST */}
            {tempVariants.length > 0 && (
                <div className="card shadow-sm">
                    <div className="card-header fw-bold bg-white">Danh sách biến thể</div>

                    <div className="list-group list-group-flush">
                        {tempVariants.map(v => {
                            const base = v.prices?.find(p => p.priceType === "base")?.price;
                            const promo = v.prices?.find(p => p.priceType === "promo")?.price;

                            return (
                                <div key={v.id} className="list-group-item d-flex align-items-center gap-3">
                                    <div className="border rounded" style={{ width: 60, height: 60, overflow: "hidden" }}>
                                        {v.imageUrl ? (
                                            <img src={process.env.REACT_APP_API_URL + v.imageUrl} className="w-100 h-100" />
                                        ) : (
                                            <span className="text-muted small">No Img</span>
                                        )}
                                    </div>

                                    <div className="flex-grow-1">
                                        <div className="fw-bold">{v.variantName}</div>

                                        {/* Thuộc tính */}
                                        <div className="small text-muted d-flex flex-wrap gap-2">
                                            {v.attributes &&
                                                Object.entries(v.attributes).map(([k, vals]) => (
                                                    <span key={k} className="badge bg-dark border">
                                                        {k}: {Array.isArray(vals) ? vals.join(", ") : vals}
                                                    </span>
                                                ))}
                                        </div>

                                        {/* Giá */}
                                        <div>
                                            <span className="text-primary fw-bold">{Number(base).toLocaleString()}đ</span>
                                            {promo && (
                                                <span className="text-muted text-decoration-line-through ms-2">
                                                    {Number(promo).toLocaleString()}đ
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    <div className="d-flex flex-column gap-2">
                                        <button className="btn btn-sm btn-outline-primary" onClick={() => handleEdit(v)}>
                                            Sửa
                                        </button>
                                        <button className="btn btn-sm btn-outline-danger" onClick={() => handleRemove(v.id)}>
                                            Xóa
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
});

export default VariantFormEdit;
