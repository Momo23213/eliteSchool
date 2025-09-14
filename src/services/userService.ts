import api from "./api";
import { User } from "../types/types";

export const userService = {
  getAll: async (): Promise<User[]> => {
    const res = await api.get("/users");
    return res.data;
  },

  getById: async (id: string): Promise<User> => {
    const res = await api.get(`/users/${id}`);
    return res.data;
  },

  create: async (data: Partial<User>): Promise<User> => {
    const res = await api.post("/users", data);
    return res.data;
  },

  update: async (id: string, data: Partial<User>): Promise<User> => {
    const res = await api.put(`/users/${id}`, data);
    return res.data;
  },

  remove: async (id: string): Promise<void> => {
    await api.delete(`/users/${id}`);
  },

  // 🔹 login avec email/password
  login: async (credentials: { email: string; password: string }) => {
    const res = await api.post("/auth/login", credentials);
    return res.data; // normalement { token, user }
  },
};