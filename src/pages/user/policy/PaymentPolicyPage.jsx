import React from "react";
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

            {/* Giới thiệu */}
            <div className="card shadow-sm border-0 p-4 mb-5">
                <h4 className="fw-bold text-success mb-4">3 hình thức thanh toán chính</h4>
                <p>
                    Quý khách có thể chọn phương thức phù hợp và thuận tiện nhất khi mua hàng tại{" "}
                    <strong>www.Kido.edu.vn</strong>:
                </p>

                {/* Các phương thức thanh toán */}
                <div className="row g-4 mt-3">
                    <div className="col-md-4">
                        <div className="p-4 border rounded-3 shadow-sm h-100 bg-light">
                            <FontAwesomeIcon icon={faMoneyBillWave} className="fs-2 text-success mb-3" />
                            <h5 className="fw-bold">Cách 1: Thanh toán tiền mặt</h5>
                            <p>
                                Quý khách thanh toán trực tiếp bằng tiền mặt tại địa chỉ cửa hàng của chúng tôi.
                                Nhân viên sẽ kiểm tra và xác nhận giao dịch ngay tại chỗ.
                            </p>
                        </div>
                    </div>

                    <div className="col-md-4">
                        <div className="p-4 border rounded-3 shadow-sm h-100 bg-light">
                            <FontAwesomeIcon icon={faTruck} className="fs-2 text-primary mb-3" />
                            <h5 className="fw-bold">Cách 2: Thanh toán khi nhận hàng (COD)</h5>
                            <p>
                                Quý khách nhận hàng tại nhà, kiểm tra hàng hóa và thanh toán trực tiếp cho nhân viên giao hàng.
                                Hình thức này áp dụng cho đơn hàng giao trong nước.
                            </p>
                        </div>
                    </div>

                    <div className="col-md-4">
                        <div className="p-4 border rounded-3 shadow-sm h-100 bg-light">
                            <FontAwesomeIcon icon={faCreditCard} className="fs-2 text-danger mb-3" />
                            <h5 className="fw-bold">Cách 3: Chuyển khoản trước</h5>
                            <p>
                                Quý khách chuyển khoản theo thỏa thuận hoặc hợp đồng.
                                Sau khi xác nhận thanh toán, chúng tôi sẽ tiến hành giao hàng đúng cam kết.
                            </p>
                            <p className="text-muted small">
                                Thông tin tài khoản sẽ được cung cấp qua <strong>email hoặc điện thoại</strong> khi xác nhận đơn hàng.
                            </p>
                        </div>
                    </div>
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
                        - Khi chuyển khoản, <strong>vui lòng ghi rõ nội dung</strong>: số điện thoại hoặc số hợp đồng/hóa đơn.
                    </li>
                    <li className="mb-2">
                        - Sau khi chuyển khoản, Kido sẽ liên hệ xác nhận và tiến hành giao hàng theo thời gian thỏa thuận.
                    </li>
                    <li className="mb-2">
                        - Nếu quá thời hạn mà không nhận được phản hồi hoặc hàng hóa, Quý khách có thể gửi <strong>khiếu nại trực tiếp</strong> đến trụ sở
                        và yêu cầu bồi thường nếu chứng minh được thiệt hại.
                    </li>
                    <li className="mb-2">
                        - Với khách hàng <strong>mua số lượng lớn hoặc buôn sỉ</strong>, vui lòng liên hệ trực tiếp để có chính sách giá và thanh toán theo hợp đồng.
                    </li>
                    <li className="mb-0">
                        - Chúng tôi cam kết <strong>kinh doanh minh bạch, hợp pháp</strong> – tất cả sản phẩm đều có nguồn gốc rõ ràng và chất lượng đảm bảo.
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
                <p className="mb-0">Địa chỉ: Số 1 Đường Cộng Hòa 3 - Phường Phú Thọ Hòa - TP. Hồ Chí Minh.</p>
            </div>
        </div>
    );
}
