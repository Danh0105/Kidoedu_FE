import axios from "axios";

const apiBase = (process.env.REACT_APP_API_URL || "").replace(/\/+$/, "");

export const api = axios.create({
    baseURL: apiBase,
    timeout: 15000,
});

export async function fetchBannersApi() {
    const res = await api.get("/banners");
    return res.data || [];
}

export async function fetchBannersSlideApi() {
    const res = await api.get("/banners/range/home/14-24");
    return res.data || [];
}