import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import ROBOT from "../../assets/user/ROBOT.png";
import ViewProducts from "../../components/user/HomePage/ViewProducts";
import { useSEO } from "../../hooks/useSEO";
// import "bootstrap/dist/css/bootstrap.min.css";
export default function NewProducts({ apiBase = process.env.REACT_APP_API_URL }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Axios instance gọn hơn – tự động cleanup dấu /
  const api = useMemo(
    () =>
      axios.create({
        baseURL: apiBase?.replace(/\/+$/, ""),
        timeout: 10000,
      }),
    [apiBase]
  );
  useSEO({
    title: "Sản phẩm mới cập nhật | KIDO EDU",
    description:
      "Khám phá các sản phẩm giáo dục và công nghệ mới nhất vừa được cập nhật tại KIDO EDU.",
    canonical: "https://kidoedu.vn/san-pham-moi",
  });
  // Fetch sản phẩm mới
  const fetchNewProducts = async () => {
    setLoading(true);
    setError("");

    try {
      const res = await api.get("/products");

      // Chuẩn response:
      // { success, statusCode, message, meta, data: [...] }
      const items = res.data?.data ?? [];

      // Lọc các sản phẩm có status = 2 hoặc 12 (mới)
      const newItems = items.filter(p => (p.status & 1) !== 0);

      setProducts(newItems);
    } catch (err) {
      console.error(err);
      setError("Không thể tải dữ liệu sản phẩm.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNewProducts();
  }, []);

  return (
    <div className="container py-5 bg-white">

      {/* Header */}
      <div className="text-center mb-5">
        <h2 className="fw-bold display-6 text-uppercase">🆕 Sản phẩm mới</h2>
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

      {/* Loading / Error */}
      {/* {loading && <p className="text-center text-secondary">⏳ Đang tải...</p>} */}
      {error && <p className="text-center text-danger">{error}</p>}

      {/* Product List */}
      <div className="row g-4 justify-content-center">
        {/* placeholder */}

        {loading &&
          Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="col-xl-3 col-lg-4 col-md-6 col-sm-12 d-flex justify-content-center"
            >
              <div
                className="card border-0 shadow-sm rounded-4 overflow-hidden h-100 w-100"
                style={{ maxWidth: "300px" }}
                aria-hidden="true"
              >
                {/* Image placeholder */}
                <div
                  className="placeholder-glow"
                  style={{ height: "220px", background: "#f8f9fa" }}
                >
                  <span className="placeholder col-12 h-100"></span>
                </div>

                {/* Body placeholder */}
                <div className="card-body text-center placeholder-glow">
                  <h6 className="placeholder col-8 mb-2"></h6>
                  <p className="placeholder col-6 mb-3"></p>
                  <span className="btn btn-outline-primary disabled placeholder col-6 rounded-pill"></span>
                </div>
              </div>
            </div>
          ))}

        {!loading && products.length === 0 && (
          <div className="col-12 text-center text-muted">
            Chưa có sản phẩm mới nào.
          </div>
        )}
        {/* end */}

        {!loading && products.length === 0 && (
          <div className="col-12 text-center text-muted">
            Chưa có sản phẩm mới nào.
          </div>
        )}

        {products.map((p) => {
          const firstImage =
            p.images?.find((img) => img.isPrimary)?.imageUrl ||
            p.images?.[0]?.image_url ||
            ROBOT;

          return (
            <div
              key={p.productId}
              className="col-xl-3 col-lg-4 col-md-6 col-sm-12 d-flex justify-content-center"
            >
              <div
                className="card border-0 shadow-sm rounded-4 overflow-hidden h-100"
                style={{ maxWidth: "300px" }}
              >
                <div className="position-relative">

                  {/* Badge */}
                  <span className="badge bg-success position-absolute top-0 start-0 m-2 px-3 py-2 rounded">
                    Mới
                  </span>

                  <div
                    className="w-100 d-flex align-items-center justify-content-center"
                    style={{
                      height: "220px",       // chỉnh cao cố định
                      background: "#f8f9fa",
                      overflow: "hidden",
                    }}
                  >
                    <img
                      src={process.env.REACT_APP_API_URL + firstImage}
                      alt={p.productName}
                      style={{
                        maxHeight: "100%",
                        maxWidth: "100%",
                        objectFit: "contain",
                      }}
                      onError={(e) => (e.currentTarget.src = ROBOT)}
                    />
                  </div>

                </div>

                {/* Content */}
                <div className="card-body text-center">
                  <h6 className="fw-semibold text-truncate mb-2" title={p.productName}>
                    {p.productName}
                  </h6>

                  <p className="text-danger fw-bold mb-3">
                    {p.price > 0
                      ? `${Number(p.price).toLocaleString()} ₫`
                      : (() => {
                        const { min, max } = pickVariantRange(p.variants || []);
                        if (min === 0 && max === 0) return "0 ₫";
                        return min === max
                          ? `${min.toLocaleString()} ₫`
                          : `${min.toLocaleString()} - ${max.toLocaleString()} ₫`;
                      })()
                    }

                  </p>

                  <button
                    onClick={() => window.open(`/productdetail/${p.productId}`)}
                    className="btn btn-outline-primary btn-sm rounded-pill px-3"
                  >
                    Xem chi tiết
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ===== SẢN PHẨM ĐÃ XEM ===== */}
      <section
        style={{
          marginTop: 32,
          padding: "0 8px",
          overflowX: "hidden",
        }}
      >
        <div className="text-center mb-3">
          <h5 className="fw-bold display-6 text-uppercase">
            Sản phẩm đã xem
          </h5>
          <p className="text-muted">
            Những sản phẩm bạn đã quan tâm gần đây
          </p>
          <div
            style={{
              height: 3,
              width: 60,
              backgroundColor: "hsl(0,75%,60%)",
              margin: "0 auto",
              borderRadius: 3,
            }}
          />
        </div>

        <ViewProducts />
      </section>


    </div>
  );
}
function pickVariantRange(variants) {
  const basePrices = [];

  variants.forEach(v => {
    if (!Array.isArray(v.prices)) return;

    let basePrice = null;

    v.prices.forEach(pr => {
      if (pr.priceType === "base") {
        const price = Number(pr.price);
        if (!isNaN(price)) basePrice = price;
      }
    });

    if (basePrice !== null) basePrices.push(basePrice);
  });

  if (!basePrices.length) return { min: 0, max: 0 };

  return {
    min: Math.min(...basePrices),
    max: Math.max(...basePrices),
  };
}
