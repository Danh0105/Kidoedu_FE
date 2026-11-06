import React, { useState } from "react";

const proxyUrl = (url) =>
    `https://wsrv.nl/?url=${encodeURIComponent(url)}&output=webp`;

export default function PromoRow({
    items = [],
    height = "clamp(76px, 11vw, 124px)",
    radius = 16,
}) {
    return (
        <div className="row g-3 my-3">
            {items.map((item, idx) => (
                <div className="col-12 col-md-4" key={idx}>
                    <BannerCard item={item} height={height} radius={radius} />
                </div>
            ))}
        </div>
    );
}

function BannerCard({ item, height, radius }) {
    const [imgSrc, setImgSrc] = useState(item.src);

    const handleError = () => {
        // lỗi lần đầu → đổi sang proxy
        if (!imgSrc.startsWith("https://wsrv.nl/")) {
            return setImgSrc(proxyUrl(item.src));
        }
    };

    return (
        <a
            href={item.href || "#"}
            aria-label={item.alt || "banner"}
            target={item.newTab ? "_blank" : undefined}
            rel={item.newTab ? "noreferrer noopener" : undefined}
            className="d-block w-100 shadow-sm"
            style={{
                borderRadius: radius,
                overflow: "hidden",
                textDecoration: "none",
            }}
        >
            <img
                src={imgSrc}
                alt={item.alt || "banner"}
                loading="lazy"
                decoding="async"
                referrerPolicy="no-referrer"
                onError={handleError}
                className="w-100"
                style={{
                    height,
                    objectFit: "cover",
                    objectPosition: "center",
                    display: "block",
                    background: "#f2f2f2", // giữ nền nhẹ khi ảnh chưa load
                }}
            />
        </a>
    );
}
