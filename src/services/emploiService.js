import api from "./api";

export const emploiService = {
  // 🔹 Récupérer tous les emplois du temps
  getAll: async () => {
    const res = await api.get("/emplois");
    return res.data;
  },

  // 🔹 Récupérer un emploi du temps par ID
  getById: async (id) => {
    const res = await api.get(`/emplois/${id}`);
    return res.data;
  },

  // 🔹 Récupérer les emplois d'une classe
  getByClasse: async (classeId) => {
    const res = await api.get(`/emplois/classe/${classeId}`);
    return res.data;
  },

  // 🔹 Récupérer un emploi d'une classe à un jour précis
  getByClasseAndJour: async (classeId, jour) => {
    const res = await api.get(`/emplois/classe/${classeId}/jour/${jour}`);
    return res.data;
  },

  // 🔹 Créer un nouvel emploi du temps
  create: async (data) => {
    const res = await api.post("/emplois", data);
    return res.data;
  },

  // 🔹 Mettre à jour un emploi du temps (global)
  update: async (id, data) => {
    const res = await api.put(`/emplois/${id}`, data);
    return res.data;
  },

  // 🔹 Supprimer un emploi du temps
  remove: async (id) => {
    await api.delete(`/emplois/${id}`);
  },

  // 🔹 Ajouter ou mettre à jour une matière dans un emploi
  addOrUpdateMatiere: async (emploiId, data) => {
    const res = await api.post(`/emplois/${emploiId}/matieres`, data);
    return res.data;
  },

  // 🔹 Supprimer une matière d'un emploi du temps
  removeMatiere: async (emploiId, matiereId) => {
    const res = await api.delete(`/emplois/${emploiId}/matieres/${matiereId}`);
    return res.data;
  },

  // 🔹 Mettre à jour uniquement l’enseignant d’une matière
  updateMatiereEnseignant: async (emploiId, matiereId, enseignantId) => {
    const res = await api.put(`/emplois/${emploiId}/matieres/${matiereId}/enseignant`, {
      enseignantId,
    });
    return res.data;
  },

  // 🔹 Mettre à jour uniquement les horaires d’une matière
  updateMatiereHoraires: async (emploiId, matiereId, horaires) => {
    const res = await api.put(`/emplois/${emploiId}/matieres/${matiereId}/horaires`, horaires);
    return res.data;
  },
};
