import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { NavLink } from "react-router-dom";
import { CartContext } from "../../hooks/CartContext";

export default function Quotation({ apiBase = `${process.env.REACT_APP_API_URL}` }) {
  const [products, setProducts] = useState([]);
  const [quantities, setQuantities] = useState({}); // ⭐ quantity theo từng sản phẩm
  const { setSelectedProducts } = useContext(CartContext);

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
        const res = await api.get("/products");
        setProducts(res.data?.data || []);
      } catch (err) {
        console.error("Error fetching products:", err);
      }
    };
    fetchProducts();
  }, []);

  // 🛒 Khi nhấn "Mua ngay"
  const handleSubmit = (product) => {
    const qty = quantities[product.productId] || 1;

    setSelectedProducts([
      {
        data: product,
        quantity: qty,
      },
    ]);
  };

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
            {products.length > 0 ? (
              products.map((p) => {
                // ⭐ Chọn ảnh đúng chuẩn
                const img =
                  p.images?.find((i) => i.isPrimary)?.imageUrl ||
                  p.images?.[0]?.image_url ||
                  "https://via.placeholder.com/100";

                // ⭐ Tính giá
                const price =
                  Number(p.price) > 0
                    ? Number(p.price)
                    : getVariantMinPrice(p.variants);

                return (
                  <tr key={p.productId}>
                    {/* Hình ảnh */}
                    <td>
                      <img
                        src={process.env.REACT_APP_API_URL + img}
                        alt={p.productName}
                        className="img-fluid rounded"
                        style={{ maxHeight: "100px" }}
                      />
                    </td>

                    {/* Tên sản phẩm */}
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

                    {/* Giá bán */}
                    <td className="text-danger fw-bold">
                      {price.toLocaleString()} ₫
                    </td>

                    {/* Bảo hành */}
                    <td>{p.warranty_period || "1 Tuần"}</td>

                    {/* Số lượng */}
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

                    {/* Mua ngay */}
                    <td>
                      <NavLink
                        to="/checkout"
                        className="btn btn-primary d-flex align-items-center justify-content-center mx-auto"
                        onClick={() => handleSubmit(p)}
                      >
                        <i className="bi bi-cart-fill me-2"></i>
                        Mua ngay
                      </NavLink>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="6" className="text-muted py-4">
                  Không có sản phẩm nào
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
