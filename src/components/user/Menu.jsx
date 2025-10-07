import React from "react";
import { NavLink } from "react-router-dom";

const makeClass = (isActive) =>
    `nav-link-menu px-2${isActive ? " active" : ""}`;

export default function Menu() {
    return (
        <div className="dropdown position-relative">
            {/* Nút icon (ở giữa) */}
            <button
                className="btn btn-light rounded-circle shadow-sm menu-icon"
                type="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
                aria-label="Menu"
            >
                <i className="bi bi-list fs-4"></i>
            </button>

            {/* Dropdown căn giữa bên dưới icon */}
            <ul className="dropdown-menu dropdown-menu-center shadow">
                <li>
                    <NavLink to="/" className="dropdown-item">
                        Trang chủ
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/store" className="dropdown-item">
                        Cửa hàng
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/quotation" className="dropdown-item">
                        Báo giá
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/newproduct" className="dropdown-item">
                        Sản phẩm mới
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/featuredproducts" className="dropdown-item">
                        Sản phẩm nổi bật
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/about" className="dropdown-item">
                        About
                    </NavLink>
                </li>
            </ul>
        </div>
    );
}
