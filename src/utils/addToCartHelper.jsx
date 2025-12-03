import axios from "axios";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { useEffect } from "react";

export async function addToCartHelper({
    product,
    variant,
    quantity,
    selectedAttr,
    displayPrice,
    setCartCount,
    addToCartContext,
}) {


    try {
        const token = localStorage.getItem("Authorization");

        const productId = product.productId;
        const variantId = variant?.variantId;
        const variantName = variant?.variantName;
        const attributes = variant?.attributes || {};

        const img =
            variant?.imageUrl ||
            product?.images?.find((i) => i.isPrimary)?.imageUrl;

        /* ==========================================================
         * 1) USER ĐĂNG NHẬP → LƯU LÊN SERVER
         * ==========================================================*/
        if (token?.trim()) {
            let userId = null;
            try {
                userId = jwtDecode(token).sub;
            } catch { }

            await axios.post(
                `${process.env.REACT_APP_API_URL}/cart/${userId}/items`,
                {
                    productId,
                    productName: product.productName,
                    imageUrl: img,
                    variantId,
                    variantName,
                    attributes,
                    quantity,
                    selectedAttr,
                    price: displayPrice,
                },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            alert("Đã thêm vào giỏ hàng!");

            // reload count
            const res = await axios.get(
                `${process.env.REACT_APP_API_URL}/cart/${userId}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setCartCount(res.data.items.length || 0);

            return;
        }

        /* ==========================================================
         * 2) USER KHÁCH → LƯU VÀO COOKIE
         * ==========================================================*/
        let guest = [];
        try {
            guest = JSON.parse(Cookies.get("guest_cart") || "[]");
        } catch {
            guest = [];
        }

        const newItem = {
            productId,
            productName: product.productName,
            imageUrl: img,
            variantId,
            variantName,
            attributes,
            quantity,
            price: displayPrice,
            selectedAttr,
        };
        console.log("new item", newItem);

        const idx = guest.findIndex(
            (i) =>
                i.productId === newItem.productId &&
                i.variantId === newItem.variantId &&
                i.selectedAttr === newItem.selectedAttr
        );

        if (idx !== -1) guest[idx].quantity += quantity;
        else guest.push(newItem);

        Cookies.set("guest_cart", JSON.stringify(guest), { expires: 7 });

        addToCartContext(newItem);
        setCartCount(guest.length);

        alert("Đã thêm vào giỏ hàng!");
    } catch (err) {
        console.error(err);
        alert("Không thể thêm vào giỏ hàng!");
    }
}
