import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { NavLink } from "react-router-dom";
import { CartContext } from "../../hooks/CartContext";
import { useSEO } from "../../hooks/useSEO";

export default function Quotation({ apiBase = `${process.env.REACT_APP_API_URL}` }) {
  const [products, setProducts] = useState([]);
  const [quantities, setQuantities] = useState({}); // ⭐ quantity theo từng sản phẩm
  const { setSelectedProducts } = useContext(CartContext);
  const [loading, setLoading] = useState(true);
  // -------------------------------------------
  // 🔧 Helper: lấy giá từ một variant
  const pickPricesFromVariant = (v) => {
    if (!v || !Array.isArray(v.prices)) return { finalPrice: 0 };

    let basePrice = null;
    let promoPrice = null;

    v.prices.forEach((p) => {
      if (p.priceType === "base") basePrice = Number(p.price);
      if (p.priceType === "promo") promoPrice = Number(p.price);
    });

    return {
      finalPrice: promoPrice ?? basePrice ?? 0,
    };
  };

  // 🔧 Helper: lấy giá min từ tất cả variants
  const getVariantMinPrice = (variants = []) => {
    const prices = variants
      .map((v) => pickPricesFromVariant(v).finalPrice)
      .filter(Boolean);

    if (!prices.length) return 0;
    return Math.min(...prices);
  };
  // -------------------------------------------

  // 🔧 Axios instance
  const api = axios.create({
    baseURL: apiBase.replace(/\/+$/, ""),
    timeout: 10000,
  });

  // 🔍 Lấy danh sách sản phẩm
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const res = await api.get("/products");
        setProducts(res.data?.data || []);
      } catch (err) {
        console.error("Error fetching products:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);
  useSEO({
    title: "Yêu cầu báo giá thiết bị giáo dục | KIDO EDU",
    description:
      "Gửi yêu cầu báo giá nhanh chóng cho thiết bị giáo dục và giải pháp công nghệ tại KIDO EDU.",
    canonical: "https://kidoedu.vn/bao-gia",
  });

  // 🖊 Khi thay đổi số lượng
  const handleQtyChange = (id, value) => {
    const newQty = Math.max(1, parseInt(value) || 1);
    setQuantities((prev) => ({ ...prev, [id]: newQty }));
  };

  return (
    <div className="container py-5 bg-white">
      <h2 className="text-center fw-bold mb-4">📋 BẢNG BÁO GIÁ SẢN PHẨM</h2>

      <div className="table-responsive shadow-sm rounded-3">
        <table className="table table-bordered align-middle text-center">
          <thead className="table-primary">
            <tr>
              <th style={{ width: "120px" }}>Hình ảnh</th>
              <th>Tên sản phẩm</th>
              <th style={{ width: "150px" }}>Giá bán</th>
              <th style={{ width: "130px" }}>Bảo hành</th>
              <th style={{ width: "180px" }}>Số lượng</th>
              <th style={{ width: "140px" }}>Thao tác</th>
            </tr>
          </thead>

          <tbody>
            {/* 1️⃣ PLACEHOLDER KHI LOAD */}
            {loading &&
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i} className="placeholder-glow">
                  <td>
                    <span
                      className="placeholder rounded"
                      style={{ width: 100, height: 80, display: "inline-block" }}
                    ></span>
                  </td>
                  <td>
                    <span className="placeholder col-8 d-block mb-2"></span>
                    <span className="placeholder col-4"></span>
                  </td>
                  <td>
                    <span className="placeholder col-6"></span>
                  </td>
                  <td>
                    <span className="placeholder col-5"></span>
                  </td>
                  <td>
                    <span
                      className="placeholder col-6"
                      style={{ height: 38 }}
                    ></span>
                  </td>
                  <td>
                    <span className="btn btn-primary disabled placeholder col-8"></span>
                  </td>
                </tr>
              ))}

            {/* 2️⃣ LOAD XONG NHƯNG KHÔNG CÓ DATA */}
            {!loading && products.length === 0 && (
              <tr>
                <td colSpan="6" className="text-muted py-4 text-center">
                  Không có sản phẩm nào
                </td>
              </tr>
            )}

            {/* 3️⃣ DATA THẬT */}
            {!loading &&
              products.map((p) => {
                const img =
                  p.images?.find((i) => i.isPrimary)?.imageUrl ||
                  p.images?.[0]?.image_url ||
                  "https://via.placeholder.com/100";

                const price =
                  Number(p.price) > 0
                    ? Number(p.price)
                    : getVariantMinPrice(p.variants);

                return (
                  <tr key={p.productId}>
                    <td>
                      <img
                        src={process.env.REACT_APP_API_URL + img}
                        alt={p.productName}
                        className="img-fluid rounded"
                        style={{ maxHeight: "100px" }}
                      />
                    </td>

                    <td className="text-start">
                      <strong>{p.productName}</strong>
                      <br />
                      <button
                        className="btn btn-sm btn-outline-primary mt-2"
                        onClick={() =>
                          window.open(`/productdetail/${p.productId}`, "_blank")
                        }
                      >
                        Xem thêm
                      </button>
                    </td>

                    <td className="text-danger fw-bold">
                      {price.toLocaleString()} ₫
                    </td>

                    <td>{p.warranty_period || "1 Tuần"}</td>

                    <td>
                      <input
                        type="number"
                        min="1"
                        className="form-control text-center mx-auto"
                        style={{ width: "70px" }}
                        value={quantities[p.productId] || 1}
                        onChange={(e) =>
                          handleQtyChange(p.productId, e.target.value)
                        }
                      />
                    </td>

                    <td>
                      <NavLink
                        to={`/productdetail/${p.productId}`}
                        className="btn btn-primary d-flex align-items-center justify-content-center mx-auto"
                      >
                        <i className="bi bi-cart-fill me-2"></i>
                        Mua ngay
                      </NavLink>
                    </td>
                  </tr>
                );
              })}
          </tbody>

        </table>
      </div>
    </div>
  );
}
