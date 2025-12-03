import React, { useEffect, useState } from "react";
import axios from "axios";

const API_BASE = process.env.REACT_APP_API_URL;

export default function ProductDropdown({ onChange }) {
    const [products, setProducts] = useState([]);
    const [q, setQ] = useState("");
    const [filtered, setFiltered] = useState([]);

    const [selectedProduct, setSelectedProduct] = useState(null);
    const [selectedVariant, setSelectedVariant] = useState(null);
    const [qty, setQty] = useState(1);
    const [attributeSelections, setAttributeSelections] = useState({});

    const [showPopup, setShowPopup] = useState(false);
    const [selectedId, setSelectedId] = useState("");

    useEffect(() => {
        axios.get(`${API_BASE}/products`)
            .then((res) => {
                const list =
                    Array.isArray(res.data)
                        ? res.data
                        : Array.isArray(res.data?.data)
                            ? res.data.data
                            : [];

                setProducts(list);
                setFiltered(list);
            })
            .catch((err) => console.error("Lỗi tải danh sách sản phẩm:", err));
    }, []);

    useEffect(() => {
        const key = q.trim().toLowerCase();
        if (!key) return setFiltered(products);

        setFiltered(
            products.filter((p) =>
                (p.productName || "").toLowerCase().includes(key) ||
                (p.sku || "").toLowerCase().includes(key)
            )
        );
    }, [q, products]);

    const openVariantPopup = (productId) => {
        const p = products.find((x) => x.productId == productId);
        setSelectedProduct(p);
        setSelectedVariant(null);
        setQty(1);
        setAttributeSelections({});
        setShowPopup(true);
    };

    const handleVariantClick = (v) => {
        setSelectedVariant(v);

        // reset selected attributes
        const attrs = v.attributes || {};
        const initial = {};

        Object.keys(attrs).forEach((key) => {
            // Nếu API trả 1 giá trị string → chuyển thành mảng 1 phần tử
            const values = Array.isArray(attrs[key]) ? attrs[key] : [attrs[key]];
            initial[key] = values[0];
        });

        setAttributeSelections(initial);
    };

    const confirmSelection = () => {
        if (!selectedVariant) return;
        setShowPopup(false);
        setSelectedId("");  // <── reset dropdown

        const displayPrice =
            selectedVariant.prices?.find((p) => p.priceType === "promo")?.price ||
            selectedVariant.prices?.find((p) => p.priceType === "base")?.price ||
            0;

        onChange?.({
            productId: selectedProduct.productId,
            productName: selectedProduct.productName,
            variantId: selectedVariant.variantId,
            variantName: selectedVariant.variantName,
            sku: selectedVariant.sku,
            price: displayPrice,
            quantity: qty,
            attributes: attributeSelections
        });

        setShowPopup(false);
    };

    return (
        <div>
            <input
                className="form-control mb-2"
                placeholder="Tìm sản phẩm theo tên hoặc SKU..."
                value={q}
                onChange={(e) => setQ(e.target.value)}
            />

            <select
                className="form-select"
                value={selectedId}
                onChange={(e) => {
                    setSelectedId(e.target.value);
                    openVariantPopup(e.target.value);
                }}
            >
                <option value="">-- Chọn sản phẩm --</option>
                {filtered.map((p) => (
                    <option key={p.productId} value={p.productId}>
                        {p.productName}
                    </option>
                ))}
            </select>


            {/* POPUP */}
            {showPopup && selectedProduct && (
                <div
                    className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center"
                    style={{ background: "rgba(0,0,0,0.4)" }}
                >
                    <div className="bg-white p-3 rounded shadow" style={{ width: 450 }}>
                        <h5>Chọn biến thể</h5>
                        <p className="text-muted">{selectedProduct.productName}</p>

                        {/* LIST VARIANT */}
                        {selectedProduct.variants?.map((v) => {
                            const price =
                                v.prices?.find((p) => p.priceType === "promo")?.price ||
                                v.prices?.find((p) => p.priceType === "base")?.price ||
                                "0";

                            return (
                                <button
                                    key={v.variantId}
                                    className={
                                        "btn w-100 mb-2 text-start " +
                                        (selectedVariant?.variantId === v.variantId
                                            ? "btn-primary"
                                            : "btn-outline-primary")
                                    }
                                    onClick={() => handleVariantClick(v)}
                                >
                                    <strong>{v.variantName}</strong>
                                    {v.sku && ` | SKU: ${v.sku}`}
                                    <br />
                                    Giá: {Number(price).toLocaleString("vi-VN")} đ
                                </button>
                            );
                        })}

                        {/* ATTRIBUTE BUTTONS */}
                        {selectedVariant && selectedVariant.attributes && (
                            <div className="mt-3">
                                {Object.entries(selectedVariant.attributes).map(
                                    ([key, values]) => {
                                        const list = Array.isArray(values)
                                            ? values
                                            : [values];

                                        return (
                                            <div key={key} className="mb-3">
                                                <label className="fw-bold d-block mb-1">{key}</label>

                                                <div className="d-flex flex-wrap gap-2">
                                                    {list.map((val) => (
                                                        <button
                                                            key={val}
                                                            className={
                                                                "btn btn-sm px-3 " +
                                                                (attributeSelections[key] === val
                                                                    ? "btn-success"
                                                                    : "btn-outline-success")
                                                            }
                                                            onClick={() =>
                                                                setAttributeSelections({
                                                                    ...attributeSelections,
                                                                    [key]: val,
                                                                })
                                                            }
                                                        >
                                                            {val}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        );
                                    }
                                )}
                            </div>
                        )}

                        {/* QUANTITY */}
                        {selectedVariant && (
                            <div className="mt-3">
                                <label className="form-label">Số lượng:</label>
                                <input
                                    type="number"
                                    className="form-control"
                                    min={1}
                                    value={qty}
                                    onChange={(e) => setQty(Math.max(1, Number(e.target.value)))}
                                />
                            </div>
                        )}

                        {/* ACTION BUTTONS */}
                        <div className="d-flex gap-2 mt-4">
                            <button
                                className="btn btn-secondary w-50"
                                onClick={() => setShowPopup(false)}
                            >
                                Hủy
                            </button>

                            <button
                                className="btn btn-success w-50"
                                disabled={!selectedVariant}
                                onClick={confirmSelection}
                            >
                                Thêm vào đơn
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
