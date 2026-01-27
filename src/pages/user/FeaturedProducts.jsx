import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import ROBOT from "../../assets/user/ROBOT.png";
import ViewProducts from "../../components/user/HomePage/ViewProducts";

// 🔧 Helper: Lấy giá từ một variant


// 🔧 Helper: Tính giá min/max từ các variants


export default function FeaturedProducts({ apiBase = process.env.REACT_APP_API_URL }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  // Axios instance
  const api = useMemo(
    () =>
      axios.create({
        baseURL: apiBase.replace(/\/+$/, ""),
        timeout: 10000,
      }),
    [apiBase]
  );

  // 📦 Fetch sản phẩm nổi bật
  const fetchFeaturedProducts = async () => {
    setLoading(true);
    setErr("");

    try {
      const res = await api.get("/products");
      const items = res.data?.data || [];

      // ⭐ Lọc theo bitmask: (status & 2) > 0
      const featured = items.filter((p) => (p.status & 2) !== 0);

      setProducts(featured);
    } catch (e) {
      console.error(e);
      setErr("Không thể tải danh sách sản phẩm nổi bật.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeaturedProducts();
  }, []);

  return (
    <div className="container py-5 bg-white">
      {/* Header */}
      <div className="text-center mb-5">
        <h2 className="fw-bold display-6 text-uppercase">⭐ Sản phẩm nổi bật</h2>
        <p className="text-muted">Khám phá những sản phẩm được yêu thích nhất của chúng tôi!</p>
        <div
          style={{
            width: "80px",
            height: "3px",
            backgroundColor: "hsl(45, 100%, 50%)",
            margin: "10px auto",
            borderRadius: "2px",
          }}
        ></div>
      </div>

      {/* Loading / Error */}
      {/* {loading && <p className="text-center text-secondary">⏳ Đang tải...</p>} */}
      {err && <p className="text-center text-danger">{err}</p>}

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

        {/* end */}
        {!loading && products.length === 0 && (
          <div className="col-12 text-center text-muted">Chưa có sản phẩm nổi bật nào.</div>
        )}

        {products.map((p) => {
          const img =
            p.images?.find((x) => x.isPrimary)?.imageUrl ||
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
                  <span
                    className="badge bg-warning text-dark position-absolute top-0 start-0 m-2 px-3 py-2 rounded"
                    style={{ fontSize: "0.9rem" }}
                  >
                    Nổi bật
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
                      src={process.env.REACT_APP_API_URL + img}
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

                {/* Nội dung */}
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
                    className="btn btn-outline-warning btn-sm rounded-pill px-3"
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
          marginTop: 48,
          padding: "0 8px",
          overflowX: "hidden",
        }}
      >
      
        <div className="text-center mb-5">
          <h2 className="fw-bold display-6 text-uppercase">
            Sản phẩm đã xem
          </h2>
          <p className="text-muted">
            Những sản phẩm bạn đã quan tâm gần đây
          </p>
          <div
            style={{
              width: "80px",
              height: "3px",
              backgroundColor: "hsl(45, 100%, 50%)",
              margin: "10px auto",
              borderRadius: "2px",
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
