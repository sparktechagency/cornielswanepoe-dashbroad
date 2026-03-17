import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from '@tailwindcss/vite'
import path from "path"

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(),],
   resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  server: {
    // host: "10.10.7.46",
    host: "187.124.7.226",
    port: 3014,
    allowedHosts: ["dashboard.investors-hub.co.za"]
  },
})
