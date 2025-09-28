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
                <NavLink className={({ isActive }) => `nav-link-menu ${isActive ? "active" : "nav-link-menu px-2 "}`} to="/lesson">Khóa học</NavLink>
            </li>
            <li className="nav-item">
                <NavLink className={({ isActive }) => `nav-link-menu ${isActive ? "active" : " nav-link-menu px-2 "}`} to="/about">About </NavLink>
            </li>
        </>

    )
}
