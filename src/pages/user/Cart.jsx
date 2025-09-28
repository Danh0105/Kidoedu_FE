import React, { useEffect, useState, useContext } from 'react';
import promotion from '../../assets/user/promotion.png';
import Dropdown from '../../components/user/Dropdown';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { NavLink } from 'react-router-dom';
import Cookies from 'js-cookie';
import { CartContext } from '../../hooks/CartContext';
export default function Cart() {
    const [products, setProducts] = useState([]);
    const { setCartCount, setSelectedProducts, removeFromCartContext } = useContext(CartContext);

    const fetchCountCart = async () => {
        try {
            const token = localStorage.getItem("Authorization");
            if (!token || typeof token !== "string" || token.trim() === "") {
                const guestCart = JSON.parse(Cookies.get('guest_cart') || '[]');
                if (guestCart.length === 0) {
                    setProducts([]);
                    return;
                }

                const productRequests = guestCart.map((item) =>
                    axios.get(`http://163.223.211.23:3000/products/${item.productId}`)
                );

                const responses = await Promise.all(productRequests);
                const productsData = responses.map((res, idx) => ({
                    ...res.data,
                    quantity: guestCart[idx].quantity,
                    selected: false,
                }));
                setProducts(productsData);
                return;
            }
            let decoded;
            try {
                decoded = jwtDecode(token);
            } catch (err) {
                console.error("Token không hợp lệ:", err);
                return;
            }

            const resCart = await axios.get(
                `http://163.223.211.23/cart/${decoded.sub}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            const cart = resCart.data;
            const productIds = cart.items.map((item) => item.product.product_id);

            const productRequests = productIds.map((id) =>
                axios.get(`http://163.223.211.23:3000/products/${id}`)
            );
            const responses = await Promise.all(productRequests);
            const productsData = responses.map((res) => res.data);

            const orderedProducts = productIds.map((id) =>
                productsData.find((prd) => String(prd.data.product_id) === String(id))
            ).filter(Boolean);

            const mergedProducts = orderedProducts.map((prd) => {
                const cartItem = cart.items.find(
                    (item) => String(item.product.product_id) === String(prd.data.product_id)
                );
                return {
                    ...prd,
                    quantity: cartItem ? cartItem.quantity : 0,
                    selected: false
                };
            });

            mergedProducts.sort((a, b) => a.data.product_id - b.data.product_id);
            setProducts(mergedProducts);
            setCartCount(mergedProducts.length);


        } catch (err) {
            console.error("Lỗi khi lấy giỏ hàng:", err);
        }
    };

    const updateQuantity = async (productId, newQty) => {
        const token = localStorage.getItem("Authorization");

        // ✅ Nếu chưa đăng nhập → update giỏ trong cookie
        if (!token || typeof token !== "string" || token.trim() === "") {
            const guestCart = JSON.parse(Cookies.get("guest_cart") || "[]");

            const updatedCart = guestCart.map((item) =>
                item.productId === productId ? { ...item, quantity: newQty } : item
            );

            Cookies.set("guest_cart", JSON.stringify(updatedCart), { expires: 7 });

            setProducts((prev) =>
                prev.map((p) =>
                    (p.data?.product_id || p.product_id) === productId
                        ? { ...p, quantity: newQty }
                        : p
                )
            );

            return;
        }

        // ✅ Nếu đã đăng nhập → gọi API update
        let decoded;
        try {
            decoded = jwtDecode(token);
        } catch (err) {
            console.error("Token không hợp lệ:", err);
            return;
        }

        try {
            await axios.put(
                `http://163.223.211.23:3000/cart/${decoded.sub}/items/${productId}`,
                { quantity: newQty },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            setProducts((prev) =>
                prev.map((p) =>
                    p.data.product_id === productId ? { ...p, quantity: newQty } : p
                )
            );
        } catch (err) {
            alert("Lỗi khi update số lượng:", err);
        }
    };
    useEffect(() => {
        fetchCountCart();
    }, []);

    const selectedProducts = products.filter(p => p.selected);
    const totalQuantity = selectedProducts.reduce((sum, p) => sum + p.quantity, 0);
    const totalPrice = selectedProducts.reduce((sum, p) => sum + p.quantity * p.data.price, 0);
    const handleDelete = async (product_id) => {
        if (!window.confirm("Bạn có chắc muốn xóa sản phẩm này?")) return;

        try {
            const token = localStorage.getItem("Authorization");

            if (!token || typeof token !== "string" || token.trim() === "") {
                let guestCart = JSON.parse(Cookies.get("guest_cart") || "[]");

                guestCart = guestCart.filter((item) => item.productId !== product_id);
                removeFromCartContext(product_id);
                Cookies.set("guest_cart", JSON.stringify(guestCart), { expires: 7 });
                fetchCountCart();


                alert("Đã xóa sản phẩm khỏi giỏ hàng!");
                return;
            }

            let decoded;
            try {
                decoded = jwtDecode(token);
            } catch (err) {
                console.error("Token không hợp lệ:", err);
                alert("Xác thực thất bại. Vui lòng đăng nhập lại.");
                return;
            }

            const userId = decoded.sub;
            if (!userId) {
                console.error("Không tìm thấy user ID trong token.");
                alert("Không thể xác định người dùng.");
                return;
            }

            await axios.delete(
                `http://163.223.211.23:3000/cart/${userId}/items/${product_id}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            alert("Xóa sản phẩm thành công!");

            fetchCountCart();
        } catch (err) {
            alert("Lỗi khi xóa sản phẩm. Vui lòng thử lại sau.");
            console.error("Chi tiết lỗi:", err);
        }
    };

    return (
        <div className='container'>
            <div className="container text-center overflow-auto" style={{ maxHeight: "710px" }}>
                <div style={{ height: "590px" }}>
                    <table className="table">
                        <thead>
                            <tr>
                                <th style={{ width: "18px" }}>
                                    <input
                                        className="form-check-input"
                                        type="checkbox"
                                        checked={products.length > 0 && products.every(p => p.selected)}
                                        onChange={(e) => {
                                            const checked = e.target.checked;
                                            setProducts(prev =>
                                                prev.map(p => ({ ...p, selected: checked }))
                                            );
                                        }}
                                    />
                                </th>
                                <th>Sản phẩm</th>
                                <th className='text-center'>Đơn giá</th>
                                <th className='text-center'>Số lượng</th>
                                <th className='text-center' style={{ width: "145px" }}>Số tiền</th>
                                <th className='text-center'>Thao tác</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.length > 0 ? (
                                products.map((prd) => (
                                    <tr key={prd.data.product_id}>
                                        <td className='align-middle text-center'>
                                            <input
                                                className="form-check-input"
                                                type="checkbox"
                                                checked={prd.selected}
                                                onChange={() =>
                                                    setProducts((prev) =>
                                                        prev.map((p) =>
                                                            p.data.product_id === prd.data.product_id
                                                                ? { ...p, selected: !p.selected }
                                                                : p
                                                        )
                                                    )
                                                }
                                            />
                                        </td>
                                        <td className='d-flex flex-row align-items-center'>
                                            <img src={prd.data.images[0].image_url} alt="Sản phẩm" width={80} height={80} />
                                            <div className="d-flex flex-column bd-highlight">
                                                <a
                                                    style={{
                                                        textDecoration: "none",
                                                        width: "208px",
                                                        fontSize: "14px",
                                                        color: "rgba(0,0,0,.87)",
                                                        lineHeight: "16px",
                                                    }}
                                                    href='/'
                                                    title={prd.data.product_name}
                                                    className="link-dark p-2 bd-highlight"
                                                >
                                                    {prd.data.product_name}
                                                </a>
                                                <div className="bd-highlight">
                                                    <img src={promotion} alt="Deal" width={208} height={18} />
                                                </div>
                                            </div>
                                            <div className='d-flex align-items-center'>
                                                <div>
                                                    <Dropdown />
                                                    <p className="mb-0" style={{ color: "rgba(0,0,0,.54)", fontSize: "14px", lineHeight: "16px", paddingLeft: "12px" }}>
                                                        Một bộ 1
                                                    </p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className='align-middle text-center'>
                                            <p className='mb-0'>{Number(prd.data.price).toLocaleString()} ₫</p>
                                        </td>
                                        <td className="align-middle text-center">
                                            <div className='d-flex align-items-center justify-content-center'>
                                                <button
                                                    style={{ width: '50px', height: "32px" }}
                                                    className="btn border-end-0 btn-outline-secondary border-secondary rounded-0 d-flex align-items-center justify-content-center"
                                                    onClick={() => updateQuantity(prd.data.product_id, prd.quantity > 1 ? prd.quantity - 1 : 1)}
                                                >-
                                                </button>
                                                <input
                                                    type="number"
                                                    className="form-control text-center rounded-0 border-secondary"
                                                    value={prd.quantity}
                                                    min={1}
                                                    style={{ width: '50px', height: "32px" }}
                                                    onChange={(e) => {
                                                        const value = Math.max(1, parseInt(e.target.value) || 1);
                                                        updateQuantity(prd.data.product_id, value);
                                                    }}
                                                />

                                                <button
                                                    style={{ width: '50px', height: "32px" }}
                                                    className="btn border-start-0 btn-outline-secondary rounded-0 d-flex align-items-center justify-content-center"
                                                    onClick={() => updateQuantity(prd.data.product_id, prd.quantity + 1)}
                                                >+
                                                </button>
                                            </div>
                                        </td>
                                        <td className='align-middle text-center' style={{ color: '#ee4d2d' }}>
                                            <p className='mb-0' style={{ width: "145px" }}>{Number(prd.data.price * prd.quantity).toLocaleString()} ₫</p>
                                        </td>
                                        <td className='align-middle text-center'>
                                            <a className='btn btn-danger' onClick={() => handleDelete(prd.data.product_id)}> Xóa</a>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" className="text-center">
                                        Giỏ hàng rỗng
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
            <div className='bg-white p-2 border-top border-2 border-danger' style={{ borderRadius: "0 0 8px 8px" }}>
                {/*      <div className='d-flex align-items-center justify-content-end gap-3'>
                    <div style={{ fontSize: "20px", lineHeight: "20px", paddingLeft: "12px", color: '#ee4d2d' }}>
                        <img class="j5kTyq" src="https://deo.shopeemobile.com/shopee/shopee-pcmall-live-sg/cart/293cb84a6429a3426672.svg"></img> Voucher
                    </div>
                    <div>
                        <a className='nav-link link-primary' style={{ fontSize: "16px" }}>
                            Chọn nhập mã
                        </a>
                    </div>
                </div> */}
                <div className="d-flex justify-content-between ">
                    <div className='d-flex align-items-center'>
                        <div className='me-2'>
                            <input
                                className="form-check-input"
                                type="checkbox"
                                checked={products.length > 0 && products.every(p => p.selected)}
                                onChange={(e) => {
                                    const checked = e.target.checked;
                                    setProducts(prev =>
                                        prev.map(p => ({ ...p, selected: checked }))
                                    );
                                }}
                            />
                        </div>
                        <div style={{ fontSize: "20px" }}>Chọn tất cả</div>
                    </div>
                    <div className='d-flex align-items-center gap-3 '>
                        <div style={{ fontSize: "20px", lineHeight: "20px", paddingLeft: "12px", color: '#ee4d2d' }}>
                            Tổng cộng ({totalQuantity} sản phẩm): ₫{totalPrice.toLocaleString()}
                        </div>
                        <div>
                            <NavLink onClick={() => setSelectedProducts(products.filter(p => p.selected))} to='/checkout' className='btn btn-danger' style={{ fontSize: "20px" }}>
                                Mua Hàng
                            </NavLink>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
