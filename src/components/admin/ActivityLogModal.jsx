import React, { useEffect, useState } from "react";
import axios from "axios";
import AdminDetailModal from "./AdminDetailModal";

const ActivityLogModal = ({ onClose }) => {
    const [logs, setLogs] = useState([]);
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [totalPages, setTotalPages] = useState(1);
    const [selectedAdmin, setSelectedAdmin] = useState(null);
    const [showAdminModal, setShowAdminModal] = useState(false);
    const [filters, setFilters] = useState({
        action: "",
        module: "",
        search: "",
        from: "",
        to: ""
    });
    const renderPagination = () => {
        const items = [];
        const maxVisible = 5;

        let start = Math.max(1, page - 2);
        let end = Math.min(totalPages, start + maxVisible - 1);

        if (end - start < maxVisible - 1) {
            start = Math.max(1, end - maxVisible + 1);
        }

        // Nút Previous
        items.push(
            <li key="prev" className={`page-item ${page === 1 ? "disabled" : ""}`}>
                <button
                    className="page-link"
                    onClick={() => setPage(page - 1)}
                >
                    &laquo;
                </button>
            </li>
        );

        // Số trang
        for (let i = start; i <= end; i++) {
            items.push(
                <li
                    key={i}
                    className={`page-item ${page === i ? "active" : ""}`}
                >
                    <button
                        className="page-link"
                        onClick={() => setPage(i)}
                    >
                        {i}
                    </button>
                </li>
            );
        }

        // Nút Next
        items.push(
            <li
                key="next"
                className={`page-item ${page === totalPages ? "disabled" : ""}`}
            >
                <button
                    className="page-link"
                    onClick={() => setPage(page + 1)}
                >
                    &raquo;
                </button>
            </li>
        );

        return items;
    };


    useEffect(() => {
        fetchLogs();
    }, [page, limit, filters]);


    const fetchLogs = async () => {
        const token = localStorage.getItem("access_token");

        const res = await axios.get(
            `${process.env.REACT_APP_API_URL}/admin/activity-logs`,
            {
                params: {
                    page,
                    limit,
                    ...filters
                },
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

        setLogs(res.data.data);
        setTotalPages(res.data.totalPages);
    };


    const handleChange = (e) => {
        setFilters({
            ...filters,
            [e.target.name]: e.target.value
        });
    };


    const openAdmin = async (adminId) => {
        const token = localStorage.getItem("access_token");

        const res = await axios.get(
            `${process.env.REACT_APP_API_URL}/users/${adminId}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );
        console.log(res.data);

        setSelectedAdmin(res.data);
        setShowAdminModal(true);
    };
    return (
        <>
            <div className="modal fade show d-block">
                <div className="modal-dialog modal-xl modal-dialog-scrollable">
                    <div className="modal-content">

                        <div className="modal-header">
                            <h5 className="modal-title">
                                <i className="bi bi-clock-history me-2"></i>
                                Nhật ký hoạt động
                            </h5>
                            <button
                                type="button"
                                className="btn-close"
                                onClick={onClose}
                            />
                        </div>

                        <div className="modal-body">

                            {/* 🔥 FILTER */}
                            <div className="row mb-3">

                                <div className="col-md-2">
                                    <select
                                        className="form-select"
                                        name="action"
                                        onChange={handleChange}
                                    >
                                        <option value="">Tất cả hành động</option>
                                        <option value="CREATE">Tạo mới</option>
                                        <option value="UPDATE">Cập nhật</option>
                                        <option value="DELETE">Xóa</option>
                                        <option value="CHANGE_STATUS">Đổi trạng thái</option>
                                    </select>
                                </div>

                                <div className="col-md-2">
                                    <select
                                        className="form-select"
                                        name="module"
                                        onChange={handleChange}
                                    >
                                        <option value="">Tất cả phân hệ</option>
                                        <option value="ORDER">Đơn hàng</option>
                                        <option value="PRODUCT">Sản phẩm</option>
                                        <option value="USER">Người dùng</option>
                                    </select>
                                </div>

                                <div className="col-md-3">
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="search"
                                        placeholder="Tìm nội dung..."
                                        onChange={handleChange}
                                    />
                                </div>

                                <div className="col-md-2">
                                    <input
                                        type="date"
                                        className="form-control"
                                        name="from"
                                        onChange={handleChange}
                                    />
                                </div>

                                <div className="col-md-2">
                                    <input
                                        type="date"
                                        className="form-control"
                                        name="to"
                                        onChange={handleChange}
                                    />
                                </div>

                            </div>
                            <nav className="d-flex justify-content-end mt-3 mb-2">
                                <ul className="pagination pagination-sm mb-0">
                                    {renderPagination()}
                                </ul>
                            </nav>


                            {/* TABLE */}
                            <table className="table table-bordered table-hover table-sm">
                                <thead className="table-light">
                                    <tr>
                                        <th>Admin</th>
                                        <th>Hành động</th>
                                        <th>Phân hệ</th>
                                        <th>Nội dung</th>
                                        <th>IP</th>
                                        <th>User Agent</th>
                                        <th>Thời gian</th>

                                    </tr>
                                </thead>
                                <tbody>
                                    {logs.map((log) => (
                                        <tr key={log.id}>
                                            <td className="text-center">
                                                <button
                                                    className="btn btn-link p-0 text-decoration-none"
                                                    onClick={() => openAdmin(log.adminId)}
                                                >
                                                    {log.adminId}
                                                </button>
                                            </td>

                                            <td>
                                                <span className={`badge bg-${getActionColor(log.action)}`}>
                                                    {translateAction(log.action)}
                                                </span>
                                            </td>
                                            <td>{translateModule(log.module)}</td>
                                            <td>{log.description}</td>
                                            <td>{log.ipAddress}</td>
                                            <td style={{ maxWidth: "200px", wordBreak: "break-word" }}>
                                                {log.userAgent}
                                            </td>
                                            <td>
                                                {new Date(log.createdAt).toLocaleString()}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>

                        </div>

                        <div className="modal-footer">
                            <button
                                className="btn btn-secondary"
                                onClick={onClose}
                            >
                                Đóng
                            </button>
                        </div>

                    </div>
                </div>
            </div>
            {showAdminModal && (
                <AdminDetailModal
                    admin={selectedAdmin}
                    onClose={() => setShowAdminModal(false)}
                />
            )}

            <div className="modal-backdrop fade show"></div>
        </>
    );
};

const getActionColor = (action) => {
    switch (action) {
        case "CREATE": return "success";
        case "UPDATE": return "warning";
        case "DELETE": return "danger";
        case "CHANGE_STATUS": return "info";
        default: return "secondary";
    }
};

const translateAction = (action) => {
    switch (action) {
        case "CREATE": return "Tạo mới";
        case "UPDATE": return "Cập nhật";
        case "DELETE": return "Xóa";
        case "CHANGE_STATUS": return "Đổi trạng thái";
        default: return action;
    }
};

const translateModule = (module) => {
    switch (module) {
        case "ORDER": return "Đơn hàng";
        case "PRODUCT": return "Sản phẩm";
        case "USER": return "Người dùng";
        default: return module;
    }
};

export default ActivityLogModal;
