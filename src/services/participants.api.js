import axios from "axios";

const api = axios.create({
    baseURL: `${process.env.REACT_APP_API_URL}`, // sửa nếu BE khác port
});

export const importParticipants = (data) =>
    api.post("/participants/import", data);

export const getParticipants = () =>
    api.get("/participants");

export const spinParticipant = () =>
    api.post("/participants/spin");

export const resetParticipants = () =>
    api.post("/participants/reset");
