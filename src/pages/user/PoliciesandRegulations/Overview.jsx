import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

/**
 * Trang: CHÍNH SÁCH & QUY ĐỊNH – chuẩn UI/UX với Bootstrap
 * - Sidebar mục lục dính (sticky) giúp điều hướng nhanh
 * - Nút "Tải PDF" dùng window.print() (người dùng có thể chọn Save as PDF)
 * - Cấu trúc sematic: <main>, <section>, <nav>, heading rõ ràng (H1→H2)
 * - Khoảng cách, hàng lẻ/đậm, danh sách dễ đọc
 */
export default function PoliciesPage() {
    useEffect(() => {
        // Cuộn về anchor tương ứng nếu URL đã có hash khi mở trang
        if (window.location.hash) {
            const el = document.querySelector(window.location.hash);
            if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
        }
    }, []);

    // Tải PDF toàn bộ nội dung trang bằng html2canvas + jsPDF (không dùng print)
    const [downloading, setDownloading] = useState(false);

    const loadScript = (src) => new Promise((resolve, reject) => {
        const s = document.createElement('script');
        s.src = src;
        s.async = true;
        s.onload = resolve;
        s.onerror = reject;
        document.body.appendChild(s);
    });

    const handleDownloadPDF = async () => {
        try {
            setDownloading(true);
            if (!window.html2canvas) {
                await loadScript('https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.min.js');
            }
            if (!window.jspdf) {
                await loadScript('https://cdn.jsdelivr.net/npm/jspdf@2.5.1/dist/jspdf.umd.min.js');
            }

            const html2canvas = window.html2canvas;
            const { jsPDF } = window.jspdf;

            // 📌 Chỉ chụp phần nội dung chính sách trong <main>
            const target = document.querySelector('main');
            if (!target) {
                alert('Không tìm thấy phần nội dung chính (main).');
                return;
            }

            const width = target.scrollWidth;
            const height = target.scrollHeight;

            const canvas = await html2canvas(target, {
                scale: 2,
                useCORS: true,
                backgroundColor: '#ffffff',
                width,
                height,
                windowWidth: document.documentElement.clientWidth,
                windowHeight: document.documentElement.clientHeight,
            });

            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4');
            const pageWidth = pdf.internal.pageSize.getWidth();
            const pageHeight = pdf.internal.pageSize.getHeight();

            const imgWidth = pageWidth;
            const imgHeight = (canvas.height * imgWidth) / canvas.width;

            let position = 0;
            let remainingHeight = imgHeight;

            pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
            remainingHeight -= pageHeight;

            while (remainingHeight > 0) {
                pdf.addPage();
                position = 0 - (imgHeight - remainingHeight);
                pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
                remainingHeight -= pageHeight;
            }

            pdf.save('Chinh-sach-va-Quy-dinh-Kidoedu.pdf');
        } catch (e) {
            console.error('Lỗi xuất PDF:', e);
            alert('Xuất PDF không thành công. Vui lòng thử lại.');
        } finally {
            setDownloading(false);
        }
    };

    return (
        <div className="container-xxl py-4">
            {/* Styles nhỏ cho anchor offset & print-friendly */}
            <style>{`
        :root { --anchor-offset: 88px; }
        section[aria-labelledby] { scroll-margin-top: var(--anchor-offset); }
        @media (min-width: 992px) {
          .sticky-lg-top-88 { top: 88px; }
        }
        @media print {
          .no-print { display: none !important; }
          .print-col-12 { width: 100% !important; }
          a[href]::after { content: ""; } /* Ẩn URL sau link khi in */
        }
      `}</style>

            {/* Header & Actions */}
            <header className="d-flex flex-column flex-lg-row align-items-lg-center gap-3 mb-4">
                <div className="flex-grow-1">
                    <nav aria-label="breadcrumb" className="mb-2">
                        <ol className="breadcrumb mb-0">
                            <li className="breadcrumb-item"><a href="#">Trang chủ</a></li>
                            <li className="breadcrumb-item active" aria-current="page">Chính sách & Quy định</li>
                        </ol>
                    </nav>
                    <h1 className="h2 fw-bold mb-1">CHÍNH SÁCH VÀ QUY ĐỊNH</h1>
                    <p className="text-muted mb-0">Áp dụng cho website <strong>Kidoedu.edu.vn</strong>. Vui lòng đọc kỹ trước khi giao dịch.</p>
                </div>

                <div className="d-flex gap-2 no-print">
                    <button type="button" onClick={handleDownloadPDF} className="btn btn-primary">
                        <i className="bi bi-download me-2" aria-hidden="true"></i>
                        {downloading ? 'Đang tạo PDF…' : 'Tải toàn bộ trang (PDF)'}
                    </button>
                    <a href="#bao-mat" className="btn btn-outline-secondary">Bảo mật thông tin</a>
                </div>
            </header>

            <div className="row g-4">
                {/* Sidebar mục lục */}
                <aside className="col-lg-3 print-col-12">
                    <nav className="card border-0 shadow-sm sticky-lg-top sticky-lg-top-88" aria-label="Mục lục trang">
                        <div className="card-body p-3 p-lg-4">
                            <h2 className="h6 text-uppercase text-muted mb-3">Mục lục</h2>
                            <div className="list-group list-group-flush">
                                <a className="list-group-item list-group-item-action" href="#gia-san-pham">Thông tin về giá sản phẩm</a>
                                <a className="list-group-item list-group-item-action" href="#thanh-toan">Chính sách thanh toán</a>
                                <a className="list-group-item list-group-item-action" href="#van-chuyen">Vận chuyển & giao nhận</a>
                                <a className="list-group-item list-group-item-action" href="#kiem-hang">Chính sách kiểm hàng</a>
                                <a className="list-group-item list-group-item-action" href="#doi-tra-hoan-tien">Đổi trả & hoàn tiền</a>
                                <a className="list-group-item list-group-item-action" href="#bao-mat">Chính sách bảo mật thông tin</a>
                            </div>
                        </div>
                    </nav>
                </aside>

                {/* Nội dung chính */}
                <main className="col-lg-9 print-col-12">
                    {/* GIÁ SẢN PHẨM */}
                    <section id="gia-san-pham" aria-labelledby="h-gia" className="card border-0 shadow-sm mb-4">
                        <div className="card-body p-3 p-lg-4">
                            <h2 id="h-gia" className="h4 fw-semibold mb-3">Thông tin về giá sản phẩm</h2>
                            <p>
                                Tổng số tiền thanh toán trên website đã bao gồm các thuế, phí đóng gói và <em>chưa bao gồm</em> phí vận chuyển và các chi phí phát sinh khác
                                (các phí chưa bao gồm sẽ được thông báo trong quá trình nhân viên <strong>Kidoedu.edu.vn</strong> xác nhận đơn hàng).
                            </p>
                            <p>
                                Ngoài ra, <strong>Kidoedu.edu.vn</strong> không chịu trách nhiệm đối với các khoản phí có thể phát sinh theo chính sách của ngân hàng phát hành thẻ
                                (trong trường hợp khách hàng lựa chọn thanh toán chuyển khoản qua ngân hàng).
                            </p>
                            <p>
                                Giá bán niêm yết tại website là giá bán chính thức để người tiêu dùng tham khảo và giao dịch ngay trên website hoặc mua bán tại cửa hàng.
                                <strong> Kidoedu.edu.vn</strong> có thể thay đổi giá bán sản phẩm hoặc ngừng bán một hay nhiều sản phẩm vào bất kỳ thời điểm nào mà không cần báo trước
                                (trừ trường hợp đã thanh toán hoặc đã mua bán tại cửa hàng).
                            </p>
                        </div>
                    </section>

                    {/* THANH TOÁN */}
                    <section id="thanh-toan" aria-labelledby="h-tt" className="card border-0 shadow-sm mb-4">
                        <div className="card-body p-3 p-lg-4">
                            <h2 id="h-tt" className="h4 fw-semibold mb-3">Chính sách thanh toán</h2>
                            <p className="mb-2">Có 3 hình thức thanh toán, khách hàng có thể lựa chọn hình thức thuận tiện:</p>
                            <ol className="mb-4 ps-3">
                                <li className="mb-1"><strong>Tiền mặt tại cửa hàng:</strong> Thanh toán trực tiếp tại địa điểm kinh doanh của chúng tôi.</li>
                                <li className="mb-1"><strong>Thanh toán khi nhận hàng (COD):</strong> Kiểm tra hàng và thanh toán cho nhân viên giao nhận.</li>
                                <li className="mb-1"><strong>Chuyển khoản trước:</strong> Quý khách chuyển khoản trước, chúng tôi giao hàng theo thỏa thuận/hợp đồng.</li>
                            </ol>

                            <div className="alert alert-secondary" role="region" aria-label="Thông tin chuyển khoản">
                                <div className="row g-3">
                                    <div className="col-md-4">
                                        <label className="form-label">Tên tài khoản</label>
                                        <input className="form-control" placeholder="CONG TY TNHH KIDO EDU" readOnly />
                                    </div>
                                    <div className="col-md-4">
                                        <label className="form-label">Số tài khoản</label>
                                        <input className="form-control" placeholder="933910665" readOnly />
                                    </div>
                                    <div className="col-md-4">
                                        <label className="form-label">Ngân hàng</label>
                                        <input className="form-control" placeholder="TECHCOMBANK" readOnly />
                                    </div>
                                </div>
                                <ul className="small mt-3 mb-0 ps-3">
                                    <li>Nội dung chuyển khoản: ghi rõ <em>Số điện thoại</em> hoặc <em>Số đơn hàng</em>.</li>
                                    <li>Sau khi chuyển khoản, chúng tôi sẽ liên hệ xác nhận và tiến hành giao hàng.</li>
                                    <li>Nếu quá thời hạn thỏa thuận mà chưa giao hàng/phản hồi, vui lòng khiếu nại về trụ sở.</li>
                                    <li>Cam kết kinh doanh minh bạch – hợp pháp – hàng có nguồn gốc.</li>
                                </ul>
                            </div>
                        </div>
                    </section>

                    {/* VẬN CHUYỂN & GIAO NHẬN */}
                    <section id="van-chuyen" aria-labelledby="h-vc" className="card border-0 shadow-sm mb-4">
                        <div className="card-body p-3 p-lg-4">
                            <h2 id="h-vc" className="h4 fw-semibold mb-3">Chính sách vận chuyển và giao nhận</h2>
                            <h3 className="h6 fw-bold mt-2">1) Thời hạn và giới hạn vị trí giao hàng</h3>
                            <p>
                                <strong>Kidoedu.edu.vn</strong> hỗ trợ giao hàng tận nơi trên toàn quốc. Khu vực nội thành TP.HCM: dự kiến giao trong
                                <strong> 02–03 ngày làm việc</strong> kể từ khi nhận đơn. Khu vực ngoại thành: <strong>05–07 ngày làm việc</strong>.
                            </p>
                            <p className="mb-2">Một số tình huống bất khả kháng có thể khiến giao hàng chậm hơn:</p>
                            <ul className="ps-3 mb-4">
                                <li>Không liên lạc được với khách hàng qua điện thoại.</li>
                                <li>Địa chỉ giao hàng không chính xác/khó tìm.</li>
                                <li>Số lượng đơn hàng tăng đột biến.</li>
                                <li>Nhà cung cấp/đơn vị vận chuyển giao hàng chậm so với dự kiến.</li>
                            </ul>

                            <h3 className="h6 fw-bold mt-2">2) Phí vận chuyển</h3>
                            <p>
                                Phí vận chuyển do đối tác vận chuyển thu theo biểu phí hiện hành và sẽ được thông báo khi xác nhận đơn hàng.
                                Với đơn hàng số lượng lớn/khách sỉ: phí theo biểu phí đơn vị vận chuyển hoặc theo thỏa thuận hợp đồng.
                            </p>

                            <h3 className="h6 fw-bold mt-2">3) Chứng từ hàng hóa trong quá trình giao nhận</h3>
                            <p>
                                Tất cả đơn hàng được đóng gói/niêm phong cẩn thận, vận chuyển theo nguyên tắc “nguyên đai, nguyên kiện”. Trên bao bì có:
                            </p>
                            <ul className="ps-3">
                                <li>Thông tin người nhận: Họ tên, số điện thoại, địa chỉ.</li>
                                <li>Mã vận đơn của đơn hàng.</li>
                            </ul>
                            <p>
                                Chúng tôi có thể cung cấp hóa đơn tài chính hoặc phiếu xuất kho trong bưu kiện (nếu có). Đơn vị vận chuyển có trách nhiệm cung cấp chứng từ liên quan khi khách hàng/cơ quan quản lý yêu cầu.
                            </p>

                            <h3 className="h6 fw-bold mt-2">4) Trách nhiệm khi hàng hư hỏng do vận chuyển</h3>
                            <p>
                                Nếu hàng hóa hư hỏng do vận chuyển (bởi cửa hàng hoặc bên thứ ba), chúng tôi sẽ chủ động làm việc và bồi hoàn theo quy định/thoả thuận.
                                Khách hàng có quyền từ chối nhận và yêu cầu đổi trả theo mục “Đổi trả & Hoàn tiền”. Trường hợp giao hàng chậm, chúng tôi sẽ thông tin kịp thời để khách hàng quyết định <em>Hủy</em> hoặc <em>Tiếp tục chờ</em>.
                            </p>
                        </div>
                    </section>

                    {/* KIỂM HÀNG */}
                    <section id="kiem-hang" aria-labelledby="h-kh" className="card border-0 shadow-sm mb-4">
                        <div className="card-body p-3 p-lg-4">
                            <h2 id="h-kh" className="h4 fw-semibold mb-3">Chính sách kiểm hàng</h2>
                            <ul className="ps-3">
                                <li>Trước khi thanh toán, Quý Khách <strong>được quyền kiểm tra</strong> sản phẩm (không hỗ trợ thử hàng).</li>
                                <li>Vui lòng mở gói để đối chiếu mẫu mã/số lượng đúng đơn đặt hàng.</li>
                                <li>Nếu đồng ý với sản phẩm, hãy tiến hành thanh toán (nếu là đơn COD).</li>
                                <li>Nếu không ưng ý, Quý Khách có thể <strong>từ chối nhận</strong>. Chúng tôi sẽ thu phí hoàn hàng tương đương phí ship.</li>
                            </ul>
                            <div className="alert alert-info small" role="note">
                                <ul className="mb-0 ps-3">
                                    <li>Nhân viên giao nhận <strong>phải đợi</strong> để Quý Khách kiểm tra hàng. Nếu bị từ chối kiểm, vui lòng gọi hotline: <a href="tel:0789636979">0789 636 979</a>.</li>
                                    <li>Tránh dùng vật sắc nhọn làm hỏng sản phẩm; trường hợp hư hỏng do phía khách hàng, chúng tôi rất tiếc không thể hỗ trợ đổi/trả/bảo hành.</li>
                                </ul>
                            </div>
                        </div>
                    </section>

                    {/* ĐỔI TRẢ & HOÀN TIỀN */}
                    <section id="doi-tra-hoan-tien" aria-labelledby="h-dt" className="card border-0 shadow-sm mb-4">
                        <div className="card-body p-3 p-lg-4">
                            <h2 id="h-dt" className="h4 fw-semibold mb-3">Chính sách đổi trả và hoàn tiền</h2>

                            <h3 className="h6 fw-bold mt-2">1) Điều kiện đổi trả</h3>
                            <ul className="ps-3">
                                <li>Hàng không đúng chủng loại, mẫu mã như đơn hàng/website tại thời điểm đặt.</li>
                                <li>Không đủ số lượng, không đủ bộ như trong đơn hàng.</li>
                                <li>Tình trạng bên ngoài bị ảnh hưởng (rách bao bì, bong tróc, bể vỡ…).</li>
                                <li>Khách hàng cung cấp giấy tờ liên quan để hoàn tất đổi/trả.</li>
                            </ul>

                            <h3 className="h6 fw-bold mt-2">2) Thời hạn thông báo & gửi hàng đổi trả</h3>
                            <ul className="ps-3">
                                <li>Thông báo đổi trả: <strong>trong 48 giờ</strong> kể từ khi nhận sản phẩm (thiếu phụ kiện/quà tặng hoặc bể vỡ).</li>
                                <li>Gửi chuyển trả: <strong>trong 07 ngày</strong> kể từ ngày nhận sản phẩm.</li>
                                <li>Địa điểm đổi trả: trực tiếp tại văn phòng/cửa hàng hoặc chuyển phát.</li>
                            </ul>

                            <h3 className="h6 fw-bold mt-2">3) Hình thức đổi trả/hoàn tiền</h3>
                            <ul className="ps-3">
                                <li>Đổi đúng loại/số lượng với trường hợp giao sai hoặc không đạt cam kết.</li>
                                <li>Đổi sang sản phẩm khác có giá trị tương đương nếu hàng đã hết (khi khách đồng ý).</li>
                            </ul>
                            <p>
                                Trường hợp khách không còn nhu cầu do lỗi hàng hóa hoặc không đồng ý hàng đổi lại, công ty sẽ hoàn phí bằng chuyển khoản hoặc phương thức thỏa thuận
                                trong <strong>07 ngày làm việc</strong> kể từ ngày nhận yêu cầu (phí chuyển khoản nếu có do khách hàng chịu).
                            </p>
                            <p>Chi phí vận chuyển phát sinh của hàng đổi/trả do khách hàng thanh toán trực tiếp cho đơn vị vận chuyển.</p>
                        </div>
                    </section>

                    {/* BẢO MẬT THÔNG TIN */}
                    <section id="bao-mat" aria-labelledby="h-bm" className="card border-0 shadow-sm mb-4">
                        <div className="card-body p-3 p-lg-4">
                            <h2 id="h-bm" className="h4 fw-semibold mb-3">Chính sách bảo mật thông tin</h2>

                            <h3 className="h6 fw-bold mt-2">1) Mục đích & phạm vi thu thập</h3>
                            <p>
                                <strong>Kidoedu.edu.vn</strong> không bán, chia sẻ hay trao đổi thông tin cá nhân của khách hàng cho bên thứ ba. Thông tin chỉ dùng nội bộ công ty.
                                Khi đăng ký dịch vụ, chúng tôi có thể thu thập: Họ tên, Địa chỉ, Điện thoại, Email; cùng thông tin dịch vụ như Tên sản phẩm, Số lượng, Thời gian giao nhận.
                            </p>

                            <h3 className="h6 fw-bold mt-2">2) Phạm vi sử dụng</h3>
                            <ul className="ps-3">
                                <li>Hỗ trợ khách hàng; cung cấp thông tin liên quan đến dịch vụ.</li>
                                <li>Xử lý đơn đặt hàng và cung cấp dịch vụ theo yêu cầu.</li>
                                <li>Gửi thông tin sản phẩm/dịch vụ mới, sự kiện, tuyển dụng (khi khách đăng ký nhận thông báo).</li>
                                <li>Quản lý tài khoản; xác nhận và thực hiện giao dịch tài chính liên quan thanh toán trực tuyến.</li>
                            </ul>

                            <h3 className="h6 fw-bold mt-2">3) Thời gian lưu trữ</h3>
                            <p>
                                Dữ liệu cá nhân được lưu trữ đến khi khách hàng yêu cầu xóa qua email: <a href="mailto:lytran@ichiskill.edu.vn">lytran@ichiskill.edu.vn</a>.
                            </p>

                            <h3 className="h6 fw-bold mt-2">4) Đối tượng được tiếp cận</h3>
                            <ul className="ps-3">
                                <li>CÔNG TY TNHH KIDO EDU</li>
                                <li>Các đối tác có ký hợp đồng thực hiện một phần dịch vụ theo thỏa thuận (có thể nhận một phần/toàn bộ dữ liệu cần thiết).</li>
                            </ul>

                            <h3 className="h6 fw-bold mt-2">5) Đơn vị quản lý thông tin cá nhân</h3>
                            <address className="mb-0">
                                <div><strong>CÔNG TY TNHH KIDO EDU</strong></div>
                                <div>Địa chỉ: Số 1 Đường Cộng Hòa 3, Phường Phú Thọ Hòa, TP Hồ Chí Minh, Việt Nam</div>
                                <div>Điện thoại: <a href="tel:0789636979">0789 636 979</a></div>
                                <div>Website: <a href="https://kidoedu.edu.vn" target="_blank" rel="noreferrer">Kidoedu.edu.vn</a></div>
                                <div>Email: <a href="mailto:lytran@ichiskill.edu.vn">lytran@ichiskill.edu.vn</a></div>
                            </address>

                            <h3 className="h6 fw-bold mt-2">6) Quyền chỉnh sửa dữ liệu</h3>
                            <p>
                                Bạn có thể liên hệ email/điện thoại ở trên để yêu cầu chỉnh sửa dữ liệu cá nhân. Chúng tôi thu thập qua website, email đặt hàng và số điện thoại đặt dịch vụ.
                            </p>

                            <h3 className="h6 fw-bold mt-2">7) Cơ chế tiếp nhận & giải quyết khiếu nại</h3>
                            <p>
                                Chúng tôi cam kết bảo mật thông tin cá nhân, không chia sẻ/bán/cho thuê cho bên khác, chỉ sử dụng nhằm nâng cao chất lượng dịch vụ, giải quyết tranh chấp/khiếu nại,
                                và cung cấp cho cơ quan pháp luật khi được yêu cầu. Nếu có khiếu nại về việc thông tin sử dụng sai mục đích/phạm vi, vui lòng liên hệ hotline
                                <a className="ms-1" href="tel:0789636979">0789 636 979</a> hoặc email <a href="mailto:lytran@ichiskill.edu.vn">lytran@ichiskill.edu.vn</a>.
                            </p>
                        </div>
                    </section>

                    {/* Footer note */}
                    <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3">
                        <small className="text-muted">© {new Date().getFullYear()} Kidoedu.edu.vn • Mọi quyền được bảo lưu.</small>
                        <a href="#top" className="btn btn-light border no-print">Lên đầu trang</a>
                    </div>
                </main>
            </div>

            {/* Bootstrap Icons (nếu app chưa bundle) */}
            <link
                rel="stylesheet"
                href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.css"
            />
        </div>
    );
}
