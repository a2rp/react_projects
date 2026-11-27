import axios from "axios";
import { resolveApiBaseUrl } from "./apiConfig.js";

const api = axios.create({
    baseURL: resolveApiBaseUrl(import.meta.env.VITE_API_URL),
});

api.interceptors.request.use((config) => {
    const token = window.sessionStorage.getItem("token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

api.interceptors.response.use((response) => response, (error) => {
    const isLoginRequest = error.config?.url?.endsWith("/login");
    if (error.response?.status === 401 && !isLoginRequest) {
        ["token", "email", "role"].forEach((key) => window.sessionStorage.removeItem(key));
        window.location.assign(`${import.meta.env.BASE_URL.replace(/\/$/, "")}/login`);
    }
    return Promise.reject(error);
});

export default api;
