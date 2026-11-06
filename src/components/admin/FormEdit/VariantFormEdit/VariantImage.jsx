import React from "react";

export default function VariantImage({ variant, update }) {

    const handleFile = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        update({
            imageFile: file,
            imageUrl: URL.createObjectURL(file)
        });
    };

    return (
        <div className="col-12">
            <label className="form-label fw-bold small">Hình ảnh</label>

            <div className="d-flex gap-3 align-items-start">

                <div
                    className="border rounded bg-white d-flex justify-content-center align-items-center"
                    style={{ width: 80, height: 80, overflow: "hidden" }}
                >
                    {variant.imageUrl ? (
                        <img
                            src={variant.imageUrl.startsWith("blob:")
                                ? variant.imageUrl
                                : process.env.REACT_APP_API_URL + variant.imageUrl
                            }
                            alt=""
                            style={{ width: "100%", height: "100%", objectFit: "cover" }}
                        />
                    ) : (
                        <span className="text-muted small">No Img</span>
                    )}
                </div>

                <input
                    type="file"
                    className="form-control"
                    accept="image/*"
                    onChange={handleFile}
                />
            </div>
        </div>
    );
}
