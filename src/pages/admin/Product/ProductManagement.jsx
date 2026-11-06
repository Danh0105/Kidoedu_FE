import React, { useCallback, useEffect, useMemo, useState } from "react";
import FormCreate from "./FormCreate";
import axios from "axios";
import FormEdit from "./FormEdit";
import { fetchAllProductsApiForAdmin } from "../../../services/Product";
import FormInventory from "../../../components/admin/FormInventory";
import { useDebounce } from "../../../hooks/useDebounce";
import { hasPermission } from "../../../utils/permission";
import { getAuthInfo } from "../../../utils/getAuthInfo";
import { useSearchParams } from "react-router-dom";
const PLACEHOLDER_IMG = "https://placehold.co/120x120?text=No+Image";

export default function ProductManagement() {
    const [products, setProducts] = useState([]);
    const [meta, setMeta] = useState(null);
    const [editProduct, setEditProduct] = useState(null);
    const [isOpen, setIsOpen] = useState(false);

    const [searchParams] = useSearchParams();
    const catFromUrl = searchParams.get("cat");

    const [q, setQ] = useState("");
    const debouncedQ = useDebounce(q, 500);

    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [loading, setLoading] = useState(false);
    const [err, setErr] = useState("");
    const [selectedCatId, setSelectedCatId] = useState(
        catFromUrl ? Number(catFromUrl) : null
    );
    const [sort, setSort] = useState("");
    const [filters, setFilters] = useState({
        status: "",
        minPrice: "",
        maxPrice: "",
        createdBy: "",
        fromDate: "",
        toDate: "",
    });
    const fetchProducts = useCallback(
        async (signal) => {
            setLoading(true);
            setErr("");

            try {
                const params = {
                    page,
                    limit,
                    ...(selectedCatId && { category_id: selectedCatId }),
                    ...(sort && { sort }),

                    ...(filters.status !== "" && {
                        status: Number(filters.status),
                    }),

                    ...(filters.minPrice !== "" && {
                        min_price: Number(filters.minPrice),
                    }),

                    ...(filters.maxPrice !== "" && {
                        max_price: Number(filters.maxPrice),
                    }),

                    ...(filters.createdBy && {
                        created_by: filters.createdBy,
                    }),

                    ...(filters.fromDate && {
                        from_date: filters.fromDate,
                    }),

                    ...(filters.toDate && {
                        to_date: filters.toDate,
                    }),
                };
                const res = await fetchAllProductsApiForAdmin(
                    debouncedQ.trim()
                        ? { ...params, q: debouncedQ }
                        : params,
                    signal
                );

                // ✅ SỬA: dùng setProducts thay vì setItems
                setProducts(res?.data ?? []);
                console.log("RES:", res.data);

                setMeta({
                    page: res?.meta?.page ?? 1,
                    last_page: res?.meta?.last_page ?? 0,
                    total: res?.meta?.total ?? 0,
                    limit: res?.meta?.limit ?? limit,
                });
            } catch (e) {
                if (e.name !== "CanceledError" && e.code !== "ERR_CANCELED") {
                    setErr(e?.message || "Đã có lỗi xảy ra");
                }
            } finally {
                setLoading(false);
            }
        },
        [page, limit, debouncedQ, selectedCatId, sort, filters]);

    // ✅ SỬA: dùng AbortController đúng chuẩn
    useEffect(() => {
        const controller = new AbortController();

        fetchProducts(controller.signal);

        return () => {
            controller.abort();
        };
    }, [fetchProducts]);

    const formatCurrency = (value) =>
        new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
        }).format(Number(value || 0));

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
        const deleteBy = getAuthInfo();

        try {
            await axios.delete(
                `${process.env.REACT_APP_API_URL}/products/${id}`,
                {
                    data: {
                        deleteBy: deleteBy.role.id
                    }
                }
            );

            setProducts((prev) => prev.filter((p) => p?.productId !== id));

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
                    <div className="col-md-2">
                        <button
                            className="btn btn-outline-secondary mt-2"
                            onClick={() => {
                                setFilters({
                                    status: "",
                                    minPrice: "",
                                    maxPrice: "",
                                    createdBy: "",
                                    fromDate: "",
                                    toDate: "",
                                });
                                setPage(1);
                            }}
                        >
                            Reset filter
                        </button>
                    </div>
                    <div className="col-6 d-flex justify-content-end">
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

                    <div className="row g-2 mt-2 mb-2">

                        {/* Status */}
                        <div className="col-md-2">
                            <select
                                className="form-select"
                                value={filters.status}
                                onChange={(e) =>
                                    setFilters(prev => ({ ...prev, status: e.target.value }))
                                }
                            >
                                <option value="">-- Trạng thái --</option>
                                <option value="1">Mới</option>
                                <option value="2">Nổi bật</option>
                                <option value="4">Hiển thị</option>
                                <option value="0">Chưa hiển thị</option>
                            </select>
                        </div>

                        {/* Giá từ */}
                        <div className="col-md-2">
                            <input
                                type="number"
                                className="form-control"
                                placeholder="Giá từ"
                                value={filters.minPrice}
                                onChange={(e) =>
                                    setFilters(prev => ({ ...prev, minPrice: e.target.value }))
                                }
                            />
                        </div>

                        {/* Giá đến */}
                        <div className="col-md-2">
                            <input
                                type="number"
                                className="form-control"
                                placeholder="Giá đến"
                                value={filters.maxPrice}
                                onChange={(e) =>
                                    setFilters(prev => ({ ...prev, maxPrice: e.target.value }))
                                }
                            />
                        </div>

                        {/* Người tạo */}
                        <div className="col-md-2">
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Người tạo"
                                value={filters.createdBy}
                                onChange={(e) =>
                                    setFilters(prev => ({ ...prev, createdBy: e.target.value }))
                                }
                            />
                        </div>

                        {/* Từ ngày */}
                        <div className="col-md-2">
                            <input
                                type="date"
                                className="form-control"
                                value={filters.fromDate}
                                onChange={(e) =>
                                    setFilters(prev => ({ ...prev, fromDate: e.target.value }))
                                }
                            />
                        </div>

                        {/* Đến ngày */}
                        <div className="col-md-2">
                            <input
                                type="date"
                                className="form-control"
                                value={filters.toDate}
                                onChange={(e) =>
                                    setFilters(prev => ({ ...prev, toDate: e.target.value }))
                                }
                            />
                        </div>

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
                                        <tr
                                            key={p?.productId}
                                            className={`align-middle ${((p.status & 4) === 0) ? "table-light" : ""}`}
                                        >
                                            <td className="text-center">
                                                <input type="checkbox" />
                                            </td>

                                            {/* Ảnh */}
                                            <td className="text-center">
                                                <div
                                                    className="border rounded-3 shadow-sm bg-light d-flex align-items-center justify-content-center mx-auto"
                                                    style={{ width: 64, height: 64 }}
                                                >
                                                    <img
                                                        src={process.env.REACT_APP_API_URL + thumb}
                                                        alt={p.productName}
                                                        className="img-fluid"
                                                        style={{ maxHeight: 48, objectFit: "cover" }}
                                                        onError={(e) => (e.target.src = "/no-image.png")}
                                                    />
                                                </div>
                                            </td>

                                            {/* Tên sản phẩm */}
                                            <td style={{ minWidth: 240 }}>
                                                <div className="fw-semibold">
                                                    {p.productName?.length > 40
                                                        ? p.productName.slice(0, 40) + "..."
                                                        : p.productName || "(Không tên)"}
                                                </div>

                                                <div className="mt-2 d-flex flex-wrap gap-2">

                                                    {(p.status & 1) !== 0 && (
                                                        <span className="badge bg-primary">
                                                            Mới
                                                        </span>
                                                    )}

                                                    {(p.status & 2) !== 0 && (
                                                        <span className="badge bg-warning text-dark">
                                                            Nổi bật
                                                        </span>
                                                    )}
                                                    {/*  {(p.status & 7) !== 0 && (
                                                        <div>
                                                            <span className="badge bg-warning text-dark">
                                                                Nổi bật
                                                            </span>
                                                            <span className="badge bg-primary">
                                                                Mới
                                                            </span>
                                                        </div>
                                                    )} */}
                                                    {(p.status & 4) === 0 && (
                                                        <span className="badge bg-secondary">
                                                            Chưa hiển thị
                                                        </span>
                                                    )}

                                                </div>
                                            </td>

                                            {/* SKU */}
                                            <td className="text-muted">{sku}</td>

                                            {/* Giá */}
                                            <td className="fw-bold text-danger">{displayedPrice}</td>

                                            {/* Tồn kho */}
                                            <td>
                                                <FormInventory productId={p.productId} variants={p.variants} />
                                            </td>

                                            {/* Danh mục */}
                                            <td>{p.category?.categoryName || "—"}</td>

                                            {/* Ngày tạo */}
                                            <td className="text-muted">{createdLabel}</td>


                                            {/* Actions */}
                                            <td className="text-center">
                                                {hasPermission(["product.update"]) && (
                                                    <button
                                                        className="btn btn-outline-primary btn-sm me-2"
                                                        data-bs-toggle="modal"
                                                        data-bs-target="#modalEditProduct"
                                                        onClick={() => {
                                                            setEditProduct(p);
                                                            setIsOpen(true);
                                                        }}
                                                    >
                                                        Edit
                                                    </button>
                                                )}

                                                {hasPermission(["product.delete"]) && (
                                                    <button
                                                        className="btn btn-outline-danger btn-sm"
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

        </div >
    );
}
