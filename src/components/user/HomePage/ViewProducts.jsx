import React, { useEffect, useState } from "react";
import ProductCard from "./ProductCard";

export default function ViewProducts({ banners }) {
    const [products, setProducts] = useState([]);
    const [showAll, setShowAll] = useState(false);

    useEffect(() => {
        const viewed =
            JSON.parse(localStorage.getItem("viewed_products")) || [];
        setProducts(viewed);
    }, []);

   
    if (!products.length) return null;

    const displayProducts = showAll ? products : products.slice(0, 4);

    return (
        <section className="my-5 p-2">
            {/* ===== GRID SẢN PHẨM ===== */}
            <div className="row justify-content-center">
                {displayProducts.map((p) => (
                    <ProductCard
                        key={p.productId}
                        p={p}
                        banners={banners}
                        className="col-12 col-sm-6 col-md-4 col-lg-3 mb-4 appear is-visible"
                    />
                ))}
            </div>

            
            {products.length > 4 && (
                <div className="text-center mt-3">
                    <button
                        onClick={() => setShowAll((v) => !v)}
                        className="btn btn-outline-danger rounded-pill px-4"
                    >
                        {showAll ? "Thu gọn" : "Xem thêm"}
                    </button>
                </div>
            )}
        </section>
    );
}
