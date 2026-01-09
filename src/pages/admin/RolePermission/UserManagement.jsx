import { useState } from "react";
import CreateUserTab from "./CreateUserTab.jsx";
import UserPermissionTab from "./UserPermissionTab.jsx";
import RolePermissionTab from "./RolePermissionTab.jsx"; // ⭐ NEW

export default function UserManagementPage() {
    const [activeTab, setActiveTab] = useState("create");

    return (
        <div className="container-fluid mt-4">
            <div className="card shadow-sm">
                <div className="card-header fw-bold">
                    Quản lý tài khoản & phân quyền
                </div>

                <div className="card-body">
                    {/* ===== TAB HEADER ===== */}
                    <ul className="nav nav-tabs mb-3">
                        <li className="nav-item">
                            <button
                                className={`nav-link ${activeTab === "create" ? "active" : ""}`}
                                onClick={() => setActiveTab("create")}
                            >
                                ➕ Tạo tài khoản
                            </button>
                        </li>

                        <li className="nav-item">
                            <button
                                className={`nav-link ${activeTab === "permission" ? "active" : ""}`}
                                onClick={() => setActiveTab("permission")}
                            >
                                👤 Phân quyền cá nhân
                            </button>
                        </li>

                        <li className="nav-item">
                            <button
                                className={`nav-link ${activeTab === "role" ? "active" : ""}`}
                                onClick={() => setActiveTab("role")}
                            >
                                👥 Phân quyền theo nhóm
                            </button>
                        </li>
                    </ul>

                    {/* ===== TAB CONTENT ===== */}
                    {activeTab === "create" && <CreateUserTab />}
                    {activeTab === "permission" && <UserPermissionTab />}
                    {activeTab === "role" && <RolePermissionTab />}
                </div>
            </div>
        </div>
    );
}
