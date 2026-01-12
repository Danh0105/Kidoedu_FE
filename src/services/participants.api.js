import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:3000", // sửa nếu BE khác port
});

export const importParticipants = (data) =>
    api.post("/participants/import", data);

export const getParticipants = () =>
    api.get("/participants");

export const spinParticipant = () =>
    api.post("/participants/spin");

export const resetParticipants = () =>
    api.post("/participants/reset");
