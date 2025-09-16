import api from "./api";

export const messageService = {
  // 🔹 Récupérer toutes les conversations d'un utilisateur
  getConversations: async (userId) => {
    try {
      const res = await api.get(`/messages/conversations/${userId}`);
      return res.data;
    } catch (error) {
      console.log('Route conversations non disponible, mode démo');
      return [];
    }
  },

  // 🔹 Récupérer les messages d'une conversation privée
  getPrivateMessages: async (user1Id, user2Id) => {
    try {
      const res = await api.get(`/messages/private/${user1Id}/${user2Id}`);
      return res.data;
    } catch (error) {
      console.log('Route messages privés non disponible, mode démo');
      return [];
    }
  },

  // 🔹 Récupérer les messages d'un groupe (classe)
  getGroupMessages: async (classeId) => {
    try {
      const res = await api.get(`/messages/group/${classeId}`);
      return res.data;
    } catch (error) {
      console.log('Route messages groupe non disponible, mode démo');
      return [];
    }
  },

  // 🔹 Envoyer un message privé
  sendPrivateMessage: async (data) => {
    try {
      const res = await api.post("/messages/private", data);
      return res.data;
    } catch (error) {
      console.log('Message privé (mode démo):', data);
      return { 
        _id: Date.now().toString(), 
        ...data, 
        expediteur: { _id: data.expediteur, nom: data.expediteurNom || 'Utilisateur' },
        createdAt: new Date().toISOString() 
      };
    }
  },

  // 🔹 Envoyer un message de groupe
  sendGroupMessage: async (data) => {
    try {
      const res = await api.post("/messages/group", data);
      return res.data;
    } catch (error) {
      console.log('Message de groupe (mode démo):', data);
      return { 
        _id: Date.now().toString(), 
        ...data, 
        expediteur: { _id: data.expediteur, nom: data.expediteurNom || 'Utilisateur' },
        createdAt: new Date().toISOString() 
      };
    }
  },

  // 🔹 Marquer les messages comme lus
  markAsRead: async (conversationId, userId) => {
    // Route non disponible en production
    return { message: 'Messages marqués comme lus (mode démo)' };
  },

  // 🔹 Rechercher des utilisateurs pour créer une conversation
  searchUsers: async (query) => {
    const res = await api.get(`/users/search?q=${query}`);
    return res.data;
  },

  // 🔹 Créer une nouvelle conversation privée
  createPrivateConversation: async (participantIds) => {
    const res = await api.post("/messages/conversations/private", { participantIds });
    return res.data;
  },

  // 🔹 Supprimer un message
  deleteMessage: async (messageId) => {
    await api.delete(`/messages/${messageId}`);
  },
};
