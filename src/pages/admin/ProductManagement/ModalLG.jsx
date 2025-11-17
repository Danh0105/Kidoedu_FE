import React, { useState } from "react";
import Category from "./Category";
import Image from "./Image";
import RichTextEditor from "../../../components/admin/RichTextEditor";
import axios from "axios";
import ReactQuill from "react-quill-new";
import InventoryPanel from "./InventoryPanel";
import AttributePanel from "./AttributePanel";
import VariantForm from "./VariantForm";

/**
 * ModalLG: Tạo sản phẩm mới + biến thể + phiếu nhập kho ban đầu
 */
export default function ModalLG({ onProductAdded }) {
    // Core fields
    const [categoryId, setCategoryId] = useState(null);
    const [count, setCount] = useState(1);
    const [shortDesc, setShortDesc] = useState("");
    const [userManual, setUserManual] = useState("");
    const [cautionNotes, setCautionNotes] = useState("");
    const [origin, setOrigin] = useState("");
    const [specs, setSpecs] = useState("");
    const [longDesc, setLongDesc] = useState("");
    const [nameproduct, setNameproduct] = useState("");
    const [price, setPrice] = useState(0);
    const [status, setStatus] = useState(""); // 1: Mới, 2: Nổi bật, 3: Hiển thị
    const [files, setFiles] = useState([]); // Array<File>

    // Biến thể & kiểm kê
    const [variantsFromForm, setVariantsFromForm] = useState([]); // nhận từ VariantForm
    const [inventoryDraft, setInventoryDraft] = useState(null);   // nhận từ InventoryPanel

    // UI states
    const [errors, setErrors] = useState({});
    const [isSaving, setIsSaving] = useState(false);

    const CLOUD_NAME = "dlnkeb4dm";
    const UPLOAD_PRESET = "kidoedu";

    const stripHtml = (html) => {
        const tmp = document.createElement("div");
        tmp.innerHTML = html ?? "";
        return tmp.textContent || tmp.innerText || "";
    };

    const handleImageChange = (fs) => {
        // Expecting `fs` to be an array of File objects from <Image/>
        setFiles(fs);
    };

    const handleImageRemove = (_removedFile, idx) => {
        setFiles((prev) => prev.filter((_, i) => i !== idx));
    };

    // Chuẩn hoá specs để luôn có label là string
    const normalizeSpecs = (rawSpecs) => {
        const arr = Array.isArray(rawSpecs) ? rawSpecs : [];
        return arr
            .filter((s) => s && (s.key || s.label || s.value))
            .map((s, idx) => {
                const key =
                    (s.key !== undefined && s.key !== null
                        ? String(s.key)
                        : String(s.label || "").trim()) || `spec_${idx + 1}`;

                const label =
                    (s.label !== undefined && s.label !== null
                        ? String(s.label)
                        : String(s.key || "").trim()) || `Thông số ${idx + 1}`;

                return {
                    key: key.trim(),
                    label: label.trim(), // 👈 luôn là string
                    value: String(s.value ?? "").trim(),
                    unit: s.unit ?? null,
                    type:
                        s.type === "number" || s.type === "boolean"
                            ? s.type
                            : "text",
                    group: s.group ?? null,
                    note: s.note ?? null,
                    order:
                        typeof s.order === "number"
                            ? s.order
                            : idx + 1,
                };
            });
    };

    const uploadAll = async () => {
        if (!files?.length) return [];
        const uploads = files.map((file) => {
            const fd = new FormData();
            fd.append("file", file);
            fd.append("upload_preset", UPLOAD_PRESET);
            return fetch(
                `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
                {
                    method: "POST",
                    body: fd,
                }
            )
                .then((r) => r.json())
                .then((data) => {
                    if (!data?.secure_url) throw new Error("Upload thất bại");
                    return data.secure_url;
                });
        });
        return Promise.all(uploads);
    };

    const onSubmit = async (evt) => {
        evt.preventDefault();
        /*    if (!validate()) return; */
        try {
            setIsSaving(true);

            const uploadedUrls = await uploadAll();

            // 1) User manual dạng object
            const userManualObj = {
                pdf: null, // hiện chưa có UI nhập
                video: null,
                steps: userManual
                    ? userManual
                        .split("\n")
                        .map((s) => s.trim())
                        .filter(Boolean)
                    : [],
            };

            // 2) Caution notes thành mảng string
            const cautionNotesArr = cautionNotes
                ? cautionNotes
                    .split("\n")
                    .map((s) => s.trim())
                    .filter(Boolean)
                : [];

            // 3) Ảnh theo đúng format images[]
            const imagesPayload = (uploadedUrls || []).map((url, idx) => ({
                image_url: url,
                alt_text: `${nameproduct || "Ảnh sản phẩm"} - ${idx + 1}`,
                is_primary: idx === 0,
            }));

            // 4) Biến thể + giá (lấy từ VariantForm)
            console.log(variantsFromForm);

            const variantsPayload = (variantsFromForm ?? []).map((v) => {
                // basePrice & promoPrice do VariantForm trả ra
                const base = v.basePrice ?? price; // fallback sang price sản phẩm nếu chưa set riêng
                const promo = v.promoPrice;
                const imageUrl = v.image_url
                const prices = [];

                if (base != null && base !== "") {
                    prices.push({
                        priceType: "base",
                        price: Number(base) || 0,

                        currencyCode: "VND",
                        startAt: new Date().toISOString(),
                        endAt: null,
                    });
                }

                if (promo != null && promo !== "") {
                    prices.push({
                        priceType: "promo",
                        price: Number(promo) || 0,
                        currencyCode: "VND",
                        startAt: new Date().toISOString(),
                        endAt: null,
                    });
                }

                return {
                    variantName: v.variant_name || "",
                    sku: v.sku || "",
                    imageUrl: imageUrl,
                    barcode: v.barcode || "",
                    status: Number(v.status ?? 1),
                    attributes: v.attributes || {},
                    specs: normalizeSpecs(v.specs), // 👈 dùng hàm chuẩn hoá
                    prices,
                };
            });

            // 5) initialReceipt (nếu có nhập ở tab Kiểm kê)
            let initialReceipt = undefined;
            if (inventoryDraft) {
                initialReceipt = {
                    supplierName: inventoryDraft.supplierName || "",
                    supplierPhone: inventoryDraft.supplierPhone || "",
                    supplierEmail: inventoryDraft.supplierEmail || "",
                    supplierAddress: inventoryDraft.supplierAddress || "",
                    supplierNote: inventoryDraft.supplierNote || "",
                    receiptCode: inventoryDraft.receiptCode || "",
                    receiptDate:
                        inventoryDraft.receiptDate ||
                        new Date().toISOString().slice(0, 10),
                    referenceNo: inventoryDraft.referenceNo || "",
                    note: inventoryDraft.note || "",
                    items: (inventoryDraft.items || []).map((it) => {
                        // cố gắng map từ tên biến thể sang sku
                        const matchedVariant =
                            (variantsFromForm ?? []).find(
                                (vv) => vv.variant_name === it.variantName
                            ) || {};
                        return {
                            variantSku:
                                it.variantSku || matchedVariant.sku || "",
                            quantity: Number(it.qty) || 0,
                            unitCost: Number(it.unitCost) || 0,
                        };
                    }),
                };
            }

            // 6) Build payload đúng format backend yêu cầu
            const payload = {
                product_name: nameproduct.trim(),
                short_description: stripHtml(shortDesc) || null,
                long_description: longDesc || null,
                status: status ? Number(status) : 1,
                origin: origin || null,
                user_manual: userManualObj,
                caution_notes: cautionNotesArr,
                category_id: categoryId ? Number(categoryId) : null,
                images: imagesPayload,
                variants: variantsPayload,
                ...(initialReceipt ? { initialReceipt } : {}),
            };



            const res = await axios.post(
                "http://localhost:3000/products",
                payload
            );

            if (onProductAdded) onProductAdded(res?.data?.data);

            alert("Thêm sản phẩm thành công!");

            setErrors({});
            // (tuỳ bạn có muốn reset form sau khi lưu hay không)
        } catch (err) {
            console.error("Lỗi khi thêm sản phẩm:", err);
            console.error("Server trả về:", err?.response?.data);
            alert(err?.message || "Thêm sản phẩm thất bại!");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div
            className="modal fade"
            id="exampleModal"
            tabIndex={-1}
            aria-labelledby="exampleModalLabel"
            aria-hidden="true"
            data-bs-backdrop="static"
            data-bs-keyboard={!isSaving}
        >
            <div className="modal-dialog modal-xl">
                <div className="modal-content">
                    <div className="modal-header">
                        <h1 className="modal-title fs-5" id="exampleModalLabel">
                            Sản phẩm mới
                        </h1>
                        <button
                            type="button"
                            className="btn-close"
                            data-bs-dismiss="modal"
                            aria-label="Close"
                            disabled={isSaving}
                        />
                    </div>

                    <form onSubmit={onSubmit}>
                        <div className="modal-body">
                            <div className="container text-center">
                                <div className="row">
                                    {/* Cột trái: thông tin chính */}
                                    <div className="col-8">
                                        {/* Tên sản phẩm */}
                                        <div className="text-start mb-3">
                                            <label
                                                htmlFor="nameproduct"
                                                className="form-label"
                                            >
                                                Tên sản phẩm
                                            </label>
                                            <input
                                                id="nameproduct"
                                                onChange={(e) =>
                                                    setNameproduct(e.target.value)
                                                }
                                                value={nameproduct}
                                                type="text"
                                                className={`form-control ${errors.nameproduct
                                                    ? "is-invalid"
                                                    : ""
                                                    }`}
                                                placeholder="VD: Quạt Mini USB để bàn"
                                            />
                                            {errors.nameproduct && (
                                                <div className="invalid-feedback">
                                                    {errors.nameproduct}
                                                </div>
                                            )}
                                        </div>

                                        {/* Mô tả dài */}
                                        <div className="text-start mb-3">
                                            <label className="form-label">
                                                Mô tả dài
                                            </label>
                                            <ReactQuill
                                                placeholder="Mô tả dài"
                                                value={longDesc}
                                                onChange={setLongDesc}
                                            />
                                            <style>
                                                {`.ql-editor{line-height:1.5em;max-height:20em;overflow-y:auto;}`}
                                            </style>
                                        </div>

                                        {/* Mô tả ngắn */}
                                        <div className="text-start mb-3">
                                            <label className="form-label">
                                                Mô tả ngắn
                                            </label>
                                            <RichTextEditor
                                                placeholder="Mô tả ngắn"
                                                value={shortDesc}
                                                onChange={(val) => setShortDesc(val)}
                                            />
                                        </div>

                                        {/* Hướng dẫn sử dụng */}
                                        <div className="text-start mb-3">
                                            <label className="form-label">
                                                Hướng dẫn sử dụng
                                            </label>
                                            <RichTextEditor
                                                placeholder="Hướng dẫn sử dụng"
                                                value={userManual}
                                                onChange={(val) => setUserManual(val)}
                                            />
                                        </div>

                                        {/* Lưu ý an toàn */}
                                        <div className="text-start mb-3">
                                            <label className="form-label">
                                                Lưu ý an toàn / cảnh báo
                                            </label>
                                            <RichTextEditor
                                                placeholder="Lưu ý an toàn / cảnh báo khi dùng"
                                                value={cautionNotes}
                                                onChange={(val) => setCautionNotes(val)}
                                            />
                                        </div>

                                        {/* Trạng thái & Tabs Dữ liệu sản phẩm */}
                                        <div className="text-start">
                                            <div className="d-flex justify-content-between w-100">
                                                <div className="fw-semibold mb-2">
                                                    Dữ liệu sản phẩm
                                                </div>
                                                <div>
                                                    <div className="d-flex flex-wrap gap-3 pt-1">
                                                        {[
                                                            {
                                                                label: "Mới",
                                                                val: 1,
                                                                corlor: "primary",
                                                            },
                                                            {
                                                                label: "Nổi bật",
                                                                val: 2,
                                                                corlor: "success",
                                                            },
                                                            {
                                                                label: "Hiển thị",
                                                                val: 3,
                                                                corlor: "danger",
                                                            },
                                                        ].map((o) => (
                                                            <div
                                                                className="form-check"
                                                                key={o.val}
                                                            >
                                                                <input
                                                                    className="form-check-input"
                                                                    type="radio"
                                                                    name="variant-status"
                                                                    id={`st-${o.val}`}
                                                                    checked={
                                                                        Number(status) ===
                                                                        o.val
                                                                    }
                                                                    onChange={() =>
                                                                        setStatus(o.val)
                                                                    }
                                                                />
                                                                <label
                                                                    className={`form-check-label text-${o.corlor}`}
                                                                    htmlFor={`st-${o.val}`}
                                                                >
                                                                    {o.label}
                                                                </label>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="d-flex align-items-start border border-2">
                                                {/* Tabs nav */}
                                                <div
                                                    style={{ fontSize: "15px" }}
                                                    className="nav flex-column nav-pills border-end w-25 border-end-2"
                                                    id="v-pills-tab"
                                                    role="tablist"
                                                    aria-orientation="vertical"
                                                >
                                                    <button
                                                        className="text-start nav-link rounded-0 active"
                                                        id="v-pills-home-tab"
                                                        data-bs-toggle="pill"
                                                        data-bs-target="#v-pills-home"
                                                        type="button"
                                                        role="tab"
                                                        aria-controls="v-pills-home"
                                                        aria-selected="true"
                                                    >
                                                        Biến thể sản phẩm
                                                    </button>
                                                    <button
                                                        className="text-start nav-link rounded-0"
                                                        id="v-pills-profile-tab"
                                                        data-bs-toggle="pill"
                                                        data-bs-target="#v-pills-profile"
                                                        type="button"
                                                        role="tab"
                                                        aria-controls="v-pills-profile"
                                                        aria-selected="false"
                                                    >
                                                        Kiểm kê kho hàng
                                                    </button>
                                                    <button
                                                        className="text-start nav-link rounded-0"
                                                        id="v-pills-settings-tab"
                                                        data-bs-toggle="pill"
                                                        data-bs-target="#v-pills-settings"
                                                        type="button"
                                                        role="tab"
                                                        aria-controls="v-pills-settings"
                                                        aria-selected="false"
                                                    >
                                                        Các thuộc tính
                                                    </button>
                                                </div>

                                                {/* Tabs content */}
                                                <div
                                                    className="tab-content w-75 p-2"
                                                    id="v-pills-tabContent"
                                                >
                                                    {/* Biến thể sản phẩm */}
                                                    <div
                                                        className="tab-pane fade active show h-100 p-2"
                                                        id="v-pills-home"
                                                        role="tabpanel"
                                                        aria-labelledby="v-pills-home-tab"
                                                    >
                                                        <VariantForm
                                                            productId={0}
                                                            onSaved={(out) => {
                                                                // tuỳ bạn muốn làm gì khi lưu 1 biến thể
                                                            }}
                                                            onVariantsChange={
                                                                setVariantsFromForm
                                                            }
                                                        />
                                                    </div>

                                                    {/* Kiểm kê kho hàng */}
                                                    <div
                                                        className="tab-pane fade h-100 p-2"
                                                        id="v-pills-profile"
                                                        role="tabpanel"
                                                    >
                                                        <InventoryPanel
                                                            variants={variantsFromForm}
                                                            onSaved={null}
                                                            onChange={setInventoryDraft}
                                                        />
                                                    </div>

                                                    {/* Thuộc tính sản phẩm */}
                                                    <div
                                                        className="tab-pane fade h-100 p-2"
                                                        id="v-pills-settings"
                                                        role="tabpanel"
                                                    >
                                                        <AttributePanel
                                                            variants={variantsFromForm}
                                                            onVariantsChange={
                                                                setVariantsFromForm
                                                            }
                                                        />
                                                    </div>

                                                    <div
                                                        className="tab-pane fade h-100 p-2"
                                                        id="v-pills-advanced"
                                                        role="tabpanel"
                                                    >
                                                        <div className="text-muted small">
                                                            (Tuỳ chọn) Trường nâng cao
                                                            khác…
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Cột phải: ảnh + danh mục */}
                                    <div className="col-4">
                                        {/* Images */}
                                        <div className="mb-3 text-start">
                                            <Image
                                                onChange={handleImageChange}
                                                onRemove={handleImageRemove}
                                            />
                                            {errors.images && (
                                                <div className="text-danger small mt-1">
                                                    {errors.images}
                                                </div>
                                            )}
                                        </div>

                                        {/* Category */}
                                        <div className="mb-3 text-start">
                                            <Category onChange={setCategoryId} />
                                            {errors.categoryId && (
                                                <div className="text-danger small mt-1">
                                                    {errors.categoryId}
                                                </div>
                                            )}
                                        </div>

                                        {/* Bạn có thể thêm input Giá chung sản phẩm ở đây nếu muốn */}
                                        {/* <div className="mb-3 text-start">
                                            <label className="form-label">Giá chung</label>
                                            <input
                                                type="number"
                                                className={`form-control ${
                                                    errors.price ? "is-invalid" : ""
                                                }`}
                                                value={price}
                                                onChange={(e) => setPrice(e.target.value)}
                                            />
                                            {errors.price && (
                                                <div className="invalid-feedback">
                                                    {errors.price}
                                                </div>
                                            )}
                                        </div> */}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="modal-footer">
                            <button
                                type="button"
                                className="btn btn-secondary"
                                data-bs-dismiss="modal"
                                disabled={isSaving}
                            >
                                Đóng
                            </button>
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
