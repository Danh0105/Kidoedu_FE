import axios from "axios";

const API_BASE = process.env.REACT_APP_API_URL;

// tạo instance axios
const api = axios.create({
    baseURL: API_BASE,
});

// =======================
// INVENTORY RECEIPT SERVICE
// =======================

// GET ALL (có filter + warehouseId)
export const getReceipts = async (params = {}) => {
    const res = await api.get("/inventory-receipts", {
        params,
    });
    return res.data;
};

// GET BY ID
export const getReceiptById = async (id) => {
    const res = await api.get(`/inventory-receipts/${id}`);
    return res.data;
};

// CREATE
export const createReceipt = async (data) => {
    const res = await api.post("/inventory-receipts", data);
    return res.data;
};

// UPDATE
export const updateReceipt = async (id, data) => {
    const res = await api.patch(`/inventory-receipts/${id}`, data);
    return res.data;
};

// DELETE
export const deleteReceipt = async (id) => {
    const res = await api.delete(`/inventory-receipts/${id}`);
    return res.data;
};