import React, { useEffect, useMemo, useState } from "react";
import Slider from "react-slick";
import InnerImageZoom from "react-inner-image-zoom";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "react-inner-image-zoom/lib/styles.min.css";
import { NavLink, useParams } from "react-router-dom";
import axios from "axios";
import ModalCart from "../../components/user/ModalCart";
import { ProductInfoPanel } from "../../components/user/ProductInfoPanel";
import { ProductSpecs } from "./ProductSpecs";
import "../../components/user/css/ProductDetail.css";

const PLACEHOLDER = "/placeholder-800x800.png";

/* ==========================================================================
   Helper: CautionNotes - render danh sách lưu ý (mẹo / cảnh báo / nguy hiểm)
   ========================================================================== */
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
            .split(/\s+[–|-]\s+|;(?=\s)|\u2022|\•|\.\s+(?=[A-ZÀ-ỹ0-9])/g)
            .map((s) => s.trim())
            .filter(Boolean);

    const list = Array.isArray(notes)
        ? notes.flatMap((n) => splitText(n))
        : splitText(notes);

    const items = list.map((text) => {
        const m = text.match(/\((info|warning|danger)\)\s*$/i);
        const level = m ? m[1].toLowerCase() : "default";
        return { text: m ? text.replace(m[0], "").trim().replace(/[.;,]$/, "") : text, level };
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

/* ==========================================================================
   Component chính: ProductDetail
   ========================================================================== */
export default function ProductDetail() {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [images, setImages] = useState([PLACEHOLDER]);
    const [nav1, setNav1] = useState(null);
    const [nav2, setNav2] = useState(null);
    const [activeTab, setActiveTab] = useState("desc");
    const [showModalCart, setShowModalCart] = useState(false);
    const [cartPreview, setCartPreview] = useState(null);

    // ----------- Fetch product -------------
    useEffect(() => {
        if (!id) return;
        (async () => {
            try {
                const { data } = await axios.get(`${process.env.REACT_APP_API_URL}/products/${id}`);
                const prod = data?.data ?? data;

                setProduct(prod);

                const prodImages = (prod?.imageUrl || []).map((i) => i?.image_url).filter(Boolean);
                const variantImages = (prod?.variants || [])
                    .flatMap((v) => v?.imageUrl || [])
                    .map((img) => img?.imageUrl)
                    .filter(Boolean);

                const merged = [...new Set([...prodImages, ...variantImages])];
                setImages(merged.length ? merged : [PLACEHOLDER]);
            } catch (err) {
                console.error("Lỗi khi lấy sản phẩm:", err);
                setImages([PLACEHOLDER]);
            }
        })();
    }, [id]);

    // ----------- Helpers -------------

    /*     const safeImages = useMemo(() => {
            // Lấy tất cả ảnh từ các biến thể
            const variantImages = (product?.variants || [])
                .map((v) => v.imageUrl)
                .filter(Boolean);
    
            // Đưa ảnh variant đang chọn lên đầu
            const currentImage = selectedVariant?.imageUrl;
    
            const allImages = [
                ...(currentImage ? [currentImage] : []),
                ...variantImages,
            ];
    
            // Loại trùng (theo URL)
            return allImages.filter((v, i, arr) => arr.indexOf(v) === i);
        }, [product]); */
    const handleVariantChange = (variant) => {
        let variantImages = [];

        const imgData = variant?.imageUrl;

        if (Array.isArray(imgData)) {
            // ✅ Trường hợp là mảng
            variantImages = imgData.map((img) =>
                typeof img === "string" ? img : img?.imageUrl
            ).filter(Boolean);
        } else if (typeof imgData === "string") {
            // ✅ Trường hợp là chuỗi (1 ảnh)
            variantImages = [imgData];
        } else if (imgData && typeof imgData === "object") {
            // ✅ Trường hợp là object đơn (ví dụ { imageUrl: "..." })
            if (imgData.imageUrl) variantImages = [imgData.imageUrl];
        }

        // Nếu biến thể có ảnh riêng → hiển thị nó
        if (variantImages.length > 0) {
            setImages(variantImages);
            return;
        }

        // Nếu không → fallback sang ảnh của product
        const productImages = (product?.imageUrl || [])
            .map((i) => (typeof i === "string" ? i : i?.image_url))
            .filter(Boolean);

        setImages(productImages.length ? productImages : [PLACEHOLDER]);
    };


    const descHtml = product?.longDescription || "";

    const specsData = useMemo(() => product?.variants[0]?.specs ?? null, [product]);
    const notes = useMemo(() => product?.cautionNotes ?? null, [product]);
    const manual = useMemo(() => {
        const raw = product?.userManual;
        if (!raw) return null;

        let pdf = raw.pdf || null;
        let video = raw.video || null;
        let steps = [];

        // Nếu đã là mảng step "bình thường"
        if (Array.isArray(raw.steps)) {
            raw.steps.forEach((item) => {
                if (typeof item === "string") {
                    // Thử parse JSON bên trong
                    try {
                        const parsed = JSON.parse(item);

                        if (!pdf && parsed.pdf) pdf = parsed.pdf;
                        if (!video && parsed.video) video = parsed.video;

                        if (Array.isArray(parsed.steps)) {
                            steps.push(
                                ...parsed.steps.filter((s) => typeof s === "string")
                            );
                        }
                    } catch {
                        // Không phải JSON → coi như 1 câu step bình thường
                        steps.push(item);
                    }
                } else if (typeof item === "object" && item) {
                    // Trường hợp lỡ lưu object step
                    if (item.text && typeof item.text === "string") {
                        steps.push(item.text);
                    }
                }
            });
        }

        // Fallback: nếu chưa có step nào nhưng có raw.text
        if (!steps.length && typeof raw.text === "string") {
            steps.push(raw.text);
        }

        return {
            pdf,
            video,
            steps,
        };
    }, [product]);

    const origin = product?.origin ?? null;
    const stock = typeof product?.stock_quantity === "number" ? product.stock_quantity : null;

    const mainSettings = { arrows: true, fade: true, dots: false, adaptiveHeight: true };
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

    // ----------- Render -------------
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
                {/* Image gallery */}
                <div className="col-12 col-md-6">
                    <div className="product-slider bg-white p-3 rounded-4 shadow-sm position-relative">
                        {images.length ? (
                            <>
                                <Slider {...mainSettings} asNavFor={nav2} ref={setNav1} className="main-slider">
                                    {images.map((src, i) => (
                                        <div key={i}>
                                            <InnerImageZoom
                                                src={src}
                                                zoomSrc={src}
                                                zoomType="hover"
                                                zoomScale={1.2}
                                                alt={`Ảnh sản phẩm ${i + 1}`}
                                                className="img-fluid rounded-3"
                                                onError={(e) => (e.currentTarget.src = PLACEHOLDER)}
                                            />
                                        </div>
                                    ))}
                                </Slider>

                                {images.length > 1 && (
                                    <div className="mt-2">
                                        <Slider {...thumbSettings} asNavFor={nav1} ref={setNav2} className="thumb-slider">
                                            {images.map((src, i) => (
                                                <div key={i} className="px-1">
                                                    <img
                                                        src={src}
                                                        alt={`Thumb ${i + 1}`}
                                                        className="img-fluid rounded-2 thumb-img"
                                                        onError={(e) => (e.currentTarget.src = PLACEHOLDER)}
                                                    />
                                                </div>
                                            ))}
                                        </Slider>
                                    </div>
                                )}
                            </>
                        ) : (
                            <div className="text-center p-4 text-muted">
                                <img src={PLACEHOLDER} alt="No image" className="img-fluid rounded-3" style={{ maxWidth: 400, opacity: 0.7 }} />
                                <div className="mt-3">
                                    <i className="bi bi-image me-2"></i> Chưa có hình ảnh sản phẩm
                                </div>
                            </div>
                        )}
                        <span className="zoom-hint position-absolute bottom-0 end-0 m-2 badge bg-dark-subtle text-dark">
                            <i className="bi bi-zoom-in me-1"></i> Zoom
                        </span>
                    </div>
                </div>

                {/* Product info */}
                <div className="col-12 col-lg-6">
                    <ProductInfoPanel
                        product={product}
                        images={images}
                        onAddToCart={(item) => {
                            setCartPreview(item);
                            setShowModalCart(true);
                        }}
                        defaultQty={1}
                        onVariantChange={handleVariantChange}
                        onVariantsLoaded={setImages}
                    />

                    {/* Origin + stock badges */}
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
                    <ul className="nav nav-tabs rounded-top overflow-auto">
                        {[
                            { key: "desc", label: "Chi tiết sản phẩm" },
                            { key: "specs", label: "Thông số kỹ thuật" },
                            { key: "notes", label: "Lưu ý" },
                            { key: "manual", label: "Hướng dẫn sử dụng" },
                        ].map((tab) => (
                            <li key={tab.key} className="nav-item">
                                <button
                                    className={`nav-link ${activeTab === tab.key ? "active" : ""}`}
                                    onClick={() => setActiveTab(tab.key)}
                                >
                                    {tab.label}
                                </button>
                            </li>
                        ))}
                    </ul>

                    <div className="bg-white p-3 rounded-bottom shadow-sm border border-top-0">
                        {activeTab === "desc" && (
                            <div dangerouslySetInnerHTML={{ __html: descHtml }} />
                        )}
                        {activeTab === "specs" && <ProductSpecs specs={specsData} />}
                        {activeTab === "notes" && <CautionNotes notes={notes} />}
                        {activeTab === "manual" && (
                            <div className="vstack gap-3">
                                {/* Link PDF & Video nếu có */}
                                <div className="d-flex flex-wrap gap-2">
                                    {manual?.pdf && (
                                        <a
                                            href={manual.pdf}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="btn btn-sm btn-outline-primary"
                                        >
                                            <i className="bi bi-file-earmark-pdf me-1" />
                                            Xem hướng dẫn PDF
                                        </a>
                                    )}
                                    {manual?.video && (
                                        <a
                                            href={manual.video}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="btn btn-sm btn-outline-danger"
                                        >
                                            <i className="bi bi-play-circle me-1" />
                                            Xem video hướng dẫn
                                        </a>
                                    )}
                                </div>

                                {/* Danh sách các bước */}
                                {manual?.steps?.length ? (
                                    <ol className="ps-3 mb-0">
                                        {manual.steps.map((step, idx) => (
                                            <li key={idx} className="mb-1">
                                                {step}
                                            </li>
                                        ))}
                                    </ol>
                                ) : (
                                    <p className="text-muted mb-0">
                                        Chưa có hướng dẫn sử dụng chi tiết cho sản phẩm này.
                                    </p>
                                )}
                            </div>
                        )}

                    </div>
                </div>
            </div>

            {/* Related products (placeholder) */}
            <h2 className="mt-4 mb-2 fw-bold">Sản phẩm liên quan</h2>

            {/* Quick cart modal */}
            <ModalCart
                show={showModalCart}
                onClose={() => setShowModalCart(false)}
                product={cartPreview || product}
                images={images}
            />
        </div>
    );
}
