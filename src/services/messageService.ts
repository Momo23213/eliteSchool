import api from "./api";
import { Message } from "../types/types";

export const messageService = {
  getByRoom: async (room: string): Promise<Message[]> => {
    const res = await api.get(`/messages/room/${room}`);
    return res.data;
  },

  getPrivate: async (user1: string, user2: string): Promise<Message[]> => {
    const res = await api.get(`/messages/private/${user1}/${user2}`);
    return res.data;
  },

  create: async (data: Partial<Message>): Promise<Message> => {
    const res = await api.post("/messages", data);
    return res.data;
  },

  update: async (id: string, data: Partial<Message>): Promise<Message> => {
    const res = await api.put(`/messages/${id}`, data);
    return res.data;
  },

  remove: async (id: string): Promise<void> => {
    await api.delete(`/messages/${id}`);
  },
};
