import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const PLACEHOLDER_IMG = "https://via.placeholder.com/600x600?text=No+Image";

const formatCurrency = (value) =>
  new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" })
    .format(Number(value || 0));

const trimText = (s = "", max = 50) =>
  s.length > max ? s.slice(0, max) + "..." : s;

export default function ProductHome({ prod }) {
  console.log(prod)

  // Skeleton khi chưa có prod (không đổi UX: vẫn là card)
  if (!prod) {
    return (
      <div className="card nav-link" style={{ width: "268px" }}>
        <div className="ratio ratio-1x1 bg-body-tertiary rounded" />
        <div className="p-2">
          <div className="placeholder-glow">
            <span className="placeholder col-9" />
            <span className="placeholder col-12 mt-2" />
            <span className="placeholder col-4 mt-2" />
          </div>
        </div>
      </div>
    );
  }

  const id = prod.productId;
  const name = prod.productName ?? "";
  const basePrice = prod.basePrice;
  const promoPrice = prod.promoPrice;
  const firstImage = prod.imageUrl;

  return (
    <div className="card nav-link mb-2 p-2">
      <Link to={`/productdetail/${id}`} className="nav-link p-0">
        <img
          src={`${process.env.REACT_APP_API_URL}${firstImage}`}
          alt={name || "product"}
          className="card-img-top object-fit-contain"
          onError={(e) => { e.currentTarget.src = PLACEHOLDER_IMG; }}
        />
      </Link>

      <div className="row p-0 d-flex justify-content-center">
        <h5 className="card-title" style={{ fontSize: "15px", fontWeight: 700 }}>
          <Link to={`/productdetail/${id}`} className="nav-link p-0">
            {trimText(name, 35)}
          </Link>
        </h5>
        {/*       <div className="d-flex flex-column align-items-center">
          {promoPrice ? (
            <>
              <span className="text-muted text-decoration-line-through small">
                {formatCurrency(basePrice)}
              </span>
              <span className="fs-5 fw-bold text-danger">
                {formatCurrency(promoPrice)}
              </span>
            </>
          ) : (
            <span className="fs-5 fw-bold text-danger">
              {formatCurrency(basePrice)}
            </span>
          )}
        </div> */}

      </div>
    </div>
  );
}
