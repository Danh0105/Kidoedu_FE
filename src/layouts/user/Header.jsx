import React, { useState, useEffect, useContext } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import logo from "../../assets/user/Logo.png";
import '../../assets/user/header.css';
import Menu from '../../components/user/Menu';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import Cookies from 'js-cookie';
import { CartContext } from '../../hooks/CartContext';

export default function Header() {
    const navigate = useNavigate();
    const [scrolled, setScrolled] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('Authorization'));
    const { CartCT, addToCartContext, cartCount, setCartCount } = useContext(CartContext);

    const fetchCountCart = async () => {
        try {
            const token = localStorage.getItem("Authorization");
            if (!token || typeof token !== "string" || token.trim() === "") {
                const guestCart = JSON.parse(Cookies.get('guest_cart') || '[]');
                guestCart.forEach(item => addToCartContext(item));
                return;
            }
            let decoded;
            try {
                decoded = jwtDecode(token);
            } catch (err) {
                console.error("Token không hợp lệ:", err);
                return;
            }

            const resCart = await axios.get(`https://kidoedu.vn/cart/${decoded.sub}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const cart = resCart.data;
            setCartCount(cart.items.length || 0);
        } catch (err) {
            console.error("Lỗi khi lấy giỏ hàng:", err);
        }
    };

    const logout = () => {
        setCartCount(CartCT.length);
        localStorage.removeItem('Authorization');
        localStorage.removeItem('role');
        setIsLoggedIn(false);
        navigate("/login");
    };

    useEffect(() => {
        fetchCountCart();

        const handleScroll = () => setScrolled(window.scrollY > 80);
        window.addEventListener("scroll", handleScroll);

        // Theo dõi thay đổi token (đúng key)
        const handleStorage = (e) => {
            if (!e || e.key === 'Authorization') {
                setIsLoggedIn(!!localStorage.getItem('Authorization'));
            }
        };
        window.addEventListener("storage", handleStorage);

        return () => {
            window.removeEventListener("scroll", handleScroll);
            window.removeEventListener("storage", handleStorage);
        };
    }, []);

    useEffect(() => {
        console.log("guestCart", CartCT);
    }, [CartCT]);

    return (
        <>
            <div className={`sticky-lg-top ${scrolled ? 'bg-success-subtle shadow-sm' : 'bg-white'}`}>
                <header className="container d-flex justify-content-between align-items-center py-0 gap-3 pt-2 mb-2">
                    {/* Left: Logo + Menu */}
                    <div className="navbar-nav d-flex flex-row gap-3 justify-content-between align-items-center w-100 w-lg-auto">
                        <Link to="/" className="d-inline-block">
                            <img
                                src={logo}
                                alt="Logo công ty Gentech"
                                className="img-fluid"
                                style={{ width: 'clamp(72px, 10vw, 90px)', height: 'auto' }}
                            />
                        </Link>

                        {/* Nav (giữ nguyên cấu trúc) */}
                        <nav
                            className={`navbar navbar-expand-lg sticky-lg-top ${scrolled ? 'bg-success-subtle' : 'bg-white'} flex-grow-1`}
                            aria-label="Eleventh navbar example"
                        >
                            <div className="container-fluid px-0">
                                {/* giữ nguyên collapse (không thêm toggler để không đổi cấu trúc) */}
                                <div className="collapse navbar-collapse show" id="navbarsExample09">
                                    <ul className="navbar-nav me-auto mb-2 mb-lg-0 p-2 header-menu-scroll">
                                        <Menu />
                                    </ul>
                                </div>
                            </div>
                        </nav>
                    </div>

                    {/* Right: Icons */}
                    <div className="navbar-nav d-flex flex-row gap-3 ms-lg-3">
                        <NavLink to="/cart" className="d-inline-block position-relative" aria-label="Giỏ hàng">
                            <i className="bi bi-cart3"
                                style={{ fontSize: 'clamp(1.4rem, 3.2vw, 1.75rem)' }} />
                            <span
                                className="position-absolute top-0 start-100 translate-middle badge rounded-circle text-danger border d-flex align-items-center justify-content-center bg-white"
                                style={{
                                    width: 'clamp(16px, 3.2vw, 20px)',
                                    height: 'clamp(16px, 3.2vw, 20px)',
                                    fontSize: 'clamp(10px, 2.2vw, 12px)',
                                }}
                            >
                                {cartCount || CartCT.length}
                            </span>
                        </NavLink>

                        {isLoggedIn ? (
                            <a href="#" className="link-success p-0" aria-label="Đơn hàng">
                                <div className="position-relative d-inline-block">
                                    <i className="bi bi-receipt link-warning"
                                        style={{ fontSize: 'clamp(1.4rem, 3.2vw, 1.75rem)' }} />
                                    <span
                                        className="position-absolute top-0 start-100 translate-middle badge rounded-circle text-danger border d-flex align-items-center justify-content-center bg-white"
                                        style={{
                                            width: 'clamp(16px, 3.2vw, 20px)',
                                            height: 'clamp(16px, 3.2vw, 20px)',
                                            fontSize: 'clamp(10px, 2.2vw, 12px)',
                                        }}
                                    >
                                        0
                                    </span>
                                </div>
                            </a>
                        ) : null}

                        {isLoggedIn ? (
                            <a href="#" className="link-success p-0" aria-label="Thông báo">
                                <div className="position-relative d-inline-block">
                                    <i className="bi bi-bell-fill link-info"
                                        style={{ fontSize: 'clamp(1.4rem, 3.2vw, 1.75rem)' }} />
                                    <span
                                        className="position-absolute top-0 start-100 translate-middle badge rounded-circle text-danger border d-flex align-items-center justify-content-center bg-white"
                                        style={{
                                            width: 'clamp(16px, 3.2vw, 20px)',
                                            height: 'clamp(16px, 3.2vw, 20px)',
                                            fontSize: 'clamp(10px, 2.2vw, 12px)',
                                        }}
                                    >
                                        0
                                    </span>
                                </div>
                            </a>
                        ) : null}

                        {isLoggedIn ? (
                            <div className="navbar-nav d-flex flex-row">
                                <div className="btn-group">
                                    <a
                                        href="#"
                                        className="link-success dropdown-toggle p-0"
                                        data-bs-toggle="dropdown"
                                        role="button"
                                        aria-expanded="false"
                                        aria-label="Tài khoản"
                                    >
                                        <i className="bi bi-person-circle"
                                            style={{ fontSize: 'clamp(1.4rem, 3.2vw, 1.75rem)' }} />
                                    </a>

                                    <ul className="dropdown-menu dropdown-menu-lg dropdown-menu-end">
                                        <li className="d-flex justify-content-center p-2" style={{ width: 300, height: 200 }}>
                                            <img src={logo} className="rounded-circle shadow" width={200} alt="User" />
                                        </li>
                                        <li className="user-header text-bg-primary p-2">
                                            <p>Admin <small> Member since Nov. 2023</small></p>
                                        </li>

                                        <li className="user-footer">
                                            <div className="d-flex justify-content-between">
                                                <a href="#" className="btn btn-default btn-flat">Profile</a>
                                                <NavLink
                                                    className="btn btn-default btn-flat"
                                                    to="/login"
                                                    type="button"
                                                    onClick={logout}
                                                >
                                                    Đăng xuất
                                                </NavLink>
                                            </div>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        ) : (
                            <NavLink to="/login" type="button" aria-label="Đăng nhập">
                                <i className="bi bi-person-circle link-warning"
                                    style={{ fontSize: 'clamp(1.4rem, 3.2vw, 1.75rem)' }} />
                            </NavLink>
                        )}
                    </div>
                </header>
            </div>
        </>
    );
}
