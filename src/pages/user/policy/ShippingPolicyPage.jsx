import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faTruck,
    faBoxOpen,
    faClock,
    faMapMarkedAlt,
    faInfoCircle,
    faHandshake,
} from "@fortawesome/free-solid-svg-icons";

export default function ShippingPolicyPage() {
    const [policies, setPolicies] = useState([]);
    const [loading, setLoading] = useState(true);

    // Lấy dữ liệu từ API backend (theo slug “CSGH”)
    useEffect(() => {
        const fetchPolicies = async () => {
            try {
                const res = await fetch(`${process.env.REACT_APP_API_URL}/policies`);
                const data = await res.json();
                const filtered = data.filter((p) => p.slug === "CSGH");
                setPolicies(filtered);
            } catch (error) {
                console.error("Lỗi tải chính sách vận chuyển:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchPolicies();
    }, []);

    // Map biểu tượng phù hợp cho từng mục
    const icons = [faBoxOpen, faClock, faMapMarkedAlt];

    if (loading)
        return <div className="text-center mt-5 text-muted">Đang tải dữ liệu...</div>;

    if (policies.length === 0)
        return <div className="text-center mt-5 text-muted">Không có dữ liệu chính sách vận chuyển.</div>;

    return (
        <div className="container my-5">
            {/* Header */}
            <div className="text-center mb-5">
                <h1 className="fw-bold text-primary mb-3">
                    <FontAwesomeIcon icon={faTruck} className="me-2" />
                    Chính Sách Vận Chuyển
                </h1>
                <p className="text-muted fs-5">
                    Kido luôn nỗ lực giao hàng nhanh chóng – an toàn – đúng hẹn để đảm bảo trải nghiệm tốt nhất cho khách hàng.
                </p>
            </div>

            {/* Danh sách chính sách từ DB */}
            {policies.map((p, index) => (
                <div key={p.id} className="card shadow-sm border-0 p-4 mb-4">
                    <h4 className="fw-bold text-success mb-3">
                        <FontAwesomeIcon icon={icons[index % icons.length]} className="me-2" />
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

            {/* Lưu ý quan trọng */}
            <div className="bg-light p-4 rounded-3 shadow-sm">
                <h5 className="fw-bold text-danger mb-3">
                    <FontAwesomeIcon icon={faInfoCircle} className="me-2" />
                    Lưu ý quan trọng
                </h5>
                <ul className="list-unstyled">
                    <li className="mb-2">
                        - Nếu có <strong>chậm trễ</strong> trong quá trình giao hàng, Kido sẽ thông báo kịp thời cho khách hàng.
                    </li>
                    <li className="mb-2">
                        - Khách hàng có thể lựa chọn giữa việc <strong>hủy đơn hàng</strong> hoặc <strong>tiếp tục chờ nhận hàng</strong> tùy nhu cầu.
                    </li>
                    <li className="mb-0">
                        - Chúng tôi luôn nỗ lực đảm bảo giao hàng đúng cam kết và bảo vệ tối đa quyền lợi khách hàng.
                    </li>
                </ul>
            </div>
        </div>
    );
}
