// ==== ProductDetail.jsx ====
import React, { useMemo, useState, useEffect, useContext } from "react";
import { NavLink, useParams } from "react-router-dom";
import { CartContext } from "../../hooks/CartContext";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import Cookies from "js-cookie";

const fmtVND = (n) =>
  Number(n || 0).toLocaleString("vi-VN", {
    style: "currency",
    currency: "VND",
  });

export function ProductInfoPanel({ product, images, onVariantChange, onVariantsLoaded, }) {
  const { addToCartContext, setCartCount, setSelectedProducts } =
    useContext(CartContext);
  const [quantity, setQuantity] = useState(1);
  const [variants, setVariants] = useState([]);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [variantPrice, setVariantPrice] = useState(null);
  const fetchVariantPrice = async (variantId) => {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_API_URL}/products/${product.productId}/variants/${variantId}/prices`
      );
      if (Array.isArray(res.data) && res.data.length > 0) {
        const latestPrice = res.data[0]; // lấy giá đầu tiên (hoặc mới nhất)

        setVariantPrice(latestPrice.price);
      } else {
        setVariantPrice(null);
      }
    } catch (err) {
      console.error("Lỗi khi tải giá biến thể:", err);
      setVariantPrice(null);
    }
  };

  useEffect(() => {
    if (variants.length > 0 && !selectedVariant) {
      const firstVariant = variants[0]; // chọn biến thể đầu tiên
      setSelectedVariant(firstVariant);
      fetchVariantPrice(firstVariant.variantId);
    }
  }, [variants]);

  useEffect(() => {
    const fetchVariants = async () => {
      try {
        if (!product?.productId) return;
        const res = await axios.get(
          `${process.env.REACT_APP_API_URL}/products/${product.productId}/variants`
        );
        setVariants(res.data.items || []);
      } catch (err) {
        console.error("Lỗi khi tải biến thể:", err);
      }
    };
    fetchVariants();
  }, [product?.productId]);
  useEffect(() => {
    const fetchVariants = async () => {
      try {
        if (!product?.productId) return;

        const res = await axios.get(
          `${process.env.REACT_APP_API_URL}/products/${product.productId}/variants`
        );

        const items = res?.data?.items ?? [];

        // ✅ Chuẩn hóa mảng ảnh (imageUrl có thể là string hoặc object)
        const variantsWithImages = items.map((v) => {
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

        // ✅ Gửi toàn bộ danh sách ảnh về ProductDetail
        const variantImages = variantsWithImages
          .map((v) => v.imageUrl)
          .filter(Boolean);
        onVariantsLoaded?.(variantImages);
      } catch (err) {
        console.error("❌ Lỗi khi tải danh sách biến thể:", err);
      }
    };

    fetchVariants();
  }, [product?.productId]);

  if (!product) {
    return (
      <div className="text-center text-secondary py-5">
        <div className="spinner-border text-primary mb-2" role="status">
          <span className="visually-hidden">Đang tải...</span>
        </div>
        <div>Đang tải thông tin sản phẩm...</div>
      </div>
    );
  }

  // 🧮 Dữ liệu hiển thị
  const active = selectedVariant ?? {};
  const name = `${product?.productName ?? "Sản phẩm"}${active?.variantName ? ` - ${active.variantName}` : ""
    }`;
  const sku = active?.sku || product?.sku || `SKU-${product?.productId}`;
  const price = variantPrice ?? product?.price ?? 0;
  const categoryName = product?.category?.categoryName;

  // Tính năng nổi bật
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

  // 🛒 Thêm vào giỏ hàng
  const addToCart = async (productId, quantity) => {
    try {
      const token = localStorage.getItem("Authorization") || null;

      // 🧑‍💻 1️⃣ Nếu có token → gọi API server
      if (token && token.trim()) {
        const decoded = jwtDecode(token);
        const userId = decoded.sub;
        const payload = { productId, quantity, selectedVariant };

        await axios.post(
          `${process.env.REACT_APP_API_URL}/cart/${userId}/items`,
          payload,
          { headers: { Authorization: token } }
        );

        alert("Đã thêm sản phẩm!");
        fetchCountCart();
        return;
      }

      // 🧳 2️⃣ Nếu KHÔNG có token → lưu giỏ hàng vào cookie (guest_cart)
      const currentCart = JSON.parse(Cookies.get("guest_cart") || "[]");

      // Chuẩn hoá dữ liệu variant để dễ so sánh và lưu
      const cleanVariant = selectedVariant
        ? {
          variantId: selectedVariant.variantId,
          variantName: selectedVariant.variantName,
          attributes: selectedVariant.attributes || {},
          price: selectedVariant.price || null,
        }
        : null;

      // ✅ Tìm sản phẩm có cùng productId và cùng variantId (nếu có)
      const idx = currentCart.findIndex(
        (i) =>
          i.productId === productId &&
          (i.selectedVariant?.variantId || null) === (cleanVariant?.variantId || null)
      );

      if (idx !== -1) {
        // ✅ Cùng product và cùng variant → tăng số lượng
        currentCart[idx].quantity += quantity;
        currentCart[idx].selectedVariant = cleanVariant;

        // Cập nhật lại context (thay vì add lại toàn bộ)
        addToCartContext(currentCart[idx]);
        setCartCount(currentCart[idx].length);
      } else {
        // ✅ Khác product hoặc khác variant → thêm sản phẩm mới
        const newItem = { productId, quantity, selectedVariant: cleanVariant };
        currentCart.push(newItem);

        // Cập nhật context để hiển thị ngay trong UI
        addToCartContext(newItem);
        setCartCount(newItem.length);

      }


      // Lưu lại cookie (7 ngày)
      Cookies.set("guest_cart", JSON.stringify(currentCart), { expires: 7 });

      // Cập nhật context giỏ hàng
      currentCart.forEach((item) => addToCartContext(item));

      alert("Đã lưu sản phẩm vào giỏ hàng!");
      fetchCountCart();
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
      },
    ]);
  };

  // 🎨 Giao diện
  return (
    <div className="bg-white p-4 rounded-4 shadow-sm position-relative overflow-hidden">
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
                  fetchVariantPrice(v.variantId);
                  onVariantChange?.(v);
                }}
              >
                {v.attributes?.color
                  ? `${v.attributes.color}`
                  : v.variantName}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 💰 GIÁ */}
      <div
        className="rounded-3 p-3 mb-3"
        style={{ background: "var(--bs-light)" }}
      >
        <div className="d-flex align-items-baseline gap-3">
          <div
            className="fw-bold"
            style={{
              fontSize: "2rem",
              color: "var(--bs-danger)",
              lineHeight: 1,
            }}
          >
            {fmtVND(price)}
          </div>
          <span className="badge bg-success-subtle text-success border border-success">
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
      <div className="d-flex align-items-center gap-3 mb-3">
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
                setQuantity(Number.isFinite(v) && v > 0 ? Math.min(v, 999) : 1);
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
    </div>
  );
}

