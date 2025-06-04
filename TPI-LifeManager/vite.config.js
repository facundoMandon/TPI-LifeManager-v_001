import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  server: {
    historyApiFallback: true,
    port: 3000, // Puerto en el que se ejecutará la aplicación
    host: "localhost", // Host para acceder a la aplicación
    open: true, // Abrir el navegador automáticamente al iniciar el servidor
  },
  plugins: [react()],
});
