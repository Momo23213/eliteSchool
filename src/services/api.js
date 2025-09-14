import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "https://schoolelite.onrender.com/api",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach token automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Friendly network error handling wrapper (optional)
api.interceptors.response.use(
  (res) => res,
  (error) => {
    // If network / DNS failure, normalize the error message
    if (error && error.message && (error.message === 'Network Error' || error.code === 'ERR_NETWORK')) {
      error.userMessage = 'Impossible de joindre le backend. Vérifiez la connexion ou l\'URL de l\'API.';
    }
    return Promise.reject(error);
  }
);

export default api;
