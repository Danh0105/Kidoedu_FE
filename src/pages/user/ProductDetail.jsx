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
import "../../components/user/css/ProductDetail.css";
import { ProductSpecs } from "./ProductSpecs";
import { height } from "@fortawesome/free-brands-svg-icons/fa11ty";

const PLACEHOLDER = "/placeholder-800x800.png";

// Chấp nhận: null | string (JSON) | string[]  →  mảng note chuẩn
const toCautionNotes = (caution) => {
    try {
        const arr = Array.isArray(caution)
            ? caution
            : (typeof caution === "string" && caution.trim()
                ? JSON.parse(caution) // backend có thể lưu JSON string "[]"
                : []);

        // map thành dạng CautionNote tối thiểu (severity mặc định: info)
        return (arr || []).map((text, idx) => ({
            id: `caution-${idx}`,
            severity: "info",
            icon: "bi-info-circle",
            title: typeof text === "string" ? text : String(text),
            note: "", // không có mô tả phụ thì để rỗng
            tags: ["caution"],
        }));
    } catch {
        return [];
    }
};

/* ----------------------------- CautionNotes UI ------------------------------
   - Tự tách bullet từ chuỗi dài (– ; • .)
   - Nhận diện nhãn (info|warning|danger) nếu có, ví dụ: "... (warning)"
   - Icon + badge màu Bootstrap, có "Xem thêm/Thu gọn"
   - Không dùng thư viện ngoài, an toàn với chuỗi thường; nếu là HTML thì để
     render theo cơ chế cũ (dangerouslySetInnerHTML) ở wrapper.
----------------------------------------------------------------------------- */
const CautionNotes = ({ notes, maxVisible = 6, showTitle = false, title = "Lưu ý quan trọng" }) => {
    const [expanded, setExpanded] = useState(false);

    const META = {
        info: { icon: "bi bi-info-circle-fill text-info", label: "Mẹo", badge: "text-bg-info" },
        warning: { icon: "bi bi-exclamation-triangle-fill text-warning", label: "Cảnh báo", badge: "text-bg-warning" },
        danger: { icon: "bi bi-exclamation-octagon-fill text-danger", label: "Nguy hiểm", badge: "text-bg-danger" },
        default: { icon: "bi bi-dot text-secondary", label: "Lưu ý", badge: "text-bg-secondary" },
    };

    // Không có dữ liệu
    if (!notes || (Array.isArray(notes) && notes.length === 0)) {
        return <p className="text-muted m-0">Chưa có lưu ý.</p>;
    }

    // Tách chuỗi thường thành các mục nhỏ
    const splitToItems = (text) => {
        const norm = String(text).replace(/\r\n|\n|\t/g, " ").replace(/\s{2,}/g, " ").trim();
        return norm
            .split(/\s+[–|-]\s+|;(?=\s)|\u2022|\•|\.\s+(?=[A-ZÀ-ỹ0-9])/g)
            .map((s) => s.trim())
            .filter(Boolean);
    };

    // Chuẩn hoá về mảng string
    const stringList = Array.isArray(notes)
        ? notes.flatMap((x) => (typeof x === "string" ? splitToItems(x) : [])).filter(Boolean)
        : (typeof notes === "string" ? splitToItems(notes) : []);

    if (stringList.length === 0) {
        return <p className="text-muted m-0">Chưa có lưu ý.</p>;
    }

    // Bóc nhãn (info|warning|danger) ở cuối câu, ví dụ: ".... (warning)"
    const parseItem = (s) => {
        const m = s.match(/\((info|warning|danger)\)\s*$/i);
        const level = m ? m[1].toLowerCase() : "default";
        const text = m ? s.replace(m[0], "").trim().replace(/[.;,]$/, "") : s;
        return { text, level };
    };

    const items = stringList.map(parseItem);
    const visible = expanded ? items : items.slice(0, maxVisible);
    const hiddenCount = Math.max(0, items.length - visible.length);

    return (
        <div className="d-flex flex-column gap-2">
            {showTitle && (
                <div className="d-flex align-items-center gap-2">
                    <i className="bi bi-shield-check text-primary" />
                    <strong className="mb-0">{title}</strong>
                </div>
            )}

            <ul className="list-unstyled m-0" role="list" aria-label="Lưu ý sản phẩm">
                {visible.map((it, i) => {
                    const meta = META[it.level] ?? META.default;
                    return (
                        <li key={i} className="d-flex align-items-start gap-2 py-1">
                            <i className={meta.icon} aria-hidden="true" />
                            <div>
                                <span className={`badge rounded-pill me-2 ${meta.badge}`}>{meta.label}</span>
                                <span>{it.text}</span>
                            </div>
                        </li>
                    );
                })}
            </ul>

            {hiddenCount > 0 && (
                <button
                    type="button"
                    className="btn btn-sm btn-outline-secondary align-self-start"
                    onClick={() => setExpanded((v) => !v)}
                    aria-expanded={expanded}
                >
                    {expanded ? "Thu gọn" : `Xem thêm ${hiddenCount} mục`}
                </button>
            )}
        </div>
    );
};

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

    // tabs
    const [activeTab, setActiveTab] = useState("desc"); // "desc" | "specs" | "notes" | "manual"

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
            const data = (res && res.data && (res.data.data ?? res.data)) || null;
            setProduct(data);
            const urls = (data?.images || []).map((i) => i?.image_url).filter(Boolean);
            setImages(urls.length ? urls : [PLACEHOLDER]);
        } catch (err) {
            console.error("Lỗi khi lấy sản phẩm:", err);
            setImages([PLACEHOLDER]);
        }
    };

    useEffect(() => {
        if (id) fetchProduct();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    // -------- render helpers (JSX thuần) --------

    // Wrapper giữ API cũ: gọi Component mới để không phá cấu trúc ở nơi dùng
    const renderCautionNotes = (notes) => {
        // Nếu là HTML string → vẫn render y như cũ (giữ behavior cũ)
        if (typeof notes === "string" && /<\/?[a-z][\s\S]*>/i.test(notes)) {
            return <div dangerouslySetInnerHTML={{ __html: notes }} />;
        }
        // Còn lại giao cho CautionNotes xử lý UI/UX đẹp
        return <CautionNotes notes={notes} />;
    };

    // --- Nâng cấp UI/UX cho phần Hướng dẫn sử dụng (drop-in) ---
    const renderManual = (manual) => {
        // Empty state
        if (!manual) return <p className="text-muted m-0">Chưa có hướng dẫn sử dụng.</p>;

        // 1) Chuỗi: nếu là HTML -> giữ nguyên (behavior cũ); nếu là text -> auto-bullet
        if (typeof manual === "string") {
            const looksHtml = /<\/?[a-z][\s\S]*>/i.test(manual);
            if (looksHtml) return <div dangerouslySetInnerHTML={{ __html: manual }} />;

            // Tự tách bước (– ; • . \n)
            const splitSteps = (text) =>
                String(text)
                    .replace(/\r\n/g, "\n")
                    .split(/\n+|\s+[–|-]\s+|;(?=\s)|\u2022|\•|\.\s+(?=[A-ZÀ-ỹ0-9])/g)
                    .map((s) => s.trim())
                    .filter(Boolean);

            const steps = splitSteps(manual);

            return steps.length ? (
                <ol className="manual-steps list-unstyled m-0">
                    {steps.map((s, i) => (
                        <li key={i} className="d-flex gap-2 align-items-start py-1">
                            <span className="badge rounded-pill bg-primary-subtle text-primary-emphasis me-1">{i + 1}</span>
                            <span>{s}</span>
                        </li>
                    ))}
                </ol>
            ) : (
                <p className="text-muted m-0">Chưa có hướng dẫn sử dụng.</p>
            );
        }

        // 2) Object: hỗ trợ { pdf, video, steps }
        const pdf = manual?.pdf;
        const video = manual?.video; // hỗ trợ link YouTube/Vimeo/file mp4
        const rawSteps = manual?.steps ?? [];

        // Chuẩn hoá steps: chấp nhận string | { title, desc } | { text }
        const normSteps = rawSteps
            .map((s) => {
                if (typeof s === "string") return { title: s };
                if (s && typeof s === "object") {
                    const title = s.title || s.text || "";
                    const desc = s.desc || s.description || "";
                    return { title, desc };
                }
                return null;
            })
            .filter(Boolean);

        // Helper: nhúng video responsive nếu là YouTube
        const renderVideo = (url) => {
            if (!url) return null;

            const yt = url.match(
                /^(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]{6,})/
            );
            if (yt) {
                const id = yt[1];
                return (
                    <div className="ratio ratio-16x9">
                        <iframe
                            src={`https://www.youtube.com/embed/${id}`}
                            title="Video hướng dẫn"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                            allowFullScreen
                        />
                    </div>
                );
            }

            // Fallback: link ra ngoài (không đổi cấu trúc)
            return (
                <a href={url} target="_blank" rel="noreferrer" className="btn btn-outline-danger btn-sm">
                    <i className="bi bi-youtube me-1" /> Xem video hướng dẫn
                </a>
            );
        };

        return (
            <div className="vstack gap-3">
                {/* Nút tài liệu nhanh */}
                {(pdf || video) && (
                    <div className="d-flex flex-wrap gap-2">
                        {pdf && (
                            <a href={pdf} target="_blank" rel="noreferrer" className="btn btn-outline-primary btn-sm">
                                <i className="bi bi-filetype-pdf me-1" /> Tải hướng dẫn PDF
                            </a>
                        )}
                        {/* Nếu là YouTube -> nhúng ngay bên dưới; nếu không phải, hiển thị nút */}
                        {!/youtu(\.be|be\.com)/i.test(String(video || "")) && video && renderVideo(video)}
                    </div>
                )}

                {/* Nhúng YouTube (nếu có) */}
                {/youtu(\.be|be\.com)/i.test(String(video || "")) && renderVideo(video)}

                {/* Danh sách bước dạng đẹp, dễ đọc */}
                {normSteps.length > 0 ? (
                    <ol className="manual-steps list-unstyled m-0">
                        {normSteps.map((s, i) => (
                            <li key={i} className="p-2 rounded-3 border bg-light-subtle mb-2">
                                <div className="d-flex align-items-start gap-2">
                                    <span className="badge rounded-pill bg-primary-subtle text-primary-emphasis">{i + 1}</span>
                                    <div className="flex-grow-1">
                                        <div className="fw-semibold">{s.title}</div>
                                        {s.desc && <div className="text-body-secondary small mt-1">{s.desc}</div>}
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ol>
                ) : !pdf && !video ? (
                    <p className="text-muted m-0">Chưa có hướng dẫn sử dụng.</p>
                ) : null}

                {/* Callouts khuyến nghị (tuỳ chọn, chỉ hiển thị khi có nội dung chính) */}
                {(normSteps.length > 0 || pdf || video) && (
                    <div className="alert alert-info d-flex align-items-start gap-2 mb-0">
                        <i className="bi bi-lightbulb"></i>
                        <div>
                            <strong>Mẹo:</strong> Khi bàn giao sản phẩm, hãy lưu tài liệu PDF vào mã QR trên tem dán để khách quét xem nhanh.
                        </div>
                    </div>
                )}
            </div>
        );
    };


    // badges: xuất xứ + tồn kho
    const origin = product?.origin ?? null;
    const stock =
        typeof product?.stock_quantity === "number" ? product?.stock_quantity : null;

    // Chuẩn hoá dữ liệu tab
    const descHtml = product?.long_description || "";
    const specsData = useMemo(() => product?.specs ?? null, [product]);
    const cautionNotes = useMemo(() => product?.caution_notes ?? null, [product]);
    const manualData = useMemo(() => product?.user_manual ?? null, [product]);

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
                <div className="col-12 col-md-6 h-100">
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

                    {/* Xuất xứ + Tồn kho */}
                    <div className="d-flex flex-wrap gap-2 mt-3">
                        {origin && (
                            <span className="badge bg-secondary-subtle text-secondary-emphasis">
                                <i className="bi bi-geo-alt me-1" /> Xuất xứ:{" "}
                                <strong className="ms-1">{origin}</strong>
                            </span>
                        )}
                        {typeof stock === "number" && (
                            <span
                                className={`badge ${stock > 0
                                    ? "bg-success-subtle text-success-emphasis"
                                    : "bg-danger-subtle text-danger-emphasis"
                                    }`}
                            >
                                <i className="bi bi-box-seam me-1" /> Tồn kho:{" "}
                                <strong className="ms-1">{stock}</strong>
                            </span>
                        )}
                    </div>
                </div>
            </div>

            {/* Tabs mô tả / thông số / lưu ý / hướng dẫn */}
            <div className="row mt-4">
                <div className="col-12">
                    {/* nav tabs */}
                    <ul className="nav nav-tabs rounded-top overflow-auto">
                        <li className="nav-item">
                            <button
                                className={`nav-link ${activeTab === "desc" ? "active" : ""}`}
                                onClick={() => setActiveTab("desc")}
                            >
                                Chi tiết sản phẩm
                            </button>
                        </li>
                        <li className="nav-item">
                            <button
                                className={`nav-link ${activeTab === "specs" ? "active" : ""}`}
                                onClick={() => setActiveTab("specs")}
                            >
                                Thông số kỹ thuật
                            </button>
                        </li>
                        <li className="nav-item">
                            <button
                                className={`nav-link ${activeTab === "notes" ? "active" : ""}`}
                                onClick={() => setActiveTab("notes")}
                            >
                                Lưu ý
                            </button>
                        </li>
                        <li className="nav-item">
                            <button
                                className={`nav-link ${activeTab === "manual" ? "active" : ""}`}
                                onClick={() => setActiveTab("manual")}
                            >
                                Hướng dẫn sử dụng
                            </button>
                        </li>
                    </ul>

                    {/* tab content */}
                    <div className="bg-white p-3 rounded-bottom shadow-sm border border-top-0">
                        {activeTab === "desc" && (
                            <div
                                className="product-description"
                                dangerouslySetInnerHTML={{ __html: descHtml }}
                            />
                        )}

                        {activeTab === "specs" && <ProductSpecs specs={specsData} />}

                        {activeTab === "notes" && <div>{renderCautionNotes(cautionNotes)}</div>}

                        {activeTab === "manual" && <div>{renderManual(manualData)}</div>}
                    </div>
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
