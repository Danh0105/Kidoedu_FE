import axios from 'axios';

const api = axios.create({
    baseURL: process.env.REACT_APP_API_URL,
});

export const getPromotions = () =>
    api.get('/promotions').then(res => res.data);

export const getPromotion = (id) =>
    api.get(`/promotions/${id}`).then(res => res.data);

export const createPromotion = (data) =>
    api.post('/promotions', data);

export const updatePromotion = (id, data) =>
    api.put(`/promotions/${id}`, data);

export const deletePromotion = (id) =>
    api.delete(`/promotions/${id}`);

export const applyPromotion = (id, data) =>
    api.post(`/promotions/${id}/apply`, data);

export const getApplicability = (id) =>
    api.get(`/promotions/${id}/apply`).then(res => res.data);

export const addApplicability = (id, body) =>
    api.post(`/promotions/${id}/apply`, body);

export const removeApplicability = (id, applyId) =>
    api.delete(`/promotions/${id}/apply/${applyId}`);

export const createVoucher = (data) =>
    api.post(`/promotions/voucher`, data);

export const applyVoucher = (data) =>
    api.post("/promotions/apply-voucher", data);