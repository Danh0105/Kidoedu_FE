import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";

export default function PaymentResult() {
    const [params] = useSearchParams();
    const navigate = useNavigate();

    useEffect(() => {
        const orderId = params.get("orderId");
        const resultCode = params.get("resultCode");

        if (!orderId) {
            alert("Không tìm thấy đơn hàng");
            return;
        }

        if (resultCode === "0") {
            // 🔥 lấy order mới nhất từ backend
            axios
                .get(`${process.env.REACT_APP_API_URL}/orders/by-code/${orderId}`)
                .then((res) => {
                    navigate("/invoice", { state: { order: res.data } });
                });
        } else {
            alert("Thanh toán MoMo thất bại");
            navigate("/");
        }
    }, []);

    return <p>Đang xử lý kết quả thanh toán...</p>;
}
