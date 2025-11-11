import React, { useState } from "react";

/**
 * Dải banner 3 ảnh ngang, UI gọn như mẫu.
 * - Tự co theo màn hình: clamp(76px, 11vw, 124px)
 * - Chống hotlink: no-referrer + fallback proxy
 * - Shimmer có bo góc, không bị gạch chân
 */
export default function PromoRow({
    items = [],
    height = "clamp(76px, 11vw, 124px)",
    radius = 16,
}) {
    return (
        <div className="row g-3 my-3">
            {items.map((it, idx) => (
                <div className="col-12 col-md-4" key={idx}>
                    <BannerCard item={it} height={height} radius={radius} />
                </div>
            ))}
        </div>
    );
}

function BannerCard({ item, height, radius }) {
    const [loaded, setLoaded] = useState(false);
    const [srcUrl, setSrcUrl] = useState(item.src);

    const toProxy = (url) =>
        `https://wsrv.nl/?url=${encodeURIComponent(url)}&output=webp`;

    return (
        <a
            href={item.href || "#"}
            className="d-block w-100 shadow-sm"
            style={{ borderRadius: radius, overflow: "hidden", textDecoration: "none" }}
            aria-label={item.alt || "banner"}
            target={item.newTab ? "_blank" : undefined}
            rel={item.newTab ? "noreferrer noopener" : undefined}
        >
            {!loaded && <Shimmer height={height} />}

            <img
                src={srcUrl}
                alt={item.alt || "banner"}
                loading="lazy"
                decoding="async"
                referrerPolicy="no-referrer"
                onLoad={() => setLoaded(true)}
                onError={() => {
                    // nếu lỗi lần đầu → chuyển sang proxy; nếu vẫn lỗi → giữ shimmer nhưng không treo vô hạn
                    if (!srcUrl.startsWith("https://wsrv.nl/")) {
                        setSrcUrl(toProxy(item.src));
                    } else {
                        setLoaded(true); // tắt shimmer để không “treo”
                    }
                }}
                className={`w-100 ${loaded ? "fade-in" : "d-none"}`}
                style={{
                    height,
                    objectFit: "cover",        // đổi "contain" nếu muốn thấy đủ 100% ảnh
                    objectPosition: "center",
                    display: "block",
                }}
            />
        </a>
    );
}

function Shimmer({ height }) {
    return (
        <div
            aria-hidden="true"
            className="w-100 d-flex align-items-center justify-content-center bg-light"
            style={{
                height,
                background:
                    "linear-gradient(100deg,#edf1f4 40%,#f9fbfc 50%,#edf1f4 60%)",
                backgroundSize: "200% 100%",
                animation: "shimmer 1.2s infinite linear",
            }}
        >
            <span className="text-muted small fst-italic">Đang tải…</span>
        </div>
    );
}
