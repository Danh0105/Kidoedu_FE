import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { NavLink } from 'react-router-dom';
import Cookies from 'js-cookie';
import { CartContext } from '../../hooks/CartContext';
const PLACEHOLDER_IMG = "https://placehold.co/600x600?text=No+Image";
export default function Cart() {
    const [products, setProducts] = useState([]);
    const { setCartCount, setSelectedProducts, removeFromCartContext } = useContext(CartContext);

    // 🧭 Lấy danh sách sản phẩm trong giỏ hàng
    const fetchCountCart = async () => {
        try {
            const token = localStorage.getItem("Authorization");

            // ============================================
            // 🧳 1️⃣ KHÁCH VÃNG LAI (Không có token)
            // ============================================
            if (!token || typeof token !== "string" || token.trim() === "") {
                const guestCart = JSON.parse(Cookies.get("guest_cart") || "[]");

                if (guestCart.length === 0) {
                    setProducts([]);
                    return;
                }

                setProducts(guestCart);
                return;
            }

            // ============================================
            // 🧑‍💻 2️⃣ NGƯỜI DÙNG ĐĂNG NHẬP
            // ============================================
            /*    let decoded;
               try {
                   decoded = jwtDecode(token);
               } catch (err) {
                   console.error("Token không hợp lệ:", err);
                   return;
               }
   
               const resCart = await axios.get(
                   `${process.env.REACT_APP_API_URL}/cart/${decoded.sub}`,
                   { headers: { Authorization: `Bearer ${token}` } }
               );
   
               const cart = resCart.data;
               if (!cart?.items?.length) {
                   setProducts([]);
                   setCartCount(0);
                   return;
               }
   
               // 🔹 Lấy danh sách productId trong giỏ hàng
               const productIds = cart.items.map((item) => item?.productId);
               const productRequests = productIds.map((id) =>
                   axios.get(`${process.env.REACT_APP_API_URL}/products/${id}`)
               );
               const responses = await Promise.all(productRequests);
   
               // 🔹 Bổ sung thông tin biến thể + giá
               const productsData = await Promise.all(
                   responses.map(async (res, idx) => {
                       const base = res.data;
                       const cartItem = cart.items[idx];
                       const variant = cartItem?.selectedVariant || null;
                       let variantData = variant;
   
                       if (variant?.variantId) {
                           try {
                               const [resVariant, resPrice] = await Promise.allSettled([
                                   axios.get(
                                       `${process.env.REACT_APP_API_URL}/products/${base.data.productId}/variants/${variant.variantId}`
                                   ),
                                   axios.get(
                                       `${process.env.REACT_APP_API_URL}/products/${base.data.productId}/variants/${variant.variantId}/prices`
                                   ),
                               ]);
   
                               const variantInfo =
                                   resVariant.status === "fulfilled"
                                       ? resVariant.value.data
                                       : variant;
                               const variantPrice =
                                   resPrice.status === "fulfilled" &&
                                       Array.isArray(resPrice.value.data) &&
                                       resPrice.value.data[0]
                                       ? Number(resPrice.value.data[0].price)
                                       : variant?.price || null;
   
                               variantData = { ...variantInfo, price: variantPrice };
                           } catch (error) {
                               console.warn(
                                   `⚠️ Không thể lấy thông tin biến thể ${variant.variantId}:`,
                                   error.message
                               );
                           }
                       }
   
                       return {
                           ...base,
                           quantity: cartItem.quantity,
                           selected: false,
                           variant: variantData,
                       };
                   })
               );
   
               setProducts(productsData); */


        } catch (err) {
            console.error("Lỗi khi lấy giỏ hàng:", err);
        }
    };

    // 🧾 Cập nhật số lượng sản phẩm
    const updateQuantity = async (variantId, newQty) => {
        const token = localStorage.getItem("Authorization");

        if (!token || typeof token !== "string" || token.trim() === "") {
            const guestCart = JSON.parse(Cookies.get("guest_cart") || "[]");
            const updatedCart = guestCart.map((item) =>
                item.variantId === variantId ? { ...item, quantity: newQty } : item
            );
            Cookies.set("guest_cart", JSON.stringify(updatedCart), { expires: 7 });

            setProducts((prev) =>
                prev.map((p) =>
                    (p?.variantId || p.variantId) === variantId
                        ? { ...p, quantity: newQty }
                        : p
                )
            );
            return;
        }

        let decoded;
        try {
            decoded = jwtDecode(token);
        } catch (err) {
            console.error("Token không hợp lệ:", err);
            return;
        }

        try {
            /* await axios.put(
                `${process.env.REACT_APP_API_URL}/cart/${decoded.sub}/items/${productId}`,
                { quantity: newQty },
                { headers: { Authorization: `Bearer ${token}` } }
            ); */

            setProducts((prev) =>
                prev.map((p) =>
                    p.variantId === variantId ? { ...p, quantity: newQty } : p
                )
            );
        } catch (err) {
            alert("Lỗi khi update số lượng:", err);
        }
    };

    useEffect(() => {
        fetchCountCart();

    }, []);

    // 🧮 Tính tổng
    const selectedProducts = products.filter(p => p.selected);
    const totalQuantity = selectedProducts.reduce((sum, p) => sum + p.quantity, 0);
    const totalPrice = selectedProducts.reduce((sum, p) =>
        sum + p.quantity * (p?.price), 0);

    // 🗑️ Xóa sản phẩm
    const handleDelete = async (variantId) => {
        if (!window.confirm("Bạn có chắc muốn xóa sản phẩm này?")) return;

        try {
            const token = localStorage.getItem("Authorization");

            if (!token || typeof token !== "string" || token.trim() === "") {
                let guestCart = JSON.parse(Cookies.get("guest_cart") || "[]");

                guestCart = guestCart.filter((item) => item.variantId !== variantId);
                removeFromCartContext(variantId);
                Cookies.set("guest_cart", JSON.stringify(guestCart), { expires: 7 });
                setCartCount(guestCart.length);
                setProducts((prev) => prev.filter((p) => p?.variantId !== variantId));
                alert("Đã xóa sản phẩm khỏi giỏ hàng!");
                return;
            }

            let decoded = jwtDecode(token);
            const userId = decoded.sub;

            /*  await axios.delete(
                 `${process.env.REACT_APP_API_URL}/cart/${userId}/items/${productId}`,
                 { headers: { Authorization: `Bearer ${token}` } }
             ); */

            alert("Xóa sản phẩm thành công!");

        } catch (err) {
            alert("Lỗi khi xóa sản phẩm. Vui lòng thử lại sau.");
            console.error("Chi tiết lỗi:", err);
        }
    };

    // 🧱 Render giao diện
    return (
        <div className='container cart-page'>
            <div className="container text-center overflow-auto cart-scroll" style={{ maxHeight: "710px" }}>
                <div style={{ height: "590px" }}>
                    <table className="table align-middle cart-table">
                        <thead className="bg-light text-secondary small text-uppercase">
                            <tr>
                                <th className="text-center" style={{ width: 40 }}>
                                    <input
                                        className="form-check-input"
                                        type="checkbox"
                                        checked={products.length > 0 && products.every(p => p.selected)}
                                        onChange={(e) => {
                                            const checked = e.target.checked;
                                            setProducts(prev => prev.map(p => ({ ...p, selected: checked })));
                                        }}
                                    />
                                </th>
                                <th >Hình ảnh</th>
                                <th style={{ minWidth: 200 }}>Sản phẩm</th>
                                <th className="text-center d-none d-sm-table-cell" style={{ width: 140 }}>Đơn giá</th>
                                <th className="text-center" style={{ width: 150 }}>Số lượng</th>
                                <th className="text-center" style={{ width: 140 }}>Tổng tiền</th>
                                <th className="text-center d-none d-sm-table-cell" style={{ width: 100 }}>Thao tác</th>
                            </tr>
                        </thead>

                        <tbody className="align-middle">
                            {products.length > 0 ? (
                                products.map((prd) => (
                                    <tr
                                        key={`${prd?.productId}-${prd?.selectedAttr ?? 'base'}`}
                                        className="border-bottom hover-row"
                                    >

                                        {/* Checkbox */}
                                        <td className="text-center">
                                            <input
                                                className="form-check-input"
                                                type="checkbox"
                                                checked={prd.selected}
                                                onChange={() =>
                                                    setProducts((prev) =>
                                                        prev.map((p) =>
                                                            p.selectedAttr === prd.selectedAttr
                                                                &&
                                                                p.variantId === prd.variantId
                                                                ? { ...p, selected: !p.selected }
                                                                : p
                                                        )
                                                    )
                                                }
                                            />
                                        </td>
                                        <td>
                                            <img
                                                src={prd.imageUrl || "/no-image.png"}
                                                alt={prd?.productName || "Sản phẩm"}
                                                width={80}
                                                height={80}
                                                className="rounded border cart-thumb shadow-sm"
                                                onError={(e) => (e.currentTarget.src = PLACEHOLDER_IMG)}
                                            />
                                        </td>
                                        {/* Sản phẩm */}
                                        <td>
                                            <div className="d-flex align-items-start gap-3">

                                                <div className="d-flex flex-column justify-content-between flex-grow-1">
                                                    <div
                                                        className="fw-semibold text-center"
                                                        title={prd?.productName}

                                                    >
                                                        {prd?.productName} | {prd.variantName} | {prd.selectedAttr}
                                                    </div>
                                                    {prd.variant && (
                                                        <div className="text-muted small mt-1">
                                                            {prd.variant.variantName
                                                                ? `Phiên bản: ${prd.variant.variantName}`
                                                                : prd.variant.attributes?.color
                                                                    ? `Màu: ${prd.variant.attributes.color}`
                                                                    : ""}
                                                        </div>
                                                    )}
                                                    <div className="d-sm-none mt-2">
                                                        <span className="fw-bold text-danger small">
                                                            {Number(prd?.price).toLocaleString()} ₫
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </td>

                                        {/* Đơn giá */}
                                        <td className="text-center d-none d-sm-table-cell">
                                            <span className="fw-semibold text-dark">
                                                {Number(prd?.price).toLocaleString()} ₫
                                            </span>
                                        </td>

                                        {/* Số lượng */}
                                        <td className="text-center">
                                            <div
                                                className="d-inline-flex align-items-center bg-white rounded border"
                                                style={{ overflow: "hidden" }}
                                            >
                                                <button
                                                    className="btn btn-sm btn-light text-secondary border-0 px-2"
                                                    onClick={() =>
                                                        updateQuantity(prd.variantId, Math.max(1, prd.quantity - 1))
                                                    }
                                                    disabled={prd.quantity <= 1}
                                                >
                                                    <i className="bi bi-dash-lg"></i>
                                                </button>
                                                <input
                                                    type="number"
                                                    className="form-control form-control-sm text-center border-0 shadow-none"
                                                    style={{ width: 48 }}
                                                    value={prd.quantity}
                                                    min={1}
                                                    onChange={(e) =>
                                                        updateQuantity(
                                                            prd.variantId,
                                                            Math.max(1, parseInt(e.target.value) || 1)
                                                        )
                                                    }
                                                />
                                                <button
                                                    className="btn btn-sm btn-light text-secondary border-0 px-2"
                                                    onClick={() =>
                                                        updateQuantity(prd.variantId, prd.quantity + 1)
                                                    }
                                                >
                                                    <i className="bi bi-plus-lg"></i>
                                                </button>
                                            </div>
                                        </td>

                                        {/* Tổng tiền */}
                                        <td className="text-center text-danger fw-semibold">
                                            {(prd.quantity * prd?.price).toLocaleString()} ₫
                                        </td>

                                        {/* Thao tác */}
                                        <td className="text-center d-none d-sm-table-cell">
                                            <button
                                                className="btn btn-sm btn-outline-danger px-3"
                                                onClick={() => handleDelete(prd.variantId)}
                                            >
                                                <i className="bi bi-trash me-1"></i>Xóa
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="7" className="text-center py-4 text-muted">
                                        Giỏ hàng của bạn đang trống 🛒
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>

                </div>
            </div>

            {/* Footer */}
            <div className='bg-white p-2 border-top border-2 border-danger cart-footer'>
                <div className="d-flex justify-content-between flex-column flex-sm-row gap-2">
                    <div className='d-flex align-items-center'>
                        <div className='me-2'>
                            <input
                                className="form-check-input"
                                type="checkbox"
                                checked={products.length > 0 && products.every(p => p.selected)}
                                onChange={(e) => {
                                    const checked = e.target.checked;
                                    setProducts(prev => prev.map(p => ({ ...p, selected: checked })));
                                }}
                            />
                        </div>
                        <div className='fw-semibold'>Chọn tất cả</div>
                    </div>
                    <div className='d-flex align-items-center gap-3 justify-content-between'>
                        <div className='fw-semibold' style={{ color: '#ee4d2d' }}>
                            Tổng cộng ({totalQuantity} sản phẩm): ₫{totalPrice.toLocaleString()}
                        </div>
                        <div>
                            <NavLink
                                onClick={() => setSelectedProducts(products.filter(p => p.selected))}
                                to='/checkout'
                                className='btn btn-danger'
                            >
                                Mua Hàng
                            </NavLink>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
