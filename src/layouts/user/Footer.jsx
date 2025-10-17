
import Zalo from "../../assets/user/zalo.png";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebookMessenger } from '@fortawesome/free-brands-svg-icons';
import { faArrowUp, faLocationDot, faPhone, faEnvelope, faGlobe } from '@fortawesome/free-solid-svg-icons';
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function Footer() {
    const [showScroll, setShowScroll] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setShowScroll(window.scrollY > 100);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    };
    return (
        <footer className="mt-1 border-top border-3">
            <div style={{ backgroundColor: "#ECECE6", color: "#8a8a8a" }}>
                <div className="container-xl py-3">
                    <div className="row gy-3">
                        {/* Col 1: Contact */}
                        <div className="col-12 col-md-6 col-lg-4">
                            <h6 className="fw-semibold mb-2">Thông tin liên hệ</h6>
                            <address className="mb-0 small lh-base">
                                <p className="mb-2 text-wrap">
                                    <FontAwesomeIcon icon={faLocationDot} className="me-2" />
                                    Số 1, Đường Cộng Hòa 3, Phường Phú Thọ Hòa, TP. Hồ Chí Minh
                                </p>
                                <p className="mb-2">
                                    <FontAwesomeIcon icon={faPhone} className="me-2" />
                                    <a className="link-dark text-decoration-none" href="tel:+84789636979">0789 636 979</a>
                                </p>
                                <p className="mb-2">
                                    <FontAwesomeIcon icon={faEnvelope} className="me-2" />
                                    <a className="link-dark text-decoration-none" href="mailto:lytran@ichiskill.edu.vn">lytran@ichiskill.edu.vn</a>
                                </p>
                                <p className="mb-0">
                                    <FontAwesomeIcon icon={faGlobe} className="me-2" />
                                    <a className="link-dark text-decoration-none" href="https://www.kidoedu.edu.vn" target="_blank" rel="noreferrer">
                                        www.kidoedu.edu.vn
                                    </a>
                                </p>
                            </address>
                        </div>

                        {/* Col 2: Policies (desktop list / mobile accordion) */}
                        <div className="col-12 col-md-6 col-lg-4">
                            <h6 className="fw-semibold mb-2 d-none d-md-block">Chính sách</h6>
                            <details className="d-md-none mb-2">
                                <summary className="fw-semibold">Chính sách</summary>
                            </details>
                            <ul className="list-unstyled small mb-0 two-col-md">
                                <li><Link className="nav-link px-0" to="/PaymentPolicyPage">Chính sách thanh toán</Link></li>
                                <li><Link className="nav-link px-0" to="/ComplaintHandlingPolicyPage">Chính sách xử lý khiếu nại</Link></li>
                                <li><Link className="nav-link px-0" to="/ShippingPolicyPage">Chính sách vận chuyển</Link></li>
                                <li><Link className="nav-link px-0" to="/MaintenancePolicyPage">Chính sách bảo trì</Link></li>
                                <li><Link className="nav-link px-0" to="/ReturnPolicyPage">Chính sách đổi trả hàng</Link></li>
                                <li><Link className="nav-link px-0" to="/PrivacyPolicyPage">Chính sách bảo mật thông tin</Link></li>
                            </ul>
                        </div>

                        {/* Col 3: Customer service */}
                        <div className="col-12 col-md-6 col-lg-4">
                            <h6 className="fw-semibold mb-2 d-none d-md-block">Dịch vụ khách hàng</h6>
                            <details className="d-md-none mb-2">
                                <summary className="fw-semibold">Dịch vụ khách hàng</summary>
                            </details>
                            <ul className="list-unstyled small mb-0 two-col-md">
                                <li><Link className="nav-link px-0" to="/PaymentPolicy">Điều khoản thanh toán</Link></li>
                                <li><Link className="nav-link px-0" to="/ContactFeedbackPage">Liên hệ góp ý</Link></li>
                                <li><Link className="nav-link px-0" to="/RepairServicePage">Sửa chữa Surface</Link></li>
                                <li><Link className="nav-link px-0" to="/ReturnPolicyGuide">Hướng dẫn đổi trả hàng</Link></li>
                                <li><Link className="nav-link px-0" to="/warrantypolicy">Bảo hành sản phẩm</Link></li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-light d-none d-lg-block">
                <div className="d-flex justify-content-center align-items-center" style={{ color: "#444a43", height: "50px", backgroundColor: "#444a43" }}>
                    <div className="mb-0 text-light">Copyright © 2025 KidoEdu, All Rights Reserved.</div>
                    <a
                        href="https://zalo.me/0789636979"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <div
                            style={{
                                position: 'fixed',
                                bottom: '160px',
                                right: '20px',
                                display: 'flex',
                                borderRadius: '50%',
                                backgroundColor: '#0000',
                                justifyContent: 'center',
                                alignItems: 'center',
                                color: 'white',
                                cursor: 'pointer',
                                boxShadow: '0 4px 10px rgba(0,0,0,0.3)',
                                zIndex: 9999
                            }}
                            className="pulse-animation"   // 👈 thêm class
                        >

                            <img
                                src={Zalo}
                                style={{
                                    width: '60px',
                                    height: '60px',
                                    borderRadius: '50%',
                                }}
                                alt="Logo zalo"
                            />

                        </div>
                    </a>
                    <div
                        style={{
                            position: 'fixed',
                            bottom: '90px',
                            right: '20px',
                            width: '60px',
                            height: '60px',
                            borderRadius: '50%',
                            backgroundColor: '#0084FF',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            color: 'white',
                            cursor: 'pointer',
                            boxShadow: '0 4px 10px rgba(0,0,0,0.3)',
                            zIndex: 9999
                        }}
                        className="bounce-animation"   // 👈 thêm class
                    >
                        <FontAwesomeIcon icon={faFacebookMessenger} size="lg" />
                    </div>

                    {showScroll && (
                        <div onClick={scrollToTop} style={{
                            position: 'fixed',
                            bottom: '20px',
                            right: '90px',
                            width: '44px',
                            height: '44px',
                            borderRadius: '50%',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            cursor: 'pointer',
                            fontSize: "30px",
                            color: "#dc3545",
                            zIndex: 9998
                        }}>
                            <FontAwesomeIcon icon={faArrowUp} />
                        </div>
                    )}
                </div>
                <a href="tel:0789 636 979" class="hotline-bubble" aria-label="Gọi ngay">
                    <i class="bi bi-telephone-fill"></i>
                    <span class="hotline-tip">Gọi 0789 636 979</span>
                </a>

                <div class="hotline-banner">
                    <div class="hotline-icon">
                        <i class="bi bi-phone"></i>
                    </div>

                    <div class="hotline-text">
                        <div>Hotline - Zalo</div>
                        <strong class="shine">0789 636 979</strong>
                    </div>

                    <a class="zalo-badge" href="https://zalo.me/0789 636 979" target="_blank" aria-label="Chat Zalo"></a>
                </div>
            </div>


            <div className="bg-dark text-light d-block d-sm-none">
                <div className="container-xl d-flex justify-content-between align-items-center py-3 small">
                    <div className="mb-0">© 2025 KidoEdu. All rights reserved.</div>
                    {/* optional: social icons on desktop */}
                </div>
                <a
                    href="https://zalo.me/0789636979"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <div
                        style={{
                            position: 'fixed',
                            bottom: '160px',
                            right: '20px',
                            display: 'flex',
                            borderRadius: '50%',
                            backgroundColor: '#0000',
                            justifyContent: 'center',
                            alignItems: 'center',
                            color: 'white',
                            cursor: 'pointer',
                            boxShadow: '0 4px 10px rgba(0,0,0,0.3)',
                            zIndex: 9999
                        }}
                        className="pulse-animation"   // 👈 thêm class
                    >

                        <img
                            src={Zalo}
                            style={{
                                width: '60px',
                                height: '60px',
                                borderRadius: '50%',
                            }}
                            alt="Logo zalo"
                        />

                    </div>
                </a>
                <div
                    style={{
                        position: 'fixed',
                        bottom: '90px',
                        right: '20px',
                        width: '60px',
                        height: '60px',
                        borderRadius: '50%',
                        backgroundColor: '#0084FF',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        color: 'white',
                        cursor: 'pointer',
                        boxShadow: '0 4px 10px rgba(0,0,0,0.3)',
                        zIndex: 9999
                    }}
                    className="bounce-animation"   // 👈 thêm class
                >
                    <FontAwesomeIcon icon={faFacebookMessenger} size="lg" />
                </div>

                {showScroll && (
                    <div onClick={scrollToTop} style={{
                        position: 'fixed',
                        bottom: '20px',
                        right: '90px',
                        width: '44px',
                        height: '44px',
                        borderRadius: '50%',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        cursor: 'pointer',
                        fontSize: "30px",
                        color: "#dc3545",
                        zIndex: 9998
                    }}>
                        <FontAwesomeIcon icon={faArrowUp} />
                    </div>
                )}
                <a href="tel:0789 636 979" class="hotline-bubble" aria-label="Gọi ngay">
                    <i class="bi bi-telephone-fill"></i>
                    <span class="hotline-tip">Gọi 0789 636 979</span>
                </a>
                {/* Hotline banner (hidden on md+) */}
                <div className="hotline-banner d-md-none">
                    <div className="hotline-icon"><i className="bi bi-phone"></i></div>
                    <div className="hotline-text">
                        <div>Hotline - Zalo</div>
                        <strong className="shine">0789 636 979</strong>
                    </div>
                    <a className="zalo-badge" href="https://zalo.me/0789636979" target="_blank" rel="noreferrer" aria-label="Chat Zalo"></a>
                </div>
            </div>


        </footer>


    )
}

