import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    include: ['react-icons/fi'],
  },
  build: {
    rollupOptions: {
      external: ['react-icons/fi'],
    },
  },
  server: {
    port: 5173
  }
});
