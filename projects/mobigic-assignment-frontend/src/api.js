import axios from "axios";

const configuredBaseUrl = import.meta.env.VITE_API_URL?.replace(/\/+$/, "");

if (typeof window !== "undefined") window.localStorage.removeItem("token");

export const api = axios.create({
    baseURL: configuredBaseUrl || "/api",
});

api.interceptors.request.use((config) => {
    const token = window.sessionStorage.getItem("token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

api.interceptors.response.use((response) => response, (error) => {
    if (error.response?.status === 401 && window.sessionStorage.getItem("token")) {
        clearAuthToken();
    }
    return Promise.reject(error);
});

export const hasAuthToken = () => Boolean(window.sessionStorage.getItem("token"));

export const setAuthToken = (token) => {
    window.sessionStorage.setItem("token", token);
    window.dispatchEvent(new Event("auth-changed"));
};

export const clearAuthToken = () => {
    window.sessionStorage.removeItem("token");
    window.dispatchEvent(new Event("auth-changed"));
};

export const getPublicDownloadUrl = (path) => {
    if (configuredBaseUrl && /^https?:\/\//i.test(configuredBaseUrl)) {
        return new URL(path, configuredBaseUrl).toString();
    }
    return path;
};
