import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import InnerImageZoom from "react-inner-image-zoom";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "react-inner-image-zoom/lib/styles.min.css";
import { NavLink, useParams } from "react-router-dom";
import axios from "axios";
import ModalCart from "../../components/user/ModalCart";
import { ProductInfoPanel } from "../../components/user/ProductInfoPanel";
import "../../components/user/css/ProductDetail.css";

const PLACEHOLDER = "/placeholder-800x800.png";

export default function ProductDetail() {
    const { id } = useParams();

    // gallery nav
    const [nav1, setNav1] = useState(null);
    const [nav2, setNav2] = useState(null);

    // data
    const [product, setProduct] = useState(null);
    const [images, setImages] = useState([]);

    // modal cart preview
    const [showModalCart, setShowModalCart] = useState(false);
    const [cartPreview, setCartPreview] = useState(null);

    const mainSettings = {
        arrows: true,
        fade: true,
        dots: false,
        adaptiveHeight: true,
    };

    const thumbSettings = {
        slidesToShow: 4,
        swipeToSlide: true,
        focusOnSelect: true,
        arrows: false,
        dots: false,
        responsive: [
            { breakpoint: 992, settings: { slidesToShow: 5 } }, // md
            { breakpoint: 768, settings: { slidesToShow: 4 } }, // sm
            { breakpoint: 576, settings: { slidesToShow: 4 } }, // xs
        ],
    };

    const fetchProduct = async () => {
        try {
            const res = await axios.get(`${process.env.REACT_APP_API_URL}/products/${id}`);
            const data = res?.data?.data ?? res?.data;
            setProduct(data);
            const urls = (data?.images || [])
                .map((i) => i?.image_url)
                .filter(Boolean);
            setImages(urls.length ? urls : [PLACEHOLDER]);
        } catch (err) {
            console.error("Lỗi khi lấy sản phẩm:", err);
            setImages([PLACEHOLDER]);
        }
    };

    useEffect(() => {
        if (id) fetchProduct();
    }, [id]);

    return (
        <div className="container py-4">
            {/* Breadcrumb */}
            <nav style={{ "--bs-breadcrumb-divider": "'>'" }} aria-label="breadcrumb">
                <ol className="breadcrumb mb-3">
                    <li className="breadcrumb-item">
                        <NavLink to="/store">Cửa hàng</NavLink>
                    </li>
                    <li className="breadcrumb-item active" aria-current="page">
                        Chi tiết
                    </li>
                </ol>
            </nav>

            <div className="row g-4">
                {/* Cột ảnh sản phẩm */}
                <div className="col-12 col-md-6">
                    <div className="product-slider bg-white p-3 rounded-4 shadow-sm position-relative">
                        {/* Slider chính (có zoom) */}
                        <Slider
                            {...mainSettings}
                            asNavFor={nav2}
                            ref={(slider1) => setNav1(slider1)}
                            className="main-slider"
                        >
                            {images.map((src, idx) => (
                                <div key={idx}>
                                    <InnerImageZoom
                                        src={src}
                                        zoomSrc={src}
                                        zoomType="hover"
                                        zoomScale={1}
                                        alt={`Ảnh ${idx + 1}`}
                                        className="img-fluid"
                                        afterZoomIn={() => { }}
                                        afterZoomOut={() => { }}
                                    />
                                </div>
                            ))}
                        </Slider>

                        {/* Slider thumbnail */}
                        <div className="">
                            <Slider
                                {...thumbSettings}
                                asNavFor={nav1}
                                ref={(s) => setNav2(s)}
                                className="thumb-slider"
                            >
                                {images.map((src, idx) => (
                                    <div key={idx} className="px-1">
                                        <img
                                            src={src}
                                            alt={`Thumb ${idx + 1}`}
                                            className="img-fluid thumb-img"
                                            onError={(e) => (e.currentTarget.src = PLACEHOLDER)}
                                        />
                                    </div>
                                ))}
                            </Slider>
                        </div>

                        {/* nhắc có Zoom (ẩn trên mobile) */}
                        <span className="zoom-hint position-absolute bottom-0 end-0 m-2 badge bg-dark-subtle text-dark">
                            <i className="bi bi-zoom-in me-1"></i> Zoom
                        </span>
                    </div>
                </div>

                {/* Cột thông tin sản phẩm */}
                <div className="col-12 col-lg-6">
                    <ProductInfoPanel
                        product={product}
                        images={images}
                        onAddToCart={(item) => {
                            setCartPreview(item);
                            setShowModalCart(true);
                        }}
                        defaultQty={1}
                    />
                </div>
            </div>

            {/* Mô tả */}
            <div className="row mt-4">
                <div className="col-12">
                    <div
                        className="product-description bg-white p-3 rounded-3 shadow-sm"
                        dangerouslySetInnerHTML={{ __html: product?.long_description || "" }}
                    />
                </div>
            </div>

            {/* Sản phẩm liên quan – bạn render sau */}
            <h2 className="mt-4 mb-2 fw-bold">Sản phẩm liên quan</h2>

            {/* Modal giỏ hàng nhanh */}
            <ModalCart
                show={showModalCart}
                onClose={() => setShowModalCart(false)}
                product={cartPreview || product}
                images={images}
            />
        </div>
    );
}
