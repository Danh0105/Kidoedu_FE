import React, { useEffect, useState } from "react";

function createEmptyRow() {
    return {
        id: crypto.randomUUID(),
        attrName: "",
        attrValue: "",
    };
}

/**
 * AttributePanel
 * - Hiển thị danh sách biến thể
 * - Cho phép chỉnh sửa thuộc tính dạng key/value
 * - Đồng bộ lại vào `variants[*].specs` và bắn ra ngoài qua `onVariantsChange`
 */
export default function AttributePanel({
    variants = [],
    onVariantsChange, // optional
}) {
    const [openVariantIds, setOpenVariantIds] = useState([]);   // biến thể nào đang mở form
    const [rowsByVariant, setRowsByVariant] = useState({});     // { [variantId]: Row[] }

    const hasVariants = variants.length > 0;

    // Helper: từ rowsByVariant + variants → build specs và bắn ra parent
    const emitVariantsChange = (nextRowsByVariant) => {
        if (typeof onVariantsChange !== "function" || !hasVariants) return;

        const updated = variants.map((v) => {
            const rows = nextRowsByVariant[v.id] || [];
            const specs = rows
                .map((r) => {
                    const key = r.attrName?.trim();
                    if (!key) return null;
                    return { key, value: r.attrValue };
                })
                .filter(Boolean);

            return {
                ...v,
                specs,
            };
        });

        onVariantsChange(updated);
    };

    // Khi danh sách variants đổi → khởi tạo row cho variant mới (1 lần)
    useEffect(() => {
        if (!hasVariants) return;

        setRowsByVariant((prev) => {
            let changed = false;
            const next = { ...prev };

            variants.forEach((v) => {
                const vid = v.id;
                if (!vid) return;

                // Nếu đã có row rồi thì giữ nguyên
                if (next[vid] && next[vid].length > 0) return;

                changed = true;
                const rows = [];

                // Ưu tiên đọc từ v.specs (nếu có từ backend)
                if (Array.isArray(v.specs)) {
                    v.specs.forEach((item) => {
                        if (!item) return;
                        const key =
                            item.key ||
                            item.name ||
                            item.label ||
                            item.attrName ||
                            "";
                        const value =
                            item.value ??
                            item.attrValue ??
                            item.val ??
                            "";

                        if (!key) return;
                        rows.push({
                            id: crypto.randomUUID(),
                            attrName: key,
                            attrValue: String(value ?? ""),
                        });
                    });
                } else if (v.specs && typeof v.specs === "object") {
                    Object.entries(v.specs).forEach(([key, value]) => {
                        rows.push({
                            id: crypto.randomUUID(),
                            attrName: key,
                            attrValue: String(value ?? ""),
                        });
                    });
                }

                if (rows.length === 0) {
                    rows.push(createEmptyRow());
                }

                next[vid] = rows;
            });

            // Xoá rows của variant đã bị xoá (nếu cần)
            Object.keys(next).forEach((id) => {
                const stillExists = variants.some((v) => String(v.id) === id);
                if (!stillExists) {
                    changed = true;
                    delete next[id];
                }
            });

            return changed ? next : prev;
        });
    }, [variants, hasVariants]);

    if (!hasVariants) {
        return (
            <div className="text-muted small">
                Chưa có biến thể nào. Hãy thêm biến thể ở tab <strong>"Biến thể sản phẩm"</strong>.
            </div>
        );
    }

    // ======================= Handlers (có emit) =======================

    const toggleVariant = (variantId) => {
        setOpenVariantIds((prev) => {
            const exists = prev.includes(variantId);
            return exists ? prev.filter((id) => id !== variantId) : [...prev, variantId];
        });

        // nếu biến thể này chưa có dòng nào thì tạo sẵn 1 dòng trống
        setRowsByVariant((prev) => {
            if (prev[variantId]) return prev;
            const next = {
                ...prev,
                [variantId]: [createEmptyRow()],
            };
            emitVariantsChange(next);
            return next;
        });
    };

    const addRow = (variantId) => {
        setRowsByVariant((prev) => {
            const next = {
                ...prev,
                [variantId]: [...(prev[variantId] || []), createEmptyRow()],
            };
            emitVariantsChange(next);
            return next;
        });
    };

    const updateRow = (variantId, rowId, patch) => {
        setRowsByVariant((prev) => {
            const rows = prev[variantId] || [];
            const updatedRows = rows.map((r) =>
                r.id === rowId ? { ...r, ...patch } : r
            );
            const next = {
                ...prev,
                [variantId]: updatedRows,
            };
            emitVariantsChange(next);
            return next;
        });
    };

    const removeRow = (variantId, rowId) => {
        setRowsByVariant((prev) => {
            const rows = prev[variantId] || [];
            if (rows.length <= 1) return prev; // không xoá dòng cuối cùng
            const updatedRows = rows.filter((r) => r.id !== rowId);
            const next = {
                ...prev,
                [variantId]: updatedRows,
            };
            emitVariantsChange(next);
            return next;
        });
    };

    // ======================= Render =======================

    return (
        <div className="mt-2">
            <div className="fw-semibold mb-2">Danh sách biến thể</div>

            <div className="list-group">
                {variants.map((v) => {
                    const isOpen = openVariantIds.includes(v.id);
                    const rows = rowsByVariant[v.id] || [];

                    const specsPreview = rows.filter(
                        (r) => r.attrName && r.attrName.trim()
                    );

                    return (
                        <div
                            key={v.id}
                            className="list-group-item border-0 px-0 mb-2"
                        >
                            {/* Hàng thông tin biến thể */}
                            <div className="d-flex align-items-center">
                                {/* Ảnh thumbnail */}
                                <div
                                    className="flex-shrink-0 rounded me-3 bg-light d-flex align-items-center justify-content-center"
                                    style={{ width: 56, height: 56, overflow: "hidden" }}
                                >
                                    {v.image_url ? (
                                        <img
                                            src={v.image_url}
                                            alt={v.variant_name}
                                            style={{
                                                width: "100%",
                                                height: "100%",
                                                objectFit: "cover",
                                            }}
                                        />
                                    ) : (
                                        <span className="text-muted small">No image</span>
                                    )}
                                </div>

                                {/* Thông tin text */}
                                <div className="flex-grow-1">
                                    <div className="fw-semibold">
                                        {v.variant_name || "(Chưa đặt tên)"}
                                    </div>

                                    {/* attributes cũ (nếu có) */}
                                    {v.attributes &&
                                        Object.keys(v.attributes || {}).length > 0 && (
                                            <div className="small text-muted">
                                                {Object.entries(v.attributes).map(
                                                    ([key, value], idx) => (
                                                        <span key={key}>
                                                            {idx > 0 && " · "}
                                                            <span className="text-capitalize">
                                                                {key}:
                                                            </span>{" "}
                                                            {String(value)}
                                                        </span>
                                                    )
                                                )}
                                            </div>
                                        )}

                                    {/* specs preview từ rowsByVariant */}
                                    {specsPreview.length > 0 && (
                                        <div className="small text-muted mt-1">
                                            {specsPreview.map((r, idx) => (
                                                <span key={r.id}>
                                                    {idx > 0 && " · "}
                                                    <span className="text-capitalize">
                                                        {r.attrName}:
                                                    </span>{" "}
                                                    {r.attrValue}
                                                </span>
                                            ))}
                                        </div>
                                    )}

                                    <div className="small text-muted mt-1">
                                        <span className="me-3">
                                            <span className="fw-semibold">SKU:</span>{" "}
                                            {v.sku || "-"}
                                        </span>
                                        <span>
                                            <span className="fw-semibold">Barcode:</span>{" "}
                                            {v.barcode || "-"}
                                        </span>
                                    </div>
                                </div>

                                {/* Nút mở/đóng thuộc tính */}
                                <button
                                    type="button"
                                    className={
                                        "btn btn-sm ms-3 " +
                                        (isOpen
                                            ? "btn-primary"
                                            : "btn-outline-primary")
                                    }
                                    onClick={() => toggleVariant(v.id)}
                                >
                                    {isOpen ? "Ẩn thuộc tính" : "Thuộc tính"}
                                </button>
                            </div>

                            {/* FORM THUỘC TÍNH */}
                            {isOpen && (
                                <div className="border rounded p-2 mt-2">
                                    <div className="fw-semibold mb-2 small">
                                        Thông số kỹ thuật cho:{" "}
                                        <span className="text-primary">
                                            {v.variant_name || "(Chưa đặt tên)"}
                                        </span>
                                    </div>

                                    <div className="table-responsive">
                                        <table className="table table-sm align-middle mb-0">
                                            <thead className="table-light">
                                                <tr>
                                                    <th className="text-center" style={{ width: "40%" }}>
                                                        Thông số kĩ thuật
                                                    </th>
                                                    <th className="text-center" style={{ width: "40%" }}>
                                                        Giá trị
                                                    </th>
                                                    <th className="text-center" style={{ width: "20%" }}>
                                                        Action
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {rows.map((r) => (
                                                    <tr key={r.id}>
                                                        <td className="text-center">
                                                            <input
                                                                className="form-control form-control-sm"
                                                                placeholder="VD: Công suất, Kích thước..."
                                                                value={r.attrName}
                                                                onChange={(e) =>
                                                                    updateRow(v.id, r.id, {
                                                                        attrName: e.target.value,
                                                                    })
                                                                }
                                                            />
                                                        </td>
                                                        <td className="text-center">
                                                            <input
                                                                className="form-control form-control-sm"
                                                                placeholder="VD: 1200W, 256GB..."
                                                                value={r.attrValue}
                                                                onChange={(e) =>
                                                                    updateRow(v.id, r.id, {
                                                                        attrValue: e.target.value,
                                                                    })
                                                                }
                                                            />
                                                        </td>
                                                        <td className="text-center">
                                                            <button
                                                                type="button"
                                                                className="btn btn-outline-danger btn-sm"
                                                                onClick={() =>
                                                                    removeRow(v.id, r.id)
                                                                }
                                                                disabled={rows.length === 1}
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
                                                            type="button"
                                                            className="btn btn-outline-primary btn-sm"
                                                            onClick={() => addRow(v.id)}
                                                        >
                                                            + Thêm dòng
                                                        </button>
                                                    </td>
                                                </tr>
                                            </tfoot>
                                        </table>
                                    </div>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
