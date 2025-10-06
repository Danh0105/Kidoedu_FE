import React from 'react'
import { NavLink } from 'react-router-dom'

export default function Menu() {
    return (
        <>
            <li className="nav-item">
                <NavLink to="/" className={({ isActive }) => `nav-link-menu ${isActive ? "active" : "nav-link-menu px-2 "}`}>Trang chủ</NavLink>
            </li>
            <li className="nav-item">
                <NavLink className={({ isActive }) => `nav-link-menu ${isActive ? "active" : "nav-link-menu px-2 "}`} to="/store"> Cửa hàng</NavLink>
            </li>
            <li className="nav-item">
                <NavLink className={({ isActive }) => `nav-link-menu ${isActive ? "active" : "nav-link-menu px-2 "}`} to="/quotation">Báo giá</NavLink>
            </li>
            <li className="nav-item">
                <NavLink className={({ isActive }) => `nav-link-menu ${isActive ? "active" : "nav-link-menu px-2 "}`} to="/newproduct">Sản phẩm mới</NavLink>
            </li>
            <li className="nav-item">
                <NavLink className={({ isActive }) => `nav-link-menu ${isActive ? "active" : "nav-link-menu px-2 "}`} to="/featuredproducts">Sản phẩm nổi bật</NavLink>
            </li>
            <li className="nav-item">
                <NavLink className={({ isActive }) => `nav-link-menu ${isActive ? "active" : "nav-link-menu px-2 "}`} to="/lesson">Khóa học</NavLink>
            </li>
            <li className="nav-item">
                <NavLink className={({ isActive }) => `nav-link-menu ${isActive ? "active" : " nav-link-menu px-2 "}`} to="/about">About </NavLink>
            </li>
        </>

    )
}
