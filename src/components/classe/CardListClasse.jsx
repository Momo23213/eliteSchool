import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, Plus, Filter, Edit, Trash2, Users, BookOpen, GraduationCap, CheckCircle, XCircle } from 'lucide-react';

export default function Classes() {
  const [classes, setClasses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddMatiereModal, setShowAddMatiereModal] = useState(false); // 🆕 Nouvel état
  const [selectedClass, setSelectedClass] = useState(null);

  const fetchClasses = async () => {
    try {
      const response = await axios.get('http://localhost:3002/api/classe');
      if (Array.isArray(response.data.classes)) {
        setClasses(response.data.classes);
      } else {
        setError('Les données de l\'API ne sont pas au format attendu.');
      }
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.message);
      } else {
        setError('Une erreur inattendue est survenue.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchClasses();
  }, []);

  const handleCreateSuccess = () => {
    setShowCreateModal(false);
    setSuccessMessage('Classe créée avec succès !');
    fetchClasses();
  };

  const handleEditSuccess = () => {
    setShowEditModal(false);
    setSuccessMessage('Classe modifiée avec succès !');
    fetchClasses();
  };

  const handleAddMatiereSuccess = () => {
    setShowAddMatiereModal(false);
    setSuccessMessage('Matière ajoutée à la classe avec succès !');
    fetchClasses();
  };

  const handleError = (message) => {
    setError(message);
    setShowCreateModal(false);
    setShowEditModal(false);
    setShowAddMatiereModal(false); // Ferme également la nouvelle modale
  };
  
  const handleEdit = (cls) => {
    setSelectedClass(cls);
    setShowEditModal(true);
    setError(null);
    setSuccessMessage(null);
  };

  const handleDelete = async (classId) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette classe ?')) {
      try {
        await axios.delete(`http://localhost:3002/api/classe/${classId}`);
        setSuccessMessage('Classe supprimée avec succès !');
        fetchClasses();
      } catch (err) {
        if (axios.isAxiosError(err) && err.response) {
          setError(err.response.data.message || 'Erreur lors de la suppression.');
        } else {
          setError('Une erreur inattendue est survenue lors de la suppression.');
        }
      }
    }
  };
  
  const filteredClasses = Array.isArray(classes) ? classes.filter(cls =>
    cls.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cls.niveau.toLowerCase().includes(searchTerm.toLowerCase())
  ) : [];

  const getOccupancyColor = (current, capacity) => {
    const ratio = current / capacity;
    if (ratio >= 0.9) return 'text-red-600';
    if (ratio >= 0.7) return 'text-orange-600';
    return 'text-green-600';
  };

  const getOccupancyBgColor = (current, capacity) => {
    const ratio = current / capacity;
    if (ratio >= 0.9) return 'bg-red-100 dark:bg-red-900/20';
    if (ratio >= 0.7) return 'bg-orange-100 dark:bg-orange-900/20';
    return 'bg-green-100 dark:bg-green-900/20';
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-48 text-gray-500">
        Chargement des données...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Gestion des Classes</h2>
          <p className="text-gray-600 dark:text-gray-400">Organisez et gérez les classes de l'école</p>
        </div>
        <div className="flex gap-2">
            <button
                onClick={() => {
                    setShowCreateModal(true);
                    setError(null);
                    setSuccessMessage(null);
                }}
                className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors duration-200"
            >
                <Plus className="w-4 h-4 mr-2" />
                Nouvelle Classe
            </button>
            <button
                onClick={() => {
                    setShowAddMatiereModal(true); // 🆕 Bouton pour ouvrir le formulaire d'ajout de matière
                    setError(null);
                    setSuccessMessage(null);
                }}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
            >
                <BookOpen className="w-4 h-4 mr-2" />
                Ajouter Matière
            </button>
        </div>
      </div>

      {error && (
        <div className="flex items-center p-3 bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400 rounded-lg">
          <XCircle className="w-5 h-5 mr-2 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}
      {successMessage && (
        <div className="flex items-center p-3 bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400 rounded-lg">
          <CheckCircle className="w-5 h-5 mr-2 flex-shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Rechercher par nom ou niveau..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 dark:bg-gray-700 dark:text-white"
            />
          </div>
          <button className="flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
            <Filter className="w-4 h-4 mr-2" />
            Filtres
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredClasses.length > 0 ? (
          filteredClasses.map((cls) => (
            <div key={cls._id} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-md transition-shadow duration-200">
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                      {cls.nom}
                    </h3>
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300">
                      {cls.niveau}
                    </span>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEdit(cls)}
                      className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(cls._id)}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Occupation</span>
                    <span className={`text-sm font-medium ${getOccupancyColor(cls.eleves.length, cls.effMax)}`}>
                      {cls.eleves.length}/{cls.effMax}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-300 ${getOccupancyBgColor(cls.eleves.length, cls.effMax).replace('bg-', 'bg-').replace('-100', '-500').replace('dark:bg-', '').replace('/20', '')}`}
                      style={{ width: `${(cls.eleves.length / cls.effMax) * 100}%` }}
                    ></div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <Users className="w-5 h-5 text-blue-500 mx-auto mb-1" />
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{cls.eleves.length}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Élèves</p>
                  </div>
                  <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <BookOpen className="w-5 h-5 text-green-500 mx-auto mb-1" />
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{cls.matieres.length}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Matières</p>
                  </div>
                </div>
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Matières</h4>
                  <div className="flex flex-wrap gap-1">
                    {cls.matieres.slice(0, 3).map((subject, index) => (
                      <span key={index} className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                        {subject}
                      </span>
                    ))}
                    {cls.matieres.length > 3 && (
                      <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">
                        +{cls.matieres.length - 3}
                      </span>
                    )}
                  </div>
                </div>
                <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                    <GraduationCap className="w-3 h-3 mr-1" />
                    <span>Année scolaire {cls.anneeScolaireId.libelle}</span>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="md:col-span-3 text-center py-12">
            <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Aucune classe trouvée</h3>
            <p className="text-gray-600 dark:text-gray-400">Aucune classe ne correspond à vos critères de recherche.</p>
          </div>
        )}
      </div>
      
      {showCreateModal && (
        <ClassCreationForm
          onSuccess={handleCreateSuccess}
          onCancel={() => setShowCreateModal(false)}
          onError={handleError}
        />
      )}
      
      {showEditModal && selectedClass && (
        <ClassEditForm
          classe={selectedClass}
          onSuccess={handleEditSuccess}
          onCancel={() => setShowEditModal(false)}
          onError={handleError}
        />
      )}

      {showAddMatiereModal && (
        <AddMatiereForm
          onSuccess={handleAddMatiereSuccess}
          onCancel={() => setShowAddMatiereModal(false)}
          onError={handleError}
        />
      )}
    </div>
  );
}