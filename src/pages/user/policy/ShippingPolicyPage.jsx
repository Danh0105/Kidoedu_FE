import React from "react";
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

            {/* Nội dung chính */}
            <div className="card shadow-sm border-0 p-4 mb-5">
                {/* a) Phương thức giao hàng */}
                <h4 className="fw-bold text-success mb-3">
                    a) Các phương thức giao hàng
                </h4>
                <p>Chúng tôi áp dụng 2 hình thức giao hàng linh hoạt để phù hợp với nhu cầu của khách hàng:</p>
                <ul>
                    <li>
                        <FontAwesomeIcon icon={faBoxOpen} className="text-primary me-2" />
                        <strong>Mua hàng trực tiếp</strong> tại công ty hoặc cửa hàng Kido.
                    </li>
                    <li>
                        <FontAwesomeIcon icon={faTruck} className="text-success me-2" />
                        <strong>Giao hàng tận nơi (Ship hàng)</strong> thông qua các đơn vị vận chuyển chuyên nghiệp.
                    </li>
                </ul>
            </div>

            {/* b) Thời hạn giao hàng */}
            <div className="card shadow-sm border-0 p-4 mb-5">
                <h4 className="fw-bold text-success mb-3">
                    b) Thời hạn ước tính cho việc giao hàng
                </h4>
                <p>
                    Sau khi nhận được thông tin đặt hàng, chúng tôi sẽ <strong>xử lý đơn trong vòng 24 giờ</strong> và liên hệ xác nhận thông tin thanh toán – giao nhận với khách hàng.
                </p>
                <p>
                    <FontAwesomeIcon icon={faClock} className="text-warning me-2" />
                    Thời gian giao hàng dự kiến: <strong>3 – 5 ngày</strong> kể từ khi chốt đơn hoặc theo thỏa thuận.
                </p>

                <p className="fw-semibold mt-3">Một số trường hợp có thể kéo dài hơn do:</p>
                <ul>
                    <li>Không liên lạc được với khách hàng qua điện thoại.</li>
                    <li>Địa chỉ giao hàng không chính xác hoặc khó tìm.</li>
                    <li>Số lượng đơn hàng tăng đột biến làm chậm tiến độ xử lý.</li>
                    <li>Đối tác cung cấp hoặc đơn vị vận chuyển bị chậm trễ ngoài dự kiến.</li>
                </ul>

                <p className="mt-3">
                    <FontAwesomeIcon icon={faHandshake} className="text-info me-2" />
                    <strong>Phí vận chuyển:</strong>
                    Kido sử dụng dịch vụ vận chuyển ngoài, vì vậy phí giao hàng sẽ được tính theo biểu phí của đơn vị vận chuyển tùy khu vực và khối lượng hàng hóa.
                    Chúng tôi sẽ thông báo cụ thể mức phí khi xác nhận đơn hàng.
                </p>
            </div>

            {/* c) Giới hạn địa lý */}
            <div className="card shadow-sm border-0 p-4 mb-5">
                <h4 className="fw-bold text-success mb-3">
                    c) Giới hạn về mặt địa lý cho việc giao hàng
                </h4>
                <p>
                    Với khách hàng ở <strong>tỉnh xa hoặc mua số lượng lớn</strong>, Kido sẽ sử dụng dịch vụ giao nhận của các công ty vận chuyển uy tín.
                    Cước phí sẽ được tính theo mức phí của đơn vị giao nhận hoặc theo thỏa thuận hợp đồng giữa hai bên.
                </p>
            </div>

            {/* Lưu ý */}
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
