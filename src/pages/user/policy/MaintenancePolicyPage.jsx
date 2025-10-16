import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faScrewdriverWrench,
    faLaptop,
    faShieldAlt,
    faHandshake,
    faClock,
    faCheckCircle,
    faInfoCircle,
} from "@fortawesome/free-solid-svg-icons";

export default function ChinhSachBaoTri() {
    return (
        <div className="container my-5">
            {/* Header */}
            <div className="text-center mb-5">
                <h1 className="fw-bold text-primary mb-3">
                    <FontAwesomeIcon icon={faScrewdriverWrench} className="me-2" />
                    Chính Sách Bảo Trì & Bảo Hành
                </h1>
                <p className="text-muted fs-5">
                    Kidocam kết mang đến cho khách hàng dịch vụ bảo trì, bảo hành tận tâm – nhanh chóng – minh bạch, đảm bảo quyền lợi tối đa cho người mua.
                </p>
            </div>

            {/* Chính sách đổi mới trong 30 ngày */}
            <div className="card shadow-sm border-0 p-4 mb-5">
                <h4 className="fw-bold text-success mb-3">
                    <FontAwesomeIcon icon={faHandshake} className="me-2" />
                    1. Chính sách đổi máy mới trong 30 ngày đầu
                </h4>
                <p>
                    Tất cả sản phẩm Laptop được bán tại <strong>Kido</strong> (trừ sản phẩm do nhà phân phối bảo hành riêng, ghi rõ trong phần chi tiết) sẽ được
                    <strong> đổi mới trong 30 ngày đầu</strong> nếu gặp <strong>lỗi phần cứng</strong> không thể sửa chữa hoặc thay linh kiện.
                </p>
                <ul>
                    <li>Khách hàng không phải chi trả bất kỳ chi phí nào.</li>
                    <li>Sản phẩm được kiểm tra và xác nhận lỗi bởi kỹ thuật viên Kido.</li>
                </ul>
            </div>

            {/* Quyền lợi và điều kiện */}
            <div className="card shadow-sm border-0 p-4 mb-5">
                <h4 className="fw-bold text-primary mb-3">
                    <FontAwesomeIcon icon={faShieldAlt} className="me-2" />
                    2. Quyền lợi và điều kiện bảo hành
                </h4>
                <p>
                    Khách hàng mua sản phẩm tại <strong>Kido</strong> sẽ được hưởng đầy đủ quyền lợi bảo hành theo quy định của <strong>hãng sản xuất</strong>.
                    Kidokhông thay đổi chính sách gốc mà chỉ hỗ trợ thêm trong phạm vi cho phép.
                </p>
                <p>
                    <strong>Điều kiện đổi/bảo hành:</strong>
                </p>
                <ul>
                    <li>Sản phẩm còn nguyên vẹn, không trầy xước hoặc bị can thiệp phần cứng.</li>
                    <li>Giữ đầy đủ phụ kiện, thùng hộp, sách hướng dẫn, phiếu bảo hành của Kido.</li>
                    <li>Tem bảo hành còn nguyên vẹn, không bị rách, tẩy xóa hoặc cạo sửa.</li>
                    <li>Mã số Serial / Service Tag trên máy trùng khớp với phiếu bảo hành.</li>
                    <li>Máy không bị rơi, va đập, vào nước, chập điện hoặc chịu tác động vật lý khác.</li>
                </ul>
            </div>

            {/* Trường hợp đặc biệt */}
            <div className="card shadow-sm border-0 p-4 mb-5">
                <h4 className="fw-bold text-success mb-3">
                    <FontAwesomeIcon icon={faLaptop} className="me-2" />
                    3. Trường hợp đặc biệt & xử lý khi hết hàng đổi
                </h4>
                <p>
                    Trong trường hợp không còn sản phẩm mới để đổi, Kidosẽ chủ động <strong>thương lượng</strong> cùng khách hàng theo các hướng:
                </p>
                <ul>
                    <li>Đổi sang <strong>dòng máy tương đương</strong> với giá trị giữ nguyên như lúc mua.</li>
                    <li>Nếu chọn <strong>dòng máy cao hơn</strong>, khách hàng chỉ cần bù phần chênh lệch.</li>
                    <li>Nếu chọn <strong>dòng máy thấp hơn</strong>, Kidosẽ hoàn lại phần chênh lệch tương ứng.</li>
                </ul>
            </div>

            {/* Điều kiện bảo hành chi tiết */}
            <div className="card shadow-sm border-0 p-4 mb-5">
                <h4 className="fw-bold text-danger mb-3">
                    <FontAwesomeIcon icon={faCheckCircle} className="me-2" />
                    4. Điều kiện bảo hành hợp lệ
                </h4>
                <ul>
                    <li>Mã vạch và số Serial còn nguyên vẹn, trùng với thông tin trong hệ thống Kido.</li>
                    <li>Phiếu bảo hành hợp lệ, ghi rõ ngày tháng và model chính xác.</li>
                    <li>Tem bảo hành còn nguyên, không bị rách, phai hoặc tẩy xóa.</li>
                    <li>Máy không bị va đập, móp méo, vô nước, cháy nổ hoặc chập điện.</li>
                    <li>
                        Các sản phẩm có bảo hành chính hãng, khách hàng cần liên hệ qua Kidođể được hướng dẫn, tránh rách tem hoặc tranh chấp.
                    </li>
                </ul>
            </div>

            {/* Thời gian làm việc */}
            <div className="bg-light p-4 rounded-3 shadow-sm mb-5">
                <h4 className="fw-bold text-primary mb-3">
                    <FontAwesomeIcon icon={faClock} className="me-2" />
                    5. Thời gian bảo hành & bảo trì
                </h4>
                <p>
                    Thời gian làm việc tại Trung tâm bảo hành Kido:
                </p>
                <ul className="list-unstyled">
                    <li>🕘 <strong>Thứ 2 – Thứ 7:</strong> 9h30 – 16h30</li>
                    <li>Chủ nhật & ngày lễ: nghỉ</li>
                </ul>
                <p className="text-muted small mt-2">
                    Trong trường hợp cần hỗ trợ ngoài giờ, quý khách có thể liên hệ trước để được sắp xếp hỗ trợ nhanh nhất.
                </p>
            </div>

            {/* Liên hệ hỗ trợ */}
            <div className="bg-primary text-white p-4 rounded-3 shadow-sm text-center">
                <h5 className="fw-bold mb-3">
                    <FontAwesomeIcon icon={faInfoCircle} className="me-2" />
                    Liên hệ hỗ trợ bảo hành & bảo trì
                </h5>
                <p className="fs-5 mb-1">
                    Hotline:{" "}
                    <a href="tel:0909538677" className="text-white text-decoration-underline">
                        0789 636 979
                    </a>
                </p>
                <p className="mb-1">Địa chỉ: Số 1 Đường Cộng Hòa 3 - Phường Phú Thọ Hòa - TP. Hồ Chí Minh.</p>
                <p className="text-light small mb-0">
                    Kido – Uy tín, tận tâm, bảo hành chuẩn mực 💙
                </p>
            </div>
        </div>
    );
}
