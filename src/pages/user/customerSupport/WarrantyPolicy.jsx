import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faClipboardList,
    faSearch,
    faTools,
    faCheckCircle,
    faTruck,
    faInfoCircle,
} from "@fortawesome/free-solid-svg-icons";

export default function WarrantyPolicy() {
    const [policies, setPolicies] = useState([]);

    useEffect(() => {
        const fetchPolicies = async () => {
            try {
                const res = await fetch("http://localhost:3000/policies");
                const data = await res.json();
                const filtered = data.filter((p) => p.slug === "CSBTBH");
                setPolicies(filtered);
            } catch (err) {
                console.error("Lỗi tải chính sách bảo hành:", err);
            }
        };
        fetchPolicies();
    }, []);

    const icons = [
        faClipboardList,
        faSearch,
        faTools,
        faCheckCircle,
        faTruck,
    ];
    const colors = [
        "primary",
        "info",
        "warning",
        "success",
        "danger",
    ];

    return (
        <div className="container my-5">
            {/* Header */}
            <div className="text-center mb-5">
                <h1 className="fw-bold text-primary mb-3">Chính Sách Bảo Hành & Bảo Trì</h1>
                <p className="text-muted fs-5">
                    Quy trình bảo hành nhanh chóng – chuyên nghiệp – minh bạch tại Trung tâm bảo hành Kido.
                </p>
            </div>

            {/* Timeline Steps */}
            <section className="mb-5">
                <h3 className="fw-bold text-success mb-4 text-uppercase">Lưu đồ quy trình bảo hành</h3>
                <div className="timeline position-relative">
                    {policies.length > 0 ? (
                        policies.map((step, index) => (
                            <div key={index} className="timeline-item d-flex mb-5">
                                <div className={`timeline-icon bg-${colors[index % colors.length]} text-white`}>
                                    <FontAwesomeIcon icon={icons[index % icons.length]} />
                                </div>
                                <div className="timeline-content ms-4">
                                    <h5 className="fw-bold mb-2 ms-2"> {index + 1}. {step.title}</h5>
                                    <p className="text-muted"> {step.description}</p>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-muted text-center">Chưa có chính sách bảo hành (slug = "CSBTBH").</p>
                    )}
                </div>
            </section>

            {/* Notes */}
            <section className="bg-light p-4 rounded-3 shadow-sm mb-5">
                <h4 className="fw-bold text-danger mb-3">Lưu ý quan trọng</h4>
                <ul className="list-unstyled fs-6">
                    <li className="mb-2">✔ Quý khách cần yêu cầu nhân viên thực hiện đúng quy trình bảo hành.</li>
                    <li className="mb-2">✔ Giữ kỹ phiếu tiếp nhận để xuất trình khi nhận lại sản phẩm (mất phiếu sẽ không được giải quyết).</li>
                    <li className="mb-2">✔ Mang theo phiếu bảo hành gốc của hãng (nếu có) khi đến Trung tâm Kido.</li>
                    <li className="mb-2">✔ Nếu sản phẩm không thể sửa chữa, quý khách được đổi sản phẩm tương đương hoặc hoàn tiền theo thoả thuận.</li>
                    <li className="mb-2">✔ Trong thời gian chờ, quý khách có thể được mượn sản phẩm thay thế (tùy điều kiện thực tế).</li>
                </ul>
            </section>

            {/* Custom CSS */}
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
