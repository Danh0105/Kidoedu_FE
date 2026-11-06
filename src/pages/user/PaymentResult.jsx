import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";

export default function PaymentResult() {
    const [params] = useSearchParams();
    const navigate = useNavigate();

    const [status, setStatus] = useState("loading"); // loading | success | error
    const [countdown, setCountdown] = useState(3);
    const [message, setMessage] = useState("");

    useEffect(() => {
        const momoOrderId = params.get("orderId");
        const resultCode = params.get("resultCode");

        const orderId = momoOrderId ? momoOrderId.split("_")[0] : null;

        if (!orderId) {
            setStatus("error");
            setMessage("Không tìm thấy thông tin đơn hàng.");
            return;
        }

        const checkOrderStatus = async () => {
            try {
                const res = await axios.get(
                    `${process.env.REACT_APP_API_URL}/orders/${orderId}/status`
                );

                if (res.data.paymentStatus === "Paid") {
                    const orderRes = await axios.get(
                        `${process.env.REACT_APP_API_URL}/orders/by-code/${orderId}`
                    );

                    setStatus("success");

                    const timer = setInterval(() => {
                        setCountdown((prev) => prev - 1);
                    }, 1000);

                    setTimeout(() => {
                        clearInterval(timer);
                        navigate("/invoice", { state: { order: orderRes.data } });
                    }, 3000);
                } else {
                    setStatus("error");
                    setMessage("Thanh toán chưa hoàn tất.");
                }
            } catch {
                setStatus("error");
                setMessage("Không thể tải thông tin đơn hàng.");
            }
        };

        // MoMo
        if (resultCode !== null) {
            if (resultCode === "0") {
                checkOrderStatus();
            } else {
                setStatus("error");
                setMessage("Thanh toán không thành công.");
            }
        }
        // VietQR
        else {
            checkOrderStatus();
        }
    }, []);

    return (
        <div className="container d-flex justify-content-center align-items-center" style={{ minHeight: "60vh" }}>
            <div className="card shadow-sm p-4 text-center" style={{ maxWidth: 420 }}>
                {status === "loading" && (
                    <>
                        <div className="spinner-border text-primary mb-3" />
                        <h5>Đang xử lý thanh toán</h5>
                        <p className="text-muted">Vui lòng đợi trong giây lát...</p>
                    </>
                )}

                {status === "success" && (
                    <>
                        <div className="text-success fs-1 mb-2">✔</div>
                        <h5 className="text-success">Thanh toán thành công</h5>
                        <p className="text-muted">
                            Đang chuyển đến hóa đơn trong <b>{countdown}</b> giây...
                        </p>
                    </>
                )}

                {status === "error" && (
                    <>
                        <div className="text-danger fs-1 mb-2">✖</div>
                        <h5 className="text-danger">Thanh toán thất bại</h5>
                        <p className="text-muted">{message}</p>
                        <button className="btn btn-outline-primary mt-2" onClick={() => navigate("/")}>
                            Quay về trang chủ
                        </button>
                    </>
                )}
            </div>
        </div>
    );
}
