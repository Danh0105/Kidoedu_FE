import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import React, { useEffect, useState, useContext } from 'react'
import InnerImageZoom from 'react-inner-image-zoom';
import Slider from 'react-slick';
import { CartContext } from "../../hooks/CartContext";
import Cookies from 'js-cookie';
export default function ModalCart({ show, onClose, product, images }) {
  const { setCartCount, addToCartContext } = useContext(CartContext);
  const [nav1, setNav1] = useState(null);
  const [nav2, setNav2] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const increase = () => setQuantity((prev) => prev + 1);
  const decrease = () => setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

  const fetchCountCart = async () => {
    const token = localStorage.getItem('Authorization') || null;
    if (typeof token === 'string' && token.trim() !== '') {
      const decoded = jwtDecode(token);
      const resCart = await axios.get(`http://163.223.211.23/cart/${decoded.sub}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const cart = resCart.data;

      setCartCount(cart.items.length || 0);
    }
  }
  useEffect(() => {

    if (!show) {
      setQuantity(1);
      setNav1(null);
      setNav2(null);
    }
  }, [show]);

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
  const addToCart = async (productId, quantity) => {
    try {
      const token = localStorage.getItem('Authorization') || null;

      if (typeof token === 'string' && token.trim() !== '') {
        const decoded = jwtDecode(token);
        const userId = decoded.sub;
        const payload = { productId, quantity };

        const res = await axios.post(
          `http://163.223.211.23:3000/cart/${userId}/items`,
          payload,
          {
            headers: {
              Authorization: token,
            },
          }
        );

        alert('Đã thêm sản phẩm!');
        fetchCountCart();
      } else {
        const currentCart = JSON.parse(Cookies.get('guest_cart') || '[]');
        const existingIndex = currentCart.findIndex(item => item.productId === productId);
        fetchCountCart();

        if (existingIndex !== -1) {
          currentCart[existingIndex].quantity += quantity;
        } else {
          currentCart.push({ productId, quantity });
        }
        Cookies.set('guest_cart', JSON.stringify(currentCart), { expires: 7 });
        currentCart.forEach(item => addToCartContext(item));
        alert('Đã lưu sản phẩm vào giỏ hàng!');
      }
    } catch (error) {
      console.error('Lỗi thêm vào giỏ hàng:', error);
      alert('Không thể thêm vào giỏ hàng!');
    }
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
                    <button className="btn btn-primary me-2" onClick={() => addToCart(product?.product_id, quantity)}>Thêm vào giỏ hàng</button>
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
