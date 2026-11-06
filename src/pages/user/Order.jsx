import React from 'react'

export default function Order() {
  return (
    <div className="container my-4">
      <div className="row">
        {/* Sidebar bên trái */}
        <div className="col-md-3 border-end">
          <div className="text-center mb-3">
            <img
              src="https://via.placeholder.com/80"
              alt="avatar"
              className="rounded-circle mb-2"
            />
            <div className="fw-bold">xyekc8608j</div>
            <a href="#" className="text-primary small">
              Sửa Hồ Sơ
            </a>
          </div>
          <ul className="list-unstyled">
            <li className="mb-2">
              <i className="bi bi-person me-2"></i> Tài Khoản Của Tôi
            </li>
            <li className="mb-2 fw-bold text-danger">
              <i className="bi bi-bag me-2"></i> Đơn Mua
            </li>
            <li className="mb-2">
              <i className="bi bi-ticket-perforated me-2"></i> Kho Voucher
            </li>
          </ul>
        </div>

        {/* Nội dung đơn hàng */}
        <div className="col-md-9">
          {/* Tabs */}
          <ul className="nav nav-tabs mb-3">
            <li className="nav-item">
              <a className="nav-link active" href="#">
                Tất cả
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#">
                Chờ xác nhận
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#">
                Vận chuyển
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#">
                Chờ giao hàng
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#">
                Hoàn thành
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#">
                Đã hủy
              </a>
            </li>
          </ul>

          {/* Ô tìm kiếm */}
          <div className="mb-3">
            <input
              type="text"
              className="form-control"
              placeholder="Bạn có thể tìm kiếm theo tên Shop, ID đơn hàng hoặc Tên Sản phẩm"
            />
          </div>

          {/* Đơn hàng */}
          <div className="border mb-3 bg-white">
            <div className="d-flex justify-content-between p-3 border-bottom">
              <span className="fw-bold">
                <i className="bi bi-shop me-2"></i> The Keyboard House
              </span>
              <span className="text-danger fw-bold">ĐÃ HỦY</span>
            </div>
            <div className="d-flex p-3">
              <img
                src="https://via.placeholder.com/100"
                alt="product"
                className="me-3 border"
              />
              <div>
                <div className="fw-bold">
                  (Sẵn hàng) Bàn phím cơ Fullsize Skyloong Gk104, Gk87 pro tích hợp màn hình
                </div>
                <div className="text-muted small">
                  Phân loại hàng: Dark night, Build Silent im lặng
                </div>
                <div className="mt-2">
                  <span className="text-decoration-line-through text-muted me-2">
                    2.950.000₫
                  </span>
                  <span className="text-danger fw-bold">2.750.000₫</span>
                </div>
              </div>
            </div>
            <div className="d-flex justify-content-end p-3 border-top">
              <div>
                <span className="me-2">Thành tiền:</span>
                <span className="text-danger fw-bold fs-5">3.003.699₫</span>
              </div>
            </div>
            <div className="d-flex justify-content-end p-3 border-top">
              <button className="btn btn-danger me-2">Mua Lại</button>
              <button className="btn btn-outline-secondary me-2">
                Xem Chi Tiết Hủy Đơn
              </button>
              <button className="btn btn-outline-secondary">Liên Hệ Người Bán</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
