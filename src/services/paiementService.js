import api from "./api";

const paiementService = {
  creer: async (data) => {
    const res = await api.post("/paiements/creer", data);
    return res.data;
  },

  ajouter: async (data) => {
    const res = await api.post("/paiements/ajouter", data);
    return res.data;
  },

  getByEleve: async (eleveId) => {
    const res = await api.get(`/paiements/eleves/${eleveId}`);
    return res.data;
  },

  getAllPaiements: async (page = 1, limit = 10) => {
    const res = await api.get(`/paiements/affiches?page=${page}&limit=${limit}`);
    return res.data;
  },

  getByClasseAnnee: async (eleveId, classeId, anneeScolaireId) => {
    const res = await api.get(`/paiements/${eleveId}/${classeId}/${anneeScolaireId}`);
    return res.data;
  },

  remove: async (paiementId) => {
    await api.delete(`/paiements/${paiementId}`);
  },
};

export default paiementService;
