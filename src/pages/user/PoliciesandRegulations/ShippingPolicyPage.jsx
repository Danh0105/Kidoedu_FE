import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

// File: ShippingPolicyPage.jsx
// Hướng dẫn: Dán vào src/ShippingPolicyPage.jsx trong project React (ví dụ create-react-app)
// Import trong App.jsx: import ShippingPolicyPage from './ShippingPolicyPage';

export default function ShippingPolicyPage() {
    return (
        <div className="min-vh-100 bg-light d-flex align-items-center">
            <div className="container py-4">
                <div className="row justify-content-center">
                    <div className="col-12 col-md-10 col-lg-8">

                        <div className="card shadow-sm border-0">
                            <div className="card-body p-4">

                                <header className="d-flex align-items-center mb-3 gap-3">
                                    <div className="rounded-circle bg-primary d-flex align-items-center justify-content-center" style={{ width: 64, height: 64 }}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" fill="white" className="bi bi-truck" viewBox="0 0 16 16">
                                            <path d="M0 3a1 1 0 0 1 1-1h9a1 1 0 0 1 1 1v4h2.5a.5.5 0 0 1 .5.5V9h.5a.5.5 0 0 1 0 1h-1a1 1 0 0 1-1 1H12a1 1 0 0 1-1-1H5a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V3z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h1 className="h4 mb-0">Chính sách vận chuyển và giao nhận</h1>
                                        <p className="mb-0 text-muted small">Thông tin dễ đọc — phù hợp cho học sinh tiểu học</p>
                                    </div>
                                </header>

                                {/* Thời hạn và giới hạn vị trí giao hàng */}
                                <section className="mb-3">
                                    <h2 className="h6">1. Thời hạn và khu vực giao hàng</h2>
                                    <p className="mb-1">Kidoedu.edu.vn hỗ trợ giao hàng tận nơi trên toàn quốc.</p>

                                    <div className="bg-white border rounded-3 p-3">
                                        <p className="mb-1"><strong>Nội thành TP.HCM:</strong> giao trong <strong>2–3 ngày làm việc</strong> kể từ khi nhận đơn.</p>
                                        <p className="mb-0"><strong>Ngoại thành / các tỉnh:</strong> giao trong <strong>5–7 ngày làm việc</strong> kể từ khi nhận đơn.</p>
                                    </div>

                                    <div className="alert alert-info mt-3" role="alert">
                                        Trong một vài trường hợp bất khả kháng, giao hàng có thể chậm hơn vài ngày. Ví dụ:
                                        <ul className="mb-0 mt-2">
                                            <li>Không liên lạc được với khách hàng qua điện thoại.</li>
                                            <li>Địa chỉ giao hàng không chính xác hoặc khó tìm.</li>
                                            <li>Lượng đơn tăng đột biến khiến xử lý chậm.</li>
                                            <li>Đối tác cung ứng hoặc vận chuyển chậm hơn dự kiến.</li>
                                        </ul>
                                    </div>
                                </section>

                                {/* Phí vận chuyển */}
                                <section className="mb-3">
                                    <h2 className="h6">2. Phí vận chuyển</h2>
                                    <p>Phí vận chuyển do đơn vị vận chuyển tính và sẽ được thông báo khi nhân viên Kidoedu.edu.vn xác nhận đơn hàng với bạn.</p>

                                    <p className="mb-0">Với khách mua số lượng lớn hoặc khách sỉ, chúng tôi sẽ dùng dịch vụ vận chuyển theo biểu phí của bên vận chuyển hoặc theo thỏa thuận hợp đồng.</p>
                                </section>

                                {/* Chứng từ và đóng gói */}
                                <section className="mb-3">
                                    <h2 className="h6">3. Đóng gói &amp; chứng từ</h2>
                                    <p className="mb-1">Mọi đơn hàng đều được đóng gói và niêm phong cẩn thận trước khi vận chuyển.</p>

                                    <div className="border rounded-3 p-3 bg-white">
                                        <p className="mb-1"><strong>Thông tin trên bao bì:</strong></p>
                                        <ul>
                                            <li>Tên người nhận, số điện thoại, địa chỉ nhận hàng.</li>
                                            <li>Mã vận đơn của đơn hàng.</li>
                                        </ul>
                                        <p className="mb-0">Kidoedu.edu.vn cung cấp hóa đơn tài chính hoặc phiếu xuất kho hợp lệ (nếu có) trong bưu kiện.</p>
                                    </div>

                                    <p className="small text-muted mt-2">Đơn vị vận chuyển có trách nhiệm cung cấp chứng từ khi khách hàng hoặc cơ quan quản lý yêu cầu.</p>
                                </section>

                                {/* Hư hỏng hàng */}
                                <section className="mb-3">
                                    <h2 className="h6">4. Trường hợp hàng bị hư hỏng</h2>
                                    <p>Nếu hàng bị hư hỏng trong quá trình vận chuyển — dù do chúng tôi hay bên thứ ba — Kidoedu.edu.vn sẽ chịu trách nhiệm xử lý cho khách hàng.</p>

                                    <ul>
                                        <li>Bạn có quyền từ chối nhận hàng và yêu cầu đổi trả hoàn phí theo chính sách đổi trả.</li>
                                        <li>Chúng tôi sẽ làm việc với đối tác vận chuyển để giải quyết bồi thường theo thỏa thuận hợp tác.</li>
                                    </ul>
                                </section>

                                {/* Lưu ý về chậm trễ */}
                                <section className="mb-3">
                                    <h2 className="h6">Lưu ý</h2>
                                    <p>Nếu có chậm trễ, chúng tôi sẽ thông báo kịp thời. Khách hàng có thể chọn <strong>Hủy đơn</strong> hoặc <strong>tiếp tục chờ</strong> hàng.</p>
                                </section>

                                <hr />

                                <footer className="d-flex flex-column flex-sm-row justify-content-between align-items-center gap-2">
                                    <div>
                                        <small className="text-muted">Cần giúp đỡ? Liên hệ: <strong>support@kidoedu.edu.vn</strong></small>
                                    </div>

                                </footer>

                            </div>
                        </div>

                        <div className="text-center text-muted small mt-3">Giao diện thân thiện, chữ to, màu sắc nhẹ — phù hợp cho học sinh tiểu học.</div>

                    </div>
                </div>
            </div>

            <style>{`\n        .card-body h2 { font-weight:700; }\n        ul { margin-left: 1rem; }\n      `}</style>
        </div>
    );
}
