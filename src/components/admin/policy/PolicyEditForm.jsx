import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave } from "@fortawesome/free-solid-svg-icons";

// Hàm chuyển tiếng Việt thành slug
const toSlug = (str) => {
    return str
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .trim()
        .replace(/\s+/g, "-");
};

export default function PolicyEditForm({ policy, onUpdated }) {
    const [form, setForm] = useState({
        title: policy.title,
        description: policy.description || "",
        slug: policy.slug,
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(null);

    // Tự cập nhật slug khi title đổi
    useEffect(() => {
        setForm((prev) => ({ ...prev, slug: toSlug(form.title) }));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [form.title]);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);
        try {
            const res = await fetch(`${process.env.REACT_APP_API_URL}/policies/${policy.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });

            if (!res.ok) throw new Error("Cập nhật thất bại.");
            setMessage("✅ Cập nhật thành công!");
            onUpdated();
        } catch (err) {
            setMessage("❌ Lỗi khi cập nhật chính sách. Kiểm tra trùng tiêu đề hoặc slug.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="mb-3">
                <label className="form-label fw-semibold">Tiêu đề</label>
                <input
                    type="text"
                    name="title"
                    value={form.title}
                    onChange={handleChange}
                    className="form-control"
                    required
                />
            </div>

            <div className="mb-3">
                <label className="form-label fw-semibold">Mô tả</label>
                <textarea
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    rows="4"
                    className="form-control"
                    placeholder="Nhập nội dung mô tả chi tiết chính sách..."
                />
            </div>

            <div className="text-end">
                <button
                    type="submit"
                    className="btn btn-success fw-semibold"
                    disabled={loading}
                >
                    <FontAwesomeIcon icon={faSave} className="me-2" />
                    {loading ? "Đang lưu..." : "Lưu thay đổi"}
                </button>
            </div>

            {message && <div className="mt-3 alert alert-info">{message}</div>}
        </form>
    );
}
