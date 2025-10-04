import React, { useContext, useEffect, useState } from "react";
import Slider from "react-slick";
import InnerImageZoom from "react-inner-image-zoom";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "react-inner-image-zoom/lib/styles.min.css";
import { NavLink, useParams } from "react-router-dom";
import axios from "axios";
import ModalCart from "../../components/user/ModalCart";
import { jwtDecode } from 'jwt-decode';
import { CartContext } from "../../hooks/CartContext";

import Cookies from 'js-cookie';
import { s } from "framer-motion/client";

export default function ProductDetail() {

    const [nav1, setNav1] = useState(null);
    const [nav2, setNav2] = useState(null);
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [images, setImages] = useState([]);
    const { setCartCount, addToCartContext, setSelectedProducts } = useContext(CartContext);
    const [quantity, setQuantity] = useState(1);
    const increase = () => setQuantity((prev) => prev + 1);
    const decrease = () => setQuantity((prev) => (prev > 1 ? prev - 1 : 1));
    const mainSettings = {
        arrows: true,
        fade: true,
        dots: false,
    };

    const thumbSettings = {
        slidesToShow: 4,
        swipeToSlide: true,
        focusOnSelect: true,
        arrows: false,
        dots: false,
    };

    const fetchProduct = async () => {
        try {
            const res = await axios.get(`https://kidoedu.vn/products/${id}`);
            setProduct(res.data.data);
            const imageUrls = res.data.data.images.map((img) => img.image_url);
            setImages(imageUrls);

        } catch (err) {
            console.error("Lỗi khi lấy danh mục:", err);
        }
    };
    useEffect(() => {
        fetchProduct();
    }, []);
    const transformedProduct = { data: product, quantity: quantity };
    const [showModal, setShowModal] = useState(false);
    const addToCart = async (productId, quantity) => {
        try {
            const token = localStorage.getItem('Authorization') || null;

            if (typeof token === 'string' && token.trim() !== '') {
                const decoded = jwtDecode(token);
                const userId = decoded.sub;
                const payload = { productId, quantity };

                const res = await axios.post(
                    `https://kidoedu.vn/cart/${userId}/items`,
                    payload,
                    {
                        headers: {
                            Authorization: token,
                        },
                    }
                );

                alert('Đã thêm sản phẩm!');
                fetchCountCart();
            } else {
                const currentCart = JSON.parse(Cookies.get('guest_cart') || '[]');
                const existingIndex = currentCart.findIndex(item => item.productId === productId);
                fetchCountCart();

                if (existingIndex !== -1) {
                    currentCart[existingIndex].quantity += quantity;
                } else {
                    currentCart.push({ productId, quantity });
                }
                Cookies.set('guest_cart', JSON.stringify(currentCart), { expires: 7 });
                currentCart.forEach(item => addToCartContext(item));
                alert('Đã lưu sản phẩm vào giỏ hàng!');
            }
        } catch (error) {
            console.error('Lỗi thêm vào giỏ hàng:', error);
            alert('Không thể thêm vào giỏ hàng!');
        }
    };
    const fetchCountCart = async () => {
        const token = localStorage.getItem('Authorization') || null;
        if (typeof token === 'string' && token.trim() !== '') {
            const decoded = jwtDecode(token);
            const resCart = await axios.get(`https://kidoedu.vn/cart/${decoded.sub}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const cart = resCart.data;

            setCartCount(cart.items.length || 0);
        }
    }
    return (
        <div className="container py-4" >
            <nav style={{ "--bs-breadcrumb-divider": "'>'" }} aria-label="breadcrumb">
                <ol class="breadcrumb">
                    <li class="breadcrumb-item"><a href="#" >Cửa hàng</a></li>
                    <li class="breadcrumb-item active" aria-current="page">Chi tiết</li>
                </ol>
            </nav>
            <div className="row">
                {/* Cột ảnh sản phẩm */}
                <div className="col-md-6">
                    <div className="product-slider">
                        {/* Slider chính (có zoom) */}
                        <Slider
                            {...mainSettings}
                            asNavFor={nav2}
                            ref={(slider1) => setNav1(slider1)}
                            style={{ maxWidth: "350px", margin: "0 auto" }}   // 👈 Giới hạn chiều rộng
                        >
                            {images.map((src, idx) => (
                                <div key={idx} style={{ maxHeight: "300px" }}>   {/* 👈 Giới hạn chiều cao */}
                                    <InnerImageZoom
                                        src={src}
                                        zoomSrc={src}
                                        zoomType="hover"
                                        zoomScale={1.5}
                                        alt={`Ảnh ${idx}`}
                                        className="img-fluid"
                                        style={{
                                            maxHeight: "300px",   // 👈 Giới hạn chiều cao ảnh
                                            objectFit: "contain",
                                        }}
                                    />
                                </div>
                            ))}
                        </Slider>

                        {/* Slider thumbnail */}
                        <div className="mt-3">
                            <Slider
                                {...thumbSettings}
                                asNavFor={nav1}
                                ref={(slider2) => setNav2(slider2)}
                            >
                                {images.map((src, idx) => (
                                    <div key={idx}>
                                        <img
                                            src={src}
                                            alt={`Thumb ${idx}`}
                                            className="img-fluid"
                                            style={{
                                                height: "100px",
                                                objectFit: "contain",
                                                border: "1px solid #ddd",
                                                borderRadius: "4px",
                                                cursor: "pointer",
                                            }}
                                        />
                                    </div>
                                ))}
                            </Slider>
                        </div>
                    </div>
                </div>
                <div className="col-md-6">
                    <h2>{product?.product_name}</h2>

                    <p className="text-muted">Mã sản phẩm: #{product?.product_id}</p>

                    <h4 className="text-danger">
                        {Number(product?.price).toLocaleString("vi-VN")} ₫
                    </h4>

                    <p>{product?.short_description}</p>

                    <div className="d-flex gap-2">
                        <div className="d-flex align-items-center">
                            <button
                                className="btn btn-outline-secondary rounded-0"
                                type="button"
                                onClick={decrease}
                            >
                                -
                            </button>
                            <input
                                type="number"
                                className="form-control text-center rounded-0"
                                style={{ width: "40px" }}
                                value={quantity}
                                min="1"
                                onChange={(e) => {
                                    const val = Math.max(1, parseInt(e.target.value) || 1);
                                    setQuantity(val);
                                }}
                            />
                            <button
                                className="btn btn-outline-secondary rounded-0"
                                type="button"
                                onClick={increase}
                            >
                                +
                            </button>
                        </div>
                        <button className="btn btn-danger me-2" onClick={() => addToCart(product?.product_id, quantity)}>Thêm vào giỏ hàng</button>

                        <ModalCart
                            show={showModal}
                            onClose={() => setShowModal(false)}
                            product={product}
                            images={images}
                        />
                        <NavLink onClick={() => setSelectedProducts([transformedProduct])} to='/checkout' className='btn btn-primary' >
                            Mua ngay
                        </NavLink>
                    </div>

                    <div className="d-flex gap-2 mt-2">
                        <span>SKU: {product?.sku}</span>
                        <span>Category: {product?.category?.category_name}</span>
                    </div>
                </div>

            </div>
            <div className="row">
                <ul class="nav nav-pills mb-2 bg-body-tertiary pt-4 pb-4" id="pills-tab" role="tablist">
                    <li class="nav-item" role="presentation">
                        <button class="nav-link active" id="pills-home-tab" data-bs-toggle="pill" data-bs-target="#pills-home" type="button" role="tab" aria-controls="pills-home" aria-selected="true">Description</button>
                    </li>
                </ul>
                <div class="tab-content" id="pills-tabContent">
                    <div class="tab-pane fade show active" id="pills-home" role="tabpanel" aria-labelledby="pills-home-tab" tabindex="0">
                        <div
                            className="product-description bg-white p-3"
                            dangerouslySetInnerHTML={{ __html: product?.long_description }}
                        />

                    </div>
                </div>
            </div>
            <span style={{ fontSize: "30px", fontWeight: "var(--h2-bold-font-weight,bold)" }}>Sản phẩm liên quan</span>
            {/*    <div className="row mt-3">
                <div className="col">
                    <div className="col">
                        <Product
                            name="Module GPS+BDS ATGM336H"
                            content="Module GPS BDS ATGM336H định vị có thiết kế nhỏ gọn sử dụng IC chính SoC GNSS AT6558 thế hệ thứ 4"
                        />
                    </div>
                </div>
                <div className="col">
                    <div className="col">
                        <Product
                            name="Module GPS+BDS ATGM336H"
                            content="Module GPS BDS ATGM336H định vị có thiết kế nhỏ gọn sử dụng IC chính SoC GNSS AT6558 thế hệ thứ 4"
                        />
                    </div>
                </div>
                <div className="col">
                    <div className="col">
                        <Product
                            name="Module GPS+BDS ATGM336H"
                            content="Module GPS BDS ATGM336H định vị có thiết kế nhỏ gọn sử dụng IC chính SoC GNSS AT6558 thế hệ thứ 4"
                        />
                    </div>
                </div>
                <div className="col">
                    <div className="col">
                        <Product
                            name="Module GPS+BDS ATGM336H"
                            content="Module GPS BDS ATGM336H định vị có thiết kế nhỏ gọn sử dụng IC chính SoC GNSS AT6558 thế hệ thứ 4"
                        />
                    </div>
                </div>
            </div> */}
        </div>
    );
}
