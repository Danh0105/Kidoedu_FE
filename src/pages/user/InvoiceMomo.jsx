import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
function useQuery() {
  return new URLSearchParams(useLocation().search);
}
export default function Invoice() {
  const [status, setStatus] = useState("loading");
  const query = useQuery();
  const orderId = query.get("orderId");

  useEffect(() => {
    if (!orderId) {
      setStatus("invalid");
      return;
    }

    axios.post("https://kidoedu.vn/momo/payment-notify", { orderId })
      .then((res) => {
        if (res.data.success) {
          setStatus("success");
        } else {
          setStatus("fail");
        }
      })
      .catch((err) => {
        console.error("Xác minh thất bại:", err);
        setStatus("fail");
      });
  }, [orderId]);
  if (status === "loading") return <div>Đang kiểm tra thanh toán...</div>;
  if (status === "success") return <div>✅ Thanh toán thành công!</div>;
  if (status === "fail") return <div>❌ Thanh toán thất bại hoặc chưa hoàn tất.</div>;
  return <div>Không tìm thấy thông tin đơn hàng.</div>;
}
