import React, { useRef } from "react";
import { useLocation } from "react-router-dom";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export default function Invoice() {
  const location = useLocation();
  const { order } = location.state || {};
  const invoiceRef = useRef(null);
  console.log("order:", order);

  // 🔢 Tính tổng từ items, không cần order
  const subtotal = order.items.reduce((sum, item) => {
    const price = Number(item.pricing) || 0;
    const qty = Number(item.quantity) || 0;
    return sum + price * qty;
  }, 0);

  const shippingFee = 0; // nếu sau này có phí ship thì sửa ở đây
  const grandTotal = subtotal + shippingFee;

  const handleDownloadPDF = () => {
    const input = invoiceRef.current;
    if (!input) return;

    html2canvas(input, { scale: 2 }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();

      const imgWidth = pageWidth;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      let heightLeft = imgHeight;
      let position = 0;

      // Trang đầu
      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      // Nếu dài hơn 1 trang thì thêm trang
      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save(`invoice-${order?.order_id || "noid"}.pdf`);
    });
  };

  return (
    <div className="container my-4">
      <div className="card shadow">
        <div className="card-body" ref={invoiceRef}>
          {/* Header */}
          <h1 className="text-center mb-4 fw-bold">HÓA ĐƠN BÁN HÀNG</h1>

          {/* Action Buttons (nằm ngoài phần capture cũng được, nhưng để trong cho tiện) */}
          <div className="text-end mb-3">
            <button className="btn btn-primary" onClick={handleDownloadPDF}>
              <i className="bi bi-download me-1"></i> Tải hóa đơn PDF
            </button>
          </div>

          {/* Company Info */}
          <div className="mb-4">
            <h5 className="fw-bold">Thông tin công ty</h5>
            <p><strong>Công ty:</strong> CÔNG TY TNHH KIDO EDU</p>
            <p><strong>Mã số thuế:</strong> 0319127924</p>
            <p><strong>Địa chỉ thuế:</strong> Số 1 Đường Cộng Hòa 3, Phường Phú Thọ Hòa, TP Hồ Chí Minh</p>
            <p><strong>Địa chỉ:</strong> Số 1 Đường Cộng Hòa 3, Phường Phú Thọ Hòa, TP Hồ Chí Minh</p>
            <p><strong>Người đại diện:</strong> TRẦN THỊ NGỌC CẨM</p>
            <p><strong>Ngành nghề:</strong> Đào tạo kỹ năng sống, kỹ năng mềm; Đào tạo tiếng Anh, tin học</p>
          </div>

          {/* Order Info (dùng order nếu có, không có vẫn hiển thị được) */}
          <div className="mb-4">
            <h5 className="fw-bold">Thông tin đơn hàng</h5>
            <p><strong>Mã đơn hàng:</strong> HD{order?.order?.orderId || order?.orderId || "—"}</p>
            <p><strong>Khách hàng:</strong> {order?.user?.username || "Khách vãng lai"}</p>
            <p>
              <strong>Ngày:</strong>{" "}
              {order?.created_at
                ? new Date(order.created_at).toLocaleDateString()
                : new Date().toLocaleDateString()}
            </p>
          </div>

          {/* Items Table */}
          {order ? (
            <>
              <div className="table-responsive mb-4">
                <table className="table table-bordered table-striped align-middle">
                  <thead className="table-light text-center">
                    <tr>
                      <th>#</th>
                      <th>Sản phẩm</th>
                      <th>Số lượng</th>
                      <th>Đơn giá</th>
                      <th>Thành tiền</th>
                    </tr>
                  </thead>
                  <tbody>
                    {order.items.map((item, index) => {
                      const price = Number(item.pricePerUnit);
                      const qty = Number(item.quantity);
                      const total = price * qty;

                      return (
                        <tr key={index}>
                          <td className="text-center">{index + 1}</td>
                          <td>
                            <div className="d-flex flex-column justify-content-between flex-grow-1">
                              <div
                                className="fw-semibold"
                                title={item.variant?.product.productName}
                              >
                                {item.variant?.product.productName || "Sản phẩm"}
                              </div>
                              {item.variant && (
                                <div className="text-muted small mt-1">
                                  {item.variant.variantName
                                    ? `Phiên bản: ${item.variant.variantName}`
                                    : ""}
                                </div>
                              )}
                              <div className="d-sm-none mt-2">
                                <span className="fw-bold text-danger small">
                                  {price.toLocaleString()} ₫
                                </span>
                              </div>
                            </div>
                          </td>
                          <td className="text-center">{qty}</td>
                          <td className="text-end">{price.toLocaleString()} ₫</td>
                          <td className="text-end">{total.toLocaleString()} ₫</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Total (tính từ items, không dùng order) */}
              <div className="text-end mb-3">
                {/*   <p>
                  <strong>Tạm tính:</strong> {subtotal.toLocaleString()} ₫
                </p> */}
                {/*  <p>
                  <strong>Phí vận chuyển:</strong> {shippingFee.toLocaleString()} ₫
                </p> */}
                <h5 className="fw-bold text-danger">
                  Tổng cộng: {(order?.order?.subtotal || order?.subtotal).toLocaleString()} ₫
                </h5>
              </div>
            </>
          ) : (
            <p className="text-danger">Không có sản phẩm trong hóa đơn.</p>
          )}
        </div>
      </div>
    </div>
  );
}
