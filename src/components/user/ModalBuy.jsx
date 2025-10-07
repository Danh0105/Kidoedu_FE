import InnerImageZoom from 'react-inner-image-zoom';
import Slider from 'react-slick';
import { CartContext } from "../../hooks/CartContext";
import { NavLink } from 'react-router-dom';
import { useContext, useState } from 'react';
export default function ModalBuy({ show, onClose, product, images, p }) {
  console.log(product);
  const { setSelectedProducts } = useContext(CartContext);
  const [nav1, setNav1] = useState(null);
  const [nav2, setNav2] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const increase = () => setQuantity((prev) => prev + 1);
  const decrease = () => setQuantity((prev) => (prev > 1 ? prev - 1 : 1));
  const transformedProduct = {
    data: product,
    quantity: quantity,
  };

  if (!show) return null;

  const thumbSettings = {
    slidesToShow: 4,
    swipeToSlide: true,
    focusOnSelect: true,
    arrows: false,
    dots: false,
  };
  const mainSettings = {
    arrows: true,
    fade: true,
    dots: false,
  };


  return (
    <div
      className="modal d-block"
      tabIndex="-1"
      role="dialog"
      style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
      onClick={onClose}
    >
      <div
        className="modal-dialog modal-lg"
        role="document"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-content">
          <div className="modal-header">
            <h1 className="modal-title fs-5">{product?.product_name || "Sản phẩm"}</h1>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            <div className="row">
              <div className="col-md-6">
                <div className="product-slider">
                  <Slider
                    {...mainSettings}
                    asNavFor={nav2}
                    ref={(slider1) => setNav1(slider1)}
                    style={{ maxWidth: "350px", margin: "0 auto" }}
                  >
                    {images.map((src, idx) => (
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
                    ))}
                  </Slider>
                  <div className="mt-3">
                    <Slider
                      {...thumbSettings}
                      asNavFor={nav1}
                      ref={(slider2) => setNav2(slider2)}
                    >
                      {images.map((src, idx) => (
                        <div key={idx}>
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
                            }}
                          />
                        </div>
                      ))}
                    </Slider>
                  </div>
                </div>
              </div>
              <div className="col-md-6 position-relative">
                <h2>{product?.product_name}</h2>
                <p className="text-start">Mã sản phẩm: #{product?.product_id}</p>
                <h4 className="text-danger">
                  {Number(product?.price).toLocaleString("vi-VN")} ₫
                </h4>
                <p className='text-start'>{product?.short_description}</p>
                <div className=" position-absolute bottom-0 start-50 translate-middle-x w-100">
                  <div className="d-flex gap-2">
                    <div className="d-flex align-items-center">
                      <button
                        className="btn btn-outline-secondary rounded-0"
                        type="button"
                        onClick={decrease}
                      >
                        -
                      </button>
                      <input
                        type="number"
                        className="form-control text-center rounded-0"
                        style={{ width: "40px" }}
                        value={quantity}
                        min="1"
                        onChange={(e) => {
                          const val = Math.max(1, parseInt(e.target.value) || 1);
                          setQuantity(val);
                        }}
                      />
                      <button
                        className="btn btn-outline-secondary rounded-0"
                        type="button"
                        onClick={increase}
                      >
                        +
                      </button>
                    </div>
                    <NavLink onClick={() => setSelectedProducts([transformedProduct])} to='/checkout' className='btn btn-primary' >
                      Mua ngay
                    </NavLink>
                  </div>
                  <div className="d-flex gap-2 mt-2">
                    <span>SKU: {product?.sku}</span>
                    <span>Category: {product?.category?.category_name}</span>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
