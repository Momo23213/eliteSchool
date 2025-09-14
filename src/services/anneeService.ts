import api from "./api";
import { AnneeScolaire } from "../types/types";

export const anneeService = {
  getAll: async (): Promise<AnneeScolaire[]> => {
    const res = await api.get("/annees");
    return res.data;
  },

  getById: async (id: string): Promise<AnneeScolaire> => {
    const res = await api.get(`/annees/${id}`);
    return res.data;
  },

  create: async (data: Partial<AnneeScolaire>): Promise<AnneeScolaire> => {
    const res = await api.post("/annees", data);
    return res.data;
  },

  update: async (id: string, data: Partial<AnneeScolaire>): Promise<AnneeScolaire> => {
    const res = await api.put(`/annees/${id}`, data);
    return res.data;
  },

  remove: async (id: string): Promise<void> => {
    await api.delete(`/annees/${id}`);
  },
};
