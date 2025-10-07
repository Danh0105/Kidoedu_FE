import React from "react";
import { NavLink } from "react-router-dom";

/** Nút menu icon (mobile) + dropdown căn giữa */
export default function MenuCompact() {
  return (
    <div className="dropdown position-relative">
      <button
        className="btn btn-light rounded-circle shadow-sm menu-icon"
        type="button"
        data-bs-toggle="dropdown"
        aria-expanded="false"
        aria-label="Menu"
      >
        <i className="bi bi-list fs-4"></i>
      </button>

      <ul className="dropdown-menu dropdown-menu-center shadow">
        <li><NavLink to="/" className="dropdown-item">Trang chủ</NavLink></li>
        <li><NavLink to="/store" className="dropdown-item">Cửa hàng</NavLink></li>
        <li><NavLink to="/quotation" className="dropdown-item">Báo giá</NavLink></li>
        <li><NavLink to="/newproduct" className="dropdown-item">Sản phẩm mới</NavLink></li>
        <li><NavLink to="/featuredproducts" className="dropdown-item">Sản phẩm nổi bật</NavLink></li>
        <li><NavLink to="/about" className="dropdown-item">About</NavLink></li>
      </ul>
    </div>
  );
}
