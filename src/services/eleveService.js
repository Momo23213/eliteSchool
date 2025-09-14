import api from "./api";

const eleveService = {
  getAll: async () => {
    const res = await api.get("/eleves");
    return res.data;
  },

  getById: async (id) => {
    const res = await api.get(`/eleves/${id}`);
    return res.data;
  },

  create: async (data) => {
    const res = await api.post("/inscrire", data, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
  },

  update: async (id, data) => {
    const headers =
      data instanceof FormData
        ? { "Content-Type": "multipart/form-data" }
        : { "Content-Type": "application/json" };
    const res = await api.put(`/eleves/${id}`, data, { headers });
    return res.data;
  },

  remove: async (id) => {
    await api.delete(`/eleves/${id}`);
  },

  getByClasse: async (classeId) => {
    const res = await api.get(`/eleves/classe/${classeId}`);
    return res.data;
  },

  reinscrire: async (data) => {
    const res = await api.post("/reinscrire", data, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
  },
};

export default eleveService;
