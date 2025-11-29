import React, { useRef, useState } from "react";
import Category from "./Category";
import Image from "./Image";
import RichTextEditor from "../../../components/admin/RichTextEditor";
import axios from "axios";
import ReactQuill from "react-quill-new";
import InventoryPanel from "./InventoryPanel";
import AttributePanel from "./AttributePanel";
import VariantForm from "./VariantForm";

// =========================================================================
// HÀM CHUYỂN ĐỔI BITMASK CHUẨN (Thay thế numberToArray/arrayToNumber cũ)
// =========================================================================

/**
 * Kiểm tra xem một bit có được bật trong giá trị bitmask hay không.
 * @param {number} currentNumber - Giá trị bitmask hiện tại.
 * @param {number} value - Giá trị bit (lũy thừa của 2) cần bật/tắt.
 * @returns {number} Giá trị bitmask mới.
 */
function toggleStatusBitmask(currentNumber, value) {
    // Nếu bit đã được bật, tắt nó đi (XOR hoặc AND với NOT)
    if ((currentNumber & value) !== 0) {
        return currentNumber & ~value; // Tắt bit (AND với NOT)
    }
    // Nếu bit chưa được bật, bật nó lên (OR)
    else {
        return currentNumber | value;
    }
}
// =========================================================================

export default function ModalLG({ onProductAdded }) {
    const [categoryId, setCategoryId] = useState(null);
    const [shortDesc, setShortDesc] = useState("");
    const [userManual, setUserManual] = useState("");
    const [cautionNotes, setCautionNotes] = useState("");
    const [origin, setOrigin] = useState("");
    const [longDesc, setLongDesc] = useState("");
    const [nameproduct, setNameproduct] = useState("");
    const [price, setPrice] = useState(0);
    const [files, setFiles] = useState([]);
    const [variantsFromForm, setVariantsFromForm] = useState([]);
    const [inventoryDraft, setInventoryDraft] = useState(null);
    const [errors, setErrors] = useState({});
    const [isSaving, setIsSaving] = useState(false);
    const hasVariants = variantsFromForm.length > 0;
    const hasGlobalPrice = Number(price) > 0;
    const [statusCreate, setStatusCreate] = useState(0); // statusCreate là giá trị BITMASK
    const variantRef = useRef();
    const primaryIndexRef = useRef(null);


    const stripHtml = (html) => {
        const tmp = document.createElement("div");
        tmp.innerHTML = html ?? "";
        return tmp.textContent || tmp.innerText || "";
    };

    const handleImageChange = (fs, primaryIndex = null) => {
        setFiles(fs || []);
        primaryIndexRef.current = typeof primaryIndex === "number" ? primaryIndex : null;
    };

    const handleImageRemove = (_removedFile, idx) => {
        setFiles((prev) => {
            const next = prev.filter((_, i) => i !== idx);
            if (primaryIndexRef.current != null) {
                if (primaryIndexRef.current === idx) primaryIndexRef.current = next.length ? 0 : null;
                else if (primaryIndexRef.current > idx) primaryIndexRef.current--;
            }
            return next;
        });
    };

    const normalizeSpecs = (rawSpecs) =>
        (Array.isArray(rawSpecs) ? rawSpecs : [])
            .filter((s) => s && (s.key || s.label || s.value))
            .map((s, idx) => ({
                key: (s.key ?? s.label ?? `spec_${idx + 1}`).toString().trim(),
                label: (s.label ?? s.key ?? `Thông số ${idx + 1}`).toString().trim(),
                value: String(s.value ?? "").trim(),
                unit: s.unit ?? null,
                type: s.type === "number" || s.type === "boolean" ? s.type : "text",
                group: s.group ?? null,
                note: s.note ?? null,
                order: typeof s.order === "number" ? s.order : idx + 1,
            }));



    const ensureNumber = (v) => {
        const n = Number(v);
        return isNaN(n) ? null : n;
    };

    const validate = () => {
        const e = {};
        if (!nameproduct.trim()) e.nameproduct = "Tên sản phẩm là bắt buộc.";
        if (!categoryId) e.categoryId = "Vui lòng chọn danh mục.";
        if (!files.length && !hasVariants) e.images = "Cần ít nhất 1 ảnh hoặc 1 biến thể.";
        if (!hasVariants && !hasGlobalPrice) e.images = "Cần ít nhất 1 ảnh và/hoặc giá chung/biến thể.";

        variantsFromForm.forEach((v, idx) => {
            if (!v.variant_name?.trim()) e[`variant_${idx}_name`] = `Biến thể #${idx + 1}: tên bắt buộc.`;
            if (!v.sku?.trim()) e[`variant_${idx}_sku`] = `Biến thể #${idx + 1}: sku bắt buộc.`;
            if (ensureNumber(v.basePrice) === null) e[`variant_${idx}_basePrice`] = `Biến thể #${idx + 1}: giá cơ bản không hợp lệ.`;
            if (v.promoPrice !== undefined && v.promoPrice !== "" && ensureNumber(v.promoPrice) === null)
                e[`variant_${idx}_promoPrice`] = `Biến thể #${idx + 1}: giá khuyến mãi không hợp lệ.`;
        });

        setErrors(e);
        return !Object.keys(e).length;
    };

    const onSubmit = async (evt) => {
        evt.preventDefault();
        if (!validate()) return;

        try {
            setIsSaving(true);

            const formData = new FormData();

            // === 1) PRODUCT INFO ===
            formData.append("productName", nameproduct.trim());
            formData.append("shortDescription", shortDesc || "");
            formData.append("longDescription", longDesc || "");
            formData.append("status", String(Number(statusCreate)));
            formData.append("origin", origin || "");
            formData.append("categoryId", categoryId ? String(categoryId) : "");
            formData.append("price", String(Number(price) || 0));

            // === 2) PRODUCT IMAGES — ONLY FILES ===
            files.forEach((file) => {
                formData.append("newImages", file);
            });

            // === 3) VARIANT IMAGES — ONLY FILES ===
            variantsFromForm.forEach((v) => {
                if (v.imageFile) {
                    const sku = v.sku?.trim();
                    if (sku) {
                        formData.append(`variantImage_${sku}`, v.imageFile);
                    }
                }
            });

            // === 4) VARIANTS DATA — NO imageUrl ===
            // === 4) VARIANTS DATA — NO imageUrl ===
            const variantsPayload = variantsFromForm.map((v) => {
                const base = ensureNumber(v.basePrice);
                const promo = ensureNumber(v.promoPrice);

                const prices = [];

                if (base != null) {
                    prices.push({
                        priceType: "base",
                        price: base
                    });
                }

                if (promo != null) {
                    prices.push({
                        priceType: "promo",
                        price: promo,
                        startAt: v.promoStartAt || null,
                        endAt: v.promoEndAt || null
                    });
                }

                return {
                    variantName: v.variant_name.trim(),
                    sku: v.sku.trim(),
                    barcode: v.barcode || "",
                    attributes: v.attributes || {},
                    specs: normalizeSpecs(v.specs),
                    prices
                };
            });


            formData.append("variants", JSON.stringify(variantsPayload));

            // === 5) USER MANUAL ===
            formData.append(
                "userManual",
                JSON.stringify({
                    pdf: null,
                    video: null,
                    steps: userManual.split("\n").map((s) => s.trim()).filter(Boolean),
                })
            );

            // === 6) CAUTION NOTES ===
            formData.append(
                "cautionNotes",
                JSON.stringify(
                    cautionNotes.split("\n").map((s) => s.trim()).filter(Boolean)
                )
            );

            // === SEND REQUEST ===
            const res = await axios.post(
                `${process.env.REACT_APP_API_URL}/products`,
                formData,
                { headers: { "Content-Type": "multipart/form-data" } }
            );

            alert("Thêm sản phẩm thành công!");
        } catch (err) {
            console.error(err);
            alert(err?.message || "Thêm sản phẩm thất bại!");
        } finally {
            setIsSaving(false);
        }
    };



    // ĐÃ CHỈNH SỬA: Sửa giá trị `val: 3` thành `val: 4` để sử dụng Bitmask chuẩn (1, 2, 4)
    const options = [
        { label: "Mới", val: 1, color: "primary" },
        { label: "Nổi bật", val: 2, color: "success" },
        { label: "Hiển thị", val: 4, color: "danger" }, // ĐÃ SỬA: 3 -> 4
    ];

    // ĐÃ XÓA: Hàm toggleStatusNumber cũ (dùng arrayToNumber/numberToArray)

    // ĐÃ XÓA: Hàm numberToArray và arrayToNumber cũ (sử dụng chuỗi số)

    return (
        <div className="modal fade" id="exampleModal" tabIndex={-1} aria-labelledby="exampleModalLabel" aria-hidden="true" data-bs-backdrop="static" data-bs-keyboard={!isSaving}>
            <div className="modal-dialog modal-xl">
                <div className="modal-content">
                    <div className="modal-header">
                        <h1 className="modal-title fs-5" id="exampleModalLabel">Sản phẩm mới</h1>
                        <a type="a" className="btn-close" data-bs-dismiss="modal" aria-label="Close" disabled={isSaving} />
                    </div>
                    <form onSubmit={onSubmit}>
                        <div className="modal-body">
                            <div className="row">
                                <div className="col-8">
                                    <div className="mb-3 text-start">
                                        <label className="form-label">Tên sản phẩm</label>
                                        <input type="text" className={`form-control ${errors.nameproduct ? "is-invalid" : ""}`} value={nameproduct} onChange={(e) => setNameproduct(e.target.value)} />
                                        {errors.nameproduct && <div className="invalid-feedback">{errors.nameproduct}</div>}
                                    </div>
                                    <div className="mb-3 text-start" >
                                        <label className="form-label">Mô tả dài</label>

                                        <ReactQuill
                                            value={longDesc}
                                            onChange={setLongDesc}
                                            className="border rounded overflow-auto"
                                            style={{ height: "250px" }}
                                        />

                                    </div>


                                    <div className="mb-3 text-start">
                                        <label className="form-label">Mô tả ngắn</label>
                                        <RichTextEditor value={shortDesc} onChange={setShortDesc} />
                                    </div>
                                    <div className="mb-3 text-start">
                                        <label className="form-label">Hướng dẫn sử dụng</label>
                                        <RichTextEditor value={userManual} onChange={setUserManual} />
                                    </div>
                                    <div className="mb-3 text-start">
                                        <label className="form-label">Lưu ý an toàn / cảnh báo</label>
                                        <RichTextEditor value={cautionNotes} onChange={setCautionNotes} />
                                    </div>
                                    <div className="d-flex align-items-start border border-2">
                                        <div className="nav flex-column nav-pills border-end w-25 border-end-2">
                                            <a className="nav-link active" data-bs-toggle="pill" data-bs-target="#variants">Biến thể sản phẩm</a>
                                            <a className="nav-link" data-bs-toggle="pill" data-bs-target="#inventory">Kiểm kê kho hàng</a>
                                            <a className="nav-link" data-bs-toggle="pill" data-bs-target="#attributes">Các thuộc tính</a>
                                        </div>
                                        <div className="tab-content w-75 p-2">
                                            <div className="tab-pane fade show active" id="variants">
                                                <VariantForm ref={variantRef} data={variantsFromForm} onChange={setVariantsFromForm} disabled={hasGlobalPrice} />
                                                {hasGlobalPrice && <small className="text-muted">Đang nhập giá chung, không thể thêm biến thể</small>}
                                                {Object.keys(errors).filter(k => k.startsWith("variant_")).map(k => <div key={k} className="text-danger small">{errors[k]}</div>)}
                                            </div>
                                            <div className="tab-pane fade" id="inventory">
                                                <InventoryPanel variants={variantsFromForm} onChange={setInventoryDraft} />
                                            </div>
                                            <div className="tab-pane fade" id="attributes">
                                                <AttributePanel variants={variantsFromForm} onVariantsChange={setVariantsFromForm} />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-4">
                                    <div className="mb-3">
                                        <Image onChange={handleImageChange} onRemove={handleImageRemove} />
                                        {errors.images && <div className="text-danger small">{errors.images}</div>}
                                    </div>
                                    <div className="mb-3">
                                        <Category onChange={setCategoryId} />
                                        {errors.categoryId && <div className="text-danger small">{errors.categoryId}</div>}
                                    </div>
                                    <div className="mb-3 ">
                                        {options.map((opt) => (
                                            <div key={opt.val} className="form-check form-check-inline">
                                                <input
                                                    className="form-check-input"
                                                    type="checkbox"
                                                    value={opt.val}
                                                    id={`status_opt_edit${opt.val}`}
                                                    // ĐÃ CHỈNH SỬA: Sử dụng phép toán Bitwise AND (&) để kiểm tra
                                                    checked={(statusCreate & opt.val) !== 0}
                                                    onChange={() =>
                                                        setStatusCreate((prev) =>

                                                            toggleStatusBitmask(prev, opt.val)
                                                        )
                                                    }
                                                />
                                                <label
                                                    className={`form-check-label text-${opt.color}`}
                                                    htmlFor={`status_opt_edit${opt.val}`}
                                                >
                                                    {opt.label}
                                                </label>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Giá chung (nếu không có biến thể)</label>
                                        <input
                                            type="number"
                                            className="form-control"
                                            value={price}
                                            onChange={(e) => setPrice(e.target.value)}
                                            disabled={hasVariants}
                                        />
                                        {hasVariants && <small className="text-muted">Đang có biến thể, giá chung bị vô hiệu hóa</small>}
                                    </div>
                                    <div className="mb-3 text-start">
                                        <label className="form-label">Xuất xứ</label>
                                        <input type="text" className="form-control" value={origin} onChange={(e) => setOrigin(e.target.value)} />
                                    </div>
                                </div>
                            </div>z
                        </div>
                        <div className="modal-footer">
                            <a type="a" className="btn btn-secondary" data-bs-dismiss="modal" disabled={isSaving}>Đóng</a>
                            <button type="submit" className="btn btn-primary" disabled={isSaving}>{isSaving ? "Đang lưu…" : "Lưu sản phẩm"}</button>
                            {/* ĐÃ CHỈNH SỬA: Đổi <a> thành <button type="submit"> */}
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

// =========================================================================
// HÀM CHUYỂN ĐỔI CHUỖI SỐ CŨ ĐÃ BỊ XÓA HOÀN TOÀN
// =========================================================================