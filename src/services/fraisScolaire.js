import api from "./api";

const fraiService = {
  creer: async (data) => {
    const res = await api.post("/creer", data);
    return res.data;
  },

  ajouter: async (data) => {
    const res = await api.post("/frai", data);
    return res.data;
  },

  getByEleve: async (eleveId) => {
    const res = await api.get(`/eleve/${eleveId}`);
    return res.data;
  },

  getAllfrai: async () => {
    const res = await api.get(`/fraisListe`);
    return res.data;
  },

  getByClasseAnnee: async (eleveId, classeId, anneeScolaireId) => {
    const res = await api.get(`/${eleveId}/${classeId}/${anneeScolaireId}`);
    return res.data;
  },

  remove: async (paiementId) => {
    await api.delete(`/${paiementId}`);
  },
};

export default fraiService;
