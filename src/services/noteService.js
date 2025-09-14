import api from "./api";
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_BASE_URL
  ? `${import.meta.env.VITE_API_BASE_URL}/notes/tableau`
  : "https://schoolelite.onrender.com/api/notes/tableau";

const noteService = {
  getAll: async () => {
    const res = await api.get("/notes/affiches");
    return res.data;
  },

  getById: async (id) => {
    const res = await api.get(`/notes/${id}`);
    return res.data;
  },

  getByEleve: async (eleveId) => {
    const res = await api.get(`/notes/eleve/${eleveId}`);
    return res.data;
  },

  getByClasseAnnee: async (classeId, anneeScolaireId) => {
    const res = await api.get(`/notes/classe/${classeId}/annee/${anneeScolaireId}`);
    return res.data;
  },

  create: async (data) => {
    const res = await api.post("/notes", data);
    return res.data;
  },

  createTableau: async (notes) => {
    try {
      const response = await axios.post(API_URL, notes, {
        headers: { 'Content-Type': 'application/json' },
      });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError && axios.isAxiosError(error)) {
        if (error.response) {
          throw new Error(error.response.data.message || 'Échec de l\'enregistrement des notes.');
        } else if (error.request) {
          throw new Error("Aucune réponse du serveur. Vérifiez que votre backend est en cours d'exécution.");
        } else {
          throw new Error("Erreur de requête : " + error.message);
        }
      }
      throw new Error("Une erreur inattendue est survenue.");
    }
  },

  createTableaux: async (data) => {
    const res = await api.post("/notes/tableau", data);
    return res.data;
  },

  update: async (noteId, data) => {
    const res = await api.put(`/notes/${noteId}`, data);
    return res.data;
  },

  remove: async (noteId) => {
    await api.delete(`/notes/${noteId}`);
  },

  getMoyenneTrimestreEleve: async (eleveId, trimestre) => {
    const res = await api.get(`/notes/moyenne/${eleveId}/trimestre/${trimestre}`);
    return res.data;
  },

  getMoyenneAnnuelleEleve: async (eleveId, anneeScolaireId) => {
    const res = await api.get(`/notes/moyenne/${eleveId}/annee/${anneeScolaireId}`);
    return res.data;
  },

  getClasseMoyenneTrimestre: async (classeId, anneeScolaireId, trimestre) => {
    const res = await api.get(`/notes/classe/${classeId}/trimestre/${trimestre}`);
    return res.data;
  },

  getClasseMoyenneAnnuelle: async (classeId, anneeScolaireId) => {
    const res = await api.get(`/notes/classe/${classeId}/annee/${anneeScolaireId}`);
    return res.data;
  },

  exportPDF: async (classeId, anneeScolaireId, trimestre) => {
    const res = await api.get(`/notes/export/pdf/${classeId}/${anneeScolaireId}/${trimestre}`, { responseType: "blob" });
    return res.data;
  },

  exportExcel: async (classeId, anneeScolaireId, trimestre) => {
    const res = await api.get(`/notes/export/excel/${classeId}/${anneeScolaireId}/${trimestre}`, { responseType: "blob" });
    return res.data;
  },
};

export default noteService;
