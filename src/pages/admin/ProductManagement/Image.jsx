import React, { useRef, useState } from 'react'
import InnerImageZoom from 'react-inner-image-zoom';
import Slider from 'react-slick';

export default function Image({ onChange, onRemove }) {
  const [nav1, setNav1] = useState(null);
  const [nav2, setNav2] = useState(null);
  const [files, setFiles] = useState([]);


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
  const [images, setImages] = useState([]); // lưu nhiều ảnh

  const handleClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Trong handleFileChange của Image
  const handleFileChange = (event) => {
    const files = Array.from(event.target.files); // nhiều file
    if (onChange) {
      onChange(files); // Trả về mảng file
    }
    // vẫn giữ phần preview ảnh
    const readers = files.map((file) => {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.readAsDataURL(file);
      });
    });

    Promise.all(readers).then((newImages) => {
      setImages((prev) => [...prev, ...newImages]);
    });

    event.target.value = "";
  };

  const handleRemove = (idx) => {
    const removedFile = files[idx];

    // xóa trong local state
    setImages((prev) => prev.filter((_, i) => i !== idx));
    setFiles((prev) => prev.filter((_, i) => i !== idx));

    // báo cho component cha biết file nào đã bị xóa
    if (onRemove) {
      onRemove(removedFile, idx);
    }
  };
  return (
    <>
      <div className='d-flex flex-start mt-2 mb-2'> <span >Hình ảnh sản phẩm</span></div>
      <div className="product-slider">

        <Slider
          {...mainSettings}
          asNavFor={nav2}
          ref={(slider1) => setNav1(slider1)}
          style={{ maxWidth: "350px", margin: "0 auto" }}
        >
          {images.length > 0 ? (
            images.map((src, idx) => (

              <div key={idx} style={{ maxHeight: "300px" }}>
                <InnerImageZoom
                  src={src}
                  zoomSrc={src}
                  zoomType="hover"
                  zoomScale={1.5}
                  alt={`Ảnh ${idx}`}
                  className="img-fluid"
                  style={{
                    maxHeight: "300px",
                    objectFit: "contain",
                  }}
                />
              </div>
            ))
          ) : (
            <div>
              <div
                style={{
                  maxHeight: "300px",
                  height: "300px",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  border: "1px solid #ddd",
                  borderRadius: "4px",
                  backgroundColor: "#f8f9fa",
                  color: "#888",
                }}
              >
                <button onClick={handleClick} className='btn btn-outline-secondary'>Thêm ảnh</button>
              </div>
            </div>
          )}

        </Slider>
        <input
          type="file"
          multiple
          ref={fileInputRef}
          style={{ display: "none" }}
          onChange={handleFileChange}
        />
        {/* Slider thumbnail */}
        <div className="mt-3">
          <Slider
            {...thumbSettings}
            asNavFor={nav1}
            ref={(slider2) => setNav2(slider2)}
          >
            {images.length > 0 ? (
              images.map((src, idx) => (
                <div key={idx} style={{ padding: "5px" }}>
                  <div style={{ position: "relative" }}>
                    <input
                      className="form-check-input"
                      type="radio"
                      name="category-radio"
                      style={{
                        position: "absolute",
                        top: "5px",
                        left: "5px",
                        color: "#fff",
                        border: "solid 1px #ddd",
                        borderRadius: "50%",
                        width: "22px",
                        height: "22px",
                        cursor: "pointer",
                        fontSize: "14px",
                        lineHeight: "20px",
                        textAlign: "center",
                        zIndex: 10, // đảm bảo nổi lên trên ảnh
                      }}
                    />
                    {/* ảnh */}
                    <img
                      src={src}
                      alt={`Thumb ${idx}`}
                      className="img-fluid"
                      style={{
                        height: "100px",
                        objectFit: "contain",
                        border: "1px solid #ddd",
                        borderRadius: "4px",
                        cursor: "pointer",
                        width: "100%",
                      }}
                    />

                    {/* nút close */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setImages((prev) => prev.filter((_, i) => i !== idx));
                        handleRemove(idx);
                      }}
                      style={{
                        position: "absolute",
                        top: "5px",
                        right: "5px",
                        background: "rgba(0,0,0,0.6)",
                        color: "#fff",
                        border: "none",
                        borderRadius: "50%",
                        width: "22px",
                        height: "22px",
                        cursor: "pointer",
                        fontSize: "14px",
                        lineHeight: "20px",
                        textAlign: "center",
                        zIndex: 10, // đảm bảo nổi lên trên ảnh
                      }}
                    >
                      ×
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div
                style={{
                  height: "100px",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  border: "1px solid #ddd",
                  borderRadius: "4px",
                  backgroundColor: "#f8f9fa",
                  color: "#888",
                }}
              >
                No Image
              </div>
            )}
          </Slider>
        </div>
      </div>
    </>

  )
}
