import React, { useContext, useEffect, useMemo, useState } from "react";
import { NavLink } from "react-router-dom";
import { CartContext } from "../../hooks/CartContext";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import Cookies from "js-cookie";

import {
  pickPricesFromVariant,
  makeCheckoutProduct,
} from "../../utils/productBuyHelper";

const fmtVND = (n) =>
  Number(n || 0).toLocaleString("vi-VN", {
    style: "currency",
    currency: "VND",
  });

export default function ProductInfoPanel({
  product,
  onVariantChange,
  onVariantsLoaded,
}) {
  const { setCartCount, setSelectedProducts } = useContext(CartContext);

  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [selectedAttr, setSelectedAttr] = useState(null);

  const variants = product?.variants || [];

  /* ----------------------- Load default variant ----------------------- */
  useEffect(() => {
    if (variants.length > 0 && !selectedVariant) {
      const first = variants[0];
      setSelectedVariant(first);
      onVariantChange?.(first);
    }
  }, [variants]);

  /* ---------------------------- Load images --------------------------- */
  useEffect(() => {
    if (!product) return;

    const variantImages = variants.flatMap((v) => {
      if (Array.isArray(v.imageUrl)) return v.imageUrl;
      if (typeof v.imageUrl === "string") return [v.imageUrl];
      if (v.imageUrl?.imageUrl) return [v.imageUrl.imageUrl];
      return [];
    });

    onVariantsLoaded?.(variantImages);
  }, [product, variants]);

  /* --------------------------- Derived Values -------------------------- */

  const active = selectedVariant || {};
  const attrs = active.attributes || {};

  const { basePrice, promoPrice, finalPrice } = pickPricesFromVariant(active);

  const displayPrice = promoPrice ?? basePrice ?? product?.price ?? finalPrice;

  const hasPromo =
    promoPrice != null && (basePrice ?? promoPrice) > promoPrice;

  const categoryName = product?.category?.categoryName;

  const name = [
    product?.productName ?? "Sản phẩm",
    active?.variantName,
  ]
    .filter(Boolean)
    .join(" - ");

  const sku =
    active?.sku ||
    product?.sku ||
    `SKU-${product?.productId}`;

  /* ------------------------- Handlers ------------------------- */

  const handleVariantSelect = (v) => {
    setSelectedVariant(v);
    setSelectedAttr(null);
    onVariantChange?.(v);
  };

  const handleAttrClick = (key, val) => {
    const newKey = `${key}:${val}`;
    setSelectedAttr((prev) => (prev === newKey ? null : newKey));
  };

  const increase = () => setQuantity((n) => Math.min(999, n + 1));
  const decrease = () => setQuantity((n) => Math.max(1, n - 1));

  /* ----------------------- ADD TO CART ----------------------- */

  const addToCart = async (productId, qty) => {
    try {
      const token = localStorage.getItem("Authorization");

      // 1) User logged in → send to server
      if (token?.trim()) {
        const userId = jwtDecode(token).sub;

        await axios.post(
          `${process.env.REACT_APP_API_URL}/cart/${userId}/items`,
          {
            productId,
            quantity: qty,
            selectedVariant,
            selectedAttr,
          },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        alert("Đã thêm sản phẩm vào giỏ!");
        fetchCountCart();
        return;
      }

      // 2) Guest cart → save to cookie
      const guest = JSON.parse(Cookies.get("guest_cart") || "[]");

      const cartItem = makeCheckoutProduct({
        product,
        variant: active,
        quantity: qty,
        selectedAttr,
      });

      const idx = guest.findIndex(
        (i) =>
          i.productId === productId &&
          (i.variantId || null) === (cartItem.variantId || null) &&
          (i.selectedAttr || null) === (selectedAttr || null)
      );

      if (idx !== -1) guest[idx].quantity += qty;
      else guest.push(cartItem);

      Cookies.set("guest_cart", JSON.stringify(guest), { expires: 7 });

      setCartCount(guest.length);
      alert("Đã thêm sản phẩm!");
    } catch (err) {
      console.error(err);
      alert("Không thể thêm vào giỏ hàng!");
    }
  };

  const fetchCountCart = async () => {
    const token = localStorage.getItem("Authorization");
    if (!token?.trim()) return;

    const userId = jwtDecode(token).sub;
    const res = await axios.get(
      `${process.env.REACT_APP_API_URL}/cart/${userId}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    setCartCount(res.data.items.length || 0);
  };

  /* ---------------------- Checkout Submit ---------------------- */
  const submitCheckout = () => {
    const checkoutItem = makeCheckoutProduct({
      product,
      variant: active,
      quantity,
      selectedAttr,
    });
    console.log("checkoutItem", checkoutItem);

    setSelectedProducts([checkoutItem]);
  };

  if (!product)
    return (
      <div className="text-center text-secondary py-5">
        <div className="spinner-border text-primary mb-2"></div>
        Đang tải thông tin sản phẩm...
      </div>
    );

  /* -------------------------------- UI -------------------------------- */

  return (
    <div className="bg-white p-4 rounded-4 shadow-sm position-relative">
      <h1 className="h3 fw-bold mb-1">{name}</h1>

      {/* TAGS */}
      <div className="d-flex flex-wrap gap-2 mb-3 small">
        {[1, 12].includes(product?.status) && (
          <span className="badge bg-warning text-dark">Nổi bật</span>
        )}
        {[2, 12].includes(product?.status) && (
          <span className="badge bg-danger">Mới</span>
        )}
      </div>

      {/* SKU */}
      <div className="d-flex flex-wrap gap-2 mb-3 small text-muted">
        <span className="badge bg-dark border">Mã: #{product?.productId}</span>
        <span className="badge bg-danger border">SKU: {sku}</span>
        {categoryName && (
          <span className="badge bg-primary-subtle border border-primary text-primary">
            {categoryName}
          </span>
        )}
      </div>

      {/* Variant choose */}
      {variants.length > 0 && (
        <div className="mb-3">
          <div className="fw-semibold mb-2">Chọn phiên bản</div>

          <div className="d-flex flex-wrap gap-2">
            {variants.map((v) => {
              const checked = v.variantId === active.variantId;
              const id = `variant-${v.variantId}`;

              return (
                <React.Fragment key={v.variantId}>
                  <input
                    type="radio"
                    id={id}
                    name="variant"
                    className="btn-check"
                    checked={checked}
                    onChange={() => handleVariantSelect(v)}
                  />
                  <label
                    htmlFor={id}
                    className={`btn btn-sm ${checked ? "btn-primary" : "btn-outline-secondary"
                      }`}
                  >
                    {v.variantName}
                  </label>
                </React.Fragment>
              );
            })}
          </div>
        </div>
      )}

      {/* Attributes */}
      {selectedVariant && (
        <div className="border rounded p-3 bg-light-subtle mb-3">
          <div className="fw-semibold mb-2">
            Thuộc tính của {active.variantName}
          </div>

          {Object.keys(attrs).length ? (
            <div className="d-flex flex-wrap gap-2">
              {Object.entries(attrs).flatMap(([key, values]) => {
                const list = Array.isArray(values) ? values : [values];

                return list.map((val, idx) => {
                  const id = `attr-${key}-${idx}`;
                  const attrKey = `${key}:${val}`;
                  const checked = selectedAttr === attrKey;

                  return (
                    <React.Fragment key={id}>
                      <input
                        type="radio"
                        id={id}
                        name="attr-radio"
                        className="btn-check"
                        checked={checked}
                        onChange={() => handleAttrClick(key, val)}
                      />
                      <label
                        htmlFor={id}
                        className={`btn btn-sm rounded-pill ${checked ? "btn-danger" : "btn-outline-secondary"
                          }`}
                      >
                        {key}: {String(val)}
                      </label>
                    </React.Fragment>
                  );
                });
              })}
            </div>
          ) : (
            <small className="text-muted">Không có thuộc tính.</small>
          )}
        </div>
      )}
      <div className="feature-list-wrapper mb-3">
        <div dangerouslySetInnerHTML={{ __html: product?.shortDescription ?? "" }} />
      </div>
      {/* PRICE */}
      <div className="rounded-3 p-3 mb-3 bg-light">
        <div className="d-flex align-items-baseline gap-3 flex-wrap">
          {hasPromo ? (
            <>
              <h3 className="text-danger fw-bold mb-0">
                {fmtVND(promoPrice * quantity)}
              </h3>
              <span className="text-muted text-decoration-line-through">
                {fmtVND(basePrice * quantity)}
              </span>
              <span className="badge bg-danger-subtle text-danger">
                Giảm giá
              </span>
            </>
          ) : (
            <h3 className="text-danger fw-bold mb-0">
              {fmtVND(displayPrice * quantity)}
            </h3>
          )}

          <span className="badge bg-success-subtle text-success border border-success ms-auto">
            Miễn phí vận chuyển
          </span>
        </div>
      </div>

      {/* Quantity + CTA */}
      <div className="d-flex align-items-center gap-3 mb-3 flex-wrap">
        <div className="input-group" style={{ width: 150 }}>
          <button className="btn btn-outline-secondary" onClick={decrease}>
            -
          </button>
          <input
            type="number"
            className="form-control text-center"
            min={1}
            max={999}
            value={quantity}
            onChange={(e) =>
              setQuantity(Math.max(1, Math.min(999, Number(e.target.value))))
            }
          />
          <button className="btn btn-outline-secondary" onClick={increase}>
            +
          </button>
        </div>

        <button
          className="btn btn-danger px-4"
          onClick={() => addToCart(product.productId, quantity)}
        >
          + Thêm giỏ hàng
        </button>

        <NavLink
          to="/checkout"
          className="btn btn-primary px-4"
          onClick={submitCheckout}
        >
          Mua ngay
        </NavLink>
      </div>

      {/* Policies */}
      <div className="row g-3 small text-muted">
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
    </div>
  );
}
