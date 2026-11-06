import axios from "axios";
import { useEffect, useState } from "react";

export default function CreateUserTab() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [editingUserId, setEditingUserId] = useState(null);
    const [editingRole, setEditingRole] = useState("");
    const [roles, setRoles] = useState([]);

    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
        roleId: "",
    });

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/users`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("access_token")}`,
                "Content-Type": "application/json",
            },
        });
        setUsers(res.data.data);
    };
    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };
    const fetchRoles = async () => {
        const res = await axios.get(
            `${process.env.REACT_APP_API_URL}/roles`,
            {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("access_token")}`,
                },
            }
        );
        setRoles(res.data);
    };
    useEffect(() => {
        fetchUsers();
        fetchRoles();
    }, []);

    const handleSubmit = async () => {
        if (!form.name || !form.email || !form.password || !form.roleId) {
            alert("Vui lòng nhập đầy đủ thông tin");
            return;
        }

        try {
            setLoading(true);

            await axios.post(
                `${process.env.REACT_APP_API_URL}/users`,
                {
                    name: form.name,
                    email: form.email,
                    password: form.password,
                    id: Number(form.roleId),
                },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
                    },
                }
            );

            await fetchUsers();
            setForm({ name: "", email: "", password: "", roleId: "" });
        } catch (err) {
            alert("Email đã tồn tại hoặc lỗi server");
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteUser = async (userId) => {
        const confirmDelete = window.confirm(
            "Bạn có chắc chắn muốn xóa tài khoản này không?"
        );

        if (!confirmDelete) return;

        try {

            await axios.delete(
                `${process.env.REACT_APP_API_URL}/users/${userId}`,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            alert("Xóa tài khoản thành công");
            await fetchUsers(); // 🔥 reload lại danh sách
        } catch (error) {
            console.error(error);
            alert(
                error.response?.data?.message || "Xóa tài khoản thất bại"
            );
        }
    };
    const handleUpdateRole = async (userId) => {
        try {
            const ROLE_MAP = {
                ADMIN: 1,
                STAFF: 2,
            };

            await axios.patch(
                `${process.env.REACT_APP_API_URL}/users/${userId}`,
                { roleId: ROLE_MAP[editingRole] },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
                    },
                }
            );

            alert("Cập nhật vai trò thành công");
            setEditingUserId(null);
            setEditingRole("");
            await fetchUsers();
        } catch (err) {
            alert("Cập nhật vai trò thất bại");
        }
    };

    return (
        <>
            {/* ===== FORM TẠO USER ===== */}
            <div className="row mb-4">
                <div className="col-md-4">
                    <div className="card shadow-sm">
                        <div className="card-header fw-bold">Tạo tài khoản</div>
                        <div className="card-body">

                            <div className="mb-3">
                                <label className="form-label fw-semibold">Họ tên *</label>
                                <input
                                    name="name"
                                    value={form.name}
                                    className="form-control"
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="mb-3">
                                <label className="form-label fw-semibold">Email *</label>
                                <input
                                    name="email"
                                    type="email"
                                    value={form.email}
                                    className="form-control"
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="mb-3">
                                <label className="form-label fw-semibold">Mật khẩu *</label>
                                <input
                                    name="password"
                                    type="password"
                                    value={form.password}
                                    className="form-control"
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="mb-3">
                                <label className="form-label fw-semibold">Vai trò</label>
                                <select
                                    name="roleId"
                                    value={form.roleId}
                                    className="form-select"
                                    onChange={handleChange}
                                >
                                    <option value="">-- Chọn vai trò --</option>
                                    {roles.map((r) => (
                                        <option key={r.id} value={r.id}>
                                            {r.name}
                                        </option>
                                    ))}
                                </select>
                            </div>


                            <button className="btn btn-primary px-4" onClick={handleSubmit}>
                                ➕ Tạo tài khoản
                            </button>
                        </div>
                    </div>
                </div>
                <div className="col-md-8">
                    <div className="card shadow-sm">
                        <div className="card-header fw-bold">Danh sách tài khoản</div>
                        <div className="card-body p-0">
                            <table className="table table-hover align-middle mb-0">
                                <thead className="table-light">
                                    <tr>
                                        <th>#</th>
                                        <th>Họ tên</th>
                                        <th>Email</th>
                                        <th>Vai trò</th>
                                        <th className="text-end">Thao tác</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {users.map((u, index) => (
                                        <tr key={u.id}>
                                            <td>{index + 1}</td>
                                            <td className="fw-semibold">{u.username}</td>
                                            <td>{u.email}</td>
                                            <td>
                                                {editingUserId === u.user_id ? (
                                                    <select
                                                        className="form-select form-select-sm"
                                                        value={editingRole}
                                                        onChange={(e) => setEditingRole(e.target.value)}
                                                    >
                                                        <option value="ADMIN">ADMIN</option>
                                                        <option value="STAFF">STAFF</option>
                                                    </select>
                                                ) : (
                                                    <span
                                                        className={`badge ${u.role?.name === "ADMIN"
                                                            ? "bg-danger"
                                                            : "bg-success"
                                                            }`}
                                                    >
                                                        {u.role?.name}
                                                    </span>
                                                )}
                                            </td>



                                            <td className="text-end">
                                                {editingUserId === u.user_id ? (
                                                    <>
                                                        <button
                                                            className="btn btn-sm btn-success me-2"
                                                            onClick={() => handleUpdateRole(u.user_id)}
                                                        >
                                                            Lưu
                                                        </button>
                                                        <button
                                                            className="btn btn-sm btn-secondary"
                                                            onClick={() => setEditingUserId(null)}
                                                        >
                                                            Hủy
                                                        </button>
                                                    </>
                                                ) : (
                                                    <>
                                                        <button
                                                            className="btn btn-sm btn-outline-primary me-2"
                                                            onClick={() => {
                                                                setEditingUserId(u.user_id);
                                                                setEditingRole(u.role?.name);
                                                            }}
                                                        >
                                                            Sửa
                                                        </button>
                                                        <button
                                                            className="btn btn-sm btn-outline-danger"
                                                            onClick={() => handleDeleteUser(u.user_id)}
                                                        >
                                                            Xóa
                                                        </button>
                                                    </>
                                                )}
                                            </td>

                                        </tr>
                                    ))}
                                    {users.length === 0 && (
                                        <tr>
                                            <td colSpan={5} className="text-center text-muted py-4">
                                                Chưa có tài khoản nào
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            {/* ===== DANH SÁCH USER ===== */}

        </>
    );
}
