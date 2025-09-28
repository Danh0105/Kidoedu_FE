import React, { useRef } from "react";
import { useLocation } from "react-router-dom";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export default function Invoice() {
  const location = useLocation();
  const { order, items = [] } = location.state || {};
  const invoiceRef = useRef(null);

  const handleDownloadPDF = () => {
    const input = invoiceRef.current;
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
          {/* Action Buttons */}
          <div className=" text-end">
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

          {order ? (
            <>
              {/* Order Info */}
              <div className="mb-4">
                <h5 className="fw-bold">Thông tin đơn hàng</h5>
                <p><strong>Mã đơn hàng:</strong> {order.order_id}</p>
                <p><strong>Khách hàng:</strong> {order.user?.username || "Khách vãng lai"}</p>
                <p><strong>Ngày:</strong> {new Date().toLocaleDateString()}</p>
              </div>

              {/* Items Table */}
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
                    {items.map((item, index) => {
                      const price = Number(item.data.price) || 0;
                      const total = price * item.quantity;
                      return (
                        <tr key={index}>
                          <td className="text-center">{index + 1}</td>
                          <td>{item.data.product_name || `SP-${item.data.product_id}`}</td>
                          <td className="text-center">{item.quantity}</td>
                          <td className="text-end">{price.toLocaleString()} ₫</td>
                          <td className="text-end">{total.toLocaleString()} ₫</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Total */}
              <div className="text-end mb-3">
                <p><strong>Tạm tính:</strong> {Number(order.subtotal).toLocaleString()} ₫</p>
                <p><strong>Phí vận chuyển:</strong> 38,000 ₫</p>
                <h5 className="fw-bold text-danger">
                  Tổng cộng: {Number(order.total_amount).toLocaleString()} ₫
                </h5>
              </div>
            </>
          ) : (
            <p className="text-danger">Không tìm thấy dữ liệu đơn hàng.</p>
          )}
        </div>


      </div>
    </div>
  );
}
