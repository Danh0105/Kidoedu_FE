import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faClipboardList,
    faSearch,
    faTools,
    faCheckCircle,
    faTruck,
} from "@fortawesome/free-solid-svg-icons";

export default function WarrantyPolicy() {
    const steps = [
        {
            title: "Bước 1: Tiếp nhận khách hàng",
            desc: "Quý khách gặp nhân viên lễ tân tại cửa để được hướng dẫn đến Bộ phận bảo hành. Cung cấp thông tin chi tiết về tình trạng lỗi hoặc sự cố của sản phẩm.",
            icon: faClipboardList,
            color: "text-primary",
        },
        {
            title: "Bước 2: Kiểm tra sản phẩm",
            desc: "Nhân viên bảo hành kiểm tra tình trạng vật lý, tem và giấy tờ liên quan. Nếu có vi phạm cam kết, nhân viên sẽ giải thích rõ ràng lý do và điều khoản áp dụng.",
            icon: faSearch,
            color: "text-info",
        },
        {
            title: "Bước 3: Lập phiếu tiếp nhận & xử lý",
            desc: "Nhân viên lập phiếu tiếp nhận chi tiết, xin xác nhận khách hàng, rồi tiến hành kiểm tra lỗi thực tế và xử lý theo đúng cam kết bảo hành.",
            icon: faTools,
            color: "text-warning",
        },
        {
            title: "Bước 4: Hoàn tất & bàn giao",
            desc: "Sau khi sửa chữa, nhân viên mời khách hàng kiểm tra lại sản phẩm. Sản phẩm hoàn thiện được bàn giao lại đầy đủ và cẩn thận.",
            icon: faCheckCircle,
            color: "text-success",
        },
        {
            title: "Bước 5: Nhận sản phẩm bảo hành",
            desc: "Quý khách mang theo phiếu tiếp nhận để nhận sản phẩm đã bảo hành theo lịch hẹn.",
            icon: faTruck,
            color: "text-danger",
        },
    ];

    return (
        <div className="container my-5">
            {/* Header */}
            <div className="text-center mb-5">
                <h1 className="fw-bold text-primary mb-3">Bảo hành sản phẩm</h1>
                <p className="text-muted fs-5">
                    Quy trình bảo hành nhanh chóng – chuyên nghiệp – minh bạch tại Trung tâm bảo hành Kido.
                </p>
            </div>

            {/* Quy trình bảo hành */}
            <section className="mb-5">
                <h3 className="fw-bold text-success mb-4">Lưu đồ cơ bản về quy trình bảo hành</h3>
                <div className="timeline position-relative ps-4">
                    {steps.map((step, index) => (
                        <div key={index} className="d-flex mb-4 align-items-start">
                            <div className="me-3">
                                <FontAwesomeIcon icon={step.icon} className={`${step.color} fs-3`} />
                            </div>
                            <div>
                                <h5 className="fw-bold text-dark">{step.title}</h5>
                                <p className="text-muted mb-0">{step.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Lưu ý quan trọng */}
            <section className="bg-light p-4 rounded-3 shadow-sm mb-5">
                <h4 className="fw-bold text-danger mb-3">Lưu ý quan trọng</h4>
                <ul className="list-unstyled fs-6">
                    <li className="mb-2">✔ Quý khách cần yêu cầu nhân viên thực hiện đúng quy trình bảo hành.</li>
                    <li className="mb-2">
                        ✔ Giữ kỹ phiếu tiếp nhận để xuất trình khi nhận lại sản phẩm (mất phiếu sẽ không được giải quyết).
                    </li>
                    <li className="mb-2">✔ Mang theo phiếu bảo hành gốc của hãng (nếu có) khi đến Trung tâm Kido.</li>
                    <li className="mb-2">
                        ✔ Nếu sản phẩm không thể sửa chữa, quý khách được đổi sản phẩm tương đương hoặc hoàn tiền theo thỏa thuận.
                    </li>
                    <li className="mb-2">
                        ✔ Trong thời gian chờ, quý khách có thể được mượn sản phẩm thay thế (tùy điều kiện thực tế).
                    </li>
                </ul>
            </section>
        </div>
    );
}
