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
        setCartCount(CartCT.length)
        localStorage.removeItem('Authorization');
        localStorage.removeItem('role');
        setIsLoggedIn(false);
        navigate("/login");
    };


    useEffect(() => {
        fetchCountCart();
        const handleScroll = () => {
            setScrolled(window.scrollY > 80);
        };
        window.addEventListener("scroll", handleScroll);

        // Theo dõi thay đổi token
        const handleStorage = () => {
            setIsLoggedIn(!!localStorage.getItem('token'));
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

            <div className={`sticky-lg-top ${scrolled ? 'bg-success-subtle' : 'bg-white'}`}>
                <header className={`container d-flex justify-content-between align-items-center py-0 gap-3 mb-2 pt-2`}>
                    <div className="navbar-nav d-flex flex-row gap-3 justify-content-between align-items-center">
                        <Link to="/">
                            <img src={logo} style={{ width: "90px", height: "auto" }} alt="Logo công ty Gentech" />
                        </Link>
                        <nav className={`sticky-lg-top ${scrolled ? 'bg-success-subtle navbar navbar-expand-lg  sticky-lg-top' : 'bg-white navbar navbar-expand-lg  sticky-lg-top'}`} aria-label="Eleventh navbar example">
                            <div className="container-fluid">
                                <div className="collapse navbar-collapse" id="navbarsExample09">
                                    <ul className="navbar-nav me-auto mb-2 mb-lg-0 p-2">
                                        <Menu />
                                    </ul>
                                </div>
                            </div>
                        </nav>
                    </div>
                    <div className="navbar-nav d-flex flex-row gap-3">
                        {/*       <div className="navbar-nav d-flex flex-row">
                            <i className="bi bi-search fs-3 link-danger"></i>
                        </div> */}
                        <NavLink to="/cart" className="d-inline-block">
                            <div className="position-relative d-inline-block">
                                <div className='navbar-nav'>
                                </div>
                                <i className="bi bi-cart3 fs-3 " style={{ width: 'clamp(28px, 5vw, 40px)', height: 'auto' }}></i>
                                <span
                                    className="position-absolute top-0 start-100 translate-middle badge rounded-circle text-danger border d-flex align-items-center justify-content-center"
                                    style={{
                                        width: 'clamp(16px, 3.2vw, 20px)',
                                        height: 'clamp(16px, 3.2vw, 20px)',
                                        fontSize: 'clamp(10px, 2.2vw, 12px)',
                                        backgroundColor: "white",
                                    }}
                                >
                                    {cartCount || CartCT.length}
                                </span>
                            </div>
                        </NavLink>
                        {isLoggedIn ? (
                            <a href="#" class="link-success p-0 " >
                                <div className="position-relative d-inline-block">
                                    <div className='navbar-nav'>
                                    </div>
                                    <i class="bi bi-receipt fs-3 link-warning" style={{ width: 'clamp(28px, 5vw, 40px)', height: 'auto' }}></i>
                                    <span
                                        className="position-absolute top-0 start-100 translate-middle badge rounded-circle text-danger border d-flex align-items-center justify-content-center"
                                        style={{
                                            width: 'clamp(16px, 3.2vw, 20px)',
                                            height: 'clamp(16px, 3.2vw, 20px)',
                                            fontSize: 'clamp(10px, 2.2vw, 12px)',
                                            backgroundColor: "white",
                                        }}
                                    >
                                        0
                                    </span>
                                </div>
                            </a>) : (
                            <></>
                        )}
                        {isLoggedIn ? (
                            <a href="#" class="link-success p-0">
                                <div className="position-relative d-inline-block">
                                    <div className='navbar-nav'>
                                    </div>
                                    <i class="bi bi-bell-fill fs-3 link-info" style={{ width: 'clamp(28px, 5vw, 40px)', height: 'auto' }}></i>
                                    <span
                                        className="position-absolute top-0 start-100 translate-middle badge rounded-circle text-danger border d-flex align-items-center justify-content-center"
                                        style={{
                                            width: 'clamp(16px, 3.2vw, 20px)',
                                            height: 'clamp(16px, 3.2vw, 20px)',
                                            fontSize: 'clamp(10px, 2.2vw, 12px)',
                                            backgroundColor: "white",
                                        }}
                                    >
                                        0
                                    </span>
                                </div>
                            </a>) : (
                            <></>
                        )}
                        {isLoggedIn ? (

                            <div className="navbar-nav d-flex flex-row">

                                <div class="btn-group">

                                    <a href="#" class="link-success dropdown-toggle  p-0" data-bs-toggle="dropdown">
                                        <i class="bi bi-person-circle fs-3 link-succesas" style={{ width: 'clamp(28px, 5vw, 40px)', height: 'auto' }}></i>
                                    </a>
                                    <ul class="dropdown-menu dropdown-menu-lg dropdown-menu-end">
                                        <li className='d-flex justify-content-center p-2' style={{ width: "300px", height: "200px" }}>
                                            <img src={logo} class="rounded-circle shadow" width={200} alt="User Image" />
                                        </li>
                                        <li class="user-header text-bg-primary p-2">
                                            <p>Admin
                                                <small> Member since Nov. 2023</small>
                                            </p>
                                        </li>

                                        <li class="user-footer">
                                            <div className='d-flex justify-content-between'>
                                                <a href="#" class="btn btn-default btn-flat">Profile</a>
                                                <NavLink className="btn btn-default btn-flat" to="/login" type="button" onClick={logout}>
                                                    Đăng xuất
                                                </NavLink>
                                            </div>
                                        </li>

                                    </ul>

                                </div>
                            </div>
                        ) : (
                            <NavLink to="/login" type="button">
                                <i class="bi bi-person-circle fs-3 link-warning" style={{ width: 'clamp(28px, 5vw, 40px)', height: 'auto' }}></i>
                            </NavLink>
                        )}



                    </div>
                </header >


            </div >
        </>
    );
}
