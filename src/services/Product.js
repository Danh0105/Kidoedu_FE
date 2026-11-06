import axios from "axios";

const apiBase = (process.env.REACT_APP_API_URL || "").replace(/\/+$/, "");
export const api = axios.create({
    baseURL: apiBase,
    timeout: 15000,
});

export async function fetchAllProductsApi(params = {}, signal) {
    const {
        page = 1,
        limit = 12,
        category_id,
        sort,
        q,
        min_price,
        max_price,
        featured,
        discount,
    } = params;

    const res = await api.get("/products", {
        params: {
            page,
            limit,
            ...(category_id && { category_id }),
            ...(sort && { sort }),
            ...(q && { q }),
            ...(min_price && { min: min_price }),
            ...(max_price && { max: max_price }),
            ...(featured && { featured: 1 }),
            ...(discount && { discount: 1 }),
        },
        signal,
    });

    return res.data;
}
export async function fetchAllProductsApiForAdmin(params = {}, signal) {
    const res = await api.get("/products/admin", {
        params,
        signal,
    });

    return res.data;
}
export async function fetchAllProductsApiForAdminInventerProduct(params = {}, signal) {
    const res = await api.get("/products/admin-inventory-products", {
        params,
        signal,
    });

    return res.data;
}
export const fetchHomeProductsApi = async () => {
    const res = await axios.get(`${process.env.REACT_APP_API_URL}/products/home-data`);
    return res.data;
};