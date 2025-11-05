import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faScrewdriverWrench,
    faHandshake,
    faShieldAlt,
    faLaptop,
    faCheckCircle,
    faClock,
    faInfoCircle,
} from "@fortawesome/free-solid-svg-icons";

export default function ChinhSachBaoTri() {
    const [policies, setPolicies] = useState([]);
    const [loading, setLoading] = useState(true);

    // Gọi API lấy chính sách theo slug
    useEffect(() => {
        const fetchPolicies = async () => {
            try {
                const res = await fetch(`${process.env.REACT_APP_API_URL}/policies`);
                const data = await res.json();
                const filtered = data.filter((p) => p.slug === "CSBTBH");
                setPolicies(filtered);
            } catch (err) {
                console.error("Lỗi khi tải dữ liệu:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchPolicies();
    }, []);

    // Biểu tượng tương ứng từng chính sách
    const icons = {
        0: faHandshake,
        1: faShieldAlt,
        2: faLaptop,
        3: faCheckCircle,
        4: faClock,
    };

    if (loading)
        return <div className="text-center mt-5 text-muted">Đang tải dữ liệu...</div>;

    if (policies.length === 0)
        return <div className="text-center mt-5 text-muted">Không có dữ liệu chính sách bảo trì & bảo hành.</div>;

    return (
        <div className="container my-5">
            {/* Header */}
            <div className="text-center mb-5">
                <h1 className="fw-bold text-primary mb-3">
                    <FontAwesomeIcon icon={faScrewdriverWrench} className="me-2" />
                    Chính Sách Bảo Trì & Bảo Hành
                </h1>
                <p className="text-muted fs-5">
                    Kido cam kết mang đến cho khách hàng dịch vụ bảo trì, bảo hành tận tâm – nhanh chóng – minh bạch, đảm bảo quyền lợi tối đa cho người mua.
                </p>
            </div>

            {/* Danh sách chính sách */}
            {policies.map((p, index) => (
                <div
                    key={p.id}
                    className={`card shadow-sm border-0 p-4 mb-4 ${index === 3 ? "border-danger" : "border-light"
                        }`}
                >
                    <h4
                        className={`fw-bold mb-3 ${index === 0
                            ? "text-success"
                            : index === 1
                                ? "text-primary"
                                : index === 2
                                    ? "text-success"
                                    : index === 3
                                        ? "text-danger"
                                        : "text-primary"
                            }`}
                    >
                        <FontAwesomeIcon icon={icons[index]} className="me-2" />
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

            {/* Liên hệ hỗ trợ */}
            <div className="bg-primary text-white p-4 rounded-3 shadow-sm text-center mt-5">
                <h5 className="fw-bold mb-3">
                    <FontAwesomeIcon icon={faInfoCircle} className="me-2" />
                    Liên hệ hỗ trợ bảo hành & bảo trì
                </h5>
                <p className="fs-5 mb-1">
                    Hotline:{" "}
                    <a href="tel:0789636979" className="text-white text-decoration-underline">
                        0789 636 979
                    </a>
                </p>
                <p className="mb-1">Địa chỉ: Số 1 Đường Cộng Hòa 3 - Phường Phú Thọ Hòa - TP. Hồ Chí Minh.</p>
                <p className="text-light small mb-0">
                    Kido – Uy tín, tận tâm, bảo hành chuẩn mực 💙
                </p>
            </div>
        </div>
    );
}
