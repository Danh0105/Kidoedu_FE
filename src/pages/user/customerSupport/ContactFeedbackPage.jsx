import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faEnvelope,
    faUser,
    faComments,
    faPaperPlane,
    faHeart
} from "@fortawesome/free-solid-svg-icons";

export default function ContactFeedbackPage() {
    // 🧩 Trạng thái form
    const [form, setForm] = useState({
        name: "",
        email: "",
        message: "",
    });
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(null);
    const [error, setError] = useState(null);

    // 🧠 Hàm xử lý thay đổi input
    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    // 🚀 Gửi form đến BE
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setSuccess(null);
        setError(null);

        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/feedback`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });

            if (!response.ok) throw new Error("Không thể gửi góp ý. Vui lòng thử lại.");

            const data = await response.json();
            setSuccess(data.message || "Gửi góp ý thành công!");
            setForm({ name: "", email: "", message: "" });
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container my-5">
            <div className="text-center mb-5">
                <h1 className="fw-bold text-primary mb-3">
                    <FontAwesomeIcon icon={faComments} className="me-2" />
                    Liên hệ & Góp ý
                </h1>
                <p className="text-muted fs-5">
                    Hãy chia sẻ với chúng tôi những ý kiến, nhận xét hoặc góp ý của bạn về sản phẩm, dịch vụ,
                    nhân viên và các hoạt động của <strong>Kido</strong>.
                </p>
            </div>

            <div className="card border-0 shadow-sm p-4">
                <h4 className="fw-bold text-primary mb-4">
                    <FontAwesomeIcon icon={faPaperPlane} className="me-2" />
                    Gửi góp ý trực tuyến
                </h4>

                <form onSubmit={handleSubmit}>
                    <div className="row g-3">
                        <div className="col-md-6">
                            <label className="form-label fw-semibold">
                                <FontAwesomeIcon icon={faUser} className="me-2" />
                                Họ và tên
                            </label>
                            <input
                                type="text"
                                name="name"
                                value={form.name}
                                onChange={handleChange}
                                className="form-control"
                                placeholder="Nhập họ và tên của bạn"
                                required
                            />
                        </div>
                        <div className="col-md-6">
                            <label className="form-label fw-semibold">
                                <FontAwesomeIcon icon={faEnvelope} className="me-2" />
                                Email
                            </label>
                            <input
                                type="email"
                                name="email"
                                value={form.email}
                                onChange={handleChange}
                                className="form-control"
                                placeholder="Nhập email của bạn"
                                required
                            />
                        </div>
                        <div className="col-md-12">
                            <label className="form-label fw-semibold">
                                <FontAwesomeIcon icon={faComments} className="me-2" />
                                Nội dung góp ý
                            </label>
                            <textarea
                                name="message"
                                value={form.message}
                                onChange={handleChange}
                                className="form-control"
                                rows="5"
                                placeholder="Chia sẻ suy nghĩ, góp ý hoặc phản hồi của bạn..."
                                required
                            ></textarea>
                        </div>
                    </div>

                    {/* Trạng thái phản hồi */}
                    <div className="text-center mt-4">
                        <button
                            type="submit"
                            className="btn btn-success px-4 py-2 shadow-sm"
                            disabled={loading}
                        >
                            <FontAwesomeIcon icon={faPaperPlane} className="me-2" />
                            {loading ? "Đang gửi..." : "Gửi góp ý"}
                        </button>
                    </div>

                    {success && (
                        <div className="alert alert-success mt-4 text-center">{success}</div>
                    )}
                    {error && <div className="alert alert-danger mt-4 text-center">{error}</div>}
                </form>
            </div>

            <div className="text-center mt-5 text-secondary">
                <FontAwesomeIcon icon={faHeart} className="text-danger fs-4 me-2" />
                <p className="d-inline fw-semibold">
                    Kido trân trọng mọi ý kiến đóng góp – Cảm ơn bạn đã đồng hành cùng chúng tôi!
                </p>
            </div>
        </div>
    );
}
