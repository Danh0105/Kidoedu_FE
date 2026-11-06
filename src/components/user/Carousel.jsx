import React, { memo, useState, useEffect, useRef, useCallback } from "react";
import "../../components/user/csss/Carouse.css";

const API = process.env.REACT_APP_API_URL;

function Carousel({ banners = [] }) {

    const [activeIndex, setActiveIndex] = useState(0);
    const intervalRef = useRef(null);

    /* ===== START AUTO SLIDE ===== */

    const startAutoSlide = useCallback(() => {

        if (intervalRef.current) {
            clearInterval(intervalRef.current);
        }

        if (banners.length <= 1) return;

        intervalRef.current = setInterval(() => {
            setActiveIndex((prev) =>
                prev === banners.length - 1 ? 0 : prev + 1
            );
        }, 4000);

    }, [banners.length]);

    /* ===== INIT AUTO SLIDE ===== */

    useEffect(() => {

        startAutoSlide();

        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };

    }, [startAutoSlide]);

    /* ===== USER CLICK ===== */

    const handleTabClick = useCallback((index) => {

        setActiveIndex(index);

        // reset autoplay
        startAutoSlide();

    }, [startAutoSlide]);

    /* ===== RENDER ===== */

    return (
        <div className="d-flex flex-column align-items-center h-100">

            <div className="carousel-frame overflow-hidden w-100">

                <div
                    className="carousel-track d-flex"
                    style={{
                        transform: `translate3d(-${activeIndex * 100}%,0,0)`,
                        transition: "transform 0.5s ease"
                    }}
                >

                    {banners.map((banner) => {

                        const imgSrc = banner?.imageUrl
                            ? `${API}${banner.imageUrl}`
                            : "/placeholder.png";

                        return (
                            <div
                                className="carousel-slide w-100 flex-shrink-0"
                                key={banner.id}
                            >

                                <a
                                    href={banner.linkUrl || "#"}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    <img
                                        src={imgSrc}
                                        alt={banner.content || "banner"}
                                        className="w-100 carousel-image"
                                        loading="lazy"
                                        decoding="async"
                                    />
                                </a>

                            </div>
                        );
                    })}

                </div>
            </div>

            {/* TABS */}

            <div className="carousel-tabs">

                {banners.map((banner, index) => (

                    <button
                        key={banner.id}
                        className={`carousel-tab ${activeIndex === index ? "active" : ""
                            }`}
                        onClick={() => handleTabClick(index)}
                    >
                        {banner.content || `Slide ${index + 1}`}
                    </button>

                ))}

            </div>

        </div>
    );
}

export default memo(Carousel);