import React, { useContext, useEffect, useMemo, useState } from "react";
import Slider from "react-slick";
import { NavLink } from "react-router-dom";
import { CartContext } from "../../hooks/CartContext";
import { makeCheckoutProduct } from "../../utils/productBuyHelper";
import "../../components/user/css/ModalBuy.css";
/* --------------------------- Helpers --------------------------- */

const fmtVND = (n) =>
  Number(n || 0).toLocaleString("vi-VN", {
    style: "currency",
    currency: "VND",
  });

function pickPricesFromVariant(variant) {
  if (!variant) return { basePrice: null, promoPrice: null, finalPrice: 0 };

  // trường hợp basic (không có mảng prices)
  if (!Array.isArray(variant.prices)) {
    const cur = typeof variant.currentPrice === "number" ? variant.currentPrice : 0;
    return { basePrice: cur || null, promoPrice: null, finalPrice: cur || 0 };
  }

  let base = null;
  let promo = null;

  for (const p of variant.prices) {
    if (!p) continue;
    if (p.priceType === "base" && (!base || new Date(p.startAt) > new Date(base.startAt))) base = p;
    if (p.priceType === "promo" && (!promo || new Date(p.startAt) > new Date(promo.startAt))) promo = p;
  }

  const basePrice = base ? Number(base.price) : null;
  const promoPrice = promo ? Number(promo.price) : null;

  return {
    basePrice,
    promoPrice,
    finalPrice: promoPrice ?? basePrice ?? 0,
  };
}

/* ------------------------- ModalBuy component ------------------------- */

export default function ModalBuy({ show, onClose, product }) {
  const { setSelectedProducts } = useContext(CartContext);

  /* ------------------------ State ------------------------ */
  const variants = product?.variants || [];
  const [activeVariant, setActiveVariant] = useState(variants[0] || null);
  const [selectedAttr, setSelectedAttr] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [navMain, setNavMain] = useState(null);
  const [navThumb, setNavThumb] = useState(null);

  /* ------------------------ Effects ------------------------ */

  // Gán variant mặc định
  useEffect(() => {
    if (!activeVariant && variants.length) {
      setActiveVariant(variants[0]);
    }
  }, [variants, activeVariant]);

  // Lock scroll & ESC close
  useEffect(() => {
    if (!show) return;

    const onEsc = (e) => e.key === "Escape" && onClose?.();
    document.addEventListener("keydown", onEsc);

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    setTimeout(() => document.getElementById("modal-close-btn")?.focus(), 0);

    return () => {
      document.removeEventListener("keydown", onEsc);
      document.body.style.overflow = prevOverflow;
    };
  }, [show, onClose]);

  /* ------------------------ Derived Values ------------------------ */

  const { basePrice, promoPrice, finalPrice } = useMemo(
    () => pickPricesFromVariant(activeVariant),
    [activeVariant]
  );

  const hasPromo = promoPrice != null && (basePrice ?? promoPrice) > promoPrice;

  const name = `${(product?.productName ?? "Sản phẩm")}${activeVariant?.variantName ? ` - ${activeVariant.variantName}` : ""}`;
  const sku = activeVariant?.sku ?? product?.sku ?? `SKU-${product?.productId}`;
  const categoryName = product?.category?.categoryName;

  const variant = activeVariant ?? {};
  // Ảnh sản phẩm
  const safeImages = useMemo(() => {
    const vImg = activeVariant?.imageUrl ?? activeVariant?.image ?? null;
    const vImgs = variants.map((v) => v?.imageUrl ?? v?.image).filter(Boolean);
    const pImgs = (product?.images || [])
      .map((img) => (typeof img === "string" ? img : img?.imageUrl))
      .filter(Boolean);

    return [...new Set([vImg, ...vImgs, ...pImgs].filter(Boolean))];
  }, [product, activeVariant]);

  /* ------------------------ Slider Config ------------------------ */

  const mainSettings = useMemo(
    () => ({
      arrows: true,
      fade: true,
      dots: false,
      adaptiveHeight: true,
      asNavFor: navThumb,
    }),
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

  /* ------------------------ Quantity ------------------------ */

  const increase = () => setQuantity((n) => Math.min(999, n + 1));
  const decrease = () => setQuantity((n) => Math.max(1, n - 1));

  const onQtyInput = (e) => {
    const raw = e.target.value.replace(/\D/g, "");
    const n = parseInt(raw || "1", 10);
    setQuantity(isFinite(n) ? Math.max(1, Math.min(999, n)) : 1);
  };

  /* ------------------------ Variant & Attributes ------------------------ */

  const selectVariant = (v) => {
    setActiveVariant(v);
    setSelectedAttr(null);
  };

  const toggleAttr = (key, val) => {
    const k = `${key}:${val}`;
    setSelectedAttr((prev) => (prev === k ? null : k));
  };

  /* ------------------------ Checkout ------------------------ */

  const checkoutProduct = useMemo(
    () => makeCheckoutProduct({ product, variant: activeVariant, quantity, selectedAttr }),
    [product, activeVariant, quantity, selectedAttr]
  );

  const onBuyNow = () => setSelectedProducts([checkoutProduct]);

  /* ------------------------ Render ------------------------ */

  if (!show) return null;

  return (
    <div
      className="modal d-block"
      onClick={onClose}
      style={{ background: "rgba(0,0,0,0.5)" }}
    >
      <div className="modal-dialog modal-lg modal-dialog-centered" onClick={(e) => e.stopPropagation()}>
        <div className="modal-content border-0 shadow-lg">

          {/* Header */}
          <div className="modal-header border-0">
            <button id="modal-close-btn" className="btn-close" onClick={onClose} />
          </div>

          {/* Body */}
          <div className="modal-body pt-0">
            {/* Title */}
            <div className="d-flex justify-content-between align-items-start">
              <h1 className="product-title fw-bold mb-1">{name}</h1>
              <div className="stock-badge">
                Còn {variant?.inventory?.stock_quantity}
              </div>
            </div>
            <div className="row g-4">
              <div className="col-12 col-md-6 d-flex flex-column">
                {/* ====================== GALLERY ====================== */}
                <div className="dmx-gallery-buy position-relative">

                  {/* SLIDER ẢNH LỚN */}
                  <Slider {...mainSettings} asNavFor={navThumb} ref={setNavMain}>
                    {safeImages.map((src, i) => (
                      <div key={i} className="dmx-image-container">
                        <img
                          src={process.env.REACT_APP_API_URL + src}
                          alt={`Ảnh sản phẩm ${i + 1}`}
                          className="dmx-main-image"
                          onError={(e) => (e.currentTarget.src = "/placeholder-800x800.png")}
                        />
                      </div>
                    ))}
                  </Slider>

                  {/* NÚT NEXT/PREV */}
                  <button className="dmx-prev" onClick={() => navMain?.slickPrev()}>
                    <i className="bi bi-chevron-left"></i>
                  </button>

                  <button className="dmx-next" onClick={() => navMain?.slickNext()}>
                    <i className="bi bi-chevron-right"></i>
                  </button>
                </div>

                {/* THUMBNAIL NHỎ DƯỚI */}
                <div className="dmx-thumb-wrapper mt-3">
                  <Slider {...thumbSettings} asNavFor={navMain} ref={setNavThumb}>
                    {safeImages.map((src, i) => (
                      <div key={i} className="dmx-thumb-item">
                        <img
                          src={process.env.REACT_APP_API_URL + src}
                          alt={`Thumb ${i + 1}`}
                          className="dmx-thumb-img"
                          onError={(e) => (e.currentTarget.src = "/placeholder-800x800.png")}
                        />
                      </div>
                    ))}
                  </Slider>
                </div>
              </div>

              {/* ---------------- INFO ---------------- */}
              <div className="col-12 col-md-6 d-flex flex-column">
                {/* SKU / Category */}
                <div className="d-flex flex-wrap gap-2 mb-3 small text-muted">
                  <span className="badge bg-dark border">Mã: #{product?.productId}</span>
                  <span className="badge bg-danger border">SKU: {sku}</span>
                  {categoryName && (
                    <span className="badge bg-primary-subtle border text-primary">
                      {categoryName}
                    </span>
                  )}
                </div>
                {/* PRICE */}
                <div className="d-flex align-items-baseline gap-2 mb-3">
                  {hasPromo ? (
                    <>
                      <h4 className="text-danger fw-bold mb-0">{fmtVND(promoPrice * quantity)}</h4>
                      <span className="text-muted text-decoration-line-through">{fmtVND(basePrice * quantity)}</span>
                      <span className="badge bg-danger-subtle text-danger">Giảm giá</span>
                    </>
                  ) : (
                    <h4 className="text-danger fw-bold mb-0">{fmtVND(finalPrice * quantity)}</h4>
                  )}
                </div>

                {/* VARIANTS */}
                {variants.length > 0 && (
                  <div className="mb-3">
                    <div className="fw-semibold mb-2">Chọn phiên bản</div>
                    <div className="d-flex flex-wrap gap-2">
                      {variants.map((v) => {
                        const checked = v.variantId === activeVariant?.variantId;
                        return (
                          <React.Fragment key={v.variantId}>
                            <input
                              type="radio"
                              id={`variant-${v.variantId}`}
                              name="variant"
                              checked={checked}
                              className="btn-check"
                              onChange={() => selectVariant(v)}
                            />
                            <label
                              htmlFor={`variant-${v.variantId}`}
                              className={`btn btn-sm ${checked ? "btn-primary" : "btn-outline-secondary"}`}
                            >
                              {v.variantName}
                            </label>
                          </React.Fragment>
                        );
                      })}
                    </div>
                  </div>
                )}


                {/* DESCRIPTION */}
                <div className="mb-3">
                  <div dangerouslySetInnerHTML={{ __html: product?.shortDescription ?? "" }} />
                </div>

                {/* QUANTITY + BUY NOW */}
                <div className="mt-auto">
                  <div className="d-flex gap-2">
                    <div className="input-group" style={{ maxWidth: 150 }}>
                      <button className="btn btn-outline-secondary" onClick={decrease}>−</button>
                      <input
                        type="text"
                        className="form-control text-center"
                        value={quantity}
                        onChange={onQtyInput}
                      />
                      <button className="btn btn-outline-secondary" onClick={increase}>+</button>
                    </div>

                    <NavLink to="/checkout" className="btn btn-primary flex-grow-1" onClick={onBuyNow}>
                      Mua ngay
                    </NavLink>
                  </div>


                </div>
              </div>

            </div>
          </div>

          {/* Footer mobile */}
          <div className="modal-footer border-0 d-md-none">
            <button className="btn btn-light w-100" onClick={onClose}>Đóng</button>
          </div>

        </div>
      </div>
    </div>
  );
}
