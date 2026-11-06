import React, {
    forwardRef,
    useEffect,
    useImperativeHandle,
    useRef,
    useState,
} from "react";
import GenerateSKU from "../../../utils/GenerateSKU";

/* -------------------------------------------------------------------------- */
/*                                   HELPERS                                  */
/* -------------------------------------------------------------------------- */

// Tạo ID an toàn (String)
const generateId = () =>
    Date.now().toString(36) + Math.random().toString(36).substr(2);

const createEmptyAttrRow = () => ({
    id: generateId(),
    key: "",
    value: "",
});

const buildRowsFromAttributes = (raw) => {
    const rows = [];
    if (!raw) return [createEmptyAttrRow()];

    if (typeof raw === "object" && !Array.isArray(raw)) {
        Object.entries(raw).forEach(([k, v]) => {
            rows.push({ id: generateId(), key: k, value: String(v ?? "") });
        });
    } else if (Array.isArray(raw)) {
        raw.forEach((item) => {
            const k = item.key || item.name || item.label || "";
            const v = item.value ?? item.attrValue ?? "";
            if (k) rows.push({ id: generateId(), key: k, value: String(v ?? "") });
        });
    }
    return rows.length ? rows : [createEmptyAttrRow()];
};

/* -------------------------------------------------------------------------- */
/*                                  COMPONENT                                 */
/* -------------------------------------------------------------------------- */

function VariantForm({ productId, onChange }, ref) {
    const collapseRef = useRef(null);
    const isInternalUpdate = useRef(false);

    const [editingId, setEditingId] = useState(null);
    const [variantName, setVariantName] = useState("");
    const [sku, setSku] = useState("");
    const [barcode, setBarcode] = useState("");

    // Prices
    const [basePrice, setBasePrice] = useState("");
    const [promoPrice, setPromoPrice] = useState("");

    // --- NEW: Promo Start/End state ---
    const [promoStartAt, setPromoStartAt] = useState("");
    const [promoEndAt, setPromoEndAt] = useState("");

    // Image
    const [imageFile, setImageFile] = useState(null);
    const [imagePreviewUrl, setImagePreviewUrl] = useState("");

    const [attributeRows, setAttributeRows] = useState([createEmptyAttrRow()]);
    const [specs, setSpecs] = useState({});

    const [tempVariants, setTempVariants] = useState([]);
    const [errors, setErrors] = useState({});
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (typeof onChange === "function" && isInternalUpdate.current) {
            onChange(tempVariants);
        }
    }, [tempVariants]);

    useEffect(() => {
        return () => {
            if (imagePreviewUrl) URL.revokeObjectURL(imagePreviewUrl);
        };
    }, [imagePreviewUrl]);

    const resetForm = () => {
        setVariantName("");
        setSku("");
        setBarcode("");
        setBasePrice("");
        setPromoPrice("");

        // --- NEW ---
        setPromoStartAt("");
        setPromoEndAt("");

        setImageFile(null);
        setImagePreviewUrl("");
        setAttributeRows([createEmptyAttrRow()]);
        setSpecs({});
        setErrors({});
        setEditingId(null);
    };

    const validateForm = () => {
        const e = {};
        if (!variantName.trim()) e.variantName = "Tên biến thể là bắt buộc";
        if (!basePrice.toString().trim() || isNaN(Number(basePrice)))
            e.basePrice = "Giá cơ bản không hợp lệ";

        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const handleSave = () => {
        if (!validateForm()) return;
        setSaving(true);

        const attributesObj = {};
        attributeRows.forEach((row) => {
            if (row.key?.trim()) attributesObj[row.key.trim()] = row.value;
        });

        const payload = {
            variant_name: variantName.trim(),
            sku: sku?.trim() || null,
            barcode: barcode?.trim() || null,
            basePrice: Number(basePrice),
            promoPrice: promoPrice ? Number(promoPrice) : null,

            // --- NEW: push promo time to payload ---
            promoStartAt: promoStartAt || null,
            promoEndAt: promoEndAt || null,

            attributes: attributesObj,
            specs,
            image_file: imageFile || null,
            image_url: imageFile ? imagePreviewUrl : imagePreviewUrl || null,
        };

        setTempVariants((prev) => {
            isInternalUpdate.current = true;
            if (editingId) {
                return prev.map((v) =>
                    String(v.id) === String(editingId)
                        ? { ...v, ...payload }
                        : v
                );
            } else {
                return [...prev, { id: generateId(), ...payload }];
            }
        });

        setSaving(false);
        resetForm();
    };

    const handleEdit = (v) => {
        setEditingId(String(v.id));
        setVariantName(v.variant_name || "");
        setSku(v.sku || "");
        setBarcode(v.barcode || "");
        setBasePrice(v.basePrice || "");
        setPromoPrice(v.promoPrice || "");

        // --- NEW: fill promo time ---
        setPromoStartAt(v.promoStartAt || "");
        setPromoEndAt(v.promoEndAt || "");

        setImageFile(null);
        setImagePreviewUrl(v.image_url || "");
        setAttributeRows(buildRowsFromAttributes(v.attributes));
        setSpecs(v.specs || {});

        if (collapseRef.current) {
            collapseRef.current.classList.add("show");
            setTimeout(() => {
                collapseRef.current.scrollIntoView({ behavior: "smooth" });
            }, 100);
        }
    };

    const handleRemove = (id) => {
        if (window.confirm("Bạn chắc chắn xóa biến thể này?")) {
            isInternalUpdate.current = true;
            setTempVariants((prev) => prev.filter((v) => String(v.id) !== String(id)));
            if (String(id) === String(editingId)) resetForm();
        }
    };

    const onFileChange = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            if (imagePreviewUrl) URL.revokeObjectURL(imagePreviewUrl);

            setImageFile(file);
            setImagePreviewUrl(URL.createObjectURL(file));
        }
    };

    useImperativeHandle(ref, () => ({
        getData: () => tempVariants,
        clear: () => {
            setTempVariants([]);
            resetForm();
        },
    }));

    const isFirst = tempVariants.length === 0;

    return (
        <div className="p-2">
            <div className="d-flex justify-content-center mb-3">
                <a
                    className="btn btn-outline-primary"
                    type="a"
                    data-bs-toggle="collapse"
                    data-bs-target="#variant-collapse"
                    aria-expanded={isFirst}
                    onClick={resetForm}
                >
                    <i className="bi bi-plus-lg me-2"></i>
                    Thêm biến thể mới
                </a>
            </div>

            <div
                className={`collapse ${isFirst ? "show" : ""}`}
                id="variant-collapse"
                ref={collapseRef}
            >
                <div className="card card-body bg-light border-0 shadow-sm mb-4">
                    <h6 className="fw-bold text-primary mb-3">
                        {editingId ? "CẬP NHẬT BIẾN THỂ" : "TẠO BIẾN THỂ MỚI"}
                    </h6>
                    <div className="col-md-6">
                        <label className="form-label small fw-bold">Tên biến thể *</label>
                        <input
                            className={`form-control ${errors.variantName ? "is-invalid" : ""}`}
                            value={variantName}
                            onChange={(e) => setVariantName(e.target.value)}
                        />
                    </div>
                    <div className="row ">
                        <div className="row">

                            <div className="col-md-8">
                                <label className="form-label small fw-bold">SKU</label>

                                <div className="d-flex align-items-center gap-2">
                                    <input
                                        className="form-control flex-grow-1"
                                        value={sku}
                                        onChange={(e) => setSku(e.target.value)}
                                        placeholder="Nhập SKU"
                                    />

                                    <a
                                        type="a"
                                        className="btn btn-sm btn-outline-primary"
                                        style={{ width: "82px" }}
                                        onClick={() => {
                                            const auto = GenerateSKU(variantName);
                                            setSku(auto);
                                        }}
                                    >
                                        Tạo mã
                                    </a>
                                </div>
                            </div>

                            <div className="col-md-4">
                                <label className="form-label small fw-bold">Barcode</label>
                                <input
                                    className="form-control"
                                    value={barcode}
                                    onChange={(e) => setBarcode(e.target.value)}
                                />
                            </div>
                        </div>




                        {/* PRICE + PROMO */}
                        <div className="col-12">
                            <label className="form-label small fw-bold">Thiết lập giá</label>

                            <div className="d-flex gap-3 flex-wrap">

                                <div className="input-group">
                                    <span className="input-group-text bg-white">Giá Base *</span>
                                    <input
                                        type="number"
                                        className={`form-control ${errors.basePrice ? "is-invalid" : ""}`}
                                        value={basePrice}
                                        onChange={(e) => setBasePrice(e.target.value)}
                                    />
                                </div>

                                <div className="input-group">
                                    <span className="input-group-text bg-white">Giá Promo</span>
                                    <input
                                        type="number"
                                        className="form-control"
                                        value={promoPrice}
                                        onChange={(e) => setPromoPrice(e.target.value)}
                                    />
                                </div>

                                {/* --- NEW 2 INPUTS --- */}
                                <div className="input-group">
                                    <span className="input-group-text bg-white small">Bắt đầu</span>
                                    <input
                                        type="datetime-local"
                                        className="form-control"
                                        value={promoStartAt}
                                        onChange={(e) => setPromoStartAt(e.target.value)}
                                    />
                                </div>

                                <div className="input-group">
                                    <span className="input-group-text bg-white small">Kết thúc</span>
                                    <input
                                        type="datetime-local"
                                        className="form-control"
                                        value={promoEndAt}
                                        onChange={(e) => setPromoEndAt(e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* IMAGE */}
                        <div className="col-12">
                            <label className="form-label small fw-bold">Hình ảnh</label>
                            <div className="d-flex gap-3 align-items-center">
                                <div
                                    className="border rounded bg-white d-flex justify-content-center align-items-center"
                                    style={{ width: 70, height: 70, overflow: "hidden" }}
                                >
                                    {imagePreviewUrl ? (
                                        <img src={imagePreviewUrl} className="w-100 h-100" />
                                    ) : (
                                        <span className="text-muted small">No Img</span>
                                    )}
                                </div>
                                <input
                                    type="file"
                                    accept="image/*"
                                    className="form-control"
                                    onChange={onFileChange}
                                />
                            </div>
                        </div>

                        {/* ATTRIBUTES */}
                        <div className="col-12">
                            <label className="form-label small fw-bold">Thông số kĩ thuật</label>

                            <div className="table-responsive border rounded bg-white">
                                <table className="table table-sm mb-0">
                                    <thead className="table-light">
                                        <tr>
                                            <th className="ps-3">Tên</th>
                                            <th>Giá trị</th>
                                            <th style={{ width: 50 }} />
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {attributeRows.map((r) => (
                                            <tr key={r.id}>
                                                <td className="ps-3">
                                                    <input
                                                        className="form-control form-control-sm border-1"
                                                        value={r.key}
                                                        onChange={(e) =>
                                                            setAttributeRows((prev) =>
                                                                prev.map((x) =>
                                                                    x.id === r.id ? { ...x, key: e.target.value } : x
                                                                )
                                                            )
                                                        }
                                                    />
                                                </td>
                                                <td>
                                                    <input
                                                        className="form-control form-control-sm border-1"
                                                        value={r.value}
                                                        onChange={(e) =>
                                                            setAttributeRows((prev) =>
                                                                prev.map((x) =>
                                                                    x.id === r.id ? { ...x, value: e.target.value } : x
                                                                )
                                                            )
                                                        }
                                                    />
                                                </td>
                                                <td className="text-center">
                                                    <a
                                                        className="btn btn-link text-danger p-0"
                                                        disabled={attributeRows.length === 1}
                                                        onClick={() =>
                                                            setAttributeRows((prev) =>
                                                                prev.length > 1
                                                                    ? prev.filter((x) => x.id !== r.id)
                                                                    : prev
                                                            )
                                                        }
                                                    >
                                                        <i className="bi bi-trash"></i>
                                                    </a>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>

                                    <tfoot>
                                        <tr>
                                            <td colSpan={3}>
                                                <a
                                                    className="btn btn-light w-100 btn-sm"
                                                    onClick={() =>
                                                        setAttributeRows((prev) => [...prev, createEmptyAttrRow()])
                                                    }
                                                >
                                                    + Thêm dòng
                                                </a>
                                            </td>
                                        </tr>
                                    </tfoot>
                                </table>
                            </div>
                        </div>
                    </div>

                    {/* ACTIONS */}
                    <div className="mt-3 text-end border-top pt-3">
                        <a className="btn btn-secondary me-2" data-bs-toggle="collapse" data-bs-target="#variant-collapse">
                            Đóng
                        </a>
                        <a
                            className="btn btn-primary px-4 fw-bold"
                            onClick={handleSave}
                            disabled={saving}
                        >
                            {saving ? "Đang xử lý..." : editingId ? "Cập nhật" : "Lưu"}
                        </a>
                    </div>
                </div>
            </div>

            {/* LIST */}
            {tempVariants.length > 0 && (
                <div className="card shadow-sm">
                    <div className="card-header bg-white fw-bold">Danh sách biến thể</div>

                    <div className="list-group list-group-flush">
                        {tempVariants.map((v) => (
                            <div key={v.id} className="list-group-item d-flex align-items-center gap-3 py-2">

                                <div
                                    className="border rounded"
                                    style={{ width: 60, height: 60, overflow: "hidden" }}
                                >
                                    {v.image_url ? (
                                        <img src={v.image_url} className="w-100 h-100" />
                                    ) : (
                                        <span className="text-muted small">NO IMG</span>
                                    )}
                                </div>

                                <div className="flex-grow-1">
                                    <div className="fw-bold">{v.variant_name}</div>
                                    <div className="small text-muted">
                                        <span>{Number(v.basePrice).toLocaleString()}đ</span>
                                        {v.promoPrice && (
                                            <span className="text-decoration-line-through ms-2">
                                                {Number(v.promoPrice).toLocaleString()}đ
                                            </span>
                                        )}
                                    </div>

                                    {/* --- NEW: Show promo time in list --- */}
                                    {(v.promoStartAt || v.promoEndAt) && (
                                        <div className="small text-muted mt-1">
                                            {v.promoStartAt && (
                                                <span>BĐ: {v.promoStartAt} </span>
                                            )}
                                            {v.promoEndAt && (
                                                <span> • KT: {v.promoEndAt}</span>
                                            )}
                                        </div>
                                    )}
                                </div>

                                <div className="d-flex flex-column gap-1">
                                    <a className="btn btn-sm btn-outline-primary" onClick={() => handleEdit(v)}>
                                        Sửa
                                    </a>
                                    <a className="btn btn-sm btn-outline-danger" onClick={() => handleRemove(v.id)}>
                                        Xóa
                                    </a>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

export default forwardRef(VariantForm);
