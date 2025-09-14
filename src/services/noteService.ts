import api from "./api";
import { Note } from "../types/types";
import axios, { AxiosError } from 'axios';

// L'URL de votre API de backend
const API_URL = "https://schoolelite.onrender.com/api/notes/tableau";
interface NoteDataForAPI {
  eleveId: string;
  matiereId: string;
  enseignantId: string;
  valeur: number;
  trimestre: string;
  sequence: string;
  anneeScolaireId: string;
}

export const noteService = {
  getAll: async (): Promise<Note[]> => {
    const res = await api.get("/notes/affiches");
    return res.data;
  },

  getById: async (id: string): Promise<Note> => {
    const res = await api.get(`/notes/${id}`);
    return res.data;
  },

  getByEleve: async (eleveId: string): Promise<Note[]> => {
    const res = await api.get(`/notes/eleve/${eleveId}`);
    return res.data;
  },

  getByClasseAnnee: async (classeId: string, anneeScolaireId: string): Promise<Note[]> => {
    const res = await api.get(`/notes/classe/${classeId}/annee/${anneeScolaireId}`);
    return res.data;
  },

  create: async (data: Partial<Note>): Promise<Note> => {
    const res = await api.post("/notes", data);
    return res.data;
  },
  createTableau: async (notes: NoteDataForAPI[]): Promise<any> => {
    try {
      const response = await axios.post(API_URL, notes, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      // Axios renvoie directement les données, pas besoin de `response.json()`
      return response.data;
    } catch (error) {
      // Axios gère les erreurs en lançant une exception
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<any>;
        if (axiosError.response) {
          // L'API a répondu avec un code d'erreur (4xx, 5xx)
          throw new Error(axiosError.response.data.message || 'Échec de l\'enregistrement des notes.');
        } else if (axiosError.request) {
          // La requête a été faite mais aucune réponse n'a été reçue (serveur non démarré, CORS, etc.)
          throw new Error("Aucune réponse du serveur. Vérifiez que votre backend est en cours d'exécution.");
        } else {
          // Quelque chose s'est mal passé lors de la configuration de la requête
          throw new Error("Erreur de requête : " + axiosError.message);
        }
      }
      throw new Error("Une erreur inattendue est survenue.");
    }
  },
  createTableaux: async (data: Partial<NoteDataForAPI>): Promise<Note> => {
    const res = await api.post("/notes/tableau", data);
    return res.data;
  },

  update: async (noteId: string, data: Partial<Note>): Promise<Note> => {
    const res = await api.put(`/notes/${noteId}`, data);
    return res.data;
  },

  remove: async (noteId: string): Promise<void> => {
    await api.delete(`/notes/${noteId}`);
  },

  // Moyenne et classements
  getMoyenneTrimestreEleve: async (eleveId: string, trimestre: string) => {
    const res = await api.get(`/notes/moyenne/${eleveId}/trimestre/${trimestre}`);
    return res.data;
  },

  getMoyenneAnnuelleEleve: async (eleveId: string, anneeScolaireId: string) => {
    const res = await api.get(`/notes/moyenne/${eleveId}/annee/${anneeScolaireId}`);
    return res.data;
  },

  getClasseMoyenneTrimestre: async (classeId: string, anneeScolaireId: string, trimestre: string) => {
    const res = await api.get(`/notes/classe/${classeId}/trimestre/${trimestre}`);
    return res.data;
  },

  getClasseMoyenneAnnuelle: async (classeId: string, anneeScolaireId: string) => {
    const res = await api.get(`/notes/classe/${classeId}/annee/${anneeScolaireId}`);
    return res.data;
  },

  // Export PDF/Excel
  exportPDF: async (classeId: string, anneeScolaireId: string, trimestre: string) => {
    const res = await api.get(`/notes/export/pdf/${classeId}/${anneeScolaireId}/${trimestre}`, { responseType: "blob" });
    return res.data;
  },

  exportExcel: async (classeId: string, anneeScolaireId: string, trimestre: string) => {
    const res = await api.get(`/notes/export/excel/${classeId}/${anneeScolaireId}/${trimestre}`, { responseType: "blob" });
    return res.data;
  },
};
