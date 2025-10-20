import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faUserShield,
    faLock,
    faDatabase,
    faEnvelope,
    faFileSignature,
    faUsers,
    faClock,
    faExclamationTriangle,
    faPhone,
} from "@fortawesome/free-solid-svg-icons";

export default function PrivacyPolicyPage() {
    const [policies, setPolicies] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPolicies = async () => {
            try {
                const res = await fetch(`${process.env.REACT_APP_API_URL}/policies`);
                const data = await res.json();
                const filtered = data.filter((p) => p.slug === "CSBMTT");
                setPolicies(filtered);
            } catch (err) {
                console.error("Lỗi tải dữ liệu:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchPolicies();
    }, []);

    const icons = [
        faFileSignature,
        faLock,
        faClock,
        faUsers,
        faDatabase,
        faEnvelope,
        faExclamationTriangle,
    ];

    if (loading)
        return <div className="text-center mt-5 text-muted">Đang tải dữ liệu...</div>;

    if (policies.length === 0)
        return <div className="text-center mt-5 text-muted">Không có dữ liệu chính sách bảo mật thông tin.</div>;

    return (
        <div className="container my-5">
            {/* Header */}
            <div className="text-center mb-5">
                <h1 className="fw-bold text-primary mb-3">
                    <FontAwesomeIcon icon={faUserShield} className="me-2" />
                    Chính Sách Bảo Mật Thông Tin
                </h1>
                <p className="text-muted fs-5">
                    Kido cam kết bảo vệ tuyệt đối thông tin cá nhân của khách hàng, đảm bảo tính minh bạch và bảo mật trong mọi giao dịch.
                </p>
            </div>

            {/* Danh sách các mục chính sách */}
            {policies.map((p, index) => (
                <div key={p.id} className="card shadow-sm border-0 p-4 mb-4">
                    <h4 className="fw-bold text-success mb-3">
                        <FontAwesomeIcon icon={icons[index % icons.length]} className="me-2" />
                        {index + 1}. {p.title}
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

            {/* Footer Contact */}
            <div className="bg-light p-4 rounded-3 shadow-sm text-center mt-5">
                <h5 className="fw-bold text-primary mb-3">
                    <FontAwesomeIcon icon={faPhone} className="me-2" />
                    Thông tin liên hệ hỗ trợ
                </h5>
                <p className="fs-5 mb-1">
                    Hotline: <strong>0789 636 979</strong>
                </p>
                <p className="mb-1">
                    Email:{" "}
                    <a
                        href="mailto:lytran@ichiskill.edu.vn"
                        className="text-decoration-none text-success"
                    >
                        lytran@ichiskill.edu.vn
                    </a>
                </p>
                <p className="text-muted small mb-0">
                    Kido – Bảo mật thông tin khách hàng là ưu tiên hàng đầu của chúng tôi 🔒
                </p>
            </div>
        </div>
    );
}
