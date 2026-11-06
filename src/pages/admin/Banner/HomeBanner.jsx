import React, { useState, useEffect } from "react";
import axios from "axios";
import "../../../components/admin/css/BannerManagement.css";
import { Menu } from "lucide-react";

const API = process.env.REACT_APP_API_URL;

export default function HomeBanner() {
    const [banners, setBanners] = useState([]);
    const [currentId, setCurrentId] = useState(null);
    const [activeIndex, setActiveIndex] = useState(0);
    const [sliderBanners, setSliderBanners] = useState([]);
    const [editingSlideId, setEditingSlideId] = useState(null);
    const [editingValue, setEditingValue] = useState("");
    const [editingLinkId, setEditingLinkId] = useState(null);
    const [editingLinkValue, setEditingLinkValue] = useState("");
    const defaultSlider = [
        { id: 14, content: "Khuyến mãi lớn", imageUrl: "/defaults/slide1.jpg" },
        { id: 15, content: "Giảm giá đến 50%", imageUrl: "/defaults/slide2.jpg" },
        { id: 16, content: "Mua 1 tặng 1", imageUrl: "/defaults/slide3.jpg" },
        { id: 17, content: "Flash Sale hôm nay", imageUrl: "/defaults/slide4.jpg" },
        { id: 18, content: "Deal sốc cuối tuần", imageUrl: "/defaults/slide5.jpg" },
        { id: 19, content: "Trả góp 0%", imageUrl: "/defaults/slide6.jpg" },
        { id: 20, content: "Hàng mới về", imageUrl: "/defaults/slide7.jpg" },
        { id: 21, content: "Giá tốt mỗi ngày", imageUrl: "/defaults/slide8.jpg" },
        { id: 22, content: "Ưu đãi thành viên", imageUrl: "/defaults/slide9.jpg" },
        { id: 23, content: "Mua ngay hôm nay", imageUrl: "/defaults/slide10.jpg" },
    ];

    const saveSlideContent = async (bannerId) => {
        try {
            const res = await axios.patch(`${API}/banners/${bannerId}`, {
                content: editingValue
            });

            const updated = res.data;

            setSliderBanners(prev =>
                prev.map(b => b.id === updated.id ? updated : b)
            );

            setBanners(prev =>
                prev.map(b => b.id === updated.id ? updated : b)
            );

            setEditingSlideId(null);
            setEditingValue("");
        } catch (err) {
            console.error("Lỗi cập nhật slide");
        }
    };
    const saveSlideLink = async (bannerId) => {
        try {
            const res = await axios.patch(`${API}/banners/${bannerId}`, {
                linkUrl: editingLinkValue
            });

            const updated = res.data;

            setSliderBanners(prev =>
                prev.map(b => b.id === updated.id ? updated : b)
            );

            setBanners(prev =>
                prev.map(b => b.id === updated.id ? updated : b)
            );

            setEditingLinkId(null);
            setEditingLinkValue("");
        } catch (err) {
            console.error("Lỗi cập nhật link");
        }
    };
    const clearSlideContent = async (bannerId) => {
        try {
            const res = await axios.patch(`${API}/banners/${bannerId}`, {
                clear: true
            });

            const updated = res.data;

            setSliderBanners(prev =>
                prev.map(b => b.id === updated.id ? updated : b)
            );

            setBanners(prev =>
                prev.map(b => b.id === updated.id ? updated : b)
            );

        } catch (err) {
            console.error("Lỗi làm rỗng slide");
        }
    };

    const loadSliderBanners = async () => {
        try {
            const res = await axios.get(`${API}/banners/range/14-24`);

            if (res.data && res.data.length > 0) {
                setSliderBanners(res.data);
            } else {
                setSliderBanners(defaultSlider);
            }

        } catch (error) {
            console.error("API lỗi, dùng banner mặc định");
            setSliderBanners(defaultSlider);
        }
    };
    // Load danh sách banner
    const loadBanners = async () => {
        const res = await axios.get(`${API}/banners`);
        setBanners(res.data || []);
    };

    useEffect(() => {
        loadBanners();
        loadSliderBanners();
    }, []);

    // Lấy banner theo ID
    const getBanner = (id) => banners?.find((b) => b.id === id);
    const backgroundBanner = getBanner(9);
    const frameproductN = getBanner(10);
    const frameproductP = getBanner(11);
    // Click vào từng banner
    const openUploadFor = (id) => {
        console.log("📤 Open upload for id:", id);
        setCurrentId(id);
        document.getElementById("bannerInput").click();
    };

    // Upload ảnh
    const uploadImage = async (e) => {

        const file = e.target.files[0];
        if (!file || !currentId) return;
        console.log("⬆ Upload file:", file.name);
        console.log("📌 Upload cho banner id:", currentId);
        const form = new FormData();
        form.append("image", file);

        await axios.patch(`${API}/banners/${currentId}`, form, {
            headers: { "Content-Type": "multipart/form-data" },
        });

        await loadBanners();
        await loadSliderBanners();
        // Reset input file
        e.target.value = "";
        setCurrentId(null);
    };

    // Component render từng ô banner
    const BannerBox = ({ id, label, className }) => {
        const data = getBanner(id);

        if (!data) return null;

        const content = (
            <>
                {data?.imageUrl ? (
                    <img
                        src={`${API}${data.imageUrl}`}
                        alt={label}
                        className="banner-img"
                    />
                ) : (
                    <span className="banner-text">
                        {data?.content || label}
                    </span>
                )}
            </>
        );

        return data?.linkUrl ? (
            <a
                href={data.linkUrl}
                className={`${className} banner-link`}
            >
                {content}
            </a>
        ) : (
            <button
                type="button"
                className={`${className} btn`}
                onClick={(e) => {
                    e.stopPropagation();
                    openUploadFor(id);
                }}
            >
                {content}
            </button>
        );
    };
    const BannerBoxSlide = ({ banner, className }) => {
        if (!banner) return null;

        const imageSrc = banner.imageUrl?.startsWith("/defaults")
            ? banner.imageUrl
            : banner.imageUrl
                ? `${API}${banner.imageUrl}`
                : null;

        return (
            <div
                className={className}
                style={{ cursor: banner.linkUrl ? "pointer" : "default" }}
                onClick={(e) => {
                    e.stopPropagation();
                    openUploadFor(banner.id);
                }}
            >
                {imageSrc ? (
                    <img
                        src={imageSrc}
                        alt={banner.content || "slide"}
                        className="banner-img"
                        style={{
                            width: "1012px",
                            height: "463px",
                            objectFit: "cover"
                        }}
                    />
                ) : (
                    <div className="d-flex align-items-center justify-content-center h-100 bg-light">
                        1012x463
                    </div>
                )}
            </div>
        );
    };
    return (
        <div
            className="layout-page "

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
            <div className="container mt-2">
                <div className="d-flex gap-2">
                    <div className="sidebar" style={{ minWidth: 270 }}>
                        <div className="bg-danger text-white fw-bold d-flex align-items-center px-3 py-2">
                            <Menu size={20} className="me-2" /> MENU
                        </div>
                    </div>
                    <div className="d-flex flex-column gap-2 bg-white" style={{ width: "1012px" }}>

                        <div className="carousel-frame">
                            <div
                                className="carousel-track"
                                style={{
                                    transform: `translateX(-${activeIndex * 100}%)`
                                }}
                            >
                                {sliderBanners.map((banner) => (
                                    <div className="carousel-slide" key={banner.id}>
                                        <BannerBoxSlide
                                            banner={banner}
                                            className="carousel-image"
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="d-flex  gap-2 flex-wrap m-2" >
                            {sliderBanners.map((banner, index) => (
                                <div
                                    key={banner.id}
                                    className={`d-flex align-items-center px-2 py-1 rounded 
      ${activeIndex === index ? "bg-primary text-white" : "bg-light"}`}
                                >

                                    {/* CONTENT */}
                                    <button
                                        type="button"
                                        className={`btn btn-sm p-0 border-0 bg-transparent 
        ${activeIndex === index ? "text-white" : "text-dark"}`}
                                        onClick={() => setActiveIndex(index)}
                                        onDoubleClick={() => {
                                            setEditingSlideId(banner.id);
                                            setEditingValue(banner.content || "");
                                        }}
                                    >
                                        {editingSlideId === banner.id ? (
                                            <input
                                                className="form-control form-control-sm"
                                                autoFocus
                                                value={editingValue}
                                                onChange={(e) => setEditingValue(e.target.value)}
                                                onBlur={() => saveSlideContent(banner.id)}
                                                onKeyDown={(e) => {
                                                    if (e.key === "Enter") saveSlideContent(banner.id);
                                                }}
                                                style={{ width: 120 }}
                                            />
                                        ) : (
                                            banner.content || `Slide ${index + 1}`
                                        )}
                                    </button>

                                    {/* LINK INLINE EDIT */}
                                    {editingLinkId === banner.id ? (
                                        <input
                                            className="form-control form-control-sm ms-2"
                                            autoFocus
                                            value={editingLinkValue}
                                            onChange={(e) => setEditingLinkValue(e.target.value)}
                                            onBlur={() => saveSlideLink(banner.id)}
                                            onKeyDown={(e) => {
                                                if (e.key === "Enter") saveSlideLink(banner.id);
                                            }}
                                            style={{ width: 160 }}
                                            placeholder="Nhập link..."
                                        />
                                    ) : (
                                        <button
                                            type="button"
                                            className={`btn btn-sm ms-2 ${banner.linkUrl ? "btn-success" : "btn-outline-secondary"
                                                }`}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setEditingLinkId(banner.id);
                                                setEditingLinkValue(banner.linkUrl || "");
                                            }}
                                        >
                                            🔗
                                        </button>
                                    )}

                                    {/* CLEAR */}
                                    <button
                                        type="button"
                                        className="btn btn-sm btn-danger ms-1 py-0 px-2"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            clearSlideContent(banner.id);
                                        }}
                                    >
                                        ×
                                    </button>

                                </div>
                            ))}
                        </div>
                    </div>
                </div>
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
            <button onClick={() => openUploadFor(9)} >cập nhật ảnh body </button>
        </div >
    );
}
