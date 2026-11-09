import { defineConfig } from "vite";

const server = "http://localhost:3001";

export default defineConfig({
  server: {
    // Assets and API both live on the Node server.
    proxy: { "/assets": server, "/api": server },
  },
});
