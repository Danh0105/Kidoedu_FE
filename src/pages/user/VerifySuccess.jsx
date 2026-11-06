import React from "react";
import { useNavigate } from "react-router-dom";

export default function VerifySuccess() {
    const navigate = useNavigate();

    return (
        <div
            className="d-flex justify-content-center align-items-center"
            style={{
                minHeight: "100vh",
                padding: "20px",
            }}
        >
            <div
                className="card shadow-lg p-4 text-center"
                style={{
                    maxWidth: "460px",
                    borderRadius: "20px",
                    width: "100%",
                }}
            >
                {/* Logo */}
                <img
                    src="https://www.kidoedu.edu.vn/static/media/Logo.b35816c78d7c3753c12d.png"
                    alt="IchiSkill Logo"
                    style={{ width: "120px", margin: "0 auto 10px", display: "block" }}
                />

                {/* Icon check */}
                <div className="text-center mt-2 mb-3">
                    <div
                        style={{
                            width: "80px",
                            height: "80px",
                            margin: "0 auto",
                            borderRadius: "50%",
                            background: "#E8F8ED",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                    >
                        <i
                            className="bi bi-check-circle-fill"
                            style={{ fontSize: "48px", color: "#2ECC71" }}
                        ></i>
                    </div>
                </div>

                {/* Title */}
                <h3 className="fw-bold text-success">Xác thực thành công!</h3>

                {/* Message */}
                <p className="text-muted mt-2">
                    Email của bạn đã được xác thực.
                    Giờ bạn có thể tiếp tục mua hàng hoặc quay lại trang chủ.
                </p>

                {/* Footer */}
                <p className="small text-muted mt-4 mb-0">
                    © 2025 IchiSkill Education
                </p>
            </div>
        </div>
    );
}
