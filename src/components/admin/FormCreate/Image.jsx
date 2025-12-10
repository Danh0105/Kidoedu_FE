import React, { useRef, useState, useEffect } from 'react'
import InnerImageZoom from 'react-inner-image-zoom';
import Slider from 'react-slick';

// PLACEHOLDER_IMG nếu cần
const PLACEHOLDER_IMG = 'https://placehold.co/350x300?text=No+Image';

// Props:
// - onChange(filesArray, primaryIndex)  // filesArray: Array<File>, primaryIndex: number|null
// - onRemove(removedFile, idx)
// - initialImages: optional array of { image_url, alt_text, is_primary } (server-side images)
export default function Image({ onChange, onRemove, initialImages = [] }) {
  const [nav1, setNav1] = useState(null);
  const [nav2, setNav2] = useState(null);

  // state chính
  // files holds File objects for new uploads
  const [files, setFiles] = useState([]);
  // images holds both preview local images and optional server images
  // shape: { src, file?, is_primary, remote?: boolean, image_url?, alt_text? }
  const [images, setImages] = useState([]);

  // refs để luôn có giá trị mới nhất trong callback (tránh stale closure)
  const filesRef = useRef([]);
  const imagesRef = useRef([]);

  // keep refs in sync whenever state changes
  const setFilesAndRef = (nextFiles) => {
    filesRef.current = nextFiles;
    setFiles(nextFiles);
  };
  const setImagesAndRef = (nextImages) => {
    imagesRef.current = nextImages;
    setImages(nextImages);
  };
  const handleClickUpload = () => fileInputRef.current?.click();

  // nếu có initialImages (ví dụ edit product), map thành images array at mount
  useEffect(() => {
    if (Array.isArray(initialImages) && initialImages.length) {
      const mapped = initialImages.map((it, idx) => ({
        src: it.image_url || it.src,
        file: undefined,
        is_primary: idx === 0,   // ✅ luôn set ảnh đầu tiên làm primary
        remote: true,
        image_url: it.image_url || null,
        alt_text: it.alt_text || null,
      }));

      setImagesAndRef(mapped);
      setFilesAndRef([]);
      // notify parent that there are no local files but there is a primary index
      const primaryIndex = mapped.findIndex((m) => m.is_primary);
      if (onChange) onChange([], primaryIndex === -1 ? null : primaryIndex);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const mainSettings = {
    arrows: true,
    fade: true,
    dots: false,
  };

  const thumbSettings = {
    slidesToShow: 4,
    swipeToSlide: true,
    focusOnSelect: true,
    arrows: false,
    dots: false,
  };
  const fileInputRef = useRef(null);

  const handleClick = () => fileInputRef.current?.click();

  const handleFileChange = (event) => {
    const newFiles = Array.from(event.target.files || []);
    if (!newFiles.length) return;

    // tạo preview dataURL cho mỗi file
    const readers = newFiles.map((file) =>
      new Promise((resolve) => {
        const r = new FileReader();
        r.onload = () => resolve({ src: r.result, file });
        r.readAsDataURL(file);
      })
    );

    Promise.all(readers).then((newImagesObjs) => {
      // chuẩn bị object ảnh mới (với is_primary nếu chưa có)
      const hasPrimary = imagesRef.current.some((p) => p.is_primary);
      const prepared = newImagesObjs.map((it, i) => ({
        src: it.src,
        file: it.file,
        is_primary: !hasPrimary && i === 0,
        remote: false,
      }));

      // tính merged trước khi setState để tránh stale closure
      const nextImages = [...imagesRef.current, ...prepared];
      const nextFiles = [...filesRef.current, ...newFiles];

      // cập nhật state + ref
      setImagesAndRef(nextImages);
      setFilesAndRef(nextFiles);

      // gọi onChange 1 lần duy nhất với dữ liệu chính xác
      if (onChange) {
        const primaryIndex = nextImages.findIndex((i) => i.is_primary);
        onChange(nextFiles, primaryIndex === -1 ? null : primaryIndex);
      }

      // reset input
      event.target.value = '';
    });
  };

  const setPrimary = (idx) => {
    const prev = imagesRef.current;
    if (!prev.length) return;
    const updated = prev.map((img, i) => ({ ...img, is_primary: i === idx }));
    setImagesAndRef(updated);

    // notify parent với files hiện tại và primary index
    if (onChange) onChange(filesRef.current, idx);
  };

  const handleRemove = (idx) => {
    const removed = imagesRef.current[idx];
    const removedFile = removed?.file; // may be undefined for remote images

    // tính updated arrays trước
    const nextImages = imagesRef.current.filter((_, i) => i !== idx);
    // nếu ảnh bị xóa là primary -> set ảnh đầu tiên còn lại thành primary
    const hadPrimaryRemoved = imagesRef.current[idx]?.is_primary;
    if (hadPrimaryRemoved && nextImages.length > 0) {
      nextImages[0] = { ...nextImages[0], is_primary: true };
    }

    // nếu removed had local file thì cập nhật files array
    const nextFiles = filesRef.current.filter((f) => f !== removedFile);

    // cập nhật state + ref
    setImagesAndRef(nextImages);
    setFilesAndRef(nextFiles);

    // notify parent
    const newPrimaryIdx = nextImages.findIndex((i) => i.is_primary);
    if (onChange) onChange(nextFiles, newPrimaryIdx === -1 ? null : newPrimaryIdx);
    if (onRemove) onRemove(removedFile, idx);
  };

  const primaryImageSrc = images.find((i) => i.is_primary)?.src || images[0]?.src || PLACEHOLDER_IMG;

  // wrapper ref bao cả main + thumb sliders
  const sliderWrapRef = useRef(null);

  const handleBeforeChange = () => {
    const active = document.activeElement;
    if (!active) return;
    if (sliderWrapRef.current && sliderWrapRef.current.contains(active)) {
      if (active !== document.body) active.blur();
    }
  };

  return (
    <>
      <div className="d-flex flex-start mt-2 mb-2"><span>Hình ảnh sản phẩm</span></div>
      <div className="product-slider" ref={sliderWrapRef}>
        <Slider
          {...mainSettings}
          asNavFor={nav2}
          ref={(s) => setNav1(s)}
          style={{ maxWidth: '350px', margin: '0 auto' }}
          beforeChange={handleBeforeChange}
        >
          {images.length > 0 ? (
            images.map((img, idx) => (
              <div key={idx} style={{ maxHeight: '300px' }}>
                <InnerImageZoom
                  src={img.src}
                  zoomSrc={img.src}
                  zoomType="hover"
                  zoomScale={1.5}
                  alt={`Ảnh ${idx}`}
                  className="img-fluid"
                  style={{ maxHeight: '250px', objectFit: 'contain' }}
                />
              </div>
            ))
          ) : (
            <div>
              <div
                style={{
                  maxHeight: '300px',
                  height: '300px',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  backgroundColor: '#f8f9fa',
                  color: '#888',
                }}
              >
                <a onClick={handleClick} className="btn btn-outline-secondary">Thêm ảnh</a>
              </div>
            </div>
          )}
        </Slider>

        <input type="file" multiple ref={fileInputRef} style={{ display: 'none' }} onChange={handleFileChange} />

        <div className="">
          <Slider
            {...thumbSettings}
            asNavFor={nav1}
            ref={(s) => setNav2(s)}
            beforeChange={handleBeforeChange}
          >
            {images.length > 0 ? (
              images.map((img, idx) => (
                <div key={idx} style={{ padding: '5px' }}>
                  <div style={{ position: 'relative' }}>
                    <input
                      className="form-check-input"
                      type="radio"
                      name="primary-image-radio"
                      checked={!!img.is_primary}
                      onChange={() => setPrimary(idx)}
                      tabIndex={img.is_primary ? 0 : -1}
                      aria-label={`Chọn ảnh ${idx + 1} là ảnh chính`}
                      style={{
                        position: 'absolute',
                        top: '5px',
                        left: '5px',
                        zIndex: 10,
                        width: '22px',
                        height: '22px',
                        cursor: 'pointer',
                      }}
                    />
                    <img
                      src={img.src}
                      alt={img.alt_text || `Thumb ${idx}`}
                      className="img-fluid"
                      style={{
                        height: '100px',
                        objectFit: 'contain',
                        border: img.is_primary ? '2px solid #007bff' : '1px solid #ddd',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        width: '100%',
                      }}
                      onClick={() => setPrimary(idx)}
                    />

                    <a
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemove(idx);
                      }}
                      style={{
                        position: 'absolute',
                        top: '5px',
                        right: '5px',
                        background: 'rgba(0,0,0,0.6)',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '50%',
                        width: '22px',
                        height: '22px',
                        cursor: 'pointer',
                        fontSize: '14px',
                        lineHeight: '20px',
                        textAlign: 'center',
                        zIndex: 10,
                      }}
                    >
                      ×
                    </a>
                  </div>

                </div>
              ))
            ) : (
              <div
                style={{
                  height: '100px',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  backgroundColor: '#f8f9fa',
                  color: '#888',
                }}
              >
                No Image
              </div>
            )}
          </Slider>
          {images.length > 0 ? (
            <div className="text-center mt-4">
              <a className="btn btn-outline-primary px-2 py-1 mb-2" onClick={handleClickUpload}>
                + Thêm ảnh
              </a>
            </div>) : null}
        </div>
      </div>
    </>
  );
}
