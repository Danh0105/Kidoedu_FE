import { useEffect, useState } from "react";
import axios from "axios";

export default function UserPermissionTab() {
    const [users, setUsers] = useState([]);
    const [permissions, setPermissions] = useState([]);
    const [userPermissions, setUserPermissions] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const token = localStorage.getItem("access_token");
    const authHeader = {
        headers: { Authorization: `Bearer ${token}` },
    };

    /* ===============================
        LOAD USERS + MASTER PERMISSIONS
    =============================== */
    useEffect(() => {
        Promise.all([
            axios.get(`${process.env.REACT_APP_API_URL}/users/permissions`, authHeader),
            axios.get(`${process.env.REACT_APP_API_URL}/permissions`, authHeader),
        ])
            .then(([usersRes, permissionsRes]) => {
                setUsers(usersRes.data);
                setPermissions(permissionsRes.data);
                setSelectedUser(usersRes.data?.[0] || null);
            })
            .finally(() => setLoading(false));
    }, []);

    /* ===============================
        LOAD USER EFFECTIVE PERMISSIONS
    =============================== */
    useEffect(() => {
        if (!selectedUser) return;

        axios.get(
            `${process.env.REACT_APP_API_URL}/users/${selectedUser.user_id}/permissions`,
            authHeader
        ).then(res => setUserPermissions(res.data));
    }, [selectedUser]);

    if (loading) return <p>Đang tải dữ liệu...</p>;
    if (!selectedUser) return <p>Không có người dùng</p>;

    const rolePermissions = selectedUser.role?.permissions || [];

    const hasPermission = (permissionId) =>
        userPermissions.some(p => p.id === permissionId);

    /* ===============================
        UPDATE USER PERMISSION (CÁ NHÂN)
    =============================== */
    const updatePermission = async (permissionId, checked) => {
        const url = `${process.env.REACT_APP_API_URL}/users/${selectedUser.user_id}/permissions`;

        if (checked) {
            await axios.post(url, { permissionIds: [permissionId] }, authHeader);
        } else {
            await axios.delete(url, {
                ...authHeader,
                data: { permissionIds: [permissionId] },
            });
        }

        const res = await axios.get(url, authHeader);
        setUserPermissions(res.data);
    };

    /* ===============================
        SELECT / UNSELECT ALL (USER)
    =============================== */
    const handleSelectAll = async () => {
        const url = `${process.env.REACT_APP_API_URL}/users/${selectedUser.user_id}/permissions`;
        const permissionIds = permissions.map(p => p.id);

        const allSelected = permissions.every(p => hasPermission(p.id));

        if (!allSelected) {
            await axios.post(url, { permissionIds }, authHeader);
        } else {
            await axios.delete(url, {
                ...authHeader,
                data: { permissionIds },
            });
        }

        const res = await axios.get(url, authHeader);
        setUserPermissions(res.data);
    };

    /* ===============================
        RENDER
    =============================== */
    return (
        <div className="row">
            {/* USERS */}
            <div className="col-md-4">
                <div className="list-group">
                    {users.map(u => (
                        <button
                            key={u.user_id}
                            className={`list-group-item list-group-item-action
                                ${selectedUser.user_id === u.user_id ? "active" : ""}`}
                            onClick={() => setSelectedUser(u)}
                        >
                            <div className="fw-semibold">{u.username}</div>
                            <small>{u.email}</small>
                            <div className="small text-muted">
                                Role: {u.role?.name}
                            </div>
                        </button>
                    ))}
                </div>
            </div>

            {/* PERMISSIONS */}
            <div className="col-md-8">
                <div className="d-flex justify-content-between align-items-center mb-2">
                    <h6 className="mb-0">
                        Quyền của <span className="text-primary">{selectedUser.username}</span>
                    </h6>
                    <button className="btn btn-sm btn-outline-primary" onClick={handleSelectAll}>
                        Chọn / Bỏ chọn tất cả
                    </button>
                </div>

                <table className="table table-bordered align-middle">
                    <thead className="table-light">
                        <tr>
                            <th>Permission</th>
                            <th className="text-center">Cho phép</th>
                        </tr>
                    </thead>
                    <tbody>
                        {permissions.map(p => {
                            const fromRole = rolePermissions.some(rp => rp.id === p.id);
                            const checked = hasPermission(p.id);

                            return (
                                <tr key={p.id}>
                                    <td>
                                        {p.description}

                                    </td>
                                    <td className="text-center">
                                        <input
                                            type="checkbox"
                                            className="form-check-input"
                                            checked={checked}
                                            onChange={(e) =>
                                                updatePermission(p.id, e.target.checked)
                                            }
                                        />
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
