import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export default function PriceInfoPage() {

    const handleDownloadPdf = () => {
        const input = document.getElementById('price-info-content'); // ID của phần nội dung bạn muốn in ra PDF

        html2canvas(input, {
            scale: 2 // Tăng scale để chất lượng hình ảnh tốt hơn trong PDF
        })
            .then((canvas) => {
                const imgData = canvas.toDataURL('image/png');
                const pdf = new jsPDF('p', 'mm', 'a4');
                const imgWidth = 210; // Chiều rộng A4 trong mm
                const pageHeight = 297; // Chiều cao A4 trong mm
                const imgHeight = canvas.height * imgWidth / canvas.width;
                let heightLeft = imgHeight;
                let position = 0;

                pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
                heightLeft -= pageHeight;

                while (heightLeft >= 0) {
                    position = heightLeft - imgHeight;
                    pdf.addPage();
                    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
                    heightLeft -= pageHeight;
                }
                pdf.save("thong_tin_gia_san_pham_kidoedu.pdf");
            });
    };

    return (
        <div className="container bg-light d-flex align-items-center">
            <div className="container py-4">
                <div className="row justify-content-center">
                    <div className="col-12 col-md-10 col-lg-8">

                        {/* Card chính */}
                        <div className="card shadow-sm border-0" id="price-info-content"> {/* Thêm ID ở đây */}
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

                            </div>
                        </div>

                        {/* Footer action */}
                        <footer className="mt-4 d-flex flex-column flex-sm-row gap-2 justify-content-between align-items-center">
                            <div>
                                <small className="text-muted">Cần trợ giúp? Liên hệ: <strong>support@kidoedu.edu.vn</strong></small>
                            </div>
                            <div>
                                <button className="btn btn-primary btn-sm" onClick={handleDownloadPdf}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-file-earmark-arrow-down-fill me-2" viewBox="0 0 16 16">
                                        <path d="M9.293 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V4.707A1 1 0 0 0 13.707 4L10 .293A1 1 0 0 0 9.293 0zM9.5 3.5v-2l3 3h-2a1 1 0 0 1-1-1zm-1 4v3.793l1.146-1.147a.5.5 0 0 1 .708.708l-2 2a.5.5 0 0 1-.708 0l-2-2a.5.5 0 0 1 .708-.708L7.5 11.293V7.5a.5.5 0 0 1 1 0z" />
                                    </svg>
                                    Tải PDF
                                </button>
                            </div>
                        </footer>

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