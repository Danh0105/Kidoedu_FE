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

// Chuyển đổi Attributes Object -> Array cho UI
const normalizeAttributes = (raw) => {
    if (!raw) return [newRow()];
    let rows = [];
    if (Array.isArray(raw)) {
        rows = raw
            .map((x) => ({
                key: x.key || x.name || "",
                value: x.value ?? x.val ?? ""
            }))
            .filter((x) => x.key)
            .map((x) => ({ id: generateId(), ...x }));
    } else if (typeof raw === "object") {
        rows = Object.entries(raw).map(([k, v]) => ({
            id: generateId(),
            key: k,
            value: String(v ?? "")
        }));
    }
    return rows.length ? rows : [newRow()];
};

// Chuyển đổi Array -> Attributes Object cho DB
const toAttributesObject = (rows) =>
    rows.reduce((acc, r) => {
        if (r.key?.trim()) acc[r.key.trim()] = r.value;
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
    const isInternalUpdate = useRef(false);
    const collapseRef = useRef(null); // Ref tới DOM phần tử Collapse

    /* ---------------- Effects ---------------- */

    // 1. Nhận dữ liệu từ Parent
    useEffect(() => {
        if (isInternalUpdate.current) {
            isInternalUpdate.current = false;
            return;
        }
        if (data) {
            const safeData = data.map(v => ({
                ...v,
                id: String(v.id || generateId()),
                prices: v.prices || []
            }));
            console.log("safeData", data);

            setTempVariants(safeData);
        }
    }, [data]);

    // 2. Gửi dữ liệu ra Parent
    useEffect(() => {
        if (typeof onChange === "function" && isInternalUpdate.current) {
            onChange(tempVariants);
        }
    }, [tempVariants, onChange]);

    // 3. Cleanup Image URL
    useEffect(() => {
        return () => {
            if (preview && preview.startsWith("blob:")) URL.revokeObjectURL(preview);
        };
    }, [preview]);

    /* ---------------- Validation ---------------- */
    const validateForm = () => {
        const e = {};
        if (!variantName.trim()) e.variantName = "Vui lòng nhập tên biến thể";
        if (!basePrice || isNaN(Number(basePrice)) || Number(basePrice) < 0)
            e.basePrice = "Giá bán không hợp lệ";
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    /* ---------------- Actions ---------------- */

    // Hàm Reset Form về trạng thái ban đầu
    const resetForm = () => {
        setVariantName("");
        setSku("");
        setBarcode("");
        setBasePrice("");
        setPromoPrice("");
        setRows([newRow()]);
        setImageFile(null);
        setPreview("");
        setOriginalImageUrl("");  // Thêm dòng này
        setErrors({});
        setEditingId(null);
    };

    // --- LOGIC QUAN TRỌNG: Xử lý nút Sửa ---
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

        // QUAN TRỌNG: Lưu lại ảnh gốc + hiển thị preview
        setOriginalImageUrl(v.imageUrl || "");  // Lưu ảnh gốc
        setPreview(v.imageUrl || "");           // Hiển thị preview
        setImageFile(null);

        // 2. Mở Collapse (Bootstrap 5 Logic)
        if (collapseRef.current) {
            // Kiểm tra xem window.bootstrap có tồn tại không
            if (window.bootstrap) {
                const bsCollapse = window.bootstrap.Collapse.getOrCreateInstance(collapseRef.current);
                bsCollapse.show();
            } else {
                // Fallback nếu chưa import bootstrap JS, dùng class thủ công
                collapseRef.current.classList.add("show");
            }

            // 3. Cuộn màn hình tới form
            setTimeout(() => {
                collapseRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
            }, 100);
        }
    };

    const handleRemove = (id) => {
        if (window.confirm("Bạn chắc chắn muốn xóa biến thể này?")) {
            isInternalUpdate.current = true;
            setTempVariants((prev) => prev.filter((v) => String(v.id) !== String(id)));
            if (String(id) === String(editingId)) resetForm();
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        if (preview && preview.startsWith("blob:")) URL.revokeObjectURL(preview);
        setPreview(URL.createObjectURL(file));
        setImageFile(file);
    };

    const handleSave = () => {
        if (!validateForm()) return;
        setSaving(true);

        const attributes = toAttributesObject(rows);
        const pricesPayload = [{ priceType: "base", price: Number(basePrice) }];
        if (promoPrice && !isNaN(Number(promoPrice))) {
            pricesPayload.push({ priceType: "promo", price: Number(promoPrice) });
        }

        setTempVariants((prev) => {
            isInternalUpdate.current = true;

            // SỬA TẠI ĐÂY: DÙNG imageFile (mới chọn) VÀ sku (hiện tại)
            const currentSku = sku.trim() || `SKU_${generateId()}`;
            const skuForImageKey = imageFile ? currentSku : null;

            const updatedVariant = {
                variantName: variantName.trim(),
                sku: currentSku,
                barcode: barcode.trim(),
                attributes,
                prices: pricesPayload,

                // QUAN TRỌNG NHẤT: Lưu lại SKU tại thời điểm chọn ảnh
                imageSkuKey: imageFile ? currentSku : (prev.find(v => String(v.id) === String(editingId || ''))?.imageSkuKey || null),

                imageUrl: imageFile ? preview : (originalImageUrl || ""),
                imageFile: imageFile || null,
                originalImageUrl: originalImageUrl || "",
            };

            if (editingId) {
                return prev.map((v) =>
                    String(v.id) === String(editingId)
                        ? { ...v, ...updatedVariant }
                        : v
                );
            } else {
                return [...prev, {
                    id: generateId(),
                    ...updatedVariant
                }];
            }
        });

        setSaving(false);
        resetForm();
    };

    return (
        <div className="container-fluid p-0">
            {/* --- Toolbar --- */}
            <div className="d-flex justify-content-center mb-3">
                <button
                    className="btn btn-outline-primary d-flex align-items-center gap-2"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#variant-collapse"
                    aria-expanded="false"
                    aria-controls="variant-collapse"
                    onClick={resetForm}
                >
                    <i className="bi bi-plus-circle"></i>
                    Thêm Biến thể mới
                </button>
            </div>

            {/* --- FORM COLLAPSE --- */}
            <div
                className={`collapse ${tempVariants.length === 0 ? "show" : ""}`}
                id="variant-collapse"
                ref={collapseRef} // Gán ref để điều khiển bằng JS
            >
                <div className="card card-body bg-light border-0 shadow-sm mb-4">
                    <div className="d-flex justify-content-between align-items-center border-bottom pb-2 mb-3">
                        <h6 className="fw-bold text-primary m-0 text-uppercase">
                            {editingId ? "Cập nhật biến thể" : "Thông tin biến thể mới"}
                        </h6>
                        {editingId && (
                            <button className="btn btn-sm btn-secondary" type="button" onClick={resetForm}>
                                Hủy & Tạo mới
                            </button>
                        )}
                    </div>

                    <div className="row g-3">
                        {/* Tên biến thể */}
                        <div className="col-12 col-md-6">
                            <label className="form-label fw-bold small">Tên biến thể <span className="text-danger">*</span></label>
                            <input
                                type="text"
                                className={`form-control ${errors.variantName ? "is-invalid" : ""}`}
                                value={variantName}
                                onChange={(e) => setVariantName(e.target.value)}
                                placeholder="Ví dụ: Màu Đỏ - Size L"
                            />
                            <div className="invalid-feedback">{errors.variantName}</div>
                        </div>

                        {/* SKU & Barcode */}
                        <div className="col-6 col-md-3">
                            <label className="form-label fw-bold small">Mã SKU</label>
                            <input className="form-control" value={sku} onChange={(e) => setSku(e.target.value)} />
                        </div>
                        <div className="col-6 col-md-3">
                            <label className="form-label fw-bold small">Barcode</label>
                            <input className="form-control" value={barcode} onChange={(e) => setBarcode(e.target.value)} />
                        </div>

                        {/* Giá */}
                        <div className="col-12">
                            <label className="form-label fw-bold small">Cấu hình giá</label>
                            <div className="input-group">
                                <span className="input-group-text bg-white">Giá Bán <span className="text-danger ms-1">*</span></span>
                                <input
                                    type="number"
                                    className={`form-control ${errors.basePrice ? "is-invalid" : ""}`}
                                    value={basePrice}
                                    onChange={(e) => setBasePrice(e.target.value)}
                                />

                            </div>
                            {errors.basePrice && <div className="text-danger small mt-1">{errors.basePrice}</div>}
                        </div>
                        <div className="col-12">
                            <div className="input-group">
                                <span className="input-group-text bg-white">Giá KM</span>
                                <input
                                    type="number"
                                    className="form-control"
                                    value={promoPrice}
                                    onChange={(e) => setPromoPrice(e.target.value)}
                                    placeholder="(Không bắt buộc)"
                                />
                                <span className="input-group-text bg-white">Start</span>
                                <input
                                    type="date"
                                    className="form-control"
                                    value={promoPrice}
                                    onChange={(e) => setPromoPrice(e.target.value)}
                                />
                                <span className="input-group-text bg-white">End</span>
                                <input
                                    type="date"
                                    className="form-control"
                                    value={promoPrice}
                                    onChange={(e) => setPromoPrice(e.target.value)}
                                />
                            </div>
                        </div>
                        {/* Ảnh */}
                        <div className="col-12">
                            <label className="form-label fw-bold small">Hình ảnh</label>
                            <div className="d-flex align-items-start gap-3">
                                <div className="border rounded bg-white d-flex justify-content-center align-items-center"
                                    style={{ width: 80, height: 80, overflow: "hidden" }}>
                                    {preview ? (
                                        <img
                                            src={preview ? (preview.startsWith('data:') ? preview : process.env.REACT_APP_API_URL + preview) : '/placeholder.png'} alt="Preview" style={{ width: "100%", height: "100%", objectFit: "cover" }}
                                        />
                                    ) : (
                                        <span className="text-muted small">No Img</span>
                                    )}
                                </div>
                                <div className="flex-grow-1">
                                    <input type="file" className="form-control" accept="image/*" onChange={handleFileChange} />
                                    <div className="form-text small ps-1">Hỗ trợ JPG, PNG, WebP.</div>
                                </div>
                            </div>
                        </div>

                        {/* Thuộc tính */}
                        <div className="col-12">
                            <label className="form-label fw-bold small">Thuộc tính (Màu, Size...)</label>
                            <div className="border rounded bg-white overflow-hidden">
                                <table className="table table-sm mb-0 align-middle">
                                    <thead className="table-light">
                                        <tr>
                                            <th className="ps-3">Tên (VD: Màu)</th>
                                            <th>Giá trị (VD: Đỏ)</th>
                                            <th className="text-end pe-3" style={{ width: 50 }}>#</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {rows.map((r) => (
                                            <tr key={r.id}>
                                                <td className="ps-3">
                                                    <input className="form-control form-control-sm border-0 bg-light"
                                                        value={r.key}
                                                        onChange={(e) => setRows(prev => prev.map(x => x.id === r.id ? { ...x, key: e.target.value } : x))}
                                                        placeholder="Nhập tên..." />
                                                </td>
                                                <td>
                                                    <input className="form-control form-control-sm border-0 bg-light"
                                                        value={r.value}
                                                        onChange={(e) => setRows(prev => prev.map(x => x.id === r.id ? { ...x, value: e.target.value } : x))}
                                                        placeholder="Nhập giá trị..." />
                                                </td>
                                                <td className="text-end pe-3">
                                                    <button type="button"
                                                        className="btn btn-link text-danger btn-sm p-0"
                                                        onClick={() => setRows(prev => prev.length > 1 ? prev.filter(x => x.id !== r.id) : prev)}
                                                        disabled={rows.length === 1}>
                                                        <i className="bi bi-trash"></i>
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                    <tfoot>
                                        <tr>
                                            <td colSpan={3} className="p-0">
                                                <button type="button" className="btn btn-light w-100 btn-sm text-primary fw-bold rounded-0" onClick={() => setRows(prev => [...prev, newRow()])}>
                                                    + Thêm dòng
                                                </button>
                                            </td>
                                        </tr>
                                    </tfoot>
                                </table>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="col-12 text-end mt-3 border-top pt-3">
                            {/* Nút đóng collapse thủ công nếu muốn */}
                            <button
                                type="button"
                                className="btn btn-secondary me-2"
                                data-bs-toggle="collapse"
                                data-bs-target="#variant-collapse"
                            >
                                Đóng
                            </button>
                            <button
                                type="button"
                                className="btn btn-primary px-4 fw-bold"
                                onClick={handleSave}
                                disabled={saving}
                            >
                                {saving ? <span className="spinner-border spinner-border-sm me-2" /> : null}
                                {editingId ? "Cập nhật Biến thể" : "Lưu Biến thể"}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* --- DANH SÁCH BIẾN THỂ --- */}
            {tempVariants.length > 0 && (
                <div className="card border-0 shadow-sm">
                    <div className="card-header bg-white fw-bold border-bottom">
                        Danh sách biến thể ({tempVariants.length})
                    </div>
                    <div className="list-group list-group-flush">
                        {tempVariants.map((v) => {
                            const base = v.prices?.find(p => p.priceType === "base")?.price;
                            const promo = v.prices?.find(p => p.priceType === "promo")?.price;
                            const isEditing = String(v.id) === String(editingId);

                            return (
                                <div key={v.id} className={`list-group-item d-flex align-items-center gap-3 py-3 ${isEditing ? "bg-primary bg-opacity-10" : ""}`}>
                                    <div className="border rounded bg-white d-flex justify-content-center align-items-center flex-shrink-0"
                                        style={{ width: 64, height: 64, overflow: "hidden" }}>
                                        {v.imageUrl ? <img src={process.env.REACT_APP_API_URL + v.imageUrl} className="w-100 h-100 object-fit-cover" alt="" /> : <small className="text-muted">No Img</small>}
                                    </div>

                                    <div className="flex-grow-1">
                                        <h6 className="mb-1 fw-bold text-dark">{v.variantName}</h6>
                                        <div className="small text-muted d-flex flex-wrap gap-2 mb-1">
                                            <span className="badge bg-light text-dark border">SKU: {v.sku || "--"}</span>
                                            {v.attributes && Object.entries(v.attributes).map(([k, val]) => (
                                                <span key={k} className="badge bg-light text-secondary border">{k}: {val}</span>
                                            ))}
                                        </div>
                                        <div className="small">
                                            <span className="fw-bold text-primary fs-6">{Number(base).toLocaleString()}đ</span>
                                            {promo && <span className="text-decoration-line-through text-muted ms-2">{Number(promo).toLocaleString()}đ</span>}
                                        </div>
                                    </div>

                                    <div className="d-flex flex-column gap-2">
                                        <button type="button" className="btn btn-sm btn-outline-primary" onClick={() => handleEdit(v)}>
                                            Sửa
                                        </button>
                                        <button type="button" className="btn btn-sm btn-outline-danger" onClick={() => handleRemove(v.id)}>
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