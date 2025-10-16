import React from "react";
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
    return (
        <div className="container my-5">
            {/* Header */}
            <div className="text-center mb-5">
                <h1 className="fw-bold text-primary mb-3">
                    <FontAwesomeIcon icon={faUserShield} className="me-2" />
                    Chính Sách Xử Lý Khiếu Nại
                </h1>
                <p className="text-muted fs-5">
                    Kido cam kết lắng nghe và giải quyết mọi khiếu nại của khách hàng một cách <strong>nhanh chóng – minh bạch – chuyên nghiệp</strong>.
                </p>
            </div>

            {/* Nội dung chính */}
            <div className="card shadow-sm border-0 p-4">
                <h4 className="fw-bold text-success mb-3">1. Tiếp nhận khiếu nại</h4>
                <p>
                    <FontAwesomeIcon icon={faExclamationTriangle} className="text-warning me-2" />
                    Chúng tôi <strong>tiếp nhận mọi khiếu nại</strong> liên quan đến việc sử dụng sản phẩm, dịch vụ hoặc thái độ phục vụ của nhân viên tại <strong>Kido</strong>.
                </p>
                <p>
                    Mọi phản ánh từ khách hàng là cơ sở quan trọng giúp chúng tôi không ngừng hoàn thiện chất lượng dịch vụ và chăm sóc khách hàng.
                </p>

                <h4 className="fw-bold text-success mt-4 mb-3">2. Xử lý khiếu nại và bảo hành</h4>
                <p>
                    <FontAwesomeIcon icon={faHandshake} className="text-primary me-2" />
                    Trong mọi trường hợp liên quan đến <strong>bảo hành</strong> hoặc sự cố kỹ thuật, quý khách có thể liên hệ trực tiếp với chúng tôi để được hướng dẫn <strong>thủ tục bảo hành và hỗ trợ kỹ thuật</strong>.
                </p>
                <p>
                    Nhân viên của chúng tôi sẽ hướng dẫn cụ thể và thực hiện quy trình xử lý khiếu nại theo đúng chính sách và quy định của công ty.
                </p>

                <h4 className="fw-bold text-success mt-4 mb-3">3. Thời gian giải quyết khiếu nại</h4>
                <p>
                    <FontAwesomeIcon icon={faClock} className="text-info me-2" />
                    Thời gian xử lý khiếu nại tối đa là <strong>03 (ba) ngày làm việc</strong> kể từ khi nhận được khiếu nại chính thức từ khách hàng.
                </p>
                <p>
                    Trong trường hợp đặc biệt hoặc <strong>bất khả kháng</strong>, hai bên sẽ chủ động <strong>thương lượng để đạt được giải pháp phù hợp</strong> và đảm bảo quyền lợi cho khách hàng.
                </p>
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
                    <li>
                        📍 Địa chỉ: Số 1 Đường Cộng Hòa 3 - Phường Phú Thọ Hòa - TP. Hồ Chí Minh.
                    </li>
                </ul>
            </div>
        </div>
    );
}
