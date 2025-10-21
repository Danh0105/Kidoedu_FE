import React, { useEffect } from "react";

/**
 * INSPECTION POLICY PAGE — React + Bootstrap 5
 * -----------------------------------------------------
 * Yêu cầu: Trang chuẩn UI/UX hiển thị "Chính sách kiểm hàng" cho Kidoedu.
 *
 * Cách dùng:
 * 1) Bảo đảm đã import Bootstrap 5 CSS/JS trong index.html hoặc entry file:
 *    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet"/>
 *    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
 * 2) (Tuỳ chọn) Bootstrap Icons cho icon:
 *    <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.css" rel="stylesheet"/>
 * 3) Render <InspectionPolicyPage /> ở route / page mong muốn.
 */

export default function InspectionPolicyPage({ hotline = "0789 636 979" }) {
    useEffect(() => {
        // Kích hoạt scrollspy của Bootstrap nếu có sidebar nav
        const scrollSpyEl = document.body;
        if (window.bootstrap && scrollSpyEl) {
            try {
                window.bootstrap.ScrollSpy.getInstance(scrollSpyEl) ||
                    new window.bootstrap.ScrollSpy(scrollSpyEl, {
                        target: "#policyTOC",
                        offset: 120,
                    });
            } catch (_) { }
        }
    }, []);

    return (
        <main className="bg-light min-vh-100">
            {/* HERO */}
            <section className="bg-white border-bottom">
                <div className="container py-5">
                    <div className="row align-items-center g-4">
                        <div className="col-lg-8">
                            <h1 className="display-6 fw-bold mb-2">
                                Chính sách kiểm hàng
                            </h1>
                            <p className="lead text-secondary mb-3">
                                Quý Khách được quyền <strong>mở gói kiểm tra</strong> trước khi thanh toán.
                                Chúng tôi <strong>không hỗ trợ thử hàng</strong> (không dùng thử sản phẩm).
                            </p>
                            <div className="d-flex flex-wrap gap-2">
                                <a href={`tel:${hotline.replaceAll(" ", "")}`} className="btn btn-primary px-3">
                                    <i className="bi bi-telephone-outbound me-2" aria-hidden="true"></i>
                                    Gọi hotline: {hotline}
                                </a>
                                <a href="#quyen-kiem-tra" className="btn btn-outline-primary px-3">
                                    <i className="bi bi-info-circle me-2" aria-hidden="true"></i>
                                    Xem nhanh quyền & lưu ý
                                </a>
                            </div>
                        </div>
                        <div className="col-lg-4">
                            <div className="card shadow-sm border-0">
                                <div className="card-body">
                                    <div className="d-flex align-items-start">
                                        <div className="me-3">
                                            <span className="badge rounded-pill text-bg-primary">COD</span>
                                        </div>
                                        <div>
                                            <h6 className="mb-1">Thanh toán khi nhận hàng</h6>
                                            <p className="mb-0 text-secondary small">
                                                Vui lòng kiểm tra gói hàng trước khi thanh toán cho nhân viên giao hàng.
                                            </p>
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
                                        <li className="nav-item">
                                            <a className="nav-link text-start" href="#quyen-kiem-tra">
                                                <i className="bi bi-shield-check me-2" aria-hidden="true"></i>
                                                Quyền kiểm tra
                                            </a>
                                        </li>
                                        <li className="nav-item">
                                            <a className="nav-link text-start" href="#khong-thu-hang">
                                                <i className="bi bi-ban me-2" aria-hidden="true"></i>
                                                Không hỗ trợ thử hàng
                                            </a>
                                        </li>
                                        <li className="nav-item">
                                            <a className="nav-link text-start" href="#quy-trinh-cod">
                                                <i className="bi bi-cash-coin me-2" aria-hidden="true"></i>
                                                Quy trình nhận/ thanh toán (COD)
                                            </a>
                                        </li>
                                        <li className="nav-item">
                                            <a className="nav-link text-start" href="#tu-choi-nhan">
                                                <i className="bi bi-box-arrow-left me-2" aria-hidden="true"></i>
                                                Từ chối nhận & phí hoàn
                                            </a>
                                        </li>
                                        <li className="nav-item">
                                            <a className="nav-link text-start" href="#luu-y">
                                                <i className="bi bi-exclamation-triangle me-2" aria-hidden="true"></i>
                                                Lưu ý quan trọng
                                            </a>
                                        </li>
                                        <li className="nav-item">
                                            <a className="nav-link text-start" href="#ho-tro">
                                                <i className="bi bi-headset me-2" aria-hidden="true"></i>
                                                Hỗ trợ & liên hệ
                                            </a>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </nav>
                    </aside>

                    {/* CONTENT */}
                    <article className="col-lg-8 col-xl-9 order-lg-1">
                        {/* Quyền kiểm tra */}
                        <section id="quyen-kiem-tra" className="mb-4">
                            <div className="card border-0 shadow-sm">
                                <div className="card-body p-4 p-md-5">
                                    <h2 className="h4 fw-bold mb-3">
                                        <i className="bi bi-shield-check me-2" aria-hidden="true"></i>
                                        Quyền kiểm hàng trước khi nhận
                                    </h2>
                                    <p className="mb-3">
                                        Trước khi nhận hàng và thanh toán, Quý Khách <strong>được quyền kiểm tra sản phẩm</strong> bằng cách
                                        <strong> mở gói hàng</strong> để đối chiếu <em>mẫu mã</em> và <em>số lượng</em> có đúng như đơn đặt.
                                    </p>
                                    <ul className="mb-0">
                                        <li>Nhân viên giao nhận có trách nhiệm <strong>đợi Quý Khách kiểm tra</strong> bên trong gói hàng.</li>
                                        <li>Vui lòng <strong>không dùng vật sắc nhọn</strong> khi mở để tránh làm hư hỏng sản phẩm.</li>
                                    </ul>
                                </div>
                            </div>
                        </section>

                        {/* Không thử hàng */}
                        <section id="khong-thu-hang" className="mb-4">
                            <div className="card border-0 shadow-sm">
                                <div className="card-body p-4 p-md-5">
                                    <h2 className="h5 fw-bold mb-3">
                                        <i className="bi bi-ban me-2" aria-hidden="true"></i>
                                        Không hỗ trợ thử hàng
                                    </h2>
                                    <p className="mb-0">
                                        Chính sách áp dụng <strong>không thử</strong> và <strong>không dùng thử</strong> sản phẩm trong quá trình kiểm tra.
                                    </p>
                                </div>
                            </div>
                        </section>

                        {/* Quy trình COD */}
                        <section id="quy-trinh-cod" className="mb-4">
                            <div className="card border-0 shadow-sm">
                                <div className="card-body p-4 p-md-5">
                                    <h2 className="h5 fw-bold mb-3">
                                        <i className="bi bi-cash-coin me-2" aria-hidden="true"></i>
                                        Quy trình nhận hàng & thanh toán (COD)
                                    </h2>
                                    <ol className="mb-3">
                                        <li>Mở gói và kiểm tra đúng <strong>mẫu mã</strong>, <strong>số lượng</strong> như đơn hàng.</li>
                                        <li>Nếu <strong>đồng ý</strong> với sản phẩm được giao, Quý Khách tiến hành thanh toán cho nhân viên giao hàng.</li>
                                        <li>Nhận hàng và hoàn tất giao dịch.</li>
                                    </ol>
                                    <div className="alert alert-info mb-0" role="alert">
                                        <i className="bi bi-info-circle me-2" aria-hidden="true"></i>
                                        Nếu giao dịch COD, việc thanh toán được thực hiện <strong>sau khi Quý Khách đã kiểm tra</strong> gói hàng.
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Từ chối nhận & phí hoàn */}
                        <section id="tu-choi-nhan" className="mb-4">
                            <div className="card border-0 shadow-sm">
                                <div className="card-body p-4 p-md-5">
                                    <h2 className="h5 fw-bold mb-3">
                                        <i className="bi bi-box-arrow-left me-2" aria-hidden="true"></i>
                                        Trường hợp không ưng ý & phí hoàn hàng
                                    </h2>
                                    <p className="mb-2">
                                        Trong trường hợp Quý Khách <strong>không ưng ý</strong> với sản phẩm, Quý Khách có thể <strong>từ chối nhận hàng</strong>.
                                    </p>
                                    <p className="mb-0">
                                        Khi đó, chúng tôi sẽ thu thêm <strong>chi phí hoàn hàng</strong>, tương đương với <strong>phí ship</strong> của đơn hàng Quý Khách đã đặt.
                                    </p>
                                </div>
                            </div>
                        </section>

                        {/* Lưu ý quan trọng */}
                        <section id="luu-y" className="mb-4">
                            <div className="card border-0 shadow-sm">
                                <div className="card-body p-4 p-md-5">
                                    <h2 className="h5 fw-bold mb-3">
                                        <i className="bi bi-exclamation-triangle me-2" aria-hidden="true"></i>
                                        Lưu ý quan trọng
                                    </h2>

                                    <div className="accordion" id="notesAccordion">
                                        <div className="accordion-item">
                                            <h2 className="accordion-header" id="note1h">
                                                <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#note1" aria-expanded="true" aria-controls="note1">
                                                    Nhân viên giao nhận phải chờ bạn kiểm tra
                                                </button>
                                            </h2>
                                            <div id="note1" className="accordion-collapse collapse show" aria-labelledby="note1h" data-bs-parent="#notesAccordion">
                                                <div className="accordion-body">
                                                    Trường hợp nhân viên từ chối cho kiểm tra, vui lòng liên hệ <strong>Kidoedu.edu.vn</strong> qua hotline <a href={`tel:${hotline.replaceAll(" ", "")}`}>{hotline}</a> để được hỗ trợ.
                                                </div>
                                            </div>
                                        </div>

                                        <div className="accordion-item">
                                            <h2 className="accordion-header" id="note2h">
                                                <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#note2" aria-expanded="false" aria-controls="note2">
                                                    Tránh dùng vật sắc nhọn khi mở gói hàng
                                                </button>
                                            </h2>
                                            <div id="note2" className="accordion-collapse collapse" aria-labelledby="note2h" data-bs-parent="#notesAccordion">
                                                <div className="accordion-body">
                                                    Nếu sản phẩm bị hư hỏng do lỗi từ phía Khách hàng trong quá trình mở hộp, rất tiếc <strong>Kidoedu.edu.vn</strong> không thể hỗ trợ đổi/trả/bảo hành.
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Hỗ trợ */}
                        <section id="ho-tro" className="mb-4">
                            <div className="card border-0 shadow-sm">
                                <div className="card-body p-4 p-md-5">
                                    <h2 className="h5 fw-bold mb-3">
                                        <i className="bi bi-headset me-2" aria-hidden="true"></i>
                                        Hỗ trợ & liên hệ
                                    </h2>
                                    <div className="row g-3 align-items-center">
                                        <div className="col-md-8">
                                            <p className="mb-2 text-secondary">
                                                Nếu cần hỗ trợ thêm, vui lòng liên hệ chúng tôi qua hotline hoặc fanpage.
                                            </p>
                                            <div className="d-flex flex-wrap gap-2">
                                                <a href={`tel:${hotline.replaceAll(" ", "")}`} className="btn btn-outline-primary">
                                                    <i className="bi bi-telephone me-2" aria-hidden="true"></i>
                                                    Gọi: {hotline}
                                                </a>
                                                <a href="https://kidoedu.edu.vn" target="_blank" rel="noreferrer" className="btn btn-outline-secondary">
                                                    <i className="bi bi-globe2 me-2" aria-hidden="true"></i>
                                                    Kidoedu.edu.vn
                                                </a>
                                            </div>
                                        </div>
                                        <div className="col-md-4">
                                            <div className="text-md-end small text-secondary">
                                                Cập nhật lần cuối: {new Date().toLocaleDateString("vi-VN")}
                                            </div>
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
