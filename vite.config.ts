import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@components": path.resolve(__dirname, "./src/components"),
      "@constants": path.resolve(__dirname, "./src/constants"),
      "@game": path.resolve(__dirname, "./src/game"),
      "@hooks": path.resolve(__dirname, "./src/hooks"),
      "@tests": path.resolve(__dirname, "./src/tests"),
    },
  },
});
