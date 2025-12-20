import React, { useEffect, useMemo, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

// ================== MOCK DATA (chưa mount endpoint) ==================
const initialScript = {
    welcome: {
        key: "welcome",
        text: "Xin chào! Bạn cần hỗ trợ gì từ KIDO?",
        options: [
            { key: "about", label: "ℹ️ Giới thiệu về KIDO", next: "about" },
            { key: "contact", label: "📞 Liên hệ / Tư vấn 24/7", next: "contact" },
        ],
    },
    about: {
        key: "about",
        text: "KIDO EDU là doanh nghiệp hoạt động đa lĩnh vực trong hệ sinh thái công nghệ – giáo dục – dịch vụ kỹ thuật số.",
        options: [
            { key: "why", label: "Tại sao chọn KIDO?", next: "welcome" },
            { key: "back", label: "⬅️ Quay lại", backTo: "welcome" },
        ],
    },
    contact: {
        key: "contact",
        text: "📞 Hotline: 0789-636-979\n📧 Email: lytran@ichiskill.edu.vn",
        options: [{ key: "back", label: "⬅️ Quay lại", backTo: "welcome" }],
    },
};

// ================== COMPONENT ==================
export default function ChatbotScriptManager() {
    const [script, setScript] = useState(initialScript);
    const [activeKey, setActiveKey] = useState("welcome");
    const [previewKey, setPreviewKey] = useState("welcome");

    const nodes = useMemo(() => Object.values(script), [script]);
    const activeNode = script[activeKey];

    // ---------- Helpers ----------
    const updateNode = (updated) => {
        setScript((prev) => ({ ...prev, [updated.key]: updated }));
    };

    const addNode = () => {
        const key = prompt("Nhập key node mới:");
        if (!key || script[key]) return;

        setScript((prev) => ({
            ...prev,
            [key]: { key, text: "", options: [] },
        }));
        setActiveKey(key);
    };

    const deleteNode = (key) => {
        if (!window.confirm("Xóa node này?")) return;
        setScript((prev) => {
            const clone = { ...prev };
            delete clone[key];
            return clone;
        });
        setActiveKey("welcome");
    };

    // ================== RENDER ==================
    return (
        <div className="container-fluid py-3">
            <div className="row g-3">
                {/* SIDEBAR */}
                <div className="col-3">
                    <div className="border rounded p-2 h-100">
                        <h6 className="fw-bold">📂 Node kịch bản</h6>
                        <ul className="list-group mb-2">
                            {nodes.map((n) => (
                                <li
                                    key={n.key}
                                    className={`list-group-item list-group-item-action ${activeKey === n.key ? "active" : ""
                                        }`}
                                    onClick={() => setActiveKey(n.key)}
                                    style={{ cursor: "pointer" }}
                                >
                                    {n.key}
                                </li>
                            ))}
                        </ul>
                        <button className="btn btn-sm btn-primary w-100" onClick={addNode}>
                            ➕ Thêm node
                        </button>
                    </div>
                </div>

                {/* EDITOR */}
                <div className="col-5">
                    {activeNode && (
                        <NodeEditor
                            node={activeNode}
                            allKeys={Object.keys(script)}
                            onChange={updateNode}
                            onDelete={deleteNode}
                        />
                    )}
                </div>

                {/* PREVIEW */}
                <div className="col-4">
                    <ChatbotPreview
                        script={script}
                        startKey={previewKey}
                        onRestart={() => setPreviewKey("welcome")}
                    />
                </div>
            </div>
        </div>
    );
}

// ================== NODE EDITOR ==================
function NodeEditor({ node, allKeys, onChange, onDelete }) {
    const updateOption = (index, field, value) => {
        const opts = [...node.options];
        opts[index] = { ...opts[index], [field]: value };
        onChange({ ...node, options: opts });
    };

    const addOption = () => {
        onChange({
            ...node,
            options: [...node.options, { key: "", label: "", next: "" }],
        });
    };

    const removeOption = (i) => {
        const opts = node.options.filter((_, idx) => idx !== i);
        onChange({ ...node, options: opts });
    };

    return (
        <div className="border rounded p-3 h-100">
            <div className="d-flex justify-content-between align-items-center">
                <h6 className="fw-bold">✏️ Chỉnh sửa node</h6>
                <button
                    className="btn btn-sm btn-outline-danger"
                    onClick={() => onDelete(node.key)}
                >
                    🗑 Xóa
                </button>
            </div>

            <div className="mb-2">
                <label className="form-label">Key</label>
                <input className="form-control" value={node.key} disabled />
            </div>

            <div className="mb-3">
                <label className="form-label">Nội dung bot</label>
                <textarea
                    className="form-control"
                    rows={4}
                    value={node.text}
                    onChange={(e) => onChange({ ...node, text: e.target.value })}
                />
            </div>

            <h6>Options</h6>
            {node.options.map((opt, i) => (
                <div key={i} className="row g-2 align-items-center mb-2">
                    <div className="col-4">
                        <input
                            className="form-control"
                            placeholder="Label"
                            value={opt.label}
                            onChange={(e) => updateOption(i, "label", e.target.value)}
                        />
                    </div>
                    <div className="col-3">
                        <input
                            className="form-control"
                            placeholder="Key"
                            value={opt.key}
                            onChange={(e) => updateOption(i, "key", e.target.value)}
                        />
                    </div>
                    <div className="col-4">
                        <select
                            className="form-select"
                            value={opt.next || opt.backTo || ""}
                            onChange={(e) => updateOption(i, "next", e.target.value)}
                        >
                            <option value="">-- Điều hướng --</option>
                            {allKeys.map((k) => (
                                <option key={k} value={k}>
                                    {k}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="col-1">
                        <button
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => removeOption(i)}
                        >
                            ✕
                        </button>
                    </div>
                </div>
            ))}

            <button className="btn btn-sm btn-secondary mt-2" onClick={addOption}>
                ➕ Thêm option
            </button>
        </div>
    );
}

// ================== PREVIEW ==================
function ChatbotPreview({ script, startKey, onRestart }) {
    const [current, setCurrent] = useState(startKey);

    useEffect(() => setCurrent(startKey), [startKey]);

    const node = script[current];
    if (!node) return null;

    return (
        <div className="border rounded p-3 h-100">
            <div className="d-flex justify-content-between align-items-center">
                <h6 className="fw-bold">👁 Xem trước chatbot</h6>
                <button className="btn btn-sm btn-outline-secondary" onClick={onRestart}>
                    ⟳ Restart
                </button>
            </div>

            <div className="alert alert-primary mt-3 white-space-pre-line">
                {node.text}
            </div>

            <div className="d-grid gap-2">
                {node.options.map((opt) => (
                    <button
                        key={opt.key}
                        className="btn btn-outline-primary"
                        onClick={() => setCurrent(opt.next || opt.backTo)}
                    >
                        {opt.label}
                    </button>
                ))}
            </div>
        </div>
    );
}
