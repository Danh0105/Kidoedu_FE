import React, { useState, useEffect } from "react";
import axios from "axios";
import "../../../components/admin/css/BannerManagement.css";

const API = process.env.REACT_APP_API_URL;

export default function HomeBanner() {
    const [banners, setBanners] = useState([]);
    const [currentId, setCurrentId] = useState(null);

    // Load danh sách banner
    const loadBanners = async () => {
        const res = await axios.get(`${API}/banners`);
        setBanners(res.data || []);
    };

    useEffect(() => {
        loadBanners();
    }, []);

    // Lấy banner theo ID
    const getBanner = (id) => banners?.find((b) => b.id === id);
    const backgroundBanner = getBanner(9);
    const frameproductN = getBanner(10);
    const frameproductP = getBanner(11);
    // Click vào từng banner
    const openUploadFor = (id) => {
        setCurrentId(id);
        document.getElementById("bannerInput").click();
    };

    // Upload ảnh
    const uploadImage = async (e) => {
        const file = e.target.files[0];
        if (!file || !currentId) return;

        const form = new FormData();
        form.append("image", file);

        await axios.patch(`${API}/banners/${currentId}`, form, {
            headers: { "Content-Type": "multipart/form-data" },
        });

        await loadBanners();

        // Reset input file
        e.target.value = "";
        setCurrentId(null);
    };

    // Component render từng ô banner
    const BannerBox = ({ id, label, className }) => {
        const data = getBanner(id);

        return (
            <button
                type="button"
                className={`${className} btn z-1`}
                onClick={(e) => {
                    e.stopPropagation();
                    openUploadFor(id);
                }}
            >
                {data?.imageUrl ? (
                    <img
                        src={`${API}${data.imageUrl}`}
                        alt={label}
                        className="banner-img"
                    />
                ) : (
                    <span>{label}</span>
                )}
            </button>
        );
    };

    return (
        <div
            className="layout-page "
            /*     onClick={() => openUploadFor()} */
            style={{
                backgroundImage: `url("${API}${backgroundBanner?.imageUrl}")`,
                backgroundSize: "cover",
                backgroundRepeat: "no-repeat",
                backgroundPosition: "center",
                minHeight: "100vh",
                transition: "0.3s",
            }}
        >
            {/* Input upload ảnh */}
            <input
                type="file"
                id="bannerInput"
                className="d-none"
                onChange={uploadImage}
            />

            {/* A */}
            <BannerBox id={1} label="A — Top Promo" className="top-promo" />

            {/* B */}
            <div className="content-container">
                <div className="sidebar"></div>
                <BannerBox id={2} label="B — Main Slider" className="main-sliderB" />
            </div>

            {/* C1 - C2 - C3 */}
            <div className="d-flex justify-content-center w-100 gap-2">
                <BannerBox id={3} label="C1 — Promo" className="C1" />
                <BannerBox id={4} label="C2 — Promo" className="C2" />
                <BannerBox id={5} label="C3 — Promo" className="C3" />
            </div>

            {/* D - F - E */}
            <BannerBox id={6} label="D — Sticker Trái" className="sticker-left-u" />
            <BannerBox id={7} label="F — Sticker Trái nhỏ" className="sticker-left-a" />
            <BannerBox id={8} label="E — Sticker Phải" className="sticker-right" />

            {/* P */}
            <div className="container d-flex  justify-content-center flex-column align-items-center gap-3 bg-white p-4 my-4 rounded-4 w-75">
                <h2 className="fw-bold" style={{ fontSize: "2rem" }}>
                    🆕 Sản phẩm mới
                </h2>
                <article
                    className="card-product-body card product-card"
                    itemScope
                    itemType="https://schema.org/Product"
                >
                    <div
                        className="product-frame"
                        onClick={(e) => {
                            e.stopPropagation();
                            openUploadFor(10);
                        }}>

                        {/* Badge */}



                        <span
                            className="badge position-absolute ribbon text-bg-danger"
                            data-pos="tr"
                        >
                            w
                        </span>


                        {/* Ảnh sản phẩm */}
                        <a
                            className="product-image-wrapper"
                        >
                            <img
                                /*                             src={process.env.REACT_APP_API_URL + imgSrc}
                                 */
                                loading="lazy"
                                decoding="async"
                                className="w-100 h-100 product-img"
                                style={{
                                    objectFit: "scale-down",
                                    objectPosition: "center",
                                    padding: 8,
                                }}
                                onError={(e) => {
                                    if (e.currentTarget.src.endsWith("/placeholder.png")) return;
                                    e.currentTarget.src = "/placeholder.png";
                                }}
                            />

                        </a>

                        {/* KHUNG */}

                        <img
                            src={`${process.env.REACT_APP_API_URL}${frameproductN?.imageUrl}`}
                            alt="frame"
                            className="frame-overlay"

                        />


                    </div>


                    <div className="card-body d-flex flex-column text-center">

                        <h3
                            className="product-title fw-semibold text-body-emphasis mb-2 two-line-clamp"

                            itemProp="name"
                        >
                            Tên san phẩm
                        </h3>

                        <div
                            className="mb-3"
                            itemProp="offers"
                            itemScope
                            itemType="https://schema.org/Offer"
                        >
                            {/* Giá khuyến mãi / final */}
                            <span className="fs-5 fw-bold text-danger" itemProp="price">
                                2xxxxx
                            </span>

                            {/* Giá gốc gạch ngang nếu có promo */}

                            <div className="text-muted text-decoration-line-through small mt-1">
                                1xxxxx
                            </div>


                            <meta itemProp="priceCurrency" content="VND" />
                            <link
                                itemProp="availability"
                                href="https://schema.org/InStock"
                            />
                        </div>
                    </div>
                </article>
                <h2 className="fw-bold" style={{ fontSize: "2rem" }}>
                    ⭐ Sản phẩm nổi bật
                </h2>
                <article
                    className="card-product-body card product-card"
                    itemScope
                    itemType="https://schema.org/Product"
                >
                    <div
                        className="product-frame"
                        onClick={(e) => {
                            e.stopPropagation();
                            openUploadFor(11);
                        }}>

                        {/* Badge */}



                        <span
                            className="badge position-absolute ribbon text-bg-danger"
                            data-pos="tr"
                        >
                            w
                        </span>


                        {/* Ảnh sản phẩm */}
                        <a
                            className="product-image-wrapper"
                        >
                            <img
                                /*                             src={process.env.REACT_APP_API_URL + imgSrc}
                                 */
                                loading="lazy"
                                decoding="async"
                                className="w-100 h-100 product-img"
                                style={{
                                    objectFit: "scale-down",
                                    objectPosition: "center",
                                    padding: 8,
                                }}
                                onError={(e) => {
                                    if (e.currentTarget.src.endsWith("/placeholder.png")) return;
                                    e.currentTarget.src = "/placeholder.png";
                                }}
                            />

                        </a>

                        {/* KHUNG */}

                        <img
                            src={`${process.env.REACT_APP_API_URL}${frameproductP?.imageUrl}`}
                            alt="frame"
                            className="frame-overlay"

                        />


                    </div>


                    <div className="card-body d-flex flex-column text-center">

                        <h3
                            className="product-title fw-semibold text-body-emphasis mb-2 two-line-clamp"

                            itemProp="name"
                        >
                            Tên san phẩm
                        </h3>

                        <div
                            className="mb-3"
                            itemProp="offers"
                            itemScope
                            itemType="https://schema.org/Offer"
                        >
                            {/* Giá khuyến mãi / final */}
                            <span className="fs-5 fw-bold text-danger" itemProp="price">
                                2xxxxx
                            </span>

                            {/* Giá gốc gạch ngang nếu có promo */}

                            <div className="text-muted text-decoration-line-through small mt-1">
                                1xxxxx
                            </div>


                            <meta itemProp="priceCurrency" content="VND" />
                            <link
                                itemProp="availability"
                                href="https://schema.org/InStock"
                            />
                        </div>
                    </div>
                </article>
            </div>
        </div>
    );
}
