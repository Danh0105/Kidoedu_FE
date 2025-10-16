import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLaptop, faSpinner } from "@fortawesome/free-solid-svg-icons";

export default function LoadPage({ children }) {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Giả lập thời gian tải dữ liệu (1.5s)
        const timer = setTimeout(() => setLoading(false), 1500);
        return () => clearTimeout(timer);
    }, []);

    if (loading) {
        return (
            <div
                className="d-flex flex-column justify-content-center align-items-center vh-100 bg-white"
                style={{ zIndex: 9999 }}
            >
                <div className="text-center">
                    {/* Logo Animation */}
                    <FontAwesomeIcon
                        icon={faLaptop}
                        className="text-primary mb-3"
                        style={{ fontSize: "3rem" }}
                    />
                    <div className="spinner-border text-primary mb-3" role="status">
                        <span className="visually-hidden">Đang tải...</span>
                    </div>

                    {/* Animated text */}
                    <h5 className="fw-bold text-secondary mt-2">Kido đang tải nội dung...</h5>
                    <p className="text-muted small">Vui lòng đợi trong giây lát 💙</p>
                </div>

                {/* CSS animation hiệu ứng fade */}
                <style>
                    {`
            .spinner-border {
              width: 3rem;
              height: 3rem;
              animation: spin 1s linear infinite;
            }
            @keyframes spin {
              from { transform: rotate(0deg); }
              to { transform: rotate(360deg); }
            }
          `}
                </style>
            </div>
        );
    }

    // Khi đã tải xong, hiển thị nội dung chính
    return <div className="fade-in">{children}</div>;
}
