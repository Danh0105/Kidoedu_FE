import React, { useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

// Gợi ý sử dụng:
// 1) Lưu file này thành: src/ReturnRefundPolicyPage.jsx
// 2) Import vào App.jsx: import ReturnRefundPolicyPage from './ReturnRefundPolicyPage';
// 3) Dùng trong Router hay JSX: <ReturnRefundPolicyPage />

export default function ReturnRefundPolicyPage() {
    // Cuộn lên đầu trang khi mở
    useEffect(() => { window.scrollTo(0, 0); }, []);

    const handleDownloadPdf = async () => {
        const input = document.getElementById('return-refund-policy-content');
        if (!input) return;

        // Ẩn nút tải để không dính vào PDF
        const actionsBar = document.getElementById('policy-actions');
        const backTop = document.getElementById('back-to-top');
        const prevDisplay = actionsBar?.style.display;
        const prevTopBtn = backTop?.style.display;
        if (actionsBar) actionsBar.style.display = 'none';
        if (backTop) backTop.style.display = 'none';

        try {
            const canvas = await html2canvas(input, {
                scale: 2,
                windowWidth: input.scrollWidth,
                useCORS: true,
            });

            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4');
            const pageWidth = 210; // A4 width mm
            const pageHeight = 297; // A4 height mm
            const margin = 8; // lề nhỏ cho đẹp
            const usableWidth = pageWidth - margin * 2;
            const imgHeight = (canvas.height * usableWidth) / canvas.width;

            let heightLeft = imgHeight;
            let position = margin;

            pdf.addImage(imgData, 'PNG', margin, position, usableWidth, imgHeight);
            heightLeft -= pageHeight;

            while (heightLeft > 0) {
                pdf.addPage();
                position = heightLeft - imgHeight + margin;
                pdf.addImage(imgData, 'PNG', margin, position, usableWidth, imgHeight);
                heightLeft -= pageHeight;
            }

            pdf.save('chinh_sach_doi_tra_hoan_tien.pdf');
        } finally {
            if (actionsBar) actionsBar.style.display = prevDisplay || '';
            if (backTop) backTop.style.display = prevTopBtn || '';
        }
    };

    return (
        <div className="min-vh-100 bg-light d-flex align-items-start">
            <div className="container py-4">
                <div className="row justify-content-center">
                    <div className="col-12 col-md-10 col-lg-8">

                        {/* Thanh hành động nổi */}
                        <div id="policy-actions" className="position-sticky top-0 z-3 py-2" style={{ background: 'linear-gradient(#f8f9fa,#f8f9fa90)' }}>
                            <div className="d-flex gap-2 justify-content-end">
                                <button onClick={handleDownloadPdf} className="btn btn-primary btn-sm">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="me-2" viewBox="0 0 16 16">
                                        <path d="M9.293 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V4.707A1 1 0 0 0 13.707 4L10 .293A1 1 0 0 0 9.293 0zM9.5 3.5v-2l3 3h-2a1 1 0 0 1-1-1zm-1 4v3.793l1.146-1.147a.5.5 0 0 1 .708.708l-2 2a.5.5 0 0 1-.708 0l-2-2a.5.5 0 0 1 .708-.708L7.5 11.293V7.5a.5.5 0 0 1 1 0z" />
                                    </svg>
                                    Tải PDF
                                </button>
                                <a href="#return-refund-policy-content" className="btn btn-outline-secondary btn-sm">Xem nội dung</a>
                            </div>
                        </div>

                        {/* Card nội dung */}
                        <div className="card shadow-sm border-0" id="return-refund-policy-content">
                            <div className="card-body p-4">

                                <header className="d-flex align-items-center mb-3 gap-3">
                                    <div className="rounded-circle bg-danger d-flex align-items-center justify-content-center" style={{ width: 64, height: 64 }}>
                                        {/* receipt refund icon */}
                                        <svg xmlns="http://www.w3.org/2000/svg" width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M4 3h14a1 1 0 0 1 1 1v15l-3-2-3 2-3-2-3 2-3-2V4a1 1 0 0 1 1-1z"></path>
                                            <path d="M12 8a3 3 0 1 0 0 6"></path>
                                            <path d="M12 14V4"></path>
                                        </svg>
                                    </div>
                                    <div>
                                        <h1 className="h4 mb-1">Chính sách đổi trả và hoàn tiền</h1>
                                        <p className="mb-0 text-muted small">Áp dụng cho mọi đơn hàng trên hệ thống của chúng tôi.</p>
                                    </div>
                                </header>

                                {/* Mục lục nhanh */}
                                <nav className="mb-3">
                                    <div className="bg-white border rounded-3 p-3">
                                        <div className="fw-semibold mb-2">Mục lục</div>
                                        <ol className="mb-0 ps-3 small">
                                            <li><a href="#cond">Điều kiện đổi trả</a></li>
                                            <li><a href="#timeplace">Quy định về thời gian thông báo và gửi sản phẩm</a></li>
                                            <li><a href="#forms">Hình thức đổi trả & hoàn tiền</a></li>
                                            <li><a href="#contact">Liên hệ hỗ trợ</a></li>
                                        </ol>
                                    </div>
                                </nav>

                                {/* 1. Điều kiện đổi trả */}
                                <section id="cond" className="mb-4">
                                    <h2 className="h6">1. Điều kiện đổi trả</h2>
                                    <p>Quý Khách hàng cần kiểm tra tình trạng hàng hóa và có thể đổi/ trả ngay tại thời điểm giao/ nhận hàng trong các trường hợp sau:</p>
                                    <ul>
                                        <li>Hàng không đúng chủng loại, mẫu mã trong đơn hàng đã đặt hoặc như trên website tại thời điểm đặt hàng.</li>
                                        <li>Không đủ số lượng, không đủ bộ như trong đơn hàng.</li>
                                        <li>Tình trạng bên ngoài bị ảnh hưởng như rách bao bì, bong tróc, bể vỡ…</li>
                                    </ul>
                                    <p className="mb-0"><strong>Lưu ý:</strong> Khách hàng có trách nhiệm cung cấp giấy tờ liên quan chứng minh sự thiếu sót để hoàn tất việc đổi/ trả hàng.</p>
                                </section>

                                {/* 2. Quy định về thời gian thông báo và gửi sản phẩm */}
                                <section id="timeplace" className="mb-4">
                                    <h2 className="h6">2. Quy định về thời gian thông báo và gửi sản phẩm đổi trả</h2>
                                    <ul>
                                        <li><strong>Thời gian thông báo đổi trả:</strong> trong vòng <strong>48 giờ</strong> kể từ khi nhận sản phẩm đối với trường hợp thiếu phụ kiện, quà tặng hoặc bể vỡ.</li>
                                        <li><strong>Thời gian gửi chuyển trả sản phẩm:</strong> trong vòng <strong>7 ngày</strong> kể từ khi nhận sản phẩm.</li>
                                        <li><strong>Địa điểm đổi trả sản phẩm:</strong> khách hàng có thể mang hàng trực tiếp đến văn phòng/ cửa hàng của chúng tôi hoặc gửi qua đường bưu điện.</li>
                                    </ul>
                                    <div className="alert alert-info" role="alert">
                                        Trường hợp có ý kiến đóng góp/ khiếu nại liên quan đến chất lượng sản phẩm, vui lòng liên hệ đường dây chăm sóc khách hàng của chúng tôi để được hỗ trợ nhanh chóng.
                                    </div>
                                </section>

                                {/* 3. Hình thức đổi trả & hoàn tiền */}
                                <section id="forms" className="mb-4">
                                    <h2 className="h6">3. Hình thức đổi trả</h2>
                                    <ul>
                                        <li>Đổi đúng loại hàng khách đã đặt đối với trường hợp giao sai hàng/ sai số lượng hoặc phát sinh hàng không đạt cam kết.</li>
                                        <li>Đổi sang <strong>sản phẩm khác có giá trị tương đương</strong> khi sản phẩm đã đặt tạm hết hàng (nếu khách hàng đồng ý).</li>
                                    </ul>

                                    <div className="bg-white border rounded-3 p-3">
                                        <div className="fw-semibold mb-1">Hoàn tiền</div>
                                        <p className="mb-2">Nếu khách hàng không còn nhu cầu do lỗi hàng hóa <em>hoặc</em> không đồng ý với hàng hóa được đổi lại, công ty sẽ hoàn phí theo một trong các hình thức sau:</p>
                                        <ul className="mb-2">
                                            <li>Chuyển khoản ngân hàng.</li>
                                            <li>Hoặc phương thức khác theo thỏa thuận với khách hàng.</li>
                                        </ul>
                                        <p className="mb-1"><strong>Thời hạn hoàn tiền:</strong> trong vòng <strong>07 ngày làm việc</strong> kể từ ngày nhận được yêu cầu hợp lệ.</p>
                                        <p className="mb-0 small text-muted">Phí chuyển khoản (nếu có) do khách hàng chi trả.</p>
                                    </div>

                                    <div className="border rounded-3 p-3 mt-3">
                                        <div className="fw-semibold mb-1">Chi phí vận chuyển khi đổi trả</div>
                                        <p className="mb-0">Khi phát sinh chi phí vận chuyển cho hàng đổi/ trả, khách hàng sẽ chịu chi phí này và thanh toán trực tiếp cho bên vận chuyển.</p>
                                    </div>
                                </section>

                                {/* 4. Liên hệ */}
                                <section id="contact" className="mb-2">
                                    <h2 className="h6">4. Hỗ trợ & liên hệ</h2>
                                    <p className="mb-1">Nếu cần hỗ trợ thêm, vui lòng liên hệ:</p>
                                    <ul className="mb-2">
                                        <li>Email: <strong>support@kidoedu.edu.vn</strong></li>
                                        <li>Hotline CSKH: <strong>1900 0000</strong> (giờ hành chính)</li>
                                        <li>Địa chỉ gửi đổi/ trả: (Cập nhật địa chỉ cửa hàng/ văn phòng tại đây)</li>
                                    </ul>
                                    <p className="small text-muted mb-0">Chúng tôi trân trọng mọi góp ý để cải thiện chất lượng sản phẩm & dịch vụ.</p>
                                </section>

                                <hr />
                                <footer className="d-flex flex-column flex-sm-row justify-content-between align-items-center gap-2">
                                    <small className="text-muted">Phiên bản: 1.0 • Cập nhật gần nhất: {new Date().toLocaleDateString()}</small>
                                    <div className="d-flex gap-2">
                                        <button className="btn btn-primary btn-sm" onClick={handleDownloadPdf}>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="me-2" viewBox="0 0 16 16">
                                                <path d="M9.293 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V4.707A1 1 0 0 0 13.707 4L10 .293A1 1 0 0 0 9.293 0zM9.5 3.5v-2l3 3h-2a1 1 0 0 1-1-1zm-1 4v3.793l1.146-1.147a.5.5 0 0 1 .708.708l-2 2a.5.5 0 0 1-.708 0l-2-2a.5.5 0 0 1 .708-.708L7.5 11.293V7.5a.5.5 0 0 1 1 0z" />
                                            </svg>
                                            Tải PDF
                                        </button>
                                        <a href="#top" id="back-to-top" className="btn btn-outline-secondary btn-sm">Về đầu trang</a>
                                    </div>
                                </footer>

                            </div>
                        </div>

                        <div className="text-center text-muted small mt-3">Giao diện thân thiện, cấu trúc rõ ràng — dễ đọc trên di động.</div>

                    </div>
                </div>
            </div>

            <style>{`
            
        .card-body h2 { font-weight:700; }
        ul { margin-left: 1rem; }
        #return-refund-policy-content a { text-decoration: none; }
        @media print {
          #policy-actions, #back-to-top { display: none !important; }
          .card { box-shadow: none !important; border: 0 !important; }
          body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
        }
      `}</style>
        </div>
    );
}
