import axios from 'axios';
import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from "react-router-dom";
import { CartContext } from '../../hooks/CartContext';
import ModalInfo from '../../components/user/ModalInfo';
import Cookies from 'js-cookie';
import ModalPayment from '../../components/user/ModalPayment';

export default function Checkout() {
  const [products, setProducts] = useState([]);
  const [shippingInfo, setShippingInfo] = useState(null);
  const navigate = useNavigate();
  const { selectedProducts } = useContext(CartContext);
  const [showModalPayment, setShowModalPayment] = useState(false);
  const [method, setMethod] = useState("cod");
  const [opt, setOpt] = useState({
    id: "cod",
    label: "Thanh toán khi nhận hàng (COD)",
    icon: "https://cdn-icons-png.flaticon.com/512/1041/1041872.png",
  });
  useEffect(() => {
    if (selectedProducts) {
      setProducts(selectedProducts);
    }
    const saved = Cookies.get("shippingInfo");

    if (saved) {
      try {
        const parsed = JSON.parse(saved);


        setShippingInfo(parsed);
      } catch (err) {
        console.error("Không thể parse shippingInfo từ cookie:", err);
      }
    }
  }, [selectedProducts]);
  const totalPrice = products.reduce(
    (sum, p) => sum + p.data.price * p.quantity,
    0
  );
  const shippingFee = 0;
  const finalTotal = totalPrice;
  const handleSubmit = (e) => {
    const saved = Cookies.get("shippingInfo");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);

        parsed.items = selectedProducts.map((p) => ({
          product_id: p.data.product_id,
          quantity: p.quantity,
          price_per_unit: Number(p.data.price),
        }));
        const url = parsed.API;
        delete parsed.API;
        console.log(parsed)

        axios.post(url, parsed).then((res) => {
          navigate("/invoice", { state: { order: res.data.order, items: products } });
        });
      } catch (err) {
        console.error("Không thể parse shippingInfo từ cookie:", err);
      }

    }
  };
  const selectedMethod = async () => {
    setShowModalPayment(true);
  };
  const handleMomoPayment = async () => {
    try {
      const orderId = `ORD-${Date.now()}`;
      const saved = Cookies.get("shippingInfo");

      if (!saved) return alert("Không tìm thấy thông tin giao hàng.");

      const shipping = JSON.parse(saved);

      // Lưu đơn hàng tạm thời
      localStorage.setItem("pendingOrder", JSON.stringify({
        orderId,
        products,
        shippingInfo: shipping,
        method: "momo",
      }));
      const response = await axios.post("https://kidoedu.vn/momo/create-payment", {
        amount: finalTotal,
        orderId: orderId,
        items: products.map((p) => ({
          id: p.data.product_id,
          name: p.data.product_name,
          qty: p.quantity,
          price: p.data.price,
        })),
      });

      const data = response.data;

      if (data.payUrl) {
        window.location.href = data.payUrl;
      } else {
        alert("Không thể tạo thanh toán MoMo.");
      }
    } catch (error) {
      console.error("Lỗi thanh toán MoMo:", error);
      alert("Đã xảy ra lỗi khi kết nối MoMo.");
    }
  };

  const handleConfirm = (selectedMethod) => {
    setMethod(selectedMethod);
    if (selectedMethod === "cod") {
      setOpt({
        id: "cod",
        label: "Thanh toán khi nhận hàng (COD)",
        icon: "https://cdn-icons-png.flaticon.com/512/1041/1041872.png",
      });
    } else if (selectedMethod === "momo") {
      setOpt({
        id: "momo",
        label: "Thanh toán qua MoMo",
        icon: "https://upload.wikimedia.org/wikipedia/vi/f/fe/MoMo_Logo.png",
      });
    } else if (selectedMethod === "vnpay") {
      setOpt({
        id: "vnpay",
        label: "Thanh toán qua VNPay",
        icon: "https://stcd02206177151.cloud.edgevnpay.vn/assets/images/logo-icon/logo-primary.svg",
      });
    }
  };
  return (
    <div>
      <div className="container my-3 bg-white custom-border-top">
        <div className="p-3">
          <div className="mb-2">
            <i className="bi bi-geo-alt-fill text-danger me-2"></i>
            <span className="fw-bold text-danger">Địa Chỉ Nhận Hàng</span>
          </div>

          {shippingInfo ? (
            <div className="d-flex flex-wrap align-items-center justify-content-between">
              <div className="d-flex flex-wrap align-items-center">
                <div className='d-flex flex-column'>
                  {shippingInfo.address.full_name ? (
                    <div className='d-flex justify-content-start align-items-center mb-2'>
                      <span className="fw-bold me-2">{shippingInfo.address?.full_name}</span>
                      <span className="me-3">(+84) {shippingInfo.address?.phone_number}</span>
                      <span>{shippingInfo.address?.city} </span>
                      <span className='ms-2'>{shippingInfo.address?.district} </span>
                      <span className='ms-2'>{shippingInfo.address?.ward} </span>
                      <span className='ms-2'>{shippingInfo.address?.street}</span>
                    </div>
                  ) : (<></>
                  )}

                  {
                    shippingInfo.companyName ? (
                      <div className='d-flex justify-content-start align-items-center'>
                        <span className='fw-bold'>Tên công ty:  </span>
                        <span className='ms-2'>{shippingInfo?.companyName} </span>
                        <span className='fw-bold ms-2'>Email nhận hóa đơn:  </span>
                        <span className='ms-2'>{shippingInfo?.businessEmail} </span>
                        <span className='fw-bold ms-2'>Mã số thuế:  </span>
                        <span className='ms-2'>{shippingInfo?.taxId}</span>
                      </div>
                    ) : (
                      <></>
                    )
                  }
                </div>
              </div>
              <div className="d-flex align-items-center">
                <span className="badge bg-light text-danger border border-danger me-3">
                  Mặc Định
                </span>
                <a className="link-primary text-decoration-none" data-bs-toggle="modal" data-bs-target="#staticBackdrop">
                  Thay đổi
                </a>
                <ModalInfo onUpdate={(newData) => setShippingInfo(newData)} />
              </div>
            </div>
          ) : (
            <div className='d-flex flex-wrap align-items-center justify-content-between'>
              <div>Chưa có địa chỉ nhận hàng</div>
              <a className="link-primary text-decoration-none" data-bs-toggle="modal" data-bs-target="#staticBackdrop">
                Thay đổi
              </a>
              <ModalInfo onUpdate={(newData) => setShippingInfo(newData)} />
            </div>

          )}
        </div>
      </div>

      <div className="container bg-white" style={{ marginBottom: "1px" }}>
        <table className="table table-borderless">
          <thead>
            <tr>
              <th scope="col" className="align-middle">Sản phẩm</th>
              <th scope="col" className="align-middle text-center">Đơn giá</th>
              <th scope="col" className="align-middle text-center">Số lượng</th>
              <th scope="col" className="align-middle text-center">Thành tiền</th>
            </tr>
          </thead>
          <tbody>
            {products.length > 0 ? (
              products.map((prd) => (
                <tr key={prd.data.product_id}>
                  <td className="d-flex flex-row align-items-center">
                    <img src={prd.data.images[0].image_url} alt="Sản phẩm" width={100} height={100} />
                    <div className="d-flex flex-column bd-highlight">
                      <a
                        style={{
                          textDecoration: "none",
                          width: "208px",
                          fontSize: "14px",
                          color: "rgba(0,0,0,.87)",
                          lineHeight: "16px",
                        }}
                        href="/"
                        title={prd.data.product_name}
                        className="link-dark p-2 bd-highlight fw-bold"
                      >
                        {prd.data.product_name}
                      </a>
                    </div>
                  </td>
                  <td className="align-middle text-center">
                    <p className="mb-0">{Number(prd.data.price).toLocaleString()} ₫</p>
                  </td>
                  <td className="align-middle text-center">
                    {prd.quantity}
                  </td>
                  <td className="align-middle text-center" style={{ color: '#ee4d2d', width: "145px" }}>
                    <p className="mb-0">{Number(prd.data.price * prd.quantity).toLocaleString()} ₫</p>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center">
                  Đơn hàng trống
                </td>
              </tr>
            )}
          </tbody>
        </table>

        <hr />

        <div className="border bg-white d-flex justify-content-between" style={{ borderRadius: "0 0 8px 8px" }}>
          <div className="d-flex justify-content-between align-items-center p-3 border-bottom" style={{ width: "100%" }}>
            <div className="d-flex align-items-center" style={{ width: "480px" }}>
              <label className="me-2 fw-bold text-muted" style={{ width: "20%" }}>
                Lời nhắn:
              </label>
              <input
                type="text"
                className="form-control"
                placeholder="Lưu ý cho Người bán..."
              />
            </div>
          </div>

          <div>
            <div className="p-3 border-bottom">
              <div className="d-flex justify-content-between align-items-start">
                <div>
                  <span className="fw-bold me-2">Phương thức vận chuyển:</span>
                  <span className="text-dark">Chưa phát triển</span>

                  {/*  <p className="text-muted small mb-0">Đảm bảo nhận hàng từ 4 Tháng 10 - 8 Tháng 10</p>
                  <p className="text-muted small mb-0">
                    Nhận Voucher trị giá 15.000₫ nếu đơn hàng được giao đến bạn sau ngày 8 Tháng 10 2025.
                  </p> */}
                </div>
                {/*                 <div className="fw-bold">{shippingFee.toLocaleString()}₫</div>
 */}              </div>
            </div>

            <div className="p-3 border-bottom">
              <span className="fw-bold">Được đồng kiểm</span>
              <i className="bi bi-question-circle ms-1 text-muted"></i>
            </div>
          </div>
        </div>

        <div className="p-3 d-flex justify-content-end">
          <div>
            <span className="me-2">Tổng số tiền ({products.length} sản phẩm):</span>
            <span className="fw-bold text-danger fs-5">{totalPrice.toLocaleString()}₫</span>
          </div>
        </div>
      </div>

      <div className="container p-0 mt-2">
        <div className="bg-white">
          <div className="d-flex justify-content-between align-items-center p-3 border-bottom">
            <h6 className="mb-0 fw-bold">Phương thức thanh toán</h6>
            <div className="d-flex justify-content-between align-items-center">
              <div className="col-14 d-flex justify-content-between align-items-center" key={opt.id}>
                <div className="d-flex align-items-center">
                  <img
                    src={opt.icon}
                    alt={opt.label}
                    width={36}
                    height={36}
                    className="me-3"
                  />
                  <span className="fw-semibold">{opt.label}</span>
                </div>
                <a
                  href="#"
                  onClick={selectedMethod}
                  className="text-primary fw-bold text-decoration-none ms-2"
                >
                  THAY ĐỔI
                </a>
              </div>
              <ModalPayment
                show={showModalPayment}
                onClose={() => setShowModalPayment(false)}
                onConfirm={handleConfirm}
              />
            </div>
          </div>

          <div className="p-3 border-bottom">
            <div className="d-flex justify-content-between mb-2">
              <span className="text-muted">Tổng tiền hàng</span>
              <span>{totalPrice.toLocaleString()}₫</span>
            </div>
            <div className="d-flex justify-content-between mb-2">
              <span className="text-muted">Tổng tiền phí vận chuyển</span>
              <span>{shippingFee.toLocaleString()}₫</span>
            </div>
            <div className="d-flex justify-content-between">
              <span className="fw-bold">Tổng thanh toán</span>
              <span className="fw-bold text-danger fs-4">{finalTotal.toLocaleString()}₫</span>
            </div>
          </div>

          <div className="d-flex justify-content-between align-items-center p-3">
            <small className="text-muted">
              Nhấn <strong>"Đặt hàng"</strong> đồng nghĩa với việc bạn đồng ý tuân theo{" "}
              <a href="#" className="text-primary">Điều khoản</a>
            </small>
            <button className="btn btn-danger px-4" onClick={method === "momo" ? handleMomoPayment : handleSubmit}>Đặt hàng</button>
          </div>
        </div>
      </div>
    </div>
  );
}
