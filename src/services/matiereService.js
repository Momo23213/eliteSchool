import api from "./api";

const matiereService = {
  getAll: async () => {
    const res = await api.get("/matieres/afiches");
    return res.data;
  },

  getById: async (id) => {
    const res = await api.get(`/matieres/afiches/${id}`);
    return res.data;
  },

  create: async (data) => {
    const res = await api.post("/matieres/create", data);
    return res.data;
  },

  update: async (id, data) => {
    const res = await api.put(`/matieres/modi/${id}`, data);
    return res.data;
  },

  remove: async (id) => {
    await api.delete(`/matieres/sup/${id}`);
  },
};

export default matiereService;
