import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faExchangeAlt,
    faClipboardCheck,
    faTimesCircle,
    faClock,
    faExclamationTriangle,
    faPhone,
} from "@fortawesome/free-solid-svg-icons";

export default function ReturnPolicyPage() {
    const [policies, setPolicies] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPolicies = async () => {
            try {
                const res = await fetch(`${process.env.REACT_APP_API_URL}/policies`);
                const data = await res.json();
                const filtered = data.filter((p) => p.slug === "CSDTH");
                setPolicies(filtered);
            } catch (err) {
                console.error("Lỗi khi tải dữ liệu:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchPolicies();
    }, []);

    // Map icon theo thứ tự từng mục
    const icons = {
        0: faClipboardCheck,
        1: faTimesCircle,
        2: faClock,
    };

    if (loading)
        return <div className="text-center mt-5 text-muted">Đang tải dữ liệu...</div>;

    if (policies.length === 0)
        return <div className="text-center mt-5 text-muted">Không có dữ liệu chính sách đổi trả hàng.</div>;

    return (
        <div className="container my-5">
            {/* Header */}
            <div className="text-center mb-5">
                <h1 className="fw-bold text-primary mb-3">
                    <FontAwesomeIcon icon={faExchangeAlt} className="me-2" />
                    Chính Sách Đổi Trả Hàng
                </h1>
                <p className="text-muted fs-5">
                    Kido cam kết mang đến sản phẩm chất lượng và hỗ trợ đổi trả nhanh chóng, minh bạch vì quyền lợi khách hàng.
                </p>
            </div>

            {/* Danh sách chính sách */}
            {policies.map((p, index) => (
                <div
                    key={p.id}
                    className={`card shadow-sm border-0 p-4 mb-4 ${index === 1 ? "border-danger" : "border-light"
                        }`}
                >
                    <h4
                        className={`fw-bold mb-3 ${index === 1 ? "text-danger" : "text-success"
                            }`}
                    >
                        <FontAwesomeIcon
                            icon={icons[index] || faClipboardCheck}
                            className="me-2"
                        />
                        {p.title}
                    </h4>

                    <div
                        className="text-secondary"
                        style={{ whiteSpace: "pre-line" }}
                        dangerouslySetInnerHTML={{
                            __html: p.description.replace(/\n/g, "<br/>"),
                        }}
                    />
                </div>
            ))}

            {/* Lưu ý thêm (như hình trong bản tĩnh) */}
            <div className="alert alert-info mt-4">
                <FontAwesomeIcon icon={faExclamationTriangle} className="me-2" />
                <strong>Lưu ý:</strong> Quý khách vui lòng kiểm tra kỹ hàng hóa và ký xác nhận với nhân viên giao hàng ngay khi nhận hàng.
                Nếu phát hiện vấn đề, vui lòng phản hồi trong vòng <strong>24h</strong> qua hotline:{" "}
                <a
                    href="tel:0789636979"
                    className="text-decoration-none fw-bold text-primary"
                >
                    0789 636 979
                </a>.
            </div>

            {/* Liên hệ hỗ trợ */}
            <div className="bg-light p-4 rounded-3 shadow-sm text-center mt-5">
                <h5 className="fw-bold text-primary mb-3">
                    <FontAwesomeIcon icon={faPhone} className="me-2" />
                    Hỗ trợ & Liên hệ đổi trả
                </h5>
                <p className="fs-5 mb-1">
                    Hotline:{" "}
                    <a
                        href="tel:0789636979"
                        className="text-decoration-none fw-bold text-success"
                    >
                        0789 636 979
                    </a>
                </p>
                <p className="mb-1">
                    Địa chỉ: Số 1 Đường Cộng Hòa 3 - Phường Phú Thọ Hòa - TP. Hồ Chí Minh.
                </p>
                <p className="text-muted small mb-0">
                    Kido – Minh bạch, tận tâm và trách nhiệm trong từng giao dịch 💙
                </p>
            </div>
        </div>
    );
}
