
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
                <div class="container-xl d-flex justify-content-evenly mb-1 ">

                    <div className="p-2 bd-highlight" style={{ fontFamily: "Poppins, sans-serif", fontSize: "16px", lineHeight: "1.6", width: "400px" }}>
                        <div className="mb-1" style={{ position: "relative" }}>
                            <p style={{ fontWeight: 600, marginBottom: "0px" }}>Thông tin liên hệ</p>
                        </div>
                        <div style={{ color: "#444444" }}>
                            <p className="text-wrap"><FontAwesomeIcon icon={faLocationDot} /> Địa Chỉ : Số 1 Đường Cộng Hòa 3 - Phường Phú Thọ Hòa - TP. Hồ Chí Minh.</p>
                            <p className="text-wrap"><FontAwesomeIcon icon={faPhone} /> ĐIện thoại :  0789 636 979</p>
                            <p className="text-wrap"><FontAwesomeIcon icon={faEnvelope} /> Mail : lytran@ichiskill.edu.vn</p>
                            <p className="text-wrap"><FontAwesomeIcon icon={faGlobe} /> Website : www.kidoedu.edu.vn</p>
                        </div>

                    </div>
                    <div className="p-2 bd-highlight" style={{ fontFamily: "Poppins, sans-serif", fontSize: "16px", lineHeight: "1.6" }}>
                        <div className="mb-1" style={{ position: "relative" }}>
                            <p style={{ fontWeight: 600, marginBottom: "0px" }}>Chính sách</p>
                        </div>
                        <div style={{ color: "#444444" }}>
                            <Link className="text-wrap nav-link" to="/PaymentPolicyPage">Chính sách thanh toán</Link>
                            <Link className="text-wrap nav-link" to="/ComplaintHandlingPolicyPage">Chính sách xử lý khiếu nại</Link>
                            <Link className="text-wrap nav-link" to="/ShippingPolicyPage">Chính sách vận chuyển</Link>
                            <Link className="text-wrap nav-link" to="/MaintenancePolicyPage">Chính Sách Bảo Trì</Link>
                            <Link className="text-wrap nav-link" to="/ReturnPolicyPage">Chính Sách Đổi Trả Hàng</Link>
                            <Link className="text-wrap nav-link" to="/PrivacyPolicyPage">Chính sách bảo mật thông tin</Link>
                        </div>
                    </div>
                    <div className="p-2 bd-highlight" style={{ fontFamily: "Poppins, sans-serif", fontSize: "16px", lineHeight: "1.6" }}>
                        <div className="mb-1" style={{ position: "relative" }}>
                            <p style={{ fontWeight: 600, marginBottom: "0px" }}>Dịch vụ khách hàng</p>
                        </div>
                        <div style={{ color: "#444444" }}>
                            <Link className="text-wrap nav-link" to="/PaymentPolicy">Điều khoản thanh toán</Link>
                            <Link className="text-wrap nav-link" to="/ContactFeedbackPage">Liên hệ góp ý</Link>
                            <Link className="text-wrap nav-link" to="/RepairServicePage">Sữa chữa Surface</Link>
                            <Link className="text-wrap nav-link" to="/ReturnPolicyGuide">Hướng dẫn đổi trả hàng </Link>
                            <Link className="text-wrap nav-link" to="/warrantypolicy">Bảo hành sản phẩm</Link>

                        </div>
                    </div>
                    <div className="p-2 bd-highlight" style={{ fontFamily: "Poppins, sans-serif", fontSize: "16px", lineHeight: "1.6" }}>
                        <div className="mb-1" style={{ position: "relative", width: "200px" }}>

                        </div>

                    </div>
                </div>
            </div>
            <div className="bg-light">
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


            </div>
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
        </footer>


    )
}

