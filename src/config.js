// src/config.js

const isLocal =
  window.location.hostname === "localhost" ||
  window.location.hostname === "127.0.0.1";

const config = {
  // Local: hit backend directly (dev)
  // Production (EC2): go through Nginx reverse proxy
  API_BASE_URL: isLocal ? "http://localhost:3001" : "/api",
};

export default config;
