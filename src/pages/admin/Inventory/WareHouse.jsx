import React, { useEffect, useState } from "react";
import { Warehouse, Pencil, Trash2 } from "lucide-react";
import './css/InventoryManager.css';
import { Link } from "react-router-dom";
import { createWarehouse, deleteWarehouse, getWarehouses, updateWarehouse } from "../../../services/warehouse";
const API_BASE = process.env.REACT_APP_API_URL;

export default function InventoryManager() {
    const [showModal, setShowModal] = useState(false);
    const [warehouses, setWarehouses] = useState([]);
    const [editingWarehouse, setEditingWarehouse] = useState(null);
    const [formData, setFormData] = useState({
        warehouseName: "",
        warehouseCode: "",
        address: ""
    });
    const fetchWarehouses = async () => {
        try {
            const data = await getWarehouses();
            setWarehouses(data);
        } catch (err) {
            console.error(err);
        }
    };
    useEffect(() => {
        fetchWarehouses();
    }, []);
    const handleSubmit = async () => {
        try {
            if (editingWarehouse) {
                // UPDATE
                await updateWarehouse(editingWarehouse.warehouseId, formData);
                alert("Cập nhật thành công!");
            } else {
                // CREATE
                await createWarehouse(formData);
                alert("Tạo kho thành công!");
            }

            fetchWarehouses();

            setShowModal(false);
            setEditingWarehouse(null);

            setFormData({
                warehouseName: "",
                warehouseCode: "",
                address: ""
            });

        } catch (error) {
            console.error(error);
            alert("Có lỗi xảy ra!");
        }
    };

    const handleDelete = async (id) => {
        try {
            await deleteWarehouse(id);
            fetchWarehouses();
        } catch (err) {
            console.error(err);
        }
    };
    return (
        <div >
            <div className="container-fluid py-4 bg-light min-vh-100">
                <div className="d-flex justify-content-between align-items-center mb-3">

                    <button
                        className="btn btn-primary"
                        onClick={() => setShowModal(true)}
                    >
                        + Tạo kho
                    </button>
                </div>
                <div className="row g-4 justify-content-center">
                    {warehouses.map((wh) => (
                        <div
                            key={wh.warehouseId} className="col-6 col-md-4 col-lg-3 col-xl-2"
                        >
                            <Link
                                to={`/admin/inventory?warehouseId=${wh.warehouseId}`}
                                className="text-decoration-none text-dark"
                            >
                                <div className="card h-100 shadow-sm border-0 text-center warehouse-card">

                                    {/* ICON */}
                                    <div className="pt-4">
                                        <div className="bg-primary bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center"
                                            style={{ width: 80, height: 80 }}>
                                            <Warehouse size={36} className="text-primary" />
                                        </div>
                                    </div>

                                    {/* BODY */}
                                    <div className="card-body">
                                        <h6 className="fw-semibold mb-1">
                                            {wh.warehouseName}
                                        </h6>

                                        <span className="badge bg-light text-muted mb-2">
                                            {wh.warehouseCode}
                                        </span>

                                        <p className="text-muted small mb-0">
                                            {wh.address || "Chưa có địa chỉ"}
                                        </p>
                                    </div>

                                    {/* ACTION */}
                                    <div className="card-footer bg-transparent border-0 d-flex justify-content-center gap-2 pb-3">
                                        <button
                                            onClick={(e) => {
                                                e.preventDefault();

                                                setEditingWarehouse(wh);

                                                setFormData({
                                                    warehouseName: wh.warehouseName,
                                                    warehouseCode: wh.warehouseCode,
                                                    address: wh.address || ""
                                                });

                                                setShowModal(true);
                                            }}
                                            className="btn btn-sm btn-warning d-flex align-items-center gap-1"
                                        >
                                            <Pencil size={14} />
                                            Sửa
                                        </button>

                                        <button
                                            onClick={(e) => {
                                                handleDelete(wh.warehouseId)
                                                e.preventDefault();
                                                e.stopPropagation();
                                            }}

                                            className="btn btn-sm btn-danger d-flex align-items-center gap-1"
                                        >
                                            <Trash2 size={14} />
                                            Xóa
                                        </button>
                                    </div>
                                </div>
                            </Link>
                        </div>
                    ))}
                </div>
            </div>
            {showModal && (
                <>
                    <div className="modal fade show" style={{ display: "block" }}>
                        <div className="modal-dialog modal-dialog-centered">
                            <div className="modal-content shadow-lg border-0">

                                {/* HEADER */}
                                <div className="modal-header">
                                    <h5 className="modal-title">
                                        {editingWarehouse ? "Chỉnh sửa kho" : "Tạo kho"}
                                    </h5>
                                    <button
                                        type="button"
                                        className="btn-close"
                                        onClick={() => setShowModal(false)}
                                    />
                                </div>

                                {/* BODY */}
                                <div className="modal-body">
                                    <div className="mb-3">
                                        <label className="form-label">Tên kho</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={formData.warehouseName}
                                            onChange={(e) =>
                                                setFormData({ ...formData, warehouseName: e.target.value })
                                            }
                                        />
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label">Mã kho</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={formData.warehouseCode}
                                            onChange={(e) =>
                                                setFormData({ ...formData, warehouseCode: e.target.value })
                                            }
                                        />
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label">Địa chỉ</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={formData.address}
                                            onChange={(e) =>
                                                setFormData({ ...formData, address: e.target.value })
                                            }
                                        />
                                    </div>
                                </div>

                                {/* FOOTER */}
                                <div className="modal-footer">
                                    <button
                                        className="btn btn-secondary"
                                        onClick={() => setShowModal(false)}
                                    >
                                        Hủy
                                    </button>

                                    <button
                                        className="btn btn-primary"
                                        onClick={handleSubmit}
                                    >
                                        {editingWarehouse ? "Cập nhật" : "Lưu"}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* BACKDROP */}
                    <div
                        className="modal-backdrop fade show"
                        onClick={() => setShowModal(false)}
                    />
                </>
            )}
            {/* Tabs */}
            {/*  <ul className="nav nav-tabs mb-3">
            <li className="nav-item">
                <button
                    className={`nav-link ${activeTab === 'promotion' ? 'active' : ''}`}
                    onClick={() => setActiveTab('promotion')}
                >
                    📤 Phiếu xuất kho
                </button>
            </li>

            <li className="nav-item">
                <button
                    className={`nav-link ${activeTab === 'banner' ? 'active' : ''}`}
                    onClick={() => setActiveTab('banner')}
                >
                    📦 Sản phẩm trong kho
                </button>
            </li>
        </ul> */}

            {/* Content */}
            {/*      {activeTab === 'promotion' && (
            <InventoryReceipts hasPermission={hasPermission} />
        )}

        {activeTab === 'banner' && (
            <InventoryProduct />
        )} */}
        </div>

    );
}