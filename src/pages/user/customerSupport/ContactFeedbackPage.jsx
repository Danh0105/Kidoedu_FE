import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faEnvelope,
    faPhone,
    faUser,
    faComments,
    faLocationDot,
    faPaperPlane,
    faHeart,
} from "@fortawesome/free-solid-svg-icons";

export default function ContactFeedbackPage() {
    return (
        <div className="container my-5">
            {/* Header */}
            <div className="text-center mb-5">
                <h1 className="fw-bold text-primary mb-3">
                    <FontAwesomeIcon icon={faComments} className="me-2" />
                    Liên hệ & Góp ý
                </h1>
                <p className="text-muted fs-5">
                    Hãy chia sẻ với chúng tôi những ý kiến, nhận xét hoặc góp ý của bạn về sản phẩm, dịch vụ, nhân viên
                    và các hoạt động của <strong>Kido</strong>.
                </p>
            </div>

            {/* Giới thiệu */}
            <div className="card shadow-sm border-0 p-4 mb-5">
                <h4 className="fw-bold text-success mb-3">Lắng nghe từ bạn – Động lực của chúng tôi</h4>
                <p>
                    Chúng tôi tin rằng <strong>khách hàng là người thầy quý giá nhất</strong>.
                    Những chia sẻ chân thành từ bạn sẽ giúp chúng tôi hiểu mình hơn, nhìn nhận đúng những điều đã làm được
                    và chưa làm được, từ đó cải thiện không ngừng để mang lại <strong>sản phẩm & dịch vụ tốt nhất</strong>.
                </p>
                <p>
                    Hãy cởi mở chia sẻ những điều bạn <strong>hài lòng</strong> hay <strong>chưa hài lòng</strong>.
                    Kido cam kết trân trọng mọi ý kiến đóng góp để cùng bạn xây dựng trải nghiệm ngày càng hoàn hảo hơn.
                </p>
                <p className="fst-italic text-secondary">
                    “Một khách hàng khó tính chính là người thầy nghiêm khắc nhất giúp chúng tôi trưởng thành.”
                </p>
            </div>

            {/* Thông tin liên hệ */}
            <div className="row g-4 mb-5">
                <div className="col-md-6">
                    <div className="bg-light p-4 rounded-3 shadow-sm h-100">
                        <h5 className="fw-bold text-primary mb-3">
                            <FontAwesomeIcon icon={faPhone} className="me-2" />
                            Liên hệ qua điện thoại
                        </h5>
                        <p>
                            Bộ phận chăm sóc khách hàng <br />
                            <strong>ĐT: 0789 636 979
                            </strong>
                        </p>
                    </div>
                </div>
                <div className="col-md-6">
                    <div className="bg-light p-4 rounded-3 shadow-sm h-100">
                        <h5 className="fw-bold text-success mb-3">
                            <FontAwesomeIcon icon={faEnvelope} className="me-2" />
                            Gửi thư góp ý
                        </h5>
                        <p className="mb-1">
                            Bộ phận chăm sóc khách hàng – <strong>CÔNG TY TNHH KIDO EDU</strong>
                        </p>
                        <p className="mb-1">
                            <FontAwesomeIcon icon={faLocationDot} className="me-2 text-danger" />
                            16/17 Nguyễn Thiện Thuật, Phường Bàn Cờ, TP. Hồ Chí Minh
                        </p>
                        <p className="mb-0">
                            📧 <a href="mailto:lytran@ichiskill.edu.vn" className="text-decoration-none text-primary">
                                lytran@ichiskill.edu.vn
                            </a>
                        </p>
                    </div>
                </div>
            </div>

            {/* Form góp ý */}
            <div className="card border-0 shadow-sm p-4">
                <h4 className="fw-bold text-primary mb-4">
                    <FontAwesomeIcon icon={faPaperPlane} className="me-2" />
                    Gửi góp ý trực tuyến
                </h4>
                <form>
                    <div className="row g-3">
                        <div className="col-md-6">
                            <label className="form-label fw-semibold">
                                <FontAwesomeIcon icon={faUser} className="me-2" />
                                Họ và tên
                            </label>
                            <input type="text" className="form-control" placeholder="Nhập họ và tên của bạn" required />
                        </div>
                        <div className="col-md-6">
                            <label className="form-label fw-semibold">
                                <FontAwesomeIcon icon={faEnvelope} className="me-2" />
                                Email
                            </label>
                            <input type="email" className="form-control" placeholder="Nhập email của bạn" required />
                        </div>
                        <div className="col-md-12">
                            <label className="form-label fw-semibold">
                                <FontAwesomeIcon icon={faComments} className="me-2" />
                                Nội dung góp ý
                            </label>
                            <textarea
                                className="form-control"
                                rows="5"
                                placeholder="Chia sẻ suy nghĩ, góp ý hoặc phản hồi của bạn..."
                                required
                            ></textarea>
                        </div>
                    </div>
                    <div className="text-center mt-4">
                        <button type="submit" className="btn btn-success px-4 py-2 shadow-sm">
                            <FontAwesomeIcon icon={faPaperPlane} className="me-2" />
                            Gửi góp ý
                        </button>
                    </div>
                </form>
            </div>

            {/* Cảm ơn */}
            <div className="text-center mt-5 text-secondary">
                <FontAwesomeIcon icon={faHeart} className="text-danger fs-4 me-2" />
                <p className="d-inline fw-semibold">
                    Kido trân trọng mọi ý kiến đóng góp – Cảm ơn bạn đã đồng hành cùng chúng tôi!
                </p>
            </div>
        </div>
    );
}
