import axios from "axios";
import { getTokenFromLocalStorage } from "../helpers/localstorage.helper";

export const instance = axios.create({
    baseURL: "http://localhost:4100/api",
});

// Добавление токена в заголовки каждого запроса
instance.interceptors.request.use((config) => {
    const token = getTokenFromLocalStorage();
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});
