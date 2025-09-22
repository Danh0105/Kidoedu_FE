import React, { useEffect, useState } from 'react';
import Category from '../../components/user/category/Category';
import CheckboxProduct from '../../components/user/category/CheckboxProduct';
import Product from '../../components/user/category/Product';
import Slick1 from '../../components/user/slick/slick1';
import axios from 'axios';
export default function Store() {
    const [products, setProducts] = useState([]);
    const [meta, setMeta] = useState(null);
    const [categories, setCategories] = useState([]);
    const fetchProducts = async (page = 1, limit = 10) => {
        try {
            const res = await axios.get("http://163.223.211.23:3000/products", {
                params: { page, limit }
            });

            setProducts(res.data.data);
            setMeta(res.data.meta);
        } catch (err) {
            console.error("Lỗi khi lấy sản phẩm:", err);
        }
    };
    const fetchCategory = async () => {
        try {
            const res = await axios.get("http://163.223.211.23:3000/categories");
            const roots = res.data.filter((cat) => cat.parent === null);
            setCategories(roots);

        } catch (err) {
            console.error("Lỗi khi lấy danh mục:", err);
        }
    };


    const [selectedId, setSelectedProductId] = useState(null);
    useEffect(() => {
        fetchProducts();
        fetchCategory();
    }, []);
    const getRandomColor = () => {
        const letters = "0123456789ABCDEF";
        let color = "#";
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    };
    return (
        <div className='container' style={{ maxWidth: "95%" }}>
            <Slick1 />
            <div class="d-flex bg-white p-2">
                <div style={{ width: "330px" }}>
                    <div className='p-2 border border-2 rounded'>
                        {categories.length > 0 ? (
                            categories.map((c) => {
                                const textColor = getRandomColor();
                                return (

                                    <div >
                                        <Category
                                            label={c.category_name}
                                            color={textColor}
                                        />

                                        <div className="d-flex flex-column ms-3">
                                            {c.children.map((child) => (
                                                <CheckboxProduct
                                                    id={child.category_id}
                                                    name={child.category_name}
                                                    color={textColor}
                                                    selectedId={selectedId}
                                                    onChange={(id) => setSelectedProductId(child.category_id)}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                )
                            }
                            )) : (
                            <tr><td colSpan="9" className="text-center">Không có danh mục</td></tr>
                        )}
                    </div>
                </div>
                <div className="p-2 flex-fill">
                    <div className='d-flex justify-content-between w-100'>
                        <div class="dropdown custom-dropdown">
                            <button class="btn btn-outline-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown">
                                Sắp xếp
                            </button>
                            <ul class="dropdown-menu w-100">
                                <li><a className="dropdown-item" href="#">Giá thấp đến cao</a></li>
                                <li><a className="dropdown-item" href="#">Giá cao đến thấp</a></li>
                            </ul>
                        </div>

                        <div className='d-flex justify-content-end  mb-3 '>
                            <form class="col-12 col-lg-automb-lg-0 " role="search">
                                <input type="search" class="form-control form-control-dark text-bg-light" placeholder="Tìm kiếm" aria-label="Search" />
                            </form>
                        </div>
                    </div>
                    <div className="container text-center overflow-auto" style={{ maxHeight: "710px" }}>

                        <div className="row row-cols-4" >
                            {products.length > 0 ? (
                                products.map((p) => (
                                    <div className="col mt-1">
                                        <Product
                                            name={p.product_name.length > 20
                                                ? p.product_name.substring(0, 20) + "..."
                                                : p.product_name}
                                            id={p.product_id}
                                            content={p.short_description.length > 50
                                                ? p.short_description.substring(0, 50) + "..."
                                                : p.short_description}
                                            price={p.price}
                                            image={p.images?.length > 0 ? (p.images[0].image_url) : ("https://via.placeholder.com/150")}
                                        />
                                    </div>
                                ))) : (
                                <div className="col">
                                    <p className="text-muted">Không có sản phẩm nào</p>
                                </div>
                            )}
                        </div>

                    </div>

                    <nav aria-label="Page navigation example " className='mt-3'>
                        {meta && (
                            <ul className="pagination justify-content-center">
                                <li className="page-item disabled">
                                    <a href="/" className="page-link" tabindex="-1" aria-disabled="true">Previous</a>

                                </li>
                                {[...Array(meta.last_page)].map((_, idx) => (
                                    <li key={idx} className={`page-item ${meta.page === idx + 1 ? "active" : ""}`}>
                                        <button className="page-link" onClick={() => fetchProducts(idx + 1, meta.limit)}>
                                            {idx + 1}
                                        </button>
                                    </li>
                                ))}
                                <li className="page-item">
                                    <a className="page-link" href="/">Next</a>
                                </li>
                            </ul>
                        )}

                    </nav>
                </div>

            </div>
        </div>

    )
}
