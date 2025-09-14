
import api from "./api";
import { Eleve } from "../types/types";

export const eleveService = {
  getAll: async (): Promise<Eleve[]> => {
    const res = await api.get("/eleves");
    return res.data;
  },

  getById: async (id: string): Promise<Eleve> => {
    const res = await api.get(`/eleves/${id}`);
    return res.data;
  },

  create: async (data: Eleve): Promise<Eleve> => {
    const res = await api.post("/inscrire", data, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
  },

    // Modification avec ou sans nouvelle photo
  update: async (id: string, data: FormData | Partial<Eleve>): Promise<Eleve> => {
    const headers =
      data instanceof FormData
        ? { "Content-Type": "multipart/form-data" }
        : { "Content-Type": "application/json" };

    const res = await api.put(`/eleves/${id}`, data, { headers });
    return res.data;
  },

  // Suppression
  remove: async (id: string): Promise<void> => {
    await api.delete(`/eleves/${id}`);
  },

  getByClasse: async (classeId: string): Promise<Eleve[]> => {
    const res = await api.get(`/eleves/classe/${classeId}`);
    return res.data;
  },
    // Réinscription d'un élève
  reinscrire: async (data: FormData): Promise<any> => {
    const res = await api.post("/reinscrire", data, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
  },
};
