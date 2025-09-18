import React, { useState, useEffect } from 'react';
import { Calendar, Clock, BookOpen, Users, Plus, Filter, Search, ChevronDown, Edit, Trash2, Eye, Save, X, List, GraduationCap, User } from 'lucide-react';
import { emploiService } from '../services/emploiService';
import classeService from '../services/classeService';
import matiereService from '../services/matiereService';
import enseignantService from '../services/enseignantService';
import { notifySuccess, notifyError, notifyInfo } from '../components/toastService';
import { Modal } from '../components/Modal';

function Emploidutemps() {
  const [emplois, setEmplois] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedWeek, setSelectedWeek] = useState(getCurrentWeek());
  const [selectedClasse, setSelectedClasse] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedEmploi, setSelectedEmploi] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [showReferenceData, setShowReferenceData] = useState(false);
  
  // États pour les données de référence
  const [classes, setClasses] = useState([]);
  const [matieres, setMatieres] = useState([]);
  const [enseignants, setEnseignants] = useState([]);
  
  // États pour le formulaire
  const [formData, setFormData] = useState({
    classeId: '',
    jour: '',
    matieres: [{
      matiereId: '',
      enseignantId: '',
      heureDebut: '',
      heureFin: ''
    }]
  });

  // Jours de la semaine
  const jours = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
  
  // Créneaux horaires (2 heures par créneau)
  const creneaux = [
    '08:00 - 10:00',
    '10:00 - 12:00',
    '12:00 - 14:00',
    '14:00 - 16:00',
    '16:00 - 18:00'
  ];

  function getCurrentWeek() {
    const now = new Date();
    const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay() + 1));
    return startOfWeek.toISOString().split('T')[0];
  }

  const fetchEmplois = async () => {
    try {
      setLoading(true);
      const data = await emploiService.getAll();
      setEmplois(data);
      notifySuccess(`${data.length} emplois du temps chargés`);
    } catch (error) {
      console.error('Erreur lors du chargement des emplois:', error);
      notifyError('Erreur lors du chargement des emplois du temps');
    } finally {
      setLoading(false);
    }
  };

  const fetchReferenceData = async () => {
    try {
      const [classesData, matieresData, enseignantsData] = await Promise.all([
        classeService.getAll(),
        matiereService.getAll(),
        enseignantService.getAll()
      ]);
      setClasses(classesData);
      setMatieres(matieresData);
      setEnseignants(enseignantsData);
    } catch (error) {
      console.error('Erreur lors du chargement des données de référence:', error);
      notifyError('Erreur lors du chargement des données');
    }
  };

  useEffect(() => {
    fetchEmplois();
    fetchReferenceData();
  }, []);

  const resetForm = () => {
    setFormData({
      classeId: '',
      jour: '',
      matieres: [{
        matiereId: '',
        enseignantId: '',
        heureDebut: '',
        heureFin: ''
      }]
    });
  };

  const handleAddEmploi = () => {
    setSelectedEmploi(null);
    resetForm();
    setIsAddModalOpen(true);
  };

  const handleEditEmploi = (matiere) => {
    // Trouver l'emploi complet à partir de la matière
    const emploi = emplois.find(e => 
      e.matieres?.some(m => 
        (m.matiereId === matiere.matiereId || m.matiereId?._id === matiere.matiereId?._id) && 
        m.heureDebut === matiere.heureDebut
      )
    );
    
    if (emploi) {
      setSelectedEmploi(emploi);
      setFormData({
        classeId: emploi.classeId?._id || '',
        jour: emploi.jour,
        matieres: emploi.matieres || []
      });
      setIsAddModalOpen(true);
    }
  };

  const handleViewEmploi = (matiere) => {
    const emploi = emplois.find(e => 
      e.matieres?.some(m => 
        (m.matiereId === matiere.matiereId || m.matiereId?._id === matiere.matiereId?._id) && 
        m.heureDebut === matiere.heureDebut
      )
    );
    
    if (emploi) {
      setSelectedEmploi({ ...emploi, selectedMatiere: matiere });
      setIsViewModalOpen(true);
    }
  };

  const handleDeleteEmploi = async (matiere) => {
    if (!window.confirm(`Voulez-vous vraiment supprimer ce cours ?`)) return;
    
    try {
      // Trouver l'emploi complet
      const emploi = emplois.find(e => 
        e.matieres?.some(m => 
          (m.matiereId === matiere.matiereId || m.matiereId?._id === matiere.matiereId?._id) && 
          m.heureDebut === matiere.heureDebut
        )
      );
      
      if (emploi) {
        // Si c'est la seule matière, supprimer tout l'emploi
        if (emploi.matieres.length === 1) {
          await emploiService.remove(emploi._id);
          setEmplois(prev => prev.filter(e => e._id !== emploi._id));
        } else {
          // Utiliser l'endpoint spécialisé pour supprimer une matière
          const matiereId = matiere.matiereId?._id || matiere.matiereId;
          await emploiService.removeMatiere(emploi._id, matiereId);
          
          // Recharger les données pour avoir la version mise à jour
          fetchEmplois();
        }
        
        notifySuccess('Cours supprimé avec succès');
      }
    } catch (error) {
      console.error(error);
      notifyError('Impossible de supprimer le cours');
    }
  };

  const handleSaveEmploi = async () => {
    try {
      if (!formData.classeId || !formData.jour || formData.matieres.length === 0) {
        notifyError('Veuillez remplir tous les champs obligatoires');
        return;
      }

      // Valider les matières
      for (const matiere of formData.matieres) {
        if (!matiere.matiereId || !matiere.enseignantId || !matiere.heureDebut || !matiere.heureFin) {
          notifyError('Veuillez remplir tous les champs de chaque matière');
          return;
        }
      }

      if (selectedEmploi) {
        // Modification
        await emploiService.update(selectedEmploi._id, formData);
        setEmplois(prev => prev.map(e => 
          e._id === selectedEmploi._id ? { ...selectedEmploi, ...formData } : e
        ));
        notifySuccess('Emploi du temps modifié avec succès');
      } else {
        // Création
        const newEmploi = await emploiService.create(formData);
        setEmplois(prev => [...prev, newEmploi]);
        notifySuccess('Emploi du temps créé avec succès');
      }

      setIsAddModalOpen(false);
      resetForm();
    } catch (error) {
      console.error(error);
      notifyError('Erreur lors de la sauvegarde');
    }
  };

  const addMatiere = () => {
    setFormData(prev => ({
      ...prev,
      matieres: [...prev.matieres, {
        matiereId: '',
        enseignantId: '',
        heureDebut: '',
        heureFin: ''
      }]
    }));
  };

  const removeMatiere = (index) => {
    setFormData(prev => ({
      ...prev,
      matieres: prev.matieres.filter((_, i) => i !== index)
    }));
  };

  const updateMatiere = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      matieres: prev.matieres.map((matiere, i) => 
        i === index ? { ...matiere, [field]: value } : matiere
      )
    }));
  };

  const getCoursForSlot = (jour, creneau) => {
    const heureDebut = creneau.split(' - ')[0];
    const cours = [];
    
    emplois.forEach(emploi => {
      if (emploi.jour === jour && (!selectedClasse || emploi.classeId?.nom === selectedClasse)) {
        emploi.matieres?.forEach(matiere => {
          if (matiere.heureDebut === heureDebut) {
            cours.push({
              ...matiere,
              _id: `${emploi._id}-${matiere.matiereId || matiere.matiereId?._id}`,
              emploiId: emploi._id,
              classeId: emploi.classeId,
              jour: emploi.jour
            });
          }
        });
      }
    });
    
    return cours;
  };

  const getColorForMatiere = (matiere) => {
    const colors = [
      'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 border-blue-200 dark:border-blue-700',
      'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 border-green-200 dark:border-green-700',
      'bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 border-purple-200 dark:border-purple-700',
      'bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-300 border-orange-200 dark:border-orange-700',
      'bg-pink-100 dark:bg-pink-900/30 text-pink-800 dark:text-pink-300 border-pink-200 dark:border-pink-700',
      'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-800 dark:text-indigo-300 border-indigo-200 dark:border-indigo-700'
    ];
    const hash = matiere?.split('').reduce((a, b) => a + b.charCodeAt(0), 0) || 0;
    return colors[hash % colors.length];
  };

  if (loading) {
    return (
      <div className="min-h-screen mt-15 md:mt-11 w-full p-4 md:p-8 bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 text-gray-900 dark:text-white transition-all duration-300">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
            <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-2">
              Chargement des emplois du temps...
            </h2>
            <p className="text-gray-500 dark:text-gray-400">
              Veuillez patienter pendant le chargement des données
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen mt-15 md:mt-11 w-full p-4 md:p-8 bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 text-gray-900 dark:text-white transition-all duration-300">
      <div className="max-w-7xl mx-auto">
        {/* En-tête */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
            Emploi du Temps
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Gestion et visualisation des emplois du temps par classe
          </p>
        </div>

        {/* Barre d'outils */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 mb-6">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-4 items-center">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-blue-500" />
                <input
                  type="week"
                  value={selectedWeek}
                  onChange={(e) => setSelectedWeek(e.target.value)}
                  className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
              
              <select
                value={selectedClasse}
                onChange={(e) => setSelectedClasse(e.target.value)}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              >
                <option value="">Toutes les classes</option>
                {/* Options dynamiques basées sur les emplois */}
{[...new Set(emplois.map(e => e.classeId?.nom).filter(Boolean))].map(classe => (
                  <option key={classe} value={classe}>{classe}</option>
                ))}
              </select>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                <Filter className="w-4 h-4" />
                Filtres
                <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
              </button>

              <button
                onClick={() => setShowReferenceData(!showReferenceData)}
                className="flex items-center gap-2 px-4 py-2 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-800 dark:text-indigo-300 rounded-lg hover:bg-indigo-200 dark:hover:bg-indigo-800/50 transition-colors"
              >
                <List className="w-4 h-4" />
                Données de référence
                <ChevronDown className={`w-4 h-4 transition-transform ${showReferenceData ? 'rotate-180' : ''}`} />
              </button>
              
              <button
                onClick={handleAddEmploi}
                className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-105 shadow-lg"
              >
                <Plus className="w-4 h-4" />
                Ajouter un cours
              </button>
            </div>
          </div>
        </div>

        {/* Section des données de référence */}
        {showReferenceData && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 mb-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Classes */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-4">
                  <GraduationCap className="w-5 h-5 text-blue-500" />
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Classes ({classes.length})
                  </h3>
                </div>
                <div className="max-h-64 overflow-y-auto space-y-2">
                  {classes.length > 0 ? (
                    classes.map(classe => (
                      <div key={classe._id} className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-700">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium text-blue-900 dark:text-blue-300">
                              {classe.nom}
                            </h4>
                            <p className="text-sm text-blue-700 dark:text-blue-400">
                              Niveau: {classe.niveau || 'Non défini'}
                            </p>
                            {classe.effectif && (
                              <p className="text-xs text-blue-600 dark:text-blue-500">
                                {classe.effectif} élèves
                              </p>
                            )}
                          </div>
                          <div className="text-blue-500">
                            <Users className="w-4 h-4" />
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                      <GraduationCap className="w-8 h-8 mx-auto mb-2 opacity-50" />
                      <p>Aucune classe disponible</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Matières */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-4">
                  <BookOpen className="w-5 h-5 text-green-500" />
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Matières ({matieres.length})
                  </h3>
                </div>
                <div className="max-h-64 overflow-y-auto space-y-2">
                  {matieres.length > 0 ? (
                    matieres.map(matiere => (
                      <div key={matiere._id} className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-700">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium text-green-900 dark:text-green-300">
                              {matiere.nom}
                            </h4>
                            {matiere.code && (
                              <p className="text-sm text-green-700 dark:text-green-400">
                                Code: {matiere.code}
                              </p>
                            )}
                            {matiere.coefficient && (
                              <p className="text-xs text-green-600 dark:text-green-500">
                                Coeff: {matiere.coefficient}
                              </p>
                            )}
                          </div>
                          <div className="text-green-500">
                            <BookOpen className="w-4 h-4" />
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                      <BookOpen className="w-8 h-8 mx-auto mb-2 opacity-50" />
                      <p>Aucune matière disponible</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Enseignants */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-4">
                  <User className="w-5 h-5 text-purple-500" />
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Enseignants ({enseignants.length})
                  </h3>
                </div>
                <div className="max-h-64 overflow-y-auto space-y-2">
                  {enseignants.length > 0 ? (
                    enseignants.map(enseignant => (
                      <div key={enseignant._id} className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-700">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium text-purple-900 dark:text-purple-300">
                              {enseignant.nom} {enseignant.prenom}
                            </h4>
                            {enseignant.email && (
                              <p className="text-sm text-purple-700 dark:text-purple-400">
                                {enseignant.email}
                              </p>
                            )}
                            {enseignant.specialite && (
                              <p className="text-xs text-purple-600 dark:text-purple-500">
                                Spécialité: {enseignant.specialite}
                              </p>
                            )}
                          </div>
                          <div className="text-purple-500">
                            <User className="w-4 h-4" />
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                      <User className="w-8 h-8 mx-auto mb-2 opacity-50" />
                      <p>Aucun enseignant disponible</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Statistiques */}
            <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-600">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                    {classes.length}
                  </div>
                  <div className="text-sm text-blue-700 dark:text-blue-300">
                    Classes disponibles
                  </div>
                </div>
                <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                    {matieres.length}
                  </div>
                  <div className="text-sm text-green-700 dark:text-green-300">
                    Matières enseignées
                  </div>
                </div>
                <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                    {enseignants.length}
                  </div>
                  <div className="text-sm text-purple-700 dark:text-purple-300">
                    Enseignants actifs
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Grille de l'emploi du temps */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-700 dark:to-gray-600">
                <tr>
                  <th className="px-4 py-4 text-left text-sm font-bold text-gray-700 dark:text-gray-300 border-r border-gray-200 dark:border-gray-600">
                    <Clock className="w-4 h-4 inline mr-2" />
                    Horaires
                  </th>
                  {jours.map(jour => (
                    <th key={jour} className="px-4 py-4 text-center text-sm font-bold text-gray-700 dark:text-gray-300 border-r border-gray-200 dark:border-gray-600 min-w-[150px]">
                      {jour}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {creneaux.map((creneau, index) => (
                  <tr key={creneau} className={`${index % 2 === 0 ? 'bg-gray-50/50 dark:bg-gray-700/30' : 'bg-white dark:bg-gray-800'} hover:bg-blue-50/50 dark:hover:bg-gray-600/30 transition-colors`}>
                    <td className="px-4 py-6 text-sm font-medium text-gray-700 dark:text-gray-300 border-r border-gray-200 dark:border-gray-600 bg-gray-100/50 dark:bg-gray-700/50">
                      {creneau}
                    </td>
                    {jours.map(jour => {
                      const cours = getCoursForSlot(jour, creneau);
                      return (
                        <td key={`${jour}-${creneau}`} className="px-2 py-2 border-r border-gray-200 dark:border-gray-600 align-top">
                          <div className="space-y-1">
                            {cours.map(matiere => (
                              <div
                                key={matiere._id}
                                className={`p-3 rounded-lg border-l-4 ${getColorForMatiere(matiere.matiereId?.nom)} hover:shadow-md transition-all duration-200 cursor-pointer group relative`}
                              >
                                <div className="flex items-start justify-between">
                                  <div className="flex-1 min-w-0">
                                    <h4 className="font-semibold text-sm truncate flex items-center gap-1">
                                      <BookOpen className="w-3 h-3" />
                                      {matiere.matiereId?.nom || 'Matière'}
                                    </h4>
                                    <p className="text-xs opacity-75 flex items-center gap-1 mt-1">
                                      <Users className="w-3 h-3" />
                                      {matiere.classeId?.nom || 'Classe'}
                                    </p>
                                    <p className="text-xs opacity-75 mt-1">
                                      {matiere.enseignantId?.nom || 'Enseignant'}
                                    </p>
                                    <p className="text-xs opacity-75 mt-1">
                                      {matiere.heureDebut} - {matiere.heureFin}
                                    </p>
                                  </div>
                                  
                                  {/* Actions au hover */}
                                  <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                                    <button
                                      onClick={() => handleViewEmploi(matiere)}
                                      className="p-1 hover:bg-blue-100 rounded text-blue-600"
                                      title="Voir détails"
                                    >
                                      <Eye className="w-3 h-3" />
                                    </button>
                                    <button
                                      onClick={() => handleEditEmploi(matiere)}
                                      className="p-1 hover:bg-white/50 rounded"
                                      title="Modifier"
                                    >
                                      <Edit className="w-3 h-3" />
                                    </button>
                                    <button
                                      onClick={() => handleDeleteEmploi(matiere)}
                                      className="p-1 hover:bg-red-100 rounded text-red-600"
                                      title="Supprimer"
                                    >
                                      <Trash2 className="w-3 h-3" />
                                    </button>
                                  </div>
                                </div>
                              </div>
                            ))}
                            
                            {/* Slot vide - possibilité d'ajouter */}
                            {cours.length === 0 && (
                              <div
                                onClick={handleAddEmploi}
                                className="h-16 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg flex items-center justify-center hover:border-blue-400 hover:bg-blue-50/30 dark:hover:bg-blue-900/20 transition-all cursor-pointer group"
                              >
                                <Plus className="w-4 h-4 text-gray-400 group-hover:text-blue-500" />
                              </div>
                            )}
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Légende */}
        <div className="mt-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Eye className="w-5 h-5 text-blue-500" />
            Légende
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {[...new Set(
              emplois.flatMap(e => 
                e.matieres?.map(m => m.matiereId?.nom).filter(Boolean) || []
              )
            )].map(matiere => (
              <div key={matiere} className={`p-2 rounded-lg border-l-4 ${getColorForMatiere(matiere)} text-sm`}>
                {matiere}
              </div>
            ))}
          </div>
        </div>

        {/* Modal pour ajouter/modifier un cours */}
        <Modal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          title={selectedEmploi ? "Modifier l'emploi du temps" : "Ajouter un emploi du temps"}
          size="large"
        >
          <div className="p-6 space-y-6">
            {/* Informations générales */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Classe *
                </label>
                <select
                  value={formData.classeId}
                  onChange={(e) => setFormData(prev => ({ ...prev, classeId: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                  required
                >
                  <option value="">Sélectionner une classe</option>
                  {classes.map(classe => (
                    <option key={classe._id} value={classe._id}>
                      {classe.nom}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Jour *
                </label>
                <select
                  value={formData.jour}
                  onChange={(e) => setFormData(prev => ({ ...prev, jour: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                  required
                >
                  <option value="">Sélectionner un jour</option>
                  {jours.map(jour => (
                    <option key={jour} value={jour}>
                      {jour}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Matières */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Matières et horaires
                </h3>
                <button
                  type="button"
                  onClick={addMatiere}
                  className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Ajouter une matière
                </button>
              </div>

              <div className="space-y-4">
                {formData.matieres.map((matiere, index) => (
                  <div key={index} className="p-4 border border-gray-200 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium text-gray-900 dark:text-white">
                        Matière {index + 1}
                      </h4>
                      {formData.matieres.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeMatiere(index)}
                          className="p-1 text-red-600 hover:bg-red-100 rounded"
                          title="Supprimer cette matière"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Matière *
                        </label>
                        <select
                          value={matiere.matiereId}
                          onChange={(e) => updateMatiere(index, 'matiereId', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-600 dark:text-white text-sm"
                          required
                        >
                          <option value="">Sélectionner</option>
                          {matieres.map(mat => (
                            <option key={mat._id} value={mat._id}>
                              {mat.nom}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Enseignant *
                        </label>
                        <select
                          value={matiere.enseignantId}
                          onChange={(e) => updateMatiere(index, 'enseignantId', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-600 dark:text-white text-sm"
                          required
                        >
                          <option value="">Sélectionner</option>
                          {enseignants.map(ens => (
                            <option key={ens._id} value={ens._id}>
                              {ens.nom} {ens.prenom}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Heure début *
                        </label>
                        <select
                          value={matiere.heureDebut}
                          onChange={(e) => updateMatiere(index, 'heureDebut', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-600 dark:text-white text-sm"
                          required
                        >
                          <option value="">Sélectionner</option>
                          {creneaux.map(creneau => (
                            <option key={creneau} value={creneau.split(' - ')[0]}>
                              {creneau.split(' - ')[0]}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Heure fin *
                        </label>
                        <select
                          value={matiere.heureFin}
                          onChange={(e) => updateMatiere(index, 'heureFin', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-600 dark:text-white text-sm"
                          required
                        >
                          <option value="">Sélectionner</option>
                          {creneaux.map(creneau => (
                            <option key={creneau} value={creneau.split(' - ')[1]}>
                              {creneau.split(' - ')[1]}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-600">
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={handleSaveEmploi}
                className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200"
              >
                <Save className="w-4 h-4" />
                {selectedEmploi ? 'Modifier' : 'Créer'}
              </button>
            </div>
          </div>
        </Modal>

        {/* Modal de visualisation */}
        <Modal
          isOpen={isViewModalOpen}
          onClose={() => setIsViewModalOpen(false)}
          title="Détails du cours"
          size="medium"
        >
          {selectedEmploi && (
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">
                    Classe
                  </label>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">
                    {selectedEmploi.classeId?.nom}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">
                    Jour
                  </label>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">
                    {selectedEmploi.jour}
                  </p>
                </div>
              </div>

              {selectedEmploi.selectedMatiere && (
                <div className="border-t border-gray-200 dark:border-gray-600 pt-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                    Informations du cours
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">
                        Matière
                      </label>
                      <p className="text-gray-900 dark:text-white">
                        {selectedEmploi.selectedMatiere.matiereId?.nom}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">
                        Enseignant
                      </label>
                      <p className="text-gray-900 dark:text-white">
                        {selectedEmploi.selectedMatiere.enseignantId?.nom} {selectedEmploi.selectedMatiere.enseignantId?.prenom}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">
                        Heure de début
                      </label>
                      <p className="text-gray-900 dark:text-white">
                        {selectedEmploi.selectedMatiere.heureDebut}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">
                        Heure de fin
                      </label>
                      <p className="text-gray-900 dark:text-white">
                        {selectedEmploi.selectedMatiere.heureFin}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex justify-end pt-4 border-t border-gray-200 dark:border-gray-600">
                <button
                  onClick={() => setIsViewModalOpen(false)}
                  className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                >
                  Fermer
                </button>
              </div>
            </div>
          )}
        </Modal>
      </div>
    </div>
  );
}

export default Emploidutemps;