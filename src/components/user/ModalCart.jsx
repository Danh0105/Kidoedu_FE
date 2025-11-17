import React, { useContext, useEffect, useMemo, useState } from "react";
import InnerImageZoom from "react-inner-image-zoom";
import Slider from "react-slick";
import axios from "axios";
import { NavLink } from "react-router-dom";
import { CartContext } from "../../hooks/CartContext";
import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";

// ================== Helpers ==================
const formatCurrency = (value) =>
  new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(Number(value || 0));

function pickPricesFromVariant(variant) {
  if (!variant) {
    return {
      basePrice: null,
      promoPrice: null,
      finalPrice: 0,
    };
  }

  // Nếu BE có currentPrice nhưng chưa truyền mảng prices
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

// ================== Component chính ==================
export default function ModalBuy({ show, onClose, product }) {
  // ----- State

  const [navMain, setNavMain] = useState(null);
  const [navThumb, setNavThumb] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const variants = product?.variants || [];
  const [activeVariant, setActiveVariant] = useState(null);
  const [selectedAttr, setSelectedAttr] = useState(null);
  const { addToCartContext, setCartCount } = useContext(CartContext);

  // ----- Chọn biến thể mặc định
  useEffect(() => {
    if (variants.length && !activeVariant) setActiveVariant(variants[0]);
  }, [variants, activeVariant]);

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

  // ----- Close on ESC & lock scroll; focus Close button on open
  useEffect(() => {
    if (!show) return;
    const onEsc = (e) => e.key === "Escape" && onClose?.();
    document.addEventListener("keydown", onEsc);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    // focus close
    setTimeout(() => {
      const btn = document.getElementById("modal-close-btn");
      btn?.focus();
    }, 0);

    return () => {
      document.removeEventListener("keydown", onEsc);
      document.body.style.overflow = prevOverflow;
    };
  }, [show, onClose]);

  // ----- Carousel settings
  const mainSettings = useMemo(
    () => ({
      arrows: true,
      fade: true,
      dots: false,
      asNavFor: navThumb,
      swipe: true,
      adaptiveHeight: true,
    }),
    [navThumb]
  );

  const thumbSettings = useMemo(
    () => ({
      slidesToShow: 5,
      swipeToSlide: true,
      focusOnSelect: true,
      arrows: false,
      dots: false,
      asNavFor: navMain,
      responsive: [
        { breakpoint: 1200, settings: { slidesToShow: 5 } },
        { breakpoint: 992, settings: { slidesToShow: 4 } },
        { breakpoint: 768, settings: { slidesToShow: 4 } },
        { breakpoint: 576, settings: { slidesToShow: 3 } },
      ],
    }),
    [navMain]
  );

  // ----- Derivatives (tên, sku, giá...)
  const name = `${product?.productName || "Sản phẩm"}${activeVariant?.variantName ? ` - ${activeVariant.variantName}` : ""
    }`;

  const sku = activeVariant?.sku || product?.sku || `SKU-${product?.productId}`;

  const { basePrice, promoPrice, finalPrice } = useMemo(
    () => pickPricesFromVariant(activeVariant),
    [activeVariant]
  );
  const price = finalPrice; // Giá cuối cùng dùng để tính tổng & lưu guest_cart

  const categoryName = product?.category?.categoryName;
  const variantId = activeVariant?.variantId;
  const attrs = activeVariant?.attributes || {};

  const safeImages = useMemo(() => {
    const variantImages = (product?.variants || [])
      .map((v) => v?.imageUrl)
      .filter(Boolean);
    const currentImage = activeVariant?.imageUrl;
    const all = [...(currentImage ? [currentImage] : []), ...variantImages];
    return all.filter((v, i, arr) => arr.indexOf(v) === i);
  }, [product, activeVariant]);

  // ----- Handlers
  const handleVariantSelect = (v) => {
    setActiveVariant(v);
    setSelectedAttr(null);
  };

  const handleAttrClick = (key, value) => {
    const attrKey = `${key}:${value}`;
    setSelectedAttr((prev) => (prev === attrKey ? null : attrKey)); // chỉ 1 thuộc tính
  };

  const increase = () => setQuantity((n) => n + 1);
  const decrease = () => setQuantity((n) => (n > 1 ? n - 1 : 1));
  const onQtyInput = (e) => {
    const raw = e.target.value.replace(/[^\d]/g, "");
    const n = parseInt(raw || "1", 10);
    setQuantity(n > 0 ? n : 1);
  };

  const transformedProduct = useMemo(
    () => ({
      data: product,
      quantity,
      selected: false,
      variant: activeVariant,
      selectedAttr, // nếu cần truyền cho checkout
    }),
    [product, quantity, activeVariant, selectedAttr]
  );

  const addToCart = async (productId, quantity) => {
    try {
      const token = localStorage.getItem("Authorization") || null;

      // 1️⃣ Nếu có token → gọi API server
      if (token && token.trim()) {
        const decoded = jwtDecode(token);
        const userId = decoded.sub;

        const payload = {
          productId,
          quantity,
          variantId: activeVariant?.variantId ?? null,
          selectedAttr,
        };

        await axios.post(
          `${process.env.REACT_APP_API_URL}/cart/${userId}/items`,
          payload,
          { headers: { Authorization: token } }
        );

        alert("Đã thêm sản phẩm!");
        fetchCountCart();
        return;
      }

      // 2️⃣ Nếu KHÔNG có token → lưu giỏ hàng vào cookie (guest_cart)
      const currentCart = JSON.parse(Cookies.get("guest_cart") || "[]");

      // Lấy ảnh ưu tiên: ảnh variant -> ảnh product -> placeholder
      const primaryImage =
        activeVariant?.imageUrl ||
        product?.images?.[0]?.image_url ||
        safeImages[0] ||
        "/placeholder.png";

      const cartItem = {
        productId,
        productName: product?.productName || "Sản phẩm",
        imageUrl: primaryImage,
        variantId: activeVariant?.variantId ?? null,
        variantName: activeVariant?.variantName || "",
        attributes: activeVariant?.attributes || {},
        price: price, // 👈 dùng finalPrice (ưu tiên promo nếu có)
        quantity,
        selectedAttr,
      };


      const idx = currentCart.findIndex(
        (i) =>
          i.productId === cartItem.productId &&
          (i.variantId || null) === (cartItem.variantId || null) &&
          (i.selectedAttr || null) === (cartItem.selectedAttr || null)
      );

      if (idx !== -1) {
        currentCart[idx].quantity += quantity;
      } else {
        currentCart.push(cartItem);
      }

      Cookies.set("guest_cart", JSON.stringify(currentCart), { expires: 7 });

      addToCartContext(cartItem);
      setCartCount(currentCart.length);

      alert("Đã lưu sản phẩm vào giỏ hàng!");
    } catch (error) {
      console.error("❌ Lỗi thêm vào giỏ hàng:", error);
      alert("Không thể thêm vào giỏ hàng!");
    }
  };

  if (!show) return null;

  return (
    <div
      className="modal d-block"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      onClick={onClose}
      style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
    >
      <div
        className="modal-dialog modal-lg modal-dialog-centered"
        role="document"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-content border-0 shadow-lg">
          <div className="modal-header border-0">
            <button
              id="modal-close-btn"
              type="button"
              className="btn-close"
              onClick={onClose}
              aria-label="Đóng"
            />
          </div>

          <div className="modal-body pt-0">
            <div className="row g-4">
              {/* Gallery */}
              <div className="col-12 col-md-6">
                <div className="product-slider">
                  <Slider {...mainSettings} ref={setNavMain}>
                    {(safeImages.length ? safeImages : ["/placeholder.png"]).map(
                      (src, idx) => (
                        <div key={idx}>
                          <div className="ratio ratio-1x1">
                            <InnerImageZoom
                              src={src}
                              zoomSrc={src}
                              zoomType="hover"
                              zoomScale={1.5}
                              alt={`Ảnh ${idx + 1} – ${product?.productName || "Sản phẩm"
                                }${activeVariant?.variantName
                                  ? ` ${activeVariant.variantName}`
                                  : ""
                                }`}
                              className="w-100 h-100"
                              style={{ objectFit: "contain" }}
                            />
                          </div>
                        </div>
                      )
                    )}
                  </Slider>

                  {safeImages.length > 1 && (
                    <div className="mt-3">
                      <Slider {...thumbSettings} ref={setNavThumb}>
                        {safeImages.map((src, idx) => (
                          <div key={idx} className="px-1">
                            <div className="ratio ratio-1x1 border rounded">
                              <img
                                src={src}
                                alt={`Hình nhỏ ${idx + 1}`}
                                className="w-100 h-100"
                                style={{
                                  objectFit: "contain",
                                  cursor: "pointer",
                                }}
                              />
                            </div>
                          </div>
                        ))}
                      </Slider>
                    </div>
                  )}
                </div>
              </div>

              {/* Info */}
              <div className="col-12 col-md-6 d-flex flex-column">
                <div>
                  <h2 id="modal-title" className="h5 mb-1">
                    {name}
                  </h2>
                  <p className="text-muted mb-2">Mã sản phẩm: #{variantId}</p>

                  {/* Giá với base/promo */}
                  <h4 className="mb-3" aria-live="polite">
                    {promoPrice != null ? (
                      <>
                        <span className="text-muted text-decoration-line-through me-2">
                          {formatCurrency(
                            (basePrice ?? promoPrice) * quantity
                          )}
                        </span>
                        <span className="text-danger fw-bold">
                          {formatCurrency(promoPrice * quantity)}
                        </span>
                        <span className="badge bg-danger-subtle text-danger ms-2">
                          Giảm giá
                        </span>
                      </>
                    ) : (
                      <span className="text-danger fw-bold">
                        {formatCurrency((basePrice ?? price) * quantity)}
                      </span>
                    )}
                  </h4>

                  {/* Variants - radio buttons */}
                  <div className="mb-3">
                    <div className="fw-semibold mb-2">Chọn phiên bản</div>
                    <div
                      className="d-flex flex-wrap gap-2"
                      role="radiogroup"
                      aria-label="Chọn phiên bản"
                    >
                      {variants.map((v) => {
                        const checked =
                          activeVariant?.variantId === v.variantId;
                        const inputId = `variant-${v.variantId}`;
                        return (
                          <React.Fragment key={v.variantId}>
                            <input
                              type="radio"
                              className="btn-check"
                              name="variant"
                              id={inputId}
                              checked={checked}
                              onChange={() => handleVariantSelect(v)}
                            />
                            <label
                              htmlFor={inputId}
                              className={`btn btn-sm ${checked ? "btn-primary" : "btn-outline-secondary"
                                }`}
                              role="radio"
                              aria-checked={checked}
                              title={`Chọn ${v.variantName}`}
                            >
                              {v.variantName}
                            </label>
                          </React.Fragment>
                        );
                      })}
                    </div>
                  </div>

                  {/* Attributes */}
                  {activeVariant && (
                    <div className="border rounded p-3 bg-light-subtle">
                      <div className="fw-semibold mb-2">
                        Thuộc tính của {activeVariant.variantName}
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
                </div>

                {product?.shortDescription && (
                  <p className="text-body mt-3">{product.shortDescription}</p>
                )}

                <div className="mt-3 mt-md-auto">
                  <div className="d-flex flex-wrap align-items-center gap-2">
                    <div className="input-group" style={{ maxWidth: 140 }}>
                      <button
                        className="btn btn-outline-secondary"
                        onClick={decrease}
                        aria-label="Giảm số lượng"
                      >
                        −
                      </button>
                      <input
                        type="text"
                        inputMode="numeric"
                        className="form-control text-center"
                        value={quantity}
                        onChange={onQtyInput}
                        aria-label="Số lượng"
                      />
                      <button
                        className="btn btn-outline-secondary"
                        onClick={increase}
                        aria-label="Tăng số lượng"
                      >
                        +
                      </button>
                    </div>

                    <button
                      className="btn btn-danger px-4 d-flex align-items-center gap-2"
                      onClick={() => addToCart(product?.productId, quantity)}
                    >
                      <i className="bi bi-bag-plus"></i>
                      Thêm vào giỏ hàng
                    </button>
                  </div>

                  <div className="d-flex flex-wrap gap-3 mt-3 small text-muted">
                    {sku && (
                      <span className="badge bg-light text-secondary border">
                        SKU: {sku}
                      </span>
                    )}
                    {categoryName && <span>Danh mục: {categoryName}</span>}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="modal-footer border-0 pt-0">
            <button
              type="button"
              className="btn btn-light w-100 d-md-none"
              onClick={onClose}
            >
              Đóng
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
