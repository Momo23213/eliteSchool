import api from "./api";
import { Matiere } from "../types/types";

export const matiereService = {
  getAll: async (): Promise<Matiere[]> => {
    const res = await api.get("/matieres/afiches");
    return res.data;
  },

  getById: async (id: string): Promise<Matiere> => {
    const res = await api.get(`/matieres/afiches/${id}`);
    return res.data;
  },

  create: async (data: Partial<Matiere>): Promise<Matiere> => {
    const res = await api.post("/matieres/create", data);
    return res.data;
  },

  update: async (id: string, data: Partial<Matiere>): Promise<Matiere> => {
    const res = await api.put(`/matieres/modi/${id}`, data);
    return res.data;
  },

  remove: async (id: string): Promise<void> => {
    await api.delete(`/matieres/sup/${id}`);
  },
};
