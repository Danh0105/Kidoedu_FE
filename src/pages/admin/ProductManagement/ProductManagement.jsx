import React, { useEffect, useState } from 'react'
import ModalLG from './ModalLG'
import product from '../../../assets/admin/product1.png'
import axios from 'axios';
export default function ProductManagement() {
    const [products, setProducts] = useState([]);
    const [meta, setMeta] = useState(null);

    const fetchProducts = async (page = 1, limit = 10) => {
        try {
            const res = await axios.get(`${process.env.REACT_APP_API_URL}/products`, {
                params: { page, limit }
            });

            setProducts(res.data.data); // ✅ mảng sản phẩm
            setMeta(res.data.meta);     // ✅ thông tin phân trang
        } catch (err) {
            console.error("Lỗi khi lấy sản phẩm:", err);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);
    const handleDelete = async (id) => {
        if (!window.confirm("Bạn có chắc muốn xóa sản phẩm này?")) return;

        try {
            await axios.delete(`{process.env.react_app_api_url}/products/${id}`);

            // ✅ Xóa khỏi state mà không cần reload
            setProducts((prev) => prev.filter((p) => p.product_id !== id));

            // ✅ Giảm total trong meta
            setMeta((prev) => ({
                ...prev,
                total: (prev?.total || 1) - 1
            }));

            alert("Xóa thành công!");
        } catch (err) {
            console.error("Lỗi khi xóa sản phẩm:", err);
            alert("Xóa thất bại!");
        }
    };

    return (

        <div className="container-fluid mt-2">
            <div className="d-flex justify-content-between" style={{ height: "45px" }}>
                <div>
                    <button type="button" className="btn btn-primary me-2" data-bs-toggle="modal" data-bs-target="#exampleModal">
                        Nhập vào
                    </button>
                    <button type="button" style={{ width: '93,74px' }} className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal">
                        Xuất ra
                    </button>
                </div>
                <div>
                    <ol class="breadcrumb float-sm-end">
                        <li class="breadcrumb-item"><a href="#">Home</a></li>
                        <li class="breadcrumb-item active" aria-current="page">ProductManagement</li>
                    </ol>
                </div>
                <div>
                    <button type="button" className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal">
                        Thêm sản phẩm
                    </button>
                </div>
            </div>
            <ModalLG onProductAdded={(newProduct) => {
                setProducts((prev) => [newProduct, ...prev]);
                setMeta((prev) => ({
                    ...prev,
                    total: (prev?.total || 0) + 1
                }));
            }} />


            <div class="card mb-4">
                <div class="card-header row justify-content-between  align-items-center ">
                    <div className='col-2'>
                        <h3 class="card-title ">Danh sách sản phẩm</h3>
                    </div>
                    <div className='col-8 d-flex justify-content-center'>
                        <input type="search" class="form-control w-50" placeholder="Search..." aria-label="Search"></input>
                    </div>
                    {meta && (
                        <div class="card-tools col-2">
                            <ul className="pagination pagination-sm float-end">
                                <li className="page-item"><a class="page-link" href="#">«</a></li>
                                {[...Array(meta.last_page)].map((_, idx) => (
                                    <li key={idx} className={`page-item ${meta.page === idx + 1 ? "active" : ""}`}>
                                        <button className="page-link" onClick={() => fetchProducts(idx + 1, meta.limit)}>
                                            {idx + 1}
                                        </button>
                                    </li>
                                ))}
                                <li class="page-item"><a class="page-link" href="#">»</a></li>
                            </ul>
                        </div>
                    )}

                </div>
                <div class="card-body p-0">
                    <table className="table" role="table">
                        <thead>
                            <tr>
                                <th style={{ width: "10px" }}><input type="checkbox" /></th>
                                <th style={{ width: "85px" }} className="align-middle text-center"><i className="bi bi-card-image"></i></th>
                                <th className="align-middle">Tên sản phẩm</th>
                                <th className="align-middle">Mã sản phẩm</th>
                                <th className="align-middle">Kho</th>
                                <th className="align-middle">Giá</th>
                                <th className="align-middle">Danh mục</th>
                                <th className="align-middle">Ngày tạo</th>
                                <th className="align-middle text-center">Actions</th>
                            </tr>
                        </thead>

                        <tbody>
                            {products.length > 0 ? (
                                products.map((p) => (
                                    <tr key={p.product_id} className="align-middle">
                                        <td><input type="checkbox" /></td>
                                        <td>
                                            {p.images?.length > 0 ? (
                                                <img src={p.images[0].image_url} alt={p.product_name} width={85} height={85} />
                                            ) : <span>—</span>}
                                        </td>
                                        <td>
                                            {p.product_name.length > 20
                                                ? p.product_name.substring(0, 20) + "..."
                                                : p.product_name}
                                        </td>
                                        <td>{p.sku}</td>
                                        <td>{p.stock_quantity}</td>
                                        <td>{Number(p.price).toLocaleString()} ₫</td>
                                        <td>{p.category?.category_name || p.category_id}</td>
                                        <td>{new Date(p.created_at).toLocaleDateString("vi-VN")}</td>
                                        <td className="text-center">
                                            <button className="btn btn-primary me-2">Edit</button>
                                            <button
                                                className="btn btn-danger"
                                                onClick={() => handleDelete(p.product_id)}
                                            >
                                                Delete
                                            </button>
                                        </td>

                                    </tr>
                                ))
                            ) : (
                                <tr><td colSpan="9" className="text-center">Không có sản phẩm</td></tr>
                            )}
                        </tbody>
                    </table>
                    <div className='d-flex mx-4 mt-2 mb-2 align-items-center gap-2'>
                        <input class="form-check-input" type="checkbox" value="" id="checkDefault" />
                        <div class="dropdown">
                            <button class="btn btn-light dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                Hành động hàng loạt
                            </button>
                            <ul class="dropdown-menu">
                                <li><a class="dropdown-item" href="#">Action</a></li>
                                <li><a class="dropdown-item" href="#">Another action</a></li>
                                <li><a class="dropdown-item" href="#">Something else here</a></li>
                            </ul>
                        </div>
                    </div>

                </div>
            </div>
        </div >
    )
}
