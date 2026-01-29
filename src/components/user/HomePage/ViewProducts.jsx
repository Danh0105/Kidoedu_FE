import React, { useEffect, useRef, useState } from "react";
import rightIcon from "../../../assets/user/right.png";
import leftIcon from "../../../assets/user/left.png";

export default function ViewProducts() {
    const [products, setProducts] = useState([]);
    const listRef = useRef(null);

    useEffect(() => {
        const viewed =
            JSON.parse(localStorage.getItem("viewed_products")) || [];
        setProducts(viewed);
    }, []);

    // lưu giá trị khi xem 1 sản phẩm 


    if (!products.length) return null;

    const scrollAmount = () => listRef.current.offsetWidth / 4;

    const scrollLeft = () => {
        listRef.current?.scrollBy({ left: -240, behavior: "smooth" });
    };

    const scrollRight = () => {
        listRef.current?.scrollBy({ left: 240, behavior: "smooth" });
    };

    return (
        <section className="my-4 position-relative">
            <div className="position-relative">

                {/* ===== NÚT TRÁI ===== */}
                <button
                    onClick={scrollLeft}
                    className="btn btn-light position-absolute top-50 start-0 translate-middle-y rounded-circle"
                    style={{ width: 36, height: 36, zIndex: 10 }}
                >
                    <img src={leftIcon} alt="Prev" style={{ width: 14 }} />
                </button>

                {/* ===== SLIDER ===== */}
                <div
                    ref={listRef}
                    className="d-flex gap-3"
                    style={{
                        width: 990,
                        overflow: "hidden",
                        margin: "0 auto",
                    }}
                >
                    {products.map((p, index) => {
                        const imageUrl =
                            p.images?.[0]?.imageUrl
                                ? `${process.env.REACT_APP_API_URL}${p.images[0].imageUrl}`
                                : "/no-image.png";

                        return (
                            <div
                                key={p.productId || index}
                                className="bg-white rounded-3 flex-shrink-0 text-center position-relative"
                                style={{
                                    width: 240,
                                    padding: 10,

                                }}
                            >

                                {/* ===== ẢNH ===== */}
                                <a
                                    href={`/productdetail/${p.productId}`}
                                    aria-label={p?.productName}
                                    className="product-image-wrapper"
                                    style={{
                                        display: "block",
                                        width: "100%",
                                        textDecoration: "none",
                                    }}
                                >
                                    <div
                                        style={{
                                            height: 150,
                                            backgroundColor: "#f2f2f2",   
                                            borderRadius: 10,
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            overflow: "hidden",
                                        }}
                                    >
                                        <img
                                            src={imageUrl}
                                            alt={p.productName}
                                            style={{
                                                width: "95%",           
                                                height: "95%",
                                                objectFit: "contain",
                                            }}
                                        />
                                    </div>
                                </a>


                                {/* ===== TÊN ===== */}
                                <div
                                    style={{
                                        fontSize: 13,
                                        fontWeight: 500,
                                        lineHeight: "16px",
                                        height: 32,
                                        overflow: "hidden",
                                        display: "-webkit-box",
                                        WebkitLineClamp: 2,
                                        WebkitBoxOrient: "vertical",
                                        marginTop: 6,
                                    }}
                                >
                                    {p.productName}
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* ===== NÚT PHẢI ===== */}
                <button
                    onClick={scrollRight}
                    className="btn btn-light position-absolute top-50 end-0 translate-middle-y rounded-circle"
                    style={{ width: 36, height: 36, zIndex: 10 }}
                >
                    <img src={rightIcon} alt="Next" style={{ width: 14 }} />
                </button>
            </div>
        </section>
    );
}

