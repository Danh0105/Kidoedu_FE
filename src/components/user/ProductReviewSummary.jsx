import React from "react";
import "./css/ProductReviewSummary.css";

export default function ProductReviewSummary({
    average = 4.9,
    total = 69,
    distribution = {
        5: 62,
        4: 5,
        3: 2,
        2: 0,
        1: 0,
    },
}) {
    const max = Math.max(...Object.values(distribution), 1);

    const renderStars = (count) =>
        Array.from({ length: 5 }).map((_, i) => (
            <i
                key={i}
                className={`bi ${i < count ? "bi-star-fill text-warning" : "bi-star text-secondary"
                    }`}
            />
        ));

    return (
        <div className="review-box p-4">
            <h5 className="fw-bold mb-3">Đánh giá sản phẩm</h5>

            <div className="row align-items-center">
                {/* LEFT */}
                <div className="col-md-4 text-center border-end">
                    <div className="review-score">
                        {average} <span>/ 5</span>
                    </div>

                    <div className="review-stars my-2">
                        {renderStars(Math.round(average))}
                    </div>

                    <div className="text-muted">{total} đánh giá</div>
                </div>

                {/* RIGHT */}
                <div className="col-md-8">
                    {[5, 4, 3, 2, 1].map((star) => {
                        const value = distribution[star] || 0;
                        const percent = (value / max) * 100;

                        return (
                            <div
                                key={star}
                                className="d-flex align-items-center gap-2 mb-2"
                            >
                                <span className="small fw-bold">{star}</span>
                                <i className="bi bi-star-fill text-warning small"></i>

                                <div className="progress flex-grow-1 review-progress">
                                    <div
                                        className="progress-bar bg-warning"
                                        style={{ width: `${percent}%` }}
                                    />
                                </div>

                                <span className="small text-muted">{value}</span>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* BUTTONS */}
            <div className="d-flex gap-3 mt-4">
                <button className="btn btn-primary rounded-pill px-4">
                    ✏ Viết đánh giá / hỏi đáp ngay
                </button>

                <button className="btn btn-outline-primary rounded-pill px-4">
                    Xem thêm những đánh giá / hỏi đáp khác →
                </button>
            </div>
        </div>
    );
}