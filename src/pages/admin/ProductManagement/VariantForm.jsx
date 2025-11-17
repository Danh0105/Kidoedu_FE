import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";

function createEmptyAttrRow() {
    return {
        id: crypto.randomUUID(),
        key: "",
        value: "",
    };
}

function buildRowsFromAttributes(raw) {
    const rows = [];

    if (!raw) {
        rows.push(createEmptyAttrRow());
        return rows;
    }

    // Nếu là object: { color: "Đen", size: "M" }
    if (typeof raw === "object" && !Array.isArray(raw)) {
        Object.entries(raw).forEach(([k, v]) => {
            rows.push({
                id: crypto.randomUUID(),
                key: k,
                value: String(v ?? ""),
            });
        });
    }

    // Nếu là array: [{ key: "color", value: "Đen" }, ...]
    if (Array.isArray(raw)) {
        raw.forEach((item) => {
            if (!item) return;
            const k =
                item.key ||
                item.name ||
                item.label ||
                item.attrName ||
                "";
            const v =
                item.value ??
                item.attrValue ??
                item.val ??
                "";
            if (!k) return;
            rows.push({
                id: crypto.randomUUID(),
                key: k,
                value: String(v ?? ""),
            });
        });
    }

    if (rows.length === 0) {
        rows.push(createEmptyAttrRow());
    }

    return rows;
}

function parseMaybeJson(v) {
    if (!v) return {};
    if (typeof v === "object") return v;
    try {
        return JSON.parse(v);
    } catch {
        return {};
    }
}

export default function VariantForm({
    productId,
    variantId,
    apiBase = process.env.REACT_APP_API_URL,
    onSaved,
    onVariantsChange,
}) {
    const [loading, setLoading] = useState(!!variantId);
    const [saving, setSaving] = useState(false);
    const [err, setErr] = useState(null);

    // form fields
    const [variantName, setVariantName] = useState("");
    const [sku, setSku] = useState("");
    const [barcode, setBarcode] = useState("");
    const [status, setStatus] = useState(1);
    const [imageUrl, setImageUrl] = useState("");

    // ✅ THUỘC TÍNH: dạng dòng key/value
    const [attributeRows, setAttributeRows] = useState([createEmptyAttrRow()]);

    // specs (để pass ra AttributePanel / backend, không có UI ở đây)
    const [specs, setSpecs] = useState({});

    // ✅ NEW: giá riêng cho từng biến thể
    const [basePrice, setBasePrice] = useState("");   // giá gốc
    const [promoPrice, setPromoPrice] = useState(""); // giá khuyến mãi (nếu có)

    // danh sách biến thể đã thêm (lưu tạm để hiển thị)
    const [tempVariants, setTempVariants] = useState([]);
    const [editingId, setEditingId] = useState(null);

    const isFirstVariant = tempVariants.length === 0;

    const formValid = useMemo(() => {
        if (!variantName?.trim()) return false;
        return true;
    }, [variantName]);

    // load khi edit (trường hợp sửa biến thể từ backend)
    useEffect(() => {
        let alive = true;
        if (!variantId) return; // create mode
        (async () => {
            try {
                setLoading(true);
                const res = await axios.get(`${apiBase}/product-variants/${variantId}`);
                const v = res?.data?.data || res?.data || {};
                if (!alive) return;

                setVariantName(v.variant_name || v.variantName || "");
                setSku(v.sku || "");
                setBarcode(v.barcode || "");
                setStatus(Number(v.status ?? 1));
                setImageUrl(v.image_url || v.imageUrl || "");

                // attributes
                const parsedAttrs = parseMaybeJson(v.attributes);
                setAttributeRows(buildRowsFromAttributes(parsedAttrs));

                // specs giữ để dùng cho AttributePanel
                setSpecs(parseMaybeJson(v.specs));

                // ✅ NEW: nếu backend có giá thì map vào (tuỳ structure của bạn)
                const prices = v.prices || [];
                const base = prices.find((p) => p.priceType === "base");
                const promo = prices.find((p) => p.priceType === "promo");
                setBasePrice(base ? String(base.price || "") : "");
                setPromoPrice(promo ? String(promo.price || "") : "");

                setErr(null);
            } catch (e) {
                console.error(e);
                setErr("Không tải được biến thể");
            } finally {
                if (alive) setLoading(false);
            }
        })();
        return () => {
            alive = false;
        };
    }, [variantId, apiBase]);

    const resetForm = () => {
        setVariantName("");
        setSku("");
        setBarcode("");
        setStatus(1);
        setImageUrl("");
        setAttributeRows([createEmptyAttrRow()]);
        setSpecs({});
        setBasePrice("");
        setPromoPrice("");
    };

    const removeTempVariant = (id) => {
        setTempVariants((prev) => prev.filter((v) => v.id !== id));
    };

    const buildAttributesObject = () => {
        const obj = {};
        attributeRows.forEach((row) => {
            const key = row.key?.trim();
            if (!key) return;
            obj[key] = row.value;
        });
        return obj;
    };

    const save = async () => {
        try {
            setSaving(true);
            setErr(null);

            const attributesObj = buildAttributesObject();

            const payload = {
                product_id: Number(productId || 0),
                variant_name: variantName.trim(),
                sku: sku?.trim() || null,
                barcode: barcode?.trim() || null,
                status: Number(status || 1),
                image_url: imageUrl?.trim() || null,
                attributes: attributesObj,
                specs, // giữ nguyên (object/array) để AttributePanel dùng
                basePrice: basePrice ? Number(basePrice) : null,
                promoPrice: promoPrice ? Number(promoPrice) : null,
            };

            // Nếu muốn call API thật, dùng đoạn này:
            // let res;
            // if (variantId) {
            //     res = await axios.put(`${apiBase}/product-variants/${variantId}`, payload);
            // } else {
            //     res = await axios.post(`${apiBase}/product-variants`, payload);
            // }
            // const out = res?.data?.data || res?.data || payload;

            const out = payload; // tạm thời dùng payload làm out

            if (editingId) {
                // ĐANG CHỈNH SỬA → cập nhật lại phần tử trong tempVariants
                setTempVariants((prev) =>
                    prev.map((v) =>
                        v.id === editingId
                            ? {
                                ...v,
                                variant_name: payload.variant_name,
                                sku: payload.sku,
                                barcode: payload.barcode,
                                imageUrl: payload.image_url,
                                attributes: payload.attributes,
                                specs: payload.specs,
                                status: payload.status,
                                basePrice: payload.basePrice,
                                promoPrice: payload.promoPrice,
                            }
                            : v
                    )
                );
            } else {
                // ĐANG TẠO MỚI → thêm dòng mới
                setTempVariants((prev) => [
                    ...prev,
                    {
                        id: out.variant_id || out.id || Date.now(),
                        variant_name: out.variant_name || variantName,
                        sku: out.sku || sku,
                        barcode: out.barcode || barcode,
                        image_url: out.image_url || imageUrl || "",
                        attributes: out.attributes || attributesObj || {},
                        specs: out.specs || specs || {},
                        status: out.status ?? status,
                        basePrice: out.basePrice ?? (basePrice ? Number(basePrice) : null),
                        promoPrice: out.promoPrice ?? (promoPrice ? Number(promoPrice) : null),
                    },
                ]);
            }

            // sau khi lưu xong, thoát chế độ edit
            setEditingId(null);

            // reset form nếu đang tạo mới
            if (!variantId) {
                resetForm();
            }

            // bắn ra ngoài
            onSaved?.(out);
        } catch (e) {
            console.error(e);
            setErr("Lưu biến thể thất bại");
        } finally {
            setSaving(false);
        }
    };

    const editTempVariant = (variant) => {
        setEditingId(variant.id);

        setVariantName(variant.variant_name || "");
        setSku(variant.sku || "");
        setBarcode(variant.barcode || "");
        setImageUrl(variant.image_url || "");

        // attributes từ object → rows
        const attrs = variant.attributes || {};
        setAttributeRows(buildRowsFromAttributes(attrs));

        // specs giữ nguyên
        setSpecs(variant.specs || {});

        setBasePrice(
            typeof variant.basePrice === "number"
                ? String(variant.basePrice)
                : variant.basePrice || ""
        );
        setPromoPrice(
            typeof variant.promoPrice === "number"
                ? String(variant.promoPrice)
                : variant.promoPrice || ""
        );

        if (typeof variant.status !== "undefined") {
            setStatus(variant.status);
        }

        const el = document.getElementById("variant-collapse");
        if (el) {
            if (window.bootstrap?.Collapse) {
                const instance = window.bootstrap.Collapse.getOrCreateInstance(el);
                instance.show();
            } else {
                el.classList.add("show");
            }
        }
    };

    // mỗi lần tempVariants đổi → bắn ra parent qua onVariantsChange
    useEffect(() => {
        if (typeof onVariantsChange === "function") {
            onVariantsChange(tempVariants);
        }
    }, [tempVariants, onVariantsChange]);

    // ======================= Handlers cho attributes =======================

    const addAttrRow = () => {
        setAttributeRows((prev) => [...prev, createEmptyAttrRow()]);
    };

    const updateAttrRow = (rowId, patch) => {
        setAttributeRows((prev) =>
            prev.map((r) => (r.id === rowId ? { ...r, ...patch } : r))
        );
    };

    const removeAttrRow = (rowId) => {
        setAttributeRows((prev) => {
            if (prev.length <= 1) return prev; // không xoá dòng cuối
            return prev.filter((r) => r.id !== rowId);
        });
    };

    // ======================= Render =======================

    return (
        <div className="p-2">
            {/* nút mở/đóng form */}
            <div className="p-2 d-flex justify-content-center">
                <button
                    className="btn btn-outline-primary"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#variant-collapse"
                    aria-expanded={isFirstVariant ? "true" : "false"}
                    aria-controls="variant-collapse"
                >
                    Thêm biến thể
                </button>
            </div>

            <div
                className={`collapse rounded-0 ${isFirstVariant ? "show" : ""}`}
                id="variant-collapse"
            >
                <div className="d-flex align-items-center justify-content-between mb-2">
                    <div className="fw-semibold">
                        {variantId ? `Sửa biến thể #${variantId}` : "Tạo biến thể mới"}
                    </div>
                    {loading && (
                        <div className="d-flex align-items-center gap-2 text-muted small">
                            <div className="spinner-border spinner-border-sm" />
                            Đang tải…
                        </div>
                    )}
                </div>

                {/* form fields */}
                <div className="row g-3">
                    <div className="col-12 col-md-6">
                        <label className="form-label mb-1">
                            Tên biến thể <span className="text-danger">*</span>
                        </label>
                        <input
                            className="form-control"
                            placeholder="VD: Màu đen / 32GB"
                            value={variantName}
                            onChange={(e) => setVariantName(e.target.value)}
                        />
                    </div>

                    <div className="col-6 col-md-3">
                        <label className="form-label mb-1">SKU</label>
                        <input
                            className="form-control"
                            value={sku}
                            onChange={(e) => setSku(e.target.value)}
                        />
                    </div>
                    <div className="col-6 col-md-3">
                        <label className="form-label mb-1">Barcode</label>
                        <input
                            className="form-control"
                            value={barcode}
                            onChange={(e) => setBarcode(e.target.value)}
                        />
                    </div>

                    {/* ✅ NEW: Giá biến thể */}
                    <label className="form-label mb-1 mt-2">Giá biến thể</label>
                    <div className="d-flex justify-content-between gap-2">
                        <div className="input-group">
                            <span className="input-group-text">Giá base</span>
                            <input
                                className="form-control text-end"
                                value={basePrice}
                                onChange={(e) => setBasePrice(e.target.value)}
                                placeholder="VD: 1200000"
                            />
                        </div>
                        <div className="input-group">
                            <span className="input-group-text">Giá promo</span>
                            <input
                                className="form-control text-end"
                                value={promoPrice}
                                onChange={(e) => setPromoPrice(e.target.value)}
                                placeholder="VD: 990000"
                            />
                        </div>
                    </div>

                    <div className="col-12">
                        <label className="form-label mb-1">Ảnh (URL)</label>
                        <div className="input-group">
                            <input
                                className="form-control"
                                placeholder="https://..."
                                value={imageUrl}
                                onChange={(e) => setImageUrl(e.target.value)}
                            />
                            {imageUrl && (
                                <span className="input-group-text">
                                    <a href={imageUrl} target="_blank" rel="noreferrer">
                                        Mở
                                    </a>
                                </span>
                            )}
                        </div>
                        {imageUrl && (
                            <div className="mt-2">
                                <img
                                    src={imageUrl}
                                    alt="preview"
                                    style={{ maxWidth: 180, maxHeight: 120, objectFit: "cover" }}
                                />
                            </div>
                        )}
                    </div>

                    {/* ✅ THUỘC TÍNH: form key/value giống AttributePanel */}
                    <div className="col-12">
                        <label className="form-label mb-1">Thuộc tính</label>
                        <div className="table-responsive">
                            <table className="table table-sm align-middle mb-0">
                                <thead className="table-light">
                                    <tr>
                                        <th className="text-center" style={{ width: "40%" }}>
                                            Tên thuộc tính
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
                                    {attributeRows.map((r) => (
                                        <tr key={r.id}>
                                            <td className="text-center">
                                                <input
                                                    className="form-control form-control-sm"
                                                    placeholder="VD: Màu, Kích thước..."
                                                    value={r.key}
                                                    onChange={(e) =>
                                                        updateAttrRow(r.id, {
                                                            key: e.target.value,
                                                        })
                                                    }
                                                />
                                            </td>
                                            <td className="text-center">
                                                <input
                                                    className="form-control form-control-sm"
                                                    placeholder="VD: Đen, 32GB..."
                                                    value={r.value}
                                                    onChange={(e) =>
                                                        updateAttrRow(r.id, {
                                                            value: e.target.value,
                                                        })
                                                    }
                                                />
                                            </td>
                                            <td className="text-center">
                                                <button
                                                    type="button"
                                                    className="btn btn-outline-danger btn-sm"
                                                    onClick={() => removeAttrRow(r.id)}
                                                    disabled={attributeRows.length === 1}
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
                                                onClick={addAttrRow}
                                            >
                                                + Thêm dòng
                                            </button>
                                        </td>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>
                    </div>
                </div>

                {err && (
                    <div className="alert alert-danger py-2 px-3 mt-3" role="alert">
                        {err}
                    </div>
                )}

                <div className="d-flex gap-2 mt-3">
                    <button
                        type="button"
                        className="btn btn-primary"
                        disabled={!formValid || saving}
                        onClick={save}
                    >
                        {saving
                            ? "Đang lưu…"
                            : editingId
                                ? "Cập nhật biến thể"
                                : "Tạo biến thể"}
                    </button>
                </div>
            </div>

            {/* DANH SÁCH BIẾN THỂ ĐÃ THÊM */}
            {tempVariants.length > 0 && (
                <div className="mt-3">
                    <div className="fw-semibold mb-2">Biến thể đã thêm</div>
                    {tempVariants.map((v) => (
                        <div
                            key={v.id}
                            className="list-group-item border-0 px-0 py-2"
                        >
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

                                {/* Thông tin biến thể */}
                                <div className="flex-grow-1">
                                    <div className="d-flex flex-column justify-content-center">
                                        <div className="fw-semibold text-truncate">
                                            {v.variant_name || "(Chưa đặt tên)"}
                                        </div>

                                        <div className="small text-muted text-truncate">
                                            {v.attributes && Object.keys(v.attributes).length > 0 ? (
                                                Object.entries(v.attributes).map(
                                                    ([key, value], idx) => (
                                                        <span key={key}>
                                                            {idx > 0 && " · "}
                                                            <span className="text-capitalize">{key}:</span>{" "}
                                                            {String(value)}
                                                        </span>
                                                    )
                                                )
                                            ) : (
                                                "(Chưa có thuộc tính)"
                                            )}
                                        </div>
                                    </div>

                                    <div className="small text-muted mt-1">
                                        <span className="me-3">
                                            <span className="fw-semibold">SKU:</span>{" "}
                                            {v.sku || "-"}
                                        </span>
                                        <span className="me-3">
                                            <span className="fw-semibold">Barcode:</span>{" "}
                                            {v.barcode || "-"}
                                        </span>
                                        {/* ✅ NEW: hiển thị giá */}
                                        <span>
                                            <span className="fw-semibold">Giá:</span>{" "}
                                            {v.basePrice
                                                ? Number(v.basePrice).toLocaleString("vi-VN")
                                                : "-"}{" "}
                                            {v.promoPrice
                                                ? ` (KM: ${Number(
                                                    v.promoPrice
                                                ).toLocaleString("vi-VN")})`
                                                : ""}
                                        </span>
                                    </div>
                                </div>

                                <button
                                    type="button"
                                    className="btn btn-link btn-sm text-decoration-none p-0 mb-1"
                                    onClick={() => editTempVariant(v)}
                                >
                                    Chỉnh sửa
                                </button>

                                <button
                                    type="button"
                                    className="btn-close ms-2"
                                    aria-label="Xoá biến thể này"
                                    style={{
                                        width: "0.6rem",
                                        height: "0.6rem",
                                        transform: "scale(0.9)",
                                        filter:
                                            "invert(34%) sepia(94%) saturate(7476%) hue-rotate(353deg) brightness(100%) contrast(110%)",
                                    }}
                                    onClick={() => removeTempVariant(v.id)}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
