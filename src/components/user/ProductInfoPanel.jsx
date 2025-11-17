import React, { useContext, useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { CartContext } from "../../hooks/CartContext";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import Cookies from "js-cookie";

const fmtVND = (n) =>
  Number(n || 0).toLocaleString("vi-VN", {
    style: "currency",
    currency: "VND",
  });

/** Helper: lấy basePrice/promoPrice/finalPrice từ 1 variant */
function pickPricesFromVariant(variant) {
  if (!variant) {
    return {
      basePrice: null,
      promoPrice: null,
      finalPrice: 0,
    };
  }

  // Trường hợp BE có currentPrice mà không có mảng prices
  if (!Array.isArray(variant.prices)) {
    const cur =
      typeof variant.currentPrice === "number" ? variant.currentPrice : 0;
    return {
      basePrice: cur || null,
      promoPrice: null,
      finalPrice: cur || 0,
    };
  }

  let baseRecord = null;
  let promoRecord = null;

  variant.prices.forEach((p) => {
    if (!p) return;
    if (p.priceType === "base") {
      if (!baseRecord || new Date(p.startAt) > new Date(baseRecord.startAt)) {
        baseRecord = p;
      }
    }
    if (p.priceType === "promo") {
      if (!promoRecord || new Date(p.startAt) > new Date(promoRecord.startAt)) {
        promoRecord = p;
      }
    }
  });

  const basePrice = baseRecord ? Number(baseRecord.price) : null;
  const promoPrice = promoRecord ? Number(promoRecord.price) : null;
  const finalPrice = promoPrice ?? basePrice ?? 0;

  return { basePrice, promoPrice, finalPrice };
}

export function ProductInfoPanel({
  product,
  onVariantChange,
  onVariantsLoaded,
}) {
  const { setCartCount, setSelectedProducts } =
    useContext(CartContext);

  const [quantity, setQuantity] = useState(1);
  const [variants, setVariants] = useState([]);
  const [selectedVariant, setSelectedVariant] = useState(null);

  // 🆕 Thuộc tính đang chọn (giống ModalBuy)
  const [selectedAttr, setSelectedAttr] = useState(null);

  const handleAttrClick = (key, value) => {
    const attrKey = `${key}:${value}`;
    setSelectedAttr((prev) => (prev === attrKey ? null : attrKey));
  };

  // 🔁 Dùng luôn product.variants từ BE (đã có prices)
  useEffect(() => {
    if (!product) return;

    const rawVariants = product.variants || [];

    const variantsWithImages = rawVariants.map((v) => {
      let imageUrls = [];
      const img = v.imageUrl;

      if (Array.isArray(img)) {
        imageUrls = img
          .map((x) => (typeof x === "string" ? x : x?.imageUrl))
          .filter(Boolean);
      } else if (typeof img === "string") {
        imageUrls = [img];
      } else if (img && typeof img === "object" && img.imageUrl) {
        imageUrls = [img.imageUrl];
      }

      return { ...v, imageUrls };
    });

    setVariants(variantsWithImages);

    // gửi toàn bộ ảnh biến thể lên parent (gallery)
    const variantImages = variantsWithImages.flatMap(
      (v) => v.imageUrls || []
    );
    onVariantsLoaded?.(variantImages);

    // chọn mặc định biến thể đầu tiên
    if (!selectedVariant && variantsWithImages.length > 0) {
      const firstVariant = variantsWithImages[0];
      setSelectedVariant(firstVariant);
      onVariantChange?.(firstVariant);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product]);

  // ======= Derived data (không dùng hook nữa) =======
  const active = selectedVariant ?? {};
  const attrs = active.attributes || {};

  const name = `${product?.productName ?? "Sản phẩm"}${active?.variantName ? ` - ${active.variantName}` : ""
    }`;
  const sku = active?.sku || product?.sku || `SKU-${product?.productId}`;

  const { basePrice, promoPrice, finalPrice } = pickPricesFromVariant(active);
  const price = finalPrice || 0;

  const categoryName = product?.category?.categoryName;

  const rawDesc =
    product?.shortDescription ??
    "Đang cập nhật thông tin nổi bật cho sản phẩm.";
  const features = rawDesc
    .split(/[,•\n]+/g)
    .map((s) => s.trim())
    .filter(Boolean)
    .slice(0, 6);

  const status = product?.status ?? 0;
  const tags = [];
  if (status === 1 || status === 12)
    tags.push({ text: "Nổi bật", className: "bg-warning text-dark" });
  if (status === 2 || status === 12)
    tags.push({ text: "Mới", className: "bg-danger" });

  const isLoading = !product;

  // 🛒 Thêm vào giỏ hàng
  const addToCart = async (productId, qty) => {
    try {
      const token = localStorage.getItem("Authorization") || null;

      // 1️⃣ Có token → gọi API server
      if (token && token.trim()) {
        const decoded = jwtDecode(token);
        const userId = decoded.sub;
        const payload = {
          productId,
          quantity: qty,
          selectedVariant,
          selectedAttr,
        };

        await axios.post(
          `${process.env.REACT_APP_API_URL}/cart/${userId}/items`,
          payload,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        alert("Đã thêm sản phẩm!");
        fetchCountCart();
        return;
      }

      // 2️⃣ Không có token → lưu vào cookie (guest_cart)
      const currentCart = JSON.parse(Cookies.get("guest_cart") || "[]");

      const cleanVariant = selectedVariant
        ? {
          variantId: selectedVariant.variantId,
          variantName: selectedVariant.variantName,
          attributes: selectedVariant.attributes || {},
          price: price, // 👈 dùng finalPrice (ưu tiên promo)
          basePrice,
          promoPrice,
        }
        : null;

      const idx = currentCart.findIndex(
        (i) =>
          i.productId === productId &&
          (i.selectedVariant?.variantId || null) ===
          (cleanVariant?.variantId || null) &&
          (i.selectedAttr || null) === (selectedAttr || null)
      );

      if (idx !== -1) {
        currentCart[idx].quantity += qty;
        currentCart[idx].selectedVariant = cleanVariant;
        currentCart[idx].selectedAttr = selectedAttr;
      } else {
        const newItem = {
          productId,
          quantity: qty,
          selectedVariant: cleanVariant,
          selectedAttr,
        };
        currentCart.push(newItem);
      }

      Cookies.set("guest_cart", JSON.stringify(currentCart), { expires: 7 });

      // cập nhật context & badge số lượng (đơn giản: số dòng)
      setCartCount(currentCart.length);

      alert("Đã lưu sản phẩm vào giỏ hàng!");
    } catch (error) {
      console.error("❌ Lỗi thêm vào giỏ hàng:", error);
      alert("Không thể thêm vào giỏ hàng!");
    }
  };

  const fetchCountCart = async () => {
    const token = localStorage.getItem("Authorization") || null;
    if (token && token.trim()) {
      const decoded = jwtDecode(token);
      const resCart = await axios.get(
        `${process.env.REACT_APP_API_URL}/cart/${decoded.sub}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCartCount(resCart.data.items.length || 0);
    }
  };

  const handleSubmit = (product) => {
    setSelectedProducts([
      {
        data: product,
        quantity: quantity || 1,
        selectedVariant,
        selectedAttr, // mang theo thuộc tính đã chọn
      },
    ]);
  };

  return (
    <div className="bg-white p-4 rounded-4 shadow-sm position-relative overflow-hidden">
      {isLoading ? (
        <div className="text-center text-secondary py-5">
          <div className="spinner-border text-primary mb-2" role="status">
            <span className="visually-hidden">Đang tải...</span>
          </div>
          <div>Đang tải thông tin sản phẩm...</div>
        </div>
      ) : (
        <>
          <h1 className="h3 fw-bold mb-1">{name}</h1>

          <div className="d-flex flex-wrap align-items-center gap-2 mb-3 small">
            {tags.map((t, i) => (
              <span
                key={i}
                className={`badge ${t.className} rounded-pill px-3 py-2`}
              >
                {t.text}
              </span>
            ))}
          </div>

          <div className="d-flex align-items-center gap-2 mb-3 small text-muted">
            <span className="badge bg-light text-secondary border">
              Mã: #{product?.productId}
            </span>
            {sku && (
              <span className="badge bg-light text-secondary border">
                SKU: {sku}
              </span>
            )}
            {categoryName && (
              <span className="badge bg-primary-subtle text-primary border border-primary">
                {categoryName}
              </span>
            )}
          </div>

          {/* 💡 CHỌN BIẾN THỂ */}
          {variants.length > 0 && (
            <div className="mb-3">
              <div className="fw-semibold mb-2">Chọn phiên bản</div>
              <div className="d-flex flex-wrap gap-2">
                {variants.map((v) => (
                  <button
                    key={v.variantId}
                    type="button"
                    className={`btn ${v.variantId === active.variantId
                      ? "btn-primary"
                      : "btn-outline-secondary"
                      }`}
                    onClick={() => {
                      setSelectedVariant(v);
                      setSelectedAttr(null);
                      onVariantChange?.(v);
                    }}
                  >
                    {v.variantName}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* 🧬 THUỘC TÍNH BIẾN THỂ (giống ModalBuy) */}
          {selectedVariant && (
            <div className="border rounded p-3 bg-light-subtle mb-3">
              <div className="fw-semibold mb-2">
                Thuộc tính của {selectedVariant.variantName}
              </div>

              {Object.keys(attrs).length ? (
                <div
                  className="d-flex flex-wrap gap-2"
                  role="radiogroup"
                  aria-label="Chọn thuộc tính"
                >
                  {Object.entries(attrs).flatMap(([key, value]) => {
                    const values = Array.isArray(value) ? value : [value];
                    return values.map((val, i) => {
                      const attrKey = `${key}:${val}`;
                      const checked = selectedAttr === attrKey;
                      const id = `attr-${key}-${i}`;
                      return (
                        <React.Fragment key={id}>
                          <input
                            type="radio"
                            className="btn-check"
                            name="attr-radio"
                            id={id}
                            checked={checked}
                            onChange={() => handleAttrClick(key, val)}
                          />
                          <label
                            htmlFor={id}
                            className={`btn btn-sm rounded-pill ${checked
                              ? "btn-danger"
                              : "btn-outline-secondary"
                              }`}
                            role="radio"
                            aria-checked={checked}
                            title={`${key}: ${val}`}
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

          {/* 💰 GIÁ (base/promo) */}
          <div
            className="rounded-3 p-3 mb-3"
            style={{ background: "var(--bs-light)" }}
          >
            <div className="d-flex align-items-baseline gap-3 flex-wrap">
              {promoPrice != null ? (
                <>
                  <div className="text-muted text-decoration-line-through">
                    {fmtVND((basePrice ?? promoPrice) * quantity)}
                  </div>
                  <div
                    className="fw-bold"
                    style={{
                      fontSize: "2rem",
                      color: "var(--bs-danger)",
                      lineHeight: 1,
                    }}
                  >
                    {fmtVND(promoPrice * quantity)}
                  </div>
                  <span className="badge bg-danger-subtle text-danger border border-danger">
                    Giảm giá
                  </span>
                </>
              ) : (
                <div
                  className="fw-bold"
                  style={{
                    fontSize: "2rem",
                    color: "var(--bs-danger)",
                    lineHeight: 1,
                  }}
                >
                  {fmtVND((basePrice ?? price) * quantity)}
                </div>
              )}

              <span className="badge bg-success-subtle text-success border border-success ms-auto">
                Miễn phí vận chuyển
              </span>
            </div>
          </div>

          {/* 🌟 Tính năng nổi bật */}
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

          {/* 🔢 Số lượng + CTA */}
          <div className="d-flex align-items-center gap-3 mb-3 flex-wrap">
            <div className="d-flex align-items-center">
              <span className="me-2 text-secondary">Số lượng</span>
              <div className="input-group" style={{ width: 150 }}>
                <button
                  className="btn btn-outline-secondary"
                  type="button"
                  onClick={() =>
                    setQuantity((n) => Math.max(1, (Number(n) || 1) - 1))
                  }
                >
                  <i className="bi bi-dash-lg"></i>
                </button>
                <input
                  className="form-control text-center"
                  type="number"
                  value={quantity}
                  min={1}
                  max={999}
                  onChange={(e) => {
                    const v = Number(e.target.value);
                    setQuantity(
                      Number.isFinite(v) && v > 0 ? Math.min(v, 999) : 1
                    );
                  }}
                />
                <button
                  className="btn btn-outline-secondary"
                  type="button"
                  onClick={() =>
                    setQuantity((n) => Math.min(999, (Number(n) || 1) + 1))
                  }
                >
                  <i className="bi bi-plus-lg"></i>
                </button>
              </div>
            </div>

            <div className="d-flex flex-wrap gap-2 ms-auto">
              <button
                className="btn btn-danger px-4 d-flex align-items-center gap-2"
                onClick={() => addToCart(product?.productId, quantity)}
              >
                <i className="bi bi-bag-plus"></i>
                Thêm vào giỏ hàng
              </button>

              <NavLink
                to="/checkout"
                className="btn btn-primary px-4 d-flex align-items-center gap-2"
                onClick={() => handleSubmit(product)}
              >
                <i className="bi bi-lightning-charge-fill"></i>
                Mua ngay
              </NavLink>
            </div>
          </div>

          {/* 🔒 Chính sách */}
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
        </>
      )}
    </div>
  );
}
