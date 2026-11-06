import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { CartContext } from "../../hooks/CartContext";
import ModalInfo from "../../components/user/ModalInfo";
import ModalPayment from "../../components/user/ModalPayment";

const PLACEHOLDER_IMG = "https://placehold.co/600x600?text=No+Image";
export default function CheckoutRental() {
  const navigate = useNavigate();
  const { selectedProducts } = useContext(CartContext);

  // STATE
  const [products, setProducts] = useState([]);
  const [shippingInfo, setShippingInfo] = useState(null);
  const [showModalPayment, setShowModalPayment] = useState(false);
  const [method, setMethod] = useState("cod");
  const [opt, setOpt] = useState({
    id: "cod",
    label: "Thanh toán khi nhận hàng (COD)",
    icon: "https://cdn-icons-png.flaticon.com/512/1041/1041872.png",
  });

  // Lấy thông tin sản phẩm và shipping từ cookie
  useEffect(() => {
    if (selectedProducts?.length) setProducts(selectedProducts);
    const saved = Cookies.get("shippingInfo");
    if (saved) {
      try {
        let data = JSON.parse(saved);
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
    (sum, p) => sum + p.variant.price * p.quantity,
    0
  );
  const shippingFee = 0;
  const finalTotal = totalPrice + shippingFee;

  // 🧾 Xử lý đặt hàng COD
  const handleSubmit = async () => {
    const saved = Cookies.get("shippingInfo");
    if (!saved) {
      alert("⚠️ Vui lòng nhập thông tin giao hàng trước khi đặt hàng!");
      return;
    }

    try {

      shippingInfo.items = selectedProducts.map((p) => ({
        variantId: p.variant.variantId,
        quantity: p.quantity,
        prices: p.variant.price
      }));


      const url = shippingInfo.API;

      delete shippingInfo.API;

      const res = await axios.post(url, shippingInfo);
      navigate("/invoice", { state: { order: res.data.order, items: products } });
    } catch (err) {
      console.error("❌ Lỗi gửi đơn hàng:", err);
      alert("Đã xảy ra lỗi khi gửi đơn hàng. Vui lòng thử lại!");
    }
  };

  // 💳 Thanh toán MoMo
  const handleMomoPayment = async () => {
    try {
      const saved = Cookies.get("shippingInfo");

      if (!saved) {
        alert("⚠️ Vui lòng nhập thông tin giao hàng trước khi thanh toán!");
        return;
      }

      const shipping = JSON.parse(saved);
      const orderId = `ORD-${Date.now()}`;

      localStorage.setItem("pendingOrder", JSON.stringify({
        orderId,
        products,
        shippingInfo: shipping,
        method: "momo",
      }));

      const res = await axios.post(`${process.env.REACT_APP_API_URL}/momo/create-payment`, {
        amount: finalTotal,
        orderId,
        items: products.map((p) => ({
          id: p.data.productId,
          name: p.data.productName,
          qty: p.quantity,
          price: p.data.price,
        })),
      });

      if (res.data?.payUrl) window.location.href = res.data.payUrl;
      else alert("❌ Không thể tạo thanh toán MoMo.");
    } catch (error) {
      console.error("Lỗi thanh toán MoMo:", error);
      alert("Đã xảy ra lỗi khi kết nối MoMo.");
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
        icon: "https://upload.wikimedia.org/wikipedia/vi/f/fe/MoMo_Logo.png",
      },
      /* vnpay: {
        id: "vnpay",
        label: "Thanh toán qua VNPay",
        icon: "https://stcd02206177151.cloud.edgevnpay.vn/assets/images/logo-icon/logo-primary.svg",
      }, */
    };
    setOpt(methods[selectedMethod]);
  };

  // 🧱 RENDER
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
              {shippingInfo.address.is_default ? (
                <span className="badge bg-light text-danger border border-danger me-2 d-none d-sm-inline">
                  Mặc định
                </span>
              ) : (
                <></>
              )}
              <a
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
          <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">
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
                <tr key={`${prd.data.productId}-${prd.variant?.variantId ?? 'base'}`}>
                  <td className="d-flex align-items-start align-items-md-center gap-2">
                    <img
                      onError={(e) => (e.currentTarget.src = PLACEHOLDER_IMG)}
                      src={prd.variant?.imageUrl || PLACEHOLDER_IMG}
                      alt="Sản phẩm"
                      width={80}
                      height={80}
                      className="rounded me-0 me-md-2 object-cover"
                    />

                  </td>
                  <td>
                    <div className="d-flex align-items-start gap-3">

                      <div className="d-flex flex-column justify-content-between flex-grow-1">
                        <div
                          className="fw-semibold"
                          title={prd.data.productName}

                        >
                          {prd.data.productName}
                        </div>
                        {prd.variant && (
                          <div className="text-muted small mt-1">
                            {prd.variant.variantName
                              ? `Phiên bản: ${prd.variant.variantName}`
                              : prd.variant.attributes?.color
                                ? `Màu: ${prd.variant.attributes.color}`
                                : ""}
                          </div>
                        )}
                        <div className="d-sm-none mt-2">
                          <span className="fw-bold text-danger small">
                            {Number(prd.variant?.price || prd.data.price).toLocaleString()} ₫
                          </span>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="text-center d-none d-md-table-cell">
                    {Number(prd.variant?.price).toLocaleString()} ₫
                  </td>
                  <td className="text-center">{prd.quantity}</td>
                  <td className="text-center text-danger fw-bold">
                    {(prd.variant?.price * prd.quantity).toLocaleString()} ₫
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

      {/* ========== Tổng kết + Thanh toán ========== */}
      <div className="container bg-white rounded-3 shadow-sm my-3 p-3">
        <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-3">
          <h6 className="fw-bold mb-0">Phương thức thanh toán</h6>
          <div className="d-flex align-items-center flex-wrap gap-2">
            <img src={opt.icon} alt={opt.label} width={36} height={36} className="me-0 me-sm-2" />
            <span className="fw-semibold me-2">{opt.label}</span>
            <a
              href="#"
              className="text-primary fw-bold"
              onClick={() => setShowModalPayment(true)}
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
            className="btn btn-danger px-4 w-100 w-sm-auto"
            onClick={method === "momo" ? handleMomoPayment : handleSubmit}
          >
            Đặt hàng
          </button>
        </div>
      </div>
    </div>
  );
}
