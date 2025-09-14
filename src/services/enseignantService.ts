import api from "./api";
import { Enseignant } from "../types/types";

export const enseignantService = {
  getAll: async (): Promise<Enseignant[]> => {
    const res = await api.get("/enseignants");
    return res.data;
  },

  getById: async (id: string): Promise<Enseignant> => {
    const res = await api.get(`/enseignants/${id}`);
    return res.data;
  },

  create: async (data: Partial<Enseignant>): Promise<Enseignant> => {
    const res = await api.post("/enseignants", data);
    return res.data;
  },

  update: async (id: string, data: Partial<Enseignant>): Promise<Enseignant> => {
    const res = await api.put(`/enseignants/${id}`, data);
    return res.data;
  },

  remove: async (id: string): Promise<void> => {
    await api.delete(`/enseignants/${id}`);
  },
};
