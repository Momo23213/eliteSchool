import React, { useState, useEffect } from 'react';
import  classeService  from '../../services/classeService';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBook, faPlus, faEdit, faTrash, faSearch, faChartBar, faSpinner, faSort } from '@fortawesome/free-solid-svg-icons';
import  matiereService  from '../../services/matiereService';
import { CheckCircle, XCircle, BookOpen, BarChart3, Filter, SortAsc, Users, BookOpen as BookOpenIcon, Trophy, Star } from 'lucide-react';
import '../../styles/animations.css';

function MatieresPage() {
  const [classes, setClasses] = useState([]);
    const [subjects, setSubjects] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [showAddModal, setShowAddModal] = useState(false);
    const [newSubject, setNewSubject] = useState({
      nom: '',
      coef: 1
    });
    const [loading, setLoading] = useState(false);
    const [successMsg, setSuccessMsg] = useState('');
    const [sortBy, setSortBy] = useState('nom');
    const [sortOrder, setSortOrder] = useState('asc');
    const [viewMode, setViewMode] = useState('grid');
    const [showFilters, setShowFilters] = useState(false);
  
    useEffect(() => {
      const fetchData = async () => {
        setLoading(true);
        try {
          const [subjectsData, classesData] = await Promise.all([
            matiereService.getAll(),
            classeService.getAll()
          ]);
          setSubjects(subjectsData);
          setClasses(classesData);
        } finally {
          setLoading(false);
        }
      };
      fetchData();
    }, []);
  
    // Fonction de tri
    const sortedAndFilteredSubjects = subjects
      .filter(subject =>
        subject.nom.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .sort((a, b) => {
        let comparison = 0;
        
        switch (sortBy) {
          case 'nom':
            comparison = a.nom.localeCompare(b.nom);
            break;
          case 'coef':
            comparison = (a.coef || 0) - (b.coef || 0);
            break;
          case 'classes':
            const classesA = classes.filter(classe => 
              Array.isArray(classe.matieres) && classe.matieres.includes(a._id)
            ).length;
            const classesB = classes.filter(classe => 
              Array.isArray(classe.matieres) && classe.matieres.includes(b._id)
            ).length;
            comparison = classesA - classesB;
            break;
        }
        
        return sortOrder === 'asc' ? comparison : -comparison;
      });
  
    // Statistiques
    const stats = {
      totalSubjects: subjects.length,
      totalClasses: classes.length,
      averageCoef: subjects.length > 0 ? 
        (subjects.reduce((sum, s) => sum + (s.coef || 0), 0) / subjects.length).toFixed(1) : 0,
      mostUsedSubject: subjects.length > 0 ? 
        subjects.reduce((prev, current) => {
          const prevClasses = classes.filter(c => 
            Array.isArray(c.matieres) && c.matieres.includes(prev._id)
          ).length;
          const currentClasses = classes.filter(c => 
            Array.isArray(c.matieres) && c.matieres.includes(current._id)
          ).length;
          return currentClasses > prevClasses ? current : prev;
        }) : null
    };
  
    const handleAddSubject = async () => {
      if (newSubject.nom && newSubject.coef) {
        setLoading(true);
        try {
          const created = await matiereService.create({ nom, coef });
          setSubjects(prev => [...prev, created]);
          setSuccessMsg('Matière ajoutée avec succès !');
          setNewSubject({ nom: '', coef: 1 });
          setShowAddModal(false);
          setTimeout(() => setSuccessMsg(''), 2000);
        } catch (e) {
          alert("Erreur lors de l'ajout de la matière");
        } finally {
          setLoading(false);
        }
      }
    };
  
    const handleDeleteSubject = async (id) => {
      if (window.confirm('Êtes-vous sûr de vouloir supprimer cette matière ?')) {
        setLoading(true);
        try {
          await matiereService.remove(id);
          setSubjects(subjects.filter(subject => subject._id !== id));
        } catch (e) {
          alert("Erreur lors de la suppression");
        } finally {
          setLoading(false);
        }
      }
    };
  
  return (
    <div className="min-h-screen mt-10 w-full p-4 md:p-8 bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 text-gray-900 dark:text-white transition-all duration-300">
        <div className="container mx-auto max-w-7xl">
                {/* En-tête avec animation */}
                <header className="mb-8 animate-fade-in">
                  <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                    <div className="flex-1">
                      <div className="flex items-center mb-4">
                        <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl mr-4 shadow-lg">
                          <BookOpenIcon className="w-8 h-8 text-white" />
                        </div>
                        <div>
                          <h1 className="text-4xl lg:text-5xl font-black bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                            Gestion des Matières
                          </h1>
                          <p className="text-gray-600 dark:text-gray-400 mt-2 text-lg">
                            Organisez et gérez les matières enseignées dans votre école
                          </p>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => setShowAddModal(true)}
                      className="group relative px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl font-bold text-lg shadow-2xl hover:shadow-purple-500/25 transition-all duration-300 transform hover:scale-105 hover:-translate-y-1"
                    >
                      <div className="flex items-center">
                        <FontAwesomeIcon icon={faPlus} className="mr-3 group-hover:rotate-90 transition-transform duration-300" />
                        Ajouter une matière
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10 blur-sm"></div>
                    </button>
                  </div>
                </header>
        
                {/* Section des statistiques */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 animate-slide-up-delay-1">
                  <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-blue-100 text-sm font-medium">Total Matières</p>
                        <p className="text-3xl font-black">{stats.totalSubjects}</p>
                      </div>
                      <div className="p-3 bg-white/20 rounded-xl">
                        <BookOpen className="w-6 h-6" />
                      </div>
                    </div>
                  </div>
        
                  <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 text-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-green-100 text-sm font-medium">Classes Actives</p>
                        <p className="text-3xl font-black">{stats.totalClasses}</p>
                      </div>
                      <div className="p-3 bg-white/20 rounded-xl">
                        <Users className="w-6 h-6" />
                      </div>
                    </div>
                  </div>
        
                  <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 text-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-purple-100 text-sm font-medium">Coeff. Moyen</p>
                        <p className="text-3xl font-black">{stats.averageCoef}</p>
                      </div>
                      <div className="p-3 bg-white/20 rounded-xl">
                        <BarChart3 className="w-6 h-6" />
                      </div>
                    </div>
                  </div>
        
                  <div className="bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl p-6 text-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-orange-100 text-sm font-medium">Plus Utilisée</p>
                        <p className="text-lg font-bold truncate">{stats.mostUsedSubject?.nom || 'N/A'}</p>
                      </div>
                      <div className="p-3 bg-white/20 rounded-xl">
                        <Trophy className="w-6 h-6" />
                      </div>
                    </div>
                  </div>
                </div>
        
                {/* Barre de recherche et contrôles */}
                <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/50 dark:border-gray-700/50 p-6 mb-8 animate-slide-up-delay-2">
                  <div className="flex flex-col lg:flex-row gap-4">
                    {/* Barre de recherche */}
                    <div className="flex-1 relative">
                      <FontAwesomeIcon 
                        icon={faSearch} 
                        className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
                      />
                      <input
                        type="text"
                        placeholder="Rechercher une matière..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-12 pr-4 py-4 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-lg transition-all duration-300"
                      />
                    </div>
        
                    {/* Contrôles */}
                    <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                      <button
                        onClick={() => setShowFilters(!showFilters)}
                        className="flex items-center px-4 py-4 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-300"
                      >
                        <Filter className="w-5 h-5 mr-2" />
                        Filtres
                      </button>
                      
                      <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="px-4 py-4 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl border-0 focus:ring-2 focus:ring-blue-500 transition-all duration-300"
                      >
                        <option value="nom">Trier par nom</option>
                        <option value="coef">Trier par coefficient</option>
                        <option value="classes">Trier par classes</option>
                      </select>
        
                      <button
                        onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                        className="flex items-center px-4 py-4 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-300"
                      >
                        <SortAsc className={`w-5 h-5 ${sortOrder === 'desc' ? 'rotate-180' : ''} transition-transform duration-300`} />
                      </button>
        
                      <div className="flex bg-gray-100 dark:bg-gray-700 rounded-xl p-1">
                        <button
                          onClick={() => setViewMode('grid')}
                          className={`p-3 rounded-lg transition-all duration-300 ${viewMode === 'grid' ? 'bg-white dark:bg-gray-600 shadow-md' : 'hover:bg-gray-200 dark:hover:bg-gray-600'}`}
                        >
                          <FontAwesomeIcon icon={faChartBar} />
                        </button>
                        <button
                          onClick={() => setViewMode('list')}
                          className={`p-3 rounded-lg transition-all duration-300 ${viewMode === 'list' ? 'bg-white dark:bg-gray-600 shadow-md' : 'hover:bg-gray-200 dark:hover:bg-gray-600'}`}
                        >
                          <FontAwesomeIcon icon={faSort} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
        
                {/* Liste des matières */}
                <div className={`${viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6' : 'space-y-4'}`}>
                  {sortedAndFilteredSubjects.map((subject, index) => {
                    const classesForSubject = classes.filter((classe) =>
                      Array.isArray(classe.matieres) && classe.matieres.includes(subject._id)
                    );
                    
                    const colors = [
                      'from-blue-500 to-blue-600',
                      'from-green-500 to-green-600', 
                      'from-purple-500 to-purple-600',
                      'from-pink-500 to-pink-600',
                      'from-orange-500 to-orange-600',
                      'from-indigo-500 to-indigo-600',
                      'from-teal-500 to-teal-600',
                      'from-red-500 to-red-600'
                    ];
                    
                    const colorIndex = index % colors.length;
                    
                    return (
                      <div
                        key={subject._id}
                        className={`group bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/50 dark:border-gray-700/50 hover:shadow-2xl transition-all duration-500 transform hover:scale-105 hover:-translate-y-2 animate-card-delay hover-lift ${
                          viewMode === 'list' ? 'p-6 flex items-center justify-between' : 'p-6'
                        }`}
                        style={{ animationDelay: `${index * 100}ms` }}
                      >
                        {viewMode === 'grid' ? (
                          <>
                            <div className="flex items-start justify-between mb-6">
                              <div className="flex items-center">
                                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${colors[colorIndex]} flex items-center justify-center mr-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                                  <FontAwesomeIcon 
                                    icon={faBook} 
                                    className="text-white text-2xl"
                                  />
                                </div>
                                <div>
                                  <h3 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
                                    {subject.nom}
                                  </h3>
                                  <p className="text-gray-500 dark:text-gray-400 text-sm">
                                    {classesForSubject.length} classe{classesForSubject.length > 1 ? 's' : ''}
                                  </p>
                                </div>
                              </div>
                              <div className="flex space-x-2">
                                <button
                                  onClick={() => {/* TODO: Implémenter l'édition */}}
                                  className="p-3 text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900 rounded-xl transition-all duration-300 hover:scale-110"
                                >
                                  <FontAwesomeIcon icon={faEdit} />
                                </button>
                                <button
                                  onClick={() => handleDeleteSubject(subject._id)}
                                  className="p-3 text-red-600 hover:bg-red-100 dark:hover:bg-red-900 rounded-xl transition-all duration-300 hover:scale-110"
                                >
                                  <FontAwesomeIcon icon={faTrash} />
                                </button>
                              </div>
                            </div>
        
                            <div className="space-y-4">
                              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
                                <span className="text-gray-600 dark:text-gray-400 font-medium">Coefficient</span>
                                <div className="flex items-center">
                                  <Star className="w-4 h-4 text-yellow-500 mr-2" />
                                  <span className="font-bold text-lg text-gray-900 dark:text-white">
                                    {subject.coef}
                                  </span>
                                </div>
                              </div>
        
                              <div>
                                <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center">
                                  <Users className="w-4 h-4 mr-2" />
                                  Classes où enseignée
                                </p>
                                {classesForSubject.length > 0 ? (
                                  <div className="flex flex-wrap gap-2">
                                    {classesForSubject.map((classe) => (
                                      <span key={classe._id} className="px-3 py-1 rounded-full bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900 text-blue-700 dark:text-blue-300 text-xs font-semibold">
                                        {classe.nom}
                                      </span>
                                    ))}
                                  </div>
                                ) : (
                                  <span className="text-xs text-gray-400 italic">Aucune classe assignée</span>
                                )}
                              </div>
                            </div>
                          </>
                        ) : (
                          <>
                            <div className="flex items-center">
                              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${colors[colorIndex]} flex items-center justify-center mr-4`}>
                                <FontAwesomeIcon icon={faBook} className="text-white" />
                              </div>
                              <div>
                                <h3 className="text-lg font-bold text-gray-900 dark:text-white">{subject.nom}</h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                  Coef: {subject.coef} • {classesForSubject.length} classe{classesForSubject.length > 1 ? 's' : ''}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => {/* TODO: Implémenter l'édition */}}
                                className="p-2 text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900 rounded-lg transition-colors"
                              >
                                <FontAwesomeIcon icon={faEdit} />
                              </button>
                              <button
                                onClick={() => handleDeleteSubject(subject._id)}
                                className="p-2 text-red-600 hover:bg-red-100 dark:hover:bg-red-900 rounded-lg transition-colors"
                              >
                                <FontAwesomeIcon icon={faTrash} />
                              </button>
                            </div>
                          </>
                        )}
                      </div>
                    );
                  })}
                </div>
        
                {/* Modal d'ajout ultra-moderne */}
                {showAddModal && (
                  <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in">
                    <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl rounded-3xl shadow-2xl p-0 w-full max-w-lg mx-4 max-h-[90vh] overflow-hidden border border-gray-200/50 dark:border-gray-700/50 animate-scale-in">
                      {/* En-tête de la modal */}
                      <div className="relative bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 p-8 text-white">
                        <div className="absolute inset-0 bg-black/10"></div>
                        <div className="relative flex items-center gap-4">
                          <div className="p-4 bg-white/20 rounded-2xl backdrop-blur-sm">
                            <BookOpen className="w-8 h-8" />
                          </div>
                          <div>
                            <h2 className="text-3xl font-black mb-2">Nouvelle Matière</h2>
                            <p className="text-blue-100 text-lg">Créez une nouvelle matière pour votre école</p>
                          </div>
                        </div>
                        <button
                          onClick={() => setShowAddModal(false)}
                          className="absolute top-4 right-4 p-2 bg-white/20 hover:bg-white/30 rounded-xl transition-all duration-300"
                        >
                          <XCircle className="w-6 h-6" />
                        </button>
                      </div>
        
                      {/* Formulaire */}
                      <form onSubmit={e => { e.preventDefault(); handleAddSubject(); }} className="p-8 space-y-6">
                        <div className="space-y-2">
                          <label className="block text-sm font-bold text-gray-700 dark:text-gray-300">
                            Nom de la matière *
                          </label>
                          <div className="relative">
                            <input
                              type="text"
                              value={newSubject.nom}
                              onChange={(e) => setNewSubject({ ...newSubject, nom: e.target.value })}
                              className="w-full p-4 rounded-2xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white border-2 border-gray-200 dark:border-gray-600 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all duration-300 text-lg"
                              placeholder="Ex: Mathématiques, Français..."
                              required
                            />
                            <FontAwesomeIcon icon={faBook} className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                          </div>
                        </div>
        
                        <div className="space-y-2">
                          <label className="block text-sm font-bold text-gray-700 dark:text-gray-300">
                            Coefficient *
                          </label>
                          <div className="relative">
                            <input
                              type="number"
                              min="1"
                              max="10"
                              value={newSubject.coef}
                              onChange={(e) => setNewSubject({ ...newSubject, coef: parseInt(e.target.value) || 1 })}
                              className="w-full p-4 rounded-2xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white border-2 border-gray-200 dark:border-gray-600 focus:border-purple-500 focus:ring-4 focus:ring-purple-500/20 transition-all duration-300 text-lg"
                              placeholder="1-10"
                              required
                            />
                            <Star className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                          </div>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            Le coefficient détermine l'importance de cette matière dans le calcul des moyennes
                          </p>
                        </div>
        
                        {/* Boutons d'action */}
                        <div className="flex gap-4 pt-6">
                          <button 
                            type="button" 
                            onClick={() => setShowAddModal(false)} 
                            className="flex-1 flex items-center justify-center gap-3 px-6 py-4 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-2xl font-bold hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-300 transform hover:scale-105"
                          >
                            <XCircle className="w-5 h-5" />
                            Annuler
                          </button>
                          <button 
                            type="submit" 
                            disabled={loading}
                            className="flex-1 flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl font-bold shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:transform-none"
                          >
                            {loading ? (
                              <>
                                <FontAwesomeIcon icon={faSpinner} spin className="w-5 h-5" />
                                Création...
                              </>
                            ) : (
                              <>
                                <CheckCircle className="w-5 h-5" />
                                Créer la matière
                              </>
                            )}
                          </button>
                        </div>
        
                        {/* Message de succès */}
                        {successMsg && (
                          <div className="flex items-center gap-3 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-2xl text-green-700 dark:text-green-400 font-semibold animate-slide-up">
                            <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
                            {successMsg}
                          </div>
                        )}
                      </form>
                    </div>
                  </div>
                )}
              </div>
        </div>
  )
}

export default MatieresPage