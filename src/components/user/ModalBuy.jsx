import React, { useContext, useEffect, useMemo, useState } from "react";
import InnerImageZoom from "react-inner-image-zoom";
import Slider from "react-slick";
import { NavLink } from "react-router-dom";
import { CartContext } from "../../hooks/CartContext";

export default function ModalBuy({ show, onClose, product, images = [] }) {
  const { setSelectedProducts } = useContext(CartContext);
  const [navMain, setNavMain] = useState(null);
  const [navThumb, setNavThumb] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState(null);

  const variants = product?.variants || [];
  const activeVariant = selectedVariant ?? variants[0] ?? {};

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

  const name = `${product?.productName || "Sản phẩm"}${activeVariant.variantName ? ` - ${activeVariant.variantName}` : ""
    }`;

  const sku = activeVariant?.sku || product?.sku || `SKU-${product?.productId}`;
  const price = activeVariant?.price ?? 0;
  const categoryName = product?.category?.categoryName;
  const variantId = activeVariant?.variantId;

  const safeImages = useMemo(() => {
    // Lấy tất cả ảnh từ các biến thể
    const variantImages = (product?.variants || [])
      .map((v) => v.imageUrl)
      .filter(Boolean);

    // Đưa ảnh variant đang chọn lên đầu
    const currentImage = selectedVariant?.imageUrl;

    const allImages = [
      ...(currentImage ? [currentImage] : []),
      ...variantImages,
    ];

    // Loại trùng (theo URL)
    return allImages.filter((v, i, arr) => arr.indexOf(v) === i);
  }, [product, selectedVariant]);



  const transformedProduct = useMemo(() => ({
    data: product,
    quantity,
    selected: false,
    variant: activeVariant,
  }), [product, quantity, activeVariant]);



  console.log("transformedProduct", transformedProduct);

  useEffect(() => {
    if (!product || !Array.isArray(product.variants)) return;

    const defaultVariant = product.variants[0] ?? null;
    setSelectedVariant(defaultVariant);
  }, [product]);


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

  const handleVariantSelect = (v) => {
    setSelectedVariant(v);
  };

  const increase = () => setQuantity((n) => n + 1);
  const decrease = () => setQuantity((n) => (n > 1 ? n - 1 : 1));
  const onQtyInput = (e) => {
    const n = parseInt(e.target.value, 10);
    setQuantity(Number.isFinite(n) && n > 0 ? n : 1);
  };

  if (!show) return null;

  return (
    <div className="modal d-block" tabIndex="-1" role="dialog" onClick={onClose} aria-modal="true"
      style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
      <div className="modal-dialog modal-lg modal-dialog-centered" role="document" onClick={(e) => e.stopPropagation()}>
        <div className="modal-content border-0 shadow-lg">
          <div className="modal-header border-0">
            <button type="button" className="btn-close" onClick={onClose} aria-label="Đóng" />
          </div>

          <div className="modal-body pt-0">
            <div className="row g-4">
              {/* Gallery */}
              <div className="col-12 col-md-6">
                <div className="product-slider">
                  <Slider {...mainSettings} ref={setNavMain}>
                    {(safeImages.length ? safeImages : ["/placeholder.png"]).map((src, idx) => (
                      <div key={idx}>
                        <div className="ratio ratio-1x1">
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
                                src={src}
                                alt={`Thumb ${idx + 1}`}
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
              </div>

              {/* Info */}
              <div className="col-12 col-md-6 d-flex flex-column">
                <div>
                  <h2 className="h5 mb-1">{name}</h2>
                  <p className="text-muted mb-2">Mã sản phẩm: #{variantId}</p>
                  <h4 className="text-danger fw-bold mb-3">
                    {Number(price || 0).toLocaleString("vi-VN")} ₫
                  </h4>

                  {variants.length > 0 && (
                    <div className="mb-3">
                      <div className="fw-semibold mb-2">Chọn phiên bản</div>
                      <div className="d-flex flex-wrap gap-2">
                        {variants.map((v) => (
                          <button
                            key={v.variantId}
                            type="button"
                            className={`btn ${v.variantId === activeVariant.variantId
                              ? "btn-primary"
                              : "btn-outline-secondary"
                              }`}
                            onClick={() => handleVariantSelect(v)}
                          >
                            {v.attributes?.color || v.variantName}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {product?.shortDescription && (
                    <p className="text-body">{product.shortDescription}</p>
                  )}
                </div>

                <div className="mt-3 mt-md-auto">
                  <div className="d-flex flex-wrap align-items-center gap-2">
                    <div className="input-group" style={{ maxWidth: 140 }}>
                      <button className="btn btn-outline-secondary" onClick={decrease}>−</button>
                      <input
                        type="number"
                        className="form-control text-center"
                        value={quantity}
                        min="1"
                        onChange={onQtyInput}
                      />
                      <button className="btn btn-outline-secondary" onClick={increase}>+</button>
                    </div>

                    <NavLink
                      to="/checkout"
                      className="btn btn-primary flex-grow-1"
                      onClick={() => setSelectedProducts([transformedProduct])}
                    >
                      Mua ngay
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
