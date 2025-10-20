import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faFileContract,
    faLock,
    faUserShield,
    faExclamationTriangle,
    faHandshake,
    faInfoCircle,
} from "@fortawesome/free-solid-svg-icons";

// Danh sách icon tương ứng theo từng điều khoản
const icons = [
    faFileContract,
    faLock,
    faUserShield,
    faExclamationTriangle,
    faHandshake,
    faExclamationTriangle,
    faFileContract,
];

export default function PaymentPolicyPage() {
    const [policies, setPolicies] = useState([]);

    useEffect(() => {
        const fetchPolicies = async () => {
            try {
                const res = await fetch(`${process.env.REACT_APP_API_URL}/policies`);
                const data = await res.json();
                const filtered = data.filter((p) => p.slug === "DKTT"); // Lọc theo slug "DKTT"
                setPolicies(filtered);
            } catch (err) {
                console.error("Lỗi tải điều khoản thanh toán:", err);
            }
        };
        fetchPolicies();
    }, []);

    return (
        <div className="container my-5">
            {/* Header */}
            <div className="text-center mb-5">
                <h1 className="fw-bold text-primary mb-3">
                    <FontAwesomeIcon icon={faFileContract} className="me-2" />
                    Điều Khoản Thanh Toán
                </h1>
                <p className="text-muted fs-5">
                    Khi sử dụng dịch vụ thanh toán tại{" "}
                    <a
                        href="https://www.kido.edu.vn"
                        className="text-success text-decoration-none"
                    >
                        Kido.edu.vn
                    </a>
                    , quý khách được xem như đã đồng ý với các điều khoản sau đây.
                </p>
            </div>

            {/* Danh sách điều khoản */}
            <div className="card shadow-sm border-0 p-4">
                {policies.length > 0 ? (
                    policies.map((policy, index) => (
                        <div key={policy.id} className="mb-4">
                            <h5 className="fw-bold mb-2 text-capitalize">
                                <FontAwesomeIcon
                                    icon={icons[index % icons.length]}
                                    className="me-2 text-primary"
                                />
                                {index + 1}. {policy.title}
                            </h5>
                            <div
                                className="text-muted mb-0"
                                dangerouslySetInnerHTML={{ __html: policy.description }}
                            />
                        </div>
                    ))
                ) : (
                    <p className="text-center text-muted">
                        Chưa có dữ liệu điều khoản thanh toán (slug = "DKTT").
                    </p>
                )}
            </div>

            {/* Footer liên hệ */}
            <div className="bg-light p-4 rounded-3 shadow-sm mt-5 text-center">
                <h5 className="fw-bold text-primary mb-3">
                    <FontAwesomeIcon icon={faInfoCircle} className="me-2" />
                    Hỗ trợ & Liên hệ
                </h5>
                <p className="fs-5">
                    Nếu quý khách có thắc mắc về thanh toán, vui lòng liên hệ tại:{" "}
                    <a
                        href="https://www.kido.edu.vn/lien-he.html"
                        className="text-decoration-none text-success"
                    >
                        www.kido.edu.vn/lien-he.html
                    </a>
                </p>
            </div>
        </div>
    );
}
