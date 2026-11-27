import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import process from "node:process";

export default defineConfig(({ mode }) => ({
    plugins: [react()],
    base:
        process.env.VERCEL === "1" || mode === "development"
            ? "/"
            : "/mobile-apps-distribution-page/",
    build: {
        sourcemap: false,
    },
}));
