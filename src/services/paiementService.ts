import api from "./api";
import { Paiement } from "../types/types";

export const paiementService = {
  creer: async (data: Partial<Paiement>): Promise<Paiement> => {
    const res = await api.post("/paiements/creer", data);
    return res.data;
  },

  ajouter: async (data: Partial<Paiement>): Promise<Paiement> => {
    const res = await api.post("/paiements/ajouter", data);
    return res.data;
  },

  getByEleve: async (eleveId: string): Promise<Paiement[]> => {
    const res = await api.get(`/paiements/eleve/${eleveId}`);
    return res.data;
  },
  getAllPaiements: async (page = 1, limit = 10): Promise<{paiements: Paiement[]; total: number}> => {
    const res = await api.get(`/paiements/affiches?page=${page}&limit=${limit}`);
    return res.data;
  },

  getByClasseAnnee: async (eleveId: string, classeId: string, anneeScolaireId: string): Promise<Paiement[]> => {
    const res = await api.get(`/paiements//${eleveId}/${classeId}/${anneeScolaireId}`);
    return res.data;
  },

  remove: async (paiementId: string): Promise<void> => {
    await api.delete(`/paiements//${paiementId}`);
  },
};
