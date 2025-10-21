import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

// Component: PriceInfoPage
// Hướng dẫn: Thêm file này vào project React (ví dụ create-react-app) như src/PriceInfoPage.jsx
// - Cài Bootstrap: `npm install bootstrap` hoặc dùng CDN trong public/index.html
// - Import file này trong App.jsx: `import PriceInfoPage from './PriceInfoPage';` và sử dụng <PriceInfoPage />

export default function PriceInfoPage() {
    return (
        <div className="container bg-light d-flex align-items-center">
            <div className="container py-4">
                <div className="row justify-content-center">
                    <div className="col-12 col-md-10 col-lg-8">

                        {/* Card chính */}
                        <div className="card shadow-sm border-0">
                            <div className="card-body p-4">

                                {/* Header thân thiện cho học sinh */}
                                <header className="d-flex align-items-center mb-3">
                                    <div className="me-3 rounded-circle bg-primary d-flex align-items-center justify-content-center" style={{ width: 64, height: 64 }}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" fill="white" className="bi bi-tag" viewBox="0 0 16 16">
                                            <path d="M2 2a1 1 0 0 0-1 1v3.586a1 1 0 0 0 .293.707l6 6a1 1 0 0 0 1.414 0l3.586-3.586a1 1 0 0 0 0-1.414l-6-6A1 1 0 0 0 5.586 2H2zm3 3a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h1 className="h4 mb-0">Thông tin về giá sản phẩm</h1>
                                        <p className="mb-0 text-muted small">Dễ đọc, rõ ràng — dành cho học sinh tiểu học</p>
                                    </div>
                                </header>

                                {/* Nội dung chính - chia khối để dễ nhìn */}
                                <section className="mb-3">
                                    <p className="lead fw-normal" style={{ fontSize: '1.05rem' }}>
                                        Tổng số tiền thanh toán trên website đã bao gồm các thuế và phí đóng gói.
                                    </p>

                                    <div className="alert alert-info rounded-3" role="alert">
                                        <strong>Lưu ý:</strong> Giá trên website chưa bao gồm <strong>phí vận chuyển</strong> và <strong>các chi phí phát sinh khác</strong>.
                                    </div>

                                    <p>
                                        Những phí chưa bao gồm sẽ được thông báo cho khách hàng khi nhân viên <strong>Kidoedu.edu.vn</strong> xác nhận đơn hàng.
                                    </p>

                                    <p>
                                        Ngoài ra, <strong>Kidoedu.edu.vn</strong> không chịu trách nhiệm với các khoản phí có thể phát sinh theo chính sách của ngân hàng phát hành thẻ nếu khách hàng chọn thanh toán qua chuyển khoản ngân hàng.
                                    </p>
                                </section>

                                <hr />

                                <section className="mb-3">
                                    <h2 className="h6">Giá bán niêm yết</h2>
                                    <p>
                                        Giá bán niêm yết trên website là <strong>giá chính thức</strong> được Kidoedu.edu.vn cung cấp cho người tiêu dùng tham khảo và giao dịch trên website hoặc mua trực tiếp tại cửa hàng.
                                    </p>

                                    <div className="bg-light border rounded-3 p-3">
                                        <p className="mb-1"><strong>Quyền thay đổi giá:</strong></p>
                                        <ul className="mb-0">
                                            <li>Kidoedu.edu.vn có thể thay đổi giá sản phẩm hoặc ngưng bán một hoặc nhiều sản phẩm bất kỳ lúc nào mà không cần báo trước.</li>
                                            <li>Trừ trường hợp khách hàng đã <strong>thanh toán</strong> hoặc đã mua trực tiếp tại cửa hàng.</li>
                                        </ul>
                                    </div>
                                </section>

                                {/* Footer action */}
                                <footer className="mt-4 d-flex flex-column flex-sm-row gap-2 justify-content-between align-items-center">
                                    <div>
                                        <small className="text-muted">Cần trợ giúp? Liên hệ: <strong>support@kidoedu.edu.vn</strong></small>
                                    </div>
                                </footer>

                            </div>
                        </div>




                    </div>
                </div>
            </div>

            {/* Một vài style nhỏ để tăng khả năng đọc (dành cho học sinh) */}
            <style>{`
        .lead { line-height: 1.5; }
        .card { border-radius: 12px; }
        .accordion-button { font-weight: 600; }
        @media (max-width: 576px) {
          h1.h4 { font-size: 1.15rem; }
        }
      `}</style>
        </div>
    );
}
