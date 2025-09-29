import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import ModalCart from '../ModalCart';
import axios from 'axios';

export default function Product(props) {
    const { id, image, name, content, price } = props;
    const [product, setProduct] = useState(null);
    const [images, setImages] = useState([]);
    const [showModal, setShowModal] = useState(false);

    const formatCurrency = (value) =>
        new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);

    const handleAddToCart = async (id) => {
        try {
            const res = await axios.get(`https://api.kidoedu.edu.vn:8028/products/${id}`);
            const data = res.data.data;
            setProduct(data);
            setImages(data.images?.map((img) => img.image_url) || []);
            setShowModal(true); // mở modal khi có dữ liệu
        } catch (err) {
            console.error("Lỗi khi lấy sản phẩm:", err);
        }
    };

    return (
        <div className="card nav-link" style={{ height: "404.1px", width: "268px" }}>
            <Link to={`/productdetail/${id}`}>
                <img src={image} className="card-img-top" alt={name} />
            </Link>

            <div className="row p-0 d-flex justify-content-center">
                <h5 className="card-title" style={{ fontSize: "15px", fontWeight: 700 }}>
                    <Link to={`/productdetail/${id}`} className="nav-link p-0">
                        {name}
                    </Link>
                </h5>

                <div style={{ height: "42px" }} className="mb-2">
                    <Link to={`/productdetail/${id}`} className="nav-link p-0">
                        <p className="card-text mt-2" style={{ fontSize: "14px" }}>{content}</p>
                    </Link>
                </div>

                <p className="card-text text-danger">{formatCurrency(price)}</p>

                <div className="d-flex justify-content-between gap-2">
                    <button
                        onClick={() => handleAddToCart(id)}
                        className="btn btn-danger"
                        style={{ fontSize: "15px" }}
                    >
                        Thêm vào giỏ
                    </button>
                    <button className="btn btn-primary" style={{ fontSize: "15px" }}>
                        Mua ngay
                    </button>
                </div>

                <ModalCart
                    show={showModal}
                    onClose={() => setShowModal(false)}
                    product={product}
                    images={images}
                />
            </div>
        </div>
    );
}
