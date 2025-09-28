
import Zalo from "../../assets/user/zalo.png";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebookMessenger } from '@fortawesome/free-brands-svg-icons';
import { faArrowUp, faLocationDot, faPhone, faEnvelope, faGlobe } from '@fortawesome/free-solid-svg-icons';
import { useEffect, useState } from "react";
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
                            <p className="text-wrap"><FontAwesomeIcon icon={faLocationDot} /> Địa Chỉ : 231/1 Nguyễn Phúc Chu - Phường 15 - Quận Tân Bình - TP. Hồ Chí Minh.</p>
                            <p className="text-wrap"><FontAwesomeIcon icon={faPhone} /> ĐIện thoại :  0707 868 600 - 0789 636 979</p>
                            <p className="text-wrap"><FontAwesomeIcon icon={faEnvelope} /> Mail : hcns@ichiskill.edu.vn</p>
                            <p className="text-wrap"><FontAwesomeIcon icon={faGlobe} /> Website : www.ichiskilll.com</p>
                        </div>

                    </div>
                    <div className="p-2 bd-highlight" style={{ fontFamily: "Poppins, sans-serif", fontSize: "16px", lineHeight: "1.6" }}>
                        <div className="mb-1" style={{ position: "relative" }}>
                            <p style={{ fontWeight: 600, marginBottom: "0px" }}>Chính sách</p>
                        </div>
                        <div style={{ color: "#444444" }}>
                            <p className="text-wrap">CHÍNH SÁCH THANH TOÁN</p>
                            <p className="text-wrap"> CHÍNH SÁCH BẢO MẬT THÔNG TIN</p>
                            <p className="text-wrap"> ĐĂNG KÝ HỌC VIÊN</p>
                            <p className="text-wrap">  QUYỀN LỢI CỦA HỌC SINH</p>
                        </div>
                    </div>
                    <div className="p-2 bd-highlight" style={{ fontFamily: "Poppins, sans-serif", fontSize: "16px", lineHeight: "1.6" }}>
                        <div className="mb-1" style={{ position: "relative" }}>
                            <p style={{ fontWeight: 600, marginBottom: "0px" }}>Dịch vụ khách hàng</p>
                        </div>
                        <div style={{ color: "#444444" }}>
                            <p className="text-wrap">Về chúng tôi</p>
                            <p className="text-wrap">Liên hệ với chúng tôi</p>
                            <p className="text-wrap">FAQ</p>
                            <p className="text-wrap">Hệ thống của hàng</p>
                        </div>
                    </div>
                    <div className="p-2 bd-highlight" style={{ fontFamily: "Poppins, sans-serif", fontSize: "16px", lineHeight: "1.6" }}>
                        <div className="mb-1" style={{ position: "relative" }}>
                            <p style={{ fontWeight: 600, marginBottom: "0px" }}>Email Newsletter</p>
                        </div>
                        <div className="d-flex align-items-center justify-content-center gap-2 mt-2" style={{ color: "#444444" }}>
                            <div class="input-group ">
                                <input type="text" class="form-control" placeholder="Recipient's username" aria-label="Recipient's username" aria-describedby="basic-addon2" />
                            </div>
                            <button type="button" class="btn btn-success">Gửi</button>
                        </div>
                    </div>
                </div>
            </div>
            <div className="bg-light">
                <div className="d-flex justify-content-center align-items-center" style={{ color: "#444a43", height: "50px", backgroundColor: "#444a43" }}>
                    <div className="mb-0 text-light">Copyright © 2025 KiduEdu, All Rights Reserved.</div>
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
                            right: '28px',
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

            </div>
        </footer>


    )
}

