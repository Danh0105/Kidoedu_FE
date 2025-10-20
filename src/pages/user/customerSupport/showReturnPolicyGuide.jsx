import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faClipboardCheck,
    faFileSignature,
    faBoxOpen,
    faTruck,
    faInfoCircle,
    faPhone,
    faEnvelope,
} from "@fortawesome/free-solid-svg-icons";

export default function ReturnPolicyGuide() {
    const [policies, setPolicies] = useState([]);

    useEffect(() => {
        const fetchPolicies = async () => {
            try {
                const res = await fetch(`${process.env.REACT_APP_API_URL}/policies`);
                const data = await res.json();
                const filtered = data.filter((p) => p.slug === "CSDTH");
                setPolicies(filtered);
            } catch (err) {
                console.error("Lỗi tải chính sách đổi trả hàng:", err);
            }
        };
        fetchPolicies();
    }, []);

    const icons = [faClipboardCheck, faFileSignature, faBoxOpen, faTruck];
    const colors = ["primary", "info", "warning", "success"];
    const steps = ["I.", "II.", "III.", "IV."];

    return (
        <div className="container my-5">
            {/* Header */}
            <div className="text-center mb-5">
                <h1 className="fw-bold text-primary mb-3">Hướng Dẫn Đổi Trả Hàng</h1>
                <p className="text-muted fs-5">
                    Kido cam kết hỗ trợ đổi – trả sản phẩm minh bạch, nhanh chóng và thuận tiện cho khách hàng.
                </p>
            </div>

            {/* Warning */}
            <div className="alert alert-warning shadow-sm">
                <FontAwesomeIcon icon={faInfoCircle} className="me-2 text-danger" />
                <strong>Lưu ý:</strong>
                <ul className="mt-2 mb-0">
                    <li>
                        Quy định này <strong>không áp dụng</strong> cho các sản phẩm thuộc danh mục hạn chế (không áp dụng đổi trả).
                    </li>
                    <li>
                        Đối với khách hàng tại <strong>TP.HCM</strong>, có thể liên hệ trực tiếp đổi/trả tại:
                        <br />
                        <em>Công ty Máy tính Số 1, Đường Cộng Hòa 3 - Phường Phú Thọ Hòa - TP. Hồ Chí Minh.</em>
                    </li>
                </ul>
            </div>

            {/* Timeline */}
            <div className="timeline position-relative bg-light p-4 rounded-3 shadow-sm my-5">
                {policies.length > 0 ? (
                    policies.map((policy, index) => (
                        <div key={policy.id} className="timeline-item d-flex mb-5">
                            <div className={`timeline-icon bg-${colors[index % colors.length]} text-white`}>
                                <FontAwesomeIcon icon={icons[index % icons.length]} />
                            </div>
                            <div className="timeline-content ms-4">
                                <h5 className="fw-bold">{steps[index] || `${index + 1}.`} {policy.title}</h5>
                                <p className="text-muted">{policy.description}</p>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-muted text-center">Chưa có chính sách đổi trả (slug = "CSDTH").</p>
                )}
            </div>

            {/* Contact Section */}
            <div className="bg-light p-4 rounded-3 shadow-sm">
                <h5 className="fw-bold text-primary mb-2">
                    <FontAwesomeIcon icon={faInfoCircle} className="me-2" />
                    Hỗ trợ & Liên hệ
                </h5>
                <p className="mb-0">
                    Nếu quý khách có thắc mắc hoặc cần hỗ trợ thêm, vui lòng liên hệ qua:
                    <br />
                    📞 <a href="tel:0789636979" className="text-decoration-none text-success">Gọi 0789 636 979</a>
                    <br />
                    📧 <a href="mailto:lytran@ichiskill.edu.vn" className="text-decoration-none text-primary">lytran@ichiskill.edu.vn</a>
                </p>
            </div>

            {/* Custom styles */}
            <style>{`
                .timeline {
                    position: relative;
                    padding-left: 40px;
                    border-left: 3px solid #dee2e6;
                }
                .timeline-item {
                    position: relative;
                    animation: fadeInUp 0.5s ease-in-out;
                }
                .timeline-icon {
                    width: 40px;
                    height: 40px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 1.2rem;
                    position: absolute;
                    left: -22px;
                    top: 2px;
                }
                @keyframes fadeInUp {
                    from {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
            `}</style>
        </div>
    );
}
