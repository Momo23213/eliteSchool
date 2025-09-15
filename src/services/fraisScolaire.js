import api from "./api";

const fraiService = {
  creer: async (data) => {
    const res = await api.post("/frais/creer", data);
    return res.data;
  },

  ajouter: async (data) => {
    const res = await api.post("/frais/frai", data);
    return res.data;
  },

  getByEleve: async (eleveId) => {
    const res = await api.get(`/frais/eleve/${eleveId}`);
    return res.data;
  },

  getAllfrai: async () => {
    const res = await api.get(`/frais/fraisListe`);
    return res.data;
  },
  getfraiByClasse: async (classeId, anneeScolaireId) => {
    const res = await api.get(`/frais/${classeId}/${anneeScolaireId}`);
    return res.data;
  },

  getByClasseAnnee: async (eleveId, classeId, anneeScolaireId) => {
    const res = await api.get(`/frais/${eleveId}/${classeId}/${anneeScolaireId}`);
    return res.data;
  },

  remove: async (paiementId) => {
    await api.delete(`/frais/${paiementId}`);
  },
};

export default fraiService;
