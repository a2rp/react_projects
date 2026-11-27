import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

export default defineConfig(({ command }) => ({
    base: command === "build" ? "/mobigic-assignment-frontend/" : "/",
    plugins: [react()],
    server: {
        proxy: {
            "/api": {
                target: "http://localhost:1198",
                changeOrigin: true,
            },
        },
    },
    test: {
        globals: true,
        environment: "jsdom",
        setupFiles: "./src/setupTests.js",
    },
}));
