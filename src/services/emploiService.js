import api from "./api";

export const emploiService = {
  getAll: async () => {
    const res = await api.get("/emplois");
    return res.data;
  },

  getById: async (id) => {
    const res = await api.get(`/emplois/${id}`);
    return res.data;
  },

  getByClasseAnnee: async (classeId, anneeScolaireId) => {
    const res = await api.get(`/emplois/classe/${classeId}/annee/${anneeScolaireId}`);
    return res.data;
  },

  create: async (data) => {
    const res = await api.post("/emplois", data);
    return res.data;
  },

  update: async (id, data) => {
    const res = await api.put(`/emplois/${id}`, data);
    return res.data;
  },

  remove: async (id) => {
    await api.delete(`/emplois/${id}`);
  },
};
