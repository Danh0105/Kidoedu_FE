import React, { useState } from 'react';
import MenuItem from '../../components/admin/MenuItem';
import { Link, NavLink } from 'react-router-dom';

const SidebarMenu = () => {
    const [openIndex, setOpenIndex] = useState(null);

    const handleToggle = (index) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <ul className="nav sidebar-menu flex-column" role="navigation" id="navigation">
            <MenuItem
                to="/dashboard"
                icon="nav-icon bi bi-speedometer"
                label="Dashboard"
                isOpen={openIndex === 0}
                onClick={() => handleToggle(0)}
            />
            <MenuItem
                to="/products"
                icon="nav-icon bi  bi-boxes"
                label="Quản lý sản phẩm"
                isOpen={openIndex === 1}
                onClick={() => handleToggle(1)}
            />

            <MenuItem
                to="/orders"
                icon="nav-icon bi bi-receipt-cutoff"
                label="Quản lý đơn hàng"
                isOpen={openIndex === 2}
                onClick={() => handleToggle(2)}
            />
            <MenuItem
                to="/inventory"
                icon="nav-icon bi bi-box-seam"
                label="Quản lý kho"
                isOpen={openIndex === 3}
                onClick={() => handleToggle(3)}
            />

            <MenuItem
                to="/banners"
                icon="nav-icon bi bi-images"
                label="Quản lý banner"
                isOpen={openIndex === 4}
                onClick={() => handleToggle(4)}
            />
            <MenuItem
                to="/chatbotscripts"
                icon="nav-icon bi bi-robot"
                label="Kịch bản Chatbot"
                isOpen={openIndex === 10}
                onClick={() => handleToggle(10)}
            />

            <MenuItem
                to="/users"
                icon="bi-palette"
                label="Quản lý người dùng"
                isOpen={openIndex === 5}
                onClick={() => handleToggle(5)}
            />
            <MenuItem
                to="/coupons"
                icon="nav-icon bi bi-ticket-perforated-fill"
                label="Quản lý phiếu giảm giá"
                isOpen={openIndex === 6}
                onClick={() => handleToggle(6)}
            />
            <MenuItem
                to="/reports"
                icon="nav-icon bi bi-bar-chart-fill"
                label="Thống kê & báo cáo"
                isOpen={openIndex === 7}
                onClick={() => handleToggle(7)}
            />
            <MenuItem

                icon="nav-icon bi bi-truck"
                label="Thanh toán & vận chuyển"
                isOpen={openIndex === 8}
                onClick={() => handleToggle(8)}
            >
                <li className="nav-item">
                    <NavLink
                        to="/payments"
                        className="nav-link mx-2"
                        activeClassName="active"
                    >
                        <div className='break-word whitespace-normal'>Phương thức thanh toán</div>
                    </NavLink>
                </li>
                <li className="nav-item">
                    <NavLink
                        to="/shipping"
                        className="nav-link mx-2"
                        activeClassName="active"
                    >
                        <div style={{ whiteSpace: "normal" }}>Phí vận chuyển, khu vực hỗ trợ</div>
                    </NavLink>
                </li>
            </MenuItem>
            <MenuItem
                to="/settings"
                icon="nav-icon bi bi-gear-fill"
                label="Quản trị hệ thống"
                isOpen={openIndex === 9}
                onClick={() => handleToggle(9)}
            />

        </ul>
    );
};

export default SidebarMenu;
