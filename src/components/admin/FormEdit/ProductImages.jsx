import React, { useCallback, useEffect, useRef, useState } from 'react';
import Slider from 'react-slick';

import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import '../css/Image.css';

const PLACEHOLDER =
    'https://placehold.co/600x400?text=No+Image';

/**
 * ProductImages – component dùng chung
 *
 * @param {Array}  value      Danh sách ảnh [{ src, file?, altText?, isPrimary }]
 * @param {Func}   onChange   (nextImages) => void
 * @param {Boolean} editable Cho phép chỉnh sửa (admin)
 * @param {Boolean} allowUpload
 * @param {Boolean} allowRemove
 * @param {Boolean} showPrimaryBadge
 * @param {Number} maxImages
 */
export default function ProductImages({
    form, setForm
}) {
    const [localImages, setLocalImages] = useState([]);
    const [navMain, setNavMain] = useState(null);
    const [navThumb, setNavThumb] = useState(null);
    const fileInputRef = useRef(null);

    /* ===================== sync from parent ===================== */
    // Đồng bộ hình ảnh lên form cha (camelCase)
    const syncImagesToParent = useCallback(
        (images) => {
            const apiImages = images.map((img) => ({
                src: img.src,
                altText: img.altText || '',
                isPrimary: img.isPrimary || false,
                file: img.file || undefined,
                publicId: img.publicId || null,
                imageId: img.imageId || null,
            }));

            setForm((prev) => ({ ...prev, images: apiImages }));
            setLocalImages(images);
        },
        [setForm]
    );

    // Khởi tạo từ form.images (camelCase)
    useEffect(() => {
        if (Array.isArray(form.images) && form.images.length > 0) {
            const initialized = form.images.map((img) => ({
                src: img.src || img.imageUrl || '',
                file: undefined,
                altText: img.altText || '',
                isPrimary: img.isPrimary,
                publicId: img.publicId || null,
                imageId: img.imageId || null,
            }));

            setLocalImages(initialized);
        } else {
            setLocalImages([]);
        }
    }, [form.images]);

    // Xóa ảnh
    const handleRemove = (index) => {
        const newImages = localImages.filter((_, i) => i !== index);

        // đảm bảo ảnh đầu tiên là ảnh chính
        if (newImages.length > 0) {
            newImages.forEach((img, i) => (img.isPrimary = i === 0));
        }

        syncImagesToParent(newImages);
    };

    // Mở chọn file
    const handleClickUpload = () => fileInputRef.current?.click();

    // Upload file
    const handleFileChange = (e) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        const promises = Array.from(files).map((file) => {
            return new Promise((resolve) => {
                const reader = new FileReader();
                reader.onload = () =>
                    resolve({
                        src: reader.result,
                        file,
                        altText: file.name.split('.').slice(0, -1).join('.'),
                        isPrimary: false,
                        publicId: null,
                        imageId: null,
                    });
                reader.readAsDataURL(file);
            });
        });

        Promise.all(promises).then((newImages) => {
            const merged = [...localImages, ...newImages];

            merged.forEach((img, i) => (img.isPrimary = i === 0));

            syncImagesToParent(merged);
            e.target.value = '';
        });
    };

    // Đặt ảnh chính
    const setPrimary = (index) => {
        const updated = localImages.map((img, i) => ({
            ...img,
            isPrimary: i === index,
        }));
        console.log(updated);

        setLocalImages(updated);
        syncImagesToParent(updated);

        // thumbnail click → slider chính nhảy theo
        if (navMain?.slickGoTo) {
            navMain.slickGoTo(index);
        }
    };

    /* ===================== slider settings ===================== */
    const mainSettings = {
        arrows: true,
        fade: true,
        dots: false,
        adaptiveHeight: true,
        asNavFor: navThumb,
        ref: setNavMain,
    };

    const thumbSettings = {
        slidesToShow: 5,
        swipeToSlide: true,
        focusOnSelect: true,
        arrows: true,
        infinite: false,
        asNavFor: navMain,
        ref: setNavThumb,
        responsive: [
            { breakpoint: 1200, settings: { slidesToShow: 4 } },
            { breakpoint: 768, settings: { slidesToShow: 3 } },
            { breakpoint: 576, settings: { slidesToShow: 2 } },
        ],
    };

    /* ===================== render ===================== */
    return (
        <>
            <div className="mb-2 fw-bold">Hình ảnh sản phẩm</div>

            {/* ================= MAIN SLIDER ================= */}
            <div className="main-slider mb-4">
                {localImages.length > 0 ? (
                    <Slider {...mainSettings}>
                        {localImages.map((img, idx) => (
                            <div key={idx} className="text-center px-2">

                                <img
                                    src={img.src.startsWith('data:') ? img.src : process.env.REACT_APP_API_URL + img.src}
                                    alt={img.altText || `Ảnh ${idx + 1}`}
                                    className="img-fluid rounded shadow-sm"
                                    style={{
                                        maxHeight: 450,
                                        width: '100%',
                                        objectFit: 'contain',
                                        background: '#fff',
                                    }}
                                />
                            </div>
                        ))}
                    </Slider>
                ) : (
                    <div
                        className="border border-dashed rounded-3 d-flex align-items-center justify-content-center bg-light text-muted"
                        style={{ height: '300px', cursor: 'pointer' }}
                        onClick={handleClickUpload}
                    >
                        <div className="text-center">
                            <i className="bi bi-image fs-1"></i>
                            <p className="mt-3 fs-5">Nhấp để upload hình ảnh sản phẩm</p>
                        </div>
                    </div>
                )}
            </div>

            {/* ================= FILE INPUT ================= */}
            <input
                type="file"
                multiple
                accept="image/*"
                ref={fileInputRef}
                style={{ display: 'none' }}
                onChange={handleFileChange}
            />

            {localImages.length > 0 && (
                <div className="thumbnail-section mt-4">
                    <Slider {...thumbSettings} className="thumbnail-slider-big">

                        {localImages.map((img, idx) => (
                            <div key={idx}>
                                <div className="position-relative rounded-3 overflow-hidden shadow-lg">
                                    <img
                                        src={img.src.startsWith('data:') ? img.src : process.env.REACT_APP_API_URL + img.src}
                                        alt={img.altText || `Ảnh ${idx + 1}`}
                                        className="img-fluid rounded-3"
                                        style={{
                                            height: '100px',
                                            width: '100%',
                                            maxWidth: '420px',
                                            objectFit: 'cover',
                                            border: img.isPrimary ? '5px solid #0d6efd' : '3px solid #e9ecef',
                                            boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
                                            transition: 'all 0.3s ease',
                                            cursor: 'pointer',
                                        }}
                                        onClick={() => setPrimary(idx)}
                                        onMouseEnter={(e) => (e.target.style.transform = 'translateY(-4px)')}
                                        onMouseLeave={(e) => (e.target.style.transform = 'translateY(0)')}
                                    />

                                    {img.isPrimary && (
                                        <div className="position-absolute bottom-0 start-0 end-0 bg-primary text-white text-center py-2 rounded-bottom"
                                            style={{ fontWeight: 'bold', fontSize: '14px' }}>
                                            Ảnh chính
                                        </div>
                                    )}

                                    <a
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleRemove(idx);
                                        }}
                                        className="btn btn-danger btn-sm rounded-circle position-absolute top-0 end-0 m-2 shadow"
                                        style={{ width: '36px', height: '36px', fontSize: '18px' }}
                                    >
                                        ×
                                    </a>
                                </div>
                            </div>
                        ))}

                    </Slider>

                    <div className="text-center mt-4">
                        <a className="btn btn-outline-primary px-2 py-1 mb-2" onClick={handleClickUpload}>
                            + Thêm ảnh
                        </a>
                    </div>
                </div>
            )}
        </>
    );
}
