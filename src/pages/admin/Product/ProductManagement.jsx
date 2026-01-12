import React, { useEffect, useMemo, useState } from "react";
import FormCreate from "./FormCreate";
import axios from "axios";
import FormEdit from "./FormEdit";
import { fetchAllProductsApi, searchProductsApi } from "../../../services/Product";
import FormInventory from "../../../components/admin/FormInventory";
import { useDebounce } from "../../../hooks/useDebounce";
import { hasPermission } from "../../../utils/permission";

const PLACEHOLDER_IMG = "https://placehold.co/120x120?text=No+Image";

export default function ProductManagement() {
    const [products, setProducts] = useState([]);
    const [meta, setMeta] = useState(null);
    const [editProduct, setEditProduct] = useState(null);
    const [isOpen, setIsOpen] = useState(false);

    const formatCurrency = (value) =>
        new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
        }).format(Number(value || 0));
    const [q, setQ] = useState("");
    const debouncedQ = useDebounce(q, 500);

    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);

    const fetchProducts = async (page = 1, limit = 10) => {
        try {
            const params = { page, limit };

            let data;

            if (debouncedQ.trim()) {
                // 🔎 Search API
                data = await searchProductsApi({ q: debouncedQ, ...params });
                console.log(data);

                setProducts(data.items ?? []);
                setMeta({
                    page: data.pagination?.page ?? 1,
                    last_page: data.pagination?.pages ?? 1,
                    total: data.pagination?.total ?? 0,
                    limit: data.pagination?.limit ?? limit,
                });
            } else {
                // 🔁 Normal fetch
                data = await fetchAllProductsApi(page, limit);

                setProducts(data ?? []);
                setMeta({
                    page: data.page ?? 1,
                    last_page: data.last_page ?? 1,
                    total: data.total ?? 0,
                    limit: data.limit ?? limit,
                });
            }
        } catch (err) {
            console.error("Lỗi khi lấy sản phẩm:", err);
        }
    };


    useEffect(() => {
        fetchProducts(page, limit);
    }, [page, debouncedQ]);


    // ✅ Tính priceRange theo từng productId
    const priceRangeByProductId = useMemo(() => {
        const map = {};
        if (!Array.isArray(products) || products.length === 0) return map;

        for (const prod of products) {
            const variants = prod?.variants ?? [];

            const prices = variants
                .flatMap((v) => v?.prices ?? [])
                .map((p) => Number(p?.price))
                .filter((n) => Number.isFinite(n));

            if (!prices.length) continue;

            map[prod?.productId] = {
                min: Math.min(...prices),
                max: Math.max(...prices),
            };
        }

        return map;
    }, [products]);

    const handleDelete = async (id) => {
        if (!window.confirm("Bạn có chắc muốn xóa sản phẩm này?")) return;

        try {
            await axios.delete(
                `${process.env.REACT_APP_API_URL}/products/${id}`
            );

            // Xóa khỏi state
            setProducts((prev) => prev.filter((p) => p?.productId !== id));

            // Giảm total trong meta
            setMeta((prev) =>
                prev
                    ? {
                        ...prev,
                        total: (prev.total || 1) - 1,
                    }
                    : prev
            );

            alert("Xóa thành công!");
        } catch (err) {
            console.error("Lỗi khi xóa sản phẩm:", err);
            alert("Xóa thất bại!");
        }
    };

    const handleProductAdded = (newProduct) => {
        setProducts((prev) => [newProduct, ...prev]);
        setMeta((prev) =>
            prev
                ? {
                    ...prev,
                    total: (prev.total || 0) + 1,
                }
                : prev
        );
    };

    return (
        <div className="container-fluid mt-2">
            <div className="d-flex justify-content-between" style={{ height: 45 }}>
                <div>
                    <button
                        type="button"
                        className="btn btn-primary me-2"
                        data-bs-toggle="modal"
                        data-bs-target="#exampleModal"
                    >
                        Nhập vào
                    </button>
                    <button
                        type="button"
                        className="btn btn-primary"
                        style={{ width: "93.74px" }}
                        data-bs-toggle="modal"
                        data-bs-target="#exampleModal"
                    >
                        Xuất ra
                    </button>
                </div>

                <div>
                    <ol className="breadcrumb float-sm-end mb-0">
                        <li className="breadcrumb-item">
                            <a href="#">Home</a>
                        </li>
                        <li
                            className="breadcrumb-item active"
                            aria-current="page"
                        >
                            ProductManagement
                        </li>
                    </ol>
                </div>

                <div>
                    {hasPermission(["product.create"]) && (
                        <button
                            type="button"
                            className="btn btn-primary"
                            data-bs-toggle="modal"
                            data-bs-target="#exampleModal"
                        >
                            Thêm sản phẩm
                        </button>
                    )}
                </div>
            </div>

            <FormCreate onProductAdded={handleProductAdded} />

            <div className="card mb-4">
                <div className="card-header row justify-content-between align-items-center">
                    <div className="col-2">
                        <h3 className="card-title mb-0">Danh sách sản phẩm</h3>
                    </div>

                    <div className="col-8 d-flex justify-content-center">
                        <input
                            type="search"
                            className="form-control w-50"
                            placeholder="Search..."
                            value={q}
                            onChange={(e) => {
                                setQ(e.target.value);
                                setPage(1);
                            }}
                        />

                    </div>

                    {meta && (
                        <ul className="pagination pagination-sm float-end mb-0">
                            <li className={`page-item ${meta.page <= 1 ? "disabled" : ""}`}>
                                <button className="page-link" onClick={() => setPage(meta.page - 1)}>
                                    «
                                </button>
                            </li>

                            {[...Array(meta.last_page)].map((_, idx) => (
                                <li key={idx} className={`page-item ${meta.page === idx + 1 ? "active" : ""}`}>
                                    <button className="page-link" onClick={() => setPage(idx + 1)}>
                                        {idx + 1}
                                    </button>
                                </li>
                            ))}

                            <li className={`page-item ${meta.page >= meta.last_page ? "disabled" : ""}`}>
                                <button className="page-link" onClick={() => setPage(meta.page + 1)}>
                                    »
                                </button>
                            </li>
                        </ul>
                    )}

                </div>

                <div className="card-body p-0">
                    <table className="table mb-0" role="table">
                        <thead>
                            <tr>
                                <th style={{ width: 10 }}>
                                    <input type="checkbox" />
                                </th>
                                <th
                                    style={{ width: 85 }}
                                    className="align-middle text-center"
                                >
                                    <i className="bi bi-card-image" />
                                </th>
                                <th className="align-middle">Tên sản phẩm</th>
                                <th className="align-middle">Mã sản phẩm</th>
                                <th className="">Giá</th>
                                <th className="align-middle">Tồn kho</th>
                                <th className="align-middle">Danh mục</th>
                                <th className="align-middle">Ngày tạo</th>
                                <th className="align-middle">Người tạo</th>
                                <th className="align-middle text-center">Actions</th>
                            </tr>
                        </thead>

                        <tbody>
                            {products.length > 0 ? (
                                products.map((p) => {
                                    const thumb =
                                        p.images?.find(img => img.isPrimary)?.imageUrl ??
                                        p.imageUrl ??
                                        PLACEHOLDER_IMG;

                                    // SKU / mã
                                    const sku =
                                        p.sku ||
                                        p?.variants?.[0]?.sku ||
                                        `SP-${p?.productId}`;



                                    // Ngày tạo
                                    const createdAt = p.createdAt || p.created_at;
                                    const createdLabel = createdAt
                                        ? new Date(createdAt).toLocaleDateString("vi-VN")
                                        : "";

                                    // ✅ Lấy priceRange cho từng sản phẩm
                                    const range = priceRangeByProductId[p?.productId];
                                    const displayedPrice = range
                                        ? range.min === range.max
                                            ? formatCurrency(range.min)
                                            : `${formatCurrency(
                                                range.min
                                            )} - ${formatCurrency(range.max)}`
                                        : formatCurrency(p.price);

                                    return (
                                        <tr key={p?.productId} className="align-middle">
                                            <td>
                                                <input type="checkbox" />
                                            </td>
                                            <td className="text-center">
                                                <div
                                                    className="border rounded shadow-sm"
                                                    style={{
                                                        width: 60,
                                                        height: 60,
                                                        overflow: "hidden",
                                                        backgroundColor: "#f8f9fa",
                                                        display: "flex",
                                                        alignItems: "center",
                                                        justifyContent: "center"
                                                    }}
                                                >
                                                    <img
                                                        src={process.env.REACT_APP_API_URL + thumb}
                                                        alt={p.productName}
                                                        style={{
                                                            width: "100%",
                                                            height: "70%",
                                                            objectFit: "cover",
                                                            display: "block",
                                                            padding: "10px",
                                                        }}
                                                        onError={(e) => {
                                                            e.target.src = "/no-image.png";
                                                        }}
                                                    />
                                                </div>
                                            </td>

                                            <td>
                                                {p.productName
                                                    ? p.productName.length > 40
                                                        ? p.productName.slice(0, 40) + "..."
                                                        : p.productName
                                                    : "(Không tên)"}
                                            </td>
                                            <td>{sku}</td>
                                            <td>{displayedPrice}</td>
                                            <td>
                                                <FormInventory productId={p.productId} variants={p.variants} />
                                            </td>
                                            <td>
                                                {p.category?.categoryName ||
                                                    p.categoryName ||
                                                    p.category_id ||
                                                    "—"}
                                            </td>
                                            <td>{createdLabel}</td>
                                            <td>{p.createdBy.username}</td>
                                            <td className="text-center">
                                                {hasPermission(["product.update"]) && (
                                                    <button
                                                        className="btn btn-info btn-sm me-2"
                                                        data-bs-toggle="modal"
                                                        data-bs-target="#modalEditProduct"
                                                        onClick={() => { setEditProduct(p); setIsOpen(true); }}
                                                    >
                                                        Edit
                                                    </button>
                                                )}

                                                {hasPermission(["product.delete"]) && (
                                                    <button
                                                        className="btn btn-danger btn-sm"
                                                        onClick={() => handleDelete(p?.productId)}
                                                    >
                                                        Delete
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    );
                                })
                            ) : (
                                <tr>
                                    <td colSpan="9" className="text-center py-3">
                                        Không có sản phẩm
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>

                    <div className="d-flex mx-4 mt-2 mb-2 align-items-center gap-2">
                        <input
                            className="form-check-input"
                            type="checkbox"
                            id="checkDefault"
                        />
                        <div className="dropdown">
                            <button
                                className="btn btn-light dropdown-toggle"
                                type="button"
                                data-bs-toggle="dropdown"
                                aria-expanded="false"
                            >
                                Hành động hàng loạt
                            </button>
                            <ul className="dropdown-menu">
                                <li>
                                    <button className="dropdown-item">
                                        Action
                                    </button>
                                </li>
                                <li>
                                    <button className="dropdown-item">
                                        Another action
                                    </button>
                                </li>
                                <li>
                                    <button className="dropdown-item">
                                        Something else here
                                    </button>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
            <FormEdit
                product={editProduct}
                isOpen={isOpen}
                onClosed={() => {
                    setIsOpen(false);
                    setEditProduct(null);
                }}
                onUpdated={(updated) => {
                    if (!updated) return;

                    setProducts(prev =>
                        prev.map(p => {
                            const oldId = p.productId;
                            const newId = updated.productId;

                            return oldId === newId ? updated : p;
                        })
                    );
                }}

            />

        </div>
    );
}
