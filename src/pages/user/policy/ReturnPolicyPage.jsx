import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faExchangeAlt,
    faBoxOpen,
    faExclamationTriangle,
    faClipboardCheck,
    faTimesCircle,
    faClock,
    faPhone,
} from "@fortawesome/free-solid-svg-icons";

export default function ReturnPolicyPage() {
    return (
        <div className="container my-5">
            {/* Header */}
            <div className="text-center mb-5">
                <h1 className="fw-bold text-primary mb-3">
                    <FontAwesomeIcon icon={faExchangeAlt} className="me-2" />
                    Chính Sách Đổi Trả Hàng
                </h1>
                <p className="text-muted fs-5">
                    Kido cam kết mang đến sản phẩm chất lượng và hỗ trợ đổi trả nhanh chóng, minh bạch vì quyền lợi khách hàng.
                </p>
            </div>

            {/* 1. Trường hợp được đổi / trả */}
            <div className="card shadow-sm border-0 p-4 mb-5">
                <h4 className="fw-bold text-success mb-3">
                    <FontAwesomeIcon icon={faClipboardCheck} className="me-2" />
                    Trường hợp được đổi / trả hàng
                </h4>
                <p>
                    Kido thực hiện <strong>đổi hàng hoặc hoàn tiền</strong> cho khách hàng trong các trường hợp sau (không hoàn phí vận chuyển, trừ khi lỗi thuộc về Kido):
                </p>
                <ul className="mt-3">
                    <li>Không đúng chủng loại, mẫu mã như quý khách đã đặt.</li>
                    <li>Không đủ số lượng, thiếu phụ kiện trong đơn hàng.</li>
                    <li>Tình trạng hàng hóa bên ngoài bị hư hại (bể vỡ, bong tróc) trong quá trình vận chuyển.</li>
                    <li>Sản phẩm không đạt chất lượng: hết hạn, hết bảo hành, không hoạt động, lỗi kỹ thuật từ nhà sản xuất.</li>
                </ul>
                <div className="alert alert-info mt-4">
                    <FontAwesomeIcon icon={faExclamationTriangle} className="me-2" />
                    <strong>Lưu ý:</strong> Quý khách vui lòng kiểm tra kỹ hàng hóa và ký xác nhận với nhân viên giao hàng ngay khi nhận hàng.
                    Nếu phát hiện vấn đề, vui lòng phản hồi trong vòng <strong>24h</strong> qua hotline:{" "}
                    <a href="tel:0909538677" className="text-decoration-none fw-bold text-primary">
                        0789 636 979
                    </a>
                    .
                </div>
            </div>

            {/* 2. Trường hợp KHÔNG được đổi / trả */}
            <div className="card shadow-sm border-0 p-4 mb-5">
                <h4 className="fw-bold text-danger mb-3">
                    <FontAwesomeIcon icon={faTimesCircle} className="me-2" />
                    Trường hợp không được đổi / trả hàng
                </h4>
                <ul className="mt-3">
                    <li>Khách hàng muốn đổi mẫu mã, chủng loại nhưng không báo trước.</li>
                    <li>Sản phẩm bị hư hại do khách hàng gây ra (rách bao bì, bong tróc, bể vỡ…).</li>
                    <li>Khách hàng sử dụng sai hướng dẫn gây hỏng hóc sản phẩm.</li>
                    <li>Không gửi phiếu bảo hành hoặc chứng từ đúng quy định trong thời hạn.</li>
                    <li>Khách hàng đã ký nhận hàng nhưng không phản hồi trong vòng 24h.</li>
                </ul>
            </div>

            {/* 3. Quy trình xử lý đổi / trả */}
            <div className="card shadow-sm border-0 p-4 mb-5">
                <h4 className="fw-bold text-success mb-3">
                    <FontAwesomeIcon icon={faClock} className="me-2" />
                    Quy trình xử lý đổi / trả hàng
                </h4>
                <ul>
                    <li>
                        <strong>Thời gian xử lý:</strong> tối đa <strong>02 tuần</strong> kể từ ngày nhận đủ thông tin và chứng từ của khách hàng.
                    </li>
                    <li>
                        <strong>Hình thức xử lý:</strong> Đổi hàng hoặc sửa chữa theo quy định của nhà sản xuất, nhà cung cấp hoặc trung tâm bảo hành ủy quyền.
                    </li>
                    <li>
                        Mọi quy trình được thực hiện minh bạch, đảm bảo quyền lợi khách hàng theo quy định của pháp luật.
                    </li>
                </ul>
            </div>

            {/* 4. Liên hệ hỗ trợ */}
            <div className="bg-light p-4 rounded-3 shadow-sm text-center">
                <h5 className="fw-bold text-primary mb-3">
                    <FontAwesomeIcon icon={faPhone} className="me-2" />
                    Hỗ trợ & Liên hệ đổi trả
                </h5>
                <p className="fs-5 mb-1">
                    Hotline:{" "}
                    <a href="tel:0909538677" className="text-decoration-none fw-bold text-success">
                        0789 636 979
                    </a>
                </p>
                <p className="mb-1">
                    Địa chỉ: Số 1 Đường Cộng Hòa 3 - Phường Phú Thọ Hòa - TP. Hồ Chí Minh.
                </p>
                <p className="text-muted small mb-0">
                    Kido – Minh bạch, tận tâm và trách nhiệm trong từng giao dịch 💙
                </p>
            </div>
        </div>
    );
}
