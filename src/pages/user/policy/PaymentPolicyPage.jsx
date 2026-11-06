import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faMoneyBillWave,
    faTruck,
    faCreditCard,
    faExclamationCircle,
    faHandshake,
    faEnvelope,
    faPhone,
} from "@fortawesome/free-solid-svg-icons";

export default function PaymentPolicyPage() {
    const [policies, setPolicies] = useState([]);

    // 🧠 Gọi BE để lấy danh sách chính sách thanh toán
    useEffect(() => {
        const fetchPolicies = async () => {
            try {
                const res = await fetch(`${process.env.REACT_APP_API_URL}/policies`);
                const data = await res.json();
                // Lọc ra các chính sách có slug === "CSTT"
                const filtered = data.filter((p) => p.slug === "CSTT");
                setPolicies(filtered);
            } catch (err) {
                console.error("Lỗi tải chính sách thanh toán:", err);
            }
        };
        fetchPolicies();
    }, []);

    return (
        <div className="container my-5">
            {/* Header */}
            <div className="text-center mb-5">
                <h1 className="fw-bold text-primary mb-3">
                    <FontAwesomeIcon icon={faHandshake} className="me-2" />
                    Chính Sách Thanh Toán
                </h1>
                <p className="text-muted fs-5">
                    Kido mang đến nhiều hình thức thanh toán linh hoạt, an toàn và tiện lợi để Quý khách dễ dàng lựa chọn.
                </p>
            </div>

            {/* Nội dung chính */}
            <div className="card shadow-sm border-0 p-4 mb-5">
                <h4 className="fw-bold text-success mb-4">Các hình thức thanh toán</h4>
                <p>
                    Quý khách có thể chọn phương thức phù hợp và thuận tiện nhất khi mua hàng tại{" "}
                    <strong>www.Kido.edu.vn</strong>:
                </p>

                <div className="row g-4 mt-3">
                    {policies.length > 0 ? (
                        policies.map((policy, index) => (
                            <div className="col-md-4" key={policy.id}>
                                <div className="p-4 border rounded-3 shadow-sm h-100 bg-light">
                                    {/* Icon khác nhau cho từng bước */}
                                    <FontAwesomeIcon
                                        icon={
                                            index === 0
                                                ? faMoneyBillWave
                                                : index === 1
                                                    ? faTruck
                                                    : faCreditCard
                                        }
                                        className={`fs-2 mb-3 ${index === 0
                                            ? "text-success"
                                            : index === 1
                                                ? "text-primary"
                                                : "text-danger"
                                            }`}
                                    />
                                    <h5 className="fw-bold">
                                        Cách {index + 1}: {policy.title}
                                    </h5>
                                    <p>{policy.description}</p>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-muted text-center mt-3">
                            Chưa có chính sách thanh toán nào (slug = 'CSTT').
                        </p>
                    )}
                </div>
            </div>

            {/* Lưu ý */}
            <div className="bg-light p-4 rounded-3 shadow-sm mb-5">
                <h4 className="fw-bold text-danger mb-3">
                    <FontAwesomeIcon icon={faExclamationCircle} className="me-2" />
                    Lưu ý khi thanh toán
                </h4>
                <ul className="list-unstyled">
                    <li className="mb-2">
                        - Khi chuyển khoản, <strong>vui lòng ghi rõ nội dung</strong>: số điện thoại hoặc mã hóa đơn.
                    </li>
                    <li className="mb-2">
                        - Sau khi chuyển khoản, Kido sẽ liên hệ xác nhận và giao hàng đúng thời gian đã cam kết.
                    </li>
                    <li className="mb-2">
                        - Nếu có vấn đề phát sinh, Quý khách có thể gửi <strong>khiếu nại</strong> trực tiếp đến bộ phận chăm sóc khách hàng.
                    </li>
                    <li className="mb-2">
                        - Với khách hàng <strong>mua sỉ hoặc hợp đồng</strong>, vui lòng liên hệ trực tiếp để có chính sách riêng.
                    </li>
                </ul>
            </div>

            {/* Liên hệ hỗ trợ */}
            <div className="bg-primary text-white p-4 rounded-3 shadow-sm text-center">
                <h5 className="fw-bold mb-3">Liên hệ hỗ trợ thanh toán</h5>
                <p className="fs-5 mb-2">
                    <FontAwesomeIcon icon={faPhone} className="me-2" />
                    Hotline: <strong>0789 636 979</strong>
                </p>
                <p className="fs-6 mb-2">
                    <FontAwesomeIcon icon={faEnvelope} className="me-2" />
                    Email:{" "}
                    <a href="mailto:lytran@ichiskill.edu.vn" className="text-white text-decoration-underline">
                        lytran@ichiskill.edu.vn
                    </a>
                </p>
                <p className="mb-0">Địa chỉ: 16/17 Nguyễn Thiện Thuật, Phường Bàn Cờ, TP. Hồ Chí Minh.</p>
            </div>
        </div>
    );
}
