// CartContext.js
import { createContext, useState } from "react";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [CartCT, setCartContext] = useState([]);
  const [cartCount, setCartCount] = useState(0);
  const [order, setOrder] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  // thêm sản phẩm vào giỏ
  const addToCartContext = (newItem) => {
    setCartContext((prev) => {
      const existing = prev.find(p => p.productId === newItem.productId);
      if (existing) {
        // Nếu sản phẩm đã có → cộng dồn quantity
        return prev.map(p =>
          p.productId === newItem.productId
            ? { ...p, quantity: p.quantity }
            : p
        );
      } else {
        // Nếu chưa có → thêm mới
        return [...prev, newItem];
      }
    });
  };
  const removeFromCartContext = (productId) => {
    setCartContext((prev) => prev.filter(p => p.productId !== productId));
  };
  // checkout: chuyển giỏ hàng sang đơn hàng
  const checkout = () => {
    if (CartCT.length === 0) return;
    setOrder(CartCT);  // lưu giỏ hàng thành đơn hàng
    setCartContext([]);     // reset giỏ
  };

  return (
    <CartContext.Provider value={{
      CartCT, order, addToCartContext, checkout, cartCount, setCartCount, selectedProducts, setSelectedProducts, removeFromCartContext
    }}>
      {children}
    </CartContext.Provider>
  );
};
