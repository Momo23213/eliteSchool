import api from "./api";

export const presenceService = {
  getAll: async () => {
    const res = await api.get("/presences");
    return res.data;
  },

  getByEleve: async (eleveId) => {
    const res = await api.get(`/presences/eleve/${eleveId}`);
    return res.data;
  },

  create: async (data) => {
    const res = await api.post("/presences", data);
    return res.data;
  },

  update: async (id, data) => {
    const res = await api.put(`/presences/${id}`, data);
    return res.data;
  },

  remove: async (id) => {
    await api.delete(`/presences/${id}`);
  },
};
