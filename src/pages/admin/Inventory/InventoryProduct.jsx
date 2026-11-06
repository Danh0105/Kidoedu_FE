import React, { useCallback, useEffect, useState } from "react";
import { fetchAllProductsApiForAdminInventerProduct } from "../../../services/Product";
import { useDebounce } from "../../../hooks/useDebounce";
import { useSearchParams } from "react-router-dom";
import "./css/InventoryProduct.css";

const PLACEHOLDER_IMG = "https://placehold.co/120x120?text=No+Image";

export default function ProductManagement() {

    const [products, setProducts] = useState([]);
    const [meta, setMeta] = useState(null);

    const [searchParams] = useSearchParams();
    const catFromUrl = searchParams.get("cat");

    const [q, setQ] = useState("");
    const debouncedQ = useDebounce(q, 500);

    const [page, setPage] = useState(1);
    const [limit] = useState(12);

    const [loading, setLoading] = useState(false);
    const [err, setErr] = useState("");

    const [selectedCatId] = useState(catFromUrl ? Number(catFromUrl) : null);

    const [openProduct, setOpenProduct] = useState(null);

    const [selectedVariant, setSelectedVariant] = useState(null);
    const [showModal, setShowModal] = useState(false);

    const fetchProducts = useCallback(async (signal) => {

        setLoading(true);
        setErr("");

        try {

            const params = {
                page,
                limit,
                ...(selectedCatId && { category_id: selectedCatId })
            };

            const res = await fetchAllProductsApiForAdminInventerProduct(
                debouncedQ ? { ...params, q: debouncedQ } : params,
                signal
            );

            setProducts(res?.data ?? []);

            setMeta({
                page: res?.meta?.page ?? 1,
                last_page: res?.meta?.last_page ?? 1,
                total: res?.meta?.total ?? 0
            });

        } catch (e) {

            if (e.name !== "CanceledError") {
                setErr("Lỗi tải sản phẩm");
            }

        } finally {
            setLoading(false);
        }

    }, [page, limit, debouncedQ, selectedCatId]);



    useEffect(() => {

        const controller = new AbortController();
        fetchProducts(controller.signal);
        return () => controller.abort();

    }, [fetchProducts]);



    const toggleProduct = (index) => {
        setOpenProduct(openProduct === index ? null : index);
    };

    const openStockModal = (variant) => {
        setSelectedVariant(variant);
        setShowModal(true);
    };



    return (

        <div className="container-fluid mt-3">

            <div className="card shadow-sm">

                {/* HEADER */}

                <div className="card-header">

                    <div className="row align-items-center">

                        <div className="col-md-3">
                            <h5 className="mb-0">Quản lý tồn kho</h5>
                        </div>

                        <div className="col-md-6">

                            <div className="input-group">

                                <span className="input-group-text">
                                    🔍
                                </span>

                                <input
                                    className="form-control"
                                    placeholder="Tìm sản phẩm..."
                                    value={q}
                                    onChange={(e) => {
                                        setQ(e.target.value);
                                        setPage(1);
                                    }}
                                />

                            </div>

                        </div>

                    </div>

                </div>



                <div className="card-body">

                    {/* LOADING */}

                    {loading && (

                        <div className="row">

                            {[...Array(6)].map((_, i) => (

                                <div key={i} className="col-md-4 mb-3">
                                    <div className="skeleton"></div>
                                </div>

                            ))}

                        </div>

                    )}



                    {err && (
                        <div className="alert alert-danger">{err}</div>
                    )}



                    {!loading && products.length === 0 && (

                        <div className="text-center py-5 text-muted">
                            Không có sản phẩm
                        </div>

                    )}



                    <div className="row g-3">

                        {products.map((p, index) => {

                            const totalStock =
                                p.variants?.reduce((sum, v) => sum + (v.stockQuantity || 0), 0) || 0;

                            const thumb = p.image
                                ? process.env.REACT_APP_API_URL + p.image
                                : PLACEHOLDER_IMG;

                            return (

                                <div key={index} className="col-xl-3 col-lg-4 col-md-6">

                                    <div
                                        className="card product-card shadow-sm"
                                        onClick={() => toggleProduct(index)}
                                    >

                                        <div className="text-center bg-light p-3">

                                            <img
                                                src={thumb}
                                                alt={p.productName}
                                                style={{ height: 120, objectFit: "contain" }}
                                            />

                                        </div>

                                        <div className="card-body text-center">

                                            <h6 className="fw-semibold mb-2">
                                                {p.productName}
                                            </h6>

                                            <div className="d-flex justify-content-center gap-2">

                                                <span className="badge bg-light text-dark">
                                                    {p.variants?.length || 0} biến thể
                                                </span>

                                                <span
                                                    className={`badge ${totalStock <= 0
                                                        ? "bg-danger"
                                                        : totalStock < 5
                                                            ? "bg-warning text-dark"
                                                            : "bg-success"
                                                        }`}
                                                >
                                                    <span className="text-white">Tồn: {totalStock}</span>
                                                </span>

                                            </div>

                                        </div>

                                    </div>



                                    {openProduct === index && (

                                        <div className="variant-box mt-2">

                                            {p.variants?.map((v, i) => (

                                                <div
                                                    key={i}
                                                    className="variant-row d-flex justify-content-between align-items-center"
                                                >

                                                    <div>

                                                        <div className="fw-semibold">
                                                            {v.variantName}
                                                        </div>

                                                        <small className="text-muted">
                                                            SKU: {v.sku}
                                                        </small>

                                                    </div>

                                                    <span
                                                        className={`badge ${v.stockQuantity <= 0
                                                            ? "bg-danger"
                                                            : v.stockQuantity < 5
                                                                ? "bg-warning text-dark"
                                                                : "bg-success"
                                                            }`}
                                                        style={{ cursor: "pointer" }}
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            openStockModal(v);
                                                        }}
                                                    >
                                                        {v.stockQuantity}
                                                    </span>

                                                </div>

                                            ))}

                                        </div>

                                    )}

                                </div>

                            )

                        })}

                    </div>

                </div>



                {/* PAGINATION */}

                {meta && (

                    <div className="card-footer">

                        <ul className="pagination justify-content-center mb-0">

                            <li className={`page-item ${meta.page <= 1 ? "disabled" : ""}`}>
                                <button
                                    className="page-link"
                                    onClick={() => setPage(meta.page - 1)}
                                >
                                    «
                                </button>
                            </li>

                            {[...Array(meta.last_page)].map((_, i) => (

                                <li
                                    key={i}
                                    className={`page-item ${meta.page === i + 1 ? "active" : ""}`}
                                >

                                    <button
                                        className="page-link"
                                        onClick={() => setPage(i + 1)}
                                    >
                                        {i + 1}
                                    </button>

                                </li>

                            ))}

                            <li className={`page-item ${meta.page >= meta.last_page ? "disabled" : ""}`}>
                                <button
                                    className="page-link"
                                    onClick={() => setPage(meta.page + 1)}
                                >
                                    »
                                </button>
                            </li>

                        </ul>

                    </div>

                )}

            </div>



            {/* MODAL */}

            {showModal && selectedVariant && (

                <div className="modal fade show d-block">

                    <div className="modal-dialog modal-lg">

                        <div className="modal-content">

                            <div className="modal-header">

                                <h5 className="modal-title">
                                    Lịch sử nhập kho - {selectedVariant.variantName}
                                </h5>

                                <button
                                    className="btn-close"
                                    onClick={() => setShowModal(false)}
                                />

                            </div>

                            <div className="modal-body">

                                <table className="table table-bordered">

                                    <thead>
                                        <tr>
                                            <th>Ngày</th>
                                            <th>Loại</th>
                                            <th>Số lượng</th>
                                            <th>Giá</th>
                                            <th>Tổng tiền</th>
                                        </tr>
                                    </thead>

                                    <tbody>

                                        {selectedVariant.imports?.map((imp, i) => (

                                            <tr key={i}>

                                                <td>
                                                    {new Date(imp.createdAt).toLocaleDateString()}
                                                </td>

                                                <td>

                                                    <span className={`badge ${imp.type === "import"
                                                        ? "bg-success"
                                                        : "bg-danger"
                                                        }`}>
                                                        {imp.type === "import"
                                                            ? "Nhập kho"
                                                            : "Xuất kho"}
                                                    </span>

                                                </td>

                                                <td>{imp.quantity}</td>

                                                <td>
                                                    {Number(imp.unitCost).toLocaleString()} ₫
                                                </td>

                                                <td>
                                                    {Number(imp.lineTotal).toLocaleString()} ₫
                                                </td>

                                            </tr>

                                        ))}

                                    </tbody>

                                </table>

                            </div>

                        </div>

                    </div>

                </div>

            )}

        </div>

    );

}