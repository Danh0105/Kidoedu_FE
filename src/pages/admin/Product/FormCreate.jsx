import React, { useRef, useState } from "react";
import axios from "axios";

import Category from "../../../components/admin/Categories/Category";
import ProductImages from "../../../components/admin/FormEdit/ProductImages";
import RichTextEditor from "../../../components/admin/RichTextEditor";
import VariantFormEdit from "../../../components/admin/FormEdit/VariantFormEdit";
import InventoryPanel from "../../../components/admin/FormCreate/InventoryPanel";

import { buildVariantsPayload } from "../../../utils/productHelpers";

/* =========================================================================
   HELPERS
   ========================================================================= */

const toggleStatusBitmask = (current, value) =>
    (current & value) !== 0 ? current & ~value : current | value;

const splitLines = (text = "") =>
    text
        .split("\n")
        .map(s => s.trim())
        .filter(Boolean);

const appendFiles = (formData, key, files = []) => {
    files.forEach(file => {
        if (file instanceof File) {
            formData.append(key, file);
        }
    });
};
/* =========================================================================
   COMPONENT
   ========================================================================= */

export default function FormCreate({ onProductAdded }) {
    const [categoryId, setCategoryId] = useState(null);
    const [statusCreate, setStatusCreate] = useState(0);
    const [variantsFromForm, setVariantsFromForm] = useState([]);
    const [inventoryDraft, setInventoryDraft] = useState({});
    const [isSaving, setIsSaving] = useState(false);
    const [errors, setErrors] = useState({});


    const [form, setForm] = useState({
        productName: "",
        shortDescription: "",
        longDescription: "",
        origin: "",
        images: [],
        userManual: "",
        cautionNotes: "",
    });

    /* =========================================================================
       SUBMIT
       ========================================================================= */

    // const onSubmit = async (e) => {
    //     e.preventDefault();
    //     setIsSaving(true);

    //     try {
    //         const formData = new FormData();

    //         // ===== BASIC INFO =====
    //         formData.append("productName", form.productName.trim());
    //         formData.append("shortDescription", form.shortDescription || "");
    //         formData.append("longDescription", form.longDescription || "");
    //         formData.append("origin", form.origin || "");
    //         formData.append("status", String(statusCreate));
    //         formData.append("categoryId", String(categoryId));

    //         // ===== PRODUCT IMAGES =====
    //         appendFiles(
    //             formData,
    //             "newImages",
    //             form.images
    //                 .filter(img => img.file instanceof File)
    //                 .map(img => img.file)
    //         );

    //         // ===== VARIANT IMAGES =====
    //         variantsFromForm.forEach(v => {
    //             if (v.imageFile && v.sku) {
    //                 formData.append(`variantImage_${v.sku}`, v.imageFile);
    //             }
    //         });

    //         // ===== VARIANTS + INVENTORY =====

    //         const variantsPayload = buildVariantsPayload(
    //             variantsFromForm.map(v => ({
    //                 ...v,
    //                 inventory: inventoryDraft ?? [],
    //             }))
    //         );

    //         formData.append("variants", JSON.stringify(variantsPayload));

    //         // ===== USER MANUAL =====
    //         formData.append(
    //             "userManual",
    //             JSON.stringify({
    //                 pdf: null,
    //                 video: null,
    //                 steps: splitLines(form.userManual),
    //             })
    //         );

    //         // ===== CAUTION NOTES =====
    //         formData.append(
    //             "cautionNotes",
    //             JSON.stringify(splitLines(form.cautionNotes))
    //         );

    //         // ===== API =====
    //         const res = await axios.post(
    //             `${process.env.REACT_APP_API_URL}/products`,
    //             formData
    //         );

    //         alert("Thêm sản phẩm thành công!");
    //         console.log(res.data.data);

    //         onProductAdded(res.data.data);

    //     } catch (err) {
    //         console.error(err);
    //         alert("Thêm sản phẩm thất bại");
    //     } finally {
    //         setIsSaving(false);
    //     }
    // };
    const validateForm = () => {
    if (!form.productName?.trim()) return "Tên sản phẩm không được để trống";
    if (!categoryId) return "Vui lòng chọn danh mục";
    if (!form.shortDescription?.trim()) return "Mô tả ngắn không được để trống";
    if (!variantsFromForm.length) return "Phải có ít nhất 1 biến thể";

    for (let i = 0; i < variantsFromForm.length; i++) {
        const v = variantsFromForm[i];
        if (!v.sku) return `Biến thể ${i + 1}: SKU không được để trống`;  
              
        if (!v.imageFile) return `Biến thể ${i + 1}: Chưa chọn hình ảnh`;
    }

    return null;
};

    const onSubmit = async (e) => {
        
    e.preventDefault();

    const errorMessage = validateForm();
    if (errorMessage) {
        alert(errorMessage);
        return;
    }

    setIsSaving(true);

    try {
        const formData = new FormData();

        // ===== BASIC INFO =====
        formData.append("productName", form.productName.trim());
        formData.append("shortDescription", form.shortDescription || "");
        formData.append("longDescription", form.longDescription || "");
        formData.append("origin", form.origin || "");
        formData.append("status", String(statusCreate));
        formData.append("categoryId", String(categoryId));

        // ===== PRODUCT IMAGES =====
        appendFiles(
            formData,
            "newImages",
            form.images
                .filter(img => img.file instanceof File)
                .map(img => img.file)
        );

        // ===== VARIANT IMAGES =====
        variantsFromForm.forEach(v => {
            if (v.imageFile && v.sku) {
                formData.append(`variantImage_${v.sku}`, v.imageFile);
            }
        });

        // ===== VARIANTS + INVENTORY =====
        const variantsPayload = buildVariantsPayload(
            variantsFromForm.map(v => ({
                ...v,
                inventory: inventoryDraft ?? [],
            }))
        );

        formData.append("variants", JSON.stringify(variantsPayload));

        // ===== USER MANUAL =====
        formData.append(
            "userManual",
            JSON.stringify({
                pdf: null,
                video: null,
                steps: splitLines(form.userManual),
            })
        );

        // ===== CAUTION NOTES =====
        formData.append(
            "cautionNotes",
            JSON.stringify(splitLines(form.cautionNotes))
        );

        const res = await axios.post(
            `${process.env.REACT_APP_API_URL}/products`,
            formData
        );

        alert("Thêm sản phẩm thành công!");
        onProductAdded(res.data.data);

    } catch (err) {
        handleApiError(err);
    } finally {
        setIsSaving(false);
    }
};

const handleApiError = (err) => {
    if (err.response) {
        alert(err.response.data?.message || "Dữ liệu không hợp lệ");
    } else {
        alert(err.message || "Lỗi không xác định");
    }
};

//end of onSubmit

    /* =========================================================================
       STATUS OPTIONS
       ========================================================================= */

    const statusOptions = [
        { label: "Mới", val: 1, color: "primary" },
        { label: "Nổi bật", val: 2, color: "success" },
        { label: "Hiển thị", val: 4, color: "danger" },
    ];

    /* =========================================================================
       RENDER
       ========================================================================= */

    return (
        <div
            className="modal fade"
            id="exampleModal"
            tabIndex={-1}
            data-bs-backdrop="static"
            data-bs-keyboard={!isSaving}
        >
            <div className="modal-dialog modal-xl">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Sản phẩm mới</h5>
                        <a
                            className="btn-close"
                            data-bs-dismiss="modal"
                            disabled={isSaving}
                        />
                    </div>

                    <form onSubmit={onSubmit}>
                        <div className="modal-body">
                            <div className="row">
                                {/* LEFT */}
                                <div className="col-8">
                                    <div className="mb-3">
                                        <label className="form-label">Tên sản phẩm</label>
                                        <input
                                            className="form-control"
                                            value={form.productName}
                                            onChange={(e) =>
                                                setForm(p => ({ ...p, productName: e.target.value }))
                                            }
                                        />
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label">Mô tả dài</label>
                                        <RichTextEditor
                                            value={form.longDescription}
                                            onChange={(v) =>
                                                setForm(p => ({ ...p, longDescription: v }))
                                            }
                                        />
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label">Mô tả ngắn</label>
                                        <RichTextEditor
                                            value={form.shortDescription}
                                            onChange={(v) =>
                                                setForm(p => ({ ...p, shortDescription: v }))
                                            }
                                        />
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label">Hướng dẫn sử dụng</label>
                                        <RichTextEditor
                                            value={form.userManual}
                                            onChange={(v) =>
                                                setForm(p => ({ ...p, userManual: v }))
                                            }
                                        />
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label">Lưu ý / cảnh báo</label>
                                        <RichTextEditor
                                            value={form.cautionNotes}
                                            onChange={(v) =>
                                                setForm(p => ({ ...p, cautionNotes: v }))
                                            }
                                        />
                                    </div>

                                    <div className="d-flex border">
                                        <div className="nav flex-column nav-pills w-25 border-end">
                                            <a className="nav-link active" data-bs-toggle="pill" data-bs-target="#variants">
                                                Biến thể
                                            </a>
                                            <a className="nav-link" data-bs-toggle="pill" data-bs-target="#inventory">
                                                Kho
                                            </a>
                                        </div>

                                        <div className="tab-content w-75 p-2">
                                            <div className="tab-pane fade show active" id="variants">
                                                <VariantFormEdit
                                                    data={variantsFromForm}
                                                    onChange={setVariantsFromForm}
                                                />
                                            </div>
                                            <div className="tab-pane fade" id="inventory">
                                                <InventoryPanel
                                                    variants={variantsFromForm}
                                                    onChange={setInventoryDraft}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* RIGHT */}
                                <div className="col-4">
                                    <ProductImages form={form} setForm={setForm} />

                                    <div className="mb-3">
                                        <Category onChange={setCategoryId} />
                                    </div>

                                    <div className="mb-3">
                                        {statusOptions.map(opt => (
                                            <div key={opt.val} className="form-check form-check-inline">
                                                <input
                                                    type="checkbox"
                                                    className="form-check-input"
                                                    checked={(statusCreate & opt.val) !== 0}
                                                    onChange={() =>
                                                        setStatusCreate(prev =>
                                                            toggleStatusBitmask(prev, opt.val)
                                                        )
                                                    }
                                                />
                                                <label className={`form-check-label text-${opt.color}`}>
                                                    {opt.label}
                                                </label>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label">Xuất xứ</label>
                                        <input
                                            className="form-control"
                                            value={form.origin}
                                            onChange={(e) =>
                                                setForm(p => ({ ...p, origin: e.target.value }))
                                            }
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="modal-footer">
                            <a
                                type="button"
                                className="btn btn-secondary"
                                data-bs-dismiss="modal"
                                disabled={isSaving}
                            >
                                Đóng
                            </a>
                            <button
                                type="submit"
                                className="btn btn-primary"
                                disabled={isSaving}
                            >
                                {isSaving ? "Đang lưu…" : "Lưu sản phẩm"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
