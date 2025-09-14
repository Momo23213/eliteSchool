import api from "./api";

export const messageService = {
  getByRoom: async (room) => {
    const res = await api.get(`/messages/room/${room}`);
    return res.data;
  },

  getPrivate: async (user1, user2) => {
    const res = await api.get(`/messages/private/${user1}/${user2}`);
    return res.data;
  },

  create: async (data) => {
    const res = await api.post("/messages", data);
    return res.data;
  },

  update: async (id, data) => {
    const res = await api.put(`/messages/${id}`, data);
    return res.data;
  },

  remove: async (id) => {
    await api.delete(`/messages/${id}`);
  },
};
