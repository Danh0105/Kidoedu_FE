import React, { useState } from 'react';
import MenuItem from '../../components/admin/MenuItem';
import { Link, NavLink } from 'react-router-dom';
import { hasPermission } from "../../utils/permission";

const SidebarMenu = () => {
    const [openIndex, setOpenIndex] = useState(null);

    const handleToggle = (index) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <ul className="nav sidebar-menu flex-column" role="navigation" id="sidebar-navigation">


            {/* Dashboard – ai login cũng thấy */}
            <MenuItem
                to="/admin/dashboard"
                icon="nav-icon bi bi-speedometer"
                label="Dashboard"
                isOpen={openIndex === 0}
                onClick={() => handleToggle(0)}
            />

            {/* Quản lý sản phẩm */}
            {hasPermission([
                "product.read",
            ]) && (
                    <MenuItem
                        to="/admin/products"
                        icon="nav-icon bi  bi-boxes"
                        label="Quản lý sản phẩm"
                        isOpen={openIndex === 1}
                        onClick={() => handleToggle(1)}
                    />
                )}

            {/* Quản lý đơn hàng */}
            {hasPermission([
                "order.read",
            ]) && (
                    <MenuItem
                        to="/admin/orders"
                        icon="nav-icon bi bi-receipt-cutoff"
                        label="Quản lý đơn hàng"
                        isOpen={openIndex === 2}
                        onClick={() => handleToggle(2)}
                    />
                )}

            {/* Quản lý kho */}
            {hasPermission(["inventory.read"]) && (
                <MenuItem
                    to="/admin/inventory"
                    icon="nav-icon bi bi-box-seam"
                    label="Quản lý kho"
                    isOpen={openIndex === 3}
                    onClick={() => handleToggle(3)}
                />
            )}

            {/* Banner */}
            {hasPermission(["banner.read"]) && (
                <MenuItem
                    to="/admin/banners"
                    icon="nav-icon bi bi-images"
                    label="Quản lý banner"
                    isOpen={openIndex === 4}
                    onClick={() => handleToggle(4)}
                />
            )}

            {/* Chatbot */}
            {hasPermission(["chatbot.create"]) && (
                <MenuItem
                    to="/admin/chatbotscripts"
                    icon="nav-icon bi bi-robot"
                    label="Kịch bản Chatbot"
                    isOpen={openIndex === 10}
                    onClick={() => handleToggle(10)}
                />
            )}

            {/* Người dùng */}
            {hasPermission([
                "user.read",

            ]) && (
                    <MenuItem
                        to="/admin/users"
                        icon="bi-palette"
                        label="Quản lý người dùng"
                        isOpen={openIndex === 5}
                        onClick={() => handleToggle(5)}
                    />
                )}

            {/* Phiếu giảm giá */}
            {hasPermission(["product.create"]) && (
                <MenuItem
                    to="/admin/coupons"
                    icon="nav-icon bi bi-ticket-perforated-fill"
                    label="Quản lý phiếu giảm giá"
                    isOpen={openIndex === 6}
                    onClick={() => handleToggle(6)}
                />
            )}

            {/* Báo cáo */}
            {hasPermission(["report.read"]) && (
                <MenuItem
                    to="/admin/reports"
                    icon="nav-icon bi bi-bar-chart-fill"
                    label="Thống kê & báo cáo"
                    isOpen={openIndex === 7}
                    onClick={() => handleToggle(7)}
                />
            )}

            {/* Thanh toán & vận chuyển */}
            {hasPermission(["shipping.payment.read"]) && (
                <MenuItem
                    icon="nav-icon bi bi-truck"
                    label="Thanh toán & vận chuyển"
                    isOpen={openIndex === 8}
                    onClick={() => handleToggle(8)}
                >
                    <li className="nav-item">
                        <NavLink to="/admin/payments" className="nav-link mx-2">
                            Phương thức thanh toán
                        </NavLink>
                    </li>
                    <li className="nav-item">
                        <NavLink to="/admin/shipping" className="nav-link mx-2">
                            Phí vận chuyển, khu vực hỗ trợ
                        </NavLink>
                    </li>
                </MenuItem>
            )}

            {/* Quản trị hệ thống */}
            {hasPermission(["system.read"]) && (
                <MenuItem
                    to="/admin/settings"
                    icon="nav-icon bi bi-gear-fill"
                    label="Quản trị hệ thống"
                    isOpen={openIndex === 9}
                    onClick={() => handleToggle(9)}
                />
            )}

        </ul>

    );
};

export default SidebarMenu;
