import api from "./api";
import { FraisScolarite } from "../types/types";

export const fraiService = {
  creer: async (data: Partial<FraisScolarite>): Promise<FraisScolarite> => {
    const res = await api.post("/creer", data);
    return res.data;
  },

  ajouter: async (data: Partial<FraisScolarite>): Promise<FraisScolarite> => {
    const res = await api.post("/frai", data);
    return res.data;
  },

  getByEleve: async (eleveId: string): Promise<FraisScolarite[]> => {
    const res = await api.get(`/eleve/${eleveId}`);
    return res.data;
  },
  getAllfrai: async (): Promise<FraisScolarite[]> => {
    const res = await api.get(`/fraisListe`);
    return res.data;
  },

  getByClasseAnnee: async (eleveId: string, classeId: string, anneeScolaireId: string): Promise<FraisScolarite[]> => {
    const res = await api.get(`/${eleveId}/${classeId}/${anneeScolaireId}`);
    return res.data;
  },

  remove: async (paiementId: string): Promise<void> => {
    await api.delete(`/${paiementId}`);
  },
};
