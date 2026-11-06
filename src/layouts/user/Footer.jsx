
import Zalo from "../../assets/user/zalo.png";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebookMessenger } from '@fortawesome/free-brands-svg-icons';
import { faArrowUp, faLocationDot, faPhone, faEnvelope, faGlobe } from '@fortawesome/free-solid-svg-icons';
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import logo from "../../assets/user/Logo.png";
import '../../components/user/css/Footer.css'
import axios from "axios";
import ChatbotWidget from "../../components/user/ChatbotWidget";

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
    const [banners, setBanners] = useState([]);
    // Stable axios instance
    const loadBanners = async () => {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/banners`);
        setBanners(res.data);
    };

    useEffect(() => {
        loadBanners();
    }, []);
    const getBanner = (id) => banners.find(b => b.id === id);
    const BannerBox = ({ id, label, className }) => {
        const banner = getBanner(id);
        return (
            <div className={className}>
                {banner?.imageUrl ? (
                    <img
                        src={`${process.env.REACT_APP_API_URL}${banner.imageUrl}`}   // Rất quan trọng
                        alt={label}
                        className='banner-img'
                    />
                ) : (
                    <span>{label}</span>
                )}
            </div>
        );
    };
    return (
        <footer className="mt-1 border-top border-3">
            <div style={{ backgroundColor: "#ECECE6", color: "#8a8a8a" }}>
                <div className="footer-hero border-0 mt-4">
                    {/* Dải gradient nhấn thương hiệu */}
                    <div className="footer-accent w-100"></div>

                    {/* Thân footer */}
                    <div className="bg-dark text-light py-4">
                        <div className="container-xl py-3">
                            <div className="row gy-4 footer-columns">
                                <div className="col-12 col-md-4">
                                    <h6 className="footer-heading">Thông tin liên hệ</h6>
                                    <address className="mb-0 small lh-base text-white-75">
                                        <p className="mb-2 text-wrap">
                                            <FontAwesomeIcon
                                                icon={faLocationDot}
                                                className="me-2 text-primary"
                                            />
                                            Số 1, Đường Cộng Hòa 3, Phường Phú Thọ Hòa, TP. Hồ Chí Minh
                                        </p>
                                        <p className="mb-2">
                                            <FontAwesomeIcon
                                                icon={faPhone}
                                                className="me-2 text-primary"
                                            />
                                            <a
                                                href="tel:+84789636979"
                                                className="link-light text-decoration-none"
                                            >
                                                0789 636 979
                                            </a>
                                        </p>
                                        <p className="mb-2">
                                            <FontAwesomeIcon
                                                icon={faEnvelope}
                                                className="me-2 text-primary"
                                            />
                                            <a
                                                href="mailto:lytran@ichiskill.edu.vn"
                                                className="link-light text-decoration-none"
                                            >
                                                lytran@ichiskill.edu.vn
                                            </a>
                                        </p>
                                        <p className="mb-0">
                                            <FontAwesomeIcon
                                                icon={faGlobe}
                                                className="me-2 text-primary"
                                            />
                                            <a
                                                href="https://www.kidoedu.edu.vn"
                                                target="_blank"
                                                rel="noreferrer"
                                                className="link-light text-decoration-none"
                                            >
                                                www.kidoedu.edu.vn
                                            </a>
                                        </p>
                                    </address>
                                </div>
                                <div className="col-12 col-md-4">
                                    <h6 className="footer-heading">Chính sách</h6>
                                    <ul className="list-unstyled small mb-0">
                                        <li>
                                            <Link className="text-decoration-none" to="/PriceInfoPage" >THÔNG TIN VỀ GIÁ SẢN PHẨM</Link>
                                        </li>
                                        <li>
                                            <Link className="text-decoration-none" to="/PaymentPolicyPage">
                                                Chính sách thanh toán
                                            </Link>
                                        </li>
                                        <li>
                                            <Link className="text-decoration-none" to="/ShippingPolicyPage">
                                                Chính sách vận chuyển
                                            </Link>
                                        </li>
                                        <li>
                                            <Link className="text-decoration-none" to="/InspectionPolicyPage">
                                                Chính sách kiểm hàng
                                            </Link>
                                        </li>
                                        <li>
                                            <Link className="text-decoration-none" to="/ReturnsRefundsPolicyPage">
                                                Chính sách đổi trả và hoàn tiền
                                            </Link>
                                        </li>
                                        <li>
                                            <Link className="text-decoration-none" to="/PrivacyPolicyPage">
                                                Chính sách bảo mật thông tin
                                            </Link>
                                        </li>
                                        <li>
                                            <Link className="text-decoration-none" to="/overview">
                                                CHÍNH SÁCH VÀ QUY ĐỊNH
                                            </Link>
                                        </li>
                                    </ul>
                                </div>
                                {/* Col 2: Chính sách */}
                                {/*     <div className="col-12 col-md-4">
                                    <h6 className="footer-heading">Chính sách</h6>
                                    <ul className="list-unstyled small mb-0">
                                        <li>
                                            <Link className="text-decoration-none" to="/PaymentPolicyPage" >Chính sách thanh toán</Link>
                                        </li>
                                        <li>
                                            <Link className="text-decoration-none" to="/ComplaintHandlingPolicyPage">
                                                Chính sách xử lý khiếu nại
                                            </Link>
                                        </li>
                                        <li>
                                            <Link className="text-decoration-none" to="/ShippingPolicyPage">
                                                Chính sách vận chuyển
                                            </Link>
                                        </li>
                                        <li>
                                            <Link className="text-decoration-none" to="/MaintenancePolicyPage">
                                                Chính sách bảo trì
                                            </Link>
                                        </li>
                                        <li>
                                            <Link className="text-decoration-none" to="/ReturnPolicyPage">Chính sách đổi trả hàng</Link>
                                        </li>
                                        <li>
                                            <Link className="text-decoration-none" to="/PrivacyPolicyPage">
                                                Chính sách bảo mật thông tin
                                            </Link>
                                        </li>
                                    </ul>
                                </div> */}

                                {/* Col 3: Dịch vụ khách hàng */}
                                {/*       <div className="col-12 col-md-4">
                                    <h6 className="footer-heading">Dịch vụ khách hàng</h6>
                                    <ul className="list-unstyled small mb-0">
                                        <li>
                                            <Link className="text-decoration-none" to="/PaymentPolicy">Điều khoản thanh toán</Link>
                                        </li>
                                        <li>
                                            <Link className="text-decoration-none" to="/ContactFeedbackPage">Liên hệ góp ý</Link>
                                        </li>
                                        <li>
                                            <Link className="text-decoration-none" to="/ReturnPolicyGuide">
                                                Hướng dẫn đổi trả hàng
                                            </Link>
                                        </li>
                                        <li>
                                            <Link className="text-decoration-none" to="/warrantypolicy">Bảo hành sản phẩm</Link>
                                        </li>
                                    </ul>
                                </div> */}
                                <div
                                    className="col-8 col-md-4 text-center"
                                    style={{ fontSize: "0.9rem", color: "#ccc" }}
                                >
                                    <p className="mb-1 fw-semibold text-white">
                                        CÔNG TY TNHH KIDO EDU
                                    </p>
                                    <p className="mb-1">
                                        GPKD số{" "}
                                        <a
                                            href="https://masothue.com/0319127924"
                                            target="_blank"
                                            rel="noreferrer"
                                            className="text-info text-decoration-none"
                                        >
                                            0319127924
                                        </a>{" "}
                                        do Sở KH & ĐT TP HCM cấp ngày 31/10/2025
                                    </p>
                                    <p className="mb-1">
                                        Địa chỉ: Số 1 Đường Cộng Hòa 3, Phường Phú Thọ Hòa, TP Hồ Chí
                                        Minh, Việt Nam
                                    </p>
                                    <p className="mb-0">
                                        <a
                                            href="http://online.gov.vn/Home/WebDetails/137241?AspxAutoDetectCookieSupport=1"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            <img
                                                src="https://cdn11.dienmaycholon.vn/filewebdmclnew/DMCL21/FE/images/hompage_49.png"
                                                alt="Đã đăng ký Bộ Công Thương"
                                                style={{ height: "45px", marginTop: "5px" }}
                                            />

                                        </a>
                                    </p>

                                </div>
                            </div>

                            {/* Thông tin pháp lý */}




                            {/* Divider */}
                            <hr className="border-secondary-subtle my-4" />

                            {/* Bottom bar */}
                            <div className="d-flex flex-column flex-md-row align-items-center justify-content-between gap-2">
                                <div className="small text-white-50 ">
                                    <img
                                        src={logo}
                                        alt="Logo công ty Gentech"
                                        className="img-fluid"
                                        style={{ width: 'clamp(72px, 10vw, 90px)', height: 'auto' }}
                                    />                                </div>
                                <div className="d-flex align-items-center gap-3 small">
                                    <span className="badge bg-primary-subtle text-primary border border-primary-subtle">Freeship</span>
                                    <span className="badge bg-warning-subtle text-warning border border-warning-subtle">Trả góp 0%</span>
                                    <span className="badge bg-info-subtle text-info border border-info-subtle">Đổi trả 7N</span>
                                </div>
                            </div>
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
                <a href="tel:0789 636 979" className="hotline-bubble" aria-label="Gọi ngay">
                    <i className="bi bi-telephone-fill"></i>
                    <span className="hotline-tip">Gọi 0789 636 979</span>
                </a>

                <div className="hotline-banner">
                    <div className="hotline-icon">
                        <i className="bi bi-phone"></i>
                    </div>

                    <div className="hotline-text">
                        <div>Hotline - Zalo</div>
                        <strong
                            className="shine"

                        >
                            0789 636 979
                        </strong>
                    </div>

                    <a className="zalo-badge" href="https://zalo.me/0789 636 979" target="_blank" rel="noreferrer" aria-label="Chat Zalo"></a>
                </div>
            </div>


            <div className="bg-dark text-light d-block d-sm-none">
                <div className="container-xl d-flex justify-content-between align-items-center py-3 small">
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
                {/* <a href="tel:0789 636 979" className="hotline-bubble" aria-label="Gọi ngay">
                    <i className="bi bi-telephone-fill"></i>
                    <span className="hotline-tip">Gọi 0789 636 979</span>
                </a> */}
                <a
                    href="tel:0789636979"
                    className="hotline-bubble"
                    aria-label="Gọi ngay"
                    style={{
                        width: 50,
                        height: 50,
                        fontSize: "18px",
                    }}
                >
                    <i
                        className="bi bi-telephone-fill"
                        style={{ fontSize: 18 }}
                    ></i>
                    <span
                        className="hotline-tip"
                        style={{
                            fontSize: "0.8rem",
                            padding: "4px 8px",
                        }}
                    >
                        Gọi 0789 636 979
                    </span>
                </a>
                {/* Hotline banner (hidden on md+) */}
                <a className="hotline-banner " href="https://zalo.me/0789636979">
                    <div className="hotline-icon">
                        <i className="bi bi-phone"></i>
                    </div>

                    {/* <div className="hotline-info d-flex flex-column">
                        <span className="label">Hotline - Zalo</span>
                        <strong className="phone-number">0789 636 979</strong>
                    </div> */}
                    <div
                        className="hotline-info d-flex flex-column"
                        style={{
                            lineHeight: 1.2,
                        }}
                    >
                        <span
                            className="label"
                            style={{
                                fontSize: "0.75rem",
                                opacity: 0.8,
                            }}
                        >
                            Hotline - Zalo
                        </span>

                        <strong
                            className="phone-number"
                            style={{
                                fontSize: "0.85rem",
                                fontWeight: 600,
                            }}
                        >
                            0789 636 979
                        </strong>
                    </div>
                    <div className="zalo-btn"  target="_blank" aria-label="Chat Zalo">

                    </div>
                </a>


            </div>

            <BannerBox id={6} label="D — Sticker Trái" className="sticker-left-u-h" />
            <BannerBox id={7} label="F — Sticker Trái nhỏ" className="sticker-left-a-h" />
            <BannerBox id={8} label="E — Sticker Phải" className="sticker-right-u-h" />
            <ChatbotWidget />

        </footer >


    )
}

