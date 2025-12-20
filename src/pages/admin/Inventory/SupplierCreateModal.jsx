import React, { useState } from "react";
import axios from "axios";

const API_BASE = process.env.REACT_APP_API_URL;

export default function SupplierCreateModal({ show, onClose, onSaved }) {
    const [form, setForm] = useState({
        supplierName: "",
        phone: "",
        email: "",
        address: "",
        note: "",
    });

    const update = (key, value) => {
        setForm((prev) => ({ ...prev, [key]: value }));
    };

    const save = async () => {
        if (!form.supplierName.trim()) {
            alert("Vui lòng nhập tên nhà cung cấp!");
            return;
        }

        try {
            await axios.post(`${API_BASE}/suppliers`, form);
            onSaved && onSaved();
            onClose();
        } catch (err) {
            console.error("Lỗi tạo nhà cung cấp:", err);
            alert("Không thể tạo nhà cung cấp!");
        }
    };

    if (!show) return null;

    return (
        <div
            className="modal fade show"
            style={{ display: "block", background: "rgba(0,0,0,0.4)" }}
        >
            <div className="modal-dialog modal-lg">
                <div className="modal-content">

                    {/* HEADER */}
                    <div className="modal-header">
                        <h5 className="modal-title fw-semibold">
                            Thêm nhà cung cấp
                        </h5>
                        <button className="btn-close" onClick={onClose}></button>
                    </div>

                    {/* BODY */}
                    <div className="modal-body">

                        <div className="row g-3">

                            {/* TÊN + SĐT */}
                            <div className="col-md-6">
                                <label className="form-label fw-semibold">
                                    Tên nhà cung cấp <span className="text-danger">*</span>
                                </label>
                                <input
                                    className="form-control"
                                    placeholder="VD: Công ty TNHH Simple"
                                    value={form.supplierName}
                                    onChange={(e) =>
                                        update("supplierName", e.target.value)
                                    }
                                />
                            </div>

                            <div className="col-md-6">
                                <label className="form-label fw-semibold">Số điện thoại</label>
                                <input
                                    className="form-control"
                                    placeholder="VD: 0909 123 456"
                                    value={form.phone}
                                    onChange={(e) => update("phone", e.target.value)}
                                />
                            </div>

                            {/* EMAIL + MÃ THAM CHIẾU */}
                            <div className="col-md-6">
                                <label className="form-label fw-semibold">Email</label>
                                <input
                                    className="form-control"
                                    placeholder="VD: contact@simpleh.vn"
                                    value={form.email}
                                    onChange={(e) => update("email", e.target.value)}
                                />
                            </div>

                            {/* ĐỊA CHỈ */}
                            <div className="col-6">
                                <label className="form-label fw-semibold">Địa chỉ</label>
                                <input
                                    className="form-control"
                                    placeholder="VD: 256/10, Phường X, Quận Y, TP.HCM"
                                    value={form.address}
                                    onChange={(e) => update("address", e.target.value)}
                                />
                            </div>

                            {/* GHI CHÚ */}
                            <div className="col-12">
                                <label className="form-label fw-semibold">Ghi chú</label>
                                <textarea
                                    className="form-control"
                                    rows="3"
                                    placeholder="Thêm thông tin về công nợ, người liên hệ, giờ làm việc..."
                                    value={form.note}
                                    onChange={(e) => update("note", e.target.value)}
                                ></textarea>
                            </div>
                        </div>
                    </div>

                    {/* FOOTER */}
                    <div className="modal-footer">
                        <button className="btn btn-light" onClick={onClose}>
                            Hủy
                        </button>
                        <button className="btn btn-primary" onClick={save}>
                            Lưu nhà cung cấp
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
}
