import React, { useContext, useEffect, useMemo, useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import { NavLink, useParams } from "react-router-dom";
import axios from "axios";
import ProductInfoPanel from "../../components/user/ProductInfoPanel";
import { ProductSpecs } from "../../components/user/ProductSpecs";
import "../../components/user/css/ProductDetail.css";
import { addToCartHelper } from "../../utils/addToCartHelper";
import { CartContext } from "../../hooks/CartContext";

const PLACEHOLDER = "/placeholder-800x800.png";

/* ======================================================================
   Helper: CautionNotes (không đổi)
   ====================================================================== */
const CautionNotes = ({ notes, maxVisible = 6, title = "Lưu ý quan trọng" }) => {
    const [expanded, setExpanded] = useState(false);

    const META = {
        info: { icon: "bi bi-info-circle-fill text-info", label: "Mẹo", badge: "text-bg-info" },
        warning: { icon: "bi bi-exclamation-triangle-fill text-warning", label: "Cảnh báo", badge: "text-bg-warning" },
        danger: { icon: "bi bi-exclamation-octagon-fill text-danger", label: "Nguy hiểm", badge: "text-bg-danger" },
        default: { icon: "bi bi-dot text-secondary", label: "Lưu ý", badge: "text-bg-secondary" },
    };

    if (!notes) return <p className="text-muted m-0">Chưa có lưu ý.</p>;

    const splitText = (t) =>
        String(t)
            .replace(/\r\n|\n|\t/g, " ")
            .replace(/\s{2,}/g, " ")
            .trim()
            .split(/\s+[–|-]\s+|;(?=\s)|\u2022|\.\s+(?=[A-ZÀ-ỹ0-9])/g)
            .map((s) => s.trim())
            .filter(Boolean);

    const list = Array.isArray(notes) ? notes.flatMap((n) => splitText(n)) : splitText(notes);

    const items = list.map((text) => {
        const m = text.match(/\((info|warning|danger)\)\s*$/i);
        const level = m ? m[1].toLowerCase() : "default";
        return {
            text: m ? text.replace(m[0], "").trim().replace(/[.;,]$/, "") : text,
            level,
        };
    });

    const visible = expanded ? items : items.slice(0, maxVisible);

    return (
        <div className="vstack gap-2">
            <div className="d-flex align-items-center gap-2">
                <i className="bi bi-shield-check text-primary" />
                <strong>{title}</strong>
            </div>

            <ul className="list-unstyled m-0">
                {visible.map((it, i) => {
                    const meta = META[it.level] ?? META.default;
                    return (
                        <li key={i} className="d-flex align-items-start gap-2 py-1">
                            <i className={meta.icon} />
                            <div>
                                <span className={`badge rounded-pill me-2 ${meta.badge}`}>{meta.label}</span>
                                <span>{it.text}</span>
                            </div>
                        </li>
                    );
                })}
            </ul>

            {items.length > maxVisible && (
                <button
                    type="button"
                    className="btn btn-sm btn-outline-secondary align-self-start"
                    onClick={() => setExpanded((v) => !v)}
                >
                    {expanded ? "Thu gọn" : `Xem thêm ${items.length - maxVisible} mục`}
                </button>
            )}
        </div>
    );
};

/* ======================================================================
   Component chính: ProductDetail (phiên bản đã sửa an toàn)
   ====================================================================== */
export default function ProductDetail() {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [images, setImages] = useState([PLACEHOLDER]);
    const [nav1, setNav1] = useState(null);
    const [nav2, setNav2] = useState(null);
    const [activeTab, setActiveTab] = useState("desc");
    const [specs, setSpecs] = useState([]);
    const { addToCartContext, setCartCount } = useContext(CartContext);
    const [mainImage, setMainImage] = useState(null);

    /* ===========================================================
       Lấy sản phẩm từ API (safe parsing)
       =========================================================== */

    useEffect(() => {
        if (!id) return;

        (async () => {
            try {
                const { data } = await axios.get(
                    `${process.env.REACT_APP_API_URL}/products/${id}`
                );

                const prod = data?.data ?? data;
                console.log(prod);

                setProduct(prod);

                /* =======================
                   1) Ảnh sản phẩm
                   ======================= */
                const prodImages = Array.isArray(prod?.images)
                    ? prod.images
                        .map(i =>
                            typeof i === "string"
                                ? i
                                : i?.imageUrl ||
                                null
                        )
                        .filter(Boolean)
                    : [];

                /* =======================
                   2) Ảnh biến thể
                   ======================= */
                const variantImages = Array.isArray(prod?.variants)
                    ? prod.variants.flatMap(v => {
                        const img = v?.imageUrl || null;

                        if (!img) return [];

                        if (typeof img === "string") return [img];

                        if (Array.isArray(img))
                            return img
                                .map(it =>
                                    typeof it === "string"
                                        ? it
                                        : it?.imageUrl || null
                                )
                                .filter(Boolean);

                        if (typeof img === "object")
                            return [
                                img.imageUrl ||
                                img.image_url ||
                                img.url ||
                                null,
                            ].filter(Boolean);

                        return [];
                    })
                    : [];

                /* =======================
                   3) Gộp ảnh (unique)
                   ======================= */
                const merged = [...new Set([...variantImages, ...prodImages])];

                setImages(merged.length ? merged : [PLACEHOLDER]);
                setMainImage((merged.length ? merged[0] : PLACEHOLDER));
                /* =======================
                   4) Specs
                   ======================= */
                const firstVariant = prod?.variants?.[0] ?? null;


                const initialSpecs =
                    prod?.variants?.find(v => v?.isActive)?.specs ??
                    firstVariant?.specs ??
                    [];
                console.log(initialSpecs);
                setSpecs(Array.isArray(initialSpecs) ? [...initialSpecs] : []);
            } catch (err) {
                console.error("Lỗi khi lấy sản phẩm:", err);
                setProduct(null);
                setImages([PLACEHOLDER]);
                setSpecs([]);
            }
        })();
    }, [id]);


    /* callback khi ProductInfoPanel load variants (chứa ảnh) */

    const descHtml = product?.longDescription || "";

    /* ===========================================================
       Parse hướng dẫn sử dụng (giữ nguyên)
       =========================================================== */
    const notes = useMemo(() => product?.cautionNotes ?? null, [product]);

    const manual = useMemo(() => {
        const raw = product?.userManual;
        if (!raw) return null;

        let pdf = raw.pdf || null;
        let video = raw.video || null;
        let steps = [];

        if (Array.isArray(raw.steps)) {
            raw.steps.forEach((item) => {
                if (typeof item === "string") {
                    try {
                        const parsed = JSON.parse(item);
                        if (!pdf && parsed.pdf) pdf = parsed.pdf;
                        if (!video && parsed.video) video = parsed.video;

                        if (Array.isArray(parsed.steps)) {
                            steps.push(...parsed.steps.filter((s) => typeof s === "string"));
                        }
                    } catch {
                        steps.push(item);
                    }
                } else if (typeof item === "object" && item?.text) {
                    steps.push(item.text);
                }
            });
        }

        if (!steps.length && raw.text) steps.push(raw.text);

        return { pdf, video, steps };
    }, [product]);

    const origin = product?.origin ?? null;
    const stock = typeof product?.stock_quantity === "number" ? product.stock_quantity : null;

    const mainSettings = { arrows: false, fade: true, dots: false, adaptiveHeight: true };
    const thumbSettings = {
        slidesToShow: 4,
        swipeToSlide: true,
        focusOnSelect: true,
        arrows: false,
        dots: false,
        responsive: [
            { breakpoint: 992, settings: { slidesToShow: 5 } },
            { breakpoint: 768, settings: { slidesToShow: 4 } },
            { breakpoint: 576, settings: { slidesToShow: 4 } },
        ],
    };

    /* ===========================================================
       Render
       =========================================================== */
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
                {/* Image Gallery */}
                <div className="col-12 col-md-6 bg-white  p-3 rounded-4 shadow-sm">

                    <div className="dmx-gallery position-relative">

                        {/* ===== SLIDER ẢNH LỚN ===== */}
                        <Slider {...mainSettings} asNavFor={nav2} ref={setNav1}>
                            {[mainImage, ...images.filter(img => img !== mainImage)].map((src, i) => (
                                <div key={i} className="dmx-image-container">
                                    <img
                                        src={process.env.REACT_APP_API_URL + src}
                                        className="dmx-main-image"
                                        onError={(e) => (e.currentTarget.src = PLACEHOLDER)}
                                    />
                                </div>
                            ))}
                        </Slider>


                        {/* Nút chuyển trái/phải */}
                        <button className="dmx-prev" onClick={() => nav1?.slickPrev()}>
                            <i className="bi bi-chevron-left"></i>
                        </button>

                        <button className="dmx-next" onClick={() => nav1?.slickNext()}>
                            <i className="bi bi-chevron-right"></i>
                        </button>
                    </div>

                    {/* ===== SLIDE THUMBNAIL BÊN DƯỚI ===== */}
                    <div className="dmx-thumb-wrapper mt-3">
                        <Slider {...thumbSettings} asNavFor={nav1} ref={setNav2}>
                            {images.map((src, i) => (
                                <div key={i} className="dmx-thumb-item">
                                    <img
                                        src={process.env.REACT_APP_API_URL + src}
                                        alt={`Thumb ${i + 1}`}
                                        className="dmx-thumb-img"
                                        onError={(e) => (e.currentTarget.src = PLACEHOLDER)}
                                    />
                                </div>
                            ))}
                        </Slider>
                    </div>
                    <div className="dmx-tabs d-flex justify-content-center gap-4 mt-4">


                        <div className="dmx-tab">
                            <i className="bi bi-box"></i>
                            <span>Thông số kỹ thuật</span>
                        </div>

                        <div className="dmx-tab">
                            <i className="bi bi-info-circle"></i>
                            <span>Mô tả sản phẩm</span>
                        </div>

                        <div className="dmx-tab">
                            <div className="rating">4.7</div>
                            <span>Đánh giá sản phẩm</span>
                        </div>
                    </div>
                </div>

                {/* Product Info */}
                <div className="col-12 col-lg-6">
                    <ProductInfoPanel
                        product={product}
                        onAddToCart={({ product, variant, quantity, selectedAttr }) =>
                            addToCartHelper({
                                product,
                                variant,
                                quantity,
                                selectedAttr,
                                setCartCount,
                                addToCartContext,
                            })
                        }
                        onVariantChange={(variant) => {
                            // 1. Cập nhật ảnh
                            const imgs = [];

                            if (variant.imageUrl) {
                                if (typeof variant.imageUrl === "string") imgs.push(variant.imageUrl);
                                else if (Array.isArray(variant.imageUrl))
                                    imgs.push(...variant.imageUrl.filter(Boolean));
                                else if (variant.imageUrl?.imageUrl)
                                    imgs.push(variant.imageUrl.imageUrl);
                            }

                            // Nếu không có ảnh variant thì dùng ảnh sản phẩm
                            if (imgs.length === 0) {
                                imgs.push(...product.images.map(i => typeof i === "string" ? i : i.imageUrl));
                            }

                            if (imgs.length > 0) {
                                setMainImage(imgs[0]);
                            } else {
                                setMainImage(product.images?.[0]?.imageUrl || product.images?.[0] || PLACEHOLDER);
                            }


                            // 2. Cập nhật specs
                            setSpecs(variant.specs ?? []);
                        }}
                    />



                    {/* Origin + Stock */}
                    <div className="d-flex flex-wrap gap-2 mt-3">
                        {origin && (
                            <span className="badge bg-secondary-subtle text-secondary-emphasis">
                                <i className="bi bi-geo-alt me-1" /> Xuất xứ: <strong>{origin}</strong>
                            </span>
                        )}
                        {typeof stock === "number" && (
                            <span
                                className={`badge ${stock > 0
                                    ? "bg-success-subtle text-success-emphasis"
                                    : "bg-danger-subtle text-danger-emphasis"
                                    }`}
                            >
                                <i className="bi bi-box-seam me-1" /> Tồn kho: <strong>{stock}</strong>
                            </span>
                        )}
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="row mt-4">
                <div className="col-12">
                    <ul className="nav nav-tabs rounded-top overflow-auto bg-success" style={{ border: 'none' }}>
                        {[
                            { key: "desc", label: "Chi tiết sản phẩm" },
                            { key: "specs", label: "Thông số kỹ thuật" },
                            { key: "notes", label: "Lưu ý" },
                            { key: "manual", label: "Hướng dẫn sử dụng" },
                        ].map((tab) => (
                            <li key={tab.key} className="nav-item">
                                <button
                                    className={`nav-link  ${activeTab === tab.key ? "active" : "text-white"}`}
                                    onClick={() => setActiveTab(tab.key)}
                                >
                                    {tab.label}
                                </button>
                            </li>
                        ))}
                    </ul>

                    <div className="bg-white p-3 rounded-bottom shadow-sm border border-top-0">
                        {activeTab === "desc" && <div dangerouslySetInnerHTML={{ __html: descHtml }} />}
                        {activeTab === "specs" && <ProductSpecs specs={specs} />}
                        {activeTab === "notes" && <CautionNotes notes={notes} />}
                        {activeTab === "manual" && (
                            <div className="vstack gap-3">
                                <div className="d-flex flex-wrap gap-2">
                                    {manual?.pdf && (
                                        <a href={manual.pdf} target="_blank" rel="noreferrer"
                                            className="btn btn-sm btn-outline-primary">
                                            <i className="bi bi-file-earmark-pdf me-1" /> Xem hướng dẫn PDF
                                        </a>
                                    )}
                                    {manual?.video && (
                                        <a href={manual.video} target="_blank" rel="noreferrer"
                                            className="btn btn-sm btn-outline-danger">
                                            <i className="bi bi-play-circle me-1" /> Xem video hướng dẫn
                                        </a>
                                    )}
                                </div>

                                {manual?.steps?.length ? (
                                    <ol className="ps-3 mb-0">
                                        {manual.steps.map((step, idx) => (
                                            <li key={idx} className="mb-1">{step}</li>
                                        ))}
                                    </ol>
                                ) : (
                                    <p className="text-muted mb-0">Chưa có hướng dẫn sử dụng chi tiết.</p>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <h2 className="mt-4 mb-2 fw-bold">Sản phẩm liên quan</h2>
        </div>
    );
}
