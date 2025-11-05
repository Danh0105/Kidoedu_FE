import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import PolicyEditForm from "./PolicyEditForm";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faCreditCard,
    faTruck,
    faUndoAlt,
    faUserShield,
    faScrewdriverWrench,
    faUser,
    faChevronDown,
    faChevronUp,
} from "@fortawesome/free-solid-svg-icons";

// Nhóm chính sách nội bộ
const policyPolicyGroups = {
    CSTT: { title: "Thanh Toán", icon: faCreditCard, color: "primary" },
    CSXLKN: { title: "Xử Lý Khiếu Nại", icon: faUser, color: "info" },
    CSGH: { title: "Giao Hàng / Vận Chuyển", icon: faTruck, color: "success" },
    CSBTBH: { title: "Bảo Hành & Bảo Trì", icon: faScrewdriverWrench, color: "warning" },
    CSDTH: { title: "Đổi Trả Hàng", icon: faUndoAlt, color: "danger" },
    CSBMTT: { title: "Bảo Mật Thông Tin", icon: faUserShield, color: "secondary" },
};

// Nhóm dịch vụ hiển thị công khai
const policyServiceGroups = {
    DKTT: { title: "Điều Khoản Thanh Toán", icon: faCreditCard, color: "primary" },
    CSDTH: { title: "Hướng Dẫn Đổi Trả Hàng", icon: faUser, color: "info" },
    CSBTBH: { title: "Chính Sách Bảo Hành & Bảo Trì", icon: faTruck, color: "success" },
};

export default function PolicyList({ policies, onUpdated }) {
    const [openPolicyId, setOpenPolicyId] = useState(null);
    const [activeTab, setActiveTab] = useState("CSTT");
    const [tabType, setTabType] = useState("policy"); // 'policy' hoặc 'service'

    const togglePolicy = (id) => {
        setOpenPolicyId((prev) => (prev === id ? null : id));
    };

    const currentGroups =
        tabType === "policy" ? policyPolicyGroups : policyServiceGroups;

    const availableSlugs = Object.keys(currentGroups).filter((slug) =>
        policies.some((p) => p.slug === slug)
    );

    return (
        <div className="card shadow-sm border-0 p-3">
            <h4 className="fw-bold text-primary mb-3 text-center">
                🧩 Quản Lý Chính Sách & Dịch Vụ
            </h4>

            {/* Switch Tabs between Chính Sách & Dịch Vụ */}
            <div className="d-flex justify-content-center mb-4">
                <button
                    className={`btn me-2 ${tabType === "policy" ? "btn-primary" : "btn-outline-primary"}`}
                    onClick={() => {
                        setTabType("policy");
                        setActiveTab("CSTT");
                        setOpenPolicyId(null);
                    }}
                >
                    Chính Sách
                </button>
                <button
                    className={`btn ${tabType === "service" ? "btn-primary" : "btn-outline-primary"}`}
                    onClick={() => {
                        setTabType("service");
                        setActiveTab("DKTT");
                        setOpenPolicyId(null);
                    }}
                >
                    Dịch Vụ
                </button>
            </div>

            {/* Tabs Header */}
            <ul className="nav nav-tabs justify-content-center mb-4">
                {availableSlugs.map((slug) => {
                    const { title, icon, color } = currentGroups[slug];
                    const isActive = activeTab === slug;

                    return (
                        <li key={slug} className="nav-item">
                            <button
                                className={`nav-link d-flex align-items-center ${isActive ? "active fw-semibold" : ""}`}
                                style={{
                                    color: isActive ? "#0d6efd" : "#6c757d",
                                    border: "none",
                                }}
                                onClick={() => {
                                    setActiveTab(slug);
                                    setOpenPolicyId(null);
                                }}
                            >
                                <FontAwesomeIcon icon={icon} className={`me-2 text-${color}`} />
                                {title}
                            </button>
                        </li>
                    );
                })}
            </ul>

            {/* Tab Content */}
            <div className="tab-content">
                {availableSlugs.map((slug) => {
                    const { title, icon, color } = currentGroups[slug];
                    const isActive = activeTab === slug;
                    const groupPolicies = policies.filter((p) => p.slug === slug);

                    return (
                        <div
                            key={slug}
                            className={`tab-pane fade ${isActive ? "show active" : ""}`}
                        >
                            <div className="card border-0 shadow-sm">
                                <div className={`card-header bg-${color} text-white fw-bold`}>
                                    <FontAwesomeIcon icon={icon} className="me-2" />
                                    {title}
                                </div>

                                <ul className="list-group list-group-flush">
                                    {groupPolicies.length ? (
                                        groupPolicies.map((p) => (
                                            <li key={p.id} className="list-group-item">
                                                <div
                                                    onClick={() => togglePolicy(p.id)}
                                                    className="d-flex justify-content-between align-items-center"
                                                    style={{ cursor: "pointer" }}
                                                >
                                                    <span className="fw-semibold text-primary">
                                                        {p.title}
                                                    </span>
                                                    <FontAwesomeIcon
                                                        icon={
                                                            openPolicyId === p.id
                                                                ? faChevronUp
                                                                : faChevronDown
                                                        }
                                                        className="text-secondary"
                                                    />
                                                </div>

                                                {openPolicyId === p.id && (
                                                    <div className="mt-3 border-top pt-3">
                                                        <PolicyEditForm
                                                            policy={p}
                                                            onUpdated={() => {
                                                                onUpdated();
                                                                setOpenPolicyId(null);
                                                            }}
                                                        />
                                                    </div>
                                                )}
                                            </li>
                                        ))
                                    ) : (
                                        <li className="list-group-item text-center text-muted">
                                            Không có chính sách nào trong nhóm này.
                                        </li>
                                    )}
                                </ul>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
