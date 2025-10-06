import '../../App.css';
import CDS from '../../assets/user/CDS.png';
import STEM from '../../assets/user/STEM.png';
import ROBOT from '../../assets/user/ROBOT.png';
import Carousel from '../../components/user/Carousel';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { Menu, Tv, Smartphone, Cpu, Wrench, HomeIcon, Gem, Zap, Gift } from 'lucide-react';
import ProductHome from '../../components/user/ProductHome';

export default function Home({ apiBase = "https://kidoedu.vn" }) {
    const [categories, setCategories] = useState([]);
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(false);
    const [featuredProducts, setFeaturedProducts] = useState([]);
    const [newProducts, setNewProducts] = useState([]);
    const [showAllFeatured, setShowAllFeatured] = useState(false);
    const [showAllNew, setShowAllNew] = useState(false);
    const [selectedCatId, setSelectedCatId] = useState(8);
    const api = useMemo(() => axios.create({
        baseURL: apiBase.replace(/\/+$/, ""),
        timeout: 10000,
    }), [apiBase]);

    // ✅ Lấy danh mục cha
    const fetchCategories = async () => {
        try {
            const res = await api.get("/categories");
            const all = res.data || [];
            const roots = all.filter(c => c.parent === null);
            setCategories(roots);
        } catch (e) {
            console.error(e);
        }
    };

    // ✅ Lấy sản phẩm theo category_id
    const checkCategory = useCallback(async (categoryId) => {
        try {
            setLoading(true);
            const res = await api.get("/search/products", { params: { category_id: categoryId } });


            const data = res.data ?? {};
            console.log(data.items)
            setItems(data.items ?? []);
        } catch (e) {
            console.error("Error fetching products by category:", e);
        } finally {
            setLoading(false);
        }
    }, [api]);

    // ✅ Lấy sản phẩm nổi bật và mới
    const fetchProducts = async () => {
        try {
            const res = await api.get("/products");
            const data = res.data.data || [];
            setFeaturedProducts(data.filter(p => p.status === 1 || p.status === 12));
            setNewProducts(data.filter(p => p.status === 2 || p.status === 12));
        } catch (e) {
            console.error(e);
        }
    };

    useEffect(() => {
        checkCategory(8)
        fetchCategories();
        fetchProducts();
    }, []);

    // 🧭 Sidebar danh mục — chuẩn Bootstrap
    const CategorySidebar = () => (
        <div className="bg-white border rounded shadow-sm" style={{ minWidth: "260px" }}>
            <div className="bg-danger text-white fw-bold d-flex align-items-center px-3 py-2">
                <Menu size={20} className="me-2" /> MENU
            </div>

            <ul className="list-group list-group-flush">
                {categories.length > 0 ? (
                    categories.map(cat => (
                        <li
                            key={cat.id}
                            className={`list-group-item list-group-item-action d-flex align-items-center justify-content-between ${selectedCatId === cat.category_id ? "active border-danger bg-danger-subtle text-danger fw-semibold" : ""
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
                                    className={`me-2 ${selectedCatId === cat.category_id ? "text-danger" : "text-primary"}`}
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
                        <li className="list-group-item"><Zap size={18} className="me-2 text-warning" />Top Sản Phẩm Mới Hot</li>
                        <li className="list-group-item"><Tv size={18} className="me-2 text-primary" />Camera Quan Sát - Hành Trình</li>
                        <li className="list-group-item"><HomeIcon size={18} className="me-2 text-info" />Quạt Hơi Nước - Quạt Mini</li>
                        <li className="list-group-item"><Smartphone size={18} className="me-2 text-success" />Đồ Gia Dụng - Đời Sống</li>
                        <li className="list-group-item"><Wrench size={18} className="me-2 text-danger" />Phụ Kiện Nhà Bếp - Nhà Tắm</li>
                        <li className="list-group-item"><Gem size={18} className="me-2 text-secondary" />Chăm Sóc Làm Đẹp</li>
                        <li className="list-group-item"><Gift size={18} className="me-2 text-purple" />Khuyến Mãi Đặc Biệt</li>
                    </>
                )}
            </ul>
        </div>
    );

    // 🧱 Section sản phẩm trong Sidebar
    const ProductGrid = () => (
        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-3 flex-grow-1 ps-3">
            {loading ? (
                <p className="text-center text-muted">Đang tải dữ liệu...</p>
            ) : items.length > 0 ? (
                items.map((prod) => {
                    const badge =
                        prod.status === 1
                            ? { label: "Nổi bật", color: "bg-warning text-dark" }
                            : prod.status === 2
                                ? { label: "Mới", color: "bg-success" }
                                : prod.status === 12
                                    ? { label: "Mới & Nổi bật", color: "bg-danger" }
                                    : null;

                    return (
                        <div className="col position-relative" key={prod.product_id}>
                            {badge && (
                                <span
                                    className={`badge position-absolute top-0 start-0 m-2 px-3 py-2 ${badge.color}`}
                                    style={{ borderRadius: "8px", zIndex: 10 }}
                                >
                                    {badge.label}
                                </span>
                            )}
                            <ProductHome prod={prod} />
                        </div>
                    );
                })
            ) : (
                <p className="text-center text-muted">Không có sản phẩm nào</p>
            )}
        </div>
    );

    return (
        <div style={{ backgroundColor: "#fff" }}>
            <div className="container py-4">

                <Carousel />
                <div className="d-flex" style={{ height: "505px" }}>
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

                {/* Sản phẩm mới */}
                <section className="my-5">
                    <h2 className="fw-bold text-center mb-3">🆕 Sản phẩm mới</h2>
                    <div className="row justify-content-center">
                        {(showAllNew ? newProducts : newProducts.slice(0, 4)).map((p) => (
                            <div className="col-lg-3 col-md-4 col-sm-6" key={p.product_id}>
                                <ProductHome prod={p} />
                            </div>
                        ))}
                    </div>
                    {newProducts.length > 4 && (
                        <div className="text-center mt-3">
                            <button
                                onClick={() => setShowAllNew(!showAllNew)}
                                className="btn btn-outline-danger rounded-pill px-4"
                            >
                                {showAllNew ? "Thu gọn" : "Xem thêm"}
                            </button>
                        </div>
                    )}
                </section>

                {/* Sản phẩm nổi bật */}
                <section className="my-5">
                    <h2 className="fw-bold text-center mb-3">⭐ Sản phẩm nổi bật</h2>
                    <div className="row justify-content-center">
                        {(showAllFeatured ? featuredProducts : featuredProducts.slice(0, 4)).map((p) => (
                            <div className="col-lg-3 col-md-4 col-sm-6" key={p.product_id}>
                                <ProductHome prod={p} />
                            </div>
                        ))}
                    </div>
                    {featuredProducts.length > 4 && (
                        <div className="text-center mt-3">
                            <button
                                onClick={() => setShowAllFeatured(!showAllFeatured)}
                                className="btn btn-outline-danger rounded-pill px-4"
                            >
                                {showAllFeatured ? "Thu gọn" : "Xem thêm"}
                            </button>
                        </div>
                    )}
                </section>

                {/* Khóa học */}
                <section className="my-5">
                    <div className="text-center mb-4">
                        <h2 className="fw-bold" style={{ fontSize: "2rem" }}>📘 Khóa học nổi bật</h2>
                        <div className="mx-auto" style={{
                            height: "3px",
                            width: "80px",
                            backgroundColor: "hsl(0,75%,60%)",
                            borderRadius: "3px"
                        }}></div>
                    </div>
                    <div className="row justify-content-center text-center">
                        {[CDS, STEM, ROBOT].map((img, idx) => (
                            <div key={idx} className="col-lg-4 col-md-6 mb-4 d-flex justify-content-center">
                                <div className="card shadow-sm border-0 rounded-4 overflow-hidden">
                                    <img src={img} alt={`Course ${idx + 1}`} className="img-fluid" style={{ height: "300px", objectFit: "cover" }} />
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            </div>
        </div>
    );
}
