import React, { useRef, useState, useEffect } from 'react';
import Slider from 'react-slick';
import '../css/Image.css';

const PLACEHOLDER_IMG = 'https://placehold.co/350x300?text=No+Image';

export default function Image({ onChange, onRemove, initialImages = [] }) {
  const [images, setImages] = useState([]);
  const [files, setFiles] = useState([]);

  const imagesRef = useRef([]);
  const filesRef = useRef([]);

  const [navMain, setNavMain] = useState(null);
  const [navThumb, setNavThumb] = useState(null);

  const fileInputRef = useRef(null);

  /* ====================== helpers ====================== */
  const setImagesAndRef = (data) => {
    imagesRef.current = data;
    setImages(data);
  };

  const setFilesAndRef = (data) => {
    filesRef.current = data;
    setFiles(data);
  };

  const notifyParent = (nextImages, nextFiles) => {
    const primaryIndex = nextImages.findIndex((i) => i.is_primary);
    if (onChange) {
      onChange(nextFiles, primaryIndex === -1 ? null : primaryIndex);
    }
  };

  /* ====================== init from server ====================== */
  useEffect(() => {
    if (!initialImages.length) return;

    const mapped = initialImages.map((img, idx) => ({
      src: img.image_url || img.src,
      file: undefined,
      is_primary: idx === 0,
      remote: true,
      image_url: img.image_url || null,
      alt_text: img.alt_text || '',
    }));

    setImagesAndRef(mapped);
    setFilesAndRef([]);
    notifyParent(mapped, []);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ====================== upload ====================== */
  const handleUpload = (e) => {
    const newFiles = Array.from(e.target.files || []);
    if (!newFiles.length) return;

    const readers = newFiles.map(
      (file) =>
        new Promise((resolve) => {
          const r = new FileReader();
          r.onload = () => resolve({ src: r.result, file });
          r.readAsDataURL(file);
        })
    );

    Promise.all(readers).then((results) => {
      const hasPrimary = imagesRef.current.some((i) => i.is_primary);

      const prepared = results.map((r, idx) => ({
        src: r.src,
        file: r.file,
        is_primary: !hasPrimary && idx === 0,
        remote: false,
      }));

      const nextImages = [...imagesRef.current, ...prepared];
      const nextFiles = [...filesRef.current, ...newFiles];

      setImagesAndRef(nextImages);
      setFilesAndRef(nextFiles);
      notifyParent(nextImages, nextFiles);

      e.target.value = '';
    });
  };

  /* ====================== set primary ====================== */
  const setPrimary = (idx) => {
    const updated = imagesRef.current.map((img, i) => ({
      ...img,
      is_primary: i === idx,
    }));

    setImagesAndRef(updated);
    notifyParent(updated, filesRef.current);

    if (navMain?.slickGoTo) {
      navMain.slickGoTo(idx);
    }
  };

  /* ====================== remove ====================== */
  const handleRemove = (idx) => {
    const removed = imagesRef.current[idx];
    const nextImages = imagesRef.current.filter((_, i) => i !== idx);
    const nextFiles = filesRef.current.filter((f) => f !== removed?.file);

    if (removed?.is_primary && nextImages.length > 0) {
      nextImages[0] = { ...nextImages[0], is_primary: true };
    }

    setImagesAndRef(nextImages);
    setFilesAndRef(nextFiles);
    notifyParent(nextImages, nextFiles);

    if (onRemove) onRemove(removed?.file, idx);
  };

  /* ====================== slider config ====================== */
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

  /* ====================== render ====================== */
  return (
    <>
      <div className="mb-2 fw-bold">Hình ảnh sản phẩm</div>

      {/* MAIN SLIDER */}
      <div className="mb-4">
        {images.length ? (
          <Slider {...mainSettings}>
            {images.map((img, idx) => (
              <div key={idx} className="text-center px-2">
                <img
                  src={img.src}
                  alt={img.alt_text || `Ảnh ${idx + 1}`}
                  className="img-fluid rounded"
                  style={{
                    maxHeight: 450,
                    objectFit: 'contain',
                    background: '#fff',
                  }}
                />
              </div>
            ))}
          </Slider>
        ) : (
          <div
            className="border rounded d-flex justify-content-center align-items-center bg-light"
            style={{ height: 300, cursor: 'pointer' }}
            onClick={() => fileInputRef.current?.click()}
          >
            + Thêm ảnh
          </div>
        )}
      </div>

      <input
        type="file"
        multiple
        accept="image/*"
        ref={fileInputRef}
        hidden
        onChange={handleUpload}
      />

      {/* THUMBNAILS */}
      {images.length > 0 && (
        <>
          <Slider {...thumbSettings}>
            {images.map((img, idx) => (
              <div key={idx} className="px-2">
                <div className="position-relative">
                  <img
                    src={img.src}
                    alt=""
                    onClick={() => setPrimary(idx)}
                    style={{
                      height: 100,
                      width: '100%',
                      objectFit: 'cover',
                      cursor: 'pointer',
                      border: img.is_primary
                        ? '4px solid #0d6efd'
                        : '2px solid #e9ecef',
                      borderRadius: 6,
                    }}
                  />

                  {img.is_primary && (
                    <div
                      className="position-absolute bottom-0 start-0 end-0 text-center text-white"
                      style={{
                        background: '#0d6efd',
                        fontSize: 12,
                        fontWeight: 600,
                      }}
                    >
                      Ảnh chính
                    </div>
                  )}

                  <button
                    className="btn btn-danger btn-sm position-absolute top-0 end-0 m-1"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemove(idx);
                    }}
                  >
                    ×
                  </button>
                </div>
              </div>
            ))}
          </Slider>

          <div className="text-center mt-3">
            <button
              className="btn btn-outline-primary btn-sm"
              onClick={() => fileInputRef.current?.click()}
            >
              + Thêm ảnh
            </button>
          </div>
        </>
      )}
    </>
  );
}
