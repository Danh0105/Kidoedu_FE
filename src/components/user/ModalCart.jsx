import React, { useContext, useEffect, useMemo, useState } from "react";
import InnerImageZoom from "react-inner-image-zoom";
import Slider from "react-slick";
import axios from "axios";
import { CartContext } from "../../hooks/CartContext";
import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";

// ------------------------ Helpers ------------------------
const formatCurrency = (value) =>
  new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(Number(value || 0));

function pickPricesFromVariant(variant) {
  if (!variant) {
    return { basePrice: null, promoPrice: null, finalPrice: 0 };
  }

  // Không có price list → fallback currentPrice
  if (!Array.isArray(variant?.prices)) {
    const price = Number(variant.currentPrice || 0);
    return {
      basePrice: price,
      promoPrice: null,
      finalPrice: price,
    };
  }

  // Lấy giá từ mảng
  const promo = variant?.prices.find((p) => p.priceType === "promo");
  const base = variant?.prices.find((p) => p.priceType === "base");

  const basePrice = base ? Number(base.price) : null;
  const promoPrice = promo ? Number(promo.price) : null;
  const finalPrice = promoPrice ?? basePrice ?? 0;

  return { basePrice, promoPrice, finalPrice };
}

// ===================================================================
//                            COMPONENT
// ===================================================================
export default function ModalBuy({ show, onClose, product }) {
  const variants = product?.variants || [];

  // ------------------------ State ------------------------
  const [activeVariant, setActiveVariant] = useState(null);
  const [selectedAttr, setSelectedAttr] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [navMain, setNavMain] = useState(null);
  const [navThumb, setNavThumb] = useState(null);

  const { addToCartContext, setCartCount } = useContext(CartContext);

  // ------------------------ Init default variant ------------------------
  useEffect(() => {
    if (variants.length && !activeVariant) {
      setActiveVariant(variants[0]);
    }
  }, [variants, activeVariant]);

  // ------------------------ Load Cart Count ------------------------
  const fetchCountCart = async () => {
    const token = localStorage.getItem("Authorization");
    if (!token) return;

    const decoded = jwtDecode(token);
    const resCart = await axios.get(
      `${process.env.REACT_APP_API_URL}/cart/${decoded.sub}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setCartCount(resCart.data.items.length || 0);
  };

  // ------------------------ Modal UX ------------------------
  useEffect(() => {
    if (!show) return;

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

  // ------------------------ Build Image List (Có giữ ảnh gốc) ------------------------
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

  // ------------------------ Slider settings ------------------------
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

  // ------------------------ Data helpers ------------------------
  const name = `${product?.productName || "Sản phẩm"}${activeVariant?.variantName ? ` - ${activeVariant.variantName}` : ""
    }`;

  const sku = activeVariant?.sku || product?.sku;
  const categoryName = product?.category?.categoryName;
  const variantId = activeVariant?.variantId;
  const attrs = activeVariant?.attributes || {};

  const { basePrice, promoPrice, finalPrice } = useMemo(
    () => pickPricesFromVariant(activeVariant),
    [activeVariant]
  );

  // ------------------------ Handlers ------------------------
  const handleVariantSelect = (v) => {
    setActiveVariant(v);
    setSelectedAttr(null);
  };

  const handleAttrClick = (key, val) => {
    const k = `${key}:${val}`;
    setSelectedAttr((prev) => (prev === k ? null : k));
  };

  const handleQty = (e) => {
    const raw = e.target.value.replace(/[^\d]/g, "");
    setQuantity(Math.max(parseInt(raw || "1", 10), 1));
  };

  // ------------------------ Add to Cart ------------------------
  const addToCart = async (productId, qty) => {
    try {
      const token = localStorage.getItem("Authorization");

      // Logged user
      if (token) {
        const decoded = jwtDecode(token);
        await axios.post(
          `${process.env.REACT_APP_API_URL}/cart/${decoded.sub}/items`,
          {
            productId,
            quantity: qty,
            variantId,
            selectedAttr,
          },
          { headers: { Authorization: token } }
        );

        alert("Đã thêm sản phẩm!");
        fetchCountCart();
        return;
      }

      const promo = activeVariant?.prices.find((p) => p.priceType === "promo");
      const base = activeVariant?.prices.find((p) => p.priceType === "base");

      const basePrice = base ? Number(base.price) : null;
      const promoPrice = promo ? Number(promo.price) : null;
      const finalPrice = promoPrice ?? basePrice ?? product.price;


      // Guest cart
      const current = JSON.parse(Cookies.get("guest_cart") || "[]");
      const img =
        activeVariant?.imageUrl ||
        product?.images?.find(img => img.isPrimary)?.imageUrl;

      const item = {
        productId,
        productName: product.productName,
        imageUrl: img,
        variantId,
        variantName: activeVariant?.variantName,
        attributes: attrs,
        price: finalPrice,
        quantity: qty,
        selectedAttr,
      };

      const idx = current.findIndex(
        (i) =>
          i.productId === item.productId &&
          i.variantId === item.variantId &&
          i.selectedAttr === item.selectedAttr
      );

      if (idx !== -1) current[idx].quantity += qty;
      else current.push(item);
      console.log("current", finalPrice);

      Cookies.set("guest_cart", JSON.stringify(current), { expires: 7 });
      addToCartContext(item);
      setCartCount(current.length);

      alert("Đã lưu sản phẩm vào giỏ hàng!");
    } catch (error) {
      console.error(error);
      alert("Không thể thêm vào giỏ hàng!");
    }
  };

  // ------------------------ Render ------------------------
  if (!show) return null;

  return (
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
          <div className="modal-header border-0">
            <button
              id="modal-close-btn"
              className="btn-close"
              onClick={onClose}
            />
          </div>

          <div className="modal-body pt-0">
            <div className="row g-4">
              {/* ---------------------- Gallery ---------------------- */}
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

              {/* ---------------------- Info ---------------------- */}
              <div className="col-md-6 d-flex flex-column">
                <h2 className="h5">{name}</h2>
                <p className="text-muted">Mã sản phẩm: #{variantId ?? product.productId}</p>

                {/* Price */}
                <h4 className="mb-3">
                  {promoPrice ? (
                    <>
                      <span className="text-muted text-decoration-line-through me-2">
                        {formatCurrency((basePrice ?? promoPrice) * quantity)}
                      </span>
                      <span className="text-danger fw-bold">
                        {formatCurrency(promoPrice * quantity)}
                      </span>
                    </>
                  ) : (
                    <span className="text-danger fw-bold">
                      {formatCurrency((product.price ?? finalPrice) * quantity)}
                    </span>
                  )}
                </h4>

                {/* Variants */}
                <div className="mb-3">
                  {variants.length > 0 ? (
                    <>
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
                    </>
                  ) : (
                    <></>
                  )}
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
                {product?.shortDescription && (
                  <p className="text-body mt-3">
                    {product.shortDescription}
                  </p>
                )}

                {/* Quantity + Add to Cart */}
                <div className="mt-4 d-flex gap-2 align-items-center">
                  <div className="input-group" style={{ maxWidth: 140 }}>
                    <button
                      className="btn btn-outline-secondary"
                      onClick={() => setQuantity((n) => Math.max(1, n - 1))}
                    >
                      −
                    </button>
                    <input
                      className="form-control text-center"
                      value={quantity}
                      onChange={handleQty}
                    />
                    <button
                      className="btn btn-outline-secondary"
                      onClick={() => setQuantity((n) => n + 1)}
                    >
                      +
                    </button>
                  </div>

                  <button
                    className="btn btn-danger px-4"
                    onClick={() => addToCart(product.productId, quantity)}
                  >
                    <i className="bi bi-bag-plus"></i> Thêm vào giỏ hàng
                  </button>
                </div>

                {/* Extra info */}
                <div className="d-flex gap-3 mt-3 small text-muted">
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

          <div className="modal-footer border-0 d-md-none">
            <button
              className="btn btn-light w-100"
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
