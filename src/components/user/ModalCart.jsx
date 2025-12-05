import React, { useContext, useEffect, useMemo, useState } from "react";
import InnerImageZoom from "react-inner-image-zoom";
import Slider from "react-slick";
import axios from "axios";
import { CartContext } from "../../hooks/CartContext";
import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";
import { addToCartHelper } from "../../utils/addToCartHelper";
import { pickPricesFromVariant } from "../../utils/productBuyHelper";

// ------------------------ Helpers ------------------------
const fmtVND = (n) =>
  Number(n || 0).toLocaleString("vi-VN", {
    style: "currency",
    currency: "VND",
  });

// ===================================================================
//                            COMPONENT
// ===================================================================
export default function ModalBuy({ show, onClose, product }) {
  // ------------------------ Prepare Data ------------------------
  const variants = product?.variants ?? [];
  const defaultVariant = variants[0] ?? null;

  // ------------------------ State ------------------------
  const [activeVariant, setActiveVariant] = useState(defaultVariant);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [selectedAttr, setSelectedAttr] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [navMain, setNavMain] = useState(null);
  const [navThumb, setNavThumb] = useState(null);
  const [banners, setBanners] = useState([]);

  const { addToCartContext, setCartCount } = useContext(CartContext);

  // ------------------------ Load Banners ------------------------
  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_URL}/banners/13`)
      .then((res) => setBanners(res.data))
      .catch(() => { });
  }, []);

  // ------------------------ Modal UX Effects ------------------------
  useEffect(() => {
    if (!show) return; // only UX, safe

    const onEsc = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onEsc);

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    setTimeout(() => {
      document.getElementById("modal-close-btn")?.focus();
    }, 0);

    return () => {
      document.removeEventListener("keydown", onEsc);
      document.body.style.overflow = prevOverflow;
    };
  }, [show, onClose]);

  // ------------------------ Build Image List ------------------------
  const safeImages = useMemo(() => {
    const vImg = activeVariant?.imageUrl ?? activeVariant?.image ?? null;
    const vImgs = variants.map((v) => v.imageUrl ?? v.image).filter(Boolean);
    const pImgs = (product?.images || [])
      .map((img) => (typeof img === "string" ? img : img.imageUrl))
      .filter(Boolean);

    return [...new Set([vImg, ...vImgs, ...pImgs].filter(Boolean))];
  }, [product, activeVariant]);

  // ------------------------ Slider Settings ------------------------
  const mainSettings = useMemo(
    () => ({
      arrows: true,
      fade: true,
      swipe: true,
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
      dots: false,
      arrows: false,
      asNavFor: navMain,
    }),
    [navMain]
  );

  // ------------------------ Derived Data ------------------------
  const variant = selectedVariant ?? activeVariant ?? {};
  const attrs = variant.attributes ?? {};

  const name = `${product?.productName ?? "Sản phẩm"}${variant?.variantName ? ` - ${variant.variantName}` : ""
    }`;

  const sku = variant?.sku ?? product?.sku;
  const categoryName = product?.category?.categoryName;

  // Pricing
  const { basePrice, promoPrice, finalPrice } = pickPricesFromVariant(variant);

  const displayPrice =
    product?.price > 0
      ? product.price
      : promoPrice > 0
        ? promoPrice
        : basePrice > 0
          ? basePrice
          : finalPrice ?? 0;

  const hasPromo = promoPrice && basePrice > promoPrice;

  // ------------------------ Handlers ------------------------
  const handleVariantSelect = (v) => {
    setActiveVariant(v);
    setSelectedVariant(v);
    setSelectedAttr(null);
  };

  const handleAttrClick = (key, val) => {
    const attrKey = `${key}:${val}`;
    setSelectedAttr((prev) => (prev === attrKey ? null : attrKey));
  };

  const increase = () => setQuantity((n) => Math.min(999, n + 1));
  const decrease = () => setQuantity((n) => Math.max(1, n - 1));

  // ------------------------ Render ------------------------
  return show ? (
    <div
      className="modal d-block"
      onClick={onClose}
      style={{ background: "rgba(0,0,0,0.5)" }}
    >
      <div
        className="modal-dialog modal-lg modal-dialog-centered"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-content border-0 shadow-lg">
          {/* Header */}
          <div className="modal-header border-0">
            <button id="modal-close-btn" className="btn-close" onClick={onClose} />
          </div>

          <div className="modal-body pt-0">
            <div className="row g-4">
              {/* ---------------------- Gallery ---------------------- */}
              <div className="col-12 col-md-6">
                <Slider {...mainSettings} ref={setNavMain}>
                  {safeImages.map((src, idx) => (
                    <div key={idx}>
                      <div className="ratio ratio-1x1">
                        <InnerImageZoom
                          src={process.env.REACT_APP_API_URL + src}
                          zoomSrc={process.env.REACT_APP_API_URL + src}
                          zoomType="hover"
                          zoomScale={1.5}
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
                              alt=""
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

              {/* ---------------------- Info ---------------------- */}
              <div className="col-md-6 d-flex flex-column">
                <div className="bg-white p-3 rounded-4 shadow-sm position-relative">
                  {/* Title */}
                  <div className="d-flex justify-content-between align-items-start">
                    <h1 className="product-title fw-bold mb-1">{name}</h1>
                    <div className="stock-badge">
                      Còn {variant?.inventory?.stock_quantity}
                    </div>
                  </div>

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

                  {/* Variants */}
                  {variants.length > 0 && (
                    <div className="mb-3">
                      <div className="fw-semibold mb-2">Chọn phiên bản</div>

                      <div className="d-flex flex-wrap gap-2">
                        {variants.map((v) => {
                          const checked = v.variantId === variant.variantId;
                          return (
                            <React.Fragment key={v.variantId}>
                              <input
                                type="radio"
                                id={`variant-${v.variantId}`}
                                name="variant"
                                className="btn-check"
                                checked={checked}
                                onChange={() => handleVariantSelect(v)}
                              />
                              <label
                                htmlFor={`variant-${v.variantId}`}
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

                  {/* Quantity */}
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
                          setQuantity(
                            Math.max(1, Math.min(999, Number(e.target.value)))
                          )
                        }
                      />
                      <button className="btn btn-outline-secondary" onClick={increase}>
                        +
                      </button>
                    </div>

                    <button
                      className="btn btn-danger px-4"
                      onClick={() =>
                        addToCartHelper({
                          product,
                          variant: activeVariant,
                          quantity,
                          selectedAttr,
                          displayPrice,
                          setCartCount,
                          addToCartContext,
                        })
                      }
                    >
                      <i className="bi bi-bag-plus"></i> Thêm vào giỏ hàng
                    </button>
                  </div>
                </div>
              </div>

            </div>
          </div>

          <div className="modal-footer border-0 d-md-none">
            <button className="btn btn-light w-100" onClick={onClose}>
              Đóng
            </button>
          </div>
        </div>
      </div>
    </div>
  ) : null;
}
