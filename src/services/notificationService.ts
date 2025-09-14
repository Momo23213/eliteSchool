import api from "./api";
import { Notification } from "../types/types";

export const notificationService = {
  getAll: async (): Promise<Notification[]> => {
    const res = await api.get("/notifications");
    return res.data;
  },

  getByUser: async (userId: string): Promise<Notification[]> => {
    const res = await api.get(`/notifications/user/${userId}`);
    return res.data;
  },

  create: async (data: Partial<Notification>): Promise<Notification> => {
    const res = await api.post("/notifications", data);
    return res.data;
  },

  update: async (id: string, data: Partial<Notification>): Promise<Notification> => {
    const res = await api.put(`/notifications/${id}`, data);
    return res.data;
  },

  remove: async (id: string): Promise<void> => {
    await api.delete(`/notifications/${id}`);
  },
};
