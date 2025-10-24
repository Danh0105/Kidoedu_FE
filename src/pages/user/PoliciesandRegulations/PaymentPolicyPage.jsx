import React, { useRef } from 'react'; // Import useRef
import 'bootstrap/dist/css/bootstrap.min.css';
import html2pdf from 'html2pdf.js'; // Import html2pdf.js
import {
    faMoneyBillWave,
    faTruck,
    faCreditCard,
    faExclamationCircle,
    faHandshake,
    faEnvelope,
    faPhone,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// File: PaymentPolicyPage.jsx
// Mô tả: Trang "Chính sách thanh toán" viết bằng React + Bootstrap 5
// Hướng dẫn: dán vào src/PaymentPolicyPage.jsx, import trong App.jsx: import PaymentPolicyPage from './PaymentPolicyPage'

export default function PaymentPolicyPage() {
    const contentRef = useRef(null); // Tạo một ref để tham chiếu đến nội dung cần in PDF

    const handleDownloadPageAsPdf = () => {
        if (contentRef.current) {
            // Tùy chỉnh các tùy chọn PDF
            const opt = {
                margin: [10, 10, 10, 10], // top, left, bottom, right
                filename: 'chinh-sach-thanh-toan-kidoedu.pdf',
                image: { type: 'jpeg', quality: 0.98 },
                html2canvas: { scale: 2, logging: true, dpi: 192, letterRendering: true },
                jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
                pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
            };

            // Sử dụng html2pdf để chuyển đổi nội dung từ ref
            html2pdf().set(opt).from(contentRef.current).save();
        }
    };

    return (
        // Gán ref vào phần tử cha chứa toàn bộ nội dung mà bạn muốn in (ở đây là div chính)
        <div className="min-vh-100 bg-light d-flex align-items-center" ref={contentRef}>
            <div className="container py-4">
                <div className="row justify-content-center">
                    <div className="col-12 col-md-10 col-lg-8">
                        <div className="card shadow-sm border-0">
                            <div className="card-body p-4">

                                <header className="d-flex align-items-center mb-3 gap-3">
                                    <div className="rounded-circle bg-success d-flex align-items-center justify-content-center" style={{ width: 64, height: 64 }}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" fill="white" className="bi bi-wallet2" viewBox="0 0 16 16">
                                            <path d="M12 1a1 1 0 0 1 1 1v1h1.5A1.5 1 0 0 1 16 4.5v7A1.5 1.5 0 0 1 14.5 13H1.5A1.5 1.5 0 0 1 0 11.5v-8A1.5 1.5 0 0 1 1.5 2H12zM3 4h8v7H3V4z" />
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
                                                    <FontAwesomeIcon
                                                        icon={
                                                            faCreditCard
                                                        }
                                                        className="text-danger fs-3"
                                                    />
                                                    <h2 className="h6">Thanh toán tiền mặt</h2>
                                                    <p className="small mb-0">Bạn đến địa chỉ kinh doanh của chúng tôi và thanh toán tại chỗ.</p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="col-12 col-md-4">
                                            <div className="card h-100 border-0">
                                                <div className="card-body p-3 text-center">
                                                    <FontAwesomeIcon
                                                        icon={
                                                            faExclamationCircle
                                                        }
                                                        className="text-success fs-3"
                                                    />
                                                    <h2 className="h6">Thanh toán khi nhận hàng (COD)</h2>
                                                    <p className="small mb-0">Nhân viên giao hàng mang hàng tới, bạn kiểm tra rồi trả tiền mặt cho nhân viên.</p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="col-12 col-md-4">
                                            <div className="card h-100 border-0">
                                                <div className="card-body p-3 text-center">
                                                    <FontAwesomeIcon
                                                        icon={
                                                            faPhone
                                                        }
                                                        className="text-primary fs-3"
                                                    />
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
                                        <p className="mb-1"><strong>Tên tài khoản:</strong> <span className="text-muted">TECHCOMBANK</span></p>
                                        <p className="mb-1"><strong>Số tài khoản:</strong> <span className="text-muted">933910665</span></p>
                                        <p className="mb-0"><strong>Ngân hàng:</strong> <span className="text-muted">CONG TY TNHH KIDO EDU</span></p>
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
                                        <button
                                            onClick={handleDownloadPageAsPdf}
                                            className="btn btn-success btn-sm" // Nút tải PDF mới
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-file-earmark-pdf me-1" viewBox="0 0 16 16">
                                                <path d="M14 14V4.5L9.5 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2zM9.5 3A1.5 1.5 0 0 0 11 4.5h2V14a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h5.5v2z" />
                                                <path d="M4.603 12.087a.8.8 0 0 1-.438-.42c-.195-.307-.288-.65-.436-.913H4.49c.08.2.13.385.195.55.172.455.42.8.835 1.016.2.1.438.165.681.165.379 0 .583-.093.718-.285.147-.2.2-.456.2-.74v-.035c0-.85-.37-.996-1.07-.996-.7-.006-1.07 0-1.07.996V12h-.7zm2.46-.206c-.078-.358-.195-.69-.47-.954-.236-.217-.53-.324-.9-.324-.407 0-.74.145-.99.395-.25.25-.378.608-.378 1.037 0 .446.136.81.41 1.066.28.258.68.397 1.18.397.387 0 .76-.064 1.04-.233.287-.184.45-.45.54-.78zm-.924-.038c.046.126.083.25.118.36.08.27.202.435.404.51.158.058.337.067.502.023.27-.068.416-.291.416-.605 0-.25-.13-.48-.367-.65-.2-.146-.476-.238-.776-.238-.266 0-.46.065-.58.21-.12.146-.17.33-.17.516v.07h.03zm3.743-3.468c-.097.114-.19.228-.277.342-.192.258-.456.467-.806.63-.35.163-.767.245-1.25.245-.85 0-1.4-.2-1.68-.69a1.05 1.05 0 0 1-.077-.47v-.036c0-.86.41-1.288 1.07-1.288.552 0 .88.25 1.07.67h-.75c-.09-.2-.22-.382-.39-.516-.17-.134-.39-.2-.64-.2-.25 0-.43.07-.54.2-.11.13-.16.32-.16.59 0 .46.22.68.57.68.25 0 .42-.1.516-.27l.53.087zm3.116-.29h-.793c-.098.375-.257.72-.472 1.03-.215.31-.482.564-.803.76-.32.195-.756.293-1.306.293-.45 0-.793-.096-1.039-.292-.245-.196-.368-.46-.368-.79 0-.265.1-.485.3-.66.2-.175.47-.26.81-.26h.273c.123 0 .22-.04.293-.118.073-.077.11-.173.11-.29 0-.115-.037-.21-.11-.288-.073-.077-.17-.116-.293-.116h-.85c-.24 0-.43.08-.58.23-.15.15-.227.35-.227.59 0 .22.08.38.24.47.16.09.4.135.73.135h.063c.27 0 .5-.08.6-.24.1-.16.14-.36.14-.62 0-.22-.05-.4-.15-.55-.1-.15-.27-.225-.52-.225H9.72c-.51 0-.91.148-1.205.446-.294.298-.44.7-.44 1.202 0 .42.113.785.34 1.092.228.307.544.46.948.46.34 0 .64-.08.89-.242.25-.162.43-.37.55-.62.05-.09.12-.18.19-.24h.792c-.098.375-.257.72-.472 1.03-.215.31-.482.564-.803.76-.32.195-.756.293-1.306.293-.45 0-.793-.096-1.039-.292-.245-.196-.368-.46-.368-.79 0-.265.1-.485.3-.66.2-.175.47-.26.81-.26h.273c.123 0 .22-.04.293-.118.073-.077.11-.173.11-.29 0-.115-.037-.21-.11-.288-.073-.077-.17-.116-.293-.116h-.85c-.24 0-.43.08-.58.23-.15.15-.227.35-.227.59 0 .22.08.38.24.47.16.09.4.135.73.135h.063c.27 0 .5-.08.6-.24.1-.16.14-.36.14-.62 0-.22-.05-.4-.15-.55-.1-.15-.27-.225-.52-.225H9.72c-.51 0-.91.148-1.205.446-.294.298-.44.7-.44 1.202 0 .42.113.785.34 1.092.228.307.544.46.948.46.34 0 .64-.08.89-.242.25-.162.43-.37.55-.62.05-.09.12-.18.19-.24h.792z" />
                                            </svg>
                                            Tải tệp đính kèm
                                        </button>
                                        <button className="btn btn-success btn-sm">Quay về trang chủ</button>
                                    </div>
                                </footer>

                            </div>
                        </div>

                        <div className="text-center text-muted small mt-3">Giao diện thân thiện, chữ lớn, màu nhẹ — phù hợp cho học sinh tiểu học.</div>

                    </div>
                </div>
            </div>

            <style>{`
                .card-body h2 { font-weight:700; }
                .lead { line-height: 1.4; }
                @media (max-width:576px) { .lead { font-size: 1rem; } }
            `}</style>
        </div>
    );
}