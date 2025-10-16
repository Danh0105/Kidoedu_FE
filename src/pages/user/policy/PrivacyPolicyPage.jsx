import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faUserShield,
    faLock,
    faDatabase,
    faEnvelope,
    faFileSignature,
    faUsers,
    faClock,
    faExclamationTriangle,
    faPhone,
} from "@fortawesome/free-solid-svg-icons";

export default function PrivacyPolicyPage() {
    return (
        <div className="container my-5">
            {/* Header */}
            <div className="text-center mb-5">
                <h1 className="fw-bold text-primary mb-3">
                    <FontAwesomeIcon icon={faUserShield} className="me-2" />
                    Chính Sách Bảo Mật Thông Tin
                </h1>
                <p className="text-muted fs-5">
                    Kido cam kết bảo vệ tuyệt đối thông tin cá nhân của khách hàng, đảm bảo tính minh bạch và bảo mật trong mọi giao dịch.
                </p>
            </div>

            {/* Mục 1 */}
            <div className="card shadow-sm border-0 p-4 mb-4">
                <h4 className="fw-bold text-success mb-3">
                    <FontAwesomeIcon icon={faFileSignature} className="me-2" />
                    1. Mục đích và phạm vi thu thập thông tin
                </h4>
                <p>
                    Kido.edu.vn <strong>không bán, chia sẻ hay trao đổi thông tin cá nhân</strong> của khách hàng cho bất kỳ bên thứ ba nào khác.
                    Tất cả dữ liệu thu thập chỉ được sử dụng trong nội bộ công ty.
                </p>
                <p>Thông tin thu thập gồm:</p>
                <ul>
                    <li>Họ và tên</li>
                    <li>Địa chỉ</li>
                    <li>Điện thoại</li>
                    <li>Email</li>
                    <li>Tên sản phẩm, số lượng, thời gian giao nhận</li>
                </ul>
            </div>

            {/* Mục 2 */}
            <div className="card shadow-sm border-0 p-4 mb-4">
                <h4 className="fw-bold text-success mb-3">
                    <FontAwesomeIcon icon={faLock} className="me-2" />
                    2. Phạm vi sử dụng thông tin
                </h4>
                <p>Thông tin cá nhân được sử dụng trong nội bộ Kido cho các mục đích:</p>
                <ul>
                    <li>Hỗ trợ khách hàng và xử lý đơn đặt hàng.</li>
                    <li>Cung cấp thông tin, dịch vụ và tư vấn theo yêu cầu của khách.</li>
                    <li>Gửi thông báo về sản phẩm, khuyến mãi, sự kiện (khi khách hàng đăng ký nhận).</li>
                    <li>Quản lý tài khoản khách hàng, xác nhận giao dịch tài chính liên quan đến thanh toán trực tuyến.</li>
                </ul>
            </div>

            {/* Mục 3 */}
            <div className="card shadow-sm border-0 p-4 mb-4">
                <h4 className="fw-bold text-success mb-3">
                    <FontAwesomeIcon icon={faClock} className="me-2" />
                    3. Thời gian lưu trữ thông tin
                </h4>
                <p>
                    Dữ liệu cá nhân được lưu trữ trong hệ thống của Kido cho đến khi khách hàng yêu cầu xóa bỏ.
                    Để yêu cầu, vui lòng gửi email đến:{" "}
                    <a href="mailto:lytran@ichiskill.edu.vn" className="text-primary text-decoration-none">
                        lytran@ichiskill.edu.vn
                    </a>
                </p>
            </div>

            {/* Mục 4 */}
            <div className="card shadow-sm border-0 p-4 mb-4">
                <h4 className="fw-bold text-success mb-3">
                    <FontAwesomeIcon icon={faUsers} className="me-2" />
                    4. Những người hoặc tổ chức được tiếp cận thông tin
                </h4>
                <p>Thông tin cá nhân có thể được chia sẻ cho các đối tượng sau (nếu cần thiết):</p>
                <ul>
                    <li>
                        <strong>Công Ty TNHH Thương Mại Đầu Tư Xuất Nhập Khẩu Nguyễn Lê</strong> – đơn vị chủ quản Kido.
                    </li>
                    <li>
                        Các <strong>đối tác dịch vụ</strong> có ký hợp đồng thực hiện một phần dịch vụ (như giao hàng, thanh toán, kỹ thuật).
                        Các đối tác này chỉ được tiếp cận thông tin theo điều khoản bảo mật cụ thể trong hợp đồng.
                    </li>
                </ul>
            </div>

            {/* Mục 5 */}
            <div className="card shadow-sm border-0 p-4 mb-4">
                <h4 className="fw-bold text-success mb-3">
                    <FontAwesomeIcon icon={faDatabase} className="me-2" />
                    5. Đơn vị thu thập và quản lý thông tin cá nhân
                </h4>
                <ul className="list-unstyled mb-0">
                    <li>
                        <strong>Công Ty TNHH Thương Mại Đầu Tư Xuất Nhập Khẩu Nguyễn Lê</strong>
                    </li>
                    <li>Địa chỉ: 1288/25A Lê Văn Lương, X. Phước Kiển, H. Nhà Bè, TP. Hồ Chí Minh</li>
                    <li>Điện thoại: 0789 636 979</li>
                    <li>Website: <a href="https://Kido.edu.vn" className="text-primary text-decoration-none">Kido.edu.vn</a></li>
                    <li>Email: <a href="mailto:lytran@ichiskill.edu.vn" className="text-primary text-decoration-none">lytran@ichiskill.edu.vn</a></li>
                </ul>
            </div>

            {/* Mục 6 */}
            <div className="card shadow-sm border-0 p-4 mb-4">
                <h4 className="fw-bold text-success mb-3">
                    <FontAwesomeIcon icon={faEnvelope} className="me-2" />
                    6. Phương tiện và công cụ để tiếp cận & chỉnh sửa thông tin
                </h4>
                <p>
                    Kido không thu thập dữ liệu trực tiếp qua website.
                    Thông tin khách hàng được ghi nhận qua email hoặc số điện thoại đặt hàng:
                </p>
                <ul>
                    <li>Email: <a href="mailto:lytran@ichiskill.edu.vn" className="text-primary text-decoration-none">lytran@ichiskill.edu.vn</a></li>
                    <li>Hotline: <strong>0789 636 979</strong></li>
                </ul>
                <p>Khách hàng có thể liên hệ qua các kênh trên để yêu cầu chỉnh sửa hoặc cập nhật dữ liệu cá nhân.</p>
            </div>

            {/* Mục 7 */}
            <div className="card shadow-sm border-0 p-4">
                <h4 className="fw-bold text-success mb-3">
                    <FontAwesomeIcon icon={faExclamationTriangle} className="me-2" />
                    7. Cơ chế tiếp nhận & giải quyết khiếu nại
                </h4>
                <p>
                    Kido luôn coi trọng việc bảo vệ thông tin khách hàng và cam kết:
                </p>
                <ul>
                    <li>Không chia sẻ, bán hoặc cho thuê thông tin cá nhân cho bất kỳ tổ chức nào.</li>
                    <li>Chỉ sử dụng thông tin để nâng cao chất lượng dịch vụ và chăm sóc khách hàng.</li>
                    <li>Giải quyết các khiếu nại, tranh chấp nhanh chóng, minh bạch.</li>
                    <li>Chia sẻ thông tin khách hàng với cơ quan pháp luật nếu có yêu cầu chính thức.</li>
                </ul>
                <p>
                    Trong mọi trường hợp, nếu bạn phát hiện thông tin bị sử dụng sai mục đích,
                    vui lòng liên hệ ngay qua hotline:{" "}
                    <a href="tel:0909538677" className="text-decoration-none text-success">
                        0789 636 979
                    </a>{" "}
                    hoặc email:{" "}
                    <a href="mailto:lytran@ichiskill.edu.vn" className="text-decoration-none text-primary">
                        lytran@ichiskill.edu.vn
                    </a>
                    .
                </p>
            </div>

            {/* Footer Contact */}
            <div className="bg-light p-4 rounded-3 shadow-sm text-center mt-5">
                <h5 className="fw-bold text-primary mb-3">
                    <FontAwesomeIcon icon={faPhone} className="me-2" />
                    Thông tin liên hệ hỗ trợ
                </h5>
                <p className="fs-5 mb-1">Hotline: <strong>0789 636 979</strong></p>
                <p className="mb-1">Email: <a href="mailto:lytran@ichiskill.edu.vn" className="text-decoration-none text-success">lytran@ichiskill.edu.vn</a></p>
                <p className="text-muted small mb-0">Kido – Bảo mật thông tin khách hàng là ưu tiên hàng đầu của chúng tôi 🔒</p>
            </div>
        </div>
    );
}
