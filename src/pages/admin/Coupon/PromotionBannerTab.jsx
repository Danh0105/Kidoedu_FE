import React from 'react';

export default function PromotionBannerTab({ promotions }) {
    return (
        <div className="row">
            {promotions.map(promo => (
                <div key={promo.id} className="col-md-4 mb-3">
                    <div className="card h-100">
                        <div className="card-body">
                            <h6 className="fw-bold">{promo.name}</h6>

                            {promo.bannerUrl ? (
                                <img
                                    src={promo.bannerUrl}
                                    alt=""
                                    className="img-fluid rounded mb-2"
                                />
                            ) : (
                                <div className="text-muted mb-2">
                                    Chưa có banner
                                </div>
                            )}

                            <input
                                type="file"
                                className="form-control"
                                onChange={(e) => {
                                    const file = e.target.files[0];
                                    if (!file) return;

                                    // TODO: gọi API upload banner cho promo.id
                                    console.log('Upload banner cho promotion:', promo.id, file);
                                }}
                            />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
