import React, { useState, useMemo } from "react";
import C1 from "../../assets/user/Carouse1.jpg";
import C2 from "../../assets/user/Carouse2.jpg";

export default function Carousel() {
    const [loaded1, setLoaded1] = useState(false);
    const [loaded2, setLoaded2] = useState(false);

    // Chiều cao linh hoạt: min 220px, theo viewport 28vw, max 480px
    const HEIGHT = useMemo(() => "clamp(250px, 34vw, 480px)");
    const RADIUS = 24; // bo góc đều tay

    return (
        <div
            id="carouselHome"
            className="carousel slide position-relative mb-4"
            data-bs-ride="carousel"
            aria-label="Kido Promo Carousel"
        >
            {/* Indicators (dots) */}
            <div className="carousel-indicators">
                <button type="button" data-bs-target="#carouselHome" data-bs-slide-to="0" className="active" aria-current="true" aria-label="Slide 1" />
                <button type="button" data-bs-target="#carouselHome" data-bs-slide-to="1" aria-label="Slide 2" />
            </div>

            <div
                className="carousel-inner shadow-sm"
                style={{
                    borderRadius: RADIUS,
                    overflow: "hidden",
                    background: "var(--bs-body-bg)",
                    // đảm bảo khối giữ chỗ, hạn chế layout shift
                    height: HEIGHT,
                }}
            >
                {/* --- Slide 1 --- */}
                <div className="carousel-item active" data-bs-interval="6000">
                    {!loaded1 && <Shimmer height={HEIGHT} />}
                    <img
                        src={C1}
                        alt="Khuyến mãi thiết bị gia dụng - Slide 1"
                        onLoad={() => setLoaded1(true)}
                        className={`d-block w-100 ${!loaded1 ? "d-none" : "fade-in"}`}
                        loading="eager"
                        style={{
                            height: HEIGHT,
                            objectFit: "cover",
                            objectPosition: "center",
                        }}
                    />
                </div>

                {/* --- Slide 2 --- */}
                <div className="carousel-item" data-bs-interval="6000">
                    {!loaded2 && <Shimmer height={HEIGHT} />}
                    <img
                        src={C2}
                        alt="Flash sale 75% - Slide 2"
                        onLoad={() => setLoaded2(true)}
                        className={`d-block w-100 ${!loaded2 ? "d-none" : "fade-in"}`}
                        loading="lazy"
                        style={{
                            height: HEIGHT,
                            objectFit: "cover",
                            objectPosition: "center",
                        }}
                    />
                </div>
            </div>

            {/* Prev / Next controls */}
            <button
                className="carousel-control-prev"
                type="button"
                data-bs-target="#carouselHome"
                data-bs-slide="prev"
                aria-label="Previous"
                style={{ filter: "drop-shadow(0 2px 6px rgba(0,0,0,.25))" }}
            >
                <span className="carousel-control-prev-icon" aria-hidden="true"></span>
            </button>
            <button
                className="carousel-control-next"
                type="button"
                data-bs-target="#carouselHome"
                data-bs-slide="next"
                aria-label="Next"
                style={{ filter: "drop-shadow(0 2px 6px rgba(0,0,0,.25))" }}
            >
                <span className="carousel-control-next-icon" aria-hidden="true"></span>
            </button>
        </div>
    );
}

function Shimmer({ height }) {
    return (
        <div
            aria-hidden="true"
            className="w-100 h-100 d-flex align-items-center justify-content-center"
            style={{
                height,
                background:
                    "linear-gradient(100deg,#e9ecef 40%,#f8f9fa 50%,#e9ecef 60%)",
                backgroundSize: "200% 100%",
                animation: "shimmer 1.2s infinite linear",
            }}
        >
            <span className="text-muted fst-italic small">Đang tải hình ảnh…</span>
        </div>
    );
}
