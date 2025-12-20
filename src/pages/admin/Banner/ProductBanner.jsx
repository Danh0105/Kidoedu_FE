import axios from "axios";
import "../../../components/admin/css/ProductCardBanner.css";
import "../../../components/admin/css/ProductDetailBanner.css";
import { useEffect, useState } from "react";
const API = process.env.REACT_APP_API_URL;

export default function ProductBanner() {
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

    const getBanner = (id) => banners?.find((b) => b.id === id);

    const openUploadFor = (id) => {
        setCurrentId(id);
        document.getElementById("bannerInputP").click();
    };

    const uploadImage = async (e) => {
        const file = e.target.files[0];
        if (!file || !currentId) return;

        const form = new FormData();
        form.append("image", file);
        console.log(currentId);

        await axios.patch(`${API}/banners/${currentId}`, form, {
            headers: { "Content-Type": "multipart/form-data" },
        });

        await loadBanners();

        // Reset input file
        e.target.value = "";
        setCurrentId(null);
    };

    return (
        <div className="product-banner-layout mt-4">

            <input
                id="bannerInputP"
                type="file"
                className="d-none"
                onChange={(e) => {
                    console.log("File selected:", e.target.files[0]);
                    uploadImage(e);
                }}
            />

            <div className="d-flex justify-content-center gap-5">
                <ProductCard
                    getBanner={getBanner}
                    openUploadFor={openUploadFor}
                    API={API}
                />
                ``

                <ProductDetail
                    getBanner={getBanner}
                    openUploadFor={openUploadFor}
                    API={API}
                />
            </div>
        </div>
    );
}


/* ===========================================================
   COMPONENT: BannerBox — tách ra ngoài để dùng chung
=========================================================== */
function BannerBox({ id, label, className, getBanner, openUploadFor, API }) {
    const data = getBanner(id);

    return (
        <button
            type="button"
            className={`${className} btn z-1`}
            onClick={(e) => {
                console.log("Upload banner ID:", id);
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
}


/* ===========================================================
   COMPONENT: CardBanner
=========================================================== */
function ProductCard({ getBanner, openUploadFor, API }) {
    const banner = getBanner(12); // banner bạn đang sửa bằng admin

    return (
        <div className="product-card">

            {/* Vùng ảnh */}
            <div className="product-image-wrapper">
                <img
                    src="https://dummyimage.com/600x300/eee/aaa" // ảnh sản phẩm demo
                    alt="product"
                    className="product-image"
                />

                {/* Banner khuyến mãi đè lên ảnh */}
                <div
                    className="promo-banner "
                    onClick={() => openUploadFor(12)}
                    style={{ cursor: "pointer" }}
                >
                    {banner?.imageUrl && (
                        <img
                            src={`${API}${banner.imageUrl}`}
                            alt="promo"
                            className="promo-imgP"
                        />
                    )}
                </div>
            </div>

            {/* Tên sản phẩm */}
            <div className="product-title">Máy Lạnh LG Inverter</div>

            {/* Mô tả */}
            <div className="product-desc">
                Tính năng nổi bật: Công suất lạnh: 1HP - 9.300 BTU...
            </div>

            {/* Giá */}
            <div className="product-price">
                8.990.000 đ - 14.190.000 đ
            </div>

            {/* Tag */}
            <div className="product-tags">
                <span className="tag t1">Freeship</span>
                <span className="tag t2">Trả góp 0%</span>
                <span className="tag t3">Đổi trả 7N</span>
            </div>

            {/* Nút */}
            <div className="product-actions">
                <button className="btn-add">Thêm vào giỏ</button>
                <button className="btn-buy">Mua ngay</button>
            </div>
        </div>
    );
}



/* ===========================================================
   COMPONENT: ProductDetailLayout
=========================================================== */
function ProductDetail({ getBanner, API, openUploadFor }) {
    const banner = getBanner(13);

    return (
        <div className="product-detail">

            {/* ====== TITLE ====== */}
            <h2 className="pd-title">
                Máy Lạnh LG Inverter - 1 Hp
            </h2>

            {/* SKU & BRAND TAGS */}
            <div className="pd-tags">
                <span className="tag sku">Mã: #30</span>
                <span className="tag sku-red">SKU: IEO9M1</span>
                <span className="tag brand">Samsung</span>
            </div>

            {/* ====== VARIANTS ====== */}
            <h5 className="pd-section-title">Chọn phiên bản</h5>
            <div className="pd-variants">
                <button className="variant active">1 Hp</button>
                <button className="variant">1.5 Hp</button>
            </div>

            {/* ====== PROMO BANNER ====== */}
            <div
                className="pd-banner-wrapper"
                onClick={() => openUploadFor(13)}
                style={{ cursor: "pointer" }}
            >
                <img
                    src={`${API}${banner?.imageUrl}`}
                    alt="promo"
                    className="pd-banner-img"
                />
            </div>

            {/* ====== ATTRIBUTES ====== */}
            <div className="pd-attributes-box">
                <h5>Thuộc tính của 1 Hp</h5>
                <div className="pd-attributes">
                    <span className="attr">Màu: Xanh</span>
                    <span className="attr">Màu: Đỏ</span>
                </div>
            </div>

            {/* ====== SHORT DESCRIPTION ====== */}
            <p className="pd-description">
                Tính năng nổi bật:Công suất lạnh: 1HP - 9.300 BTU
                Sản xuất tại Thái LanTiêu thụ điện: 0.84 kW/hHệ
                số tiết kiệm năng lượng 5.21Công nghệ Gold-Fin chống ăn mòn
                Điều khiển bằng điện thoại, có wifiThổi gió dễ chịu (cho trẻ em, người già)
                Công nghệ Inverter - Mẫu 2025
            </p>

            {/* ====== PRICE ====== */}
            <div className="pd-price-row">
                <div className="pd-price-main">8.990.000 đ</div>
                <div className="pd-price-old">11.590.000 đ</div>
                <div className="pd-badge red">Giảm giá</div>
                <div className="pd-badge green">Miễn phí vận chuyển</div>
            </div>

            {/* ====== ADD TO CART ====== */}
            <div className="pd-buy-row">
                <div className="qty-box">
                    <button>-</button>
                    <div>1</div>
                    <button>+</button>
                </div>

                <button className="btn-addcart">+ Thêm giỏ hàng</button>
                <button className="btn-buy">Mua ngay</button>
            </div>

            {/* ====== SERVICE ICONS ====== */}
            <div className="pd-services">
                <div className="service">
                    🔒 Bảo hành chính hãng
                </div>
                <div className="service">
                    🚚 Giao nhanh toàn quốc
                </div>
                <div className="service">
                    🔄 Đổi trả trong 7 ngày
                </div>
            </div>
        </div>
    );
}

