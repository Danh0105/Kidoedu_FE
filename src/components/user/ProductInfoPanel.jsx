// ==== ProductDetail.jsx (UI polish for the right column) ====
import React, { useMemo, useState, useContext } from "react";
import { NavLink } from "react-router-dom";
import { CartContext } from "../../hooks/CartContext";

const fmtVND = (n) =>
  Number(n || 0).toLocaleString("vi-VN", { style: "currency", currency: "VND" });

export function ProductInfoPanel({ product, images = [], onAddToCart, defaultQty = 1 }) {
  const { addItem } = useContext(CartContext);
  const [qty, setQty] = useState(defaultQty);

  const name = product?.product_name ?? product?.data?.product_name ?? "Sản phẩm";
  const price = useMemo(
    () => Number(product?.price ?? product?.data?.price ?? 0),
    [product]
  );
  const sku =
    product?.sku || product?.data?.sku || product?.data?.sku_code || `SKU-${product?.product_id}`;
  const categoryName = product?.category?.category_name ?? product?.data?.category?.category_name;

  // cắt mô tả dài thành key features
  const rawDesc =
    product?.description ??
    product?.data?.description ??
    "Đang cập nhật thông tin nổi bật cho sản phẩm.";
  const features = rawDesc
    .split(/[,•\n]+/g)
    .map((s) => s.trim())
    .filter(Boolean)
    .slice(0, 6); // hiển thị tối đa 6 gạch đầu dòng

  const handleAdd = async () => {
    const item = {
      data: {
        product_id: product?.product_id ?? product?.data?.product_id,
        product_name: name,
        price,
        images: images.map((url) => ({ image_url: url })),
      },
      quantity: qty,
    };
    await addItem?.(item);
    onAddToCart?.(item);
  };
  // utils/badges.js (hoặc đặt ngay trong file)
  const pickBadgesFromStatus = (rawStatus) => {
    const s = Number(rawStatus ?? 0);
    const tags = [];
    if (s === 1 || s === 12) tags.push({ text: "Nổi bật", className: "bg-warning text-dark" });
    if (s === 2 || s === 12) tags.push({ text: "Mới", className: "bg-danger" });
    return tags;
  };
  const status = product?.status ?? product?.data?.status;
  // tạo danh sách badge
  const tags = pickBadgesFromStatus(status);
  return (
    <div className="bg-white p-4 rounded-4 shadow-sm position-relative overflow-hidden">


      <h1 className="h3 fw-bold mb-1">{name}</h1>
      <div className="d-flex flex-wrap align-items-center gap-2 mb-3 small">
        {tags.map((t, i) => (
          <span key={i} className={`badge ${t.className} rounded-pill px-3 py-2`}>{t.text}</span>
        ))}
        {/* các badge meta khác (SKU/Category) nếu muốn */}
      </div>
      <div className="d-flex align-items-center gap-2 mb-3 small text-muted">
        <span className="badge bg-light text-secondary border">Mã: #{product?.product_id}</span>
        {sku && <span className="badge bg-light text-secondary border">SKU: {sku}</span>}
        {categoryName && (
          <span className="badge bg-primary-subtle text-primary border border-primary">
            {categoryName}
          </span>
        )}
      </div>

      {/* Price block */}
      <div className="rounded-3 p-3 mb-3" style={{ background: "var(--bs-light)" }}>
        <div className="d-flex align-items-baseline gap-3">
          <div
            className="fw-bold"
            style={{
              fontSize: "2rem",
              color: "var(--bs-danger)",
              lineHeight: 1,
            }}
          >
            {fmtVND(price)}
          </div>
          {/* ví dụ giá gạch (nếu có) */}
          {product?.price_before && (
            <del className="text-muted">{fmtVND(product.price_before)}</del>
          )}
          <span className="badge bg-success-subtle text-success border border-success">
            Miễn phí vận chuyển
          </span>
        </div>
      </div>

      {/* Key features */}
      <div className="mb-3">
        <div className="fw-semibold mb-2">Tính năng nổi bật</div>
        <ul className="list-unstyled m-0">
          {features.map((f, i) => (
            <li key={i} className="d-flex align-items-start gap-2 mb-1">
              <i className="bi bi-check2-circle fs-5 text-success"></i>
              <span className="text-secondary">{f}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Quantity + CTAs */}
      <div className="d-flex align-items-center gap-3 mb-3">
        <div className="d-flex align-items-center">
          <span className="me-2 text-secondary">Số lượng</span>
          <div className="input-group" style={{ width: 150 }}>
            <button
              className="btn btn-outline-secondary"
              type="button"
              onClick={() => setQty((n) => Math.max(1, (Number(n) || 1) - 1))}
            >
              <i className="bi bi-dash-lg"></i>
            </button>
            <input
              className="form-control text-center"
              type="number"
              value={qty}
              min={1}
              max={999}
              onChange={(e) => {
                const v = Number(e.target.value);
                setQty(Number.isFinite(v) && v > 0 ? Math.min(v, 999) : 1);
              }}
            />
            <button
              className="btn btn-outline-secondary"
              type="button"
              onClick={() => setQty((n) => Math.min(999, (Number(n) || 1) + 1))}
            >
              <i className="bi bi-plus-lg"></i>
            </button>
          </div>
        </div>

        <div className="d-flex flex-wrap gap-2 ms-auto">
          <button className="btn btn-danger px-4 d-flex align-items-center gap-2" onClick={handleAdd}>
            <i className="bi bi-bag-plus"></i>
            Thêm vào giỏ hàng
          </button>

          <NavLink
            className="btn btn-primary px-4 d-flex align-items-center gap-2"
            to="/checkout"
            state={{
              directBuy: true,
              items: [
                {
                  data: {
                    product_id: product?.product_id ?? product?.data?.product_id,
                    product_name: name,
                    price,
                    images: images.map((url) => ({ image_url: url })),
                  },
                  quantity: qty,
                },
              ],
            }}
          >
            <i className="bi bi-lightning-charge-fill"></i>
            Mua ngay
          </NavLink>
        </div>
      </div>

      {/* Trust row */}
      <div className="row g-3 small text-secondary">
        <div className="col-12 col-md-4 d-flex align-items-center gap-2">
          <i className="bi bi-shield-check text-success fs-5"></i>
          Bảo hành chính hãng
        </div>
        <div className="col-12 col-md-4 d-flex align-items-center gap-2">
          <i className="bi bi-truck text-primary fs-5"></i>
          Giao nhanh toàn quốc
        </div>
        <div className="col-12 col-md-4 d-flex align-items-center gap-2">
          <i className="bi bi-arrow-repeat text-info fs-5"></i>
          Đổi trả trong 7 ngày
        </div>
      </div>

      {/* Mobile quick bar */}
      <div className="d-md-none">
        <div
          className="position-fixed bottom-0 start-0 end-0 bg-white border-top shadow-lg p-2 d-flex align-items-center gap-2"
          style={{ zIndex: 1030 }}
        >
          <div className="fw-bold text-danger">{fmtVND(price)}</div>
          <button className="btn btn-outline-danger flex-fill" onClick={handleAdd}>
            Thêm giỏ
          </button>
          <NavLink className="btn btn-primary flex-fill" to="/checkout" state={{ directBuy: true }}>
            Mua ngay
          </NavLink>
        </div>
      </div>
    </div>
  );
}
