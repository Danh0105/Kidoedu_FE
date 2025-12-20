import axios from "axios";

const apiBase = (process.env.REACT_APP_API_URL || "").replace(/\/+$/, "");
export const api = axios.create({
    baseURL: apiBase,
    timeout: 15000,
});

export async function fetchAllProductsApi(page, limit) {
    const res = await api.get("/products", { page, limit });
    return res.data?.data || [];
}

export async function searchProductsApi(params = {}, signal) {
    const res = await api.get("/search/products", { params, signal });
    return res.data || {};
}
