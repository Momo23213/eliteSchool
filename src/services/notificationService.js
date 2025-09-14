import api from "./api";

export const notificationService = {
  getAll: async () => {
    const res = await api.get("/notifications");
    return res.data;
  },

  getByUser: async (userId) => {
    const res = await api.get(`/notifications/user/${userId}`);
    return res.data;
  },

  create: async (data) => {
    const res = await api.post("/notifications", data);
    return res.data;
  },

  update: async (id, data) => {
    const res = await api.put(`/notifications/${id}`, data);
    return res.data;
  },

  remove: async (id) => {
    await api.delete(`/notifications/${id}`);
  },
};
