import { useState } from "react";
import logoMomo from "../../assets/user/logo2.svg";

export default function ModalPayment({ show, onClose, onConfirm }) {
  const [paymentMethod, setPaymentMethod] = useState("cod");

  if (!show) return null;

  const handleConfirm = () => {
    onConfirm(paymentMethod);
    onClose();
  };

  const options = [
    {
      id: "cod",
      label: "Thanh toán khi nhận hàng (COD)",
      icon: "https://cdn-icons-png.flaticon.com/512/1041/1041872.png",
    },
    {
      id: "momo",
      label: "Thanh toán qua MoMo",
      icon: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQZcQPC-zWVyFOu9J2OGl0j2D220D49D0Z7BQ&s",
    },
    {
      id: "vnpay",
      label: "Thanh toán qua VNPay",
      icon: "https://stcd02206177151.cloud.edgevnpay.vn/assets/images/logo-icon/logo-primary.svg",
    },
    {
      id: "bank",
      label: "Thanh toán qua VietQR",
      icon: "https://play-lh.googleusercontent.com/22cJzF0otG-EmmQgILMRTWFPnx0wTCSDY9aFaAmOhHs30oNHxi63KcGwUwmbR76Msko",
    },
  ];

  return (
    <div
      className="modal d-block"
      tabIndex="-1"
      role="dialog"
      style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
      onClick={onClose}
    >
      <div
        className="modal-dialog modal-md"
        role="document"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-content rounded-3 shadow">
          <div className="modal-header">
            <h5 className="modal-title fw-bold">Chọn phương thức thanh toán</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>

          <div className="modal-body">
            <div className="row g-3">
              {options.map((opt) => (
                <div className="col-12" key={opt.id}>
                  <div
                    className={`card p-2 d-flex flex-row align-items-center cursor-pointer ${paymentMethod === opt.id
                      ? "border-primary shadow-sm"
                      : "border-light"
                      }`}
                    style={{ cursor: "pointer" }}
                    onClick={() => setPaymentMethod(opt.id)}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value={opt.id}
                      checked={paymentMethod === opt.id}
                      onChange={() => setPaymentMethod(opt.id)}
                      className="d-none"
                    />
                    <img
                      src={opt.icon}
                      alt={opt.label}
                      style={{ width: "36px", height: "36px", marginRight: "12px" }}
                    />
                    <span className="fw-semibold">{opt.label}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Hủy
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleConfirm}
            >
              Xác nhận
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
