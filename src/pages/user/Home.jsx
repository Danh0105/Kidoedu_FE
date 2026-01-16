import "../../components/user/csss/Home.css";
import Carousel from "../../components/user/Carousel";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";
import { Menu, Cpu, ChevronRight, Layers } from "lucide-react";
import ProductHome from "../../components/user/ProductHome";
import ModalBuy from "../../components/user/ModalBuy";
import PromoRow from "../../components/user/PromoRow";
import {
    fetchCategoriesApi,
    fetchProductsByCategoryApi,

} from "../../services/Category";
import fetchBannersApi from "../../services/Banner";
import { fetchAllProductsApi } from "../../services/Product";
import useInViewOnce from "../../hooks/useInViewOnce";
import { useRef } from "react";
import AnimateCard from "../../components/user/AnimateCard";
import light from "../../assets/user/lightdecor.png"
import light1 from "../../assets/user/lightdecor1.png"
import sale from '../../assets/user/bannersale.png'
import ProductCard from '../../components/user/HomePage/ProductCard'
import CategorySidebar from "../../components/user/HomePage/CategorySidebar";
import ContentArea from "../../components/user/HomePage/ContentArea"
// ======================= Helpers =======================


const Ribbon = ({ text, position, className }) => (
    <span
        className={`position-absolute top-0 ${position === "left" ? "start-0 ms-2" : "end-0 me-2"
            } mt-2 badge ${className} px-3 d-flex align-items-center fst-italic shadow-sm`}
        style={{
            borderTopLeftRadius: position === "left" ? 0 : "999rem",
            borderTopRightRadius: position === "right" ? 0 : "999rem",
            borderBottomLeftRadius: "999rem",
            borderBottomRightRadius: "999rem",
            height: 32,
            zIndex: 3,
            pointerEvents: "none",
        }}
    >
        {text}
    </span>
);



/** Helper: lấy basePrice/promoPrice/finalPrice từ 1 variant (dùng cho ProductCard) */
function pickPricesFromVariant(variant) {
    if (!variant) {
        return {
            basePrice: null,
            promoPrice: null,
            finalPrice: 0,
            hasPromo: false,
        };
    }

    const prices = Array.isArray(variant.prices) ? variant.prices : [];
    let baseRecord = null;
    let promoRecord = null;

    prices.forEach((p) => {
        if (!p) return;
        if (p.priceType === "base") {
            if (!baseRecord || new Date(p.startAt) > new Date(baseRecord.startAt)) {
                baseRecord = p;
            }
        }
        if (p.priceType === "promo") {
            if (!promoRecord || new Date(p.startAt) > new Date(promoRecord.startAt)) {
                promoRecord = p;
            }
        }
    });

    const basePrice = baseRecord ? Number(baseRecord.price) : null;
    const promoPrice = promoRecord ? Number(promoRecord.price) : null;
    const finalPrice = promoPrice ?? basePrice ?? 0;
    const hasPromo =
        promoPrice != null && (basePrice ?? promoPrice) > promoPrice;

    return { basePrice, promoPrice, finalPrice, hasPromo };
}

// ======================= Component =======================

export default function Home({ apiBase = `${process.env.REACT_APP_API_URL}` }) {
    // ---- State
    const [allCats, setAllCats] = useState([]); // tất cả danh mục (chuẩn hoá id/parent)
    const [rootCats, setRootCats] = useState([]); // danh mục gốc
    const [hoverCatId, setHoverCatId] = useState(null); // id danh mục gốc đang hover
    const [hoverPanel, setHoverPanel] = useState(null);
    const [showHoverPanel, setShowHoverPanel] = useState(false); // đang hiển thị panel danh mục con
    const [selectedCatId, setSelectedCatId] = useState(null);

    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(false);

    const [allProducts, setAllProducts] = useState([]);
    const [featuredProducts, setFeaturedProducts] = useState([]);
    const [newProducts, setNewProducts] = useState([]);

    const [showAllFeatured, setShowAllFeatured] = useState(false);
    const [showAllNew, setShowAllNew] = useState(false);

    const [showModalBuy, setShowModalBuy] = useState(false);
    const [buyProduct, setBuyProduct] = useState(null);

    const newSectionRef = useRef(null);
    const featuredSectionRef = useRef(null);

    const showNewSection = useInViewOnce(newSectionRef);
    const showFeaturedSection = useInViewOnce(featuredSectionRef);

    const scrollRef = useRef(null);
    // Stable axios instance
    const api = useMemo(
        () =>
            axios.create({
                baseURL: (apiBase || "").replace(/\/+$/, ""),
                timeout: 15000,
            }),
        [apiBase]
    );

    // ======================= Data fetching =======================
    const fetchCategories = useCallback(async () => {
        try {
            const all = await fetchCategoriesApi();

            const norm = all.map((c) => ({
                ...c,
                _id: c.categoryId ?? c.category_id ?? c.id,
                _parentId:
                    c.parentId ??
                    (typeof c.parent === "object" && c.parent
                        ? c.parent.categoryId ?? c.parent.id ?? c.parent.category_id
                        : c.parent ?? null),
                _name: c.categoryName ?? c.name,
            }));

            setAllCats(norm);
            setRootCats(norm.filter((c) => c._parentId === null));
        } catch (e) {
            console.error("fetchCategories error:", e);
        }
    }, []);


    const fetchProducts = useCallback(async () => {
        try {
            const list = await fetchAllProductsApi();
            setAllProducts(list);

            setNewProducts(list.filter(p => (p.status & 1) > 0));
            setFeaturedProducts(list.filter(p => (p.status & 2) > 0));
        } catch (e) {
            console.error("fetchProducts error:", e);
        }
    }, []);


    // ==== Actions chung khi rời toàn bộ khu vực menu + panel
    const handleLeaveAll = useCallback(() => {
        setHoverCatId(null);
        setShowHoverPanel(false);
        setSelectedCatId(null);
    }, []);

    const fetchProductsByCategory = useCallback(async (categoryId) => {
        try {
            const id = categoryId ?? selectedCatId;
            if (!id) return;

            setLoading(true);
            const items = await fetchProductsByCategoryApi(id);
            setItems(items);
        } catch (e) {
            console.error("fetchProductsByCategory error:", e);
        } finally {
            setLoading(false);
        }
    }, [selectedCatId]);


    // Initial load
    useEffect(() => {
        fetchCategories();
        fetchProducts();
    }, [fetchCategories, fetchProducts]);

    // Khi click chọn danh mục (con) → tải sản phẩm
    useEffect(() => {
        if (selectedCatId != null) fetchProductsByCategory(selectedCatId);
    }, [selectedCatId, fetchProductsByCategory]);

    // ========== Derived: children by hovered root ==========
    const childrenOfHover = useMemo(() => {
        if (!hoverCatId) return [];
        return allCats.filter((c) => String(c._parentId) === String(hoverCatId));
    }, [allCats, hoverCatId]);

    // ======================= Actions =======================
    const handleBuy = useCallback(
        (id) => {
            const found = allProducts.find((p) => p?.productId === id) || null;
            setBuyProduct(found);
            setShowModalBuy(true);
        },
        [allProducts]
    );
    const [banners, setBanners] = useState([]);
    const getBanner = (id) => banners?.find((b) => b.id === id);
    const frameproductN = getBanner(10);
    const frameproductP = getBanner(11);
    // Stable axios instance
    const loadBanners = async () => {
        try {
            const data = await fetchBannersApi();
            setBanners(data);
        } catch (e) {
            console.error("fetchBanners error:", e);
        }
    };


    useEffect(() => {
        loadBanners();
    }, []);

    return (
        <div >
            <div className="container py-4 bg-white bg-opacity-75 rounded-4 shadow-sm">
                {/* Desktop layout: Sidebar + Content */}
                <div
                    className="d-none d-md-flex"
                    onMouseLeave={handleLeaveAll}
                >
                    <CategorySidebar
                        rootCats={rootCats}
                        hoverCatId={hoverCatId}
                        setHoverCatId={setHoverCatId}
                        setShowHoverPanel={setShowHoverPanel}
                        setSelectedCatId={setSelectedCatId}
                    />
                    <div
                        ref={scrollRef}
                        style={{ overflowY: "auto", flex: 1 }}
                    >
                        <ContentArea
                            selectedCatId={selectedCatId}
                            loading={loading}
                            items={items}
                            showHoverPanel={showHoverPanel}
                            hoverPanel={hoverPanel}
                            hoverCatId={hoverCatId}
                            setSelectedCatId={setSelectedCatId}
                            setShowHoverPanel={setShowHoverPanel}
                            setHoverCatId={setHoverCatId}
                            rootCats={rootCats}
                            childrenOfHover={childrenOfHover}
                        />
                    </div>
                </div>

                <PromoRow
                    items={[
                        {
                            src: "https://cdn.tgdd.vn/Files/2021/12/27/1406967/tivi-samsung-giam-cuc-soc-den-28-mua-cuoi-nam.jpg",
                            href: "https://cdn.tgdd.vn/Files/2021/12/27/1406967/tivi-samsung-giam-cuc-soc-den-28-mua-cuoi-nam.jpg",
                            alt: "Duy nhất 11.11 - Nồi cơm PHILIPS",
                        },
                        {
                            src: "https://cdn11.dienmaycholon.vn/filewebdmclnew/DMCL21/Picture//Tm/Tm_picture_3053/1111_244_800.png.webp",
                            href: "https://cdn11.dienmaycholon.vn/filewebdmclnew/DMCL21/Picture//Tm/Tm_picture_3053/1111_244_800.png.webp",
                            alt: "Thách đấu online - Giảm đến 50%",
                        },
                        {
                            src: "https://mediamart.vn/images/uploads/2023/6e6eff39-2dc5-4a93-809b-fff5eab21d4f.png",
                            href: "https://mediamart.vn/images/uploads/2023/6e6eff39-2dc5-4a93-809b-fff5eab21d4f.png",
                            alt: "Lễ hội máy sấy - Giá từ 3.990 triệu",
                        },
                    ]}
                />
                {/* Sản phẩm sale */}
                <div className="d-flex justify-content-center">
                    <img src={sale} alt="" className="image-sale" />
                </div>
                <section className="bg-product-featured p-2" ref={featuredSectionRef}>


                    <div className="row justify-content-center">
                        {showFeaturedSection ? (
                            (showAllFeatured ? featuredProducts : featuredProducts.slice(0, 4)).map(
                                (p) => (
                                    <ProductCard
                                        key={p.productId}
                                        p={p}
                                        banners={frameproductP}
                                        className={`col-12 col-sm-6 col-md-4 col-lg-3 mb-4 appear ${showFeaturedSection ? "is-visible" : ""}`}
                                    />
                                )
                            )
                        ) : (
                            Array.from({ length: 4 }).map((_, i) => (
                                <div key={i} className="col-12 col-sm-6 col-md-4 col-lg-3 mb-4">
                                    <div className="card placeholder-glow h-100">
                                        <div className="placeholder w-100" style={{ height: 220 }} />
                                        <div className="card-body">
                                            <span className="placeholder col-8" />
                                            <span className="placeholder col-5 mt-2" />
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    {featuredProducts.length > 4 && (
                        <div className="text-center mt-3">
                            <button
                                onClick={() => setShowAllFeatured((v) => !v)}
                                className="btn btn-outline-danger rounded-pill px-4"
                            >
                                {showAllFeatured ? "Thu gọn" : "Xem thêm"}
                            </button>
                        </div>
                    )}
                </section>
                {/* Sản phẩm mới */}
                <section className="my-5 bg-product-new p-2 " ref={newSectionRef}>
                    <div className="d-flex justify-content-between">
                        <div>
                            <img className="lig" src={light} alt="Đèn lồng ngày tết" />
                        </div>
                        <div>
                            <div className="bg-img-np">
                                <h2 className="fw-bold " style={{ fontSize: "2rem" }}>
                                    🆕 Sản phẩm mới
                                </h2>
                            </div>

                            <div
                                style={{
                                    height: 3,
                                    width: 80,
                                    backgroundColor: "hsl(0,75%,60%)",
                                    margin: "10px auto",
                                    borderRadius: 3,
                                }}
                            />
                        </div>
                        <div>
                            <img className="lig" src={light} alt="Đèn lồng ngày tết" />
                        </div>
                    </div>
                    <div className="row justify-content-center">
                        {showNewSection ? (
                            (showAllNew ? newProducts : newProducts.slice(0, 4)).map((p) => (

                                <ProductCard
                                    key={p.productId}
                                    p={p}
                                    banners={frameproductN}
                                    className={`col-12 col-sm-6 col-md-4 col-lg-3 mb-4 appear ${showNewSection ? "is-visible" : ""}`}
                                />
                            ))
                        ) : (
                            Array.from({ length: 4 }).map((_, i) => (
                                <div key={i} className="col-12 col-sm-6 col-md-4 col-lg-3 mb-4">
                                    <div className="card placeholder-glow h-100">
                                        <div className="placeholder w-100" style={{ height: 220 }} />
                                        <div className="card-body">
                                            <span className="placeholder col-8" />
                                            <span className="placeholder col-5 mt-2" />
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    {newProducts.length > 4 && (
                        <div className="text-center mt-3">
                            <button
                                onClick={() => setShowAllNew((v) => !v)}
                                className="btn btn-outline-danger rounded-pill px-4"
                            >
                                {showAllNew ? "Thu gọn" : "Xem thêm"}
                            </button>
                        </div>
                    )}
                </section>

                {/* Sản phẩm nổi bật */}
                <section className="my-5 bg-product-featured p-2" ref={featuredSectionRef}>

                    <div className="d-flex justify-content-between">
                        <div>
                            <img className="lig" src={light1} alt="Đèn lồng ngày tết" />
                        </div>
                        <div>
                            <div className="bg-img-np">
                                <h2 className="fw-bold " style={{ fontSize: "2rem" }}>
                                    ⭐ Sản phẩm nổi bật
                                </h2>
                            </div>

                            <div
                                style={{
                                    height: 3,
                                    width: 80,
                                    backgroundColor: "hsl(0,75%,60%)",
                                    margin: "10px auto",
                                    borderRadius: 3,
                                }}
                            />
                        </div>
                        <div>
                            <img className="lig" src={light1} alt="Đèn lồng ngày tết" />
                        </div>
                    </div>
                    <div className="row justify-content-center">
                        {showFeaturedSection ? (
                            (showAllFeatured ? featuredProducts : featuredProducts.slice(0, 4)).map(
                                (p) => (
                                    <ProductCard
                                        key={p.productId}
                                        p={p}
                                        banners={frameproductP}
                                        className={`col-12 col-sm-6 col-md-4 col-lg-3 mb-4 appear ${showFeaturedSection ? "is-visible" : ""}`}
                                    />
                                )
                            )
                        ) : (
                            Array.from({ length: 4 }).map((_, i) => (
                                <div key={i} className="col-12 col-sm-6 col-md-4 col-lg-3 mb-4">
                                    <div className="card placeholder-glow h-100">
                                        <div className="placeholder w-100" style={{ height: 220 }} />
                                        <div className="card-body">
                                            <span className="placeholder col-8" />
                                            <span className="placeholder col-5 mt-2" />
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    {featuredProducts.length > 4 && (
                        <div className="text-center mt-3">
                            <button
                                onClick={() => setShowAllFeatured((v) => !v)}
                                className="btn btn-outline-danger rounded-pill px-4"
                            >
                                {showAllFeatured ? "Thu gọn" : "Xem thêm"}
                            </button>
                        </div>
                    )}
                </section>

            </div>

            {/* Modal Buy (global) */}
            <ModalBuy
                show={showModalBuy}
                onClose={() => setShowModalBuy(false)}
                product={buyProduct || {}}
            />
        </div>
    );
}


