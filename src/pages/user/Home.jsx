import "../../App.css";
import CDS from "../../assets/user/CDS.png";
import STEM from "../../assets/user/STEM.png";
import ROBOT from "../../assets/user/ROBOT.png";
import Carousel from "../../components/user/Carousel";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";
import { Menu, Tv, Smartphone, Cpu, Wrench, HomeIcon, Gem, Zap, Gift } from "lucide-react";
import ProductHome from "../../components/user/ProductHome";
import ModalBuy from "../../components/user/ModalBuy";

// --- Ribbon helper (2 góc khi status = 12) ---
const pickRibbonsFromStatus = (raw) => {
    const s = Number(raw ?? 0);
    if (s === 2) return [{ text: "Mới", className: "bg-danger", position: "left" }];
    if (s === 1) return [{ text: "Nổi bật", className: "bg-warning text-dark", position: "left" }];
    if (s === 12)
        return [
            { text: "Mới", className: "bg-danger", position: "left" },
            { text: "Nổi bật", className: "bg-warning text-dark", position: "right" },
        ];
    return [];
};

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

export default function Home({ apiBase = `{process.env.react_app_api_url}` }) {
    const [categories, setCategories] = useState([]);
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(false);
    const [featuredProducts, setFeaturedProducts] = useState([]);
    const [newProducts, setNewProducts] = useState([]);
    const [showAllFeatured, setShowAllFeatured] = useState(false);
    const [showAllNew, setShowAllNew] = useState(false);
    const [selectedCatId, setSelectedCatId] = useState(8);

    // Modal Buy (đặt 1 lần)
    const [showModalBuy, setShowModalBuy] = useState(false);
    const [buyProduct, setBuyProduct] = useState(null);
    const [buyImages, setBuyImages] = useState([]);

    const api = useMemo(
        () =>
            axios.create({
                baseURL: apiBase.replace(/\/+$/, ""),
                timeout: 10000,
            }),
        [apiBase]
    );

    // ===== APIs =====
    const fetchCategories = useCallback(async () => {
        try {
            const res = await api.get("/categories");
            const all = res.data || [];
            const roots = all.filter((c) => c.parent === null);
            setCategories(roots);
        } catch (e) {
            console.error("fetchCategories error:", e);
        }
    }, [api]);

    const checkCategory = useCallback(
        async (categoryId) => {
            try {
                setLoading(true);
                const res = await api.get("/search/products", { params: { category_id: categoryId } });
                const data = res.data ?? {};
                setItems(data.items ?? []);
            } catch (e) {
                console.error("Error fetching products by category:", e);
            } finally {
                setLoading(false);
            }
        },
        [api]
    );

    const fetchProducts = useCallback(async () => {
        try {
            const res = await api.get("/products");
            const data = res.data?.data || [];
            setFeaturedProducts(data.filter((p) => p.status === 1 || p.status === 12));
            setNewProducts(data.filter((p) => p.status === 2 || p.status === 12));
        } catch (e) {
            console.error("fetchProducts error:", e);
        }
    }, [api]);

    useEffect(() => {
        checkCategory(selectedCatId);
        fetchCategories();
        fetchProducts();
    }, [checkCategory, fetchCategories, fetchProducts, selectedCatId]);

    // ===== Actions =====
    const handleBuy = async (id) => {
        try {
            const res = await api.get(`/products/${id}`);
            const data = res.data?.data || null;
            setBuyProduct(data);
            setBuyImages((data?.images || []).map((img) => img?.image_url).filter(Boolean));
            setShowModalBuy(true);
        } catch (e) {
            console.error("handleBuy error:", e);
        }
    };

    // ===== UI pieces =====
    const CategorySidebar = () => (
        <div className="bg-white border rounded shadow-sm" style={{ minWidth: 260 }}>
            <div className="bg-danger text-white fw-bold d-flex align-items-center px-3 py-2">
                <Menu size={20} className="me-2" /> MENU
            </div>

            <ul className="list-group list-group-flush">
                {categories.length > 0 ? (
                    categories.map((cat) => (
                        <li
                            key={cat.category_id}
                            className={`list-group-item list-group-item-action d-flex align-items-center justify-content-between ${selectedCatId === cat.category_id
                                ? "active border-danger bg-danger-subtle text-danger fw-semibold"
                                : ""
                                }`}
                            style={{ cursor: "pointer" }}
                            onClick={() => {
                                setSelectedCatId(cat.category_id);
                                checkCategory(cat.category_id);
                            }}
                        >
                            <div className="d-flex align-items-center">
                                <Cpu
                                    size={18}
                                    className={`me-2 ${selectedCatId === cat.category_id ? "text-danger" : "text-primary"
                                        }`}
                                />
                                <span>{cat.category_name}</span>
                            </div>
                            <span
                                className={`badge ${selectedCatId === cat.category_id ? "bg-danger text-white" : "bg-danger-subtle text-danger"
                                    }`}
                            >
                                SALE
                            </span>
                        </li>
                    ))
                ) : (
                    <>
                        <li className="list-group-item">
                            <Zap size={18} className="me-2 text-warning" />
                            Top Sản Phẩm Mới Hot
                        </li>
                        <li className="list-group-item">
                            <Tv size={18} className="me-2 text-primary" />
                            Camera Quan Sát - Hành Trình
                        </li>
                        <li className="list-group-item">
                            <HomeIcon size={18} className="me-2 text-info" />
                            Quạt Hơi Nước - Quạt Mini
                        </li>
                        <li className="list-group-item">
                            <Smartphone size={18} className="me-2 text-success" />
                            Đồ Gia Dụng - Đời Sống
                        </li>
                        <li className="list-group-item">
                            <Wrench size={18} className="me-2 text-danger" />
                            Phụ Kiện Nhà Bếp - Nhà Tắm
                        </li>
                        <li className="list-group-item">
                            <Gem size={18} className="me-2 text-secondary" />
                            Chăm Sóc Làm Đẹp
                        </li>
                        <li className="list-group-item">
                            <Gift size={18} className="me-2 text-purple" />
                            Khuyến Mãi Đặc Biệt
                        </li>
                    </>
                )}
            </ul>
        </div>
    );

    const ProductGrid = () => (
        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-3 flex-grow-1 ps-3">
            {loading ? (
                <p className="text-center text-muted">Đang tải dữ liệu...</p>
            ) : items.length > 0 ? (
                items.map((prod) => {
                    const ribbons = pickRibbonsFromStatus(prod?.status);
                    return (
                        <div className="col position-relative" key={prod.product_id}>
                            {ribbons.map((rb, i) => (
                                <Ribbon key={i} text={rb.text} position={rb.position} className={rb.className} />
                            ))}
                            <ProductHome prod={prod} onBuy={() => handleBuy(prod.product_id)} />
                        </div>
                    );
                })
            ) : (
                <p className="text-center text-muted">Không có sản phẩm nào</p>
            )}
        </div>
    );

    const ProductSection = ({ title, products, showAll, toggleShow }) => {
        const visibleProducts = showAll ? products : products.slice(0, 4);

        return (
            <section className="my-5">
                <div className="text-center mb-4">
                    <h2 className="fw-bold" style={{ fontSize: "2rem" }}>
                        {title}
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
                    {visibleProducts.length > 0 ? (
                        visibleProducts.map((p) => <ProductCard key={p.product_id} p={p} />)
                    ) : (
                        <p className="text-center text-muted">Đang cập nhật sản phẩm...</p>
                    )}
                </div>

                {products.length > 4 && (
                    <div className="text-center mt-3">
                        <button onClick={toggleShow} className="btn btn-outline-danger rounded-pill px-4">
                            {showAll ? "Thu gọn" : "Xem thêm"}
                        </button>
                    </div>
                )}
            </section>
        );
    };

    const ProductCard = ({ p }) => {
        const ribbons = pickRibbonsFromStatus(p?.status);
        const img = p?.images?.[0]?.image_url || ROBOT;

        return (
            <div className="col-lg-3 col-md-4 col-sm-6 mb-4 d-flex justify-content-center">
                <div className="card shadow-sm border-0 rounded-4 overflow-hidden hover-shadow" style={{ maxWidth: 300 }}>
                    <div className="position-relative">
                        {ribbons.map((rb, i) => (
                            <Ribbon key={i} text={rb.text} position={rb.position} className={rb.className} />
                        ))}
                        <a href={`/productdetail/${p.product_id}`}>
                            <img
                                src={img}
                                alt={p.product_name}
                                className="img-fluid"
                                style={{ height: 220, width: "100%", objectFit: "cover" }}
                                onError={(e) => (e.currentTarget.src = ROBOT)}
                            />
                        </a>
                    </div>
                    <div className="card-body text-center">
                        <h6 className="fw-semibold text-truncate mb-2" title={p.product_name}>
                            {p.product_name}
                        </h6>
                        <p className="text-danger fw-bold mb-3">{Number(p.price || 0).toLocaleString()} ₫</p>
                        <button onClick={() => handleBuy(p.product_id)} className="btn btn-primary" style={{ fontSize: 15 }}>
                            Mua ngay
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div style={{ backgroundColor: "#fff" }}>
            <Carousel />
            <div className="container py-4">


                <div className="d-none d-md-flex" style={{ height: 505 }} aria-hidden="true">
                    <CategorySidebar />
                    <ProductGrid />
                </div>


                {/* Hero Section */}
                <div className="text-center my-5">
                    <h1 className="fw-bold mb-3">
                        <span>Ai cũng có thể trở thành </span>
                        <span style={{ color: "hsl(0,75%,60%)" }}>người đặc biệt</span>
                    </h1>
                    <p className="lead">
                        Và <span style={{ color: "hsl(0,75%,60%)" }}>bạn</span> cũng có thể là người tiếp theo!
                    </p>
                </div>

                <ProductSection
                    title="🆕 Sản phẩm mới"
                    products={newProducts}
                    showAll={showAllNew}
                    toggleShow={() => setShowAllNew((v) => !v)}
                />

                <ProductSection
                    title="⭐ Sản phẩm nổi bật"
                    products={featuredProducts}
                    showAll={showAllFeatured}
                    toggleShow={() => setShowAllFeatured((v) => !v)}
                />

                {/* Khóa học */}
                <section className="my-5">
                    <div className="text-center mb-4">
                        <h2 className="fw-bold" style={{ fontSize: "2rem" }}>
                            📘 Khóa học nổi bật
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
                    <div className="row justify-content-center text-center">
                        {[CDS, STEM, ROBOT].map((img, idx) => (
                            <div key={idx} className="col-lg-4 col-md-6 mb-4 d-flex justify-content-center">
                                <div className="card shadow-sm border-0 rounded-4 overflow-hidden">
                                    <img
                                        src={img}
                                        alt={`Course ${idx + 1}`}
                                        className="img-fluid"
                                        style={{ height: 300, objectFit: "cover" }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            </div>

            {/* Modal Buy (global) */}
            <ModalBuy
                show={showModalBuy}
                onClose={() => setShowModalBuy(false)}
                product={buyProduct}
                images={buyImages}
            />
        </div>
    );
}
