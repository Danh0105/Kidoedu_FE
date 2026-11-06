import { useEffect, useState } from "react";
import InventoryModal from "./InventoryModal";
import InventoryViewModal from "./InventoryViewModal";
import axios from "axios";
import { hasPermission } from "../../../utils/permission";
import { getReceipts } from "../../../services/repository-receipt";
import { useSearchParams } from "react-router-dom";
const API_BASE = process.env.REACT_APP_API_URL;
export default function InventoryReceipts() {
    const [searchParams] = useSearchParams();
    const warehouseId = Number(searchParams.get("warehouseId"));
    const [showModal, setShowModal] = useState(false);
    const [viewModal, setViewModal] = useState(false);
    const [selectedReceipt, setSelectedReceipt] = useState(null);
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [suppliers, setSuppliers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [list, setList] = useState([]);
    const [totalPages, setTotalPages] = useState(1);

    const openModal = async (receipt) => {
        if (!receipt) {
            setSelectedReceipt(null);
            setShowModal(true);
            return;
        }

        const res = await axios.get(
            `${API_BASE}/inventory/${receipt.receiptId}`
        );

        setSelectedReceipt(res.data);
        setShowModal(true);
    };
    const fetchSuppliers = async () => {
        try {
            const res = await axios.get(`${API_BASE}/suppliers`);
            setSuppliers(res.data?.data || res.data || []);
        } catch (err) {
            console.error("Lỗi tải suppliers:", err);
        }
    };
    const openViewModal = async (receipt) => {
        const res = await axios.get(
            `${API_BASE}/inventory/${receipt.receiptId}`
        );

        setSelectedReceipt(res.data);
        setViewModal(true);
    };
    const resetFilters = () => {
        setFilters({
            supplierId: "",
            fromDate: "",
            toDate: "",
            minTotal: "",
            maxTotal: ""
        });
        setPage(1);
    };

    const [filters, setFilters] = useState({
        type: "",
        supplierId: "",
        fromDate: "",
        toDate: "",
        minTotal: "",
        maxTotal: ""
    });

    const fetchAllData = async () => {
        try {
            setLoading(true);

            const data = await getReceipts({
                warehouseId,
                page,
                limit: 20,
                ...filters,
                q: search,
            });
            console.log("Data nhận được:", data);
            setList(data.data || []);
            setTotalPages(data.totalPages || 1);

        } catch (err) {
            console.error("Lỗi tải dữ liệu:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAllData();
    }, [page, filters, search, warehouseId]);

    useEffect(() => {
        fetchSuppliers();
    }, []);

    useEffect(() => {
        fetchAllData();
    }, [page, filters, search]);


    const deleteItem = async (receiptId) => {
        if (!window.confirm("Bạn có chắc muốn xoá phiếu này?")) return;

        try {
            await axios.delete(`${API_BASE}/inventory/${receiptId}`);
            fetchAllData();
        } catch (err) {
            alert(err.response?.data?.message || "Có lỗi xảy ra!");
        }
    };

    return (
        <div className="card shadow-sm">
            <div className="card-body">

                {/* HEADER */}
                <div className="d-flex justify-content-between align-items-center mb-3">
                    {hasPermission(["inventory.create"]) && (
                        <button
                            className="btn btn-primary"
                            onClick={() => openModal(null)}
                        >
                            + Tạo phiếu mới
                        </button>
                    )}

                    <input
                        className="form-control"
                        style={{ maxWidth: 300 }}
                        placeholder="Tìm theo mã phiếu / nhà cung cấp..."
                        value={search}
                        onChange={(e) => {
                            setSearch(e.target.value);
                            setPage(1);
                        }}
                    />
                </div>

                {/* FILTER */}
                <div className="row g-2 mb-3">
                    <div className="col-md-2">
                        <select
                            className="form-select"
                            value={filters.type}
                            onChange={(e) => {
                                setFilters({
                                    ...filters,
                                    type: e.target.value
                                });
                                setPage(1);
                            }}
                        >
                            <option value="">-- Tất cả loại phiếu --</option>
                            <option value="import">Phiếu nhập</option>
                            <option value="export">Phiếu xuất</option>
                        </select>
                    </div>
                    <div className="col-md-3">
                        <select
                            className="form-select"
                            value={filters.supplierId}
                            onChange={(e) => {
                                setFilters({
                                    ...filters,
                                    supplierId: e.target.value,
                                });
                                setPage(1);
                            }}
                        >
                            <option value="">-- Tất cả nhà cung cấp --</option>
                            {suppliers.map((s) => (
                                <option key={s.supplierId} value={s.supplierId}>
                                    {s.supplierName}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="col-md-2">
                        <input
                            type="date"
                            className="form-control"
                            value={filters.fromDate}
                            onChange={(e) => {
                                setFilters({ ...filters, fromDate: e.target.value });
                                setPage(1);
                            }}
                        />
                    </div>

                    <div className="col-md-2">
                        <input
                            type="date"
                            className="form-control"
                            value={filters.toDate}
                            onChange={(e) => {
                                setFilters({ ...filters, toDate: e.target.value });
                                setPage(1);
                            }}
                        />
                    </div>

                    <div className="col-md-2">
                        <input
                            type="number"
                            className="form-control"
                            placeholder="Tổng tiền từ"
                            value={filters.minTotal}
                            onChange={(e) => {
                                setFilters({ ...filters, minTotal: e.target.value });
                                setPage(1);
                            }}
                        />
                    </div>

                    <div className="col-md-2">
                        <input
                            type="number"
                            className="form-control"
                            placeholder="Tổng tiền đến"
                            value={filters.maxTotal}
                            onChange={(e) => {
                                setFilters({ ...filters, maxTotal: e.target.value });
                                setPage(1);
                            }}
                        />
                    </div>

                    <div className="col-md-1">
                        <button
                            className="btn btn-outline-secondary w-100"
                            onClick={resetFilters}
                        >
                            Reset
                        </button>
                    </div>
                </div>

                {/* TABLE */}
                <div className="table-responsive">
                    <table className="table table-hover align-middle">
                        <thead className="table-light">
                            <tr>
                                <th>Loại</th>
                                <th>Mã phiếu</th>
                                <th>Nhà cung cấp</th>
                                <th>Ngày</th>
                                <th className="text-end">Tổng tiền</th>
                                <th>Ghi chú</th>
                                <th className="text-center">Thao tác</th>
                            </tr>
                        </thead>

                        <tbody>
                            {loading && (
                                <tr>
                                    <td colSpan={6} className="text-center">
                                        Đang tải...
                                    </td>
                                </tr>
                            )}

                            {!loading && list?.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="text-center">
                                        Không có phiếu nào
                                    </td>
                                </tr>
                            )}

                            {!loading &&
                                list.map((r) => (
                                    <tr key={r.receiptId}>
                                        <td>
                                            {r.type === "import" && (
                                                <span className="badge bg-success">Nhập</span>
                                            )}

                                            {r.type === "export" && (
                                                <span className="badge bg-danger">Xuất</span>
                                            )}
                                        </td>
                                        <td>
                                            <button
                                                className="btn btn-link p-0"
                                                onClick={() => openViewModal(r)}
                                                style={{ textDecoration: "underline" }}
                                            >
                                                {r.receiptCode}
                                            </button>
                                        </td>

                                        <td>
                                            {r.supplier?.supplierName || "Kho nội bộ"}
                                        </td>

                                        <td>
                                            {new Date(r.createdAt).toLocaleDateString(
                                                "vi-VN"
                                            )}
                                        </td>

                                        <td className="text-end">
                                            {Number(r.totalAmount).toLocaleString(
                                                "vi-VN"
                                            )}{" "}
                                            đ
                                        </td>

                                        <td>{r.note || ""}</td>

                                        <td className="text-center">
                                            {hasPermission(["inventory.update"]) && (
                                                <button
                                                    className="btn btn-sm btn-outline-secondary me-2"
                                                    onClick={() => openModal(r)}
                                                >
                                                    Sửa
                                                </button>
                                            )}

                                            {hasPermission(["inventory.delete"]) && (
                                                <button
                                                    className="btn btn-sm btn-outline-danger"
                                                    onClick={() =>
                                                        deleteItem(r.receiptId)
                                                    }
                                                >
                                                    Xoá
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                        </tbody>
                    </table>
                </div>

                {/* PAGINATION */}
                <div className="d-flex justify-content-center mt-3">
                    <button
                        className="btn btn-outline-secondary me-2"
                        disabled={page === 1}
                        onClick={() => setPage(page - 1)}
                    >
                        Trước
                    </button>

                    <span className="align-self-center">
                        Trang {page} / {totalPages}
                    </span>

                    <button
                        className="btn btn-outline-secondary ms-2"
                        disabled={page === totalPages}
                        onClick={() => setPage(page + 1)}
                    >
                        Sau
                    </button>
                </div>

                {/* MODALS */}
                {showModal && (
                    <InventoryModal
                        show={showModal}
                        onClose={() => setShowModal(false)}
                        data={selectedReceipt}
                        onSaved={fetchAllData}
                    />
                )}

                {viewModal && (
                    <InventoryViewModal
                        show={viewModal}
                        onClose={() => setViewModal(false)}
                        data={selectedReceipt}
                    />
                )}
            </div>
        </div>
    );
}