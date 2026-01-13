import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { CartContext } from "../../hooks/CartContext";
import ModalInfo from "../../components/user/ModalInfo";
import ModalPayment from "../../components/user/ModalPayment";
import logoMomo from "../../assets/user/logo2.svg";
import '../../components/user/Checkout.css';
import { QRCodeCanvas } from "qrcode.react";

// đặt trong Checkout.jsx (trên cùng file)
const toAttrObj = (raw) => {
  if (!raw) return {};
  if (typeof raw === 'object') return raw;            // đã là object
  if (Array.isArray(raw)) {
    // ex: [{name:'color', value:'Đen'}] -> {color:'Đen'}
    return raw.reduce((acc, it) => {
      if (it && it.name) acc[String(it.name).trim()] = String(it.value ?? '').trim();
      return acc;
    }, {});
  }
  if (typeof raw === 'string') {
    const s = raw.trim();
    if (!s) return {};
    // thử JSON trước
    try { const j = JSON.parse(s); if (j && typeof j === 'object') return j; } catch { }
    // fallback: parse k:v; k2:v2 (ngăn cách bởi ; , |)
    const out = {};
    s.split(/[;,\|]/).forEach(pair => {
      if (!pair) return;
      const [k, ...rest] = pair.split(':');
      if (!k) return;
      out[k.trim()] = rest.join(':').trim();
    });
    return out;
  }
  return {};
};

const PLACEHOLDER_IMG = "https://placehold.co/600x600?text=No+Image";
export default function Checkout() {
  const navigate = useNavigate();
  const { selectedProducts } = useContext(CartContext);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [pendingOrder, setPendingOrder] = useState(false);

  const [products, setProducts] = useState([]);
  const [shippingInfo, setShippingInfo] = useState(null);
  const [showModalPayment, setShowModalPayment] = useState(false);
  const [method, setMethod] = useState("cod");
  const [opt, setOpt] = useState({
    id: "cod",
    label: "Thanh toán khi nhận hàng (COD)",
    icon: "https://cdn-icons-png.flaticon.com/512/1041/1041872.png",
  });
  const [vietQrBase64, setVietQrBase64] = useState(null);
  const [showQrModal, setShowQrModal] = useState(false);

  // Lấy thông tin sản phẩm và shipping từ cookie
  useEffect(() => {
    if (selectedProducts?.length) setProducts(selectedProducts);
    const saved = Cookies.get("shippingInfo");
    if (saved) {
      try {
        let data = JSON.parse(saved);

        // ✅ Nếu không phải mảng, ép thành mảng
        if (!Array.isArray(data)) {
          data = [data];
        }

        const defaultAddress = data.find(item => item.address?.is_default === true);
        setShippingInfo(defaultAddress || data[0]); // fallback: nếu chưa có mặc định
      } catch (err) {
        console.error("Không thể parse shippingInfo từ cookie:", err);
      }
    }
  }, [selectedProducts]);


  // Tính tổng tiền
  const totalPrice = products.reduce(
    (sum, p) => sum + (p?.pricing || p?.price || p?.data.price) * p.quantity,
    0
  );
  const shippingFee = 0;
  const finalTotal = totalPrice + shippingFee;
  const buildOrderPayload = (paymentMethod) => {
    if (!shippingInfo) {
      throw new Error("Thiếu thông tin giao hàng");
    }
    const saved = Cookies.get("shippingInfo");

    if (!saved) {
      return alert("⚠️ Vui lòng nhập thông tin giao hàng trước khi đặt hàng!");
    }

    if (!shippingInfo?.email) {
      return alert("⚠️ Thiếu email người dùng!");
    }

    const email = shippingInfo.email.trim();
    const items = products.map((p) => ({
      variantId: p?.variant?.variantId ?? p?.variantId,
      productId: p?.productId,
      quantity: p.quantity,
      pricePerUnit: Number(p.pricing ?? p.price),
    }));

    const payload = {
      username: shippingInfo.address.full_name,
      email,
      address: shippingInfo.address,
      items,
      paymentMethod
    };
    const url = shippingInfo.API;
    delete shippingInfo.API;
    return {
      payload,
      url
    };
  };

  // 🧾 Xử lý đặt hàng COD
  const handleSubmit = async () => {
    try {
      const payload = buildOrderPayload('cod');
      console.log("payload", payload)
      const res = await axios.post(
        `${payload.url}`,
        payload.payload
      );

      // COD → order tạo xong là xong
      navigate("/invoice", { state: { order: res.data } });

    } catch (err) {
      console.error("❌ Lỗi tạo đơn COD:", err.response?.data || err);
      alert("Không thể tạo đơn hàng. Vui lòng thử lại!");
    }
  };






  // 💳 Thanh toán MoMo
  const handleMomoPayment = async () => {
    try {
      const payload = buildOrderPayload("momo");

      const orderRes = await axios.post(payload.url, payload.payload);
      const order = orderRes.data.order ?? orderRes.data;

      const momoRes = await axios.post(
        `${process.env.REACT_APP_API_URL}/momo/create-payment`,
        {
          amount: Number(order.totalAmount),
          orderId: order.orderId,
        }
      );

      if (momoRes.data?.payUrl) {
        window.location.href = momoRes.data.payUrl;
      } else {
        alert("Không thể tạo thanh toán MoMo");
      }
    } catch (err) {
      console.error("MoMo error:", err);
      alert("Lỗi thanh toán MoMo");
    }
  };

  // 💳 Thanh toán VNPay
  const handleVnpayPayment = async () => {
    try {
      const payload = buildOrderPayload("vnpay");

      // 1️⃣ Tạo order
      const orderRes = await axios.post(payload.url, payload.payload);
      const order = orderRes.data.order ?? orderRes.data;

      // 2️⃣ Tạo link VNPay
      const vnpayRes = await axios.post(
        `${process.env.REACT_APP_API_URL}/vnpay/create-payment`,
        {
          amount: Number(order.totalAmount),
          orderId: order.orderId,
          orderDescription: `Thanh toán đơn hàng #${order.orderId}`,
          orderType: 'billpayment',
          language: 'vn',
          bankCode: 'NCB',
        }
      );
      if (vnpayRes.data?.payUrl) {
        window.location.href = vnpayRes.data.payUrl;
      } else {
        throw new Error("VNPay payUrl missing");
      }
    } catch (err) {
      console.error("VNPay error:", err);
      alert("Lỗi thanh toán VNPay");
    }
  };
  const handleBankPayment = async () => {
    try {
      const payload = buildOrderPayload("vietqr");

      const orderRes = await axios.post(payload.url, payload.payload);
      const order = orderRes.data.order ?? orderRes.data;


      const qrRes = await axios.post(
        `${process.env.REACT_APP_API_URL}/vietqr/generate`,
        {
          orderId: order.orderId,
          amount: Number(order.totalAmount),
          purpose: `Thanhtoandonhang${order.orderId}`,
        }
      );

      if (!qrRes.data?.data?.base64QRCode) {
        throw new Error("QR data missing");
      }

      setVietQrBase64(qrRes.data.data.base64QRCode);
      setShowQrModal(true);

    } catch (err) {
      console.error("VietQR error:", err);
      alert("Không thể tạo mã QR ngân hàng");
    }
  };



  // 🔄 Chọn phương thức thanh toán
  const handleConfirm = (selectedMethod) => {
    setMethod(selectedMethod);
    const methods = {
      cod: {
        id: "cod",
        label: "Thanh toán khi nhận hàng (COD)",
        icon: "https://cdn-icons-png.flaticon.com/512/1041/1041872.png",
      },
      momo: {
        id: "momo",
        label: "Thanh toán qua MoMo",
        icon: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQZcQPC-zWVyFOu9J2OGl0j2D220D49D0Z7BQ&s",
      },
      vnpay: {
        id: "vnpay",
        label: "Thanh toán qua VNPay",
        icon: "https://stcd02206177151.cloud.edgevnpay.vn/assets/images/logo-icon/logo-primary.svg",
      },
      bank: {
        id: "bank",
        label: "Thanh toán Ngân hàng (VietQR)",
        icon: "https://play-lh.googleusercontent.com/22cJzF0otG-EmmQgILMRTWFPnx0wTCSDY9aFaAmOhHs30oNHxi63KcGwUwmbR76Msko",
      },
    };
    setOpt(methods[selectedMethod]);
  };

  const handlePlaceOrder = () => {
    if (!shippingInfo) {
      setPendingOrder(true);
      setShowAddressModal(true);
      return;
    }


    // ✅ Đã có địa chỉ → xử lý theo phương thức thanh toán
    if (method === "momo") return handleMomoPayment();
    if (method === "vnpay") return handleVnpayPayment();
    if (method === "bank") return handleBankPayment();
    return handleSubmit(); // COD
  };

  return (
    <div className="checkout-page">
      {/* ========== Thông tin giao hàng ========== */}
      <div className="container my-3 bg-white custom-border-top p-3 rounded-3 shadow-sm">
        <div className="mb-2 d-flex align-items-center">
          <i className="bi bi-geo-alt-fill text-danger me-2"></i>
          <span className="fw-bold text-danger">Địa Chỉ Nhận Hàng</span>
        </div>

        {shippingInfo ? (
          <div className="d-flex flex-wrap justify-content-between align-items-start gap-2">
            <div className="me-0 me-md-3">
              <div className="fw-bold mb-2 text-wrap">
                {shippingInfo.address?.full_name} - (+84){" "}
                {shippingInfo.address?.phone_number}
              </div>
              <div className="text-wrap">
                {shippingInfo.address?.street},{" "}
                {shippingInfo.address?.ward},{" "}
                {shippingInfo.address?.district},{" "}
                {shippingInfo.address?.city}
              </div>

              {shippingInfo.companyName && (
                <div className="mt-2 small">
                  <strong>Tên công ty:</strong> {shippingInfo.companyName} |{" "}
                  <strong>Email:</strong> {shippingInfo.businessEmail} |{" "}
                  <strong>MST:</strong> {shippingInfo.taxId}
                </div>
              )}
            </div>

            <div className="text-end ms-auto">
              {shippingInfo.address.is_default == true ? (
                <span className="badge bg-light text-danger border border-danger me-2 d-none d-sm-inline">
                  Mặc định
                </span>
              ) : (
                <></>
              )}
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setShowAddressModal(true);
                }}
                className="text-decoration-none"
              >
                Thay đổi
              </a>

              {showAddressModal && (
                <ModalInfo
                  onUpdate={(addr) => {
                    setShippingInfo(addr);
                    setShowAddressModal(false);

                    if (pendingOrder) {
                      setPendingOrder(false);
                      setTimeout(handlePlaceOrder, 0);
                    }
                  }}
                  onClose={() => setShowAddressModal(false)}
                />
              )}





            </div>
          </div>
        ) : (
          <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">
            <span className="text-muted">Chưa có địa chỉ nhận hàng</span>
            <a
              href="#"
              className="text-primary text-decoration-none"
              onClick={(e) => {
                e.preventDefault();
                setShowAddressModal(true);
              }}
            >
              Thêm ngay
            </a>
            {showAddressModal && (
              <ModalInfo
                onUpdate={(addr) => {
                  setShippingInfo(addr);
                  setShowAddressModal(false);

                  if (pendingOrder) {
                    setPendingOrder(false);
                    setTimeout(handlePlaceOrder, 0);
                  }
                }}
                onClose={() => setShowAddressModal(false)}
              />
            )}



          </div>
        )}
      </div>

      {/* ========== Danh sách sản phẩm ========== */}
      <div className="container bg-white rounded-3 shadow-sm my-3 p-3">
        <table className="table table-borderless align-middle mb-0">
          <thead className="border-bottom fw-bold">
            <tr>
              <th>Hình ảnh</th>
              <th>Sản phẩm</th>
              <th className="text-center d-none d-md-table-cell">Đơn giá</th>{/* ẩn ở < md */}
              <th className="text-center">Số lượng</th>
              <th className="text-center">Thành tiền</th>
            </tr>
          </thead>
          <tbody>
            {products.length > 0 ? (
              products.map((prd) => (
                <tr key={`${prd.data?.productId || prd?.productId}-${(prd?.variant?.variantId || prd?.variantId) ?? 'base'}`}>
                  <td className="d-flex align-items-start align-items-md-center gap-2">
                    <img
                      onError={(e) => (e.currentTarget.src = PLACEHOLDER_IMG)}
                      src={process.env.REACT_APP_API_URL + prd?.imageUrl || PLACEHOLDER_IMG}
                      alt="Sản phẩm"
                      className="rounded me-0 me-md-2 object-cover"
                      style={{ objectFit: "scale-down", objectPosition: "center", padding: 8 }}
                      height={80}
                      width={80}
                    />

                  </td>
                  <td>
                    <div className="d-flex align-items-start gap-3">

                      {/* Vùng trái: ảnh sản phẩm nếu cần */}
                      {prd?.thumb && (
                        <div
                          className="rounded border"
                          style={{ width: 60, height: 60, overflow: "hidden" }}
                        >
                          <img
                            src={prd.thumb}
                            alt={prd.productName}
                            className="w-100 h-100 object-fit-cover"
                          />
                        </div>
                      )}

                      {/* Vùng phải */}
                      <div className="d-flex flex-column justify-content-between flex-grow-1">

                        {/* Tên sản phẩm */}
                        <div
                          className="fw-bold text-dark"
                          style={{ lineHeight: "1.3" }}
                          title={prd.data?.productName || prd?.productName}
                        >
                          {prd.productName}{" "}
                          <span className="text-muted">{prd.variantName}</span>
                        </div>



                        {/* Giá (hiển thị khi màn hình nhỏ) */}
                        <div className="d-sm-none mt-2">
                          <span className="fw-bold text-danger small">
                            {Number(
                              [prd?.pricing, prd?.price, prd?.data?.price].find(v => v > 0) ?? 0
                            ).toLocaleString()}{" "}
                            ₫
                          </span>
                        </div>

                      </div>
                    </div>
                  </td>

                  <td className="text-center d-none d-md-table-cell">
                    {Number(prd?.pricing || prd.price || prd?.data.price).toLocaleString()} ₫
                  </td>
                  <td className="text-center">{prd.quantity}</td>
                  <td className="text-center text-danger fw-bold">
                    {((prd?.pricing || prd.price || prd?.data.price) * prd.quantity).toLocaleString()} ₫
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center text-muted py-4">
                  🛒 Đơn hàng trống
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>


      {showQrModal && (
        <div className="modal fade show d-block vietqr-backdrop" tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content vietqr-bank-modal">

              <div className="modal-body text-center">

                {/* VietQR Logo */}
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/7/77/VietQR_Logo.png"
                  alt="VietQR"
                  className="vietqr-logo mb-2"
                />

                {/* QR */}
                <div className="vietqr-qr-wrapper my-3">
                  <QRCodeCanvas
                    value={vietQrBase64 ? atob(vietQrBase64) : ""}
                    size={240}
                    level="M"
                  />
                </div>

                {/* NAPAS + Bank */}
                <div className="vietqr-bank-row mb-2">
                  <img src="data:image/png;base64,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"
                    alt="NAPAS" height={24} />
                  <span className="mx-2 text-muted">|</span>

                </div>



              </div>

              <div className="modal-footer border-0 pt-0">
                <button
                  className="btn btn-outline-secondary w-100"
                  onClick={() => setShowQrModal(false)}
                >
                  Đóng
                </button>
              </div>

            </div>
          </div>
        </div>
      )}


      {/* ========== Tổng kết + Thanh toán ========== */}
      <div className="container bg-white rounded-3 shadow-sm my-3 p-3">
        <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-3">
          <h6 className="fw-bold mb-0">Phương thức thanh toán</h6>
          <div className="d-flex align-items-center flex-wrap gap-2">
            <img src={opt.icon} alt={opt.label} width={36} height={36} className="me-0 me-sm-2" />
            <span className="fw-semibold me-2">{opt.label}</span>
            <a
              className="text-decoration-none"
              href="#"
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
              onConfirm={handleConfirm}
            />
          </div>
        </div>

        <div className="border-top pt-3">
          <div className="d-flex justify-content-between text-muted">
            <span>Tổng tiền hàng</span>
            <span>{totalPrice.toLocaleString()} ₫</span>
          </div>
          <div className="d-flex justify-content-between text-muted">
            <span>Phí vận chuyển</span>
            <span>{shippingFee.toLocaleString()} ₫</span>
          </div>
          <div className="d-flex justify-content-between fw-bold fs-5 mt-2">
            <span>Tổng thanh toán</span>
            <span className="text-danger">{finalTotal.toLocaleString()} ₫</span>
          </div>
        </div>

        <div className="d-flex justify-content-between align-items-center flex-column flex-sm-row gap-2 mt-3">
          <small className="text-muted text-center text-sm-start">
            Nhấn <strong>"Đặt hàng"</strong> đồng nghĩa bạn đồng ý với{" "}
            <a href="#" className="text-primary text-decoration-none">
              Điều khoản sử dụng
            </a>
          </small>
          <button
            className="btn btn-danger px-4 w-sm-auto"
            onClick={handlePlaceOrder}
          >
            Đặt hàng
          </button>

        </div>
      </div>
    </div>
  );
}
