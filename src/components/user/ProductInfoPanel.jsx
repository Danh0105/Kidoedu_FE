import React, { useContext, useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { CartContext } from "../../hooks/CartContext";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import "../user/css/ProductInfoPanel.css"
import { addToCartHelper } from "../../utils/addToCartHelper";

import {
  pickPricesFromVariant,
  makeCheckoutProduct,
} from "../../utils/productBuyHelper";
import { buildDisplayPrice } from "../../utils/priceDisplayHelper";

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

  const { setCartCount, setSelectedProducts, addToCartContext } =
    useContext(CartContext);

  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [activeVariant, setActiveVariant] = useState(null);
  const variants = product?.variants || [];

  /* ----------------------- Load default variant ----------------------- */
  useEffect(() => {
    if (variants.length && !activeVariant) {
      setActiveVariant(variants[0]);
    }
  }, [variants, activeVariant]);
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
  const [banners, setBanners] = useState([]);
  // Stable axios instance
  const loadBanners = async () => {
    const res = await axios.get(`${process.env.REACT_APP_API_URL}/banners/13`);
    setBanners(res.data);
  };

  useEffect(() => {
    loadBanners();
  }, []);
  /* --------------------------- Derived Values -------------------------- */

  const active = selectedVariant || {};
  const attrs = active.attributes || {};

  const { basePrice, promoPrice } = pickPricesFromVariant(active);


  const {
    unitPrice,
    totalPrice,
    hasPromo,
    discountPercent,
  } = buildDisplayPrice({
    basePrice,
    promoPrice,
    quantity,
  });



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
    onVariantChange?.(v);
  };


  const increase = () => setQuantity((n) => Math.min(999, n + 1));
  const decrease = () => setQuantity((n) => Math.max(1, n - 1));

  /* =======================================================================
   *                       FETCH CART COUNT
   * ======================================================================= */
  const fetchCountCart = async () => {
    const token = localStorage.getItem("Authorization");
    if (!token?.trim()) return;

    let userId = null;
    try {
      userId = jwtDecode(token).sub;
    } catch {
      return;
    }

    const res = await axios.get(
      `${process.env.REACT_APP_API_URL}/cart/${userId}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    setCartCount(res.data.items.length || 0);
  };


  /* ===================================================================
  *                     ADD TO CART — BẢN ĐƠN GIẢN & CHUẨN
  * =================================================================== */

  /* ---------------------- Checkout Submit ---------------------- */
  const submitCheckout = () => {
    const checkoutItem = makeCheckoutProduct({
      product,
      variant: active,
      quantity,
    });
    setSelectedProducts([checkoutItem]);
  };

  if (!product)
    return (
      <div className="text-center text-secondary py-5">
        <div className="spinner-border text-primary mb-2"></div>
        Đang tải thông tin sản phẩm...
      </div>
    );
  const currentUrl = window.location.href;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(currentUrl);
      alert("Đã sao chép link sản phẩm!");
    } catch {
      alert("Không thể sao chép link.");
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product?.productName,
          text: product?.shortDescription?.replace(/<[^>]+>/g, ""),
          url: currentUrl,
        });
      } catch (err) {
        console.log("Share cancelled");
      }
    } else {
      alert("Trình duyệt không hỗ trợ chia sẻ trực tiếp.");
    }
  };

  const buildShareUrl = (source) => {
    const url = new URL(window.location.href);
    url.searchParams.set("utm_source", source);
    url.searchParams.set("utm_medium", "social");
    url.searchParams.set("utm_campaign", "product_share");
    return url.toString();
  };
  /* -------------------------------- UI -------------------------------- */

  return (
    <div className="bg-white p-3 rounded-4 shadow-sm position-relative">
      <div className="d-flex justify-content-between align-items-start">
        {/* Tên sản phẩm nổi bật */}
        <h1 className="product-title fw-bold mb-1">
          {name}
        </h1>

        {/* Số lượng còn lại */}
        {/*       <div className="stock-badge" style={{ width: "100px", textAlign: "center" }}>
          Còn {selectedVariant?.inventory?.stock_quantity}
        </div> */}
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

          <div className="variant-list">
            {variants.map((v) => {
              const checked = v.variantId === active.variantId;

              return (
                <div
                  key={v.variantId}
                  className={`variant-box ${checked ? "active" : ""}`}
                  onClick={() => handleVariantSelect(v)}
                >
                  <div className="variant-name">{v.variantName}</div>
                  <div className="variant-price">
                    {fmtVND(
                      pickPricesFromVariant(v).promoPrice ??
                      pickPricesFromVariant(v).basePrice
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
      <div
        className="mb-3 position-relative"
        style={{
          backgroundImage: `url("${process.env.REACT_APP_API_URL}${banners.imageUrl}")`,
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
          minHeight: "20vh",
          transition: "0.3s",
        }}
      >
        <div
          style={{
            position: "absolute",
            bottom: "25%",
            left: "100px",
            width: "100%",
            display: "flex",
            justifyContent: "center",
            gap: "40px",
            alignItems: "center",
          }}
        >
          {/* Giá đã giảm */}
          <h2 className="text-light fw-bold mb-0">
            {fmtVND(totalPrice)}
          </h2>



          {/* Badge % giảm */}
          <span
            style={{
              background: "#ff3b3b",
              color: "#fff",
              padding: "6px 12px",
              borderRadius: "8px",
              fontWeight: "bold",
              fontSize: "25px",
            }}
          >
            -{Math.round((basePrice ? (basePrice - totalPrice) / basePrice : 0) * 100)}%
          </span>
        </div>
      </div>
      {product?.promotionApplicabilities?.length > 0 ? (
        <div className="offer-card">
          <div className="offer-header">
            <span className="promo-icon">🎁</span>
            <span style={{ fontSize: "18px" }}>{product?.promotionApplicabilities?.[0]?.promotion.name}</span>
          </div>

          <div className="offer-content">
            <div className="offer-item">
              <div style={{ fontSize: "14px" }}>
                {product?.promotionApplicabilities?.[0]?.promotion.description} <a href="#">(xem chi tiết)</a>
              </div>
            </div>
          </div>
        </div>
      ) : (<></>)}


      {/* PRICE */}
      <div className="rounded-3 p-3 mb-3 bg-light">
        <div className="d-flex align-items-baseline gap-3 flex-wrap">
          {hasPromo ? (
            <>
              <h3 className="text-danger fw-bold mb-0">
                {fmtVND(totalPrice)}
              </h3>
              <span className="text-muted text-decoration-line-through">
                {fmtVND(basePrice * quantity)}
              </span>
            </>
          ) : (
            <h3 className="text-danger fw-bold mb-0">
              {fmtVND(totalPrice)}
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
              displayPrice: unitPrice,
              setCartCount,
              addToCartContext,
            })
          }
        >
          <i className="bi bi-bag-plus"></i> Thêm vào giỏ hàng
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

      {/* SHARE MARKETING */}
      <div className="mt-4 pt-3 border-top">
        <div className="fw-semibold mb-2">Chia sẻ sản phẩm</div>

        <div className="d-flex flex-wrap gap-2">

          {/* Facebook */}
          <a
            href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(buildShareUrl("facebook"))}`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary btn-sm"
          >
            <i className="bi bi-facebook me-1"></i> Facebook
          </a>

          {/* Zalo */}
          <a
            href={`https://zalo.me/share?url=${encodeURIComponent(buildShareUrl("zalo"))}`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-info btn-sm text-white"
          >
            Zalo
          </a>

          {/* Messenger */}
          <a
            href={`https://www.facebook.com/dialog/send?link=${encodeURIComponent(buildShareUrl("messenger"))}&app_id=YOUR_APP_ID&redirect_uri=${encodeURIComponent(window.location.href)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-secondary btn-sm"
          >
            Messenger
          </a>

          {/* Copy Link */}
          <button
            className="btn btn-outline-dark btn-sm"
            onClick={() => {
              navigator.clipboard.writeText(buildShareUrl("copy"));
              alert("Đã sao chép link có tracking!");
            }}
          >
            <i className="bi bi-link-45deg me-1"></i> Copy link
          </button>

        </div>
      </div>
    </div>
  );
}
