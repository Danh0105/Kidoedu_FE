import React, { useEffect, useState, useRef } from "react";

/* ---------------- HELPERS ---------------- */
const generateId = () =>
    Date.now().toString(36) + Math.random().toString(36).slice(2);

const createEmptyRow = () => ({
    id: generateId(),
    attrName: "",
    attrValue: "",
});

/* ---------------- COMPONENT ---------------- */
export default function AttributePanelEdit({ variants = [], onVariantsChange }) {
    const [openId, setOpenId] = useState(null);
    const [rowsByVariant, setRowsByVariant] = useState({});
    const internal = useRef(false);
    const debounceRef = useRef(null);

    const hasVariants = variants.length > 0;

    /* ---------- SYNC FROM PARENT ---------- */
    useEffect(() => {
        if (!hasVariants || internal.current) {
            internal.current = false;
            return;
        }

        setRowsByVariant((prev) => {
            const next = { ...prev };
            let changed = false;

            variants.forEach((v) => {
                if (!next[v.variantId]) {
                    next[v.variantId] = normalizeSpecs(v.specs);
                    changed = true;
                }
            });

            Object.keys(next).forEach((id) => {
                if (!variants.some((v) => String(v.variantId) === id)) {
                    delete next[id];
                    changed = true;
                }
            });

            return changed ? next : prev;
        });
    }, [variants, hasVariants]);

    /* ---------- NORMALIZE DB SPECS ---------- */
    const normalizeSpecs = (specs) => {
        if (!specs) return [createEmptyRow()]; // ✅ luôn có 1 dòng mặc định

        const list = Array.isArray(specs)
            ? specs
            : Object.entries(specs).map(([key, value]) => ({ key, value }));

        const rows = list.map((item) => ({
            id: generateId(),
            attrName: item.label || item.key || "",
            attrValue: String(item.value ?? ""),
        }));

        return rows.length ? rows : [createEmptyRow()]; // ✅ nếu rỗng cũng tạo 1 dòng
    };

    /* ---------- CONVERT BACK TO PARENT ---------- */
    const convertToSpecs = (rows) =>
        rows
            .map(
                (r) =>
                    r.attrName.trim() && ({
                        key: r.attrName,
                        value: r.attrValue,
                    })
            )
            .filter(Boolean);

    /* ---------- DEBOUNCED EMIT ---------- */
    const emitChangeDebounced = (nextState) => {
        if (!onVariantsChange) return;

        if (debounceRef.current) clearTimeout(debounceRef.current);

        debounceRef.current = setTimeout(() => {
            internal.current = true;

            const updated = variants.map((v) => ({
                ...v,
                specs: convertToSpecs(nextState[v.variantId] || []),
            }));

            onVariantsChange(updated);
        }, 300);
    };

    useEffect(() => {
        return () => {
            if (debounceRef.current) clearTimeout(debounceRef.current);
        };
    }, []);

    /* ---------- MUTATIONS ---------- */
    const updateRow = (vid, rowId, patch) => {
        setRowsByVariant((prev) => {
            const nextRows = prev[vid].map((r) =>
                r.id === rowId ? { ...r, ...patch } : r
            );
            const nextState = { ...prev, [vid]: nextRows };
            emitChangeDebounced(nextState);
            return nextState;
        });
    };

    const addRow = (vid) =>
        setRowsByVariant((prev) => ({
            ...prev,
            [vid]: [...(prev[vid] || []), createEmptyRow()],
        }));

    const removeRow = (vid, rowId) =>
        setRowsByVariant((prev) => {
            const current = prev[vid];
            if (!current || current.length <= 1) return prev; // ✅ luôn giữ 1 dòng

            const nextRows = current.filter((r) => r.id !== rowId);
            const nextState = { ...prev, [vid]: nextRows };
            emitChangeDebounced(nextState);
            return nextState;
        });

    const toggleOpen = (id) =>
        setOpenId((prev) => (prev === id ? null : id));

    /* ---------- RENDER ---------- */
    if (!hasVariants)
        return <div className="text-muted text-center py-3">Chưa có biến thể nào.</div>;

    return (
        <div className="mt-3">
            {variants.map((v) => {
                const vid = v.variantId;
                const isOpen = openId === vid;
                const rows = rowsByVariant[vid] || [];

                return (
                    <div key={vid} className="card mb-2 border-light shadow-sm">
                        <div className="card-header bg-white d-flex justify-content-between py-2">
                            <div className="d-flex align-items-center overflow-hidden">
                                <div
                                    className="bg-light rounded me-2 d-flex align-items-center justify-content-center"
                                    style={{ width: 40, height: 40 }}
                                >
                                    {v.imageUrl ? (
                                        <img src={v.imageUrl} alt="" className="mw-100 mh-100" />
                                    ) : (
                                        <small>IMG</small>
                                    )}
                                </div>

                                <div className="fw-bold text-truncate">{v.variantName}</div>
                                <span className="ms-2 text-truncate">SKU: {v.sku}</span>
                                <span className="ms-2 text-truncate">Barcode: {v.barcode}</span>
                            </div>

                            <button
                                className={`btn btn-sm ${isOpen ? "btn-primary" : "btn-outline-secondary"
                                    }`}
                                onClick={() => toggleOpen(vid)}
                            >
                                {isOpen ? "Đóng" : "Thông số"}
                            </button>
                        </div>

                        {isOpen && (
                            <div className="card-body bg-light p-2">
                                <table className="table table-sm table-borderless mb-0">
                                    <thead>
                                        <tr>
                                            <th>Tên thuộc tính</th>
                                            <th>Giá trị</th>
                                            <th style={{ width: 30 }}></th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {rows.map((r) => (
                                            <tr key={r.id}>
                                                <td>
                                                    <input
                                                        className="form-control form-control-sm"
                                                        value={r.attrName}
                                                        placeholder="VD: Công suất"
                                                        onChange={(e) =>
                                                            updateRow(vid, r.id, {
                                                                attrName: e.target.value,
                                                            })
                                                        }
                                                    />
                                                </td>
                                                <td>
                                                    <input
                                                        className="form-control form-control-sm"
                                                        value={r.attrValue}
                                                        placeholder="VD: 1000W"
                                                        onChange={(e) =>
                                                            updateRow(vid, r.id, {
                                                                attrValue: e.target.value,
                                                            })
                                                        }
                                                    />
                                                </td>
                                                <td>
                                                    <button
                                                        className="btn btn-sm text-danger"
                                                        disabled={rows.length <= 1}
                                                        onClick={() => removeRow(vid, r.id)}
                                                    >
                                                        ×
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>

                                    <tfoot>
                                        <tr>
                                            <td colSpan={3}>
                                                <button
                                                    className="btn btn-sm btn-link p-0"
                                                    onClick={() => addRow(vid)}
                                                >
                                                    + Thêm dòng
                                                </button>
                                            </td>
                                        </tr>
                                    </tfoot>
                                </table>
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
}
