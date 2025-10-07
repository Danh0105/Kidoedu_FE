// Checkout.jsx (refactor)
import React, { useEffect, useMemo, useState, useContext, useCallback } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { CartContext } from "../../hooks/CartContext";
import ModalInfo from "../../components/user/ModalInfo";
import ModalPayment from "../../components/user/ModalPayment";

const fmtVND = (n) =>
  Number(n || 0).toLocaleString("vi-VN", { style: "currency", currency: "VND" });

const PAYMENT_METHODS = {
  cod: {
    id: "cod",
    label: "Thanh toán khi nhận hàng (COD)",
    icon: "https://cdn-icons-png.flaticon.com/512/1041/1041872.png",
  },
  momo: {
    id: "momo",
    label: "Thanh toán qua MoMo",
    icon: "https://upload.wikimedia.org/wikipedia/vi/f/fe/MoMo_Logo.png",
  },
  vnpay: {
    id: "vnpay",
    label: "Thanh toán qua VNPay",
    icon: "https://stcd02206177151.cloud.edgevnpay.vn/assets/images/logo-icon/logo-primary.svg",
  },
};

export default function Checkout() {
  const navigate = useNavigate();
  const { selectedProducts } = useContext(CartContext);

  const [products, setProducts] = useState([]);
  const [shippingInfo, setShippingInfo] = useState(null);
  const [showModalPayment, setShowModalPayment] = useState(false);
  const [method, setMethod] = useState("cod");

  // Đọc cookie shippingInfo an toàn
  const readShippingCookie = useCallback(() => {
    const saved = Cookies.get("shippingInfo");
    if (!saved) return null;
    try {
      return JSON.parse(saved);
    } catch {
      console.error("Không thể parse shippingInfo từ cookie");
      return null;
    }
  }, []);

  useEffect(() => {
    if (Array.isArray(selectedProducts) && selectedProducts.length) {
      setProducts(selectedProducts);
    }
    setShippingInfo(readShippingCookie());
  }, [selectedProducts, readShippingCookie]);

  const totals = useMemo(() => {
    const total = products.reduce(
      (sum, p) => sum + Number(p?.data?.price || 0) * Number(p?.quantity || 0),
      0
    );
    const shippingFee = 0;
    return { total, shippingFee, final: total + shippingFee };
  }, [products]);

  const onConfirmMethod = (m) => setMethod(m);

  // ===== Handlers =====
  const ensureHasShipping = () => {
    if (!shippingInfo) {
      window.alert("⚠️ Vui lòng nhập thông tin giao hàng trước!");
      return false;
    }
    return true;
  };

  const handlePlaceOrderCOD = async () => {
    if (!ensureHasShipping()) return;

    try {
      const payload = {
        ...shippingInfo,
        items: products.map((p) => ({
          product_id: p.data.product_id,
          quantity: Number(p.quantity),
          price_per_unit: Number(p.data.price),
        })),
      };

      const url = payload.API; // theo file gốc
      delete payload.API;

      const res = await axios.post(url, payload);
      navigate("/invoice", { state: { order: res.data.order, items: products } });
    } catch (err) {
      console.error("❌ Lỗi gửi đơn hàng:", err);
      window.alert("Đã xảy ra lỗi khi gửi đơn hàng. Vui lòng thử lại!");
    }
  };

  const handlePlaceOrderMomo = async () => {
    if (!ensureHasShipping()) return;

    try {
      const orderId = `ORD-${Date.now()}`;

      localStorage.setItem(
        "pendingOrder",
        JSON.stringify({ orderId, products, shippingInfo, method: "momo" })
      );

      const res = await axios.post("https://kidoedu.vn/momo/create-payment", {
        amount: totals.final,
        orderId,
        items: products.map((p) => ({
          id: p.data.product_id,
          name: p.data.product_name,
          qty: Number(p.quantity),
          price: Number(p.data.price),
        })),
      });

      if (res.data?.payUrl) {
        window.location.href = res.data.payUrl;
      } else {
        window.alert("❌ Không thể tạo thanh toán MoMo.");
      }
    } catch (err) {
      console.error("Lỗi thanh toán MoMo:", err);
      window.alert("Đã xảy ra lỗi khi kết nối MoMo.");
    }
  };

  const placeOrder = () => {
    if (method === "momo") return handlePlaceOrderMomo(); // theo logic hiện hữu :contentReference[oaicite:1]{index=1}
    return handlePlaceOrderCOD();
  };

  const payOpt = PAYMENT_METHODS[method];

  // ===== UI =====
  return (
    <div>
      {/* ĐỊA CHỈ NHẬN HÀNG */}
      <div className="container my-3 bg-white custom-border-top p-3 rounded-3 shadow-sm">
        <div className="mb-2">
          <i className="bi bi-geo-alt-fill text-danger me-2" />
          <span className="fw-bold text-danger">Địa Chỉ Nhận Hàng</span>
        </div>

        {shippingInfo ? (
          <div className="d-flex flex-wrap justify-content-between align-items-start">
            <div>
              <div className="fw-bold mb-2">
                {shippingInfo.address?.full_name} - (+84) {shippingInfo.address?.phone_number}
              </div>
              <div>
                {shippingInfo.address?.street}, {shippingInfo.address?.ward},{" "}
                {shippingInfo.address?.district}, {shippingInfo.address?.city}
              </div>

              {(shippingInfo.companyName ||
                shippingInfo.businessEmail ||
                shippingInfo.taxId) && (
                  <div className="mt-2 small">
                    {shippingInfo.companyName && (
                      <>
                        <strong>Tên công ty:</strong> {shippingInfo.companyName}{" "}
                      </>
                    )}
                    {shippingInfo.businessEmail && (
                      <>
                        | <strong>Email:</strong> {shippingInfo.businessEmail}{" "}
                      </>
                    )}
                    {shippingInfo.taxId && (
                      <>
                        | <strong>MST:</strong> {shippingInfo.taxId}
                      </>
                    )}
                  </div>
                )}
            </div>

            <div className="text-end">
              {/*               <span className="badge bg-light text-danger border border-danger me-2">Mặc định</span>
 */}              <a
                href="#"
                className="text-primary text-decoration-none"
                data-bs-toggle="modal"
                data-bs-target="#staticBackdrop"
              >
                Thay đổi
              </a>
              <ModalInfo onUpdate={setShippingInfo} />
            </div>
          </div>
        ) : (
          <div className="d-flex justify-content-between align-items-center">
            <span className="text-muted">Chưa có địa chỉ nhận hàng</span>
            <a
              href="#"
              className="text-primary text-decoration-none"
              data-bs-toggle="modal"
              data-bs-target="#staticBackdrop"
            >
              Thêm ngay
            </a>
            <ModalInfo onUpdate={setShippingInfo} />
          </div>
        )}
      </div>

      {/* SẢN PHẨM */}
      <div className="container bg-white rounded-3 shadow-sm my-3 p-3">
        <table className="table table-borderless align-middle">
          <thead className="border-bottom fw-bold">
            <tr>
              <th>Sản phẩm</th>
              <th className="text-center">Đơn giá</th>
              <th className="text-center">Số lượng</th>
              <th className="text-center">Thành tiền</th>
            </tr>
          </thead>
          <tbody>
            {products?.length ? (
              products.map((prd) => {
                const id = prd?.data?.product_id;
                const price = Number(prd?.data?.price || 0);
                const qty = Number(prd?.quantity || 0);
                const img = prd?.data?.images?.[0]?.image_url;

                return (
                  <tr key={id}>
                    <td className="d-flex align-items-center">
                      <img
                        src={img}
                        alt="Sản phẩm"
                        width={80}
                        height={80}
                        className="rounded me-2"
                      />
                      <span className="fw-semibold text-dark small">{prd?.data?.product_name}</span>
                    </td>
                    <td className="text-center">{fmtVND(price)}</td>
                    <td className="text-center">{qty}</td>
                    <td className="text-center text-danger fw-bold">{fmtVND(price * qty)}</td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={4} className="text-center text-muted py-4">
                  🛒 Đơn hàng trống
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* TỔNG KẾT & THANH TOÁN */}
      <div className="container bg-white rounded-3 shadow-sm my-3 p-3">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h6 className="fw-bold mb-0">Phương thức thanh toán</h6>
          <div className="d-flex align-items-center">
            <img src={payOpt.icon} alt={payOpt.label} width={36} height={36} className="me-2" />
            <span className="fw-semibold">{payOpt.label}</span>
            <a
              href="#"
              className="text-primary fw-bold ms-3"
              onClick={(e) => {
                e.preventDefault();
                setShowModalPayment(true);
              }}
            >
              Thay đổi
            </a>

            <ModalPayment
              show={showModalPayment}
              onClose={() => setShowModalPayment(false)}
              onConfirm={(m) => {
                onConfirmMethod(m);
                setShowModalPayment(false);
              }}
            />
          </div>
        </div>

        <div className="border-top pt-3">
          <div className="d-flex justify-content-between text-muted">
            <span>Tổng tiền hàng</span>
            <span>{fmtVND(totals.total)}</span>
          </div>
          <div className="d-flex justify-content-between text-muted">
            <span>Phí vận chuyển</span>
            <span>{fmtVND(totals.shippingFee)}</span>
          </div>
          <div className="d-flex justify-content-between fw-bold fs-5 mt-2">
            <span>Tổng thanh toán</span>
            <span className="text-danger">{fmtVND(totals.final)}</span>
          </div>
        </div>

        <div className="d-flex justify-content-between align-items-center mt-3">
          <small className="text-muted">
            Nhấn <strong>"Đặt hàng"</strong> đồng nghĩa bạn đồng ý với{" "}
            <a href="#" className="text-primary text-decoration-none">
              Điều khoản sử dụng
            </a>
          </small>
          <button className="btn btn-danger px-4" onClick={placeOrder}>
            Đặt hàng
          </button>
        </div>
      </div>
    </div>
  );
}
