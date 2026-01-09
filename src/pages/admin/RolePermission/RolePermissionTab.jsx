import { useEffect, useState } from "react";
import axios from "axios";

export default function RolePermissionTab() {
    const [roles, setRoles] = useState([]);
    const [permissions, setPermissions] = useState([]);
    const [selectedRole, setSelectedRole] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showCreate, setShowCreate] = useState(false);
    const [editingRoleId, setEditingRoleId] = useState(null);
    const [editingRole, setEditingRole] = useState({
        name: "",
        description: "",
    });
    // 🔥 state tạo role
    const [newRole, setNewRole] = useState({
        name: "",
        description: "",
    });
    const [creating, setCreating] = useState(false);
    const [editingPermissionId, setEditingPermissionId] = useState(null);
    const [editingPermission, setEditingPermission] = useState({
        code: "",
        description: "",
    });

    const token = localStorage.getItem("access_token");
    const authHeader = {
        headers: { Authorization: `Bearer ${token}` },
    };

    /* ===============================
        LOAD ROLES + PERMISSIONS
    =============================== */
    const loadData = async () => {
        setLoading(true);
        const [rolesRes, permissionsRes] = await Promise.all([
            axios.get(`${process.env.REACT_APP_API_URL}/roles`, authHeader),
            axios.get(`${process.env.REACT_APP_API_URL}/roles/permissions`, authHeader),
        ]);
        setRoles(rolesRes.data);
        setPermissions(permissionsRes.data);
        setSelectedRole(rolesRes.data?.[0] || null);
        setLoading(false);
    };

    useEffect(() => {
        loadData();
    }, []);

    if (loading) return <p>Đang tải dữ liệu...</p>;
    if (!selectedRole) return <p>Không có vai trò</p>;

    const rolePermissions = selectedRole.permissions || [];
    const hasPermission = (permissionId) =>
        rolePermissions.some(p => p.id === permissionId);

    /* ===============================
        UPDATE ROLE PERMISSION
    =============================== */
    const updatePermission = async (permissionId, checked) => {
        const url = `${process.env.REACT_APP_API_URL}/roles/${selectedRole.id}/permissions`;

        if (checked) {
            await axios.post(url, { permissionIds: [permissionId] }, authHeader);
        } else {
            await axios.delete(url, {
                ...authHeader,
                data: { permissionIds: [permissionId] },
            });
        }

        const rolesRes = await axios.get(`${process.env.REACT_APP_API_URL}/roles`, authHeader);
        setRoles(rolesRes.data);
        setSelectedRole(rolesRes.data.find(r => r.id === selectedRole.id));
    };

    /* ===============================
        CREATE ROLE
    =============================== */
    const handleCreateRole = async () => {
        if (!newRole.name) {
            alert("Vui lòng nhập tên nhóm");
            return;
        }

        try {
            setCreating(true);
            await axios.post(
                `${process.env.REACT_APP_API_URL}/roles`,
                {
                    name: newRole.name.toUpperCase(),
                    description: newRole.description,
                    permissionIds: [],
                },
                authHeader
            );

            setNewRole({ name: "", description: "" });
            await loadData();
        } catch (err) {
            alert(err.response?.data?.message || "Tạo nhóm thất bại");
        } finally {
            setCreating(false);
        }
    };
    const handleUpdateRole = async (roleId) => {
        if (!editingRole.name) {
            alert("Tên nhóm không được để trống");
            return;
        }

        try {
            await axios.patch(
                `${process.env.REACT_APP_API_URL}/roles/${roleId}`,
                {
                    name: editingRole.name.toUpperCase(),
                    description: editingRole.description,
                },
                authHeader
            );

            setEditingRoleId(null);
            await loadData();
        } catch (err) {
            alert(err.response?.data?.message || "Cập nhật nhóm thất bại");
        }
    };
    const handleDeleteRole = async (role) => {
        if (role.name === "ADMIN") {
            alert("Không thể xóa vai trò ADMIN");
            return;
        }

        const ok = window.confirm(
            `Bạn có chắc muốn xóa vai trò "${role.name}" không?`
        );
        if (!ok) return;

        try {
            await axios.delete(
                `${process.env.REACT_APP_API_URL}/roles/${role.id}`,
                authHeader
            );

            setSelectedRole(null);
            await loadData();
        } catch (err) {
            alert(
                err.response?.data?.message ||
                "Không thể xóa vai trò (đang được sử dụng)"
            );
        }
    };
    const handleUpdatePermission = async (permissionId) => {
        if (!editingPermission.code) {
            alert("Code permission không được để trống");
            return;
        }

        try {
            await axios.patch(
                `${process.env.REACT_APP_API_URL}/permissions/${permissionId}`,
                {
                    code: editingPermission.code,
                    description: editingPermission.description,
                },
                authHeader
            );

            setEditingPermissionId(null);
            await loadData(); // reload permissions + roles
        } catch (err) {
            alert(err.response?.data?.message || "Cập nhật permission thất bại");
        }
    };
    const handleDeletePermission = async (permission) => {
        const ok = window.confirm(
            `Bạn có chắc muốn xóa permission "${permission.code}" không?`
        );
        if (!ok) return;

        try {
            await axios.delete(
                `${process.env.REACT_APP_API_URL}/permissions/${permission.id}`,
                authHeader
            );

            await loadData();
        } catch (err) {
            alert(
                err.response?.data?.message ||
                "Không thể xóa permission (đang được sử dụng)"
            );
        }
    };
    const isAllSelected =
        permissions.length > 0 &&
        permissions.every(p => hasPermission(p.id));
    const handleSelectAllPermissions = async () => {
        const url = `${process.env.REACT_APP_API_URL}/roles/${selectedRole.id}/permissions`;
        const permissionIds = permissions.map(p => p.id);

        if (!isAllSelected) {
            // ✅ gán tất cả permission
            await axios.post(
                url,
                { permissionIds },
                authHeader
            );
        } else {
            // ❌ gỡ tất cả permission
            await axios.delete(url, {
                ...authHeader,
                data: { permissionIds },
            });
        }

        // reload roles
        const rolesRes = await axios.get(
            `${process.env.REACT_APP_API_URL}/roles`,
            authHeader
        );
        setRoles(rolesRes.data);
        setSelectedRole(rolesRes.data.find(r => r.id === selectedRole.id));
    };

    /* ===============================
        RENDER
    =============================== */
    return (
        <div className="row">
            {/* ===== ROLES + CREATE ===== */}
            <div className="col-md-4">
                {/* CREATE ROLE */}
                <button
                    className="btn btn-outline-primary w-100 mb-3"
                    onClick={() => setShowCreate(!showCreate)}
                >
                    {showCreate ? "✖ Đóng tạo nhóm" : "➕ Tạo nhóm"}
                </button>
                {showCreate && (
                    <div className="card mb-3 border-primary">
                        <div className="card-header fw-bold">
                            Tạo nhóm mới
                        </div>
                        <div className="card-body">
                            <div className="mb-2">
                                <input
                                    className="form-control"
                                    placeholder="Tên nhóm (VD: SUPPORT)"
                                    value={newRole.name}
                                    onChange={(e) =>
                                        setNewRole({ ...newRole, name: e.target.value })
                                    }
                                />
                            </div>

                            <div className="mb-2">
                                <input
                                    className="form-control"
                                    placeholder="Mô tả"
                                    value={newRole.description}
                                    onChange={(e) =>
                                        setNewRole({ ...newRole, description: e.target.value })
                                    }
                                />
                            </div>

                            <div className="d-flex gap-2">
                                <button
                                    className="btn btn-primary flex-fill"
                                    disabled={creating}
                                    onClick={async () => {
                                        await handleCreateRole();
                                        setShowCreate(false);
                                    }}
                                >
                                    {creating ? "Đang tạo..." : "Tạo nhóm"}
                                </button>

                                <button
                                    className="btn btn-outline-secondary"
                                    onClick={() => setShowCreate(false)}
                                >
                                    Hủy
                                </button>
                            </div>
                        </div>
                    </div>
                )}


                {/* ROLE LIST */}
                <div className="list-group">
                    {roles.map(role => {
                        const isEditing = editingRoleId === role.id;

                        return (
                            <div
                                key={role.id}
                                className={`list-group-item d-flex flex-column gap-2
                    ${selectedRole?.id === role.id ? "active" : ""}`}
                            >
                                {/* ===== VIEW MODE ===== */}
                                {!isEditing && (
                                    <div className="d-flex justify-content-between align-items-start">
                                        <div
                                            className="flex-grow-1"
                                            style={{ cursor: "pointer" }}
                                            onClick={() => setSelectedRole(role)}
                                        >
                                            <div className="fw-semibold d-flex align-items-center gap-2">
                                                {role.name}

                                                {role.name === "ADMIN" && (
                                                    <span className="badge bg-danger">
                                                        SYSTEM
                                                    </span>
                                                )}
                                            </div>

                                            <small className="text-muted">
                                                {role.description || "Không có mô tả"}
                                            </small>
                                        </div>

                                        <div className="btn-group btn-group-sm d-flex align-items-center justify-content-end">
                                            <button
                                                className="btn btn-success"
                                                title="Sửa role"
                                                onClick={() => {
                                                    setEditingRoleId(role.id);
                                                    setEditingRole({
                                                        name: role.name,
                                                        description: role.description || "",
                                                    });
                                                }}
                                            >
                                                <i className="bi bi-pencil-square"></i>
                                            </button>

                                            <button
                                                className="btn btn-danger"
                                                title="Xóa role"
                                                disabled={role.name === "ADMIN"}
                                                onClick={() => handleDeleteRole(role)}
                                            >
                                                <i className="bi bi-trash"></i>
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {/* ===== EDIT MODE ===== */}
                                {isEditing && (
                                    <div className="border rounded p-2 bg-light">
                                        <input
                                            className="form-control mb-2"
                                            value={editingRole.name}
                                            onChange={(e) =>
                                                setEditingRole({
                                                    ...editingRole,
                                                    name: e.target.value,
                                                })
                                            }
                                        />

                                        <input
                                            className="form-control mb-2"
                                            placeholder="Mô tả"
                                            value={editingRole.description}
                                            onChange={(e) =>
                                                setEditingRole({
                                                    ...editingRole,
                                                    description: e.target.value,
                                                })
                                            }
                                        />

                                        <div className="d-flex gap-2 justify-content-end">
                                            <button
                                                className="btn btn-success btn-sm"
                                                onClick={() => handleUpdateRole(role.id)}
                                            >
                                                <i className="bi bi-check-lg me-1"></i>
                                                Lưu
                                            </button>

                                            <button
                                                className="btn btn-outline-secondary btn-sm"
                                                onClick={() => setEditingRoleId(null)}
                                            >
                                                <i className="bi bi-x-lg me-1"></i>
                                                Hủy
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>



            </div>

            {/* ===== PERMISSIONS ===== */}
            <div className="col-md-8">
                <div className="d-flex justify-content-between align-items-center mb-3">
                    <h6 className="mb-0">
                        Quyền của vai trò{" "}
                        <span className="text-primary">{selectedRole.name}</span>
                    </h6>

                    <button
                        className={`btn btn-sm ${isAllSelected ? "btn-outline-danger" : "btn-outline-primary"
                            }`}
                        onClick={handleSelectAllPermissions}
                    >
                        {isAllSelected ? "Bỏ chọn tất cả" : "Chọn tất cả"}
                    </button>
                </div>


                <table className="table table-bordered align-middle">
                    <thead className="table-light">
                        <tr>
                            <th>Permission</th>
                            <th className="text-center">Cho phép</th>
                            <th className="text-end">Thao tác</th>
                        </tr>
                    </thead>

                    <tbody>
                        {permissions.map(p => {
                            const isEditing = editingPermissionId === p.id;

                            return (
                                <tr key={p.id}>
                                    {/* ===== PERMISSION INFO ===== */}
                                    <td>
                                        {!isEditing ? (
                                            <>
                                                <div className="fw-semibold d-flex align-items-center gap-2">
                                                    <i className="bi bi-shield-lock text-secondary"></i>
                                                    {p.code}
                                                </div>
                                                <small className="text-muted">
                                                    {p.description || "Không có mô tả"}
                                                </small>
                                            </>
                                        ) : (
                                            <>
                                                <input
                                                    className="form-control mb-1"
                                                    value={editingPermission.code}
                                                    onChange={(e) =>
                                                        setEditingPermission({
                                                            ...editingPermission,
                                                            code: e.target.value,
                                                        })
                                                    }
                                                />
                                                <input
                                                    className="form-control"
                                                    placeholder="Mô tả"
                                                    value={editingPermission.description}
                                                    onChange={(e) =>
                                                        setEditingPermission({
                                                            ...editingPermission,
                                                            description: e.target.value,
                                                        })
                                                    }
                                                />
                                            </>
                                        )}
                                    </td>

                                    {/* ===== CHECKBOX ===== */}
                                    <td className="text-center">
                                        {!isEditing && (
                                            <input
                                                type="checkbox"
                                                className="form-check-input"
                                                checked={hasPermission(p.id)}
                                                onChange={(e) =>
                                                    updatePermission(p.id, e.target.checked)
                                                }
                                            />
                                        )}
                                    </td>

                                    {/* ===== ACTIONS ===== */}
                                    <td className="text-end">
                                        {!isEditing ? (
                                            <div className="btn-group btn-group-sm">
                                                <button
                                                    className="btn btn-outline-primary"
                                                    title="Sửa permission"
                                                    onClick={() => {
                                                        setEditingPermissionId(p.id);
                                                        setEditingPermission({
                                                            code: p.code,
                                                            description: p.description || "",
                                                        });
                                                    }}
                                                >
                                                    <i className="bi bi-pencil-square"></i>
                                                </button>

                                                <button
                                                    className="btn btn-outline-danger"
                                                    title="Xóa permission"
                                                    onClick={() => handleDeletePermission(p)}
                                                >
                                                    <i className="bi bi-trash"></i>
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="btn-group btn-group-sm">
                                                <button
                                                    className="btn btn-success"
                                                    title="Lưu"
                                                    onClick={() => handleUpdatePermission(p.id)}
                                                >
                                                    <i className="bi bi-check-lg"></i>
                                                </button>

                                                <button
                                                    className="btn btn-outline-secondary"
                                                    title="Hủy"
                                                    onClick={() => setEditingPermissionId(null)}
                                                >
                                                    <i className="bi bi-x-lg"></i>
                                                </button>
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>

                <div className="alert alert-info">
                    <i className="bi bi-info-circle me-1"></i>
                    Các quyền này sẽ áp dụng cho{" "}
                    <b>tất cả người dùng</b> thuộc vai trò{" "}
                    <b>{selectedRole.name}</b>
                </div>
            </div>

        </div>
    );
}
