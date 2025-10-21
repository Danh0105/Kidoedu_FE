import React, { useEffect } from "react";

/**
 * RETURNS & REFUNDS POLICY PAGE — React + Bootstrap 5 (Kidoedu)
 * --------------------------------------------------------------
 * Trang UI/UX chuẩn, đồng bộ với trang "Chính sách kiểm hàng".
 * - Hero rõ ràng, CTA hotline
 * - Mục lục sticky (ScrollSpy)
 * - Thẻ nội dung (cards), danh sách, cảnh báo
 * - Lịch cập nhật tự động
 *
 * Cách dùng:
 * 1) Thêm Bootstrap 5 + Bootstrap Icons trong index.html
 *    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet"/>
 *    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
 *    <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.css" rel="stylesheet"/>
 * 2) Import & render component:
 *    <ReturnsRefundsPolicyPage hotline="0789 636 979" />
 */

export default function ReturnsRefundsPolicyPage({ hotline = "0789 636 979" }) {
    useEffect(() => {
        const el = document.body;
        if (window.bootstrap && el) {
            try {
                window.bootstrap.ScrollSpy.getInstance(el) ||
                    new window.bootstrap.ScrollSpy(el, { target: "#policyTOC", offset: 120 });
            } catch (_) { }
        }
    }, []);

    const tel = `tel:${hotline.replaceAll(" ", "")}`;

    return (
        <main className="bg-light min-vh-100">
            {/* HERO */}
            <section className="bg-white border-bottom">
                <div className="container py-5">
                    <div className="row align-items-center g-4">
                        <div className="col-lg-8">
                            <h1 className="display-6 fw-bold mb-2">Chính sách đổi trả & hoàn tiền</h1>
                            <p className="lead text-secondary mb-3">
                                Hỗ trợ đổi/ trả theo điều kiện công bố; hoàn tiền minh bạch, nhanh chóng.
                            </p>
                            <div className="d-flex flex-wrap gap-2">
                                <a href={tel} className="btn btn-primary px-3">
                                    <i className="bi bi-telephone-outbound me-2" aria-hidden="true" />Hotline: {hotline}
                                </a>
                                <a href="#dieu-kien" className="btn btn-outline-primary px-3">
                                    <i className="bi bi-info-circle me-2" aria-hidden="true" />Xem điều kiện đổi trả
                                </a>
                            </div>
                        </div>
                        <div className="col-lg-4">
                            <div className="card shadow-sm border-0">
                                <div className="card-body">
                                    <div className="d-flex align-items-start">
                                        <div className="me-3">
                                            <span className="badge rounded-pill text-bg-success">7 ngày</span>
                                        </div>
                                        <div>
                                            <h6 className="mb-1">Gửi trả trong vòng 7 ngày</h6>
                                            <p className="mb-0 text-secondary small">Thông báo trong 48 giờ với các trường hợp thiếu phụ kiện/ quà tặng hoặc bể vỡ.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="container py-4 py-lg-5">
                <div className="row g-4">
                    {/* TOC */}
                    <aside className="col-lg-4 col-xl-3 order-lg-2">
                        <nav id="policyTOC" className="position-sticky" style={{ top: 96 }} aria-label="Mục lục chính sách">
                            <div className="card border-0 shadow-sm">
                                <div className="card-body">
                                    <h6 className="text-uppercase text-secondary fw-semibold small mb-3">Mục lục</h6>
                                    <ul className="nav nav-pills flex-column gap-1">
                                        <li className="nav-item"><a className="nav-link text-start" href="#dieu-kien"><i className="bi bi-check2-square me-2" />Điều kiện đổi trả</a></li>
                                        <li className="nav-item"><a className="nav-link text-start" href="#thoi-gian"><i className="bi bi-calendar2-week me-2" />Thời gian thông báo & gửi</a></li>
                                        <li className="nav-item"><a className="nav-link text-start" href="#hinh-thuc"><i className="bi bi-arrow-repeat me-2" />Hình thức đổi trả</a></li>
                                        <li className="nav-item"><a className="nav-link text-start" href="#hoan-tien"><i className="bi bi-wallet2 me-2" />Hoàn tiền & chi phí</a></li>
                                        <li className="nav-item"><a className="nav-link text-start" href="#lien-he"><i className="bi bi-headset me-2" />Hỗ trợ & liên hệ</a></li>
                                    </ul>
                                </div>
                            </div>
                        </nav>
                    </aside>

                    {/* CONTENT */}
                    <article className="col-lg-8 col-xl-9 order-lg-1">
                        {/* 1. Điều kiện đổi trả */}
                        <section id="dieu-kien" className="mb-4">
                            <div className="card border-0 shadow-sm">
                                <div className="card-body p-4 p-md-5">
                                    <h2 className="h4 fw-bold mb-3"><i className="bi bi-check2-square me-2" />1. Điều kiện đổi trả</h2>
                                    <p className="mb-3">Quý Khách hàng cần kiểm tra tình trạng hàng hóa và có thể đổi/ trả <strong>ngay tại thời điểm giao/ nhận</strong> khi xảy ra các trường hợp sau:</p>
                                    <ul className="mb-3">
                                        <li>Hàng không đúng <strong>chủng loại, mẫu mã</strong> như đơn đã đặt hoặc như hiển thị trên website tại thời điểm đặt.</li>
                                        <li><strong>Không đủ số lượng</strong>, thiếu bộ so với đơn hàng.</li>
                                        <li>Tình trạng bên ngoài bị ảnh hưởng: <em>rách bao bì, bong tróc, bể vỡ…</em></li>
                                    </ul>
                                    <div className="alert alert-warning" role="alert">
                                        <i className="bi bi-file-earmark-text me-2" aria-hidden="true" />
                                        Quý Khách vui lòng cung cấp <strong>giấy tờ/ hình ảnh chứng minh</strong> thiếu sót để hoàn tất thủ tục đổi/ trả.
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* 2. Thời gian thông báo & gửi */}
                        <section id="thoi-gian" className="mb-4">
                            <div className="card border-0 shadow-sm">
                                <div className="card-body p-4 p-md-5">
                                    <h2 className="h5 fw-bold mb-3"><i className="bi bi-calendar2-week me-2" />2. Quy định về thời gian thông báo và gửi sản phẩm đổi trả</h2>
                                    <div className="row g-3">
                                        <div className="col-md-6">
                                            <div className="p-3 border rounded-3 h-100">
                                                <h6 className="fw-semibold mb-1">Thông báo đổi trả</h6>
                                                <p className="mb-0 text-secondary">Trong vòng <strong>48 giờ</strong> kể từ khi nhận sản phẩm đối với trường hợp <em>thiếu phụ kiện, quà tặng</em> hoặc <em>bể vỡ</em>.</p>
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="p-3 border rounded-3 h-100">
                                                <h6 className="fw-semibold mb-1">Gửi chuyển trả sản phẩm</h6>
                                                <p className="mb-0 text-secondary">Trong vòng <strong>7 ngày</strong> kể từ khi nhận sản phẩm.</p>
                                            </div>
                                        </div>
                                        <div className="col-12">
                                            <div className="p-3 border rounded-3">
                                                <h6 className="fw-semibold mb-1">Địa điểm đổi trả</h6>
                                                <p className="mb-0 text-secondary">Quý Khách có thể mang hàng trực tiếp đến văn phòng/ cửa hàng của chúng tôi hoặc gửi qua đường bưu điện.</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="alert alert-info mt-3" role="alert">
                                        <i className="bi bi-chat-left-dots me-2" />Mọi góp ý/ khiếu nại liên quan chất lượng sản phẩm, vui lòng liên hệ đường dây CSKH của chúng tôi.
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* 3. Hình thức đổi trả */}
                        <section id="hinh-thuc" className="mb-4">
                            <div className="card border-0 shadow-sm">
                                <div className="card-body p-4 p-md-5">
                                    <h2 className="h5 fw-bold mb-3"><i className="bi bi-arrow-repeat me-2" />3. Hình thức đổi trả</h2>
                                    <ul className="mb-3">
                                        <li>Đổi đúng <strong>loại sản phẩm</strong> đã đặt đối với trường hợp <em>giao sai hàng/ sai số lượng</em> hoặc <em>hàng không đạt cam kết</em>.</li>
                                        <li>Nếu sản phẩm đã đặt <strong>hết hàng</strong>, có thể đổi sang <strong>sản phẩm khác có giá trị tương đương</strong> nếu Quý Khách đồng ý.</li>
                                    </ul>
                                </div>
                            </div>
                        </section>

                        {/* 4. Hoàn tiền & chi phí */}
                        <section id="hoan-tien" className="mb-4">
                            <div className="card border-0 shadow-sm">
                                <div className="card-body p-4 p-md-5">
                                    <h2 className="h5 fw-bold mb-3"><i className="bi bi-wallet2 me-2" />4. Hoàn tiền & chi phí</h2>
                                    <div className="mb-3">
                                        <p className="mb-2">Nếu Quý Khách <strong>không còn nhu cầu</strong> do lỗi hàng hóa hoặc <strong>không đồng ý</strong> với hàng hóa được đổi lại, công ty sẽ thực hiện hoàn phí:</p>
                                        <ul className="mb-2">
                                            <li>Hình thức hoàn: <strong>chuyển khoản</strong> hoặc phương thức thỏa thuận với khách hàng.</li>
                                            <li>Thời hạn: trong vòng <strong>07 ngày làm việc</strong> kể từ ngày nhận được yêu cầu đầy đủ.</li>
                                            <li><strong>Phí chuyển khoản</strong> (nếu có) do khách hàng chi trả.</li>
                                        </ul>
                                    </div>
                                    <div className="alert alert-secondary" role="alert">
                                        <i className="bi bi-truck me-2" />Khi phát sinh <strong>chi phí vận chuyển</strong> cho hàng đổi/ trả, khách hàng <strong>thanh toán trực tiếp</strong> cho bên vận chuyển.
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Hỗ trợ & liên hệ */}
                        <section id="lien-he" className="mb-4">
                            <div className="card border-0 shadow-sm">
                                <div className="card-body p-4 p-md-5">
                                    <h2 className="h5 fw-bold mb-3"><i className="bi bi-headset me-2" />Hỗ trợ & liên hệ</h2>
                                    <div className="row g-3 align-items-center">
                                        <div className="col-md-8">
                                            <p className="mb-2 text-secondary">Cần hỗ trợ thêm? Liên hệ hotline hoặc truy cập website của chúng tôi.</p>
                                            <div className="d-flex flex-wrap gap-2">
                                                <a href={tel} className="btn btn-outline-primary"><i className="bi bi-telephone me-2" />Gọi: {hotline}</a>
                                                <a href="https://kidoedu.edu.vn" target="_blank" rel="noreferrer" className="btn btn-outline-secondary"><i className="bi bi-globe2 me-2" />Kidoedu.edu.vn</a>
                                            </div>
                                        </div>
                                        <div className="col-md-4">
                                            <div className="text-md-end small text-secondary">Cập nhật lần cuối: {new Date().toLocaleDateString("vi-VN")}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>
                    </article>
                </div>
            </section>


        </main>
    );
}
