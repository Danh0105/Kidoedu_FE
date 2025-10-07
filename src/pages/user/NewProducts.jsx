import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import ROBOT from "../../assets/user/ROBOT.png";

export default function NewProducts({ apiBase = "https://kidoedu.vn" }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  // Khởi tạo axios instance
  const api = useMemo(
    () =>
      axios.create({
        baseURL: apiBase.replace(/\/+$/, ""),
        timeout: 10000,
      }),
    [apiBase]
  );

  // Fetch danh sách sản phẩm mới
  const fetchNewProducts = async () => {
    setLoading(true);
    setErr("");
    try {
      const res = await api.get("/products");
      const data = res.data?.data || [];
      // Lọc theo status
      const newItems = data.filter((p) => p.status === 2 || p.status === 12);
      setProducts(newItems);
    } catch (e) {
      setErr("Không thể tải dữ liệu sản phẩm.");
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNewProducts();
  }, []);

  return (
    <div className="container py-5 bg-white">
      {/* Tiêu đề */}
      <div className="text-center mb-5">
        <h2 className="fw-bold display-6 text-uppercase">
          🆕 Sản phẩm mới
        </h2>
        <p className="text-muted">Khám phá những sản phẩm mới nhất của chúng tôi!</p>
        <div
          style={{
            width: "80px",
            height: "3px",
            backgroundColor: "hsl(0, 75%, 60%)",
            margin: "10px auto",
            borderRadius: "2px",
          }}
        ></div>
      </div>

      {/* Trạng thái tải */}
      {loading && <p className="text-center text-secondary">⏳ Đang tải...</p>}
      {err && <p className="text-center text-danger">{err}</p>}

      {/* Danh sách sản phẩm */}
      <div className="row g-4 justify-content-center">
        {products.length > 0 ? (
          products.map((p) => (
            <div
              key={p.product_id}
              className="col-xl-3 col-lg-4 col-md-6 col-sm-12 d-flex justify-content-center"
            >
              <div
                className="card border-0 shadow-sm rounded-4 overflow-hidden h-100"
                style={{ maxWidth: "300px" }}
              >
                <div className="position-relative">
                  {/* Badge "Mới" */}
                  <span
                    className="badge bg-success position-absolute top-0 start-0 m-2 px-3 py-2"
                    style={{ borderRadius: "8px", fontSize: "0.9rem" }}
                  >
                    Mới
                  </span>

                  {/* Ảnh sản phẩm */}
                  <img
                    src={p.images?.[0]?.image_url || ROBOT}
                    alt={p.product_name}
                    className="card-img-top"
                    style={{
                      height: "220px",
                      objectFit: "cover",
                      backgroundColor: "#f8f9fa",
                    }}
                  />
                </div>

                {/* Nội dung */}
                <div className="card-body text-center">
                  <h6
                    className="fw-semibold text-truncate mb-2"
                    title={p.product_name}
                  >
                    {p.product_name}
                  </h6>
                  <p className="text-danger fw-bold mb-3">
                    {Number(p.price).toLocaleString()} ₫
                  </p>
                  <button
                    onClick={() =>
                      window.open(`/productdetail/${p.product_id}`)
                    }
                    className="btn btn-outline-primary btn-sm rounded-pill px-3"
                  >
                    Xem chi tiết
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          !loading && (
            <div className="col-12 text-center text-muted">
              Chưa có sản phẩm mới nào.
            </div>
          )
        )}
      </div>
    </div>
  );
}
