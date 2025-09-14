import api from "./api";
import { Classe } from "../types/types";


export const classeService = {
  getAll: async (): Promise<Classe[]> => {
    const res = await api.get("/classe");
    return res.data;
  },
  getAllEleve: async (id:string): Promise<any[]> => {
    const res = await api.get(`/classe/${id}`);
    // On retourne le tableau d'élèves directement
    return res.data.eleves || [];
  },

  getById: async (classeId: string): Promise<Classe> => {
    const res = await api.get(`/classe/${classeId}`);
    return res.data;
  },

  create: async (data: Partial<Classe>): Promise<Classe> => {
    const res = await api.post("/classe/creer", data);
    return res.data;
  },

  update: async (classeId: string, data: Partial<Classe>): Promise<Classe> => {
    const res = await api.put(`/classe/${classeId}`, data);
    return res.data;
  },

  remove: async (classeId: string): Promise<void> => {
    await api.delete(`/classe/${classeId}`);
  },

  getEleves: async (classeId: string): Promise<any[]> => {
    const res = await api.get(`/classe/${classeId}/eleves`);
    return res.data;
  },

  addEnseignant: async (classeId: string, enseignantId: string): Promise<Classe> => {
    const res = await api.post("/add-enseignant", { classeId, enseignantId });
    return res.data;
  },

  removeEnseignant: async (classeId: string, enseignantId: string): Promise<Classe> => {
    const res = await api.post("/remove-enseignant", { classeId, enseignantId });
    return res.data;
  },

  addMatiere: async (classeId: string, matiereId: string): Promise<Classe> => {
    const res = await api.post("/add", { classeId, matiereId });
    return res.data;
  },

  removeMatiere: async (classeId: string, matiereId: string): Promise<Classe> => {
    const res = await api.post("/remove", { classeId, matiereId });
    return res.data;
  },
};
