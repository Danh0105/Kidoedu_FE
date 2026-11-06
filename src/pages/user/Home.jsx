

import "../../components/user/csss/Home.css";
import React, {
    useCallback,
    useEffect,
    useMemo,
    useState,
    useRef,
    lazy,
    Suspense,

} from "react";
import {
    fetchCategoriesApi,
    fetchProductsByCategoryApi,
} from "../../services/Category";
import { fetchBannersApi, fetchBannersSlideApi } from "../../services/Banner";
import { fetchHomeProductsApi } from "../../services/Product";
import useInViewOnce from "../../hooks/useInViewOnce";
import light from "../../assets/user/lightdecor.png";
import light1 from "../../assets/user/lightdecor1.png";
import sale from '../../assets/user/bannersale.png';
import { getHomeDataUltraFast } from "../../services/promotion";
import { useSEO } from "../../hooks/useSEO";
const PromoRow = lazy(() => import("../../components/user/PromoRow"));
const ProductCard = lazy(() => import("../../components/user/HomePage/ProductCard"));
const CategorySidebar = lazy(() => import("../../components/user/HomePage/CategorySidebar"));
const ContentArea = lazy(() => import("../../components/user/HomePage/ContentArea"));
const ViewProducts = lazy(() => import("../../components/user/HomePage/ViewProducts"));
// ======================= Component =======================

export default function Home() {
    // ---- State
    const [allCats, setAllCats] = useState([]);
    const [rootCats, setRootCats] = useState([]);
    const [hoverCatId, setHoverCatId] = useState(null);
    const [showHoverPanel, setShowHoverPanel] = useState(false);
    const [selectedCatId, setSelectedCatId] = useState(null);

    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(false);

    const [featuredProducts, setFeaturedProducts] = useState([]);
    const [newProducts, setNewProducts] = useState([]);

    const [showAllFeatured, setShowAllFeatured] = useState(false);
    const [showAllNew, setShowAllNew] = useState(false);

    const newSectionRef = useRef(null);
    const featuredSectionRef = useRef(null);

    const showNewSection = useInViewOnce(newSectionRef);
    const showFeaturedSection = useInViewOnce(featuredSectionRef);
    const isDesktop = useIsDesktop();
    const scrollRef = useRef(null);
    const [promotionProducts, setPromotionProducts] = useState([]);
    const [promotion, setPromotion] = useState(null);
    const load = () => getHomeDataUltraFast().then(setPromotion);

    const [bannersSlide, setBannersSlide] = useState([]);

    const loaded = useRef(false);
    const loadBanner = useCallback(async () => {
        if (loaded.current) return;

        loaded.current = true;

        const res = await fetchBannersSlideApi();
        setBannersSlide(res);
    }, []);


    // cố định playout
    useEffect(() => {
        document.documentElement.style.overflowX = "hidden";
        document.body.style.overflowX = "hidden";

        return () => {
            document.documentElement.style.overflowX = "";
            document.body.style.overflowX = "";
        };
    }, []);

    //     // màn desktop 
    function useIsDesktop() {
        const get = () => window.matchMedia("(min-width: 992px)").matches; // Bootstrap lg breakpoint
        const [isDesktop, setIsDesktop] = useState(get);
        useEffect(() => {
            const mq = window.matchMedia("(min-width: 992px)");
            const handler = () => setIsDesktop(mq.matches);
            mq.addEventListener?.("change", handler);
            window.addEventListener("resize", handler);
            return () => {
                mq.removeEventListener?.("change", handler);
                window.removeEventListener("resize", handler);
            };
        }, []);
        return isDesktop;
    }


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


    const fetchHomeProducts = useCallback(async () => {
        try {
            const res = await fetchHomeProductsApi();
            console.log("Home products:", res);
            setNewProducts(res.newProducts || []);
            setFeaturedProducts(res.featuredProducts || []);
            setPromotionProducts(res.promotionProducts || []);

        } catch (e) {
            console.error("fetchHomeProducts error:", e);
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
        fetchHomeProducts();
        loadBanner();
    }, [fetchCategories, fetchHomeProducts, loadBanner]);

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



    const buildImageUrl = (image) => {
        if (!image) return null;

        if (image.startsWith("/uploads")) {
            return `${process.env.REACT_APP_API_URL}${image}`;
        }

        return image; // static hoặc http
    };

    useSEO({
        title: "KIDO EDU | Giải pháp công nghệ – giáo dục – chuyển đổi số",
        description:
            "KIDO EDU cung cấp giải pháp công nghệ, thiết bị giáo dục, chuyển đổi số toàn diện cho trường học và doanh nghiệp.",
        canonical: "https://kidoedu.vn/",
    });

    useEffect(() => {
        loadBanners();
        load();
    }, []);
    if (isDesktop) {
        return (
            <div >
                <div className="container py-4 bg-white bg-opacity-75 rounded-4 shadow-sm">
                    {/* Desktop layout: Sidebar + Content */}
                    <div
                        className="d-none d-md-flex gap-1"
                        onMouseLeave={handleLeaveAll}
                        style={{ height: 525 }}
                    >
                        <Suspense fallback={<div>Loading...</div>}>
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
                                className="bg-white"
                            >
                                {/*  */}
                                <ContentArea
                                    selectedCatId={selectedCatId}
                                    loading={loading}
                                    items={items}
                                    showHoverPanel={showHoverPanel}
                                    hoverCatId={hoverCatId}
                                    setSelectedCatId={setSelectedCatId}
                                    setShowHoverPanel={setShowHoverPanel}
                                    setHoverCatId={setHoverCatId}
                                    rootCats={rootCats}
                                    childrenOfHover={childrenOfHover}
                                    bannersSlide={bannersSlide}
                                />
                            </div>
                        </Suspense>
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

                    {/* Slider danh mục / sản phẩm ngang */}
                    {/*      <section className="my-4">
                        <ProductSlider />
                    </section> */}

                    {/* Sản phẩm sale */}
                    {(promotion || []).map((promo, index) => {

                        const products = promo.products || [];

                        return (
                            <div key={index} className="mb-5">

                                {/* Section */}
                                <section className="bg-product-featured p-3">

                                    <div className="w-100 text-center">
                                        <h2 className="fw-bold" style={{ fontSize: "2rem" }}>
                                            🎁 {promo.name}
                                        </h2>

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

                                    <div className="row justify-content-center">
                                        <Suspense fallback={<div>Loading...</div>}>

                                            {products.map((p) => (

                                                <ProductCard
                                                    key={p.productId}
                                                    p={p}
                                                    banners={frameproductN}
                                                    className="col-12 col-sm-6 col-md-4 col-lg-3 mb-4"
                                                />

                                            ))}

                                        </Suspense>
                                    </div>

                                </section>

                            </div>
                        );
                    })}



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
                            <Suspense fallback={<div>Loading...</div>}>
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
                            </Suspense>
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

                    {/* ===== SẢN PHẨM ĐÃ XEM  ===== */}
                    <section
                        style={{
                            marginTop: 32,
                            padding: "0 8px",
                            overflowX: "hidden",
                        }}
                    >
                        <div className="text-center mb-3">
                            <h5 className="fw-bold display-6 text-uppercase">
                                Sản phẩm đã xem
                            </h5>
                            <p className="text-muted">
                                Những sản phẩm bạn đã quan tâm gần đây
                            </p>
                            <div
                                style={{
                                    height: 3,
                                    width: 60,
                                    backgroundColor: "hsl(0,75%,60%)",
                                    margin: "0 auto",
                                    borderRadius: 3,
                                }}
                            />
                        </div>

                        <Suspense fallback={<div>Loading...</div>}>
                            <ViewProducts banners={frameproductP} />
                        </Suspense>
                    </section>

                </div>

                {/* Modal Buy (global) */}

            </div>
        );
    }


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
                            hoverCatId={hoverCatId}
                            setSelectedCatId={setSelectedCatId}
                            setShowHoverPanel={setShowHoverPanel}
                            setHoverCatId={setHoverCatId}
                            rootCats={rootCats}
                            childrenOfHover={childrenOfHover}
                        />
                    </div>
                </div>
                <Suspense fallback={null}>
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
                </Suspense>
                {/* Slider danh mục / sản phẩm ngang */}
                {/* <section className="my-4">
                    <ProductSlider />
                </section> */}

                {/* Sản phẩm sale */}
                {promotionProducts.length > 0 ? (
                    <>
                        <div className="d-flex justify-content-center">
                            <img src={sale} alt="sale" className="image-sale" />
                        </div>

                        <section className="bg-product-featured p-2" >
                            <div className="row justify-content-center">
                                <Suspense fallback={<div>Loading...</div>}>
                                    {promotionProducts.map(p => (
                                        <ProductCard
                                            key={p.productId}
                                            p={p}
                                            promotion={p.promotion}
                                            banners={frameproductP}
                                            className="col-12 col-sm-6 col-md-4 col-lg-3 mb-4 appear is-visible"
                                        />
                                    ))}
                                </Suspense>
                            </div>

                            {promotionProducts.length > 4 && (
                                <div className="text-center mt-3">
                                    <button
                                        onClick={() => setShowAllFeatured(v => !v)}
                                        className="btn btn-outline-danger rounded-pill px-4"
                                    >
                                        {showAllFeatured ? "Thu gọn" : "Xem thêm"}
                                    </button>
                                </div>
                            )}
                        </section>
                    </>
                ) : (
                    <></>
                )}




                {/* ===== 4. SLIDER DANH MỤC / SẢN PHẨM ===== */}
                {/* <section
                    style={{
                        marginTop: 16,
                        padding: "0 8px",
                        overflowX: "hidden",
                    }}
                >l
                    <ProductSlider />
                </section> */}

                {/* ===== 5. SẢN PHẨM MỚI ===== */}
                <section style={{ marginTop: 24, padding: "0 8px" }}>
                    <h4
                        style={{
                            textAlign: "center",
                            fontWeight: 700,
                            marginBottom: 12,
                        }}
                    >
                        Sản phẩm mới
                    </h4>

                    <div className="row row-cols-1 row-cols-sm-2 g-3">
                        <Suspense fallback={<div>Loading...</div>}>
                            {newProducts.map((p) => (
                                <div className="col" key={p.productId}>
                                    <ProductCard
                                        p={p}
                                        banners={frameproductN}
                                    />
                                </div>
                            ))}
                        </Suspense>
                    </div>
                </section>

                {/* ===== 6. SẢN PHẨM NỔI BẬT ===== */}
                <section style={{ marginTop: 24, padding: "0 8px" }}>
                    <h4
                        style={{
                            textAlign: "center",
                            fontWeight: 700,
                            marginBottom: 12,
                        }}
                    >
                        Sản phẩm nổi bật
                    </h4>

                    <div className="row row-cols-1 row-cols-sm-2 g-3">
                        <Suspense fallback={<div>Loading...</div>}>
                            {featuredProducts.map((p) => (
                                <div className="col" key={p.productId}>
                                    <ProductCard
                                        p={p}
                                        banners={frameproductP}
                                    />
                                </div>
                            ))}
                        </Suspense>
                    </div>
                </section>

                {/* ===== SẢN PHẨM ĐÃ XEM (SLIDER) ===== */}
                <section
                    style={{
                        marginTop: 16,
                        padding: "0 8px",
                        overflowX: "hidden",
                    }}
                >
                    {/* Tiêu đề */}
                    <div className="text-center mb-3">
                        <h5 className="fw-bold text-uppercase mb-2">
                            Sản phẩm đã xem
                        </h5>
                        <div
                            style={{
                                height: 3,
                                width: 60,
                                backgroundColor: "hsl(0,75%,60%)",
                                margin: "0 auto",
                                borderRadius: 3,
                            }}
                        />
                    </div>

                    {/* Danh sách sản phẩm đã xem */}
                    <ViewProducts banners={frameproductP} />
                </section>


            </div>


        </div>
    );


}