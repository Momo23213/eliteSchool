// src/services/api.ts
import axios from "axios";

const api = axios.create({
  baseURL: "https://schoolelite.onrender.com/api", // 👉 adapte ton backend
  withCredentials: true, // ⚡ cookies activés
  headers: {
    "Content-Type": "application/json",
  },
});


// 🔹 ajoute automatiquement le token dans les headers
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;