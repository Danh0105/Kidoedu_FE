import axios from 'axios';

const api = axios.create({
    baseURL: process.env.REACT_APP_API_URL,
});

export const getOrders = (page, limit) =>
    api.get(`/orders?page=${page}&limit=${limit}`).then(res => res.data);