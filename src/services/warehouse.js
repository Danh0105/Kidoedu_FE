import axios from "axios";

const API_BASE = process.env.REACT_APP_API_URL;

// tạo instance axios (nếu sau này cần gắn token)
const api = axios.create({
    baseURL: API_BASE,
});

// =======================
// WAREHOUSE SERVICE
// =======================

// GET ALL
export const getWarehouses = async () => {
    const res = await api.get("/warehouses");
    return res.data;
};

// GET ONE
export const getWarehouseById = async (id) => {
    const res = await api.get(`/warehouses/${id}`);
    return res.data;
};

// CREATE
export const createWarehouse = async (data) => {
    const res = await api.post("/warehouses", data);
    return res.data;
};

// UPDATE
export const updateWarehouse = async (id, data) => {
    const res = await api.patch(`/warehouses/${id}`, data);
    return res.data;
};

// DELETE
export const deleteWarehouse = async (id) => {
    const res = await api.delete(`/warehouses/${id}`);
    return res.data;
};