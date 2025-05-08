import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    sourcemap: false,
    minify: "esbuild", // terser 대신 esbuild 사용
  },
  server: {
    port: 8080,
    proxy: {
      "/api": {
        target: "http://localhost:8080",
        changeOrigin: true,
      },
      fs: {
        allow: ["public"],
      },
    },
  },
});
