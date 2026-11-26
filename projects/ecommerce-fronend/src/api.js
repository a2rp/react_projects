import axios from "axios";

const isLocalhost = ["localhost", "127.0.0.1"].includes(window.location.hostname);
const configuredUrl = import.meta.env.VITE_BACKEND_URL;

export const BASE_URL = configuredUrl || (isLocalhost
    ? "http://localhost:5000"
    : "https://ecommerce-backend-cvl8.onrender.com");

export const api = axios.create({
    baseURL: BASE_URL,
    timeout: 60000,
    withCredentials: true,
});
