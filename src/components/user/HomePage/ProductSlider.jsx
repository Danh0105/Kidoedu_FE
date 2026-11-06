// ProductSlider.jsx
import { useRef } from "react";
import rightIcon from "../../../assets/user/right.png";
import leftIcon from "../../../assets/user/left.png";

import tivi from "../../../assets/user/product1.png";
import tulanh from "../../../assets/user/product2.png";
import maygiat from "../../../assets/user/product3.png";
import aa from "../../../assets/user/product4.png";

const products = [
  { id: 1, name: "Tivi", price: 2690000, image: tivi },
  { id: 2, name: "Tủ Lạnh", price: 2190000, image: tulanh },
  { id: 3, name: "Máy Giặt", price: 2890000, image: maygiat },
  { id: 4, name: "Gia Dụng", price: 2890000, image: aa },
  { id: 5, name: "Tivi", price: 2690000, image: tivi },
  { id: 6, name: "Tủ Lạnh", price: 2190000, image: tulanh },
  { id: 7, name: "Máy Giặt", price: 2890000, image: maygiat },
  { id: 8, name: "Gia Dụng", price: 2890000, image: aa },
];

export default function ProductSlider() {
  const listRef = useRef(null);

  const scrollLeft = () => {
    if (!listRef.current) return;
    listRef.current.scrollBy({ left: -220, behavior: "smooth" });
  };

  const scrollRight = () => {
    if (!listRef.current) return;
    listRef.current.scrollBy({ left: 220, behavior: "smooth" });
  };

  return (
    <div className="bg-danger rounded-4 p-3 position-relative overflow-visible">
      {/* Nút trái */}
      <button
      type="button"
      className="btn btn-light position-absolute top-50 start-0 translate-middle-y ms-2 rounded-circle d-flex align-items-center justify-content-center"
      style={{ width: 32, height: 32, zIndex: 10, padding: 0 }}
      onClick={scrollLeft}
      >
      <img
      src={leftIcon}
      alt="Prev"
      style={{ width: 14, height: 14 }}
      />
      </button>

      {/* LIST */}
      <div
        ref={listRef}
        className="d-flex gap-3 px-5"
        style={{ overflow: "hidden" }}
      >
        {products.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-4 position-relative flex-shrink-0"
            style={{
              width: 110,
              height: 140,
              padding: 8,
              textAlign: "center",
            }}
          >
            {/* ================= GIÁ (CỐ ĐỊNH) ================= */}
            <span
              style={{
                position: "absolute",
                top: 8,
                left: 8,

                minWidth: 78,
                height: 22,

                backgroundColor: "#dc3545",
                color: "#fff",

                fontSize: 12,
                fontWeight: 600,
                lineHeight: "22px",
                textAlign: "center",

                borderRadius: 999,
                padding: "0 6px",
                whiteSpace: "nowrap",
              }}
            >
              {item.price.toLocaleString()}đ
            </span>
 
            <div
              style={{
                height: 72,  
                marginTop: 18,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <img
                src={item.image}
                alt={item.name}
                style={{
                  maxHeight: 60,
                  maxWidth: "100%",
                  objectFit: "contain",
                }}
              />
            </div>
 
            <div
              style={{
                height: 32,  
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 13,
                fontWeight: 500,
              }}
            >
              {item.name}
            </div>
          </div>
        ))}
      </div>

      {/* Nút phải */}
      <button
      type="button"
      className="btn btn-light position-absolute top-50 end-0 translate-middle-y me-2 rounded-circle d-flex align-items-center justify-content-center"
      style={{ width: 32, height: 32, zIndex: 10, padding: 0 }}
      onClick={scrollRight}
      >
      <img
      src={rightIcon}
      alt="Next"
      style={{ width: 14, height: 14 }}
      />
      </button>
    </div>
  );
}
