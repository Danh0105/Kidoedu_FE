import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

/* ================== API ================== */
const api = axios.create({
    baseURL: `${process.env.REACT_APP_API_URL}/chatbot`,
});

/* ================== MAIN COMPONENT ================== */
export default function ChatbotScriptManager() {
    const [script, setScript] = useState({});
    const [activeKey, setActiveKey] = useState(null);
    const [previewKey, setPreviewKey] = useState(null);
    const [loading, setLoading] = useState(true);

    /* ---------- Load nodes from backend ---------- */
    useEffect(() => {
        loadNodes();
    }, []);

    const loadNodes = async () => {
        setLoading(true);
        const res = await api.get("/nodes");

        const mapped = {};
        let startKey = null;

        res.data.forEach((n) => {
            mapped[n.key] = {
                id: n.id,
                key: n.key,
                text: n.content,
                isStart: n.isStart,
                options: n.options.map((o) => ({
                    id: o.id,
                    label: o.label,
                    next: o.nextNodeKey,
                    sortOrder: o.sortOrder,
                })),
            };
            if (n.isStart) startKey = n.key;
        });

        setScript(mapped);
        setActiveKey(startKey || Object.keys(mapped)[0]);
        setPreviewKey(startKey || Object.keys(mapped)[0]);
        setLoading(false);
    };

    const nodes = useMemo(() => Object.values(script), [script]);
    const activeNode = script[activeKey];

    /* ---------- NODE CRUD ---------- */
    const updateNode = async (updated) => {
        setScript((prev) => ({ ...prev, [updated.key]: updated }));

        await api.put(`/nodes/${updated.id}`, {
            content: updated.text,
        });
    };

    const addNode = async () => {
        const key = prompt("Nhập key node mới:");
        if (!key || script[key]) return;

        const res = await api.post("/nodes", {
            key,
            content: "",
        });

        setScript((prev) => ({
            ...prev,
            [key]: {
                id: res.data.id,
                key,
                text: "",
                options: [],
            },
        }));

        setActiveKey(key);
    };

    const deleteNode = async (key) => {
        if (!window.confirm("Xóa node này?")) return;

        await api.delete(`/nodes/${script[key].id}`);

        setScript((prev) => {
            const clone = { ...prev };
            delete clone[key];
            return clone;
        });

        setActiveKey(Object.keys(script)[0] || null);
    };

    if (loading) return <div className="p-3">Loading...</div>;

    return (
        <div className="container-fluid py-3">
            <div className="row g-3">
                {/* ================= SIDEBAR ================= */}
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

                {/* ================= EDITOR ================= */}
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

                {/* ================= PREVIEW ================= */}
                <div className="col-4">
                    <ChatbotPreview
                        script={script}
                        startKey={previewKey}
                        onRestart={() => setPreviewKey(activeKey)}
                    />
                </div>
            </div>
        </div>
    );
}

/* ================== NODE EDITOR ================== */
function NodeEditor({ node, allKeys, onChange, onDelete }) {
    const updateOption = async (index, field, value) => {
        const opt = node.options[index];

        const updatedOptions = node.options.map((o, i) =>
            i === index ? { ...o, [field]: value } : o
        );

        onChange({ ...node, options: updatedOptions });

        await api.put(`/options/${opt.id}`, {
            label: field === "label" ? value : opt.label,
            nextNodeKey: field === "next" ? value : opt.next,
        });
    };

    const addOption = async () => {
        const res = await api.post("/options", {
            nodeId: node.id,
            label: "Option mới",
            nextNodeKey: "",
            sortOrder: node.options.length + 1,
        });

        onChange({
            ...node,
            options: [
                ...node.options,
                {
                    id: res.data.id,
                    label: res.data.label,
                    next: res.data.nextNodeKey,
                },
            ],
        });
    };

    const removeOption = async (i) => {
        const opt = node.options[i];
        await api.delete(`/options/${opt.id}`);

        onChange({
            ...node,
            options: node.options.filter((_, idx) => idx !== i),
        });
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
                    onChange={(e) =>
                        onChange({ ...node, text: e.target.value })
                    }
                />
            </div>

            <h6>Options</h6>
            {node.options.map((opt, i) => (
                <div key={opt.id} className="row g-2 align-items-center mb-2">
                    <div className="col-5">
                        <input
                            className="form-control"
                            placeholder="Label"
                            value={opt.label}
                            onChange={(e) =>
                                updateOption(i, "label", e.target.value)
                            }
                        />
                    </div>
                    <div className="col-5">
                        <select
                            className="form-select"
                            value={opt.next || ""}
                            onChange={(e) =>
                                updateOption(i, "next", e.target.value)
                            }
                        >
                            <option value="">-- Điều hướng --</option>
                            {allKeys.map((k) => (
                                <option key={k} value={k}>
                                    {k}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="col-2">
                        <button
                            className="btn btn-sm btn-outline-danger w-100"
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

/* ================== CHATBOT PREVIEW ================== */
function ChatbotPreview({ script, startKey, onRestart }) {
    const [current, setCurrent] = useState(startKey);
    const [history, setHistory] = useState([]);

    useEffect(() => {
        setCurrent(startKey);
        setHistory([]);
    }, [startKey]);

    const node = script[current];
    if (!node) return null;

    const goNext = (nextKey) => {
        if (!nextKey) return;
        setHistory((h) => [...h, current]);
        setCurrent(nextKey);
    };

    const goBack = () => {
        setHistory((h) => {
            if (h.length === 0) return h;
            const prev = h[h.length - 1];
            setCurrent(prev);
            return h.slice(0, -1);
        });
    };

    return (
        <div className="border rounded p-3 h-100">
            <div className="d-flex justify-content-between align-items-center">
                <h6 className="fw-bold">👁 Xem trước chatbot</h6>
                <div className="d-flex gap-2">
                    <button
                        className="btn btn-sm btn-outline-secondary"
                        onClick={goBack}
                        disabled={history.length === 0}
                    >
                        ⬅ Trả lại
                    </button>
                    <button
                        className="btn btn-sm btn-outline-secondary"
                        onClick={onRestart}
                    >
                        ⟳ Restart
                    </button>
                </div>
            </div>

            <div className="alert alert-primary mt-3 white-space-pre-line">
                {node.text}
            </div>

            <div className="d-grid gap-2">
                {node.options.map((opt) => (
                    <button
                        key={opt.id}
                        className="btn btn-outline-primary"
                        onClick={() => goNext(opt.next)}
                        disabled={!opt.next}
                    >
                        {opt.label}
                    </button>
                ))}
            </div>

            {/* fallback nếu node cụt */}
            {node.options.length === 0 && (
                <div className="text-muted small mt-3 text-center">
                    ⚠ Node này không có option. Dùng “Trả lại” hoặc “Restart”.
                </div>
            )}
        </div>
    );
}

