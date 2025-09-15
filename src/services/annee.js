import api from "./api";

export const anneeService = {
  // Créer une nouvelle année
  create: async (data) => {
    const res = await api.post(`annee/`, data);
    return res.data;
  },

  // Récupérer toutes les années
  getAll: async () => {
    const res = await api.get(`annee/`);
    return res.data;
  },

  // Récupérer l'année active
  getActive: async () => {
    const res = await api.get(`annee/active`);
    return res.data;
  },

  // Mettre une année en active
  setActive: async (id) => {
    const res = await api.put(`annee/active/${id}`);
    return res.data;
  },

  // Mettre à jour une année
  update: async (id, data) => {
    const res = await api.put(`annee/${id}`, data);
    return res.data;
  },

  // Supprimer une année
  remove: async (id) => {
    const res = await api.delete(`annee/${id}`);
    return res.data;
  },
};
