import api from "./api";

const classeService = {
  getAll: async () => {
    const res = await api.get("/classe");
    return res.data;
  },

  getAllEleve: async (id) => {
    const res = await api.get(`/classe/${id}`);
    return res.data.eleves; // retourne directement les élèves
  },

  getById: async (classeId) => {
    const res = await api.get(`/classe/${classeId}`);
    return res.data;
  },

  create: async (data) => {
    const res = await api.post("/classe/creer", data);
    return res.data;
  },

  update: async (classeId, data) => {
    const res = await api.put(`/classe/${classeId}`, data);
    return res.data;
  },

  remove: async (classeId) => {
    await api.delete(`/classe/${classeId}`);
  },

  getEleves: async (classeId) => {
    const res = await api.get(`/classe/${classeId}/eleves`);
    return res.data;
  },

  addEnseignant: async (classeId, enseignantId) => {
    const res = await api.post("/add-enseignant", { classeId, enseignantId });
    return res.data;
  },

  removeEnseignant: async (classeId, enseignantId) => {
    const res = await api.post("/remove-enseignant", { classeId, enseignantId });
    return res.data;
  },

  addMatiere: async (classeId, matiereId) => {
    const res = await api.post("/add", { classeId, matiereId });
    return res.data;
  },

  removeMatiere: async (classeId, matiereId) => {
    const res = await api.post("/remove", { classeId, matiereId });
    return res.data;
  },
};

export default classeService;
