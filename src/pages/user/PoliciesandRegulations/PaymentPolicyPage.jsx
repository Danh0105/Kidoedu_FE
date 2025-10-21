import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

// File: PaymentPolicyPage.jsx
// Mô tả: Trang "Chính sách thanh toán" viết bằng React + Bootstrap 5
// Hướng dẫn: dán vào src/PaymentPolicyPage.jsx, import trong App.jsx: import PaymentPolicyPage from './PaymentPolicyPage'

export default function PaymentPolicyPage() {
    return (
        <div className="min-vh-100 bg-light d-flex align-items-center">
            <div className="container py-4">
                <div className="row justify-content-center">
                    <div className="col-12 col-md-10 col-lg-8">
                        <div className="card shadow-sm border-0">
                            <div className="card-body p-4">

                                <header className="d-flex align-items-center mb-3 gap-3">
                                    <div className="rounded-circle bg-success d-flex align-items-center justify-content-center" style={{ width: 64, height: 64 }}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" fill="white" className="bi bi-wallet2" viewBox="0 0 16 16">
                                            <path d="M12 1a1 1 0 0 1 1 1v1h1.5A1.5 1.5 0 0 1 16 4.5v7A1.5 1.5 0 0 1 14.5 13H1.5A1.5 1.5 0 0 1 0 11.5v-8A1.5 1.5 0 0 1 1.5 2H12zM3 4h8v7H3V4z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h1 className="h4 mb-0">Chính sách thanh toán</h1>
                                        <p className="mb-0 text-muted small">Các phương thức thanh toán — dễ hiểu cho học sinh tiểu học</p>
                                    </div>
                                </header>

                                <section className="mb-3">
                                    <p className="lead">Có <strong>3 hình thức thanh toán</strong>, bạn hãy chọn cách nào tiện nhất:</p>

                                    <div className="row g-3">
                                        <div className="col-12 col-md-4">
                                            <div className="card h-100 border-0">
                                                <div className="card-body p-3 text-center">
                                                    <div className="mb-2">1</div>
                                                    <h2 className="h6">Thanh toán tiền mặt</h2>
                                                    <p className="small mb-0">Bạn đến địa chỉ kinh doanh của chúng tôi và thanh toán tại chỗ.</p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="col-12 col-md-4">
                                            <div className="card h-100 border-0">
                                                <div className="card-body p-3 text-center">
                                                    <div className="mb-2">2</div>
                                                    <h2 className="h6">Thanh toán khi nhận hàng (COD)</h2>
                                                    <p className="small mb-0">Nhân viên giao hàng mang hàng tới, bạn kiểm tra rồi trả tiền mặt cho nhân viên.</p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="col-12 col-md-4">
                                            <div className="card h-100 border-0">
                                                <div className="card-body p-3 text-center">
                                                    <div className="mb-2">3</div>
                                                    <h2 className="h6">Chuyển khoản trước</h2>
                                                    <p className="small mb-0">Bạn chuyển tiền trước, chúng tôi sẽ giao hàng theo thỏa thuận.</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </section>

                                <section className="mb-3">
                                    <h3 className="h6">Thông tin tài khoản (ví dụ)</h3>
                                    <div className="border rounded-3 p-3 bg-white">
                                        <p className="mb-1"><strong>Tên tài khoản:</strong> <span className="text-muted">[Nhập tên tài khoản]</span></p>
                                        <p className="mb-1"><strong>Số tài khoản:</strong> <span className="text-muted">[Nhập số tài khoản]</span></p>
                                        <p className="mb-0"><strong>Ngân hàng:</strong> <span className="text-muted">[Nhập tên ngân hàng]</span></p>
                                    </div>

                                    <div className="alert alert-warning mt-3" role="alert">
                                        <strong>Lưu ý chuyển khoản:</strong> Ghi rõ <em>Số điện thoại</em> hoặc <em>Số đơn hàng</em> trong nội dung chuyển tiền.
                                    </div>
                                </section>

                                <section className="mb-3">
                                    <h3 className="h6">Sau khi chuyển khoản</h3>
                                    <ul>
                                        <li>Chúng tôi sẽ <strong>liên hệ xác nhận</strong> và tiến hành giao hàng.</li>
                                        <li>Nếu sau thời gian đã thỏa thuận mà chúng tôi không giao hàng hoặc không phản hồi, bạn có thể gửi khiếu nại trực tiếp về địa chỉ trụ sở.</li>
                                    </ul>
                                </section>

                                <section className="mb-3">
                                    <h3 className="h6">Cam kết của chúng tôi</h3>
                                    <p className="mb-0">Chúng tôi cam kết <strong>kinh doanh minh bạch, hợp pháp</strong>, bán hàng chất lượng và có nguồn gốc rõ ràng.</p>
                                </section>

                                <hr />

                                <footer className="d-flex flex-column flex-sm-row justify-content-between align-items-center gap-2">
                                    <div>
                                        <small className="text-muted">Cần trợ giúp? Liên hệ: <strong>support@kidoedu.edu.vn</strong></small>
                                    </div>
                                    <div className="d-flex gap-2">
                                        <button className="btn btn-outline-success btn-sm">In thông tin</button>
                                        <button className="btn btn-success btn-sm">Quay về trang chủ</button>
                                    </div>
                                </footer>

                            </div>
                        </div>

                        <div className="text-center text-muted small mt-3">Giao diện thân thiện, chữ lớn, màu nhẹ — phù hợp cho học sinh tiểu học.</div>

                    </div>
                </div>
            </div>

            <style>{`\n        .card-body h2 { font-weight:700; }\n        .lead { line-height: 1.4; }\n        @media (max-width:576px) { .lead { font-size: 1rem; } }\n      `}</style>
        </div>
    );
}
