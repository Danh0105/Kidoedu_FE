import React, { useEffect, useState } from "react";
import axios from "axios";
import ProductImages from "../../../components/admin/FormEdit/ProductImages";
import RichTextEditor from "../../../components/admin/RichTextEditor";
import Category from "../../../components/admin/Categories/Category";
import VariantFormEdit from "../../../components/admin/FormEdit/VariantFormEdit";

const MODAL_ID = "modalEditProduct";

// ================= HELPER =================

const STATUS_OPTIONS_BITMASK = [
    { label: "Mới", val: 1, color: "primary" },
    { label: "Nổi bật", val: 2, color: "success" },
    { label: "Hiển thị", val: 4, color: "danger" },
];

// ================= MODAL COMPONENT =================
export default function ModalEditProduct({ product, onUpdated, isOpen, onClosed }) {
    const [form, setForm] = useState({
        productName: "",
        categoryId: "",
        price: "",
        shortDescription: "",
        longDescription: "",
        variants: [],
        images: [],
    });
    const [price, setPrice] = useState("");
    const [variantsFromForm, setVariantsFromForm] = useState([]);
    const [categoryId, setCategoryId] = useState(null);
    const [statusEdu, setStatusEdu] = useState(0);
    const [origin, setOrigin] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    // ================= SYNC PRODUCT -> FORM =================
    const resetForm = () => {
        setForm({
            origin: product?.origin ?? "",
            productName: product.productName ?? "",
            categoryId: product.category?.categoryId ?? "",
            price: product.price ?? "",
            shortDescription: product.shortDescription ?? "",
            longDescription: product.longDescription ?? "",
            variants: product.variants ?? [],
            images: product.images ?? [],
        });
        setPrice(product.price ?? "");
        setVariantsFromForm(product.variants ?? []);
        setCategoryId(product.category?.categoryId ?? null);
        setOrigin(product.origin ?? "");
        setStatusEdu(product.status ?? 0);
    };

    useEffect(() => {
        if (!product) return;

        setForm({
            origin: product.origin || "",
            productName: product.productName || "",
            categoryId: product.category?.categoryId || "",
            price: product.price || "",
            shortDescription: product.shortDescription || "",
            longDescription: product.longDescription || "",
            variants: product.variants || [],
            images: product.images || [],
        });

        setPrice(product.price || "");
        setVariantsFromForm(product.variants || []);
        setCategoryId(product.category?.categoryId || null);
        setOrigin(product.origin || "");
        setStatusEdu(product.status || 0);
    }, [product]);


    // ================= HANDLE INPUT =================
    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleDescriptionChange = (field, value) => {
        setForm((prev) => ({ ...prev, [field]: value }));
    };

    const toggleStatus = (value) => {
        setStatusEdu((prev) => (prev & value ? prev & ~value : prev | value));
    };

    // ================= SUBMIT =================
    const handleSubmit = async () => {
        if (!product?.productId) return;
        setIsLoading(true);

        const formData = new FormData();

        // === 1. Thông tin cơ bản ===
        formData.append("productName", (form.productName || "").trim());
        formData.append("category_id", categoryId ? String(categoryId) : "");
        formData.append("price", String(Number(price) || 0));
        formData.append("origin", (origin || "").trim());
        formData.append("status", String(statusEdu));
        formData.append("shortDescription", form.shortDescription || "");
        formData.append("longDescription", form.longDescription || "");

        // === 2. Ảnh sản phẩm chung ===
        const oldProductImages = form.images
            .filter(img => !img.file && (img.src || img.imageUrl))
            .map(img => ({
                imageUrl: img.src || img.imageUrl,
                altText: img.altText || "",
                isPrimary: !!img.isPrimary,
                publicId: img.publicId || null,
                imageId: img.imageId || null,
            }));

        if (oldProductImages.length > 0) {
            formData.append("images", JSON.stringify(oldProductImages));
        }


        form.images
            .filter(img => img.file instanceof File)
            .forEach(img => formData.append("newImages", img.file));

        // === 3. XỬ LÝ BIẾN THỂ + ẢNH BIẾN THỂ ===
        const processedVariants = variantsFromForm.map(variant => {
            const sku = (variant.sku || "").trim() || `temp_${variant.id}`;
            const keyForImage = variant.imageSkuKey || sku;
            // QUAN TRỌNG: Kiểm tra và gửi ảnh biến thể đúng cách
            if (variant.imageFile) {
                formData.append(`variantImage_${keyForImage}`, variant.imageFile);
            }

            return {
                variantId: variant.variantId || null,
                sku: sku,
                variantName: (variant.variantName || "").trim(),
                barcode: variant.barcode || "",
                attributes: variant.attributes || {},
                specs: variant.specs || [],
                prices: variant.prices || [],

                imageUrl: variant.imageFile
                    ? ""
                    : variant.imageUrl || ""



            };
        });
        formData.append("variants", JSON.stringify(processedVariants));


        // === GỌI API ===
        try {
            const res = await axios.put(
                `${process.env.REACT_APP_API_URL}/products/${product.productId}`,
                formData,
                {
                    headers: { "Content-Type": "multipart/form-data" },
                }
            );

            onUpdated(res.data.data);
            alert("Cập nhật thành công!");

            const modalEl = document.getElementById("btnCloseModalEdit");
            modalEl.click();

        } catch (err) {
            alert("Lỗi: " + (err.response?.data?.message || err.message));
        } finally {
            setIsLoading(false);
        }
    };



    // ================= RENDER STATUS CHECKBOXES =================
    const RenderStatusCheckboxes = () => (
        <div className="d-flex gap-2">
            {STATUS_OPTIONS_BITMASK.map((opt) => (
                <div key={opt.val} className="form-check form-check-inline">
                    <input
                        className="form-check-input"
                        type="checkbox"
                        id={`status_opt_${opt.val}`}
                        checked={(statusEdu & opt.val) !== 0}
                        onChange={() => toggleStatus(opt.val)}
                    />
                    <label className={`form-check-label text-${opt.color}`} htmlFor={`status_opt_${opt.val}`}>
                        {opt.label}
                    </label>
                </div>
            ))}
        </div>
    );
    useEffect(() => {
        const modalEl = document.getElementById(MODAL_ID);

        const handleHidden = () => {
            resetForm();
            onClosed?.();      // 🔥 callback báo modal cha
        };
        modalEl.addEventListener("hidden.bs.modal", handleHidden);

        return () => {
            modalEl.removeEventListener("hidden.bs.modal", handleHidden);
        };
    }, [product]);

    // ================= RENDER =================
    return (
        <div className="modal fade" id={MODAL_ID} tabIndex="-1" aria-hidden="true">
            <div className="modal-dialog modal-xl modal-dialog-centered">
                <div className="modal-content">
                    {/* Header */}
                    <div className="modal-header">
                        <h5 className="modal-title">Chỉnh sửa sản phẩm</h5>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" />
                    </div>

                    {/* Body */}
                    <div className="modal-body">
                        <div className="row">
                            {/* LEFT */}
                            <div className="col-lg-8 col-md-12">
                                <div className="mb-3">
                                    <label className="form-label">Tên sản phẩm</label>
                                    <input
                                        type="text"
                                        name="productName"
                                        className="form-control"
                                        value={form.productName}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">Mô tả ngắn</label>
                                    <RichTextEditor
                                        key={product?.productId + "_short" ?? "empty"}
                                        value={form.shortDescription}
                                        onChange={(val) => handleDescriptionChange("shortDescription", val)}
                                        isOpen={isOpen}
                                    />
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">Mô tả dài</label>
                                    <RichTextEditor
                                        key={product?.productId + "_short" ?? "empty"}
                                        value={form.longDescription}
                                        onChange={(val) => handleDescriptionChange("longDescription", val)}
                                        isOpen={isOpen}
                                    />
                                </div>

                                <hr />

                                {/* Tab Panel: Biến thể / Kho / Thuộc tính */}
                                <div className="d-flex align-items-start border border-2">
                                    <div className="nav flex-column nav-pills w-25 ">
                                        <a className="nav-link active" data-bs-toggle="pill" data-bs-target="#variantsedit">Biến thể sản phẩm</a>
                                    </div>

                                    <div className="tab-content w-75 p-2">
                                        <div className="tab-pane fade show active" id="variantsedit">
                                            <VariantFormEdit data={variantsFromForm} onChange={setVariantsFromForm} disabled={Number(form.price || product?.price) > 0} />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* RIGHT */}
                            <div className="col-lg-4 col-md-12">
                                <ProductImages form={form} setForm={setForm} />
                                <div className="mb-3">
                                    <Category categoryId={categoryId} onChange={setCategoryId} />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Trạng thái</label>
                                    <RenderStatusCheckboxes />
                                </div>
                                <div className="mb-3 text-start">
                                    <label className="form-label">Xuất xứ</label>
                                    <input type="text" className="form-control" value={origin} onChange={(e) => setOrigin(e.target.value)} />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <button
                        type="button"
                        id="btnCloseModalEdit"
                        style={{ display: "none" }}
                        data-bs-dismiss="modal"
                    ></button>

                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Hủy</button>
                        <button type="button" className="btn btn-primary" disabled={isLoading} onClick={handleSubmit}>
                            {isLoading ? "Đang lưu..." : "Lưu thay đổi"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}