import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faFileContract,
    faLock,
    faUserShield,
    faExclamationTriangle,
    faHandshake,
    faInfoCircle,
} from "@fortawesome/free-solid-svg-icons";

export default function PaymentPolicy() {
    return (
        <div className="container my-5">
            {/* Header */}
            <div className="text-center mb-5">
                <h1 className="fw-bold text-primary mb-3">Điều Khoản Thanh Toán</h1>
                <h5 className="text-secondary">
                    Điều khoản sử dụng dịch vụ thanh toán mua hàng online tại{" "}
                    <a href="https://www.Kido.edu.vn" className="text-success text-decoration-none">
                        www.Kido.edu.vn
                    </a>
                </h5>
                <p className="text-muted mt-3">
                    Khi sử dụng dịch vụ mua hàng và thanh toán trực tuyến, quý khách được xem như đã đồng ý với các điều khoản bên dưới.
                </p>
            </div>

            {/* Card container */}
            <div className="card shadow-sm border-0 p-4">
                {/* Điều 1 */}
                <section className="mb-4">
                    <h5 className="fw-bold text-primary">
                        <FontAwesomeIcon icon={faFileContract} className="me-2" />
                        ĐIỀU 1: Một số khái niệm
                    </h5>
                    <ul>
                        <li>
                            <strong>Kido.edu.vn</strong>: Website bán hàng trực tuyến các sản phẩm và dịch vụ công nghệ thông tin.
                        </li>
                        <li>
                            <strong>Bên thứ 3</strong>: Các dịch vụ thanh toán qua Kido.edu.vn và các đối tác thanh toán khác của Kido.
                        </li>
                    </ul>
                </section>

                {/* Điều 2 */}
                <section className="mb-4">
                    <h5 className="fw-bold text-success">
                        <FontAwesomeIcon icon={faLock} className="me-2" />
                        ĐIỀU 2: Quyền sở hữu trí tuệ
                    </h5>
                    <p>
                        Chúng tôi tôn trọng quyền sở hữu trí tuệ của các bên liên quan và yêu cầu người dùng cũng phải tôn trọng điều này.
                        Tất cả sản phẩm, dịch vụ, logo, thiết kế... trên website đều thuộc quyền sở hữu của Kido.
                        Mọi hành vi sao chép, sử dụng, chỉnh sửa hoặc khai thác trái phép đều bị nghiêm cấm nếu chưa có sự đồng ý bằng văn bản từ Kido.
                    </p>
                </section>

                {/* Điều 3 */}
                <section className="mb-4">
                    <h5 className="fw-bold text-info">
                        <FontAwesomeIcon icon={faUserShield} className="me-2" />
                        ĐIỀU 3: Thông tin khách hàng
                    </h5>
                    <ul>
                        <li>
                            Khi sử dụng dịch vụ, khách hàng cần cung cấp thông tin cá nhân và tài khoản để xác nhận giao dịch.
                        </li>
                        <li>
                            <strong>Thông tin cá nhân:</strong> Được dùng để xác nhận thanh toán, hỗ trợ chăm sóc khách hàng và gửi khuyến mãi khi được khách hàng đồng ý.
                            Mọi dữ liệu cá nhân được bảo mật tuyệt đối, chỉ tiết lộ khi có yêu cầu pháp lý.
                        </li>
                        <li>
                            <strong>Thông tin tài khoản:</strong> Kido và các đối tác thanh toán (Visa, MasterCard...) áp dụng các biện pháp bảo mật cao nhất
                            để đảm bảo an toàn tuyệt đối cho người dùng.
                        </li>
                    </ul>
                </section>

                {/* Điều 4 */}
                <section className="mb-4">
                    <h5 className="fw-bold text-warning">
                        <FontAwesomeIcon icon={faExclamationTriangle} className="me-2" />
                        ĐIỀU 4: Khiếu nại đơn hàng
                    </h5>
                    <p>
                        Trong trường hợp khách hàng bị lừa đảo, thanh toán nhưng không nhận được hàng hoặc hàng sai mô tả,
                        vui lòng gửi email khiếu nại đến Kido.
                        Chúng tôi sẽ tiến hành xác minh, làm việc với bên thứ ba và giải quyết theo đúng trách nhiệm của bên cung cấp dịch vụ thanh toán.
                    </p>
                </section>

                {/* Điều 5 */}
                <section className="mb-4">
                    <h5 className="fw-bold text-primary">
                        <FontAwesomeIcon icon={faHandshake} className="me-2" />
                        ĐIỀU 5: Trách nhiệm của Kido.edu.vn
                    </h5>
                    <ul>
                        <li>Bảo mật và lưu trữ an toàn thông tin khách hàng.</li>
                        <li>Không chia sẻ hoặc mua bán dữ liệu khách hàng khi chưa có sự đồng ý.</li>
                        <li>Giải quyết thắc mắc, khiếu nại phát sinh từ lỗi hệ thống hoặc giao dịch của Kido.</li>
                        <li>
                            Phối hợp với cơ quan chức năng khi có tố cáo, khiếu nại liên quan đến gian lận tài chính hoặc vi phạm pháp luật.
                        </li>
                    </ul>
                </section>

                {/* Điều 6 */}
                <section className="mb-4">
                    <h5 className="fw-bold text-danger">
                        <FontAwesomeIcon icon={faExclamationTriangle} className="me-2" />
                        ĐIỀU 6: Miễn trừ trách nhiệm
                    </h5>
                    <ul>
                        <li>
                            Kido không chịu trách nhiệm nếu thông tin khách hàng bị lộ do virus, tấn công mạng hoặc sự cố từ thiết bị người dùng.
                        </li>
                        <li>
                            Không chịu trách nhiệm nếu việc thanh toán bị gián đoạn do lỗi hệ thống ngoài kiểm soát hoặc do bên thứ ba.
                        </li>
                        <li>
                            Miễn trừ trong trường hợp thiên tai, chiến tranh, khủng bố, đình công, hoặc các sự kiện bất khả kháng khác.
                        </li>
                    </ul>
                </section>

                {/* Điều 7 */}
                <section>
                    <h5 className="fw-bold text-success">
                        <FontAwesomeIcon icon={faFileContract} className="me-2" />
                        ĐIỀU 7: Trách nhiệm của khách hàng
                    </h5>
                    <ul>
                        <li>
                            Khách hàng chịu trách nhiệm về độ chính xác của thông tin cung cấp (cá nhân, tài khoản, thẻ tín dụng...).
                            Kido có quyền hủy đơn hàng nếu phát hiện gian lận.
                        </li>
                        <li>
                            Khách hàng cần kiểm tra tài khoản sau khi thanh toán và thông báo sớm cho Kido khi có sự cố (trong vòng 7 ngày).
                        </li>
                        <li>
                            Cần chủ động cài đặt các biện pháp bảo vệ thiết bị để tránh bị tấn công hoặc nhiễm mã độc khi thanh toán.
                        </li>
                    </ul>
                </section>
            </div>

            {/* Liên hệ hỗ trợ */}
            <div className="bg-light p-4 rounded-3 shadow-sm mt-5">
                <h5 className="fw-bold text-primary mb-2">
                    <FontAwesomeIcon icon={faInfoCircle} className="me-2" />
                    Hỗ trợ & Liên hệ
                </h5>
                <p>
                    Nếu quý khách có thắc mắc về thanh toán, vui lòng liên hệ tại:{" "}
                    <a
                        href="https://www.Kido.edu.vn/lien-he.html"
                        className="text-decoration-none text-success"
                    >
                        https://www.Kido.edu.vn/lien-he.html
                    </a>
                </p>
            </div>
        </div>
    );
}
