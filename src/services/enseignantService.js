import api from "./api";

const enseignantService = {
  getAll: async () => {
    const res = await api.get("/enseignants");
    return res.data;
  },

  getById: async (id) => {
    const res = await api.get(`/enseignants/${id}`);
    return res.data;
  },

  create: async (data) => {
    const res = await api.post("/enseignants", data);
    return res.data;
  },

  update: async (id, data) => {
    const res = await api.put(`/enseignants/${id}`, data);
    return res.data;
  },

  remove: async (id) => {
    await api.delete(`/enseignants/${id}`);
  },
};

export default enseignantService;
