// CategoryTitle.jsx
import React from "react";

export default function CategoryTitle({ label }) {
    return (
        <div className="py-1">
            <span className="fw-bold lh-lg" style={{ fontSize: 18 }}>
                {label}
            </span>
        </div>
    );
}
