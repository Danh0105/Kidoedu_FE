import React from "react";
import { NavLink } from "react-router-dom";
import {
    Home,
    Store,
    FileText,
    PackagePlus,
    Star,
    Info
} from "lucide-react";
import "../../components/user/css/Menu.css";

export default function Menu() {
    const getClass = (isActive) =>
        `menu-link ${isActive ? "active" : ""}`;

    return (
        <ul className="menu-container">
            <li>
                <NavLink to="/" className={({ isActive }) => getClass(isActive)} style={{ textDecoration: "none" }}>
                    <Home size={18} /> Trang chủ
                </NavLink>
            </li>

            <li>
                <NavLink to="/store" className={({ isActive }) => getClass(isActive)} style={{ textDecoration: "none" }}>
                    <Store size={18} /> Cửa hàng
                </NavLink>
            </li>

            <li>
                <NavLink to="/quotation" className={({ isActive }) => getClass(isActive)} style={{ textDecoration: "none" }}>
                    <FileText size={18} /> Báo giá
                </NavLink>
            </li>

            <li>
                <NavLink to="/newproduct" className={({ isActive }) => getClass(isActive)} style={{ textDecoration: "none" }}>
                    <PackagePlus size={18} /> Sản phẩm mới
                </NavLink>
            </li>

            <li>
                <NavLink to="/featuredproducts" className={({ isActive }) => getClass(isActive)} style={{ textDecoration: "none" }}>
                    <Star size={18} /> Nổi bật
                </NavLink>
            </li>

            <li>
                <NavLink to="/about" className={({ isActive }) => getClass(isActive)} style={{ textDecoration: "none" }}>
                    <Info size={18} /> Giới thiệu
                </NavLink>
            </li>
        </ul>
    );
}
