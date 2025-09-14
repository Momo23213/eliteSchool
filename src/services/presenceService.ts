import api from "./api";
import { Presence } from "../types/types";

export const presenceService = {
  getAll: async (): Promise<Presence[]> => {
    const res = await api.get("/presences");
    return res.data;
  },

  getByEleve: async (eleveId: string): Promise<Presence[]> => {
    const res = await api.get(`/presences/eleve/${eleveId}`);
    return res.data;
  },

  create: async (data: Partial<Presence>): Promise<Presence> => {
    const res = await api.post("/presences", data);
    return res.data;
  },

  update: async (id: string, data: Partial<Presence>): Promise<Presence> => {
    const res = await api.put(`/presences/${id}`, data);
    return res.data;
  },

  remove: async (id: string): Promise<void> => {
    await api.delete(`/presences/${id}`);
  },
};
