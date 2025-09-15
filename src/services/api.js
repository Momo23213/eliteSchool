import axios from "axios";

const api = axios.create({
  baseURL: "https://schoolelite.onrender.com/api",
  withCredentials: true,
});
// "https://schoolelite.onrender.com/api"
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
