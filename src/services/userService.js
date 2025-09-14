import api from "./api";

const userService = {
  getAll: async () => {
    const res = await api.get("/users");
    return res.data;
  },

  getById: async (id) => {
    const res = await api.get(`/users/${id}`);
    return res.data;
  },

  create: async (data) => {
    const res = await api.post("/users", data);
    return res.data;
  },

  update: async (id, data) => {
    const res = await api.put(`/users/${id}`, data);
    return res.data;
  },

  remove: async (id) => {
    await api.delete(`/users/${id}`);
  },

  login: async (credentials) => {
    const res = await api.post("/auth/login", credentials);
    return res.data;
  },
};

export default userService;
