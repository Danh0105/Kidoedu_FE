import React, { useContext, useEffect, useMemo, useState } from "react";
import InnerImageZoom from "react-inner-image-zoom";
import Slider from "react-slick";
import { NavLink } from "react-router-dom";
import { CartContext } from "../../hooks/CartContext";
import { makeCheckoutProduct } from "../../utils/productBuyHelper";

/* --------------------------- Helpers --------------------------- */

const fmtVND = (n) =>
  Number(n || 0).toLocaleString("vi-VN", {
    style: "currency",
    currency: "VND",
  });

/** Lấy giá từ variant (base/promo/final) */
function pickPricesFromVariant(variant) {
  if (!variant) return { basePrice: null, promoPrice: null, finalPrice: 0 };

  if (!Array.isArray(variant.prices)) {
    const cur = typeof variant.currentPrice === "number" ? variant.currentPrice : 0;
    return { basePrice: cur || null, promoPrice: null, finalPrice: cur || 0 };
  }

  let base = null;
  let promo = null;

  variant.prices.forEach((p) => {
    if (!p) return;
    if (p.priceType === "base" && (!base || new Date(p.startAt) > new Date(base.startAt)))
      base = p;
    if (p.priceType === "promo" && (!promo || new Date(p.startAt) > new Date(promo.startAt)))
      promo = p;
  });

  const basePrice = base ? Number(base.price) : null;
  const promoPrice = promo ? Number(promo.price) : null;
  return { basePrice, promoPrice, finalPrice: promoPrice ?? basePrice ?? 0 };
}
/* ------------------------- ModalBuy component ------------------------- */

export default function ModalBuy({ show, onClose, product }) {
  const { setSelectedProducts } = useContext(CartContext);

  // state
  const [quantity, setQuantity] = useState(1);
  const [activeVariant, setActiveVariant] = useState(null);
  const [selectedAttr, setSelectedAttr] = useState(null);
  const [navMain, setNavMain] = useState(null);
  const [navThumb, setNavThumb] = useState(null);

  const variants = product?.variants || [];

  // default variant
  useEffect(() => {
    if (!activeVariant && variants.length) setActiveVariant(variants[0]);
  }, [variants, activeVariant]);

  // lock scroll + esc
  useEffect(() => {
    if (!show) return;
    const onEsc = (e) => e.key === "Escape" && onClose?.();
    document.addEventListener("keydown", onEsc);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    // focus close button if exists
    setTimeout(() => document.getElementById("modal-close-btn")?.focus(), 0);

    return () => {
      document.removeEventListener("keydown", onEsc);
      document.body.style.overflow = prev;
    };
  }, [show, onClose]);

  // sliders settings
  const mainSettings = useMemo(
    () => ({ arrows: true, fade: true, dots: false, asNavFor: navThumb, adaptiveHeight: true }),
    [navThumb]
  );
  const thumbSettings = useMemo(
    () => ({
      slidesToShow: 5,
      swipeToSlide: true,
      focusOnSelect: true,
      arrows: false,
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

  // derived
  const name = `${product?.productName || "Sản phẩm"}${activeVariant?.variantName ? ` - ${activeVariant.variantName}` : ""}`;
  const sku = activeVariant?.sku || product?.sku || `SKU-${product?.productId}`;
  const attrs = activeVariant?.attributes || {};
  const variantId = activeVariant?.variantId ?? product?.productId;

  const { basePrice, promoPrice, finalPrice } = useMemo(() => pickPricesFromVariant(activeVariant), [activeVariant]);
  const hasPromo = promoPrice != null && (basePrice ?? promoPrice) > promoPrice;

  // safe images - ưu tiên variant -> product.images
  const safeImages = useMemo(() => {
    const vImg = activeVariant?.imageUrl ?? activeVariant?.image ?? null;
    const vImgs = (product?.variants || []).map((v) => v?.imageUrl ?? v?.image ?? null).filter(Boolean);
    const pImgs = (product?.images || [])
      .map((img) => {
        if (!img) return null;
        if (typeof img === "string") return img;
        return img.imageUrl ?? null;
      })
      .filter(Boolean);

    const all = [...(vImg ? [vImg] : []), ...vImgs, ...pImgs];
    return all.filter((x, i, arr) => x && arr.indexOf(x) === i);
  }, [product, activeVariant]);

  // quantity handlers
  const increase = () => setQuantity((n) => Math.min(999, n + 1));
  const decrease = () => setQuantity((n) => Math.max(1, n - 1));
  const onQtyInput = (e) => {
    const raw = String(e.target.value).replace(/[^\d]/g, "");
    const n = parseInt(raw || "1", 10);
    setQuantity(Number.isFinite(n) && n > 0 ? Math.min(999, n) : 1);
  };

  const handleVariantSelect = (v) => {
    setActiveVariant(v);
    setSelectedAttr(null);
  };

  const handleAttrClick = (key, value) => {
    const k = `${key}:${value}`;
    setSelectedAttr((prev) => (prev === k ? null : k));
  };

  // chuẩn hoá object chuyển sang checkout
  const transformedProduct = useMemo(
    () => makeCheckoutProduct({ product, variant: activeVariant, quantity, selectedAttr }),
    [product, activeVariant, quantity, selectedAttr]
  );

  const onBuyNow = () => {
    setSelectedProducts([transformedProduct]);
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
      <div className="modal-dialog modal-lg modal-dialog-centered" role="document" onClick={(e) => e.stopPropagation()}>
        <div className="modal-content border-0 shadow-lg">
          <div className="modal-header border-0">
            <button id="modal-close-btn" type="button" className="btn-close" onClick={onClose} aria-label="Đóng" />
          </div>

          <div className="modal-body pt-0">
            <div className="row g-4">
              {/* Gallery */}
              <div className="col-12 col-md-6">
                <Slider {...mainSettings} ref={setNavMain}>
                  {(safeImages.length ? safeImages : ["/placeholder.png"]).map((src, idx) => (
                    <div key={idx}>
                      <div className="ratio ratio-1x1">
                        <InnerImageZoom
                          src={process.env.REACT_APP_API_URL + src}
                          zoomSrc={process.env.REACT_APP_API_URL + src}
                          zoomType="hover"
                          zoomScale={1.5}
                          alt={`${product?.productName || "Sản phẩm"} ${activeVariant?.variantName || ""}`}
                          className="w-100 h-100"
                          style={{ objectFit: "contain" }}
                        />
                      </div>
                    </div>
                  ))}
                </Slider>

                {safeImages.length > 1 && (
                  <div className="mt-3">
                    <Slider {...thumbSettings} ref={setNavThumb}>
                      {safeImages.map((src, idx) => (
                        <div key={idx} className="px-1">
                          <div className="ratio ratio-1x1 border rounded">
                            <img
                              src={process.env.REACT_APP_API_URL + src}
                              alt={`Hình ${idx + 1}`}
                              className="w-100 h-100"
                              style={{ objectFit: "contain", cursor: "pointer" }}
                            />
                          </div>
                        </div>
                      ))}
                    </Slider>
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="col-12 col-md-6 d-flex flex-column">
                <div>
                  <h2 id="modal-title" className="h5 mb-1">{name}</h2>
                  <p className="text-muted mb-2">Mã: #{variantId}</p>

                  {/* Price */}
                  <div className="d-flex align-items-baseline gap-2 mb-3 flex-wrap">
                    {hasPromo && promoPrice != null ? (
                      <>
                        <h4 className="text-danger fw-bold mb-0" aria-live="polite">{fmtVND(promoPrice * quantity)}</h4>
                        {basePrice && basePrice > promoPrice && <span className="text-muted text-decoration-line-through">{fmtVND(basePrice * quantity)}</span>}
                        <span className="badge bg-danger-subtle text-danger ms-1">Giảm giá</span>
                      </>
                    ) : (
                      <h4 className="text-danger fw-bold mb-0" aria-live="polite">{fmtVND((product?.price ?? finalPrice) * quantity)}</h4>
                    )}
                  </div>

                  {/* Variants */}
                  {variants.length > 0 && (
                    <div className="mb-3">
                      <div className="fw-semibold mb-2">Chọn phiên bản</div>
                      <div className="d-flex flex-wrap gap-2" role="radiogroup" aria-label="Chọn phiên bản">
                        {variants.map((v) => {
                          const checked = activeVariant?.variantId === v.variantId;
                          const id = `variant-${v.variantId}`;
                          return (
                            <React.Fragment key={v.variantId}>
                              <input type="radio" className="btn-check" name="variant" id={id} checked={checked} onChange={() => handleVariantSelect(v)} />
                              <label htmlFor={id} className={`btn btn-sm ${checked ? "btn-primary" : "btn-outline-secondary"}`} role="radio" aria-checked={checked}>
                                {v.variantName}
                              </label>
                            </React.Fragment>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Attributes */}
                  {activeVariant && (
                    <div className="border rounded p-3 bg-light-subtle mb-3">
                      <div className="fw-semibold mb-2">Thuộc tính của {activeVariant.variantName}</div>
                      {Object.keys(attrs).length ? (
                        <div className="d-flex flex-wrap gap-2" role="radiogroup" aria-label="Chọn thuộc tính">
                          {Object.entries(attrs).flatMap(([key, value]) => {
                            const list = Array.isArray(value) ? value : [value];
                            return list.map((val, i) => {
                              const attrKey = `${key}:${val}`;
                              const checked = selectedAttr === attrKey;
                              const id = `attr-${key}-${i}`;
                              return (
                                <React.Fragment key={id}>
                                  <input type="radio" className="btn-check" name="attr-radio" id={id} checked={checked} onChange={() => handleAttrClick(key, val)} />
                                  <label htmlFor={id} className={`btn btn-sm rounded-pill ${checked ? "btn-danger" : "btn-outline-secondary"}`} role="radio" aria-checked={checked}>
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

                {/* Description */}
                <div className="feature-list-wrapper mb-3">
                  <div dangerouslySetInnerHTML={{ __html: product?.shortDescription ?? "" }} />
                </div>

                {/* Quantity + CTA */}
                <div className="mt-3 mt-md-auto">
                  <div className="d-flex flex-wrap align-items-center gap-2">
                    <div className="input-group" style={{ maxWidth: 140 }}>
                      <button className="btn btn-outline-secondary" onClick={decrease} aria-label="Giảm số lượng">−</button>
                      <input type="text" inputMode="numeric" className="form-control text-center" value={quantity} onChange={onQtyInput} aria-label="Số lượng" />
                      <button className="btn btn-outline-secondary" onClick={increase} aria-label="Tăng số lượng">+</button>
                    </div>

                    <NavLink to="/checkout" className="btn btn-primary flex-grow-1" onClick={onBuyNow}>
                      Mua ngay
                    </NavLink>
                  </div>

                  <div className="d-flex flex-wrap gap-3 mt-3 small text-muted">
                    <span className="badge bg-light text-secondary border">SKU: {sku}</span>
                    {product?.category?.categoryName && <span>Danh mục: {product.category.categoryName}</span>}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="modal-footer border-0 pt-0">
            <button type="button" className="btn btn-light w-100 d-md-none" onClick={onClose}>Đóng</button>
          </div>
        </div>
      </div>
    </div>
  );
}
