import axiosClient from "../utils/axiosClient";

export const inventoryApi = {
    create: (payload) => axiosClient.post("/inventory", payload),
    update: (id, payload) => axiosClient.patch(`/inventory/${id}`, payload),

    getSuppliers: () => axiosClient.get("/suppliers"),
    getProducts: () => axiosClient.get("/products/admin-inventory-receipt"),
    getWarehouses: () => axiosClient.get("/warehouses"),
};