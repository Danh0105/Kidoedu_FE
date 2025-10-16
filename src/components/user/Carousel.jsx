import React, { useState } from "react";
import C1 from "../../assets/user/Carouse1.jpg";
import C2 from "../../assets/user/Carouse2.jpg";

export default function Carousel() {
    const [loaded1, setLoaded1] = useState(false);
    const [loaded2, setLoaded2] = useState(false);

    const allLoaded = loaded1 && loaded2;

    return (
        <div
            id="carouselExampleDark"
            className="carousel carousel-dark slide position-relative mb-3"
        >
            <div
                className="carousel-inner rounded-4 overflow-hidden shadow-sm"
                style={{
                    borderRadius: "30px",
                    minHeight: "400px",
                    background: allLoaded ? "transparent" : "var(--bs-body-bg)",
                }}
            >
                {/* --- Slide 1 --- */}
                <div className="carousel-item active" data-bs-interval="8000">
                    {!loaded1 && (
                        <div
                            className="placeholder-glow d-flex align-items-center justify-content-center"
                            style={{
                                width: "100%",
                                height: "600px",
                                background:
                                    "linear-gradient(100deg,#e9ecef 40%,#f8f9fa 50%,#e9ecef 60%)",
                                backgroundSize: "200% 100%",
                                animation: "shimmer 1.5s infinite",
                            }}
                        >
                            <span className="text-muted fst-italic">Đang tải hình ảnh...</span>
                        </div>
                    )}
                    <img
                        src={C1}
                        alt="Slide 1"
                        onLoad={() => setLoaded1(true)}
                        className={`d-block w-100 ${!loaded1 ? "d-none" : ""}`}
                        style={{
                            maxWidth: "100%",
                            maxHeight: "700px",
                            margin: "0 auto",
                            objectFit: "cover",
                        }}
                    />
                </div>

                {/* --- Slide 2 --- */}
                <div className="carousel-item" data-bs-interval="8000">
                    {!loaded2 && (
                        <div
                            className="placeholder-glow d-flex align-items-center justify-content-center"
                            style={{
                                width: "100%",
                                height: "600px",
                                background:
                                    "linear-gradient(100deg,#e9ecef 40%,#f8f9fa 50%,#e9ecef 60%)",
                                backgroundSize: "200% 100%",
                                animation: "shimmer 1.5s infinite",
                            }}
                        >
                            <span className="text-muted fst-italic">Đang tải hình ảnh...</span>
                        </div>
                    )}
                    <img
                        src={C2}
                        alt="Slide 2"
                        onLoad={() => setLoaded2(true)}
                        className={`d-block w-100 ${!loaded2 ? "d-none" : ""}`}
                        style={{
                            maxWidth: "100%",
                            maxHeight: "700px",
                            margin: "0 auto",
                            objectFit: "cover",
                        }}
                    />
                </div>
            </div>

            {/* Nút điều hướng */}
            <button
                className="carousel-control-prev position-absolute top-50 start-0 translate-middle-y"
                type="button"
                data-bs-target="#carouselExampleDark"
                data-bs-slide="prev"
            >
                <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                <span className="visually-hidden">Previous</span>
            </button>

            <button
                className="carousel-control-next"
                type="button"
                data-bs-target="#carouselExampleDark"
                data-bs-slide="next"
            >
                <span className="carousel-control-next-icon" aria-hidden="true"></span>
                <span className="visually-hidden">Next</span>
            </button>
        </div>
    );
}
