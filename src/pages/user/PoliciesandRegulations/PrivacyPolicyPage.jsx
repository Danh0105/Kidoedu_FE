import React, { useEffect } from "react";

/**
 * PRIVACY POLICY PAGE — React + Bootstrap 5 (Kidoedu)
 * ---------------------------------------------------
 * Trang UI/UX chuẩn cho “Chính Sách Bảo Mật Thông Tin”.
 * - Hero, CTA hotline/email
 * - Mục lục sticky (ScrollSpy)
 * - Thẻ nội dung (cards), danh sách, bảng dữ liệu thu thập
 * - Phần liên hệ & cập nhật
 *
 * Cách dùng:
 * 1) Thêm Bootstrap 5 + Bootstrap Icons vào index.html
 *    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet"/>
 *    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
 *    <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.css" rel="stylesheet"/>
 * 2) Import & render component:
 *    <PrivacyPolicyPage hotline="0789 636 979" email="lytran@ichiskill.edu.vn" />
 */

export default function PrivacyPolicyPage({
    hotline = "0789 636 979",
    email = "lytran@ichiskill.edu.vn",
    companyName = "CÔNG TY TNHH KIDO EDU",
    address = "Số 1 Đường Cộng Hòa 3, Phường Phú Thọ Hòa, TP Hồ Chí Minh, Việt Nam",
    website = "https://kidoedu.edu.vn",
}) {
    useEffect(() => {
        const el = document.body;
        if (window.bootstrap && el) {
            try {
                window.bootstrap.ScrollSpy.getInstance(el) ||
                    new window.bootstrap.ScrollSpy(el, { target: "#policyTOC", offset: 120 });
            } catch (_) { }
        }
    }, []);

    const telHref = `tel:${hotline.replaceAll(" ", "")}`;
    const mailHref = `mailto:${email}`;

    return (
        <main className="bg-light min-vh-100">
            {/* HERO */}
            <section className="bg-white border-bottom">
                <div className="container py-5">
                    <div className="row align-items-center g-4">
                        <div className="col-lg-8">
                            <h1 className="display-6 fw-bold mb-2">Chính Sách Bảo Mật Thông Tin</h1>
                            <p className="lead text-secondary mb-3">
                                Chúng tôi tôn trọng và cam kết bảo vệ dữ liệu cá nhân của Quý Khách; không bán, chia sẻ hay trao đổi thông tin cho bên thứ ba ngoài phạm vi đã công bố.
                            </p>
                            <div className="d-flex flex-wrap gap-2">
                                <a href={telHref} className="btn btn-primary"><i className="bi bi-telephone-outbound me-2" />Gọi: {hotline}</a>
                                <a href={mailHref} className="btn btn-outline-primary"><i className="bi bi-envelope-open me-2" />Email: {email}</a>
                                <a href="#muc-dich" className="btn btn-outline-secondary"><i className="bi bi-shield-lock me-2" />Xem chi tiết</a>
                            </div>
                        </div>
                        <div className="col-lg-4">
                            <div className="card shadow-sm border-0">
                                <div className="card-body">
                                    <div className="d-flex align-items-start">
                                        <div className="me-3"><span className="badge rounded-pill text-bg-success">Nội bộ</span></div>
                                        <div>
                                            <h6 className="mb-1">Sử dụng nội bộ</h6>
                                            <p className="mb-0 text-secondary small">Thông tin cá nhân chỉ được xử lý trong phạm vi công ty và đối tác thực hiện dịch vụ theo hợp đồng.</p>
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
                                        <li className="nav-item"><a className="nav-link text-start" href="#muc-dich"><i className="bi bi-bullseye me-2" />1. Mục đích & phạm vi thu thập</a></li>
                                        <li className="nav-item"><a className="nav-link text-start" href="#pham-vi-su-dung"><i className="bi bi-diagram-3 me-2" />2. Phạm vi sử dụng</a></li>
                                        <li className="nav-item"><a className="nav-link text-start" href="#luu-tru"><i className="bi bi-archive me-2" />3. Thời gian lưu trữ</a></li>
                                        <li className="nav-item"><a className="nav-link text-start" href="#tiep-can"><i className="bi bi-people me-2" />4. Đối tượng được tiếp cận</a></li>
                                        <li className="nav-item"><a className="nav-link text-start" href="#don-vi"><i className="bi bi-building me-2" />5. Đơn vị quản lý</a></li>
                                        <li className="nav-item"><a className="nav-link text-start" href="#chinh-sua"><i className="bi bi-pencil-square me-2" />6. Tiếp cận & chỉnh sửa dữ liệu</a></li>
                                        <li className="nav-item"><a className="nav-link text-start" href="#khieu-nai"><i className="bi bi-shield-check me-2" />7. Khiếu nại & cam kết bảo mật</a></li>
                                    </ul>
                                </div>
                            </div>
                        </nav>
                    </aside>

                    {/* CONTENT */}
                    <article className="col-lg-8 col-xl-9 order-lg-1">
                        {/* 1. Mục đích & phạm vi thu thập */}
                        <section id="muc-dich" className="mb-4">
                            <div className="card border-0 shadow-sm">
                                <div className="card-body p-4 p-md-5">
                                    <h2 className="h4 fw-bold mb-3"><i className="bi bi-bullseye me-2" />1. Mục đích và phạm vi thu thập thông tin</h2>
                                    <p className="mb-2">Kidoedu.edu.vn <strong>không bán, chia sẻ hay trao đổi</strong> thông tin cá nhân của khách hàng cho bất kỳ bên thứ ba nào khác. Thông tin cá nhân được thu thập <strong>chỉ sử dụng trong nội bộ công ty</strong>.</p>
                                    <p className="mb-3">Thông tin thu thập khi bạn liên hệ đăng ký dịch vụ bao gồm:</p>
                                    <div className="table-responsive">
                                        <table className="table table-sm align-middle">
                                            <thead>
                                                <tr>
                                                    <th className="text-nowrap">Nhóm dữ liệu</th>
                                                    <th>Nội dung cụ thể</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr>
                                                    <td className="text-nowrap">Thông tin cá nhân</td>
                                                    <td>Họ và tên; Địa chỉ; Điện thoại; Email</td>
                                                </tr>
                                                <tr>
                                                    <td className="text-nowrap">Thông tin dịch vụ</td>
                                                    <td>Tên sản phẩm; Số lượng; Thời gian giao nhận sản phẩm</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* 2. Phạm vi sử dụng */}
                        <section id="pham-vi-su-dung" className="mb-4">
                            <div className="card border-0 shadow-sm">
                                <div className="card-body p-4 p-md-5">
                                    <h2 className="h5 fw-bold mb-3"><i className="bi bi-diagram-3 me-2" />2. Phạm vi sử dụng thông tin</h2>
                                    <p className="mb-2">Thông tin cá nhân chỉ được {companyName} sử dụng trong nội bộ cho các mục đích sau:</p>
                                    <ul className="mb-2">
                                        <li>Hỗ trợ khách hàng; cung cấp thông tin liên quan đến dịch vụ.</li>
                                        <li>Xử lý đơn đặt hàng và cung cấp dịch vụ/ thông tin qua website theo yêu cầu của bạn.</li>
                                        <li>Gửi thông tin sản phẩm/ dịch vụ mới, sự kiện sắp tới, thông tin tuyển dụng (khi bạn đăng ký nhận email).</li>
                                        <li>Hỗ trợ quản lý tài khoản; xác nhận và thực hiện giao dịch tài chính liên quan đến thanh toán trực tuyến.</li>
                                    </ul>
                                    <div className="alert alert-secondary" role="alert">
                                        <i className="bi bi-info-circle me-2" />Bạn có thể hủy đăng ký nhận email bất kỳ lúc nào qua liên kết ở cuối email hoặc liên hệ CSKH.
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* 3. Lưu trữ */}
                        <section id="luu-tru" className="mb-4">
                            <div className="card border-0 shadow-sm">
                                <div className="card-body p-4 p-md-5">
                                    <h2 className="h5 fw-bold mb-3"><i className="bi bi-archive me-2" />3. Thời gian lưu trữ thông tin</h2>
                                    <p className="mb-2">Đối với thông tin cá nhân, {companyName} sẽ <strong>xóa dữ liệu</strong> khi khách hàng có yêu cầu.</p>
                                    <p className="mb-0">Yêu cầu xóa dữ liệu xin gửi về email <a href={mailHref}>{email}</a>.</p>
                                </div>
                            </div>
                        </section>

                        {/* 4. Đối tượng tiếp cận */}
                        <section id="tiep-can" className="mb-4">
                            <div className="card border-0 shadow-sm">
                                <div className="card-body p-4 p-md-5">
                                    <h2 className="h5 fw-bold mb-3"><i className="bi bi-people me-2" />4. Những người/ tổ chức có thể tiếp cận</h2>
                                    <ul className="mb-2">
                                        <li>{companyName}</li>
                                        <li>Các <strong>đối tác ký hợp đồng</strong> thực hiện một phần dịch vụ của {companyName}. Các đối tác nhận thông tin theo thỏa thuận (một phần/ toàn bộ) để hỗ trợ người dùng theo phạm vi hợp đồng.</li>
                                    </ul>
                                </div>
                            </div>
                        </section>

                        {/* 5. Đơn vị quản lý */}
                        <section id="don-vi" className="mb-4">
                            <div className="card border-0 shadow-sm">
                                <div className="card-body p-4 p-md-5">
                                    <h2 className="h5 fw-bold mb-3"><i className="bi bi-building me-2" />5. Địa chỉ đơn vị thu thập & quản lý</h2>
                                    <div className="row g-2">
                                        <div className="col-12 col-md-6">
                                            <div className="p-3 border rounded-3 h-100">
                                                <h6 className="fw-semibold mb-1">{companyName}</h6>
                                                <ul className="list-unstyled mb-0 small text-secondary">
                                                    <li><i className="bi bi-geo me-2" />Địa chỉ: {address}</li>
                                                    <li><i className="bi bi-telephone me-2" />Điện thoại: <a href={telHref}>{hotline}</a></li>
                                                    <li><i className="bi bi-globe2 me-2" />Website: <a href={website} target="_blank" rel="noreferrer">{website}</a></li>
                                                    <li><i className="bi bi-envelope me-2" />Email: <a href={mailHref}>{email}</a></li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* 6. Tiếp cận & chỉnh sửa dữ liệu */}
                        <section id="chinh-sua" className="mb-4">
                            <div className="card border-0 shadow-sm">
                                <div className="card-body p-4 p-md-5">
                                    <h2 className="h5 fw-bold mb-3"><i className="bi bi-pencil-square me-2" />6. Phương tiện & công cụ để tiếp cận/ chỉnh sửa dữ liệu</h2>
                                    <p className="mb-2">Kidoedu.edu.vn thu thập thông tin qua trang web, email đặt mua và số điện thoại liên hệ.</p>
                                    <ul className="mb-2">
                                        <li>Email: <a href={mailHref}>{email}</a></li>
                                        <li>Điện thoại: <a href={telHref}>{hotline}</a></li>
                                    </ul>
                                    <p className="mb-0">Bạn có thể liên hệ qua các kênh trên để yêu cầu cập nhật/ chỉnh sửa dữ liệu cá nhân.</p>
                                </div>
                            </div>
                        </section>

                        {/* 7. Khiếu nại & cam kết */}
                        <section id="khieu-nai" className="mb-4">
                            <div className="card border-0 shadow-sm">
                                <div className="card-body p-4 p-md-5">
                                    <h2 className="h5 fw-bold mb-3"><i className="bi bi-shield-check me-2" />7. Cơ chế tiếp nhận & giải quyết khiếu nại</h2>
                                    <p className="mb-2">Tại Kidoedu.edu.vn, việc bảo vệ thông tin cá nhân của bạn là rất quan trọng. Chúng tôi cam kết không chia sẻ, bán hoặc cho thuê dữ liệu của bạn; chỉ sử dụng trong các trường hợp:</p>
                                    <ul className="mb-2">
                                        <li>Nâng cao chất lượng dịch vụ cho khách hàng.</li>
                                        <li>Giải quyết tranh chấp, khiếu nại.</li>
                                        <li>Khi cơ quan pháp luật có yêu cầu hợp lệ.</li>
                                    </ul>
                                    <div className="alert alert-info" role="alert">
                                        <i className="bi bi-telephone-inbound me-2" />Mọi thắc mắc, góp ý, hoặc khiếu nại liên quan đến bảo mật và việc sử dụng thông tin sai mục đích xin liên hệ <strong>hotline {hotline}</strong> hoặc <a href={mailHref}>{email}</a>.
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Cập nhật */}
                        <section className="mb-4">
                            <div className="text-end small text-secondary">Cập nhật lần cuối: {new Date().toLocaleDateString("vi-VN")}</div>
                        </section>
                    </article>
                </div>
            </section>
        </main>
    );
}
