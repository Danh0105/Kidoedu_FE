import React, { useEffect, useState } from "react";

function useIsMobile(query = "(max-width: 768px)") {
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== "undefined" ? window.matchMedia(query).matches : false
  );

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mql = window.matchMedia(query);
    const handler = (e) => setIsMobile(e.matches);
    mql.addEventListener?.("change", handler);
    // Safari cũ
    mql.addListener?.(handler);
    return () => {
      mql.removeEventListener?.("change", handler);
      mql.removeListener?.(handler);
    };
  }, [query]);

  return isMobile;
}

export default function MobileBlocker({
  minWidthText = ">= 769px",
  message = "Website hiện chưa hỗ trợ trên thiết bị di động. Vui lòng truy cập bằng máy tính.",
}) {
  const isMobile = useIsMobile();

  if (!isMobile) return null;

  return (
    <div style={styles.backdrop}>
      <div style={styles.card}>
        <div style={styles.icon} aria-hidden>📵</div>
        <h2 style={styles.title}>Không hỗ trợ trên di động</h2>
        <p style={styles.desc}>
          {message} (Khuyến nghị màn hình {minWidthText})
        </p>
        <button
          style={styles.btn}
          onClick={() => (window.location.href = "khoi.jacky@gmail.com")}
        >
          Liên hệ hỗ trợ
        </button>
      </div>
    </div>
  );
}

const styles = {
  backdrop: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.6)",
    display: "grid",
    placeItems: "center",
    zIndex: 9999,
  },
  card: {
    background: "#fff",
    width: "min(92vw, 520px)",
    borderRadius: "16px",
    padding: "24px",
    textAlign: "center",
    boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
  },
  icon: { fontSize: "48px", marginBottom: 12 },
  title: { margin: "8px 0 4px", fontSize: 20 },
  desc: { margin: "8px 0 16px", color: "#444" },
  btn: {
    border: "none",
    background: "#111827",
    color: "#fff",
    padding: "10px 16px",
    borderRadius: "10px",
    cursor: "pointer",
  },
};
