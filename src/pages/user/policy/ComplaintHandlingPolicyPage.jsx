import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faExclamationTriangle,
    faClock,
    faHandshake,
    faEnvelope,
    faPhone,
    faUserShield,
} from "@fortawesome/free-solid-svg-icons";

export default function ComplaintHandlingPolicyPage() {
    const [policies, setPolicies] = useState([]);

    // 🧠 Gọi API lấy danh sách chính sách có slug = "CSXLKN"
    useEffect(() => {
        const fetchPolicies = async () => {
            try {
                const res = await fetch(`${process.env.REACT_APP_API_URL}/policies`);
                const data = await res.json();
                const filtered = data.filter((p) => p.slug === "CSXLKN");
                setPolicies(filtered);
            } catch (err) {
                console.error("Lỗi tải chính sách khiếu nại:", err);
            }
        };
        fetchPolicies();
    }, []);

    return (
        <div className="container my-5">
            {/* Header */}
            <div className="text-center mb-5">
                <h1 className="fw-bold text-primary mb-3">
                    <FontAwesomeIcon icon={faUserShield} className="me-2" />
                    Chính Sách Xử Lý Khiếu Nại
                </h1>
                <p className="text-muted fs-5">
                    Kido cam kết lắng nghe và giải quyết mọi khiếu nại của khách hàng một cách{" "}
                    <strong>nhanh chóng – minh bạch – chuyên nghiệp</strong>.
                </p>
            </div>

            {/* Nội dung chính */}
            <div className="card shadow-sm border-0 p-4">
                {policies.length > 0 ? (
                    policies.map((policy, index) => (
                        <div key={policy.id} className="mb-4">
                            <h4 className="fw-bold text-success mb-3">
                                {index + 1}. {policy.title}
                            </h4>
                            <p>{policy.description}</p>
                        </div>
                    ))
                ) : (
                    <p className="text-center text-muted">Chưa có chính sách xử lý khiếu nại (slug = "CSXLKN").</p>
                )}
            </div>

            {/* Thông tin liên hệ */}
            <div className="bg-light p-4 rounded-3 shadow-sm mt-5">
                <h5 className="fw-bold text-primary mb-3">Liên hệ giải quyết khiếu nại</h5>
                <ul className="list-unstyled mb-0">
                    <li className="mb-2">
                        <FontAwesomeIcon icon={faPhone} className="text-success me-2" />
                        Hotline: <strong>0789 636 979</strong>
                    </li>
                    <li className="mb-2">
                        <FontAwesomeIcon icon={faEnvelope} className="text-danger me-2" />
                        Email:{" "}
                        <a href="mailto:lytran@ichiskill.edu.vn" className="text-decoration-none text-primary">
                            lytran@ichiskill.edu.vn
                        </a>
                    </li>
                    <li>📍 Địa chỉ: Số 1 Đường Cộng Hòa 3 - Phường Phú Thọ Hòa - TP. Hồ Chí Minh.</li>
                </ul>
            </div>
        </div>
    );
}
