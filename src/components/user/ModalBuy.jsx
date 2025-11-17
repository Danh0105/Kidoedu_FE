import React, { useContext, useEffect, useMemo, useState } from "react";
import InnerImageZoom from "react-inner-image-zoom";
import Slider from "react-slick";
import { NavLink } from "react-router-dom";
import { CartContext } from "../../hooks/CartContext";

const fmtVND = (n) =>
  Number(n || 0).toLocaleString("vi-VN", {
    style: "currency",
    currency: "VND",
  });

/** Helper: lấy basePrice/promoPrice/finalPrice từ 1 variant (giống ProductInfoPanel) */
function pickPricesFromVariant(variant) {
  if (!variant) {
    return {
      basePrice: null,
      promoPrice: null,
      finalPrice: 0,
    };
  }

  // Không có mảng prices → fallback currentPrice
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
      if (
        !promoRecord ||
        new Date(p.startAt) > new Date(promoRecord.startAt)
      ) {
        promoRecord = p;
      }
    }
  });

  const basePrice = baseRecord ? Number(baseRecord.price) : null;
  const promoPrice = promoRecord ? Number(promoRecord.price) : null;
  const finalPrice = promoPrice ?? basePrice ?? 0;

  return { basePrice, promoPrice, finalPrice };
}

export default function ModalBuy({ show, onClose, product }) {
  const { setSelectedProducts } = useContext(CartContext);

  // ----- State
  const [navMain, setNavMain] = useState(null);
  const [navThumb, setNavThumb] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const variants = product?.variants || [];
  const [activeVariant, setActiveVariant] = useState(null);
  const [selectedAttr, setSelectedAttr] = useState(null);

  // ----- Select default variant
  useEffect(() => {
    if (variants.length && !activeVariant) setActiveVariant(variants[0]);
  }, [variants, activeVariant]);

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

  // ----- Derivatives
  const name = `${product?.productName || "Sản phẩm"}${activeVariant?.variantName ? ` - ${activeVariant.variantName}` : ""
    }`;

  const sku = activeVariant?.sku || product?.sku || `SKU-${product?.productId}`;
  const categoryName = product?.category?.categoryName;
  const variantId = activeVariant?.variantId;
  const attrs = activeVariant?.attributes || {};

  // 💰 Tính giá base/promo/final từ variant
  const { basePrice, promoPrice, finalPrice } = useMemo(
    () => pickPricesFromVariant(activeVariant),
    [activeVariant]
  );
  const hasPromo =
    promoPrice != null && (basePrice ?? promoPrice) > promoPrice;

  // Ảnh an toàn
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

  // Mang sang trang Checkout
  const transformedProduct = useMemo(
    () => ({
      data: product,
      quantity,
      selected: false,
      variant: activeVariant,
      selectedAttr, // nếu cần truyền cho checkout
      pricing: finalPrice,
    }),
    [product, quantity, activeVariant, selectedAttr, basePrice, promoPrice, finalPrice]
  );

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

                  {/* 💰 Giá + khuyến mãi */}
                  <div className="d-flex align-items-baseline gap-2 mb-3 flex-wrap">
                    {hasPromo && promoPrice != null ? (
                      <>
                        <h4
                          className="text-danger fw-bold mb-0"
                          aria-live="polite"
                        >
                          {fmtVND(promoPrice * quantity)}
                        </h4>
                        {basePrice && basePrice > promoPrice && (
                          <span className="text-muted text-decoration-line-through">
                            {fmtVND(basePrice * quantity)}
                          </span>
                        )}
                        <span className="badge bg-danger-subtle text-danger ms-1">
                          Giảm giá
                        </span>
                      </>
                    ) : (
                      <h4
                        className="text-danger fw-bold mb-0"
                        aria-live="polite"
                      >
                        {fmtVND(finalPrice * quantity)}
                      </h4>
                    )}
                  </div>

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
                              className={`btn btn-sm ${checked
                                ? "btn-primary"
                                : "btn-outline-secondary"
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

                  {/* Attributes - radio (chỉ chọn 1 thuộc tính tổng) */}
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
                            const values = Array.isArray(value)
                              ? value
                              : [value];
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
                                    onChange={() =>
                                      handleAttrClick(key, val)
                                    }
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
                        <small className="text-muted">
                          Không có thuộc tính.
                        </small>
                      )}
                    </div>
                  )}
                </div>

                {product?.shortDescription && (
                  <p className="text-body mt-3">
                    {product.shortDescription}
                  </p>
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

                    <NavLink
                      to="/checkout"
                      className="btn btn-primary flex-grow-1"
                      onClick={() =>
                        setSelectedProducts([transformedProduct])
                      }
                    >
                      Mua ngay
                    </NavLink>
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
