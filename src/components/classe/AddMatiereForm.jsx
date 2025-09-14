import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Loader2, Plus, X } from 'lucide-react';


export default function AddMatiereForm({ onSuccess, onCancel, onError }) {
  const [classes, setClasses] = useState([]);
  const [matieres, setMatieres] = useState([]);
  const [formData, setFormData] = useState({
    classeId: '',
    matiereId: '',
  });
  const [loadingData, setLoadingData] = useState(true);
  const [loadingSubmit, setLoadingSubmit] = useState(false);

  useEffect(() => {
    const fetchSelectData = async () => {
      try {
        const [classesRes, matieresRes] = await Promise.all([
          axios.get('https://schoolelite.onrender.com/api/classe'),
          axios.get('https://schoolelite.onrender.com/api/matieres'),
        ]);
        setClasses(classesRes.data);
        setMatieres(matieresRes.data);
      } catch {
        onError('Impossible de charger les listes de classes ou de matières.');
      } finally {
        setLoadingData(false);
      }
    };
    fetchSelectData();
  }, [onError]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoadingSubmit(true);

    if (!formData.classeId || !formData.matiereId) {
      onError('Veuillez sélectionner une classe et une matière.');
      setLoadingSubmit(false);
      return;
    }

    try {
      await axios.post('https://schoolelite.onrender.com/api/classe/addMatiere', formData);
      onSuccess();
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        onError(err.response.data.message || 'Erreur lors de l\'ajout de la matière.');
      } else {
        onError('Une erreur inattendue est survenue.');
      }
    } finally {
      setLoadingSubmit(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm transition-opacity duration-300">
      <div className="w-full max-w-lg p-8 space-y-6 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 transform transition-transform duration-300 scale-95 md:scale-100">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Ajouter une Matière à une Classe</h2>
          <button onClick={onCancel} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {loadingData ? (
            <div className="flex justify-center items-center py-8 text-gray-500">
              <Loader2 className="w-6 h-6 animate-spin mr-2" />
              Chargement des données...
            </div>
          ) : (
            <>
              <div>
                <label htmlFor="classeId" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Sélectionner une Classe
                </label>
                <select
                  id="classeId"
                  name="classeId"
                  value={formData.classeId}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  required
                >
                  <option value="" disabled>-- Choisir une classe --</option>
                  {classes.map((classe) => (
                    <option key={classe._id} value={classe._id}>
                      {classe.nom} ({classe.niveau})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="matiereId" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Sélectionner une Matière
                </label>
                <select
                  id="matiereId"
                  name="matiereId"
                  value={formData.matiereId}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  required
                >
                  <option value="" disabled>-- Choisir une matière --</option>
                  {matieres.map((matiere) => (
                    <option key={matiere._id} value={matiere._id}>
                      {matiere.nom}
                    </option>
                  ))}
                </select>
              </div>
            </>
          )}

          <button
            type="submit"
            disabled={loadingData || loadingSubmit}
            className="w-full flex justify-center items-center px-4 py-2 text-white bg-purple-600 rounded-lg shadow-sm hover:bg-purple-700 focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loadingSubmit ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                <span>Ajout en cours...</span>
              </>
            ) : (
              <>
                <Plus className="w-5 h-5 mr-2" />
                <span>Ajouter la Matière</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}