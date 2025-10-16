import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { NavLink } from "react-router-dom";
import { CartContext } from "../../hooks/CartContext";

export default function Quotation({ apiBase = `${process.env.REACT_APP_API_URL}` }) {
  const [products, setProducts] = useState([]);
  const [quality, setQuality] = useState(1); // ✅ Khai báo state quality
  const { setSelectedProducts } = useContext(CartContext);

  // 🔧 Khởi tạo axios instance
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
  }, [api]);

  // 🛒 Khi nhấn "Mua ngay"
  const handleSubmit = (product) => {
    setSelectedProducts([
      {
        data: product,
        quantity: quality || 1, // ✅ Dùng giá trị trong ô input
      },
    ]);
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
              products.map((p) => (
                <tr key={p.product_id}>
                  {/* Hình ảnh */}
                  <td>
                    <img
                      src={
                        p.images?.[0]?.image_url ||
                        "https://via.placeholder.com/100"
                      }
                      alt={p.product_name}
                      className="img-fluid rounded"
                      style={{ maxHeight: "100px" }}
                    />
                  </td>

                  {/* Tên sản phẩm */}
                  <td className="text-start">
                    <strong>{p.product_name}</strong>
                    <br />
                    <button
                      className="btn btn-sm btn-outline-primary mt-2"
                      onClick={() =>
                        window.open(`/productdetail/${p.product_id}`, "_blank")
                      }
                    >
                      Xem thêm
                    </button>
                  </td>

                  {/* Giá bán */}
                  <td className="text-danger fw-bold">
                    {Number(p.price).toLocaleString()} ₫
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

                      onChange={(e) =>
                        setQuality(Math.max(1, parseInt(e.target.value) || 1))
                      }
                    />
                  </td>

                  {/* Thao tác */}
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
              ))
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
