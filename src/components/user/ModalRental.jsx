import React, { useContext, useEffect, useMemo, useState } from "react";
import Slider from "react-slick";
import { NavLink } from "react-router-dom";
import { CartContext } from "../../hooks/CartContext";

export default function ModalRental({ show, onClose, product, variantsWithPrices = [] }) {
  const { setSelectedProducts } = useContext(CartContext);

  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [navMain, setNavMain] = useState(null);
  const [navThumb, setNavThumb] = useState(null);
  const [selectedRentalType, setSelectedRentalType] = useState(null);

  const variants = product?.variants || [];
  const activeVariant = selectedVariant || variants[0] || {};

  const name = `${product?.productName || "Sản phẩm"}${activeVariant.variantName ? ` - ${activeVariant.variantName}` : ""}`;
  const sku = activeVariant?.sku || product?.sku || `SKU-${product?.productId}`;
  const categoryName = product?.category?.categoryName;
  const variantId = activeVariant?.variantId;
  const price = activeVariant?.price ?? 0;

  // Variant images
  const images = useMemo(() => {
    const variantImages = variants.map((v) => v.imageUrl).filter(Boolean);
    const currentImage = selectedVariant?.imageUrl;
    return [...new Set([currentImage, ...variantImages].filter(Boolean))];
  }, [variants, selectedVariant]);

  // Rental info for current variant
  const rentalOptions = useMemo(() => {
    return variantsWithPrices.find((v) => v.variantId === variantId)?.rentalOptions || [];
  }, [variantId, variantsWithPrices]);

  // Settings for image sliders
  const mainSettings = useMemo(() => ({
    arrows: true,
    fade: true,
    dots: false,
    asNavFor: navThumb,
    swipe: true,
    adaptiveHeight: true,
  }), [navThumb]);

  const thumbSettings = useMemo(() => ({
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
  }), [navMain]);

  // Default selected variant
  useEffect(() => {
    if (!selectedVariant && variants.length > 0) {
      setSelectedVariant(variants[0]);
    }
  }, [variants]);

  // Close modal with Escape key
  useEffect(() => {
    if (!show) return;
    const onEsc = (e) => e.key === "Escape" && onClose?.();
    document.addEventListener("keydown", onEsc);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onEsc);
      document.body.style.overflow = prevOverflow;
    };
  }, [show, onClose]);

  const handleQtyChange = (e) => {
    const val = parseInt(e.target.value, 10);
    setQuantity(Number.isFinite(val) && val > 0 ? val : 1);
  };

  const transformedProduct = useMemo(() => ({
    data: product,
    quantity,
    selected: false,
    variant: activeVariant,
  }), [product, quantity, activeVariant]);
  const selectedRentalPrice = useMemo(() => {
    return rentalOptions.find(r => r.rentalType === selectedRentalType)?.price || 0;
  }, [selectedRentalType, rentalOptions]);

  const totalRentalPrice = selectedRentalPrice * quantity;
  useEffect(() => {
    setSelectedRentalType(null); // reset khi đổi variant
  }, [selectedVariant]);
  useEffect(() => {
    if (rentalOptions.length > 0) {
      setSelectedRentalType(rentalOptions[0].rentalType);
    } else {
      setSelectedRentalType(null);
    }
  }, [rentalOptions]);

  if (!show) return null;

  return (
    <div className="modal d-block" tabIndex="-1" role="dialog" onClick={onClose} aria-modal="true" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
      <div className="modal-dialog modal-lg modal-dialog-centered" role="document" onClick={(e) => e.stopPropagation()}>
        <div className="modal-content border-0 shadow-lg">
          <div className="modal-header border-0">
            <button type="button" className="btn-close" onClick={onClose} aria-label="Đóng" />
          </div>

          <div className="modal-body pt-0">
            <div className="row g-4">
              {/* Image Gallery */}
              <div className="col-md-6">
                <Slider {...mainSettings} ref={setNavMain}>
                  {(images.length ? images : ["/placeholder.png"]).map((src, idx) => (
                    <div key={idx} className="ratio ratio-1x1">
                      <InnerImageZoom
                        src={src}
                        zoomSrc={src}
                        zoomType="hover"
                        zoomScale={1.5}
                        alt={`Ảnh ${idx + 1}`}
                        className="w-100 h-100"
                        style={{ objectFit: "contain" }}
                      />
                    </div>
                  ))}
                </Slider>

                {images.length > 1 && (
                  <div className="mt-3">
                    <Slider {...thumbSettings} ref={setNavThumb}>
                      {images.map((src, idx) => (
                        <div key={idx} className="px-1 ratio ratio-1x1 border rounded">
                          <img
                            src={src}
                            alt={`Thumb ${idx + 1}`}
                            className="w-100 h-100"
                            style={{ objectFit: "contain", cursor: "pointer" }}
                          />
                        </div>
                      ))}
                    </Slider>
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="col-md-6 d-flex flex-column">
                <div>
                  <h2 className="h5 mb-1">{name}</h2>
                  <p className="text-muted mb-2">Mã sản phẩm: #{variantId}</p>
                  <h4 className="text-danger fw-bold mb-3">
                    Tổng cộng: <strong>{Number(totalRentalPrice).toLocaleString("vi-VN")} ₫</strong>
                  </h4>

                  {/* Variant selection */}
                  {variants.length > 0 && (
                    <div className="mb-3">
                      <div className="fw-semibold mb-2">Chọn phiên bản</div>
                      <div className="d-flex flex-wrap gap-2">
                        {variants.map((v) => (
                          <button
                            key={v.variantId}
                            className={`btn ${v.variantId === activeVariant.variantId ? "btn-primary" : "btn-outline-secondary"}`}
                            onClick={() => setSelectedVariant(v)}
                          >
                            {v.attributes?.color || v.variantName || `Mẫu ${v.variantId}`}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                  <div className="fw-semibold mb-2">Chọn loại thuê:</div>

                  {rentalOptions.map((opt) => (
                    <button
                      key={opt.rentalType}
                      type="button"
                      className={`btn ms-1 ${selectedRentalType === opt.rentalType ? 'btn-primary' : 'btn-outline-secondary'}`}
                      onClick={() => setSelectedRentalType(opt.rentalType)}
                    >
                      {opt.rentalType === "daily" && "Theo ngày"}
                      {opt.rentalType === "weekly" && "Theo tuần"}
                      {opt.rentalType === "monthly" && "Theo tháng"}
                    </button>
                  ))}
                  {selectedRentalType && (
                    <div className="mt-1 text-muted small">
                      Giá thuê: <strong>{Number(selectedRentalPrice).toLocaleString("vi-VN")} ₫</strong><br />
                      Cọc: <strong>{Number(
                        rentalOptions.find(r => r.rentalType === selectedRentalType)?.deposit || 0
                      ).toLocaleString("vi-VN")} ₫</strong><br />
                    </div>
                  )}



                  {product?.shortDescription && (
                    <p className="text-body">{product.shortDescription}</p>
                  )}
                </div>

                {/* Actions */}
                <div className="mt-3 mt-md-auto">
                  <div className="d-flex flex-wrap align-items-center gap-2">
                    <div className="input-group" style={{ maxWidth: 140 }}>
                      <button className="btn btn-outline-secondary" onClick={() => setQuantity((n) => Math.max(n - 1, 1))}>−</button>
                      <input
                        type="number"
                        className="form-control text-center"
                        value={quantity}
                        min="1"
                        onChange={handleQtyChange}
                      />
                      <button className="btn btn-outline-secondary" onClick={() => setQuantity((n) => n + 1)}>+</button>
                    </div>

                    <NavLink
                      to="/checkoutrental"
                      className="btn btn-warning flex-grow-1"
                      onClick={() => setSelectedProducts([transformedProduct])}
                      disabled={!selectedRentalType}
                    >
                      Thuê ngay
                    </NavLink>
                  </div>

                  <div className="d-flex flex-wrap gap-3 mt-3 small text-muted">
                    {sku && <span className="badge bg-light text-secondary border">SKU: {sku}</span>}
                    {categoryName && <span>Danh mục: {categoryName}</span>}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="modal-footer border-0 pt-0">
            <button type="button" className="btn btn-light w-100 d-md-none" onClick={onClose}>
              Đóng
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
