import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faClipboardCheck,
    faFileSignature,
    faBoxOpen,
    faTruck,
    faInfoCircle,
} from "@fortawesome/free-solid-svg-icons";

export default function showReturnPolicyGuide() {
    return (
        <div className="container my-5">
            {/* Header */}
            <div className="text-center mb-5">
                <h1 className="fw-bold text-primary mb-3">Hướng Dẫn Đổi Trả Hàng</h1>
                <p className="text-muted fs-5">
                    Kido cam kết hỗ trợ đổi – trả sản phẩm minh bạch, nhanh chóng và thuận tiện cho khách hàng.
                </p>
            </div>

            {/* Lưu ý đầu trang */}
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
                        <em>
                            Công ty Máy tính Số 1 Đường Cộng Hòa 3 - Phường Phú Thọ Hòa - TP. Hồ Chí Minh.
                        </em>
                    </li>
                </ul>
            </div>

            {/* Quy trình hướng dẫn */}
            <section className="timeline position-relative ps-4 mt-5 mb-5">
                {/* Bước 1 */}
                <div className="d-flex mb-4 align-items-start">
                    <FontAwesomeIcon icon={faClipboardCheck} className="fs-3 text-primary me-3" />
                    <div>
                        <h5 className="fw-bold text-dark">I. Kiểm tra điều kiện đổi trả hàng</h5>
                        <p className="text-muted">
                            Vui lòng đảm bảo sản phẩm đáp ứng các điều kiện đổi trả theo chính sách của Kido:
                        </p>
                        <ul>
                            <li>Sản phẩm thuộc danh mục mặt hàng được đổi trả.</li>
                            <li>Không quá 30 ngày kể từ ngày nhận hàng.</li>
                            <li>
                                Sản phẩm <strong>còn nguyên bao bì, đầy đủ phụ kiện, tem và quà tặng kèm</strong> (nếu có).
                            </li>
                            <li>
                                Gửi kèm <strong>hóa đơn mua hàng</strong> khi gửi sản phẩm đổi/trả.
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bước 2 */}
                <div className="d-flex mb-4 align-items-start">
                    <FontAwesomeIcon icon={faFileSignature} className="fs-3 text-info me-3" />
                    <div>
                        <h5 className="fw-bold text-dark">
                            II. In và điền thông tin vào "Phiếu đăng ký đổi trả sản phẩm"
                        </h5>
                        <ul>
                            <li>
                                Tải <a href="#" className="text-decoration-none text-primary">Phiếu đăng ký đổi trả sản phẩm</a>, in và điền đầy đủ thông tin theo hướng dẫn.
                            </li>
                            <li>
                                Đơn hàng gửi về mà <strong>không có phiếu đăng ký</strong> sẽ không được xử lý.
                            </li>
                            <li>
                                Cắt rời <strong>nhãn đổi trả</strong> từ Phiếu đổi trả sản phẩm để dán lên kiện hàng.
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bước 3 */}
                <div className="d-flex mb-4 align-items-start">
                    <FontAwesomeIcon icon={faBoxOpen} className="fs-3 text-warning me-3" />
                    <div>
                        <h5 className="fw-bold text-dark">III. Đóng gói hàng hóa</h5>
                        <ul>
                            <li>Đóng gói sản phẩm + hóa đơn + phiếu đăng ký đổi trả hàng.</li>
                            <li>Dán nhãn đổi trả ra bên ngoài kiện hàng.</li>
                        </ul>
                        <p className="text-muted">
                            <strong>Lưu ý:</strong> Quý khách chịu trách nhiệm đảm bảo hàng hóa còn nguyên vẹn khi gửi về Kido.
                            Không gửi nhiều đơn hàng trong cùng một kiện để tránh thất lạc.
                        </p>
                    </div>
                </div>

                {/* Bước 4 */}
                <div className="d-flex mb-4 align-items-start">
                    <FontAwesomeIcon icon={faTruck} className="fs-3 text-success me-3" />
                    <div>
                        <h5 className="fw-bold text-dark">IV. Gửi hàng về Kido</h5>
                        <p className="text-muted">
                            Liên hệ bưu cục <strong>VNPT gần nhất</strong> để chuyển hàng theo thông tin có trên nhãn đổi trả.
                            Kido không chịu trách nhiệm về chi phí vận chuyển hoặc thất lạc nếu quý khách không gửi đúng hướng dẫn.
                        </p>
                        <p>
                            Kido <strong>không tiếp nhận đổi trả trực tiếp</strong> tại văn phòng hoặc kho hàng.
                            Mọi trường hợp gửi sai địa chỉ hoặc tự ý giao hàng sẽ không được xử lý.
                        </p>
                    </div>
                </div>
            </section>

            {/* Hỗ trợ */}
            <div className="bg-light p-4 rounded-3 shadow-sm">
                <h5 className="fw-bold text-primary mb-2">
                    <FontAwesomeIcon icon={faInfoCircle} className="me-2" />
                    Hỗ trợ và liên hệ
                </h5>
                <p className="mb-0">
                    Nếu quý khách có thắc mắc hoặc cần hỗ trợ thêm, vui lòng liên hệ qua:
                    <br />
                    🌐{" "}
                    <a
                        href="tel:0789 636 979"
                        className="text-decoration-none text-success"
                    >
                        Gọi 0789 636 979
                    </a>
                </p>
            </div>

            {/* Custom timeline style */}
            <style>
                {`
          .timeline::before {
            content: '';
            position: absolute;
            left: 15px;
            top: 0;
            bottom: 0;
            width: 2px;
            background-color: #d0d0d0;
          }
          .timeline > div {
            position: relative;
            padding-left: 10px;
          }
        `}
            </style>
        </div>
    );
}
