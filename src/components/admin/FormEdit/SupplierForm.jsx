import React, { useEffect, useState } from "react";

const initialState = {
    supplierName: "",
    phone: "",
    email: "",
    address: "",
    note: "",
    refCode: "",
};

export default function SupplierForm({ onCancel, onSubmit, initialData }) {
    const [form, setForm] = useState(initialState);
    const [errors, setErrors] = useState({});

    const handleChange = (field) => (e) => {
        setForm((prev) => ({ ...prev, [field]: e.target.value }));
    };

    const validate = () => {
        const newErrors = {};
        if (!form.supplierName.trim()) {
            newErrors.supplierName = "Tên nhà cung cấp là bắt buộc";
        }
        if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
            newErrors.email = "Email không hợp lệ";
        }
        if (form.phone && !/^[0-9+\s\-]{6,20}$/.test(form.phone)) {
            newErrors.phone = "Số điện thoại không hợp lệ";
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = () => {
        if (!validate()) return;

        // Chuẩn hóa data và đổi tên field cho khớp InventoryPanel / ModalLG
        const payload = {
            supplierName: form.supplierName.trim(),
            phone: form.phone.trim() || "",
            email: form.email.trim() || "",
            address: form.address.trim() || "",
            note: form.note.trim() || "",
        };

        onSubmit?.(payload);
    };

    return (
        <div className="p-3">
            <div className="row g-3 mb-2">
                {/* Tên nhà cung cấp */}
                <div className="col-12 col-md-6">
                    <label className="form-label fw-semibold">
                        Tên nhà cung cấp <span className="text-danger">*</span>
                    </label>
                    <input
                        type="text"
                        className={`form-control rounded-3 ${errors.supplierName ? "is-invalid" : ""
                            }`}
                        placeholder="VD: Công ty TNHH Simpleh"
                        value={form.supplierName}
                        onChange={handleChange("supplierName")}
                    />
                    {errors.supplierName && (
                        <div className="invalid-feedback">
                            {errors.supplierName}
                        </div>
                    )}
                </div>

                {/* Số điện thoại */}
                <div className="col-12 col-md-6">
                    <label className="form-label fw-semibold">Số điện thoại</label>
                    <input
                        type="text"
                        className={`form-control rounded-3 ${errors.phone ? "is-invalid" : ""
                            }`}
                        placeholder="VD: 0909 123 456"
                        value={form.phone}
                        onChange={handleChange("phone")}
                    />
                    {errors.phone && (
                        <div className="invalid-feedback">{errors.phone}</div>
                    )}
                </div>
            </div>

            <div className="row g-3 mb-2">
                {/* Email */}
                <div className="col-12">
                    <label className="form-label fw-semibold">Email</label>
                    <input
                        type="email"
                        className={`form-control rounded-3 ${errors.email ? "is-invalid" : ""
                            }`}
                        placeholder="VD: contact@simpleh.vn"
                        value={form.email}
                        onChange={handleChange("email")}
                    />
                    {errors.email && (
                        <div className="invalid-feedback">{errors.email}</div>
                    )}
                </div>
            </div>

            {/* Địa chỉ */}
            <div className="mb-3">
                <label className="form-label fw-semibold">Địa chỉ</label>
                <input
                    type="text"
                    className="form-control rounded-3"
                    placeholder="VD: 256/10, Phường X, Quận Y, TP.HCM"
                    value={form.address}
                    onChange={handleChange("address")}
                />
            </div>

            {/* Ghi chú */}
            <div className="mb-3">
                <label className="form-label fw-semibold">Ghi chú</label>
                <textarea
                    className="form-control rounded-3"
                    rows={3}
                    placeholder="Thêm thông tin về công nợ, người liên hệ, giờ làm việc..."
                    value={form.note}
                    onChange={handleChange("note")}
                />
            </div>

            {/* Nút hành động */}
            <div className="d-flex justify-content-end gap-2 pt-2 border-top">
                <button
                    type="button"
                    className="btn btn-outline-secondary px-4"
                    onClick={onCancel}
                >
                    Hủy
                </button>
                <button
                    type="button"
                    className="btn btn-primary px-4"
                    onClick={handleSubmit}   // 👈 không phải submit form thật
                >
                    Lưu nhà cung cấp
                </button>
            </div>
        </div>
    );
}
