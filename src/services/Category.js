import axios from "axios";

const apiBase = (process.env.REACT_APP_API_URL || "").replace(/\/+$/, "");

export const api = axios.create({
    baseURL: apiBase,
    timeout: 15000,
});

export async function fetchCategoriesApi() {
    const res = await axios.get('https://kidoedu.vn/categories');
    return res.data || [];
}

export async function fetchProductsByCategoryApi(categoryId) {
    const res = await api.get("/search/products", {
        params: { category_id: categoryId },
    });
    return res.data?.items || [];
}



