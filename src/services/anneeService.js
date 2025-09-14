import api from "./api";

const anneeService = {
  getAll: async () => {
    const res = await api.get("/annees");
    return res.data;
  },

  getById: async (id) => {
    const res = await api.get(`/annees/${id}`);
    return res.data;
  },

  create: async (data) => {
    const res = await api.post("/annees", data);
    return res.data;
  },

  update: async (id, data) => {
    const res = await api.put(`/annees/${id}`, data);
    return res.data;
  },

  remove: async (id) => {
    await api.delete(`/annees/${id}`);
  },
};

export default anneeService;
