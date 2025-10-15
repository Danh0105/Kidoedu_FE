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
            const res = await axios.get(`${process.env.REACT_APP_API_URL}/products/${id}`);
            const data = res?.data?.data ?? res?.data;
            setProduct(data);

            const imageUrls =
                data?.images?.map((img) => img?.image_url).filter(Boolean) ?? [];
            setImages(imageUrls.length ? imageUrls : ["/placeholder-800x800.png"]);
        } catch (err) {
            console.error("Lỗi khi lấy sản phẩm:", err);
            setImages(["/placeholder-800x800.png"]);
        }
    };

    useEffect(() => {
        if (id) fetchProduct();
    }, [id]);

    return (
        <div className="container py-4">
            {/* Breadcrumb */}
            <nav style={{ "--bs-breadcrumb-divider": "'>'" }} aria-label="breadcrumb">
                <ol className="breadcrumb">
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
                <div className="col-md-6">
                    <div className="product-slider bg-white p-3 rounded-4 shadow-sm position-relative" >
                        {/* Slider chính (có zoom) */}
                        <Slider
                            {...mainSettings}
                            asNavFor={nav2}
                            ref={(slider1) => setNav1(slider1)}
                            style={{ width: "204px", height: "311px", margin: "0 auto" }}
                        >
                            {images.map((src, idx) => (
                                <div key={idx} >
                                    <InnerImageZoom
                                        src={src}
                                        zoomSrc={src}
                                        zoomType="hover"
                                        zoomScale={1}
                                        alt={`Ảnh ${idx + 1}`}
                                        className="img-fluid"
                                        style={{ maxHeight: "360px", objectFit: "contain" }}
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
                                    <div key={idx} className="px-1">
                                        <img
                                            src={src}
                                            alt={`Thumb ${idx + 1}`}
                                            className="img-fluid"
                                            style={{
                                                height: "90px",
                                                objectFit: "contain",
                                                border: "1px solid #ddd",
                                                borderRadius: "6px",
                                                cursor: "pointer",
                                                width: "100%",
                                                background: "#fff",
                                            }}
                                        />
                                    </div>
                                ))}
                            </Slider>
                        </div>

                        {/* nhắc có Zoom */}
                        <span className="position-absolute bottom-0 end-0 m-2 badge bg-dark-subtle text-dark">
                            <i className="bi bi-zoom-in me-1"></i> Zoom
                        </span>
                    </div>
                </div>

                {/* Cột thông tin sản phẩm (panel đã làm đẹp) */}
                <div className="col-lg-6">
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

            {/* Tab mô tả */}
            <div className="row mt-4">


                <div className="tab-content" id="pills-tabContent">
                    <div
                        className="tab-pane fade show active"
                        id="pills-home"
                        role="tabpanel"
                        aria-labelledby="pills-home-tab"
                        tabIndex="0"
                    >
                        <div
                            className="product-description bg-white p-3 rounded-3 shadow-sm"
                            dangerouslySetInnerHTML={{ __html: product?.long_description || "" }}
                        />
                    </div>
                </div>
            </div>

            {/* Modal xem nhanh giỏ */}


            {/* Sản phẩm liên quan (đặt sau) */}
            <h2 className="mt-4 mb-2" style={{ fontWeight: "var(--h2-bold-font-weight,bold)" }}>
                Sản phẩm liên quan
            </h2>
            {/* TODO: render grid sản phẩm liên quan từ category nếu cần */}
        </div>
    );
}
