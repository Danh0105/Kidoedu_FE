import axiosClient from "../utils/axiosClient";

export const orderApi = {
    getOrders: (page = 1, limit = 10) => {
        return axiosClient.get(`/orders`, {
            params: { page, limit },
        });
    },
};