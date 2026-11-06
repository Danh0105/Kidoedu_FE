import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import salePlaceholder from "../../../assets/user/bannersale.png";
import "../../../components/admin/css/PromotionBannerTab.css";
import ProductCard from "../../../components/user/HomePage/ProductCard";
import { fetchBannersApi } from "../../../services/Banner";
export default function PromotionBannerTab({ promotions = [] }) {
    const [banners, setBanners] = useState([]);
    const fileInputRefs = useRef({});
    const [bannerImages, setBannerImages] = useState({});
    const getBanner = (id) => banners?.find((b) => b.id === id);
    const frameproductN = getBanner(10);
    /* ===============================
        OPEN FILE INPUT
    =============================== */
    const openFileDialog = (promotionId, displayOrder) => {
        const key = `${promotionId}_${displayOrder}`;
        fileInputRefs.current[key]?.click();
    };
    const loadBanners = async () => {
        try {
            const data = await fetchBannersApi();
            setBanners(data);
        } catch (e) {
            console.error("fetchBanners error:", e);
        }
    };
    useEffect(() => {
        loadBanners();
    }, []);
    /* ===============================
        UPLOAD IMAGE
    =============================== */
    const handleFileChange = async (e, promotionId, displayOrder) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const formData = new FormData();
        formData.append("promotionId", promotionId);
        formData.append("bannerImage", file);
        formData.append("displayOrder", displayOrder);

        try {
            const { data } = await axios.post(
                `${process.env.REACT_APP_API_URL}/promotion-banners/upload`,
                formData
            );

            setBannerImages((prev) => ({
                ...prev,
                [promotionId]: {
                    ...prev[promotionId],
                    [displayOrder]: data.imageUrl,
                },
            }));
        } catch (error) {
            console.error(error.response?.data || error.message);
        }
    };
    const products = [
        {
            "productId": 90,
            "productName": "BÀN HỌC DÀI PHÒNG STEM",
            "shortDescription": "<ol><li data-list=\"bullet\"><span class=\"ql-ui\" contenteditable=\"false\"></span>Bàn học <strong>dạng dài</strong>, phù hợp học tập và <strong>làm việc nhóm</strong> trong phòng STEM.</li><li data-list=\"bullet\"><span class=\"ql-ui\" contenteditable=\"false\"></span>Mặt bàn rộng, thuận tiện <strong>thực hành, lắp ráp mô hình, robot</strong>.</li><li data-list=\"bullet\"><span class=\"ql-ui\" contenteditable=\"false\"></span>Kết cấu <strong>chắc chắn, an toàn</strong>, sử dụng bền bỉ.</li><li data-list=\"bullet\"><span class=\"ql-ui\" contenteditable=\"false\"></span>Dễ bố trí trong <strong>phòng STEM, phòng học thực hành</strong>.</li><li data-list=\"bullet\"><span class=\"ql-ui\" contenteditable=\"false\"></span>Tạo không gian học tập <strong>năng động, sáng tạo</strong> cho học sinh.</li></ol>",
            "longDescription": "<p><strong>ƯU ĐIỂM NỔI BẬT</strong></p><ol><li data-list=\"bullet\" class=\"ql-indent-1\"><span class=\"ql-ui\" contenteditable=\"false\"></span>Thiết kế bàn dài, tối ưu cho học tập theo nhóm và hoạt động STEM.</li><li data-list=\"bullet\" class=\"ql-indent-1\"><span class=\"ql-ui\" contenteditable=\"false\"></span>Mặt bàn rộng, phẳng, thuận tiện lắp ráp mô hình, robot, thí nghiệm.</li><li data-list=\"bullet\" class=\"ql-indent-1\"><span class=\"ql-ui\" contenteditable=\"false\"></span>Kết cấu chắc chắn, chịu lực tốt, đảm bảo an toàn cho học sinh.</li><li data-list=\"bullet\" class=\"ql-indent-1\"><span class=\"ql-ui\" contenteditable=\"false\"></span>Dễ sắp xếp, linh hoạt bố trí trong nhiều không gian học tập.</li><li data-list=\"bullet\" class=\"ql-indent-1\"><span class=\"ql-ui\" contenteditable=\"false\"></span>Màu sắc tươi sáng, tạo môi trường học tập sáng tạo, tích cực.</li></ol><p><strong>ỨNG DỤNG</strong></p><ol><li data-list=\"bullet\" class=\"ql-indent-1\"><span class=\"ql-ui\" contenteditable=\"false\"></span>Phòng học STEM</li><li data-list=\"bullet\" class=\"ql-indent-1\"><span class=\"ql-ui\" contenteditable=\"false\"></span>Phòng học thực hành, phòng sáng tạo</li><li data-list=\"bullet\" class=\"ql-indent-1\"><span class=\"ql-ui\" contenteditable=\"false\"></span>Lớp học thông minh</li><li data-list=\"bullet\" class=\"ql-indent-1\"><span class=\"ql-ui\" contenteditable=\"false\"></span>Hoạt động học tập nhóm, trải nghiệm – nghiên cứu</li><li data-list=\"bullet\" class=\"ql-indent-1\"><span class=\"ql-ui\" contenteditable=\"false\"></span>Trưng bày và thực hành mô hình giáo dục</li></ol><p><strong>BẢNG MÔ TẢ KỸ THUẬT – BÀN HỌC DÀI PHÒNG STEM</strong></p><table><tbody><tr><td data-row=\"1\" class=\"ql-align-center\"><strong>Thông số</strong></td><td data-row=\"1\" class=\"ql-align-center\"><strong>Mô tả</strong></td></tr></tbody></table><p><br></p><table><tbody><tr><td data-row=\"2\">Tên sản phẩm</td><td data-row=\"2\">Bàn học dài phòng STEM</td></tr><tr><td data-row=\"3\">Loại sản phẩm</td><td data-row=\"3\">Bàn học tập – thực hành</td></tr><tr><td data-row=\"4\">Kiểu dáng</td><td data-row=\"4\">Bàn dài</td></tr><tr><td data-row=\"5\">Chất liệu mặt bàn</td><td data-row=\"5\">Gỗ công nghiệp phủ Melamine</td></tr><tr><td data-row=\"6\">Khung bàn</td><td data-row=\"6\">Kim loại sơn tĩnh điện</td></tr><tr><td data-row=\"7\">Màu sắc</td><td data-row=\"7\">Nhiều màu</td></tr><tr><td data-row=\"8\">Kết cấu</td><td data-row=\"8\">Chắc chắn, ổn định</td></tr><tr><td data-row=\"9\">Khả năng chịu lực</td><td data-row=\"9\">Phù hợp cho học tập và thực hành</td></tr><tr><td data-row=\"10\">Đối tượng sử dụng</td><td data-row=\"10\">Học sinh, giáo viên</td></tr><tr><td data-row=\"11\">Không gian sử dụng</td><td data-row=\"11\">Phòng STEM, phòng học, phòng thực hành</td></tr><tr><td data-row=\"12\">Mục đích sử dụng</td><td data-row=\"12\">Học tập, làm việc nhóm, thực hành STEM</td></tr></tbody></table>",
            "status": 7,
            "origin": "",
            "userManual": null,
            "cautionNotes": null,
            "categoryId": 40,
            "images": [
                {
                    "imageId": 471,
                    "imageUrl": "/uploads/90c4d036-1ec1-4848-9996-184da1edef72.jpg",
                    "altText": "",
                    "isPrimary": true,
                    "publicId": null
                }
            ],
            "variants": [
                {
                    "variantId": 121,
                    "productId": 90,
                    "variantName": "Bàn học dài",
                    "sku": "BN-HC-DI-27356",
                    "barcode": "",
                    "status": 1,
                    "specs": [],
                    "createdAt": "2026-01-22T06:39:58.289Z",
                    "updatedAt": "2026-01-22T06:40:11.798Z",
                    "prices": [
                        {
                            "priceId": 877,
                            "variantId": 121,
                            "priceType": "base",
                            "currencyCode": "VND",
                            "price": "4500000.00",
                            "startAt": "2026-01-21T23:39:58.295Z",
                            "endAt": null,
                            "createdAt": "2026-01-22T06:40:11.801Z"
                        },
                        {
                            "priceId": 878,
                            "variantId": 121,
                            "priceType": "promo",
                            "currencyCode": "VND",
                            "price": "3600000.00",
                            "startAt": "2026-01-22T06:39:00.000Z",
                            "endAt": "2026-01-29T06:39:00.000Z",
                            "createdAt": "2026-01-22T06:40:11.804Z"
                        }
                    ],
                    "imageUrl": "/uploads/348129e6-c7ec-4b7f-9aaa-2ea528223a34.jpg"
                }
            ],
            "createdAt": "2026-01-22T06:39:58.276Z",
            "updatedAt": "2026-01-22T06:40:11.789Z"
        }
    ];

    return (
        <div className="row">
            {promotions.map((promo) => {
                const promotionId = promo.id;

                const mainImage =
                    bannerImages[promotionId]?.[0] ||
                    promo.banners?.[0]?.imageUrl ||
                    salePlaceholder;

                const bgImage =
                    bannerImages[promotionId]?.[1] ||
                    promo.banners?.find(b => b.displayOrder === 1)?.imageUrl ||
                    "";

                const mainImageUrl =
                    mainImage?.startsWith("/uploads")
                        ? `${process.env.REACT_APP_API_URL}${mainImage}`
                        : mainImage;


                const bgImageUrl =
                    bgImage && !bgImage.startsWith("http")
                        ? `${process.env.REACT_APP_API_URL}${bgImage}`
                        : bgImage;

                return (
                    <div key={promotionId} className="col mb-3">
                        <div className="card h-100">
                            <div className="card-body text-center">
                                <h6 className="fw-bold">{promo.name}</h6>

                                {/* Banner chính */}
                                <img
                                    src={mainImageUrl}
                                    alt="main-banner"
                                    className="image-promotion-banner"
                                    style={{ cursor: "pointer" }}
                                    onClick={() => openFileDialog(promotionId, 0)}
                                />

                                {/* Section background */}
                                <section
                                    className="bg-product-featured p-2 mt-2"
                                    style={{
                                        height: "490px",
                                        backgroundImage: bgImageUrl
                                            ? `url(${bgImageUrl})`
                                            : "none",
                                        backgroundSize: "cover",
                                        backgroundPosition: "center",
                                        cursor: "pointer",
                                        position: "relative",
                                        zIndex: 1,
                                    }}
                                    onClick={() => openFileDialog(promotionId, 1)}
                                >
                                    {!bgImageUrl && (
                                        <div className="text-muted" >
                                            <div className="row justify-content-center">
                                                {products.map((p) => (
                                                    <ProductCard
                                                        key={p.productId}
                                                        p={p}
                                                        banners={frameproductN}
                                                        className="col-12 col-sm-6 col-md-4 col-lg-3 mb-4"
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </section>

                                {/* Input cho banner chính */}
                                <input
                                    type="file"
                                    hidden
                                    accept="image/*"
                                    ref={(el) =>
                                    (fileInputRefs.current[
                                        `${promotionId}_0`
                                    ] = el)
                                    }
                                    onChange={(e) =>
                                        handleFileChange(e, promotionId, 0)
                                    }
                                />

                                {/* Input cho background */}
                                <input
                                    type="file"
                                    hidden
                                    accept="image/*"
                                    ref={(el) =>
                                    (fileInputRefs.current[
                                        `${promotionId}_1`
                                    ] = el)
                                    }
                                    onChange={(e) =>
                                        handleFileChange(e, promotionId, 1)
                                    }
                                />
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
