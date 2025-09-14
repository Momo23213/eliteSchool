import api from "./api";
import { Emploi } from "../types/types";

export const emploiService = {
  getAll: async (): Promise<Emploi[]> => {
    const res = await api.get("/emplois");
    return res.data;
  },

  getById: async (id: string): Promise<Emploi> => {
    const res = await api.get(`/emplois/${id}`);
    return res.data;
  },

  getByClasseAnnee: async (classeId: string, anneeScolaireId: string): Promise<Emploi[]> => {
    const res = await api.get(`/emplois/classe/${classeId}/annee/${anneeScolaireId}`);
    return res.data;
  },

  create: async (data: Partial<Emploi>): Promise<Emploi> => {
    const res = await api.post("/emplois", data);
    return res.data;
  },

  update: async (id: string, data: Partial<Emploi>): Promise<Emploi> => {
    const res = await api.put(`/emplois/${id}`, data);
    return res.data;
  },

  remove: async (id: string): Promise<void> => {
    await api.delete(`/emplois/${id}`);
  },
};
