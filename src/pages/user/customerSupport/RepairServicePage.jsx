import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faScrewdriverWrench,
    faMicrochip,
    faBatteryQuarter,
    faDisplay,
    faWifi,
    faVolumeXmark,
    faPlug,
    faHeadphones,
    faKeyboard,
    faPhone,
    faLocationDot,
    faCheckCircle,
} from "@fortawesome/free-solid-svg-icons";

export default function RepairServicePage() {
    return (
        <div className="container my-5">
            {/* Header */}
            <div className="text-center mb-5">
                <h1 className="fw-bold text-primary mb-3">
                    <FontAwesomeIcon icon={faScrewdriverWrench} className="me-2" />
                    Dịch vụ sửa chữa Surface chuyên nghiệp tại Kido
                </h1>
                <p className="text-muted fs-5">
                    Kido chuyên <strong>sửa chữa – thay thế – khắc phục sự cố</strong> cho các dòng máy tính bảng
                    <span className="text-success"> Microsoft Surface</span> một cách nhanh chóng, chính xác và uy tín.
                </p>
            </div>

            {/* Danh sách sự cố */}
            <div className="card border-0 shadow-sm p-4 mb-5">
                <h4 className="fw-bold text-success mb-4">Các lỗi Surface thường gặp</h4>
                <div className="row g-4">
                    {[
                        { icon: faDisplay, text: "Màn hình Surface không cảm ứng được, vỡ màn hình" },
                        { icon: faWifi, text: "Mất Wifi, tín hiệu yếu, chập chờn" },
                        { icon: faMicrochip, text: "Không nhận SIM 3G / Mất sóng" },
                        { icon: faBatteryQuarter, text: "Không lên nguồn, pin yếu, sập nguồn bất ngờ" },
                        { icon: faPlug, text: "Không nhận sạc, sạc không vào điện" },
                        { icon: faVolumeXmark, text: "Không nghe âm thanh, hỏng nút chỉnh âm lượng" },
                        { icon: faKeyboard, text: "Không nhận cổng USB, bàn phím không hoạt động" },
                        { icon: faHeadphones, text: "Không rung, không nhận phụ kiện âm thanh" },
                    ].map((item, index) => (
                        <div key={index} className="col-md-6">
                            <div className="d-flex align-items-start">
                                <FontAwesomeIcon icon={item.icon} className="text-primary fs-4 me-3 mt-1" />
                                <p className="mb-0">{item.text}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Cam kết */}
            <div className="bg-light p-4 rounded-3 shadow-sm mb-5">
                <h4 className="fw-bold text-danger mb-3">Cam kết dịch vụ tại Kido</h4>
                <ul className="list-unstyled fs-6">
                    <li className="mb-2">
                        <FontAwesomeIcon icon={faCheckCircle} className="text-success me-2" />
                        Linh kiện thay thế <strong>chính hãng 100%</strong>.
                    </li>
                    <li className="mb-2">
                        <FontAwesomeIcon icon={faCheckCircle} className="text-success me-2" />
                        Thời gian sửa chữa <strong>nhanh nhất – đúng hẹn</strong>.
                    </li>
                    <li className="mb-2">
                        <FontAwesomeIcon icon={faCheckCircle} className="text-success me-2" />
                        <strong>Bảo hành dài hạn</strong> cho tất cả dịch vụ.
                    </li>
                    <li className="mb-2">
                        <FontAwesomeIcon icon={faCheckCircle} className="text-success me-2" />
                        Hỗ trợ bảo hành với các máy còn thời gian <strong>bảo hành toàn cầu (Mỹ, Nhật, Anh...)</strong>.
                    </li>
                </ul>
            </div>

            {/* Phụ kiện */}
            <div className="card border-0 shadow-sm p-4 mb-5">
                <h4 className="fw-bold text-primary mb-4">
                    Phụ kiện Surface chính hãng tại Kido
                </h4>
                <div className="row g-3">
                    {[
                        "Bao da Surface",
                        "Bút cảm ứng Surface Pen",
                        "Bàn phím, cáp nối",
                        "Chuột không dây Surface",
                        "Miếng dán màn hình",
                        "Sạc chính hãng Surface",
                    ].map((accessory, index) => (
                        <div key={index} className="col-md-4">
                            <div className="border rounded-3 p-3 bg-white h-100 shadow-sm text-center hover-shadow">
                                <p className="fw-semibold mb-0">{accessory}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Liên hệ */}
            <div className="bg-primary text-white p-4 rounded-3 shadow-sm text-center">
                <h4 className="fw-bold mb-3">Liên hệ ngay để được hỗ trợ!</h4>
                <p className="fs-5 mb-2">
                    <FontAwesomeIcon icon={faPhone} className="me-2" />
                    Hotline: <strong>0789 636 979</strong>
                </p>
                <p className="fs-6 mb-0">
                    <FontAwesomeIcon icon={faLocationDot} className="me-2" />
                    Số 1 Đường Cộng Hòa 3 - Phường Phú Thọ Hòa - TP. Hồ Chí Minh.
                </p>
                <p className="mt-3 mb-0">Rất hân hạnh được phục vụ quý khách 💙</p>
            </div>
        </div>
    );
}
